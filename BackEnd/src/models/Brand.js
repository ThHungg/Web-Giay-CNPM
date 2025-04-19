// models/Banner.js
const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
    {
        brand: { type: String, required: true },
        image: { type: String },
        status: { type: String, enum: ['active', 'inactive'], default: 'inactive' }
    },
    { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
