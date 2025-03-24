const Product = require("../models/Product")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, brand, image, price, description, sizeStock, discount } = newProduct;
        try {
            const checkProduct = await Product.findOne({ name })
            if (checkProduct) {
                return resolve({
                    status: 'Ok',
                    message: 'Tên sản phẩm đã tồn tại'
                });
            }
            const createProduct = await Product.create({
                // name, brand, image, images, type, price, oldPrice, discount, description,
                // sizeStock, stock, totalstock, category, rating, reviews, status
                name, brand, image, price, description, sizeStock, discount, createdAt: Date.now()
            })
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