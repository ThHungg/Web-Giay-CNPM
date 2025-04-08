const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, trim: true },
        discount: { type: Number, required: true, min: 0 },
        discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' },
        startDate: { type: Date, default: Date.now },
        expiryDate: { type: Date, required: true },
        type: { type: String, enum: ['total_order', 'brand'], required: true },
        brand: {
            type: String,
            required: function () {
                return this.type === 'brand';
            },
        },
        maxDiscount: { type: Number, default: 0, min: 0 },
        minOrder: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ['active', 'inactive', 'expired'],
            default: 'active',
        },
        description: { type: String, default: '', trim: true },
        totalQuantity: { type: Number, default: 0, min: 0 },
        usedQuantity: { type: Number, default: 0, min: 0 },
        // Optional:
        // usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
);

const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;
