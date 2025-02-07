const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authentication");

module.exports = (db) => {
  router.post("/register", (req, res) => register(req, res, db));
  router.post("/login", (req, res) => login(req, res, db));

  return router;
};
