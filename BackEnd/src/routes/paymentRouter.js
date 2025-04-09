const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const qs = require('qs');
const crypto = require('crypto');
const moment = require('moment-timezone');

function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach((key) => {
        sorted[key] = obj[key];
    });
    return sorted;
}

router.get("/api/vnpay/create_payment", (req, res) => {
    const { amount } = req.query;
    const { orderId } = req.query;

    const tmnCode = "4ZVUWL9J";
    const secretKey = "AVZ4GCMJ2X999T0HO5FJB0LO97PYL6WN";
    const returnUrl = `${process.env.BASE_URL}/payment-result`;
    const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    let ipAddr = req.ip;
    // let orderId = moment().format("YYYYMMDDHHmmss");
    let bankCode = req.query.bankCode || "";
    let createDate = moment().format("YYYYMMDDHHmmss");
    let orderInfo = "Thanh_toan_don_hang";
    let locale = req.query.language || "vn";
    let currCode = "VND";
    let exprireDate = moment().add(15, 'minutes').format("YYYYMMDDHHmmss");
    // let exprireDate = moment().tz('Asia/Singapore').add(30, 'minutes').format("YYYYMMDDHHmmss");
    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "billpayment",
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
        vnp_ExpireDate: exprireDate,
    };

    vnp_Params["vnp_BankCode"] = bankCode || "NCB";

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params);
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl = `${vnp_Url}?${qs.stringify(vnp_Params)}`;

    console.log("Sign Data:", signData);
    console.log("Generated Hash:", signed);
    console.log("Received Hash:", req.query.vnp_SecureHash);

    res.json({ paymentUrl });
});

router.get("/api/vnpay/payment-result", (req, res) => {
    const query = req.query;
    const secretKey = "AVZ4GCMJ2X999T0HO5FJB0LO97PYL6WN";
    const vnp_SecureHash = query.vnp_SecureHash;

    delete query.vnp_SecureHash;

    const signData = qs.stringify(query);

    const hmac = crypto.createHmac("sha512", secretKey);
    const checkSum = hmac.update(signData).digest("hex");
    console.log(query)

    console.log("Chuỗi ký số:", signData);
    console.log("Hash do VNPay gửi:", vnp_SecureHash);
    console.log("Hash tự tính toán:", checkSum);

    // Kiểm tra chữ ký hợp lệ
    if (vnp_SecureHash === checkSum) {
        if (query.vnp_ResponseCode === "00") {
            res.json({
                message: "Thanh toán thành công",
                data: query
            })
        } else {
            res.json({
                message: "Thanh toán thất bại",
                data: query
            })
        }
    } else {
        res.status(400).json({
            message: "Dữ liệu không hợp lệ"
        })
    }
});



module.exports = router;
