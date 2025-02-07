const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/server");
const { logAction } = require("../middlewares/loggingMiddleware");

const register = async (req, res, db) => {
  const { username, password } = req.body;

  try {
    const dbUser = await db.get("SELECT * FROM user WHERE username = ?", [
      username,
    ]);

    if (dbUser) {
      return res.status(400).send("User already exists");
    }

    if (password.length < 6) {
      return res.status(400).send("Password is too short");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run("INSERT INTO user (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);

    await logAction("User Registered", { username, databaseTable: "user" });
    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res, db) => {
  const { username, password } = req.body;

  try {
    const dbUser = await db.get("SELECT * FROM user WHERE username = ?", [
      username,
    ]);

    if (!dbUser) {
      return res.status(400).send("Invalid user");
    }

    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);

    if (!isPasswordMatched) {
      return res.status(400).send("Invalid password");
    }

    const jwtToken = jwt.sign({ username }, SECRET_KEY);

    await logAction("User Logged In", {
      id: dbUser.id,
      username,
      jwtToken,
      databaseTable: "user",
    });

    res.json({ jwtToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
