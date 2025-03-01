const userService = require('../services/userService');

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const { name, email, password, confirmPassword, phone } = req.body;
        const isCheckEmail = reg.test(email);

        if (!name || !email || !password || !confirmPassword || !phone) {
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
        const { name, email, password, confirmPassword, phone } = req.body;
        const isCheckEmail = reg.test(email);

        if (!name || !email || !password || !confirmPassword || !phone) {
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
        const response = await userService.loginUser(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: 'Lỗi hệ thống, vui lòng thử lại sau!'
        });
    }
}
module.exports = {
    createUser,
    loginUser
};
