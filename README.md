# 🛒 Smart Grocery Management System

A professional Full-Stack E-commerce solution for modern grocery businesses. Built with high-performance standards, featuring a seamless customer experience and a data-driven administration terminal.

---

## 🌟 Core Features

### 👤 Customer Experience
- **Smart Catalog**: Advanced product filtering and real-time search functionality.
- **Micro-interactions**: Smooth glassmorphism UI with Framer Motion animations.
- **Shopping Basket**: Dynamic quantity adjustments and variation selection (Size/Weight).
- **Secure Checkout**: Transaction-safe ordering system.
- **Order History**: Personal dashboard for tracking purchase history.

### 🛡️ Admin & Staff Terminal
- **Data Analytics**: Real-time sales statistics and inventory flow charts (Chart.js).
- **Inventory Control**: Low-stock alerts and automatic stock decrement upon purchase.
- **Product Management**: Multi-variation support and automated image handling via Multer.
- **Security**: JWT-based role protection (Admin vs. Staff vs. Customer).

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Framer Motion, Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL (Relational Schema).
- **Security**: JSON Web Tokens (JWT), Bcrypt Password Hashing.
- **Environment**: Dotenv for secure configuration.

---

## 🚀 Setup & Installation

### 1. Database Configuration
1. Start your local MySQL server (XAMPP/WAMP recommended).
2. Create a new database: `CREATE DATABASE grocery_db;`.
3. Import the `database.sql` file located in the root directory.
   - *Default Admin: `admin@grocery.com` | Password: `admin123`*

### 2. Backend Setup
1. Navigate to the server directory: `cd server`.
2. Install dependencies: `npm install`.
3. Configure settings: Rename `.env.example` (if exists) or create a `.env` file with your MySQL credentials.
4. Start the server: `node server.js`.

### 3. Frontend Setup
1. Navigate to the client directory: `cd client`.
2. Install dependencies: `npm install`.
3. Launch development server: `npm run dev`.

---

## 📏 Industry Standards Implemented
- **MVC Architecture**: Clean separation of routes, controllers, and services.
- **Middleware**: robust authentication and error handling layers.
- **Relational Integrity**: Foreign keys and database transactions for data consistency.
- **Responsive Design**: Mobile-first approach for all viewports.

---

Developed with ❤️ as a Professional MCA Portfolio Project.
