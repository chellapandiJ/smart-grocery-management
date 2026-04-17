const db = require('../config/db');

exports.getInventoryStatus = async (req, res) => {
    try {
        const [lowStock] = await db.query('SELECT * FROM products WHERE stock < min_stock AND stock > 0');
        const [outOfStock] = await db.query('SELECT * FROM products WHERE stock = 0');
        const [expiryAlert] = await db.query('SELECT * FROM products WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
        const [allProducts] = await db.query('SELECT * FROM products ORDER BY stock ASC');
        const [[{ total: totalCount }]] = await db.query('SELECT COUNT(*) as total FROM products');

        res.json({
            lowStock,
            outOfStock,
            expiryAlert,
            allProducts,
            totalCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [products] = await db.query('SELECT COUNT(*) as total FROM products');
        const [customers] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "customer"');
        const [todaySales] = await db.query('SELECT SUM(final_amount) as total FROM orders WHERE DATE(created_at) = CURDATE()');
        const [lowStock] = await db.query('SELECT COUNT(*) as total FROM products WHERE stock < min_stock');
        const [expiryAlert] = await db.query('SELECT COUNT(*) as total FROM products WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)');

        res.json({
            totalProducts: products[0].total,
            totalCustomers: customers[0].total,
            todaySales: todaySales[0].total || 0,
            lowStockCount: lowStock[0].total,
            expiryAlertCount: expiryAlert[0].total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Fixed version of stats with proper names
exports.getStats = async (req, res) => {
    try {
        const [[{ total: totalProducts }]] = await db.query('SELECT COUNT(*) as total FROM products');
        const [[{ total: totalCustomers }]] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "customer"');
        const [[{ total: todaySales }]] = await db.query('SELECT COALESCE(SUM(final_amount), 0) as total FROM orders WHERE DATE(created_at) = CURDATE()');
        const [[{ total: monthlySales }]] = await db.query('SELECT COALESCE(SUM(final_amount), 0) as total FROM orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())');
        const [[{ total: lowStockCount }]] = await db.query('SELECT COUNT(*) as total FROM products WHERE stock < min_stock');
        const [[{ total: expiryAlertCount }]] = await db.query('SELECT COUNT(*) as total FROM products WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
        const [[{ total: expiredCount }]] = await db.query('SELECT COUNT(*) as total FROM products WHERE expiry_date < CURDATE()');

        res.json({
            totalProducts,
            totalCustomers,
            todaySales,
            monthlySales,
            lowStockCount,
            expiryAlertCount,
            expiredCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSalesReport = async (req, res) => {
    try {
        const [dailySales] = await db.query(`
            SELECT DATE(created_at) as date, SUM(final_amount) as total 
            FROM orders 
            GROUP BY DATE(created_at) 
            ORDER BY date DESC LIMIT 30
        `);

        const [productSales] = await db.query(`
            SELECT p.name, SUM(oi.quantity) as total_quantity, SUM(oi.quantity * oi.price) as total_revenue
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.id
            ORDER BY total_revenue DESC LIMIT 10
        `);

        res.json({
            dailySales,
            productSales
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
