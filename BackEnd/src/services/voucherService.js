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

            const now = new Date();
            const start = new Date(startDate);
            const end = new Date(expiryDate);
            let computedStatus = "inactive";

            if (now >= start && now <= end) {
                computedStatus = "active";
            } else if (now > end) {
                computedStatus = "expired";
            }

            const createVoucher = await Voucher.create({
                code, discount, startDate, expiryDate, type, brand, minOrder, status: computedStatus, description, totalQuantity, maxDiscount, discountType
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

const updateVoucher = (voucherId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkVoucher = await Voucher.findById(voucherId);
            if (checkVoucher === null) {
                resolve({
                    status: "ERR",
                    message: 'Voucher không xác định'
                })
            }
            if (
                data.expiryDate &&
                data.startDate &&
                new Date(data.expiryDate) < new Date(data.startDate)
            ) {
                return resolve({
                    status: "ERR",
                    message: "Ngày hết hạn phải sau ngày bắt đầu",
                });
            }

            const now = new Date();
            const start = data.startDate ? new Date(data.startDate) : new Date(checkVoucher.startDate);
            const end = data.expiryDate ? new Date(data.expiryDate) : new Date(checkVoucher.expiryDate);

            if (now >= start && now <= end) {
                data.status = "active";
            } else if (now > end) {
                data.status = "expired";
            } else {
                data.status = "inactive";
            }

            const updateVoucher = await Voucher.findByIdAndUpdate(voucherId, data, { new: true })
            resolve({
                status: "Ok",
                message: "Success",
                data: updateVoucher
            })
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailVoucher = (voucherId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailVoucher = await Voucher.findById(voucherId);
            if (detailVoucher === null) {
                resolve({
                    status: "Ok",
                    message: 'Voucher không xác định'
                })
            }

            resolve({
                status: "Ok",
                message: "Sucess",
                data: detailVoucher
            })
        } catch (e) {
            reject(e);
        }
    });
};

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
    updateVoucherStatus,
    updateVoucher,
    getDetailVoucher
}