const Cart = require('../models/Cart');
const Product = require('../models/Product')

const addToCart = (userId, productId, size, quantity, price) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return resolve({
                    status: "ERR",
                    message: "Sản phẩm không tồn tại"
                })
            }
            let cart = await Cart.findOne({ userId })

            if (!cart) {
                cart = new Cart({ userId, products: [], totalPrice: 0 });
            }

            const exitstingProduct = cart.products.find((p) => p.productId.equals(productId) && p.size === size)

            if (exitstingProduct) {
                exitstingProduct.quantity += quantity;
                exitstingProduct.price = price;
            } else {
                cart.products.push({ productId, size, quantity, price });
            }

            cart.totalPrice += product.price * quantity;
            await cart.save()

            resolve({
                status: "OK",
                message: "Thêm vào giỏ hàng thành công",
                data: cart
            })

        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}

const getCart = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ userId }).populate("products.productId");
            resolve({
                status: "OK",
                message: "Lấy thành công",
                data: cart
            })
        } catch (e) {
            reject(e);
        }
    })
}

const removeFromCart = (userId, productId, size) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ userId });
            if (!cart) {
                return resolve({
                    status: "ERR",
                    message: "Sản phẩm không tồn tại"
                })
            }

            cart.products = cart.products.filter((p) => !(p.productId.equals(productId) && p.size === size))
            await cart.save()
        } catch (e) {
            console.log(e)
            return reject({
                status: "ERR",
                message: "Lỗi hệ thống vui lòng thử lại sau"
            })
        }
    })
}




module.exports = { addToCart, getCart, removeFromCart };