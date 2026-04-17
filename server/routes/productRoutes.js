const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, staffOrAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get('/', productController.getAllProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProductById);

// Staff and Admin can manage products & categories
router.post('/', protect, staffOrAdmin, upload.single('image'), productController.createProduct);
router.put('/:id', protect, staffOrAdmin, upload.single('image'), productController.updateProduct);
router.delete('/:id', protect, staffOrAdmin, productController.deleteProduct);

router.post('/categories', protect, staffOrAdmin, productController.createCategory);
router.put('/categories/:id', protect, staffOrAdmin, productController.updateCategory);
router.delete('/categories/:id', protect, staffOrAdmin, productController.deleteCategory);

module.exports = router;
