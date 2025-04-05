const Voucher = require('../models/Voucher');
const voucherSerivce = require('../services/voucherService')

const createVoucher = async (req, res) => {
    try {
        const { code, discount, startDate, expiryDate, type, brand, minOrder, status, description, totalQuantity } = req.body;
        if (!code || !discount || !totalQuantity) {
            return res.status(200).json({
                status: "Err",
                message: "Vui lòng nhập đẩy đủ thông tin"
            })
        }
        const response = await voucherSerivce.createVoucher(req.body)
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!',
            error: e.message
        });
    }
}

const getAllVoucher = async (req, res) => {
    try {
        const response = await voucherSerivce.getAllVoucher();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}


const getActiveVoucher = async (req, res) => {
    try {
        const response = await voucherSerivce.getActiveVoucher();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

module.exports = {
    createVoucher,
    getAllVoucher,
    getActiveVoucher,

}