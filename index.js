const express = require("express");

const rateLimit = require("express-rate-limit");

const fs = require("fs").promises;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

// Rate Limit Rule
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true, // Send rate limit info in headers
});

const app = express();
app.use(express.json());
app.use(limiter);

const path = require("path");
const dbPath = path.join(__dirname, "database.db");
const logFilePath = path.join(__dirname, "logs.json");
// console.log(logFilePath)
const SECRET_KEY = "SECRET";

let db = null;

// Initialize Database and Server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.run(`CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
  }
};

initializeDBAndServer();

// Function to log actions asynchronously
const logAction = async (action, data) => {
  try {
    let logs = [];
    try {
      const logContent = await fs.readFile(logFilePath, "utf8");
      logs = JSON.parse(logContent);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    logs.push({ ...data, timestamp: new Date().toISOString(), action });
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error("Error logging action:", error.message);
  }
};

// User registration
app.post("/api/register/", async (req, res) => {
  const { username, password } = req.body;
  const checkUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const dbUser = await db.get(checkUserQuery);

  // Checking if user already exists
  if (dbUser) {
    res.status(400).send("User already exists");
  } else {
    if (password.length < 6) {
      res.status(400).send("Password is too short");
    } else {
      // Hashing password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      const insertQuery = `INSERT INTO user (username,password) VALUES('${username}','${hashedPassword}');`;
      await db.run(insertQuery);

      await logAction("User Registered", { username, databaseTable: "user" });
      res.status(200).send("User created successfully");
    }
  }
});

// User login
app.post("/api/login/", async (req, res) => {
  const { username, password } = req.body;
  const checkUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const dbUser = await db.get(checkUserQuery);

  // Checking if user exist or not
  if (dbUser === undefined) {
    res.status(400).send("Invalid user");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = {
        username: username,
      };

      const jwtToken = jwt.sign(payload, SECRET_KEY);
      await logAction("User Logged In", {
        id: dbUser.id,
        username,
        jwtToken,
        databaseTable: "user",
      });
      res.send({ jwtToken });
    } else {
      res.status(400).send("Invalid password");
    }
  }
});

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    res.status(401).send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, SECRET_KEY, async (error, payload) => {
      if (error) {
        res.status(401);
        res.send("Invalid JWT Token");
      } else {
        req.username = payload.username;
        req.token = payload.jwtToken;
        next();
      }
    });
  }
};

// POST - Create a New Item
app.post("/api/items", authenticateToken, async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and Description are required" });
  }

  try {
    const result = await db.run(
      `INSERT INTO items (name, description) VALUES (?, ?)`,
      [name, description]
    );
    const newItem = await db.get(`SELECT * FROM items WHERE id = ?`, [
      result.lastID,
    ]);

    await logAction("Item Created", {
      username: req.username,
      itemId: result.lastID,
      name,
      databaseTable: "items",
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Retrive all Items
app.get("/api/items", authenticateToken, async (req, res) => {
  try {
    const items = await db.all(`SELECT * FROM items`);
    await logAction("Item Created", {
      username: req.username,
      databaseTable: "items",
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Retrive specific Item
app.get("/api/items/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const item = await db.get(`SELECT * FROM items WHERE id = ?`, [id]);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    await logAction("Fetch Item", {
      username: req.username,
      itemId: id,
      databaseTable: "items",
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update specific Item
app.put("/api/items/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const existingItem = await db.get(`SELECT * FROM items WHERE id = ?`, [id]);
    if (!existingItem) return res.status(404).json({ error: "Item not found" });

    await db.run(`UPDATE items SET name = ?, description = ? WHERE id = ?`, [
      name,
      description,
      id,
    ]);
    await logAction("Update Item", {
      username: req.username,
      itemId: id,
      name,
      description,
      databaseTable: "items",
    });
    res.json({ id, name, description, message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remove specific Item
app.delete("/api/items/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const existingItem = await db.get(`SELECT * FROM items WHERE id = ?`, [id]);
    if (!existingItem) return res.status(404).json({ error: "Item not found" });

    await db.run(`DELETE FROM items WHERE id = ?`, [id]);
    await logAction("Delete Item", {
      username: req.username,
      itemId: id,
      databaseTable: "items",
    });
    res.json({ message: `Item with ID ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
