const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authenticateMiddleware");
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/items");

module.exports = (db) => {
  router.use(authenticateToken);
  router.post("/items", (req, res) => createItem(req, res, db));
  router.get("/items", (req, res) => getAllItems(req, res, db));
  router.get("/items/:id", (req, res) => getItemById(req, res, db));
  router.put("/items/:id", (req, res) => updateItem(req, res, db));
  router.delete("/items/:id", (req, res) => deleteItem(req, res, db));

  return router;
};
