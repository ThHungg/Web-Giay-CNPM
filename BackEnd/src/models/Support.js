const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: false },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved'],
            default: 'Pending',
        },
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Support', supportSchema);
