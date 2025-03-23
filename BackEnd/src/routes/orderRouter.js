const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/create-order', orderController.createOrder);
router.get('/get-all-order', orderController.getAllOrders);
router.put('/orders/:orderId', orderController.updateOrderStatus);
router.get('/getAllOrder', orderController.getAllOrder);
// router.delete('/orders/:orderId', orderController.deleteOrder);

module.exports = router;