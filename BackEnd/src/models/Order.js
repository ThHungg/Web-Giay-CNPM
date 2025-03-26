const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
                size: { type: Number, required: true },
            }
        ],
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"],
            default: "Chờ xác nhận"
        },
        shippingAddress: {
            street: { type: String, required: true },
            province: { type: String, required: true },
            district: { type: String, required: true },
            ward: { type: String, required: true }
        },
        paymentMethod: { type: String, required: true, enum: ["COD", "Banking"] },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        note: { type: String, default: "" },
        customerInfo: {
            nameReceiver: { type: String, required: true },
            phoneReceiver: { type: String, required: true },
            emailReceiver: { type: String, required: true },
        }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
