# Spring Boot Backend API Documentation
## AI Alliance Agriculture NGO E-commerce Platform

This document outlines the required API endpoints for the e-commerce frontend. Implement these endpoints in your Spring Boot backend.

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
- Use JWT tokens for authentication
- Include `Authorization: Bearer <token>` header for protected endpoints

---

## 1. Product Management

### GET /products
Get all products with optional filtering
```
Query Parameters:
- category (optional): string - Filter by category
- subcategory (optional): string - Filter by subcategory
- search (optional): string - Search by name or description
- page (optional): number - Page number (default: 0)
- size (optional): number - Page size (default: 20)

Response:
{
  "content": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": 150.00,
      "image": "string",
      "category": "string",
      "subcategory": "string",
      "stock": 50,
      "origin": "string",
      "nutritionalInfo": "string",
      "isOrganic": true,
      "unitType": "bunch"
    }
  ],
  "totalElements": 100,
  "totalPages": 5,
  "size": 20,
  "number": 0
}
```

### GET /products/{id}
Get product by ID
```
Response:
{
  "id": "string",
  "name": "string",
  "description": "string",
  "price": 150.00,
  "image": "string",
  "category": "string",
  "subcategory": "string",
  "stock": 50,
  "origin": "string",
  "nutritionalInfo": "string",
  "isOrganic": true,
  "unitType": "bunch"
}
```

### GET /categories
Get all product categories
```
Response:
[
  {
    "id": "string",
    "name": "string",
    "subcategories": [
      {
        "id": "string",
        "name": "string"
      }
    ]
  }
]
```

---

## 2. Cart Management

### GET /cart
Get current user's cart (Protected)
```
Response:
{
  "items": [
    {
      "product": {
        "id": "string",
        "name": "string",
        "price": 150.00,
        "image": "string",
        "unitType": "bunch"
      },
      "quantity": 2
    }
  ],
  "totalPrice": 300.00,
  "totalItems": 2
}
```

### POST /cart/items
Add item to cart (Protected)
```
Request Body:
{
  "productId": "string",
  "quantity": 2
}

Response:
{
  "message": "Item added to cart",
  "cart": { /* cart object */ }
}
```

### PUT /cart/items/{productId}
Update item quantity in cart (Protected)
```
Request Body:
{
  "quantity": 3
}

Response:
{
  "message": "Cart updated",
  "cart": { /* cart object */ }
}
```

### DELETE /cart/items/{productId}
Remove item from cart (Protected)
```
Response:
{
  "message": "Item removed from cart",
  "cart": { /* cart object */ }
}
```

### DELETE /cart
Clear entire cart (Protected)
```
Response:
{
  "message": "Cart cleared"
}
```

---

## 3. Order Management

### POST /orders
Create new order (Protected)
```
Request Body:
{
  "items": [
    {
      "productId": "string",
      "quantity": 2,
      "price": 150.00
    }
  ],
  "customerInfo": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  },
  "deliveryInfo": {
    "address": "string",
    "city": "string",
    "county": "string",
    "postalCode": "string",
    "deliveryNotes": "string"
  },
  "paymentMethod": "COD"
}

Response:
{
  "id": "string",
  "orderNumber": "ORD-123456",
  "status": "PENDING",
  "items": [ /* order items */ ],
  "customerInfo": { /* customer info */ },
  "deliveryInfo": { /* delivery info */ },
  "subtotal": 300.00,
  "deliveryFee": 200.00,
  "total": 500.00,
  "orderDate": "2024-01-15T10:30:00Z",
  "estimatedDelivery": "2024-01-17T10:30:00Z"
}
```

### GET /orders
Get user's orders (Protected)
```
Query Parameters:
- page (optional): number - Page number (default: 0)
- size (optional): number - Page size (default: 10)
- status (optional): string - Filter by status

Response:
{
  "content": [
    {
      "id": "string",
      "orderNumber": "string",
      "status": "string",
      "total": 500.00,
      "orderDate": "2024-01-15T10:30:00Z",
      "itemCount": 3
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "size": 10,
  "number": 0
}
```

### GET /orders/{id}
Get order by ID (Protected)
```
Response:
{
  "id": "string",
  "orderNumber": "string",
  "status": "string",
  "items": [
    {
      "product": { /* product details */ },
      "quantity": 2,
      "price": 150.00,
      "total": 300.00
    }
  ],
  "customerInfo": { /* customer info */ },
  "deliveryInfo": { /* delivery info */ },
  "subtotal": 300.00,
  "deliveryFee": 200.00,
  "total": 500.00,
  "orderDate": "2024-01-15T10:30:00Z",
  "estimatedDelivery": "2024-01-17T10:30:00Z",
  "paymentStatus": "PENDING"
}
```

### PUT /orders/{id}/status
Update order status (Admin only)
```
Request Body:
{
  "status": "PROCESSING" // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}

Response:
{
  "message": "Order status updated",
  "order": { /* order object */ }
}
```

---

## 4. User Management

### POST /auth/register
Register new user
```
Request Body:
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}

Response:
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "token": "string"
}
```

### POST /auth/login
User login
```
Request Body:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "message": "Login successful",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  },
  "token": "string"
}
```

### GET /users/profile
Get user profile (Protected)
```
Response:
{
  "id": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "addresses": [
    {
      "id": "string",
      "address": "string",
      "city": "string",
      "county": "string",
      "postalCode": "string",
      "isDefault": true
    }
  ]
}
```

### PUT /users/profile
Update user profile (Protected)
```
Request Body:
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string"
}

Response:
{
  "message": "Profile updated successfully",
  "user": { /* user object */ }
}
```

---

## 5. Address Management

### GET /addresses
Get user addresses (Protected)
```
Response:
[
  {
    "id": "string",
    "address": "string",
    "city": "string",
    "county": "string",
    "postalCode": "string",
    "isDefault": true
  }
]
```

### POST /addresses
Add new address (Protected)
```
Request Body:
{
  "address": "string",
  "city": "string",
  "county": "string",
  "postalCode": "string",
  "isDefault": false
}

Response:
{
  "message": "Address added successfully",
  "address": { /* address object */ }
}
```

---

## 6. Admin Endpoints

### GET /admin/orders
Get all orders (Admin only)
```
Query Parameters:
- page, size, status (same as user orders)
- customerId (optional): Filter by customer

Response: Same as GET /orders but includes all users' orders
```

### GET /admin/products
Get all products for admin (Admin only)
```
Response: Same as GET /products but includes additional admin fields
```

### POST /admin/products
Create new product (Admin only)
```
Request Body: Product object

Response:
{
  "message": "Product created successfully",
  "product": { /* product object */ }
}
```

### PUT /admin/products/{id}
Update product (Admin only)
```
Request Body: Product object

Response:
{
  "message": "Product updated successfully",
  "product": { /* product object */ }
}
```

---

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

```
400 Bad Request:
{
  "error": "Bad Request",
  "message": "Validation failed",
  "details": ["Field 'email' is required"]
}

401 Unauthorized:
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}

403 Forbidden:
{
  "error": "Forbidden",
  "message": "Insufficient privileges"
}

404 Not Found:
{
  "error": "Not Found",
  "message": "Resource not found"
}

500 Internal Server Error:
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Database Schema Suggestions

### Products Table
```sql
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    stock INTEGER DEFAULT 0,
    origin VARCHAR(100),
    nutritional_info TEXT,
    is_organic BOOLEAN DEFAULT false,
    unit_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    customer_first_name VARCHAR(100),
    customer_last_name VARCHAR(100),
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_county VARCHAR(100),
    delivery_postal_code VARCHAR(20),
    delivery_notes TEXT,
    subtotal DECIMAL(10,2),
    delivery_fee DECIMAL(10,2),
    total DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'PENDING',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_delivery TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id VARCHAR(255) PRIMARY KEY,
    order_id VARCHAR(255),
    product_id VARCHAR(255),
    quantity INTEGER,
    price DECIMAL(10,2),
    total DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## Notes for Implementation

1. **CORS Configuration**: Enable CORS for your frontend domain
2. **Validation**: Implement request validation using Bean Validation
3. **Security**: Use Spring Security with JWT authentication
4. **Pagination**: Use Spring Data's Pageable for paginated endpoints
5. **Exception Handling**: Implement global exception handling
6. **Logging**: Add appropriate logging for debugging and monitoring
7. **File Upload**: Consider implementing file upload for product images
8. **Email Service**: Implement email notifications for order confirmations
9. **Inventory Management**: Implement stock checking and updates
10. **Payment Integration**: Consider integrating with payment providers like M-Pesa

This frontend is designed to work seamlessly with these API endpoints. The frontend handles all UI/UX aspects while your Spring Boot backend will handle the business logic, data persistence, and API responses.