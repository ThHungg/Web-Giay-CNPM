const Product = require("../models/Product")
const { updateTotalStock } = require('../utils/totalStockUtils')

const generateProductCode = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); // Lấy giờ, đảm bảo 2 chữ số
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Lấy phút, đảm bảo 2 chữ số
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Lấy giây, đảm bảo 2 chữ số
    return `SP${hours}${minutes}${seconds}`;
};

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, brand, image, price, description, sizeStock, discount } = newProduct;
        const productCode = generateProductCode();
        try {
            const checkProduct = await Product.findOne({ name })
            if (checkProduct) {
                return resolve({
                    status: 'Ok',
                    message: 'Tên sản phẩm đã tồn tại'
                });
            }

            const oldPrice = price;
            const totalStock = updateTotalStock(sizeStock);
            const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

            const createProduct = await Product.create({
                name, brand, image, price: finalPrice, oldPrice, description, sizeStock, discount, totalStock, productCode, createdAt: Date.now()
            });
            if (createProduct) {
                resolve({
                    status: 'Ok',
                    message: 'Tạo sản phẩm thành công',
                    data: createProduct
                })
            }
        } catch (e) {
            reject(e);
        }
    });
};

// const createProduct = (newProduct) => {
//     return new Promise(async (resolve, reject) => {
//         const { name, brand, image, images, type, price, oldPrice, discount, description,
//             sizeStock, stock, totalstock, category, rating, reviews, status } = newProduct;
//         try {
//             const checkProduct = await product.findOne({
//                 name: name
//             })
//             if (checkProduct !== null) {
//                 return resolve({
//                     status: 'Ok',
//                     message: 'Tên sản phẩm đã tồn tại'
//                 });
//             }
//             const createProduct = await product.create({
//                 name, brand, image, images, type, price, oldPrice, discount, description,
//                 sizeStock, stock, totalstock, category, rating, reviews, status
//             })
//             if (createProduct) {
//                 resolve({
//                     status: 'Ok',
//                     message: 'Tạo sản phẩm thành công',
//                     data: createProduct
//                 })
//             }
//         } catch (e) {
//             reject(e);
//         }
//     });
// };

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findById(id);
            if (checkProduct === null) {
                resolve({
                    status: "ERR",
                    message: 'Sản phẩm không xác định'
                })
            }

            if (data.sizeStock) {
                data.totalStock = updateTotalStock(data.sizeStock);
            }
            if (data.discount !== undefined && data.price !== undefined) {
                data.oldPrice = checkProduct.oldPrice || checkProduct.price;
                data.price = Math.round(data.price * (1 - data.discount / 100));
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: "Ok",
                message: "Success",
                data: updatedProduct
            })
        } catch (e) {
            reject(e);
        }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findById(id);
            if (checkProduct === null) {
                resolve({
                    status: "Ok",
                    message: 'Sản phẩm không xác định'
                })
            }

            await product.findByIdAndDelete(id)
            resolve({
                status: "Ok",
                message: "Xóa thành công",
            })
        } catch (e) {
            reject(e);
        }
    });
};

const getAllProduct = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allProduct = await Product.find().sort({ createdAt: -1 });
            resolve({
                status: "Ok",
                message: "Success",
                data: allProduct,
            })
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailProduct = await Product.findById(id);
            if (detailProduct === null) {
                resolve({
                    status: "Ok",
                    message: 'Người dùng không xác định'
                })
            }

            resolve({
                status: "Ok",
                message: "Sucess",
                data: detailProduct
            })
        } catch (e) {
            reject(e);
        }
    });
};

// const softDeleteProduct = async (id) => {
//     try {
//         const checkProduct = await product.findById(id)
//         if (!checkProduct) {
//             return {
//                 status: "Err",
//                 message: "Sản phẩm không tồn tại"
//             }
//         }
//         await product.findByIdAndUpdate(id, { isDeleted: true })
//         return {
//             status: "Ok",
//             message: "Xóa mềm thành công"
//         }
//     } catch (e) {
//         reject(e);
//     }
// }

// const restoreProduct = async (id) => {
//     try {
//         const checkProduct = await product.findById(id)
//         if (!checkProduct) {
//             return {
//                 status: "Err",
//                 message: "Sản phẩm không tồn tại"
//             }
//         }
//         await product.findByIdAndUpdate(id, { isDeleted: false })
//         return {
//             status: "Ok",
//             message: "Khôi phục sản phẩm thành công"
//         }
//     } catch (e) {
//         reject(e);
//     }
// }


module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    // softDeleteProduct,
    // restoreProduct
};