# Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. Get All Products
**Endpoint:** `GET /products`

**Description:** Retrieve a list of all products in the inventory, sorted by newest first.

**Request:**
```bash
curl http://localhost:3000/api/products
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "sku": "LP-001",
    "stock": 15,
    "createdAt": "2024-12-14T10:30:00Z",
    "updatedAt": "2024-12-14T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Mouse",
    "sku": "MS-001",
    "stock": 50,
    "createdAt": "2024-12-14T10:25:00Z",
    "updatedAt": "2024-12-14T10:25:00Z"
  }
]
```

---

### 2. Create a New Product
**Endpoint:** `POST /products`

**Description:** Create a new product with initial stock.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Laptop",
  "sku": "LP-001",
  "initialStock": 15
}
```

**Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "sku": "LP-001",
    "initialStock": 15
  }'
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Laptop",
  "sku": "LP-001",
  "stock": 15,
  "createdAt": "2024-12-14T10:30:00Z",
  "updatedAt": "2024-12-14T10:30:00Z"
}
```

**Error Responses:**
- **400 Bad Request** - Initial stock cannot be negative
```json
{
  "message": "Initial stock cannot be negative"
}
```

---

### 3. Get Product Summary
**Endpoint:** `GET /products/:id`

**Description:** Get detailed summary of a specific product including current stock and total increases/decreases.

**Parameters:**
- `id` (path) - MongoDB product ID

**Request:**
```bash
curl http://localhost:3000/api/products/507f1f77bcf86cd799439011
```

**Response (200 OK):**
```json
{
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "sku": "LP-001",
    "stock": 25,
    "createdAt": "2024-12-14T10:30:00Z",
    "updatedAt": "2024-12-14T10:35:00Z"
  },
  "currentStock": 25,
  "totalIncreased": 15,
  "totalDecreased": 5
}
```

**Error Responses:**
- **404 Not Found** - Product does not exist
```json
{
  "message": "Product not found"
}
```

---

### 4. Increase Stock
**Endpoint:** `POST /products/:id/increase`

**Description:** Increase the stock of a product and record a transaction.

**Parameters:**
- `id` (path) - MongoDB product ID

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 10
}
```

**Request:**
```bash
curl -X POST http://localhost:3000/api/products/507f1f77bcf86cd799439011/increase \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 10
  }'
```

**Response (200 OK):**
```json
{
  "stock": 35
}
```

**Error Responses:**
- **400 Bad Request** - Quantity must be greater than 0
```json
{
  "message": "Quantity must be greater than 0"
}
```
- **404 Not Found** - Product does not exist
```json
{
  "message": "Product not found"
}
```

---

### 5. Decrease Stock
**Endpoint:** `POST /products/:id/decrease`

**Description:** Decrease the stock of a product and record a transaction.

**Parameters:**
- `id` (path) - MongoDB product ID

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 5
}
```

**Request:**
```bash
curl -X POST http://localhost:3000/api/products/507f1f77bcf86cd799439011/decrease \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

**Response (200 OK):**
```json
{
  "stock": 30
}
```

**Error Responses:**
- **400 Bad Request** - Quantity must be greater than 0
```json
{
  "message": "Quantity must be greater than 0"
}
```
- **400 Bad Request** - Insufficient stock
```json
{
  "message": "Insufficient stock"
}
```
- **404 Not Found** - Product does not exist
```json
{
  "message": "Product not found"
}
```

---

### 6. Get Transaction History
**Endpoint:** `GET /products/:id/transactions`

**Description:** Get all transactions (increases/decreases) for a specific product, sorted by newest first.

**Parameters:**
- `id` (path) - MongoDB product ID

**Request:**
```bash
curl http://localhost:3000/api/products/507f1f77bcf86cd799439011/transactions
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "productId": "507f1f77bcf86cd799439011",
    "type": "INCREASE",
    "quantity": 10,
    "timestamp": "2024-12-14T10:35:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439022",
    "productId": "507f1f77bcf86cd799439011",
    "type": "DECREASE",
    "quantity": 5,
    "timestamp": "2024-12-14T10:32:00Z"
  }
]
```

---

## Data Models

### Product
```javascript
{
  _id: ObjectId,              // Auto-generated MongoDB ID
  name: String,               // Product name
  sku: String,                // Stock Keeping Unit (unique identifier)
  stock: Number,              // Current stock quantity
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

### Transaction
```javascript
{
  _id: ObjectId,              // Auto-generated MongoDB ID
  productId: ObjectId,        // Reference to Product
  type: String,               // "INCREASE" or "DECREASE"
  quantity: Number,           // Quantity changed
  timestamp: Date             // Transaction timestamp
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes
- **200 OK** - Successful GET request
- **201 Created** - Successful POST request that creates a resource
- **400 Bad Request** - Invalid input or business logic error
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

---

## Testing with cURL

### Create a product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","sku":"TST-001","initialStock":100}'
```

### Get all products
```bash
curl http://localhost:3000/api/products
```

### Get product summary
```bash
curl http://localhost:3000/api/products/{product_id}
```

### Increase stock
```bash
curl -X POST http://localhost:3000/api/products/{product_id}/increase \
  -H "Content-Type: application/json" \
  -d '{"quantity":10}'
```

### Decrease stock
```bash
curl -X POST http://localhost:3000/api/products/{product_id}/decrease \
  -H "Content-Type: application/json" \
  -d '{"quantity":5}'
```

### Get transactions
```bash
curl http://localhost:3000/api/products/{product_id}/transactions
```
