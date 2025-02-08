const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "../../database/database.sqlite");

class ProductStore {
  constructor() {
    this.db = null;
  }

  async connect() {
    if (!this.db) {
      this.db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
      });
    }
  }

  async getUser(username) {
    return this.db.get("SELECT * FROM user WHERE username = ?", [username]);
  }

  async createUser(username, password) {
    return this.db.run("INSERT INTO user (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);
  }

  async insertItem(name, description) {
    return this.db.run("INSERT INTO items (name, description) VALUES (?, ?)", [
      name,
      description,
    ]);
  }
  
  async getAllItems() {
    return this.db.all("SELECT * FROM items");
  }
  
  async getItemById(id) {
    return this.db.get("SELECT * FROM items WHERE id = ?", [id]);
  }
  
  async updateItemById(name, description, id) {
    return this.db.run("UPDATE items SET name = ?, description = ? WHERE id = ?", [
      name,
      description,
      id,
    ]);
  }

  async deleteItemById(id){
    return this.db.run("DELETE FROM items WHERE id = ?", [id]);
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

const store = new ProductStore();

module.exports = { store };
