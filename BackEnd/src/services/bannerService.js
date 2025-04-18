// services/bannerService.js
const Banner = require('../models/Banner');

// Tạo banner mới
const createBanner = (newBanner) => {
    return new Promise(async (resolve, reject) => {
        const { image, status } = newBanner; // Nhận cả status (tùy chọn)
        try {
            const createdBanner = await Banner.create({
                image,
                status: status || 'inactive' // Nếu không có status, mặc định là 'inactive'
            });

            if (createdBanner) {
                resolve({
                    status: "OK",
                    message: "Tạo banner thành công",
                    data: createdBanner
                });
            }
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi: " + e.message
            });
        }
    });
};

// Lấy tất cả banner
const getAllBanners = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const banners = await Banner.find();
            resolve({
                status: "OK",
                message: "Lấy danh sách banner thành công",
                data: banners
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi: " + e.message
            });
        }
    });
};

// Lấy banner hoạt động
const getActiveBanners = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const activeBanners = await Banner.find({ status: 'active' }); // Lọc banner có status = 'active'
            resolve({
                status: "OK",
                message: "Lấy danh sách banner hoạt động thành công",
                data: activeBanners
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi: " + e.message
            });
        }
    });
};

// Cập nhật trạng thái banner
const updateBannerStatus = (bannerId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedBanner = await Banner.findByIdAndUpdate(
                bannerId,
                { status },
                { new: true } // Trả về banner đã được cập nhật
            );
            if (!updatedBanner) {
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy banner"
                });
            }
            resolve({
                status: "OK",
                message: `Cập nhật trạng thái banner thành công: ${status}`,
                data: updatedBanner
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi: " + e.message
            });
        }
    });
};

// Xóa banner
const deleteBanner = (bannerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedBanner = await Banner.findByIdAndDelete(bannerId);
            if (!deletedBanner) {
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy banner"
                });
            }
            resolve({
                status: "OK",
                message: "Xóa banner thành công",
                data: deletedBanner
            });
        } catch (e) {
            reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi: " + e.message
            });
        }
    });
};

module.exports = {
    createBanner,
    getAllBanners,
    getActiveBanners,  // Thêm API getActiveBanners
    updateBannerStatus, // Thêm API updateBannerStatus
    deleteBanner
};
