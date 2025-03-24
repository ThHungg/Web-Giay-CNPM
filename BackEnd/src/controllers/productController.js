const productService = require('../services/productService')

const createProduct = async (req, res) => {
    try {
        // const { name, brand, image, images, type, price, oldPrice, discount, description,
        //     sizeStock, stock, totalstock, category, rating, reviews, status } = req.body;
        // console.log(req.body);
        const { name, brand, image, price, description, sizeStock, discount } = req.body;
        if (!name || !brand || !image || !price || !description) {
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

// const createProduct = async (req, res) => {
//     try {
//         const { name, brand, image, images, type, price, oldPrice, discount, description,
//             sizeStock, stock, totalstock, category, rating, reviews, status } = req.body;
//         console.log(req.body);
//         // if (!name || !brand || !image || !type || !price || !description || !sizeStock || !totalstock || !category)
//         if (!name || !brand || !image  || !price || !description)
//              {
//             return res.status(200).json({
//                 status: "Err",
//                 message: "Vui lòng nhập đẩy đủ thông tin"
//             })
//         }
//         const response = await productService.createProduct(req.body)
//         return res.status(200).json(response);
//     } catch (e) {
//         return res.status(404).json({
//             message: 'Lỗi hệ thống, vui lòng thử lại sau!',
//             error: e.message
//         });
//     }
// }

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: "Err",
                message: 'The userId is required'
            })
        }
        console.log('UserId', productId)
        const response = await productService.updateProduct(productId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: "Err",
                message: 'The productId is required'
            })
        }
        console.log('productId', productId)
        const response = await productService.deleteProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const getDetailProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: "Err",
                message: 'The productId is required'
            })
        }
        console.log('productId', productId)
        const response = await productService.getDetailProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        console.log('E', e)
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const getAllProduct = async (req, res) => {
    try {
        const response = await productService.getAllProduct();
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

// const softDeleteProduct = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const result = await productService.softDeleteProduct(id);
//         return res.status(200).json(result);
//     } catch (e) {
//         return res.status(500).json({ status: "Err", message: e.message });
//     }
// };

// const restoreProduct = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const result = await productService.restoreProduct(id);
//         return res.status(200).json(result);
//     } catch (e) {
//         return res.status(500).json({ status: "Err", message: e.message });
//     }
// };

module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    // softDeleteProduct,
    // restoreProduct

};
