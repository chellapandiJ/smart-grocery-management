CREATE DATABASE IF NOT EXISTS grocery_db;
USE grocery_db;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer', 'staff') DEFAULT 'customer',
    phone VARCHAR(20),
    address TEXT,
    dob DATE,
    gender ENUM('male', 'female', 'other'),
    staff_id VARCHAR(50) UNIQUE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    designation VARCHAR(100),
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- Table: products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    purchase_price DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(5, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    min_stock INT NOT NULL DEFAULT 10,
    expiry_date DATE,
    image VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    is_published BOOLEAN DEFAULT TRUE,
    unit VARCHAR(20) DEFAULT 'kg',
    supplier_name VARCHAR(255),
    supplier_contact VARCHAR(20),
    supplier_address TEXT,
    discount_label VARCHAR(100), -- Celebration Discount Text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table: product_variations
CREATE TABLE IF NOT EXISTS product_variations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL, -- e.g. '500g', '1kg', 'Pack of 6'
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Table: cart
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    variation_id INT DEFAULT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE CASCADE
);

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT DEFAULT NULL, -- NULL for offline walk-in
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    shipping_address TEXT,
    total_amount DECIMAL(10, 2) NOT NULL,
    gst DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'approved', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
    order_type ENUM('online', 'offline') DEFAULT 'online',
    payment_method VARCHAR(50) DEFAULT 'cash',
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    billing_notes TEXT,
    stock_reduced BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table: order_items
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    variation_id INT DEFAULT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variation_id) REFERENCES product_variations(id) ON DELETE SET NULL
);

-- Table: stock_logs
CREATE TABLE IF NOT EXISTS stock_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    order_id INT DEFAULT NULL,
    type ENUM('IN', 'OUT') NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Table: discounts (Celebration/Global Discounts)
CREATE TABLE IF NOT EXISTS discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    type ENUM('all', 'category', 'product') NOT NULL,
    target_id INT DEFAULT NULL, -- category_id or product_id
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: admin (Master Credentials)
CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin row (bcrypt hash for 'admin123')
INSERT INTO admin (username, password) 
VALUES ('admin', '$2b$10$1DBkesTkiQRsaxAeVW3IkeVrCYlGkpPbY9AH4GAIhtyH6RYfOq6V')
ON DUPLICATE KEY UPDATE username=username;

-- Categories
INSERT INTO categories (name) VALUES 
('Vegetables'), ('Fruits'), ('Dairy'), ('Bakery'), ('Beverages'), 
('Meat & Fish'), ('Snacks'), ('Personal Care'), ('Household'), ('Frozen Foods')
ON DUPLICATE KEY UPDATE name=name;

-- Sample Products for Vegetables (Category ID 1)
INSERT INTO products (name, category_id, price, discount, final_price, stock, min_stock, expiry_date, image, status, unit) VALUES 
('Organic Carrots', 1, 2.50, 10, 2.25, 100, 20, '2026-12-31', 'carrots.jpg', 'active', 'kg'),
('Fresh Spinach', 1, 1.80, 0, 1.80, 50, 15, '2026-12-31', 'spinach.jpg', 'active', 'kg'),
('Red Tomatoes', 1, 3.20, 5, 3.04, 150, 30, '2026-12-31', 'tomatoes.jpg', 'active', 'kg'),
('Green Broccoli', 1, 2.90, 0, 2.90, 40, 10, '2026-12-31', 'broccoli.jpg', 'active', 'kg'),
('Bell Peppers Mix', 1, 4.50, 15, 3.82, 60, 20, '2026-12-31', 'peppers.jpg', 'active', 'kg'),
('Red Onions', 1, 1.50, 0, 1.50, 200, 50, '2026-12-31', 'onions.jpg', 'active', 'kg'),
('Potatoes 5kg', 1, 5.00, 10, 4.50, 80, 20, '2026-12-31', 'potatoes.jpg', 'active', 'kg'),
('Fresh Cucumber', 1, 1.20, 0, 1.20, 120, 25, '2026-12-31', 'cucumber.jpg', 'active', 'kg'),
('Cauliflower', 1, 2.80, 0, 2.80, 45, 10, '2026-12-31', 'cauliflower.jpg', 'active', 'kg'),
('Green Chillies', 1, 0.50, 0, 0.50, 300, 50, '2026-12-31', 'chillies.jpg', 'active', 'kg');
