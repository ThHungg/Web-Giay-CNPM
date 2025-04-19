// controllers/supportController.js
const supportService = require('../services/supportService');

// Tạo yêu cầu hỗ trợ
const createSupportRequest = async (req, res) => {
    const { name, email, phone, message, userId } = req.body;

    if (!name || !email || !message || !userId) {
        return res.status(400).json({
            status: "ERR",
            message: "Các trường tên, email, nội dung và userId là bắt buộc.",
        });
    }

    try {
        const response = await supportService.createSupportRequest({
            userId,
            name,
            email,
            phone,
            message,
        });

        res.status(201).json({
            status: "OK",
            message: "Yêu cầu hỗ trợ đã được gửi thành công.",
            data: response.data,
        });
    } catch (e) {
        res.status(500).json(e);
    }
};

// Lấy danh sách yêu cầu hỗ trợ
const getAllSupportRequests = async (req, res) => {
    try {
        const response = await supportService.getAllSupportRequests();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Cập nhật trạng thái yêu cầu hỗ trợ
const updateRequestStatus = async (req, res) => {
    const { id } = req.params; // Lấy requestId từ params
    const { status } = req.body; // Lấy status từ body

    // Kiểm tra nếu status là một trong các giá trị hợp lệ
    const validStatuses = ["Pending", "Resolved"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            status: "ERR",
            message: "Trạng thái không hợp lệ. Chỉ chấp nhận 'Pending' hoặc 'Resolved'."
        });
    }

    try {
        // Cập nhật trạng thái yêu cầu hỗ trợ thông qua service
        const response = await supportService.updateRequestStatus(id, status);

        // Kiểm tra nếu không tìm thấy yêu cầu nào với id
        if (response.status === 'ERR') {
            return res.status(404).json(response); // Trả về lỗi nếu không tìm thấy yêu cầu
        }

        res.status(200).json(response); // Trả về thành công
    } catch (error) {
        console.error("Error updating support request:", error); // Log lỗi
        res.status(500).json({
            status: "ERR",
            message: "Đã xảy ra lỗi khi cập nhật trạng thái yêu cầu: " + error.message
        }); // Trả về lỗi nếu có
    }
};



// Xóa yêu cầu hỗ trợ
const deleteSupportRequest = async (req, res) => {
    const { requestId } = req.params;  // Lấy requestId từ req.params
    try {
        const response = await supportService.deleteSupportRequest(requestId);  // Gọi service xóa yêu cầu
        res.status(200).json(response);  // Trả về phản hồi thành công
    } catch (error) {
        res.status(500).json(error);  // Trả về lỗi nếu có vấn đề
    }
};


// const getSupportHistory = async (req, res) => {
//     const { id } = req.params; // Lấy userId từ tham số trong URL

//     try {
//         // Gọi service để lấy lịch sử hỗ trợ theo userId
//         const supports = await supportService.getSupportHistory(id);

//         return res.status(200).json({
//             status: "OK",
//             message: "Lịch sử hỗ trợ lấy thành công",
//             data: supports, // Trả lại dữ liệu lịch sử hỗ trợ
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: "ERR",
//             message: error.message, // Trả lại lỗi nếu có
//         });
//     }
// };

const getSupportHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "Người dùng không tồn tại"
            });
        }
        const response = await supportService.getSupportHistory(userId);
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: "Lỗi hệ thống vui lòng thử lại sau"
        })
    }
}

module.exports = {
    createSupportRequest,
    getAllSupportRequests,
    updateRequestStatus,
    deleteSupportRequest,
    getSupportHistory
};
