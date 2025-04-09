// const statService = require("../services/statService");

// const getStatsByMonth = async (req, res) => {
//     try {
//         const { month, year } = req.query;

//         if (!month || !year) {
//             return res.status(400).json({ message: "Thiếu tham số tháng hoặc năm" });
//         }

//         const stats = await statService.getMonthlyStat(Number(month), Number(year));

//         res.status(200).json({ status: "OK", data: stats });
//     } catch (err) {
//         res.status(500).json({ message: "Lỗi khi lấy thống kê", error: err.message });
//     }
// };

// module.exports = {
//     getStatsByMonth,
// };


const statService = require("../services/statService");

const getStatsByMonth = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: "Thiếu tham số tháng hoặc năm" });
        }

        let stat = await statService.getMonthlyStat(month, year);

        // Nếu chưa có → tự động cập nhật
        if (!stat) {
            stat = await statService.updateMonthlyStat(month, year);
        }

        return res.status(200).json({
            status: "OK",
            data: stat,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Lỗi khi lấy thống kê",
            error: err.message,
        });
    }
};

// 👇 Có thể dùng route riêng để cập nhật thủ công (tuỳ bạn)
const forceUpdateStat = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: "Thiếu tham số tháng hoặc năm" });
        }

        const updated = await statService.updateMonthlyStat(month, year);

        return res.status(200).json({
            message: "Cập nhật thống kê thành công",
            data: updated,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Lỗi khi cập nhật thống kê",
            error: err.message,
        });
    }
};

module.exports = {
    getStatsByMonth,
    forceUpdateStat, // optional
};
