const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) as totalProducts FROM products');
        const [[{ totalCustomers }]] = await db.query('SELECT COUNT(*) as totalCustomers FROM users WHERE role = "customer"');
        const [[{ totalStaff }]] = await db.query('SELECT COUNT(*) as totalStaff FROM users WHERE role = "staff"');
        const [[{ todaySales }]] = await db.query('SELECT IFNULL(SUM(final_amount), 0) as todaySales FROM orders WHERE DATE(created_at) = CURDATE()');
        const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) as totalOrders FROM orders');
        const [[{ todayOrdersCount }]] = await db.query('SELECT COUNT(*) as todayOrdersCount FROM orders WHERE DATE(created_at) = CURDATE()');
        const [[{ todayOnlineSales }]] = await db.query('SELECT IFNULL(SUM(final_amount), 0) as todayOnlineSales FROM orders WHERE DATE(created_at) = CURDATE() AND order_type = "online"');
        const [[{ todayOfflineSales }]] = await db.query('SELECT IFNULL(SUM(final_amount), 0) as todayOfflineSales FROM orders WHERE DATE(created_at) = CURDATE() AND order_type = "offline"');
        const [[{ monthlySales }]] = await db.query('SELECT IFNULL(SUM(final_amount), 0) as monthlySales FROM orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())');
        const [[{ onlineHistorical }]] = await db.query('SELECT IFNULL(SUM(final_amount), 0) as onlineHistorical FROM orders WHERE order_type = "online"');
        const [[{ offlineHistorical }]] = await db.query('SELECT IFNULL(SUM(final_amount), 0) as offlineHistorical FROM orders WHERE order_type = "offline"');
        const [[{ lowStockCount }]] = await db.query('SELECT COUNT(*) as lowStockCount FROM products WHERE stock < min_stock');
        const [[{ expiryAlertCount }]] = await db.query('SELECT COUNT(*) as expiryAlertCount FROM products WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)');
        const [[{ inventoryValuation }]] = await db.query('SELECT IFNULL(SUM(stock * purchase_price), 0) as inventoryValuation FROM products');

        // New: Recent Activity Queries
        const [recentOrders] = await db.query(`
            SELECT o.*, COALESCE(u.name, o.customer_name) as name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC LIMIT 5
        `);

        const [newCustomers] = await db.query(`
            SELECT name, email, phone, created_at 
            FROM users 
            WHERE role = 'customer' 
            ORDER BY created_at DESC LIMIT 5
        `);

        const [topSellingProducts] = await db.query(`
            SELECT p.id, p.name, p.stock, p.image, SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 5
        `);

        const [lowStockProducts] = await db.query(`
            SELECT id, name, stock, min_stock, image 
            FROM products 
            WHERE stock < min_stock 
            ORDER BY stock ASC
        `);

        res.json({
            totalProducts,
            totalCustomers,
            totalStaff,
            todaySales,
            todayOnlineSales,
            todayOfflineSales,
            totalOrders,
            todayOrdersCount,
            monthlySales,
            onlineHistorical,
            offlineHistorical,
            lowStockCount,
            expiryAlertCount,
            inventoryValuation,
            recentOrders,
            newCustomers,
            topSellingProducts,
            lowStockProducts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        const { source } = req.query; // online, offline, all
        let sourceFilter = '1=1';
        if (source === 'online') sourceFilter = 'o.order_type = "online"';
        if (source === 'offline') sourceFilter = 'o.order_type = "offline"';

        const { period, startDate, endDate } = req.query;
        let dateFilter = '1=1';

        if (period === 'today') {
            dateFilter = 'DATE(o.created_at) = CURDATE()';
        } else if (period === 'weekly') {
            dateFilter = 'o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        } else if (period === 'monthly') {
            dateFilter = 'o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        } else if (period === 'custom' && startDate && endDate) {
            dateFilter = `DATE(o.created_at) BETWEEN '${startDate}' AND '${endDate}'`;
        }

        const fullFilter = `${sourceFilter} AND ${dateFilter}`;

        // 1. Online vs Offline Sales (Total dynamically filtered by date)
        const [[{ onlineSales }]] = await db.query(`SELECT IFNULL(SUM(final_amount), 0) as onlineSales FROM orders o WHERE o.order_type = "online" AND ${dateFilter}`);
        const [[{ offlineSales }]] = await db.query(`SELECT IFNULL(SUM(final_amount), 0) as offlineSales FROM orders o WHERE o.order_type = "offline" AND ${dateFilter}`);

        // 2. Trends (Chart uses its own formatting but filtered by source)
        let trendQuery = '';
        if (period === 'today') {
            trendQuery = `SELECT DATE_FORMAT(created_at, '%H:00') as label, SUM(final_amount) as amount FROM orders o WHERE DATE(o.created_at) = CURDATE() AND ${sourceFilter} GROUP BY HOUR(o.created_at) ORDER BY HOUR(o.created_at) ASC`;
        } else if (period === 'weekly') {
            trendQuery = `SELECT CONCAT('Week ', WEEK(created_at)) as label, SUM(final_amount) as amount FROM orders o WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 8 WEEK) AND ${sourceFilter} GROUP BY WEEK(o.created_at) ORDER BY MIN(o.created_at) ASC`;
        } else if (period === 'monthly') {
            trendQuery = `SELECT DATE_FORMAT(created_at, '%b %Y') as label, SUM(final_amount) as amount FROM orders o WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH) AND ${sourceFilter} GROUP BY YEAR(o.created_at), MONTH(o.created_at) ORDER BY o.created_at ASC`;
        } else {
            trendQuery = `SELECT DATE_FORMAT(created_at, '%d %b') as label, SUM(final_amount) as amount FROM orders o WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND ${sourceFilter} GROUP BY DATE(o.created_at) ORDER BY o.created_at ASC`;
        }
        const [trends] = await db.query(trendQuery);

        // 3. Category Yields (Filtered)
        const [categorySales] = await db.query(`
            SELECT c.name, SUM(oi.quantity * oi.price) as amount
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN categories c ON p.category_id = c.id
            JOIN orders o ON oi.order_id = o.id
            WHERE ${fullFilter}
            GROUP BY c.id
        `);

        // 4. Top Products (Filtered)
        const [topProducts] = await db.query(`
            SELECT p.name, p.stock as current_stock, SUM(oi.quantity) as total_qty, SUM(oi.quantity * oi.price) as amount
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE ${fullFilter}
            GROUP BY p.id
            ORDER BY total_qty DESC
            LIMIT 10
        `);

        // 5. Top Customers (Filtered)
        const [topCustomers] = await db.query(`
            SELECT COALESCE(o.customer_name, u.name, 'Guest') as name, 
                   COALESCE(o.customer_phone, u.phone, 'N/A') as phone,
                   COUNT(o.id) as order_count, 
                   SUM(o.final_amount) as total_spent
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE ${fullFilter}
            GROUP BY o.customer_name, o.customer_phone, u.id
            ORDER BY total_spent DESC
            LIMIT 10
        `);

        // 6. Recent Transactions (Filtered)
        const [recentOrders] = await db.query(`
            SELECT o.*, COALESCE(o.customer_name, u.name, 'Guest') as customer_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE ${fullFilter}
            ORDER BY o.created_at DESC
            LIMIT 15
        `);

        // 7. Itemized Sales Log (Detailed product transactions with purchase price for P&L)
        const [saleItems] = await db.query(`
            SELECT o.created_at, o.invoice_id, p.name as product_name, 
                   oi.quantity, oi.price, (oi.quantity * oi.price) as line_total,
                   p.purchase_price, (oi.quantity * p.purchase_price) as cost_total,
                   o.order_type
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE ${fullFilter}
            ORDER BY o.created_at DESC
            LIMIT 50
        `);

        // Compute Profit & Loss (P&L) for the period
        const [[{ totalCost }]] = await db.query(`
            SELECT IFNULL(SUM(oi.quantity * p.purchase_price), 0) as totalCost 
            FROM order_items oi 
            JOIN orders o ON oi.order_id = o.id 
            JOIN products p ON oi.product_id = p.id
            WHERE ${fullFilter}
        `);

        // Totals (Filtered)
        const [[{ totalRevenue }]] = await db.query(`SELECT IFNULL(SUM(final_amount), 0) as totalRevenue FROM orders o WHERE ${fullFilter}`);
        const [[{ avgOrder }]] = await db.query(`SELECT IFNULL(AVG(final_amount), 0) as avgOrder FROM orders o WHERE ${fullFilter}`);
        const [[{ customerCount }]] = await db.query(`SELECT COUNT(DISTINCT COALESCE(o.user_id, o.customer_phone, o.customer_name)) as customerCount FROM orders o WHERE ${fullFilter}`);
        const [[{ itemsSold }]] = await db.query(`
            SELECT IFNULL(SUM(oi.quantity), 0) as itemsSold 
            FROM order_items oi 
            JOIN orders o ON oi.order_id = o.id 
            WHERE ${fullFilter}
        `);

        res.json({
            onlineSales,
            offlineSales,
            labels: trends.map(t => t.label),
            values: trends.map(t => t.amount),
            categoryLabels: categorySales.map(c => c.name),
            categoryValues: categorySales.map(c => c.amount),
            topProducts,
            topCustomers,
            recentOrders,
            saleItems,
            totalRevenue,
            totalCost,
            totalProfit: totalRevenue - totalCost,
            avgOrder,
            customerCount,
            itemsSold
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getInventoryStatus = async (req, res) => {
    try {
        const [lowStock] = await db.query('SELECT id, name, stock, min_stock, image, unit, purchase_price, final_price, barcode FROM products WHERE stock < min_stock AND stock > 0');
        const [outOfStock] = await db.query('SELECT id, name, stock, min_stock, image, unit, purchase_price, final_price, barcode FROM products WHERE stock = 0');
        const [expiryAlert] = await db.query('SELECT id, name, stock, min_stock, expiry_date, image, unit, barcode FROM products WHERE expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
        const [allProducts] = await db.query(`
            SELECT p.*, c.name as category_name,
                   (SELECT IFNULL(SUM(oi.quantity), 0) 
                    FROM order_items oi 
                    JOIN orders o ON oi.order_id = o.id 
                    WHERE oi.product_id = p.id 
                    AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as monthly_sold
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
        `);

        res.json({
            lowStock,
            outOfStock,
            expiryAlert,
            allProducts,
            totalCount: allProducts.length,
            totalValuation: allProducts.reduce((acc, p) => acc + (p.stock * p.purchase_price), 0)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStockLogs = async (req, res) => {
    try {
        const [logs] = await db.query(`
            SELECT l.*, p.name as product_name, p.image as product_image
            FROM stock_logs l
            JOIN products p ON l.product_id = p.id
            ORDER BY l.created_at DESC
            LIMIT 50
        `);
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFlowAnalytics = async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;
        let dateFilter = '1=1';

        if (period === 'today') {
            dateFilter = 'DATE(o.created_at) = CURDATE()';
        } else if (period === 'weekly') {
            dateFilter = 'o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)';
        } else if (period === 'monthly') {
            dateFilter = 'o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)';
        } else if (period === 'custom' && startDate && endDate) {
            dateFilter = `DATE(o.created_at) BETWEEN '${startDate}' AND '${endDate}'`;
        }

        const [analytics] = await db.query(`
            SELECT p.id, p.name, p.image, p.stock, p.final_price, p.purchase_price, p.min_stock,
                   IFNULL(SUM(oi.quantity), 0) as sold_count
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id AND ${dateFilter}
            GROUP BY p.id
            HAVING sold_count > 0
            ORDER BY sold_count DESC
        `);

        res.json(analytics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
