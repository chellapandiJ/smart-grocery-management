const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, discountController.getDiscounts);
router.post('/', protect, admin, discountController.addDiscount);
router.delete('/:id', protect, admin, discountController.deleteDiscount);

module.exports = router;
