const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, staffOrAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/all', protect, staffOrAdmin, orderController.getAllOrders);
router.get('/:id', protect, orderController.getOrderDetails);
router.put('/:id/status', protect, staffOrAdmin, orderController.updateOrderStatus);

module.exports = router;
