IntelliPOS - Complete Documentation
📌 Table of Contents
Introduction

What is IntelliPOS?

Key Features

System Architecture

Modules Explained

Technology Stack

Installation Guide

User Guide

AI Assistant Guide

Database Schema

API Reference

Troubleshooting

FAQ

Development Guide

Contributing

License

1. Introduction
IntelliPOS is a comprehensive, AI-powered Enterprise Resource Planning system designed to streamline business operations for small to medium-sized enterprises. It combines traditional ERP functionalities with cutting-edge artificial intelligence to provide an intuitive, efficient, and intelligent business management solution.

Why IntelliPOS?
In today's fast-paced business environment, managing multiple aspects of a business - from inventory and customer relationships to employee management and financial tracking - can be overwhelming. IntelliPOS solves this by providing:

All-in-One Solution: No need for multiple disconnected systems

AI-Powered Assistance: Natural language interaction with your business data

Real-time Insights: Up-to-the-minute business analytics

User-Friendly Interface: Modern, intuitive design

Scalable Architecture: Grows with your business

Cost-Effective: Open-source, free to use and modify

2. What is IntelliPOS?
Core Concept
IntelliPOS is a web-based application that centralizes all your business operations into a single, unified platform. It's built with modern technologies and features an intelligent AI assistant that understands natural language, making business management accessible to everyone - not just tech-savvy users.

The AI Difference
What sets IntelliPOS apart is its AI Assistant. Instead of navigating complex menus and forms, you can simply ask questions or give commands in plain English:

"How many products do I have?" → Get instant product count

"Add Wireless Mouse price 500 stock 20" → Create new product instantly

"Add 12 to stock in Keyboard" → Update inventory

"Show me low stock products" → Get restock alerts

"What's my revenue?" → View sales revenue

Target Audience
User Type	How They Use It
Business Owners	Monitor performance, make decisions
Managers	Oversee operations, manage teams
Employees	Process orders, manage inventory
Customers	Browse products, place orders
Accountants	Track finances, generate reports
3. Key Features
🤖 AI-Powered Assistant
Natural language understanding with spell correction

Real-time database queries and updates

Multi-step actions with field collection

Conversational interface with context awareness

Business intelligence and analytics

📦 Inventory Management
Complete product catalog with images

Real-time stock tracking

Low-stock alerts and notifications

Supplier/Vendor management

Bulk product operations (add, update, delete)

Category organization

Inventory movement tracking

👥 Customer Management (CRM)
Complete customer profiles

Purchase history tracking

Order history and analytics

Customer segmentation

Email and contact management

Total spending analytics

👔 Employee Management
Team member profiles

Role-based access control (Admin, Employee, Customer)

Department management

Performance tracking

Employee records and history

💰 Sales & Billing (POS)
Point of Sale (POS) system

Invoice generation and management

Multiple payment methods (Cash, Card, Bank Transfer)

Payment processing and tracking

Refund and exchange processing

Sales analytics and reporting

📊 Business Intelligence
Real-time dashboard

Revenue analytics

Sales trends and forecasts

Low-stock alerts

Activity logging

Performance metrics

Custom reports

🛒 Customer Shop
Product browsing and search

Advanced filtering (category, price, rating)

Shopping cart functionality

Secure checkout process

Order placement and tracking

Customer profiles and order history

Wishlist functionality

🔐 Security & Access Control
JWT-based authentication

Role-based access control

Password hashing with bcrypt

CORS protection

Input validation

Secure API endpoints

4. System Architecture
High-Level Architecture
text
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Customer   │  │   Manager    │  │   Employee   │           │
│  │     Shop     │  │    Panel     │  │    Portal    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Next.js Application                       │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │  Routes  │ │  Hooks   │ │  Store   │ │  UI Kit  │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                  │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    API Routes (Next.js)                     │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │  Auth    │ │  Cart    │ │  Orders  │ │Products │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │Customer  │ │  Vendor  │ │Employee  │ │Inventory │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         AI SERVICE LAYER                           │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Python FastAPI                            │ │
│  │  ┌────────────────────────────────────────────────────────┐ │ │
│  │  │                   AI Agent                             │ │ │
│  │  │  • Natural Language Processing                       │ │ │
│  │  │  • Intent Detection                                  │ │ │
│  │  │  • Data Query & Update                               │ │ │
│  │  │  • Multi-step Actions                                │ │ │
│  │  │  • Context Management                                │ │ │
│  │  └────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                             │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    MongoDB Database                          │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │  Users   │ │Products  │ │  Orders  │ │Customers│      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │  Vendor  │ │Employees │ │Inventory │ │  Cart   │      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │ │
│  │  │ Refunds  │ │Categories│ │Activity  │                    │ │
│  │  └──────────┘ └──────────┘ └──────────┘                    │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
Data Flow
User Interaction: User interacts with the Next.js frontend

API Call: Frontend calls Next.js API routes

AI Processing: For AI requests, Next.js API calls Python FastAPI service

Database Query: Both services query MongoDB database

Response: Data flows back through the chain to the user

5. Modules Explained
5.1 AI Assistant Module
The AI Assistant is the heart of IntelliPOS's intelligence. It uses a custom rule-based natural language processing engine to understand user queries and perform actions.

How It Works:

User Input: User types a question or command

Spell Correction: AI corrects spelling errors

Intent Detection: AI identifies what the user wants to do

Action Execution: AI performs the requested action (query, update, create)

Response: AI returns a natural language response

Supported Actions:

Action Type	Example	What It Does
Query	"How many products?"	Returns count
List	"Show me products"	Lists items
Create	"Add product:..."	Creates record
Update	"Add 5 to stock in..."	Updates inventory
Delete	"Delete product:..."	Removes record
AI Capabilities:

✅ Natural language understanding

✅ Spelling error correction

✅ Context-aware conversations

✅ Multi-step actions

✅ Field collection and validation

✅ Real-time database integration

5.2 Inventory Module
The Inventory Module allows you to manage your product catalog, track stock levels, and monitor inventory movements.

Key Features:

Product Management: Add, edit, delete products

Stock Tracking: Real-time stock levels

Low Stock Alerts: Automatic notifications for low stock

Supplier Management: Manage vendors and suppliers

Category Management: Organize products by category

Inventory Movements: Track all stock changes

Product Fields:

Field	Type	Required	Description
Name	String	Yes	Product name
SKU	String	Yes	Stock Keeping Unit
Category	String	No	Product category
Brand	String	No	Manufacturer brand
Selling Price	Number	Yes	Retail price
Purchase Price	Number	No	Cost price
Stock	Number	Yes	Current quantity
Min Stock	Number	Yes	Reorder level
Unit	String	No	Unit of measurement
Description	Text	No	Product description
Image	URL	No	Product image
Tags	Array	No	Search tags
Status	Enum	Yes	Active/Inactive
5.3 Customer Module
The Customer Module provides complete customer relationship management (CRM) capabilities.

Key Features:

Customer Profiles: Complete contact information

Purchase History: Track all orders

Order Analytics: View customer buying patterns

Customer Segmentation: Group customers by behavior

Contact Management: Email, phone, address

Customer Fields:

Field	Type	Required	Description
Name	String	Yes	Customer name
Email	String	Yes	Unique email address
Phone	String	Yes	Contact number
Address	String	No	Physical address
Total Purchases	Number	Auto	Lifetime spend
Status	Enum	Yes	Active/Inactive
5.4 Employee Module
The Employee Module manages your team members and their access levels.

Key Features:

Employee Profiles: Personal and professional info

Role Management: Admin, Employee, Customer roles

Department Management: Organize by department

Access Control: Granular permissions

Performance Tracking: Monitor employee performance

Employee Fields:

Field	Type	Required	Description
Name	String	Yes	Full name
Email	String	Yes	Work email
Phone	String	Yes	Contact number
Role	String	Yes	Admin/Employee/Customer
Department	String	Yes	Department name
Salary	Number	No	Annual salary
Status	Enum	Yes	Active/Inactive
5.5 Sales Module (POS)
The Sales Module handles all billing and sales operations.

Key Features:

Point of Sale: Quick checkout interface

Invoice Generation: Professional invoices

Payment Processing: Multiple payment methods

Refund Management: Process refunds and exchanges

Sales Analytics: Track sales performance

Invoice Fields:

Field	Type	Description
Number	String	Unique invoice number
Customer	Object	Customer information
Items	Array	Products in order
Subtotal	Number	Total before tax
Tax	Number	Applicable tax
Total	Number	Final total
Payment Method	String	Cash/Card/Bank
Status	Enum	Paid/Pending/Failed
5.6 Orders Module
The Orders Module manages customer orders from creation to delivery.

Order Statuses:

Status	Description
Pending	Order received, awaiting processing
Processing	Order being prepared
Shipped	Order has been shipped
Delivered	Order has been delivered
Cancelled	Order was cancelled
Order Features:

✅ Order tracking

✅ Status updates

✅ Customer notifications

✅ Shipping information

✅ Order history

5.7 Customer Shop
The Customer Shop allows customers to browse products and place orders.

Features:

✅ Product catalog browsing

✅ Advanced search and filtering

✅ Shopping cart

✅ Secure checkout

✅ Order tracking

✅ Customer profile

6. Technology Stack
Frontend Stack
Technology	Version	Purpose
Next.js	16.2.12	React framework with App Router
React	18.x	UI library
TypeScript	5.x	Type-safe JavaScript
Tailwind CSS	3.x	Utility-first CSS
Shadcn/ui	Latest	Reusable UI components
Zustand	Latest	State management
Recharts	Latest	Charting library
Backend Stack
Technology	Version	Purpose
Next.js API Routes	16.x	Serverless API endpoints
MongoDB	6.x	NoSQL database
Mongoose	Latest	ODM for MongoDB
FastAPI	0.104.1	Python API framework
Uvicorn	0.24.0	ASGI server
AI Stack
Technology	Version	Purpose
Python	3.14	AI service language
FastAPI	Latest	AI API framework
Custom NLP	-	Natural language processing
Pattern Matching	-	Intent detection
Development Tools
Tool	Purpose
VS Code	IDE
ESLint	Code linting
Prettier	Code formatting
Git	Version control
npm	Package management
7. Installation Guide
7.1 Prerequisites
Before installing, ensure you have:

Requirement	Version	Check Command
Node.js	18+	node --version
Python	3.8+	python --version
MongoDB	6.0+	mongod --version
npm	Latest	npm --version
7.2 Step-by-Step Installation
Step 1: Clone the Repository
bash
git clone https://github.com/yourusername/nimbus-erp.git
cd nimbus-erp
Step 2: Install Node.js Dependencies
bash
npm install
This will install all required Node.js packages.

Step 3: Install Python Dependencies
bash
cd ai-service
pip install -r requirements.txt
cd ..
Step 4: Configure Environment Variables
Create a .env file in the root directory:

env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/intellipos

# Application URLs
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_AI_API_URL=http://127.0.0.1:8000
AI_PORT=8000

# Admin User
AdminEmail=admin@intellipos.com
AdminPassword=Admin123!
FrontendUrl=http://localhost:3000
Step 5: Start MongoDB
bash
# On Windows
net start MongoDB

# On Mac/Linux
sudo service mongod start
Step 6: Start the Application
Terminal 1 - Start Next.js:

bash
npm run dev
Terminal 2 - Start AI Service:

bash
cd ai-service
python run.py
Step 7: Access the Application
Website: http://localhost:3000

AI Service: http://localhost:8000

Default Login: admin@intellipos.com / Admin123!

7.3 Docker Installation (Optional)
Docker Compose:

yaml
version: '3.8'

services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/intellipos
    depends_on:
      - mongodb

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/intellipos
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
Run with Docker Compose:

bash
docker-compose up -d
8. User Guide
8.1 Login
Navigate to http://localhost:3000

Enter credentials:

Email: admin@intellipos.com

Password: Admin123!

Click "Login"

8.2 Dashboard
After login, you'll see the dashboard with:

Key Metrics: Products, Customers, Employees, Revenue

Charts: Revenue trends, Orders per month

Recent Activity: Latest system actions

Low Stock Alerts: Products needing restock

8.3 Using the AI Assistant
Click "AI Assistant" in the sidebar

Type your question or command

Get instant response

Examples:

What to Type	Response
"How many products do I have?"	Product count
"Add Wireless Mouse price 500 stock 20"	Product created
"Add 12 to stock in Keyboard"	Stock updated
"Show low stock products"	List of alerts
"Add vendor: name: Tech Supplies, email: tech@supplies.com"	Vendor added
"What's my revenue?"	Revenue displayed
"Add employee: John Doe, john@company.com"	Employee added
8.4 Managing Products
Go to "Products" in sidebar

Click "Add Product"

Fill in details:

Name (required)

SKU (auto-generated)

Category

Brand

Selling Price (required)

Purchase Price

Stock (required)

Min Stock

Upload image (optional)

Click "Create Product"

8.5 Managing Customers
Go to "Customers" in sidebar

Click "Add Customer"

Fill in:

Name (required)

Email (required)

Phone (required)

Address

Click "Create Customer"

8.6 Processing Sales (POS)
Go to "Billing" in sidebar

Search for products

Add products to cart

Select customer (or walk-in)

Choose payment method

Click "Generate Invoice"

8.7 Managing Orders
Go to "Orders" in sidebar

View all orders

Click on an order for details

Update status as needed:

Pending → Processing

Processing → Shipped

Shipped → Delivered

Cancel order if needed

8.8 Customer Shop
Navigate to /shop (customer view)

Browse products

Click "Add to Cart"

Go to Cart

Proceed to Checkout

Fill shipping details

Place order

9. AI Assistant Guide
9.1 Natural Language Commands
The AI understands natural language commands. Here are the supported patterns:

Product Management
Command	Pattern	Example
Count	"How many products?"	"How many products do I have?"
List	"Show me products"	"List all products"
Add	"Add product: name, price, stock"	"Add Wireless Mouse price 500 stock 20"
Update Stock	"Add X to stock in name"	"Add 5 to stock in Keyboard"
Low Stock	"Show low stock"	"Which products are low in stock?"
Category	"Add category: name"	"Add category: Electronics"
Customer Management
Command	Pattern	Example
Count	"How many customers?"	"How many customers do I have?"
List	"Show me customers"	"List all customers"
Add	"Add customer: name, email, phone"	"Add customer: John, john@email.com, 555-1234"
Vendor Management
Command	Pattern	Example
Count	"How many vendors?"	"How many vendors do I have?"
List	"Show me vendors"	"List all vendors"
Add	"Add vendor: name, email, phone"	"Add vendor: Tech Supplies, tech@supplies.com"
Employee Management
Command	Pattern	Example
Count	"How many employees?"	"How many employees do I have?"
List	"Show me employees"	"List all employees"
Add	"Add employee: name, email, role"	"Add employee: John, john@company.com, Developer"
Revenue
Command	Pattern	Example
Revenue	"What's my revenue?"	"Show me my total revenue"
Orders	"How many orders?"	"How many orders have I received?"
9.2 Multi-Step Actions
The AI can handle multi-step actions when you don't provide all required information:

Example: Adding a Product

You: "Add product"

AI: "Please provide: name, price, stock"

You: "name: Gaming Mouse, price: 300, stock: 15"

AI: "Product added successfully!"

9.3 Error Handling
The AI handles errors gracefully:

Spelling Mistakes: Auto-corrects typos

Missing Fields: Asks for required information

Not Found: Informs if item doesn't exist

Invalid Input: Guides to correct format

10. Database Schema
10.1 User Collection
javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: String,
  role: String (admin/employee/customer),
  status: String (active/inactive),
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
10.2 Product Collection
javascript
{
  _id: ObjectId,
  name: String,
  sku: String (unique),
  category: String,
  brand: String,
  supplierId: String,
  description: String,
  image: String,
  gallery: [String],
  purchasePrice: Number,
  sellingPrice: Number,
  discount: Number,
  tax: Number,
  unit: String,
  tags: [String],
  stock: Number,
  minStock: Number,
  status: String (active/inactive),
  isDeleted: Boolean,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
10.3 Customer Collection
javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  address: String,
  totalPurchases: Number,
  status: String (active/inactive),
  userId: ObjectId,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
10.4 Order Collection
javascript
{
  _id: ObjectId,
  number: String (unique),
  customerEmail: String,
  customerName: String,
  items: [{
    productId: String,
    name: String,
    qty: Number,
    price: Number,
    discount: Number,
    tax: Number,
    lineTotal: Number
  }],
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: Number,
  grandTotal: Number,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    zip: String
  },
  notes: String,
  isDeleted: Boolean,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
10.5 Vendor Collection
javascript
{
  _id: ObjectId,
  name: String,
  contactName: String,
  email: String,
  phone: String,
  address: String,
  gstin: String,
  notes: String,
  status: String (active/inactive),
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
10.6 Employee Collection
javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  role: String,
  department: String,
  salary: Number,
  status: String (active/inactive),
  userId: ObjectId,
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
10.7 Inventory Movement Collection
javascript
{
  _id: ObjectId,
  productId: String,
  productName: String,
  type: String (purchase/sale/adjustment/return),
  qty: Number,
  previousStock: Number,
  newStock: Number,
  vendorId: String,
  cost: Number,
  sellingPrice: Number,
  reference: String,
  note: String,
  userEmail: String,
  userId: String,
  createdAt: Date
}
10.8 Activity Collection
javascript
{
  _id: ObjectId,
  type: String (product/order/customer/payment/inventory/system),
  message: String,
  userId: String,
  userEmail: String,
  userName: String,
  metadata: Object,
  createdAt: Date
}
11. API Reference
11.1 Authentication Endpoints
POST /api/auth/login
Login to the system.

Request:

json
{
  "email": "admin@intellipos.com",
  "password": "Admin123!"
}
Response:

json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@intellipos.com",
    "role": "Admin"
  }
}
POST /api/auth/signup
Register a new user.

Request:

json
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "password123",
  "phone": "555-1234"
}
11.2 Product Endpoints
GET /api/products
Get all products.

Query Parameters:

search - Search by name/sku

category - Filter by category

page - Page number

limit - Items per page

Response:

json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
POST /api/products
Create a new product.

Request:

json
{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "category": "Electronics",
  "sellingPrice": 500,
  "stock": 20
}
PUT /api/products/:id
Update a product.

DELETE /api/products/:id
Delete a product.

11.3 Customer Endpoints
GET /api/customers
Get all customers.

POST /api/customers
Create a new customer.

Request:

json
{
  "name": "John Doe",
  "email": "john@email.com",
  "phone": "555-1234"
}
11.4 Order Endpoints
GET /api/orders
Get all orders.

POST /api/orders
Create a new order.

Request:

json
{
  "customerEmail": "john@email.com",
  "items": [
    {
      "productId": "...",
      "qty": 2,
      "price": 500
    }
  ],
  "paymentMethod": "card",
  "shippingAddress": {
    "name": "John Doe",
    "phone": "555-1234",
    "address": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}
11.5 AI Assistant Endpoint
POST /chat
Send a message to the AI Assistant.

Request:

json
{
  "message": "How many products do I have?",
  "userId": "...",
  "userEmail": "admin@intellipos.com"
}
Response:

json
{
  "success": true,
  "reply": "You have 25 products in your inventory."
}
12. Troubleshooting
Common Issues and Solutions
🔴 Issue: MongoDB Connection Failed
Error:

text
MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
Solutions:

bash
# Start MongoDB
net start MongoDB          # Windows
sudo service mongod start  # Mac/Linux

# Check MongoDB status
mongod --version
🔴 Issue: AI Service Not Responding
Error:

text
Error: connect ECONNREFUSED 127.0.0.1:8000
Solutions:

bash
# Start AI service
cd ai-service
python run.py

# Check if port is in use
npx kill-port 8000
🔴 Issue: Port Already in Use
Error:

text
Error: listen EADDRINUSE: address already in use :::3000
Solutions:

bash
# Kill process on port 3000
npx kill-port 3000

# Or find and kill manually
netstat -ano | findstr :3000
taskkill /PID [PID] /F
🔴 Issue: Python Dependencies Missing
Error:

text
ModuleNotFoundError: No module named 'fastapi'
Solutions:

bash
cd ai-service
pip install -r requirements.txt
🔴 Issue: Build Failed
Error:

text
Error: Next.js build failed
Solutions:

bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
🔴 Issue: Environment Variables Not Loading
Solution:

bash
# Make sure .env file exists
ls -la .env

# Check if variables are loaded
node -e "console.log(process.env.MONGODB_URI)"
13. FAQ
General Questions
Q: What is IntelliPOS?
A: IntelliPOS is a complete business management system with AI-powered assistance.

Q: Is it free?
A: Yes, it's open-source and free to use.

Q: What are the system requirements?
A: Node.js 18+, Python 3.8+, and MongoDB 6.0+.

Q: Can I customize it?
A: Yes, the code is fully customizable.

Q: Does it have a mobile app?
A: It's a responsive web app that works on all devices.

Technical Questions
Q: What technologies does it use?
A: Next.js, MongoDB, Python FastAPI, Tailwind CSS.

Q: How does the AI work?
A: It uses a custom rule-based NLP engine with spell correction and intent detection.

Q: Is it secure?
A: Yes, with JWT authentication, bcrypt password hashing, and role-based access control.

Q: Can I deploy it to production?
A: Yes, deploy Next.js to Vercel and AI service to Railway/Render.

Usage Questions
Q: How do I add products?
A: Use the Products page or the AI Assistant.

Q: How do I process a sale?
A: Go to Billing page, add items, select customer, and generate invoice.

Q: How do I check my revenue?
A: Check the Dashboard or ask the AI Assistant.

Q: How do I add employees?
A: Use the Employees page or the AI Assistant.

14. Development Guide
14.1 Setting Up Development Environment
bash
# Clone repository
git clone https://github.com/yourusername/nimbus-erp.git
cd nimbus-erp

# Install dependencies
npm install
cd ai-service && pip install -r requirements.txt && cd ..

# Setup environment variables
cp .env.example .env

# Start development servers
npm run dev
14.2 Project Structure Conventions
File Naming:

Components: PascalCase (ProductCard.tsx)

Hooks: camelCase with use prefix (useProducts.ts)

Services: camelCase (productService.ts)

Models: PascalCase (Product.ts)

Folder Structure:

text
app/
├── (manager)/     # Admin routes
├── (customer)/    # Customer routes
├── api/           # API routes
├── hooks/         # React hooks
├── models/        # Database models
└── services/      # Service layer
14.3 Coding Standards
TypeScript:

typescript
// Use interfaces for props
interface ProductCardProps {
  product: Product;
  onUpdate: (id: string) => void;
}

// Use types for unions
type Status = "active" | "inactive" | "pending";

// Use async/await for API calls
const fetchProducts = async () => {
  const response = await fetch("/api/products");
  return response.json();
};
CSS (Tailwind):

tsx
// Use Tailwind classes
<div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
  <h2 className="text-lg font-semibold">Title</h2>
</div>
14.4 Adding New Features
Step 1: Create Model

typescript
// app/models/NewFeature.ts
import mongoose, { Schema } from "mongoose";

const NewFeatureSchema = new Schema({
  // fields
});

export default mongoose.models.NewFeature || mongoose.model("NewFeature", NewFeatureSchema);
Step 2: Create API Routes

typescript
// app/api/new-feature/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import NewFeature from "@/app/models/NewFeature";

export async function GET() {
  await connectDB();
  const data = await NewFeature.find();
  return NextResponse.json({ success: true, data });
}
Step 3: Create Hook

typescript
// app/hooks/useNewFeature.ts
import { useState, useEffect } from "react";

export function useNewFeature() {
  const [data, setData] = useState([]);
  // logic
  return { data };
}
Step 4: Create Page

tsx
// app/(manager)/new-feature/page.tsx
"use client";
import { useNewFeature } from "@/app/hooks/useNewFeature";

export default function NewFeaturePage() {
  const { data } = useNewFeature();
  return <div>{/* UI */}</div>;
}
14.5 Testing
Unit Tests:

bash
npm run test
API Tests:

bash
npm run test:api
E2E Tests:

bash
npm run test:e2e
15. Contributing
15.1 How to Contribute
Fork the repository

Create a feature branch

Add your changes

Test your changes

Submit a pull request

15.2 Contribution Guidelines
Code Style:

Use TypeScript

Follow ESLint rules

Use Prettier for formatting

Write meaningful commit messages

Documentation:

Update README

Add JSDoc comments

Update API documentation

Testing:

Write unit tests

Test API endpoints

Test UI components

15.3 Pull Request Process
Update documentation

Add tests for new features

Ensure all tests pass

Get code review

Merge to main branch



to run this

ai-service> 
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload


