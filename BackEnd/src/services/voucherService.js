const Voucher = require('../models/Voucher')

const createVoucher = (newVoucher) => {
    return new Promise(async (resolve, reject) => {
        const { code, discount, discountType, startDate, expiryDate, type, brand, minOrder, status, description, totalQuantity, maxDiscount } = newVoucher;
        try {
            const checkCode = await Voucher.findOne({ code });
            if (checkCode) {
                return resolve({
                    status: "Check Code",
                    message: "Code đã tồn tại"
                })
            }

            if (type === 'brand' && !brand) {
                return resolve({
                    status: "Error",
                    message: "Thiếu thông tin brand cho loại voucher 'brand'"
                })
            }

            if (expiryDate && startDate && new Date(expiryDate) < new Date(startDate)) {
                return {
                    status: "Error",
                    message: "Ngày hết hạn phải sau ngày bắt đầu"
                };
            }

            const createVoucher = await Voucher.create({
                code, discount, startDate, expiryDate, type, brand, minOrder, status, description, totalQuantity, maxDiscount, discountType
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
            const now = new Date();

            await Voucher.updateMany(
                { expiryDate: { $lt: now }, status: { $ne: 'exprired' } },
                { $set: { status: 'expired' } }
            )
            const vouchers = await Voucher.find().sort({ createdAt: -1 });

            return resolve({
                status: "OK",
                message: "Lấy danh sách voucher thành công",
                data: vouchers
            });
        } catch (e) {
            reject(e)
        }
    })
}

const getActiveVoucher = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const now = new Date();

            await Voucher.updateMany(
                { expiryDate: { $lt: now }, status: { $ne: 'expired' } },
                { $set: { status: 'expired' } }
            );
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

const updateVoucherStatus = (voucherId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedOrder = await Voucher.findByIdAndUpdate(voucherId, { status }, { new: true })
            if (!updatedOrder) {
                resolve({
                    status: "ERR",
                    message: "Không tìm thấy voucher"
                })
            }
            resolve({
                status: "OK",
                message: "Cập nhật thành công"
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createVoucher,
    getAllVoucher,
    getActiveVoucher,
    updateVoucherStatus
}