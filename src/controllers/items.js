const { logAction } = require("../middlewares/loggingMiddleware");

const createItem = async (req, res, db) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and Description are required" });
  }

  try {
    console.log("hi");
    const result = await db.run(
      "INSERT INTO items (name, description) VALUES (?, ?)",
      [name, description]
    );
    console.log(result);
    const newItem = await db.get("SELECT * FROM items WHERE id = ?", [
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
};

const getAllItems = async (req, res, db) => {
  try {
    const items = await db.all("SELECT * FROM items");
    await logAction("Items Retrieved", {
      username: req.username,
      databaseTable: "items",
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getItemById = async (req, res, db) => {
  const { id } = req.params;

  try {
    const item = await db.get("SELECT * FROM items WHERE id = ?", [id]);

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
};

const updateItem = async (req, res, db) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const existingItem = await db.get("SELECT * FROM items WHERE id = ?", [id]);

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    await db.run("UPDATE items SET name = ?, description = ? WHERE id = ?", [
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
};

const deleteItem = async (req, res, db) => {
  const { id } = req.params;
  console.log(id);
  try {
    const existingItem = await db.run("SELECT * FROM items WHERE id = ?", [id]);
    console.log(id);

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    console.log(id);

    await db.run("DELETE FROM items WHERE id = ?", [id]);
    console.log(id);

    await logAction("Delete Item", {
      username: req.username,
      itemId: id,
      databaseTable: "items",
    });

    res.send(`Item with ID ${id} deleted successfully`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
