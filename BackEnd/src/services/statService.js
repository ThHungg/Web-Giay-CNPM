// const Order = require('../models/Order');
// const User = require('../models/User');
// const Product = require('../models/Product');
// const Stat = require('../models/Stat');

// const getMonthlyStat = async (month, year) => {
//     const start = new Date(`${year}-${month}-01`);
//     const end = new Date(start);
//     end.setMonth(start.getMonth() + 1);

//     // ✅ Kiểm tra nếu đã có thống kê => trả luôn
//     const existingStat = await Stat.findOne({ date: start });
//     if (existingStat) return existingStat;

//     // 📊 Lấy dữ liệu
//     const orders = await Order.find({ createdAt: { $gte: start, $lt: end } });
//     const users = await User.find({ createdAt: { $gte: start, $lt: end } });

//     const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
//     const totalOrders = orders.length;
//     const processingOrders = orders.filter(o => o.status === "Chờ xác nhận").length;
//     const successfulOrders = orders.filter(o => o.status === "Đã giao" || o.status === "Thanh toán thành công").length;
//     const failedOrders = orders.filter(o => o.status === "Đã hủy").length;
//     const newUsers = users.length;

//     const revenueByMethod = {
//         COD: orders.filter(o => o.paymentMethod === "COD").reduce((sum, o) => sum + o.total, 0),
//         Banking: orders.filter(o => o.paymentMethod === "Banking").reduce((sum, o) => sum + o.total, 0),
//     };

//     const productSalesMap = {};
//     orders.forEach(order => {
//         order.items.forEach(item => {
//             const id = item.productId.toString();
//             productSalesMap[id] = (productSalesMap[id] || 0) + item.quantity;
//         });
//     });

//     const sortedTopProducts = Object.entries(productSalesMap)
//         .sort(([, a], [, b]) => b - a)
//         .slice(0, 10);

//     const topSellingProducts = await Promise.all(
//         sortedTopProducts.map(async ([productId, totalSold]) => {
//             const product = await Product.findById(productId);
//             return {
//                 productId,
//                 name: product?.name || "Sản phẩm đã bị xóa",
//                 totalSold,
//             };
//         })
//     );

//     // ✅ Lưu vào DB
//     const createdStat = await Stat.create({
//         date: start,
//         totalRevenue,
//         totalOrders,
//         processingOrders,
//         successfulOrders,
//         failedOrders,
//         newUsers,
//         revenueByMethod,
//         topSellingProducts,
//     });

//     return createdStat;
// };

// module.exports = {
//     getMonthlyStat,
// };


const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Stat = require('../models/Stat');

// 🔎 Lấy dữ liệu đã lưu trong DB (nếu có)
const getMonthlyStat = async (month, year) => {
    const start = new Date(`${year}-${month}-01`);
    const stat = await Stat.findOne({ date: start });
    return stat || null;
};

// 🔄 Tính toán và cập nhật thống kê mới
const updateMonthlyStat = async (month, year) => {
    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);

    const orders = await Order.find({ createdAt: { $gte: start, $lt: end } });
    const users = await User.find({ createdAt: { $gte: start, $lt: end } });

    const totalRevenue = orders
        .filter(o => o.status === "Đã giao")
        .reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const processingOrders = orders.filter(o => o.status === "Chờ xác nhận").length;
    const successfulOrders = orders.filter(o => o.status === "Đã giao" || o.status === "Thanh toán thành công").length;
    const failedOrders = orders.filter(o => o.status === "Đã hủy").length;
    const newUsers = users.length;

    const revenueByMethod = {
        COD: orders.filter(o => o.status === "Đã giao" && o.paymentMethod === "COD").reduce((sum, o) => sum + o.total, 0),
        Banking: orders.filter(o => o.status === "Đã giao" && o.paymentMethod === "Banking").reduce((sum, o) => sum + o.total, 0),
    };

    const productSalesMap = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const id = item.productId.toString();
            productSalesMap[id] = (productSalesMap[id] || 0) + item.quantity;
        });
    });

    const sortedTopProducts = Object.entries(productSalesMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    const topSellingProducts = await Promise.all(
        sortedTopProducts.map(async ([productId, totalSold]) => {
            const product = await Product.findById(productId);
            return {
                productId,
                name: product?.name || "Sản phẩm đã bị xóa",
                totalSold,
            };
        })
    );

    const existing = await Stat.findOne({ date: start });

    if (existing) {
        return await Stat.findOneAndUpdate(
            { date: start },
            {
                totalRevenue,
                totalOrders,
                processingOrders,
                successfulOrders,
                failedOrders,
                newUsers,
                revenueByMethod,
                topSellingProducts,
            },
            { new: true }
        );
    } else {
        return await Stat.create({
            date: start,
            totalRevenue,
            totalOrders,
            processingOrders,
            successfulOrders,
            failedOrders,
            newUsers,
            revenueByMethod,
            topSellingProducts,
        });
    }
};

module.exports = {
    getMonthlyStat,
    updateMonthlyStat,
};
