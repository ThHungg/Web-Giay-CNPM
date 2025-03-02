const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        image: { type: String, required: true }, // Ảnh chính
        images: [{ type: String }], // Ảnh phụ
        type: { type: String, required: true }, // Loại sản phẩm (ví dụ: sneaker, sandal)
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        discount: { type: Number, default: 0 }, // Phần trăm giảm giá
        description: { type: String, required: true },
        sizeStock: [
            {
                size: { type: Number, required: true },
                stock: { type: Number, required: true, default: 0, min: 0 },
            },
        ],
        totalStock: { type: Number, required: true, default: 0 }, // Tổng số lượng tồn kho
        category: { type: String, required: true }, // Loại giày
        rating: { type: Number, default: 0, min: 1, max: 5 }, // Đánh giá trung bình
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
