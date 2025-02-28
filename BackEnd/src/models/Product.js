const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        image: { type: String, required: true },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        oldprice: { type: Number, required: true },
        description: { type: String, required: true },
        size: { type: [Number], required: true },
        brand: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                comment: { type: String },
            }
        ],
        category: { type: String, required: true }, 
        discount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;