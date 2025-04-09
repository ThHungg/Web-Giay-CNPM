const mongoose = require('mongoose');

const statSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true }, // có thể là ngày đầu tháng
        totalRevenue: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        processingOrders: { type: Number, default: 0 },
        successfulOrders: { type: Number, default: 0 },
        failedOrders: { type: Number, default: 0 },
        newUsers: { type: Number, default: 0 },
        revenueByMethod: {
            COD: { type: Number, default: 0 },
            Banking: { type: Number, default: 0 },
        },
        topSellingProducts: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                name: String,
                totalSold: Number,
            },
        ],
    },
    { timestamps: true }
);

const Stat = mongoose.model("Stat", statSchema);
module.exports = Stat;
