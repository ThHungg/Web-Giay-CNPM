// const paymentService = require("../services/paymentService");

// exports.createPayment = (req, res) => {
//     try {
//         let paymentUrl = paymentService.createPaymentUrl(req);
//         res.json({ paymentUrl });
//     } catch (error) {
//         console.error("Lỗi khi tạo thanh toán:", error);
//         res.status(500).json({ message: "Lỗi khi tạo thanh toán", error });
//     }
// };

// exports.queryPayment = async (req, res) => {
//     try {
//         let result = await paymentService.queryPayment(req);
//         res.json(result);
//     } catch (error) {
//         console.error("Lỗi khi tạo thanh toán:", error);
//         res.status(500).json({ message: "Lỗi truy vấn thanh toán", error });
//     }
// };

// exports.refundPayment = async (req, res) => {
//     try {
//         let result = await paymentService.refundPayment(req);
//         res.json(result);
//     } catch (error) {
//         console.error("Lỗi khi tạo thanh toán:", error);
//         res.status(500).json({ message: "Lỗi hoàn tiền", error });
//     }
// };

