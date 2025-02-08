const express = require("express");
const itemsRouter = express.Router();
const { store } = require("../db/store.js");
const { authenticateToken } = require("../middlewares/authenticateMiddleware.js");
const { logAction } = require("../middlewares/loggingMiddleware.js");
const { handleError } = require("../utils");

// Create Item
itemsRouter.post("/items", authenticateToken, async (req, res) => {
  const {name, description} = req.body
  try {
    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Name and Description are required",
      });
    }
    
    const result = await store.insertItem(name, description);
    const newItem = await store.getItemById(result.lastID);
    console.log(5)

    await logAction("Item Created", { username: req.username, itemId: result.lastID, name });

    return res.status(201).json({ status: "success", message: "Item added successfully", newItem });
  } catch (error) {
    
    return handleError(res, error);
  }
});

// Get All Items
itemsRouter.get("/items", authenticateToken, async (req, res) => {
  try {
    const items = await store.getAllItems();
    await logAction("Items Retrieved", { username: req.username, databaseTable: "items" });
    return res.status(200).json({ status: "success", message: "Fetched all items", items });
  } catch (error) {
    return handleError(res, error);
  }
});

// Get Item by ID
itemsRouter.get("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await store.getItemById(id);
    if (!item) {
      return res.status(404).json({ status: "error", message: "Item not found" });
    }
    
    await logAction("Fetch Item", { username: req.username, itemId: id });
    return res.status(200).json({ status: "success", message: "Item fetched successfully", item });
  } catch (error) {
    return handleError(res, error);
  }
});

// Update Item
itemsRouter.put("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ status: "error", message: "Name and Description are required" });
    }

    const existingItem = await store.getItemById(id);
    if (!existingItem) {
      return res.status(404).json({ status: "error", message: "Item not found" });
    }

    await store.updateItemById(name, description, id);
    const updatedItem = await store.getItemById(id);

    await logAction("Update Item", { username: req.username, itemId: id });
    return res.status(200).json({ status: "success", message: "Item updated successfully", updatedItem });
  } catch (error) {
    return handleError(res, error);
  }
});

// Delete Item
itemsRouter.delete("/items/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existingItem = await store.getItemById(id);
    if (!existingItem) {
      return res.status(404).json({ status: "error", message: "Item not found" });
    }

    await store.deleteItemById(id);
    await logAction("Delete Item", { username: req.username, itemId: id });
    
    return res.status(200).json({ status: "success", message: "Item deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = itemsRouter;
