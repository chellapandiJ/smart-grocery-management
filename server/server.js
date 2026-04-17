const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const discountRoutes = require('./routes/discountRoutes');
const { protect, staffOrAdmin } = require('./middleware/authMiddleware');
const adminController = require('./controllers/adminController');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/discounts', discountRoutes);

// Shared Inventory Status (Admin & Staff)
app.get('/api/inventory/status', protect, staffOrAdmin, adminController.getInventoryStatus);
app.get('/api/inventory/logs', protect, staffOrAdmin, adminController.getStockLogs);

// Check DB Connection and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.query('SELECT 1');
        console.log('Connected to MySQL database');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

startServer();
