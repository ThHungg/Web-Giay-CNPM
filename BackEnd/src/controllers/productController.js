const productService = require('../services/productService')

const createProduct = async (req, res) => {
    try {
        const { name, brand, image, images, type, price, oldPrice, discount, description,
                sizeStock, stock, totalstock,category, rating, reviews, status } = req.body;
        console.log(req.body);
        if(!name || !brand || !image || !type || !price || !description || !sizeStock || !totalstock || !category){
            return res.status(200).json({
                status: "Err",
                message: "Vui lòng nhập đẩy đủ thông tin"
            })
        }
        const response = await productService.createProduct(req.body)
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!',
            error: e.message
        });
    }
}



module.exports = {
    createProduct,

};


// const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
// const { name, email, password, confirmPassword, phone } = req.body;
// const isCheckEmail = reg.test(email);

// if (!name || !email || !password || !confirmPassword || !phone) {
//     return res.status(200).json({
//         status: 'ERR',
//         message: 'Vui lòng nhập đầy đủ thông tin!'
//     });
// } else if (!isCheckEmail) {
//     return res.status(200).json({
//         status: 'ERR',
//         message: 'Email không hợp lệ!'
//     });
// } else if (password !== confirmPassword) {
//     return res.status(200).json({
//         status: 'ERR',
//         message: 'Mật khẩu và xác nhận mật khẩu không khớp!'
//     });
// }

// console.log('isCheckEmail', isCheckEmail);
// const response = await userService.createUser(req.body);
// return res.status(200).json(response);