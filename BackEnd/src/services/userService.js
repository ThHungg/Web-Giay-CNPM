const User = require("../models/User")
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser) {
                return resolve({
                    status: "ERR",
                    message: "Email đã tồn tại!"
                });
            }
            const hash = bcrypt.hashSync(password, 10)
            console.log('hash', hash)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            });

            if (createdUser) {
                resolve({
                    status: "OK",
                    message: "Tạo tài khoản thành công",
                    data: createdUser
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = userLogin;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser === null) {
                return resolve({
                    status: "Ok",
                    message: "The user is not defined"
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                resolve({
                    status: "Ok",
                    message: "Mật khẩu không đúng",
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
            })

            resolve({
                status: "Ok",
                message: "Success",
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createUser,
    loginUser
};
