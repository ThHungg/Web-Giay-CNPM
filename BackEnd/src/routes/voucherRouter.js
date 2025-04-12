const express = require("express");
const router = express.Router();
const voucherController = require('../controllers/voucherController');
const { authMiddleware } = require("../middleware/authMiddleware");


router.post('/createVoucher', voucherController.createVoucher);
router.put('/updateVoucher/:voucherId', authMiddleware, voucherController.updateVoucher);
router.get('/detailVoucher/:voucherId', voucherController.getDetailVoucher);
router.get('/getVoucher', voucherController.getActiveVoucher);
router.get('/getAllVoucher', authMiddleware, voucherController.getAllVoucher);
router.patch('/updateStatusVoucher/:voucherId', authMiddleware, voucherController.updateVoucherStatus);

module.exports = router;