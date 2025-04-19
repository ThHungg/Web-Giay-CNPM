const userService = require('../services/userService');
const JwtService = require('../services/JwtService')
const createUser = async (req, res) => {
    try {
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const { name, email, password, phone } = req.body;
        const isCheckEmail = reg.test(email);

        if (!name || !email || !password || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập đầy đủ thông tin!'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email không hợp lệ!'
            });
        }
        const response = await userService.createUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const { username, name, email, password, confirmPassword, phone } = req.body;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập đầy đủ thông tin!'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email không hợp lệ!'
            });
        }
        const response = await userService.loginUser(req.body);
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        })
        return res.status(200).json(newResponse);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: "Err",
                message: 'The userId is required'
            })
        }
        const response = await userService.updateUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const updateDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(200).json({
                status: "Err",
                message: 'The userId is required'
            })
        }
        const response = await userService.updateDetailUser(userId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: "Err",
                message: 'The userId is required'
            })
        }
        const response = await userService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await userService.getAllUser();
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: "Err",
                message: 'The userId is required'
            })
        }
        const response = await userService.getDetailsUser(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        if (!token) {
            return res.status(200).json({
                status: "Err",
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        });
        return res.status(200).json({
            status: 'Ok',
            message: 'Đăng xuất thành công'
        });
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}

// const forgotPassword = async (req, res) => {
//     try {
//         const { email } = req.body;
//         if (!email) {
//             return res.status(400).json({
//                 status: "ERR",
//                 message: "Vui lòng nhập email",
//             });
//         }
//         const response = await userService.forgotPassword(email);
//         return res.status(200).json(response);
//     } catch (e) {
//         return res.status(500).json({
//             status: "ERR",
//             message: "Lỗi hệ thống, thử lại sau",
//         });
//     }
// };

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: 'ERR', message: 'Vui lòng nhập email!' });
        }
        const response = await userService.sendOtp(email);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi hệ thống!' });
    }
};

const verifyOtpAndResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ status: 'ERR', message: 'Thiếu thông tin!' });
        }
        const response = await userService.verifyOtpAndResetPassword(email, otp, newPassword);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({ message: 'Lỗi hệ thống!' });
    }
};



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    sendOtp,
    verifyOtpAndResetPassword,
    updateDetailUser
};
