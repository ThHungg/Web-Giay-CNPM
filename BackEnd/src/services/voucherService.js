const Voucher = require('../models/Voucher')

const createVoucher = (newVoucher) => {
    return new Promise(async (resolve, reject) => {
        const { code, discount, startDate, expiryDate, type, brand, minOrder, status, description, totalQuantity, maxDiscount } = newVoucher;
        try {
            const checkCode = await Voucher.findOne({ code });
            if (checkCode) {
                return resolve({
                    status: "Check Code",
                    message: "Code đã tồn tại"
                })
            }

            const createVoucher = await Voucher.create({
                code, discount, startDate, expiryDate, type, brand, minOrder, status, description, totalQuantity, maxDiscount
            })
            if (createVoucher) {
                resolve({
                    status: "OK",
                    message: "Tạo voucher thành công",
                    data: createVoucher,
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allVoucher = await Voucher.find()
            resolve({
                status: "OK",
                message: "Lấy thành công",
                data: allVoucher
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getActiveVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const activeVoucher = await Voucher.find({ status: "active" });
            resolve({
                status: "OK",
                message: "Lấy thành công",
                data: activeVoucher
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createVoucher,
    getAllVoucher,
    getActiveVoucher
}