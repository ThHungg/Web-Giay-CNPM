const express = require("express");
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { authMiddleware } = require("../middleware/authMiddleware");


router.post('/createVoucher', voucherController.createVoucher);
router.get('/getVoucher', voucherController.getActiveVoucher)
router.get('/getAllVoucher', authMiddleware, voucherController.getAllVoucher)

module.exports = router;