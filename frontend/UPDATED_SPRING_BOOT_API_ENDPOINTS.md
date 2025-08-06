# Complete Spring Boot API Endpoints for Agriculture E-commerce

## Base URL: `http://localhost:8080/api/v1`

## 🔐 Authentication Endpoints
```
POST /auth/register - User registration
POST /auth/login - User login  
POST /auth/refresh - Refresh JWT token
POST /auth/logout - User logout
```

**Request/Response Examples:**

### POST /auth/register
```json
// Request
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123",
  "phone": "+254712345678"
}

// Response
{
  "user": {
    "id": "1",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "phone": "+254712345678"
  },
  "token": "jwt-token-here"
}
```

### POST /auth/login
```json
// Request
{
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "id": "1",
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "jwt-token-here"
}
```

## 📦 Product Management Endpoints
```
GET /products - Get all products (with pagination & filtering)
GET /products/{id} - Get product by ID
POST /admin/products - Create new product (Admin only)
PUT /admin/products/{id} - Update product (Admin only)
DELETE /admin/products/{id} - Delete product (Admin only)
GET /categories - Get all categories
```

**Request/Response Examples:**

### GET /products?category=vegetables&page=0&size=10
```json
// Response
{
  "products": [
    {
      "id": "1",
      "name": "Managu (African Nightshade)",
      "description": "Fresh traditional African vegetable",
      "price": 50,
      "category": "vegetables",
      "unitType": "kg",
      "stock": 100,
      "image": "/images/managu.jpg",
      "isOrganic": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0,
  "size": 10
}
```

### POST /admin/products (multipart/form-data)
```
FormData:
- name: "Sukuma Wiki"
- description: "Fresh collard greens" 
- price: 40
- category: "vegetables"
- unitType: "kg"
- stock: 50
- isOrganic: true
- image: [file upload]
```

### GET /categories
```json
// Response
[
  {
    "id": "vegetables",
    "name": "Vegetables",
    "description": "Fresh African vegetables"
  },
  {
    "id": "fruits", 
    "name": "Fruits",
    "description": "Tropical fruits"
  },
  {
    "id": "cereals",
    "name": "Cereals", 
    "description": "Grains and cereals"
  },
  {
    "id": "farm-tools",
    "name": "Farm Tools",
    "description": "Agricultural tools and equipment"
  }
]
```

## 🛒 Cart Management Endpoints
```
GET /cart - Get user's cart
POST /cart/items - Add item to cart
PUT /cart/items/{productId} - Update cart item quantity
DELETE /cart/items/{productId} - Remove item from cart
DELETE /cart - Clear entire cart
```

**Request/Response Examples:**

### GET /cart
```json
// Response
{
  "id": "cart-1",
  "userId": "1",
  "items": [
    {
      "product": {
        "id": "1",
        "name": "Managu",
        "price": 50,
        "image": "/images/managu.jpg"
      },
      "quantity": 2
    }
  ],
  "totalItems": 2,
  "totalPrice": 100
}
```

### POST /cart/items
```json
// Request
{
  "productId": "1",
  "quantity": 2
}

// Response
{
  "message": "Item added to cart successfully"
}
```

## 📋 Order Management Endpoints
```
POST /orders - Create new order
GET /orders - Get user's orders (with pagination)
GET /orders/{id} - Get order details
PUT /admin/orders/{id}/status - Update order status (Admin only)
GET /admin/orders - Get all orders (Admin only)
```

**Request/Response Examples:**

### POST /orders
```json
// Request
{
  "customerInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com", 
    "phone": "+254712345678"
  },
  "deliveryInfo": {
    "address": "123 Main St",
    "city": "Nairobi",
    "county": "Nairobi",
    "postalCode": "00100",
    "deliveryNotes": "Call on arrival"
  },
  "paymentReference": "MPESA123456"
}

// Response
{
  "id": "ORD-123456",
  "items": [...],
  "customerInfo": {...},
  "deliveryInfo": {...},
  "subtotal": 300,
  "deliveryFee": 200,
  "total": 500,
  "status": "PENDING",
  "paymentReference": "MPESA123456",
  "orderDate": "2024-01-01T00:00:00Z"
}
```

### GET /orders
```json
// Response
{
  "orders": [
    {
      "id": "ORD-123456",
      "total": 500,
      "status": "PENDING",
      "orderDate": "2024-01-01T00:00:00Z",
      "itemCount": 3
    }
  ],
  "totalElements": 10,
  "totalPages": 2,
  "currentPage": 0
}
```

### PUT /admin/orders/{id}/status
```json
// Request
{
  "status": "CONFIRMED"
}

// Response
{
  "message": "Order status updated successfully"
}
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

## 💳 M-Pesa Payment Endpoints
```
POST /payments/mpesa/stk-push - Initiate M-Pesa payment
GET /payments/mpesa/status/{checkoutRequestId} - Check payment status
```

**Request/Response Examples:**

### POST /payments/mpesa/stk-push
```json
// Request
{
  "amount": 500,
  "phoneNumber": "254712345678",
  "accountReference": "ORDER-123456",
  "transactionDesc": "Payment for AI Alliance Agriculture order"
}

// Response
{
  "merchantRequestId": "29115-34620561-1",
  "checkoutRequestId": "ws_CO_191220191020363925",
  "responseCode": "0",
  "responseDescription": "Success. Request accepted for processing",
  "customerMessage": "Success. Request accepted for processing"
}
```

### GET /payments/mpesa/status/{checkoutRequestId}
```json
// Response
{
  "status": "SUCCESS", // SUCCESS, FAILED, PENDING
  "transactionId": "LHG31AA5TX",
  "amount": 500,
  "phoneNumber": "254712345678",
  "receiptNumber": "LHG31AA5TX"
}
```

## 📊 Admin Analytics Endpoints
```
GET /admin/analytics/stats - Get dashboard statistics
GET /admin/analytics/sales - Get sales data
GET /admin/analytics/products - Get product performance
```

### GET /admin/analytics/stats
```json
// Response
{
  "totalProducts": 45,
  "totalOrders": 120,
  "totalUsers": 85,
  "totalRevenue": 45000,
  "pendingOrders": 15,
  "lowStockProducts": 8
}
```

## 🔒 Security & Headers
All authenticated endpoints require:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

For file uploads:
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

## 🌾 NEW: Farmer Product Submission Endpoints
```
POST /farmer/products - Submit product for approval (Farmer only)
GET /farmer/products - Get farmer's own submissions (Farmer only)  
PUT /farmer/products/{id} - Update pending product (Farmer only)
DELETE /farmer/products/{id} - Delete pending product (Farmer only)
```

## 🔍 NEW: Admin Product Approval Endpoints  
```
GET /admin/products/pending - Get pending products (Admin only)
PUT /admin/products/{id}/approve - Approve product (Admin only)
PUT /admin/products/{id}/reject - Reject with reason (Admin only)
GET /admin/products/submissions - Get all submissions (Admin only)
```

## 📝 Order Status Values
- `PENDING` - Order placed, awaiting payment confirmation
- `CONFIRMED` - Payment confirmed, order being prepared  
- `PROCESSING` - Order being processed/packed
- `SHIPPED` - Order has been shipped
- `DELIVERED` - Order delivered to customer
- `CANCELLED` - Order cancelled

## 🏗️ Database Schema Suggestions

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit_type VARCHAR(50) DEFAULT 'kg',
    stock INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    is_organic BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    customer_first_name VARCHAR(100) NOT NULL,
    customer_last_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city VARCHAR(100) NOT NULL,
    delivery_county VARCHAR(100) NOT NULL,
    delivery_postal_code VARCHAR(20),
    delivery_notes TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_reference VARCHAR(255),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Cart Table
```sql
CREATE TABLE cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 🚀 Implementation Notes

1. **File Upload**: Use Spring Boot's `MultipartFile` for image uploads
2. **JWT Security**: Implement JWT authentication with role-based access
3. **M-Pesa Integration**: Use Safaricom's Daraja API
4. **Error Handling**: Return consistent error responses
5. **Validation**: Validate all input data
6. **Pagination**: Use Spring Data JPA pagination
7. **CORS**: Configure CORS for frontend integration
8. **Image Storage**: Store images in `/uploads` folder or cloud storage
9. **Database**: Use MySQL or PostgreSQL
10. **API Documentation**: Use Swagger/OpenAPI for documentation

This comprehensive API documentation covers all the endpoints needed for the agriculture e-commerce platform with proper authentication, role-based access, M-Pesa integration, and complete CRUD operations.