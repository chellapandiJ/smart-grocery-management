const db = require('./config/db');
const bcrypt = require('bcrypt');

async function initAdmin() {
    try {
        console.log('Initializing Admin Table...');

        await db.query('CREATE TABLE IF NOT EXISTS admin (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)');

        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Insert if not exists
        await db.query('INSERT INTO admin (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE username=username', ['admin', hashedPassword]);

        console.log('Admin table initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing admin:', err);
        process.exit(1);
    }
}

initAdmin();
