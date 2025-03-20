const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add', cartController.addToCart);
router.get('/getCart/:userId', cartController.getCart);
router.post('/remove', cartController.removeFromCart);

module.exports = router;