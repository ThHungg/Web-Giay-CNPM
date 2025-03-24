const orderService = require('../services/orderService');
const Order = require('../models/Order');

const createOrder = async (req, res) => {
    try {
        const { userId, items, total, shippingAddress, paymentMethod, note, customerInfo } = req.body;

        if (!userId || !items || !total || !shippingAddress || !paymentMethod || !customerInfo) {
            return res.status(400).json({ success: "ERR", message: "Thiếu trường bắt buộc." });
        }

        const order = new Order({
            userId,
            items,
            total,
            shippingAddress,
            paymentMethod,
            note,
            customerInfo
        });

        await order.save();
        res.status(201).json({ success: "OK", message: "Đặt hàng thành công!", order });
        console.log("Đặt hàng thành công!")
        // const response = await orderService.createOrder(req.body)
        // return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query;
        const response = await orderService.getAllOrders(Number(limit) || 10, Number(page) || 0, sort, filter);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const response = await orderService.updateOrderStatus(orderId, status);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
};

const getAllOrder = async (req, res) => {
    try {
        const response = await orderService.getAllOrder()
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: "Lỗi hệ thống vui lòng thử lại sau"
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        const data = req.body;
        if (!orderId) {
            return res.status(200).json({
                status: "Err",
                message: 'Người dùng không tồn tại'
            })
        }
        const response = await orderService.updateOrder(orderId, data);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const getOrdersByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "Người dùng không tồn tại"
            });
        }
        const response = await orderService.getOrdersByUserId(userId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: "Lỗi hệ thống vui lòng thử lại sau"
        })
    }
}
module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getAllOrder,
    updateOrder,
    getOrdersByUserId
};