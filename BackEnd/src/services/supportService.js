// services/supportService.js
const Support = require('../models/Support');
const nodemailer = require("nodemailer");

// Tạo yêu cầu hỗ trợ
const createSupportRequest = (supportData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newSupport = new Support({
                userId: supportData.userId,
                name: supportData.name,
                email: supportData.email,
                phone: supportData.phone,
                message: supportData.message,
            });

            const savedSupport = await newSupport.save();

            resolve({
                status: 'OK',
                message: 'Yêu cầu hỗ trợ đã được tạo thành công',
                data: savedSupport,
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi khi gửi yêu cầu hỗ trợ: ' + error.message,
            });
        }
    });
};

// Lấy tất cả yêu cầu hỗ trợ
const getAllSupportRequests = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const requests = await Support.find();
            resolve({
                status: 'OK',
                message: 'Lấy danh sách yêu cầu thành công.',
                data: requests,
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi khi lấy danh sách yêu cầu: ' + error.message,
            });
        }
    });
};

// Cập nhật trạng thái yêu cầu hỗ trợ
const updateRequestStatus = (requestId, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            const updatedRequest = await Support.findByIdAndUpdate(
                requestId,
                { status },
                { new: true } // Trả về đối tượng đã cập nhật
            );

            if (!updatedRequest) {
                return resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy yêu cầu hỗ trợ với ID: ' + requestId,
                });
            }

            resolve({
                status: 'OK',
                message: 'Cập nhật trạng thái yêu cầu thành công.',
                data: updatedRequest,
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: 'Đã xảy ra lỗi khi cập nhật trạng thái yêu cầu: ' + error.message,
            });
        }
    });
};




// Xóa yêu cầu hỗ trợ
const deleteSupportRequest = (requestId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const deletedRequest = await Support.findByIdAndDelete(requestId);

            if (!deletedRequest) {
                return resolve({
                    status: 'ERR',
                    message: `Không tìm thấy yêu cầu hỗ trợ với ID: ${requestId}`,
                });
            }

            resolve({
                status: 'OK',
                message: 'Yêu cầu hỗ trợ đã được xóa thành công.',
                data: deletedRequest,
            });
        } catch (error) {
            reject({
                status: 'ERR',
                message: `Đã xảy ra lỗi khi xóa yêu cầu hỗ trợ: ${error.message}`,
            });
        }
    });
};

const getSupportHistory = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const supports = await Support.find({ userId })
            resolve({
                status: "OK",
                message: "Lấy danh sách đơn hàng thành công",
                data: supports,
            });
            if (!supports || supports.length === 0) {
                reject(new Error("Không tìm thấy lịch sử hỗ trợ."));
                return;
            }
        } catch (e) {
            reject(e);
        }
    })
}

const sendResponseEmail = (userEmail, responseMessage) => {
    return new Promise(async (resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: "Phản hồi từ đội ngũ hỗ trợ",
            text: `Chúng tôi đã nhận được yêu cầu của bạn và sau đây là phản hồi của chúng tôi:\n\n${responseMessage}`,
        };

        try {
            await transporter.sendMail(mailOptions);
            resolve({ status: 'OK', message: 'Email phản hồi đã được gửi thành công' });
        } catch (error) {
            reject({ status: 'ERR', message: 'Lỗi khi gửi email: ' + error.message });
        }
    });
};


module.exports = {
    createSupportRequest,
    getAllSupportRequests,
    updateRequestStatus,
    deleteSupportRequest,
    getSupportHistory,
    sendResponseEmail
};
