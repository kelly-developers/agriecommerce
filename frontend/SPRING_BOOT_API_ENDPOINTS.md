# Spring Boot API Endpoints for Agriculture E-commerce

## Base URL: `http://localhost:8080/api/v1`

## 🔐 Authentication Endpoints
```
POST /auth/register - User registration
POST /auth/login - User login
POST /auth/refresh - Refresh JWT token
POST /auth/logout - User logout
```

## 📦 Product Management Endpoints
```
GET /products - Get all products (with pagination & filtering)
GET /products/{id} - Get product by ID
POST /admin/products - Create new product (Admin only)
PUT /admin/products/{id} - Update product (Admin only)
DELETE /admin/products/{id} - Delete product (Admin only)
GET /categories - Get all categories with subcategories
```

## 🛒 Cart Management Endpoints
```
GET /cart - Get user's cart
POST /cart/items - Add item to cart
PUT /cart/items/{productId} - Update cart item quantity
DELETE /cart/items/{productId} - Remove item from cart
DELETE /cart - Clear entire cart
```

## 📋 Order Management Endpoints
```
POST /orders - Create new order
GET /orders - Get user's orders (with pagination)
GET /orders/{id} - Get order details
PUT /admin/orders/{id}/status - Update order status (Admin only)
GET /admin/orders - Get all orders (Admin only)
```

## 👥 User Management Endpoints
```
GET /users/profile - Get user profile
PUT /users/profile - Update user profile
GET /admin/users - Get all users (Admin only)
PUT /admin/users/{id}/status - Update user status (Admin only)
```

## 📍 Address Management Endpoints
```
GET /addresses - Get user addresses
POST /addresses - Add new address
PUT /addresses/{id} - Update address
DELETE /addresses/{id} - Delete address
```

All endpoints return JSON and use JWT authentication where marked as protected.