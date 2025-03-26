const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create-order', orderController.createOrder);
router.get('/get-all-order', orderController.getAllOrders);
router.put('/orders/:orderId', orderController.updateOrderStatus);
router.get('/getAllOrder', authMiddleware, orderController.getAllOrder);
router.put('/updateOrder/:orderId', authMiddleware, orderController.updateOrder);
router.get('/getDetailOrder/:orderId', orderController.getDetailOrder);
router.get('/historyOrder/:userId', orderController.getHistoryOrder);
// router.delete('/orders/:orderId', orderController.deleteOrder);

module.exports = router;