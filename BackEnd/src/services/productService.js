const product = require("../models/Product")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, brand, image, images, type, price, oldPrice, discount, description,
            sizeStock, stock, totalstock, category, rating, reviews, status } = newProduct;
        try {
            const checkProduct = await product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                return resolve({
                    status: 'Ok',
                    message: 'Tên sản phẩm đã tồn tại'
                });
            }
            const createProduct = await product.create({
                name, brand, image, images, type, price, oldPrice, discount, description,
                sizeStock, stock, totalstock, category, rating, reviews, status
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

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await product.findById(id);

            console.log('checkProduct', checkProduct)
            if (checkProduct === null) {
                resolve({
                    status: "Ok",
                    message: 'Sản phẩm không xác định'
                })
            }

            const updatedProduct = await product.findByIdAndUpdate(id, data, { new: true })
            console.log('updatedProduct', updatedProduct)

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
            const checkProduct = await product.findById(id);

            // console.log('CheckUser', checkUser)
            if (checkProduct === null) {
                resolve({
                    status: "Ok",
                    message: 'Người dùng không xác định'
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

const getAllProduct = (limit, page) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await product.countDocuments()
            const allProduct = await product.find().limit(limit).skip(page * limit)
            resolve({
                status: "Ok",
                message: "Sucess",
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct/ limit),
            })
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const detailProduct = await product.findById(id);
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


module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct
};
