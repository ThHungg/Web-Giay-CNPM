const Order = require('../models/Order')

const createOrder = (userId, items) => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const newOrder = new Order({ userId, items, total });
            await newOrder.save();

            resolve({
                status: "OK",
                message: "Tạo đơn hàng thành công",
                data: newOrder
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrders = (limit = 10, page = 0, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find(filter)
                .sort(sort)
                .limit(limit)
                .skip(limit * page)
                .populate('userId', 'name')
                .populate('items.productId', 'name price');

            resolve({
                status: "Ok",
                message: "Lấy danh sách đơn hàng thành công",
                data: orders
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateOrderStatus = (orderId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
            if (!updatedOrder) {
                resolve({
                    status: "ERR",
                    message: "Không tìm thấy đơn hàng"
                })
            }
            resolve({
                status: "OK",
                message: "Cập nhật thành công"
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                status: "OK",
                message: "Success",
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateOrder = (orderId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findById(orderId);
            if (checkOrder === null) {
                resolve({
                    status: "OK",
                    message: "Người dùng không xác định"
                })
            }

            const updateOrder = await Order.findByIdAndUpdate(orderId, data, { new: true })

            resolve({
                status: "OK",
                message: "Success",
                data: updateOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.findById(id).populate('items.productId', 'name price image')
            resolve({
                status: "OK",
                message: "Lấy danh sách đơn hàng thành công",
                data: orders
            });
        } catch (e) {
            reject(e);
        }
    })
}

const getHistoryOrder = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find({ userId }).populate('items.productId', 'name price image')
            resolve({
                status: "OK",
                message: "Lấy danh sách đơn hàng thành công",
                data: orders
            });
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getAllOrder,
    updateOrder,
    getDetailOrder,
    getHistoryOrder
}