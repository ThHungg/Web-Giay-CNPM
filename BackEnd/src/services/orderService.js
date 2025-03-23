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
    return new Promise(async (resolve))
}


module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
}