const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', productController.createProduct)
router.put('/update/:id', authMiddleware, productController.updateProduct)
router.delete('/delete/:id', productController.deleteProduct)
router.get('/details/:id', productController.getDetailProduct)
router.get('/get-all', productController.getAllProduct)
router.delete('/softDelete/:id', productController.softDeleteProduct)
router.get('/getActive', productController.getActiveProduct)
router.patch('/restore/:id', productController.restoreProduct)
router.put('/sell-multiple', productController.updateMultipleSold)
// router.delete('/soft-delete/:id', productController.softDeleteProduct)
// router.patch('/restore/:id', productController.restoreProduct)

module.exports = router;
