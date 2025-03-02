const product = require("../models/Product")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, brand, image, images, type, price, oldPrice, discount, description,
            sizeStock, stock, totalstock,category, rating, reviews, status } = newProduct;
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
            sizeStock, stock, totalstock,category, rating, reviews, status
            })
            if( createProduct ){
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




module.exports = {
    createProduct,
};
