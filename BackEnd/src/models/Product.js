const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        image: { type: String, required: true }, 
        images: [{ type: String }], 
        type: { type: String, required: true },
        color: {type: String},
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        discount: { type: Number, default: 0 }, 
        description: { type: String, required: true },
        sizeStock: [
            {
                size: { type: Number, required: true },
                stock: { type: Number, required: true, default: 0, min: 0 },
            },
        ],
        totalStock: { type: Number, required: true, default: 0 }, 
        category: { type: String, required: true }, 
        rating: { type: Number, default: 0, min: 1, max: 5 },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                comment: { type: String },
                rating: { type: Number, min: 1, max: 5 },
            }
        ],
        status: { type: String, enum: ['Còn hàng', 'Hết hàng'], default: 'Còn hàng' },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
