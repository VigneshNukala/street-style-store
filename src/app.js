const express = require("express");
const { initializeDatabase } = require("./config/database");
const { PORT, rateLimiter } = require("./config/server");

const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsroutes");

const app = express();

app.use(express.json());
app.use(rateLimiter);

const startServer = async () => {
  try {
    const db = await initializeDatabase();
    app.use("/api", authRoutes(db));
    app.use("/api", itemsRoutes(db));

    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
