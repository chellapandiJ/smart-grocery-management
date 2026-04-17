const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, admin, staffOrAdmin } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.get('/profile', protect, authController.getProfile);

// Management Routes
router.get('/staff', protect, admin, authController.getStaff);
router.post('/staff', protect, admin, authController.addStaff);
router.get('/customers', protect, staffOrAdmin, authController.getCustomers);
router.put('/users/:id', protect, staffOrAdmin, authController.updateUser);
router.delete('/users/:id', protect, admin, authController.deleteUser);

module.exports = router;
