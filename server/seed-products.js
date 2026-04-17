const db = require('./config/db');

async function seed() {
    try {
        console.log('Starting seeding...');

        // 1. Ensure Categories
        const categories = ['Vegetables', 'Fruits', 'Groceries', 'Dairy', 'Snacks'];
        for (const cat of categories) {
            await db.query('INSERT IGNORE INTO categories (name) VALUES (?)', [cat]);
        }

        const [catRows] = await db.query('SELECT id, name FROM categories');
        const catMap = {};
        catRows.forEach(c => catMap[c.name] = c.id);

        // 2. Clear existing (optional, but requested 10 per category)
        // For simplicity, we just add them.

        const products = [
            // Vegetables
            { name: 'Fresh Tomato', cat: 'Vegetables', price: 2.5, unit: 'kg', image: 'tomato.jpg' },
            { name: 'Onion Red', cat: 'Vegetables', price: 1.8, unit: 'kg', image: 'onion.jpg' },
            { name: 'Potato Large', cat: 'Vegetables', price: 1.2, unit: 'kg', image: 'potato.jpg' },
            { name: 'Carrot Organic', cat: 'Vegetables', price: 3.0, unit: 'kg', image: 'carrot.jpg' },
            { name: 'Green Chili', cat: 'Vegetables', price: 0.5, unit: 'packet', image: 'chili.jpg' },
            { name: 'Ginger', cat: 'Vegetables', price: 4.0, unit: 'kg', image: 'ginger.jpg' },
            { name: 'Garlic', cat: 'Vegetables', price: 5.0, unit: 'kg', image: 'garlic.jpg' },
            { name: 'Spinach Bunch', cat: 'Vegetables', price: 1.5, unit: 'packet', image: 'spinach.jpg' },
            { name: 'Cucumber', cat: 'Vegetables', price: 2.0, unit: 'kg', image: 'cucumber.jpg' },
            { name: 'Cabbage', cat: 'Vegetables', price: 1.5, unit: 'pieces', image: 'cabbage.jpg' },

            // Fruits
            { name: 'Red Apple', cat: 'Fruits', price: 4.5, unit: 'kg', image: 'apple.jpg' },
            { name: 'Banana Robusta', cat: 'Fruits', price: 2.0, unit: 'pieces', image: 'banana.jpg' },
            { name: 'Orange Valencia', cat: 'Fruits', price: 3.5, unit: 'kg', image: 'orange.jpg' },
            { name: 'Black Grapes', cat: 'Fruits', price: 5.5, unit: 'kg', image: 'grapes.jpg' },
            { name: 'Papaya Whole', cat: 'Fruits', price: 2.5, unit: 'pieces', image: 'papaya.jpg' },
            { name: 'Pineapple', cat: 'Fruits', price: 3.0, unit: 'pieces', image: 'pineapple.jpg' },
            { name: 'Pomegranate', cat: 'Fruits', price: 6.0, unit: 'kg', image: 'pomegranate.jpg' },
            { name: 'Watermelon', cat: 'Fruits', price: 4.0, unit: 'pieces', image: 'watermelon.jpg' },
            { name: 'Guava', cat: 'Fruits', price: 3.0, unit: 'kg', image: 'guava.jpg' },
            { name: 'Mango Alphonso', cat: 'Fruits', price: 10.0, unit: 'kg', image: 'mango.jpg' },

            // Groceries (Maligai)
            { name: 'Basmati Rice 5kg', cat: 'Groceries', price: 15.0, unit: 'packet', image: 'rice.jpg' },
            { name: 'Refined Oil 1L', cat: 'Groceries', price: 3.5, unit: 'liter', image: 'oil.jpg' },
            { name: 'Sugar 1kg', cat: 'Groceries', price: 1.2, unit: 'kg', image: 'sugar.jpg' },
            { name: 'Wheat Flour 2kg', cat: 'Groceries', price: 4.5, unit: 'packet', image: 'flour.jpg' },
            { name: 'Toor Dal 1kg', cat: 'Groceries', price: 2.8, unit: 'kg', image: 'dal.jpg' },
            { name: 'Salt Powder', cat: 'Groceries', price: 0.5, unit: 'packet', image: 'salt.jpg' },
            { name: 'Tea Powder 250g', cat: 'Groceries', price: 2.5, unit: 'packet', image: 'tea.jpg' },
            { name: 'Coffee Powder 100g', cat: 'Groceries', price: 3.0, unit: 'packet', image: 'coffee.jpg' },
            { name: 'Turmeric Powder', cat: 'Groceries', price: 1.5, unit: 'packet', image: 'turmeric.jpg' },
            { name: 'Red Chili Powder', cat: 'Groceries', price: 1.8, unit: 'packet', image: 'chili_p.jpg' }
        ];

        for (const p of products) {
            const [res] = await db.query(
                'INSERT IGNORE INTO products (name, category_id, price, discount, final_price, stock, min_stock, image, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [p.name, catMap[p.cat], p.price, 0, p.price, 100, 20, p.image, p.unit]
            );

            if (res.insertId) {
                // Add default variations if kg
                if (p.unit === 'kg') {
                    const variations = [
                        { name: '250g', price: p.price * 0.25, stock: 50 },
                        { name: '500g', price: p.price * 0.5, stock: 50 },
                        { name: '1kg', price: p.price, stock: 50 }
                    ];
                    for (const v of variations) {
                        await db.query('INSERT INTO product_variations (product_id, name, price, stock) VALUES (?, ?, ?, ?)', [res.insertId, v.name, v.price, v.stock]);
                    }
                }
            }
        }

        console.log('Seeding complete!');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        process.exit();
    }
}

seed();
