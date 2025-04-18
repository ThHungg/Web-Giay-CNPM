const User = require("../models/User")
const bcrypt = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
require("dotenv").config();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const otpStore = new Map();

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser;
        try {
            const checkUser = await User.findOne({ email });
            if (checkUser) {
                return resolve({
                    status: "checkemail",
                    message: "Email đã tồn tại!"
                });
            }
            const hash = bcrypt.hashSync(password, 10)
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
                isBoss: checkUser.isBoss,
            })



            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin,
                isBoss: checkUser.isBoss,
            })


            //     id: checkUser.id,
            //     isAdmin: checkUser.isAdmin,
            //     isBoss: checkUser.isBoss,
            // });
            // const decoded = jwt.decode(refresh_token);

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
            if (checkUser === null) {
                resolve({
                    status: "Ok",
                    message: 'Người dùng không xác định'
                })
            }
            if (data.password) {
                data.password = bcrypt.hashSync(data.password, 10);
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
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

const updateDetailUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findById(id);
            if (checkUser === null) {
                resolve({
                    status: "Ok",
                    message: 'Người dùng không xác định'
                })
            }
            if (data.password) {
                data.password = bcrypt.hashSync(data.password, 10);
            }

            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
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

// const forgotPassword = (email) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const user = await User.findOne({ email });
//             if (!user) {
//                 return resolve({
//                     status: "ERR",
//                     message: "Email không tồn tại",
//                 });
//             }

//             const resetToken = crypto.randomBytes(32).toString("hex");
//             const hashedToken = await bcrypt.hash(resetToken, 10);

//             user.resetPasswordToken = hashedToken;
//             user.resetPasswordExpires = Date.now() + 3600000;
//             await user.save();

//             const transporter = nodemailer.createTransport({
//                 host: "smtp.gmail.com",
//                 port: 587,
//                 secure: false,
//                 auth: {
//                     user: process.env.EMAIL_USER,
//                     pass: process.env.EMAIL_PASS,
//                 },
//             });

//             // Chỉ định đúng email người dùng nhập
//             const mailOptions = {
//                 from: process.env.EMAIL_USER,
//                 to: email, // Sửa lỗi ở đây
//                 subject: "Yêu cầu đặt lại mật khẩu",
//                 text: `Nhấn vào đường link để đặt lại mật khẩu: ${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
//             };

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.error("Lỗi gửi email:", error);
//                     return resolve({
//                         status: "ERR",
//                         message: "Không thể gửi email, thử lại sau",
//                     });
//                 }
//                 console.log("Gửi email thành công:", info.response);
//                 resolve({
//                     status: "OK",
//                     message: "Email đặt lại mật khẩu đã được gửi!",
//                 });
//             });

//         } catch (e) {
//             console.error(e);
//             reject({
//                 status: "ERR",
//                 message: "Lỗi hệ thống, thử lại sau",
//             });
//         }
//     });
// };


// const sendOtp = (email) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const user = await User.findOne({ email });
//             if (!user) {
//                 return resolve({
//                     status: "ERR",
//                     message: "Email không tồn tại!",
//                 });
//             }

//             const otp = Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 số
//             otpStore.set(email, otp);

//             const transporter = nodemailer.createTransport({
//                 service: "gmail",
//                 auth: {
//                     user: process.env.EMAIL_USER,
//                     pass: process.env.EMAIL_PASS,
//                 },
//             });

//             await transporter.sendMail({
//                 from: "your-email@gmail.com",
//                 to: email,
//                 subject: "Mã OTP đặt lại mật khẩu",
//                 text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
//             });

//             resolve({
//                 status: "OK",
//                 message: "OTP đã được gửi qua email!",
//             });
//         } catch (e) {
//             reject({
//                 status: "ERR",
//                 message: "Lỗi hệ thống, thử lại sau!",
//             });
//         }
//     });
// };

const sendOtp = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return resolve({
                    status: "ERR",
                    message: "Email không tồn tại!",
                });
            }

            const now = Date.now();
            const lastSent = otpStore.get(`${email}_timestamp`);

            if (lastSent && now - lastSent < 5 * 60 * 1000) { // 5 phút
                return resolve({
                    status: "ERR",
                    message: "Vui lòng chờ 5 phút trước khi yêu cầu OTP mới!",
                });
            }

            const otp = Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 số
            otpStore.set(email, otp);
            otpStore.set(`${email}_timestamp`, now); // Lưu thời gian gửi OTP

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: "your-email@gmail.com",
                to: email,
                subject: "Mã OTP đặt lại mật khẩu",
                text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
            });

            resolve({
                status: "OK",
                message: "OTP đã được gửi qua email!",
            });
        } catch (e) {
            reject({
                status: "ERR",
                message: "Lỗi hệ thống, thử lại sau!",
            });
        }
    });
};


const verifyOtpAndResetPassword = (email, otp, newPassword) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!otpStore.has(email) || otpStore.get(email) !== parseInt(otp)) {
                return resolve({
                    status: "ERR",
                    message: "Mã OTP không hợp lệ hoặc đã hết hạn!",
                });
            }

            const user = await User.findOne({ email });
            if (!user) {
                return resolve({
                    status: "ERR",
                    message: "Email không tồn tại!",
                });
            }

            user.password = bcrypt.hashSync(newPassword, 10);
            await user.save();
            otpStore.delete(email); // Xóa OTP sau khi sử dụng

            resolve({
                status: "OK",
                message: "Mật khẩu đã được cập nhật thành công!",
            });
        } catch (e) {
            reject({
                status: "ERR",
                message: "Lỗi hệ thống, thử lại sau!",
            });
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
    sendOtp,
    verifyOtpAndResetPassword,
    updateDetailUser
};
