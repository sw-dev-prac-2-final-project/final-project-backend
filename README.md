# StockMe - Inventory Management API

A comprehensive RESTful API for inventory management with user authentication and role-based authorization. Built with Node.js, Express.js, and MongoDB.

## 🚀 Features

### 1. Authentication System
- User registration and login with JWT tokens
- Password hashing using bcryptjs
- Role-based authorization (staff/admin)
- Protected routes with middleware

### 2. Core Entities
- **Users:** Registration, login, profile management. There are two types of user 'admin' and 'staff'.
- **Products:** CRUD operations for product (SKU) management to manage available product SKUs. 
- **Requests:** Inventory transaction requests linking Users to Products

### 3. Database Schema
- **User Model:** name, email, tel, password, role, timestamps
- **Product Model:** name, address, district, province, postalcode, tel, picture
- **Request Model:** transactionDate, transactionType (stockIn, stockOut), itemAmount, user reference, product reference

### 4. API Structure
- **Auth Routes (/api/v1/auth):** register, login, logout, get profile
- **Product Routes (/api/v1/products):** CRUD operations for products
- **Request Routes (/api/v1/requests):** CRUD operations for transaction requests (stock-in, stock-out)

### 5. Access Control / Controllers 
- After login, registered admin user can add/update/delete/view any product
- After login, registered staff user can issue request to stock-in any product at any amount The product list is provided to the user. Product information is also available. Registered staff user can request to stock-out any products at amount not more than 50.
- Registered staff user can view his/her own request history
- Registered staff user can edit his/her own request history
- Registered staff user can cancel his/her own request history
- Registered admin user can view any request history
- Registered admin user can edit any request history
- Registered admin user can cancel any request history

### 6. Security Features
- JWT-based authentication
- Rate limiting (100 requests per 10 minutes)
- Helmet for security headers
- XSS protection
- MongoDB injection protection
- CORS enabled

### 7. Documentation
- Swagger/OpenAPI documentation integrated
- Available at /api-docs endpoint

### 8. Technology Stack
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT, bcryptjs
- Security: helmet, xss-clean, express-rate-limit
- Documentation: Swagger UI

### 9. Development Setup
- Uses nodemon for development
- Environment variables in config/config.env
- MongoDB connection with mongoose

The project follows RESTful API conventions with proper middleware, error handling, and security measures. It's designed to handle inventory management with user authentication and role-based access control.


Vercel : 
final-project-backend-black.vercel.app
