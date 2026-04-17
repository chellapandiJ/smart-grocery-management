const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { items, total_amount, gst, discount, final_amount, customer_name, customer_phone, shipping_address, status, order_type, payment_method, payment_status, billing_notes } = req.body;
    // Only link to user_id if the logged-in user is a customer
    const userId = (req.user && req.user.role === 'customer') ? req.user.id : null;
    const invoiceId = 'INV-' + Date.now() + Math.floor(Math.random() * 1000);

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Create Order (Use provided status or default to 'pending')
        const orderStatus = status || 'pending';
        const shouldReduceStock = orderStatus !== 'pending';
        const [orderResult] = await connection.query(
            'INSERT INTO orders (invoice_id, user_id, customer_name, customer_phone, shipping_address, total_amount, gst, discount, final_amount, status, stock_reduced, order_type, payment_method, payment_status, billing_notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [invoiceId, userId, customer_name || null, customer_phone || null, shipping_address || null, total_amount, gst, discount, final_amount, orderStatus, shouldReduceStock ? 1 : 0, order_type || 'online', payment_method || 'cash', payment_status || 'pending', billing_notes || null]
        );
        const orderId = orderResult.insertId;

        // 2. Insert Order Items & Update Stock (Only if status is NOT pending)
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, variation_id) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.product_id || item.id, item.quantity, item.price || item.final_price || item.variation_price, item.variation_id || null]
            );

            if (shouldReduceStock) {
                // Update product stock (Main and Variation)
                if (item.variation_id) {
                    await connection.query(
                        'UPDATE product_variations SET stock = stock - ? WHERE id = ?',
                        [item.quantity, item.variation_id]
                    );
                } else {
                    await connection.query(
                        'UPDATE products SET stock = stock - ? WHERE id = ?',
                        [item.quantity, item.product_id || item.id]
                    );
                }

                // Log stock movement
                await connection.query(
                    'INSERT INTO stock_logs (product_id, type, quantity, order_id) VALUES (?, ?, ?, ?)',
                    [item.product_id || item.id, 'OUT', item.quantity, orderId]
                );
            }
        }

        // 3. Clear Cart if it's an online user
        if (userId) {
            await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Order placed successfully', invoiceId, orderId });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Failed to place order' });
    } finally {
        if (connection) connection.release();
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT o.*, u.name as user_name, u.email as user_email,
            COALESCE(o.customer_name, u.name) as customer_name,
            COALESCE(o.customer_phone, u.phone) as customer_phone,
            GROUP_CONCAT(p.name SEPARATOR ', ') as product_names
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const [items] = await db.query(`
            SELECT oi.*, p.name as product_name, p.image 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        `, [req.params.id]);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        // 1. Get current order details
        const [[order]] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (!order) {
            await connection.rollback();
            return res.status(404).json({ message: 'Order not found' });
        }

        const [items] = await connection.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);

        // 2. Logic for Stock Reduction/Restoration
        // Confirmed = Move from pending to approved (or any non-pending state)
        const becomingConfirmed = (order.status === 'pending' && status !== 'pending' && status !== 'rejected' && status !== 'cancelled');
        const becomingCancelled = (order.stock_reduced === 1 && (status === 'rejected' || status === 'cancelled'));

        if (becomingConfirmed && order.stock_reduced === 0) {
            // Reduce Stock
            for (const item of items) {
                if (item.variation_id) {
                    await connection.query('UPDATE product_variations SET stock = stock - ? WHERE id = ?', [item.quantity, item.variation_id]);
                } else {
                    await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
                }
                await connection.query('INSERT INTO stock_logs (product_id, type, quantity, order_id) VALUES (?, ?, ?, ?)', [item.product_id, 'OUT', item.quantity, orderId]);
            }
            await connection.query('UPDATE orders SET stock_reduced = 1 WHERE id = ?', [orderId]);
        }
        else if (becomingCancelled) {
            // Restore Stock
            for (const item of items) {
                if (item.variation_id) {
                    await connection.query('UPDATE product_variations SET stock = stock + ? WHERE id = ?', [item.quantity, item.variation_id]);
                } else {
                    await connection.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
                }
                await connection.query('INSERT INTO stock_logs (product_id, type, quantity, order_id) VALUES (?, ?, ?, ?)', [item.product_id, 'IN', item.quantity, orderId]);
            }
            await connection.query('UPDATE orders SET stock_reduced = 0 WHERE id = ?', [orderId]);
        }

        // 3. Update Status
        await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);

        await connection.commit();
        res.json({ message: 'Order status updated successfully' });
    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        if (connection) connection.release();
    }
};
