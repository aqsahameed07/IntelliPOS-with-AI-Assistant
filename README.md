# IntelliPOS

IntelliPOS is an AI-powered Enterprise Resource Planning (ERP) and Point of Sale (POS) system designed to streamline business operations through a single unified platform. The system combines inventory management, customer relationship management, employee management, sales processing, analytics, and an intelligent AI assistant that allows users to interact with business data using natural language commands.

## Demo

🎥 **Project Walkthrough:**
[Add Google Drive / YouTube Demo Link Here]

The demo showcases:

* Authentication & Role-Based Access Control
* Analytics Dashboard
* Inventory Management
* Customer Management (CRM)
* Employee Management
* Sales & Billing (POS)
* Order Management
* Customer Portal
* AI Assistant

---

## Key Features

### 🤖 AI-Powered Assistant

The built-in AI Assistant allows users to interact with the system using natural language.

**Examples:**

* How many products do I have?
* Add Wireless Mouse price 500 stock 20
* Add 12 to stock in Keyboard
* Show low stock products
* What's my revenue?

**Capabilities**

* Natural language understanding
* Spell correction
* Intent detection
* Context-aware conversations
* Multi-step actions
* Real-time database interaction

### 📦 Inventory Management

Manage products, stock levels, vendors, and inventory operations.

**Features**

* Product catalog management
* Real-time stock tracking
* Low stock alerts
* Category management
* Vendor management
* Inventory movement tracking

### 👥 Customer Management (CRM)

Maintain customer information and purchasing records.

**Features**

* Customer profiles
* Purchase history
* Order tracking
* Customer analytics
* Contact management

### 👔 Employee Management

Manage team members and control access across the system.

**Features**

* Employee profiles
* Department management
* Role-based access control
* Employee records management

### 💰 Sales & Billing (POS)

A complete point-of-sale solution for handling transactions.

**Features**

* Invoice generation
* Multiple payment methods
* Payment tracking
* Refund processing
* Sales reporting

### 📊 Analytics Dashboard

Monitor business performance through real-time insights.

**Features**

* Revenue tracking
* Sales analytics
* Business metrics
* Activity logs
* Low stock monitoring

### 🛒 Customer Portal

Allow customers to browse products and place orders.

**Features**

* Product browsing
* Product search and filtering
* Shopping cart
* Checkout process
* Order tracking

---

## Screenshots

### Dashboard

*Add Dashboard Screenshot Here*

### AI Assistant

*Add AI Assistant Screenshot Here*

### Inventory Management

*Add Inventory Screenshot Here*

### Customer Management

*Add Customer Management Screenshot Here*

### Sales & Billing (POS)

*Add POS Screenshot Here*

### Customer Portal

*Add Customer Portal Screenshot Here*

---

## Technology Stack

### Frontend

* Next.js
* React
* Tailwind CSS
* Shadcn/UI
* Zustand
* Recharts

### Backend

* Next.js API Routes
* MongoDB
* Mongoose

### AI Service

* Python
* FastAPI
* Custom NLP Engine

---

## System Architecture

```text
Frontend (Next.js)
       │
       ▼
API Routes (Next.js)
       │
       ▼
AI Service (FastAPI)
       │
       ▼
MongoDB Database
```

---

## Installation

### Prerequisites

* Node.js 18+
* Python 3.8+
* MongoDB

### Clone Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### Install Frontend Dependencies

```bash
npm install
```

### Install AI Service Dependencies

```bash
cd ai-service
pip install -r requirements.txt
cd ..
```

### Configure Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb://localhost:27017/intellipos

NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_AI_API_URL=http://127.0.0.1:8000

AI_PORT=8000

AdminEmail=admin@intellipos.com
AdminPassword=Admin123!
FrontendUrl=http://localhost:3000
```

---

## Running the Project

### Start Frontend

```bash
npm run dev
```

### Start AI Service

```bash
cd ai-service
py -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Access Application

```text
Frontend: http://localhost:3000
AI Service: http://localhost:8000
```

### Default Admin Account

```text
Email: admin@intellipos.com
Password: Admin123!
```

---

## Project Structure

```text
app/
├── api/
├── hooks/
├── models/
├── services/

ai-service/
├── app/
├── main.py
└── requirements.txt
```

---

## AI Command Examples

```text
How many products do I have?

Show me products

Add Wireless Mouse price 500 stock 20

Add 12 to stock in Keyboard

Show low stock products

How many customers do I have?

Show me vendors

How many employees do I have?

What's my revenue?
```

---

## License

This project is licensed under the MIT License.
