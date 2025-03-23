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

// const removeFromCart = (userId, productId, size) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const cart = await Cart.findOne({ userId });
//             if (!cart) {
//                 return resolve({
//                     status: "ERR",
//                     message: "Sản phẩm không tồn tại"
//                 })
//             }

//             cart.products = cart.products.filter((p) => !(p.productId.equals(productId) && p.size === size))
//             await cart.save()
//         } catch (e) {
//             console.log(e)
//             return reject({
//                 status: "ERR",
//                 message: "Lỗi hệ thống vui lòng thử lại sau"
//             })
//         }
//     })
// }

const removeFromCart = (userId, productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                return reject({
                    status: 'ERR',
                    message: "Giỏ hàng không tồn tại"
                });
            }

            const updatedProducts = cart.products.filter(item => item.productId.toString() !== productId);

            if (updatedProducts.length === cart.products.length) {
                return reject({
                    status: "ERR",
                    message: "Sản phẩm không có trong giỏ hàng"
                });
            }

            cart.products = updatedProducts;

            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

            await cart.save();
            resolve(cart);
        } catch (e) {
            reject(e);
        }
    });
};

const updateCart = (userId, productId, quantity) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (quantity < 1) {
                return resolve({
                    status: "ERR",
                    message: "Số lượng phải lớn hơn 0"
                })
            }

            const cart = await Cart.findOne({ userId })

            if (!cart) {
                return resolve({
                    status: "ERR",
                    message: "Giỏ hàng không tồn tại"
                })
            }

            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId)

            if (productIndex === -1) {
                return resolve({
                    status: "ERR",
                    message: "Không có sản phẩm trong giỏ hàng"
                })
            }

            cart.products[productIndex].quantity = quantity;

            cart.totalPrice = cart.products.reduce((total, item) => total + item.quantity * item.price, 0);

            await cart.save();

            return resolve({
                staus: "OK",
                message: "Cập nhật thành công",
                data: cart
            })
            return cart;
        } catch (e) {
            reject(e)
        }
    })
}

const clearCart = (userId) => {
    new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ userId })

            if (!cart) {
                return reject({
                    status: "ERR",
                    message: "Giỏ hàng không tồn tại"
                })
            }
            cart.products = [];
            cart.totalPrice = 0;

            await cart.save();
            resolve(cart)
        } catch (e) {
            reject(e)
        }
    })
}



module.exports = { addToCart, getCart, removeFromCart, updateCart, clearCart };