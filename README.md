# **Street Style Store Assignment** 


## **Deployment Link:**
https://street-style-store-t1t7.onrender.com

## **Description**

Backend Assignment to implement CRUD operations and QAuth with node, express and sqlite.

## **Prerequisites**

Ensure you have the following dependencies installed:

- **Node.js** (v16 or higher)
- **npm or yarn** (package manager)
- **SQLite** (for database)

## **Installation**

Follow these steps to set up your development environment:

### **1. Clone the repository:**  

```bash
git clone https://github.com/VigneshNukala/street-style-store.git
cd street-style-store
```

### **2. Install dependencies:**

Navigate to the src directory and run npm install (or yarn install).

```bash
cd src
npm install  # or yarn install
```

### **3. Start the application:**

```bash
node index.js  # or yarn start
```

## **Evaluation using Postman**
Ensure you follow below steps:

- Download and install postman from a web browser
- Signup and Login with your account
- Check each and every endipoints mentioned in below

## **API Documentation**

### **Authentication**

#### - **REGISTER :**

```
POST /auth/register
```

- **Description :** Creats a new user.
- **Request Body :**
```
{
  "username" : "Spiderman27",
  "password" : "Password@27"
}
```

- **Response :**
```
{
  "status": "success",
  "message": "User registered successfully."
}
```

#### - **LOGIN :**

```
POST /auth/login
```

- **Description :** Logs in a user.
- **Request Body :**
```
{
  "username" : "Spiderman27",
  "password" : "Password@27"
}
```

- **Response :**
```
{
  "status": "success",
  "message": "Login successful.",
  "token": <token>
}
```


### **Items Routes**

#### - **INSERT NEW ITEMS :**

```
POST /api/items
```

- **Description :**  Creates and inserts a new item into the databse.

- **Authorization :**
```
Authorization: Bearer <token>
```

- **Request Body :**
```
{
  "name" : "Xbox",
  "description" : "This is a microsoft gaming console"
}
```

- **Response :**
```
{
  "status": "success",
  "message": "Item added successfully",
  "newItem": {
    "id": 29,
    "name": "Xbox",
    "description": "This is a microsoft gaming console",
    "created_at": "2025-02-08 13:55:50"
  }
}
```

#### - **RETRIVE ALL ITEMS :**

```
GET /api/items
```

- **Description :**  Fetches all items from the database.

- **Authorization :**
```
Authorization: Bearer <token>
```

- **Response :**
```
{
  "status": "success",
  "message": "Fetched all items",
  "items": [
    {
      "id": 2,
      "name": "Vignesh",
      "description": "I am an Engineering Gradudate",
      "created_at": "2025-02-07 06:35:44"
    },
    {
      "id": 5,
      "name": "Gaming",
      "description": "PS5",
      "created_at": "2025-02-07 08:09:40"
    },
    ...
  ]
}
```

#### - **RETRIVE A SPECIFIC ITEM :**

```
GET /api/items/:id
```

- **Description :**  retrieve a specific item by its ID from the database.

- **Authorization :**
```
Authorization: Bearer <token>
```

- **Response :**
```
{
  "status": "success",
  "message": "Item fetched successfully",
  "item": {
    "id": 29,
    "name": "Xbox",
    "description": "This is a microsoft gaming console",
    "created_at": "2025-02-08 13:55:50"
  }
}
```

#### - **UPDATES A SPECIFIC ITEM :**

```
PUT /api/items/:id
```

- **Description :**  updates a specific item by its ID.

- **Authorization :**
```
Authorization: Bearer <token>
```

- **Request Body :**
```
{
  "name": "PS5",
  "description": "This is video game console of Sony"
}
```

- **Response :**
```
{
  id : 30,
  name : PS5,
  description : "This is video game console of Sony",
  created_at : 
}
```

#### - **DELETE A SPECIFIC ITEM :**

```
DELETE /api/items/:id
```

- **Description :**  delete a specific item by its ID.

- **Authorization :**
```
Authorization: Bearer <token>
```

- **Response :**
```
{
  "status": "success",
  "message": "Item deleted successfully"
}
```

## **Database Schema**

### **Users Table**

| Column Name   | Data Type     | 
| ------------- | ------------- | 
| id            | Interger      |
| username      | TEXT          |
| password      | TEXT          |

### **Items Table**

| Column Name   | Data Type     |
| ------------- | ------------- | 
| id            | Interger      |
| name          | TEXT          |
| description   | TEXT          |
| created_at    | TIMESTAMP     |


## **Assumptions & Design Decisions**

- **Authentication :**   Uses JWT-based authentication.

- **Database :**   SQLite for local development, with an option to switch to PostgreSQL/MySQL.

- **Security :**   Rate limiting implemented to prevent abuse.

- **Error Handling :**   Standardized error responses for better API consistency.
