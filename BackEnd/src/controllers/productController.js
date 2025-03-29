const Product = require('../models/Product');
const productService = require('../services/productService')

const createProduct = async (req, res) => {
    try {
        const { name, brand, image, price, description } = req.body;
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

const updateProductStatus = async (req, res) => {
    try {
        const productId = req.params.id;
        const { status } = req.body;
        const response = await productService.updateProductStatus(productId, status);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "Lỗi hệ thống, vui lòng thử lại sau!"
        })
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

const softDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ status: "Error", message: "Sản phẩm không tồn tại" });
        }
        res.json({ status: "OK", message: "Sản phẩm đã được xóa mềm", data: product });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

const getActiveProduct = async (req, res) => {
    try {
        const response = await productService.getActiveProduct();
        return res.status(200).json(response);
    } catch (e) {
        console.error("Lỗi khi lấy sản phẩm hoạt động:", e);
        return res.status(500).json({
            message: "Lỗi hệ thống, vui lòng thử lại sau!",
        });
    }
};


const restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(
            id,
            { deletedAt: null },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ status: "Error", message: "Sản phẩm không tồn tại" });
        }
        res.json({ status: "OK", message: "Sản phẩm đã được khôi phục", data: product });
    } catch (error) {
        res.status(500).json({ status: "Error", message: error.message });
    }
};

const updateMultipleSold = async (req, res) => {
    try {
        const products = req.body; // Nhận danh sách sản phẩm cần cập nhật

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                status: "ERR",
                message: "Dữ liệu không hợp lệ, cần truyền danh sách sản phẩm"
            });
        }

        const response = await productService.updateMultipleSold(products);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi hệ thống, vui lòng thử lại sau!"
        });
    }
};

const getTopSellingProducts = async (req, res) => {
    try {
        const response = await productService.getTopSellingProducts();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống, vui lòng thử lại sau!",
        });
    }
};



module.exports = {
    createProduct,
    updateProduct,
    getDetailProduct,
    deleteProduct,
    getAllProduct,
    softDeleteProduct,
    restoreProduct,
    getActiveProduct,
    updateMultipleSold,
    updateProductStatus,
    getTopSellingProducts
};
