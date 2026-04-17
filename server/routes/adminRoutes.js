const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin, staffOrAdmin } = require('../middleware/authMiddleware');

router.get('/stats', protect, staffOrAdmin, adminController.getDashboardStats);
router.get('/reports', protect, staffOrAdmin, adminController.getReports);
router.get('/inventory/status', protect, staffOrAdmin, adminController.getInventoryStatus);
router.get('/inventory/logs', protect, staffOrAdmin, adminController.getStockLogs);
router.get('/inventory/flow-analytics', protect, staffOrAdmin, adminController.getFlowAnalytics);

module.exports = router;
