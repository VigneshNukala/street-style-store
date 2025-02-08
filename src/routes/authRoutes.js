const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { store } = require("../db/store.js");
const { logAction } = require("../middlewares/loggingMiddleware.js");
const { validatePassword } = require("../utils");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        status: "error",
        message: "Username and password are required.",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        status: "error",
        message:
          "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.",
      });
    }

    const existingUser = await store.getUser(username);
    if (existingUser) {
      return res
        .status(409)
        .json({ status: "error", message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await store.createUser(username, hashedPassword);

    await logAction("SIGN UP", { username, databaseTable: "user" });

    return res
      .status(201)
      .json({ status: "success", message: "User registered successfully." });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error. Please try again later.",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username and password are required.",
    });
  }
  
  try {
    console.log(2)
    const user = await store.getUser(username);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User doesn't exist",
      });
    }
    console.log(3)

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).send("Invalid password");
    }
    const jwtToken = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: "1h" });

    // res.cookie("token", token, {
    //   httpOnly: true,  
    //   secure: true,
    //   sameSite: "Strict",
    // });

    await logAction("SIGN IN", {
      username,
      jwtToken,
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful.",
      token: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error. Please try again later.",
    });
  }
});

module.exports = authRouter;
