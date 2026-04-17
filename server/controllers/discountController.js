const db = require('../config/db');

exports.getDiscounts = async (req, res) => {
    try {
        const [discounts] = await db.query('SELECT * FROM discounts ORDER BY created_at DESC');
        res.json(discounts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addDiscount = async (req, res) => {
    const { name, percentage, type, target_id } = req.body;
    try {
        // 1. Insert into discounts table
        await db.query(
            'INSERT INTO discounts (name, percentage, type, target_id, status) VALUES (?, ?, ?, ?, "active")',
            [name, percentage, type, target_id || null]
        );

        // 2. Apply discount to products automatically
        if (type === 'all') {
            await db.query('UPDATE products SET discount = ?, final_price = price - (price * ? / 100)', [percentage, percentage]);
        } else if (type === 'category') {
            await db.query('UPDATE products SET discount = ?, final_price = price - (price * ? / 100) WHERE category_id = ?', [percentage, percentage, target_id]);
        } else if (type === 'product') {
            await db.query('UPDATE products SET discount = ?, final_price = price - (price * ? / 100) WHERE id = ?', [percentage, percentage, target_id]);
        }

        res.status(201).json({ message: 'Discount applied successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteDiscount = async (req, res) => {
    try {
        // Find discount details before deleting to reset if needed
        const [[discount]] = await db.query('SELECT * FROM discounts WHERE id = ?', [req.params.id]);
        if (!discount) return res.status(404).json({ message: 'Discount not found' });

        // Reset product prices
        if (discount.type === 'all') {
            await db.query('UPDATE products SET discount = 0, final_price = price');
        } else if (discount.type === 'category') {
            await db.query('UPDATE products SET discount = 0, final_price = price WHERE category_id = ?', [discount.target_id]);
        } else if (discount.type === 'product') {
            await db.query('UPDATE products SET discount = 0, final_price = price WHERE id = ?', [discount.target_id]);
        }

        await db.query('DELETE FROM discounts WHERE id = ?', [req.params.id]);
        res.json({ message: 'Discount removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
