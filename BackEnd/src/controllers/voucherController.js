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

const updateVoucher = async (req, res) => {
    try {
        const { voucherId } = req.params;
        const data = req.body
        if (!voucherId) {
            return res.status(200).json({
                status: "Err",
                message: 'The voucherId is required'
            })
        }
        const response = await voucherSerivce.updateVoucher(voucherId, data);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const getDetailVoucher = async (req, res) => {
    try {
        const { voucherId } = req.params;
        if (!voucherId) {
            return res.status(200).json({
                status: "Err",
                message: 'The voucherId is required'
            })
        }
        const response = await voucherSerivce.getDetailVoucher(voucherId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
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

const updateVoucherStatus = async (req, res) => {
    try {
        const { voucherId } = req.params;
        const { status } = req.body;
        const response = await voucherSerivce.updateVoucherStatus(voucherId, status);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
};


module.exports = {
    createVoucher,
    getAllVoucher,
    getActiveVoucher,
    updateVoucherStatus,
    updateVoucher,
    getDetailVoucher
}