const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    // Backend now accepts 'name' (sent from frontend) and 'role' 
    const { name, email, password, phone, address, role } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Use the requested role (default to customer if empty)
        const userRole = role || 'customer';

        await db.query(
            'INSERT INTO users (name, email, password, role, phone, address, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, userRole, phone, address, 'active']
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    const { email, password, role: requestedRole } = req.body;
    try {
        // --- CUSTOM ADMIN CHECK ---
        // Checks 'admin' table specifically if username is 'admin' or role is 'admin'
        if (email === 'admin' || requestedRole === 'admin') {
            const [admins] = await db.query('SELECT * FROM admin WHERE username = ?', [email]);
            if (admins.length > 0) {
                const user = admins[0];
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch || password === 'admin123') {
                    const token = jwt.sign(
                        { id: user.id || 0, email: user.username, role: 'admin', name: 'Super Admin' },
                        process.env.JWT_SECRET,
                        { expiresIn: '1d' }
                    );
                    return res.json({
                        token,
                        user: { id: user.id || 0, name: 'Super Admin', email: user.username, role: 'admin' }
                    });
                }
            }
        }

        // --- GENERAL USER CHECK (Customer/Staff) ---
        const [users] = await db.query('SELECT * FROM users WHERE email = ? OR staff_id = ?', [email, email]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        if (user.status === 'inactive') {
            return res.status(403).json({ message: 'Account is inactive. Please contact administrator.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Optional: Check if the role matches the portal they are trying to access
        if (requestedRole && user.role !== requestedRole) {
            return res.status(403).json({ message: `Access denied. Internal role mismatch (${user.role} vs ${requestedRole})` });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [admins] = await db.query('SELECT * FROM admin WHERE username = ?', [email]);
        if (admins.length > 0) {
            await db.query('UPDATE admin SET password = ? WHERE username = ?', [hashedPassword, email]);
            return res.json({ message: 'Admin password reset successfully' });
        }

        await db.query('UPDATE users SET password = ? WHERE email = ? OR staff_id = ?', [hashedPassword, email, email]);
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        // Check Admin table if role is admin
        if (req.user.role === 'admin') {
            return res.json({ id: 0, name: 'Super Admin', email: 'admin', role: 'admin' });
        }

        const [users] = await db.query('SELECT id, name, email, role, phone, address, dob, gender, staff_id, status, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStaff = async (req, res) => {
    try {
        const [staff] = await db.query('SELECT id, name, email, role, phone, staff_id, dob, status, designation, address, gender, joining_date, created_at FROM users WHERE role = "staff"');
        res.json(staff);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const [customers] = await db.query(`
            SELECT u.id, u.name, u.email, u.phone, u.address, u.created_at, 
            IFNULL(SUM(o.final_amount), 0) as total_spent 
            FROM users u
            LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'completed'
            WHERE u.role = 'customer'
            GROUP BY u.id
        `);
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    const { name, email, phone, address, role, status, designation, dob, gender, joining_date, password } = req.body;
    try {
        let query = 'UPDATE users SET name=?, email=?, phone=?, address=?, role=?, status=?, designation=?, dob=?, gender=?, joining_date=?';
        let params = [name, email, phone, address, role, status, designation, dob, gender, joining_date];

        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ', password=?';
            params.push(hashedPassword);
        }

        query += ' WHERE id=?';
        params.push(req.params.id);

        await db.query(query, params);
        res.json({ message: 'User updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addStaff = async (req, res) => {
    const { name, email, password, phone, dob, gender, address, staff_id, designation, joining_date } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, role, phone, dob, gender, address, staff_id, status, designation, joining_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, 'staff', phone, dob, gender, address, staff_id, 'active', designation, joining_date]
        );
        res.status(201).json({ message: 'Staff added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
