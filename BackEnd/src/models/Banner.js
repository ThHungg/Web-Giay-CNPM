// models/Banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        image: { type: String, required: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'inactive' } 
    },
    { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
