const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", require: true },
                quantity: { type: Number, require: true, min: 1 },
                size: { type: Number },
                price: { type: Number }
            }
        ],
        totalPrice: { type: Number, default: 0 },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Cart", cartSchema)

