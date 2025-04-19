// services/bannerService.js
const Brand = require('../models/Brand');

// Tạo banner mới
const createBrand = (newBrand) => {
    return new Promise(async (resolve, reject) => {
        const { brand, image, status } = newBrand;
        try {
            const createdBrand = await Brand.create({
                brand,
                image,
                status: status || 'inactive'
            });

            if (createdBrand) {
                resolve({
                    status: "OK",
                    message: "Tạo banner thành công",
                    data: createdBrand
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy tất cả banner
const getAllBrand = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const brands = await Brand.find();
            resolve({
                status: "OK",
                message: "Lấy danh sách banner thành công",
                data: brands
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Lấy banner hoạt động
const getActiveBrand = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const activeBrand = await Brand.find({ status: 'active' });
            resolve({
                status: "OK",
                message: "Lấy danh sách banner hoạt động thành công",
                data: activeBrand
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Cập nhật trạng thái banner
const updateBrandStatus = (brandId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedBrand = await Brand.findByIdAndUpdate(
                brandId,
                { status },
                { new: true } // Trả về banner đã được cập nhật
            );
            if (!updatedBrand) {
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy banner"
                });
            }
            resolve({
                status: "OK",
                message: "Cập nhật trạng thái thành công",
                data: updatedBrand
            });
        } catch (e) {
            reject(e);
        }
    });
};

// Xóa banner
const deleteBrand = (brandId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedBrand = await Brand.findByIdAndDelete(brandId);
            if (!deletedBrand) {
                return resolve({
                    status: "ERROR",
                    message: "Không tìm thấy brand"
                });
            }
            resolve({
                status: "OK",
                message: "Xóa brand thành công",
                data: deletedBrand
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createBrand,
    getAllBrand,
    getActiveBrand,  
    updateBrandStatus, 
    deleteBrand
};
