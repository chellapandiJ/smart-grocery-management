const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
        `);

        // Fetch variations for each product
        for (let p of products) {
            const [variations] = await db.query('SELECT * FROM product_variations WHERE product_id = ?', [p.id]);
            p.variations = variations;
        }

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    const { 
        name, category_id, price, discount, stock, min_stock, expiry_date, 
        status, unit, variations, barcode, brand_name, purchase_price, 
        supplier_name, supplier_contact, supplier_address 
    } = req.body;
    const image = req.file ? req.file.filename : null;
    const price_num = Number(price);
    const discount_num = Number(discount || 0);
    const final_price = price_num - (price_num * (discount_num / 100));

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [result] = await connection.query(
            `INSERT INTO products (
                name, category_id, price, discount, final_price, stock, min_stock, 
                expiry_date, image, status, unit, barcode, brand_name, 
                purchase_price, supplier_name, supplier_contact, supplier_address
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, category_id, price, discount, final_price, stock, min_stock, 
                expiry_date, image, status || 'active', unit || 'kg', 
                barcode, brand_name, purchase_price || 0, 
                supplier_name, supplier_contact, supplier_address
            ]
        );

        const productId = result.insertId;

        // Save variations if any
        if (variations) {
            const vars = JSON.parse(variations);
            for (let v of vars) {
                await connection.query('INSERT INTO product_variations (product_id, name, price, stock) VALUES (?, ?, ?, ?)', [productId, v.name, v.price, v.stock]);
            }
        }

        // Log initial stock
        await connection.query('INSERT INTO stock_logs (product_id, type, quantity) VALUES (?, ?, ?)', [productId, 'IN', stock]);

        await connection.commit();
        res.status(201).json({ message: 'Product created successfully', productId });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

exports.updateProduct = async (req, res) => {
    const { 
        name, category_id, price, discount, stock, min_stock, expiry_date, 
        status, unit, variations, barcode, brand_name, purchase_price, 
        supplier_name, supplier_contact, supplier_address 
    } = req.body;
    const price_num = Number(price);
    const discount_num = Number(discount || 0);
    const final_price = price_num - (price_num * (discount_num / 100));
    const productId = req.params.id;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
        const [oldProduct] = await connection.query('SELECT stock FROM products WHERE id = ?', [productId]);
        if (oldProduct.length === 0) return res.status(404).json({ message: 'Product not found' });

        let query = `UPDATE products SET 
            name=?, category_id=?, price=?, discount=?, final_price=?, 
            stock=?, min_stock=?, expiry_date=?, status=?, unit=?, 
            barcode=?, brand_name=?, purchase_price=?, 
            supplier_name=?, supplier_contact=?, supplier_address=?`;
        
        let params = [
            name, category_id, price, discount, final_price, 
            stock, min_stock, expiry_date, status, unit, 
            barcode, brand_name, purchase_price || 0, 
            supplier_name, supplier_contact, supplier_address
        ];

        if (req.file) {
            query += ', image=?';
            params.push(req.file.filename);
        }

        query += ' WHERE id=?';
        params.push(productId);

        await connection.query(query, params);

        // Handle variations
        if (variations) {
            const vars = JSON.parse(variations);
            // Simple approach: delete existing and re-insert
            await connection.query('DELETE FROM product_variations WHERE product_id = ?', [productId]);
            for (let v of vars) {
                await connection.query('INSERT INTO product_variations (product_id, name, price, stock) VALUES (?, ?, ?, ?)', [productId, v.name, v.price, v.stock]);
            }
        }

        // Log stock change if stock was updated
        const stockDiff = stock - oldProduct[0].stock;
        if (stockDiff !== 0) {
            await connection.query('INSERT INTO stock_logs (product_id, type, quantity) VALUES (?, ?, ?)',
                [productId, stockDiff > 0 ? 'IN' : 'OUT', Math.abs(stockDiff)]
            );
        }

        await connection.commit();
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Category created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCategory = async (req, res) => {
    const { name } = req.body;
    try {
        await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id]);
        res.json({ message: 'Category updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
