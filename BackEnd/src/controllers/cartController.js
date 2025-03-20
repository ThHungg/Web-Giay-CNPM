const Cart = require('../models/Cart');
const cartService = require('../services/cartService')

const addToCart = async (req, res) => {
    try {
        const { userId, productId, size, quantity, price } = req.body;
        console.log("Dữ liệu nhận được từ frontend:", req.body);
        if (!userId || !productId || !size) {
            return res.status(400).json({
                status: "ERR",
                message: "Vui lòng nhập đầy đủ thông tin"
            })
        }

        if (quantity <= 0 || price <= 0) {
            return res.status(400).json({
                status: "ERR",
                message: "Số lượng phải lớn hơn không"
            })
        }
        const cart = await cartService.addToCart(userId, productId, size, quantity, price);
        return res.status(200).json({
            status: "Success",
            cart
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi hệ thống vui lòng thử lại sau"
        })
    }
}

// const getCart = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         console.log(userId)
//         if (!userId) {
//             return res.status(400).json({
//                 status: "OK",
//                 message: "Thiếu userId"
//             })
//         }

//         const cart = await cartService.getCart(userId);
//         console.log("Dữ liệu giỏ hàng:", cart);
//         console.log("Sản phẩm trong giỏ hàng:", cart.data.products);

//         if (!cart || !cart.data || !cart.data.products || cart.data.products.length === 0) {
//             return res.status(200).json({
//                 status: "Success",
//                 message: "Giỏ hàng trống",
//                 cart: []
//             });
//         }

//         return res.status(200).json({
//             status: "Success",
//             cart
//         })
//     } catch (e) {
//         console.log('e', e)
//         return res.status(500).json({
//             status: "ERR",
//             message: "Lỗi hệ thống thử lại sau"
//         })
//     }
// }

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("User ID:", userId);

        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "Thiếu userId"
            });
        }

        const cart = await cartService.getCart(userId);
        console.log("Dữ liệu giỏ hàng:", cart);

        if (!cart || !cart.data) { // Kiểm tra nếu giỏ hàng null
            return res.status(200).json({
                status: "Success",
                message: "Giỏ hàng trống",
                cart: []
            });
        }

        console.log("Sản phẩm trong giỏ hàng:", cart.data.products || []);

        return res.status(200).json({
            status: "Success",
            cart
        });

    } catch (e) {
        console.log('Lỗi:', e);
        return res.status(500).json({
            status: "ERR",
            message: "Lỗi hệ thống thử lại sau"
        });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId, productId, size } = req.body;
        if (!userId || !productId || !size) {
            return res.status(400).json({ status: "ERR", message: "Vui lòng nhập đầy đủ thông tin" });
        }

        const result = await cartService.removeFromCart(userId, productId, size);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(500).json({ status: "ERR", message: e.message });
    }
};

module.exports = { addToCart, getCart, removeFromCart }