const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                name: { type: String, required: true },
                amount: { type: Number, required: true }, // Số lượng
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            phone: { type: Number, required: true }, // Fix lỗi "NNumber"
        },
        paymentMethod: { type: String, required: true }, // (COD, Momo, Visa...)
        paymentStatus: {
            type: String,
            enum: ['Chưa thanh toán', 'Đã thanh toán', 'Hoàn tiền'],
            default: 'Chưa thanh toán',
        },
        itemsPrice: { type: Number, required: true }, // Giá sản phẩm
        shippingPrice: { type: Number, required: true }, // Phí ship
        totalPrice: { type: Number, required: true }, // Tổng đơn hàng
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        status: {
            type: String,
            enum: ['Chờ xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'],
            default: 'Chờ xác nhận',
        },
        trackingNumber: { type: String, default: '' }, // Mã vận đơn (nếu có)
        notes: { type: String, default: '' }, // Ghi chú đơn hàng
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
