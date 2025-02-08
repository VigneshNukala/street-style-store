const express = require("express");
const cookieParser = require("cookie-parser");
const { PORT, rateLimiter } = require("./config/server");
const { store } = require("./db/store.js");
const authenticateRouter = require("./routes/authRoutes");
const itemsRouter = require("./routes/itemRoutes.js");
const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(cookieParser());

const startServer = async () => {
  try {
    await store.connect();
    app.use("/auth", authenticateRouter);
    app.use("/api", itemsRouter);
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
