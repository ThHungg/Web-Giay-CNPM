const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleware, productController.updateProduct)
router.delete('/delete/:id', productController.deleteProduct)
router.get('/details/:id', productController.getDetailProduct)
router.get('/get-all', productController.getAllProduct)

module.exports = router;
