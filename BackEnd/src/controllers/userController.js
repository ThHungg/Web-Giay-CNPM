const userService = require('../services/userService');
const JwtService = require('../services/JwtService')
const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const { username, name, email, password, confirmPassword, phone } = req.body;
        const isCheckEmail = reg.test(email);

        if (!username || !name || !email || !password || !confirmPassword || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Vui lòng nhập đầy đủ thông tin!'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email không hợp lệ!'
            });
        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Mật khẩu và xác nhận mật khẩu không khớp!'
            });
        }

        console.log('isCheckEmail', isCheckEmail);
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
        console.log(req.body);
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
                status: 'email',
                message: 'Email không hợp lệ!'
            });
        }
        console.log('isCheckEmail', isCheckEmail);
        const response = await userService.loginUser(req.body);
        return res.status(200).json(response);
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
        console.log('UserId', userId)
        const response = await userService.updateUser(userId, data);
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
        console.log('UserId', userId)
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
        console.log('UserId', userId)
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
        const token = req.headers.token.split(' ')[1]
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

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken
};
