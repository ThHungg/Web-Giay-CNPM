const User = require("../models/User")
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { username, name, email, password, phone } = newUser;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser) {
                return resolve({
                    status: "checkemail",
                    message: "Email đã tồn tại!"
                });
            }
            const hash = bcrypt.hashSync(password, 10)
            // console.log('hash', hash)
            const createdUser = await User.create({
                username,
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
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser === null) {
                return resolve({
                    status: "checkUser",
                    message: "The user is not defined"
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                resolve({
                    status: "ERR",
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

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById(id);

            console.log('CheckUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: "Ok",
                    message: 'Người dùng không xác định'
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            console.log('updateUser', updateUser)

            resolve({
                status: "Ok",
                message: "Success",
                data: updateUser
            })
        } catch (e) {
            reject(e);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById(id);

            if (checkUser === null) {
                resolve({
                    status: "Ok",
                    message: 'Người dùng không xác định'
                })
            }

            await User.findByIdAndDelete(id)
            resolve({
                status: "Ok",
                message: "Xóa thành công",
            })
        } catch (e) {
            reject(e);
        }
    });
};

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: "Ok",
                message: "Sucess",
                data: allUser
            })
        } catch (e) {
            reject(e);
        }
    });
};

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(id);

            // console.log('CheckUser', checkUser)
            if (user === null) {
                resolve({
                    status: "Ok",
                    message: 'Người dùng không xác định'
                })
            }

            resolve({
                status: "Ok",
                message: "Sucess",
                data: user
            })
        } catch (e) {
            reject(e);
        }
    });
};



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
};
