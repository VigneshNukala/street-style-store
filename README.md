# **Street Style Store Assignment** 


## **Deployment Link:**
https://street-style-store-khn0.onrender.com

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
npm start  # or yarn start
```

## **API Documentation**

### **Authentication**

#### - **REGISTER :**

```
POST /api/register
```

- **Description :** Creats a new user.
- **Request Body :**
```
{
  "username": "user123",
  "password": "password123"
}
```

- **Response :**
```
{
  "user created Successfully"
}
```

#### - **LOGIN :**

```
POST /api/login
```

- **Description :** Logs in a user.
- **Request Body :**
```
{
  "username": "user123",
  "password": "password123"
}
```

- **Response :**
```
{
  "token": "your_jwt_token"
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
  "name": "xbox",
  "description": "This is video game console of Microsoft"
}
```

- **Response :**
```
{
  "Added new item successfully"
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
[
  {
    id : 1,
    name : XBOX,
    description : This is video game console of Microsoft,
    created_at : 
  },
  ...
]
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
  id : 1,
  name : XBOX,
  description : This is video game console of Microsoft,
  created_at : 
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
  id : 1,
  name : PS5,
  description : "This is video game console of Sony",
  created_at : 
}
```

#### - **UPDATES A SPECIFIC ITEM :**

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
 item with ID : 1 successfully deleted
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
