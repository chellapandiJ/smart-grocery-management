const db = require('../config/db');

exports.getCart = async (req, res) => {
    try {
        const [items] = await db.query(`
            SELECT c.*, p.name, p.price, p.discount, p.final_price, p.image, p.stock, p.unit,
            pv.name as variation_name, pv.price as variation_price
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            LEFT JOIN product_variations pv ON c.variation_id = pv.id
            WHERE c.user_id = ?
        `, [req.user.id]);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    const { product_id, quantity, variation_id } = req.body;
    const userId = req.user.id;

    try {
        // Find existing item with same product AND variation
        let query = 'SELECT * FROM cart WHERE user_id = ? AND product_id = ?';
        let params = [userId, product_id];

        if (variation_id) {
            query += ' AND variation_id = ?';
            params.push(variation_id);
        } else {
            query += ' AND variation_id IS NULL';
        }

        const [existing] = await db.query(query, params);

        if (existing.length > 0) {
            await db.query('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
        } else {
            await db.query('INSERT INTO cart (user_id, product_id, quantity, variation_id) VALUES (?, ?, ?, ?)', [userId, product_id, quantity, variation_id || null]);
        }

        res.json({ message: 'Added to cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCartQuantity = async (req, res) => {
    const { quantity } = req.body;
    try {
        await db.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
        res.json({ message: 'Cart updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ message: 'Removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
