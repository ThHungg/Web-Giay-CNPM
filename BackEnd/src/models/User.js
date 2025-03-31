const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        phone: { type: String, required: true },
        address: {
            street: { type: String },
            province: { type: String },
            district: { type: String },
            ward: { type: String }
        },
        access_token: { type: String, default: "" },
        refresh_token: { type: String, default: "" },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;


