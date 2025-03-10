const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const genneralAccessToken = (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
    return access_token
}

const genneralRefreshToken = (payload) => {
    const refresh_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}

const refreshTokenJwtService = (refreshToken) => {
    return new Promise((resolve, reject) => {
        try {
            // Kiểm tra tính hợp lệ của refreshToken
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    console.log(err)
                    return resolve({
                        status: "err",
                        message: 'The authentication has failed. Invalid refresh token.'
                    })
                }

                // Tạo access token mới
                const access_token = await genneralAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                console.log('New Access Token:', access_token)

                // Trả về access token mới
                resolve({
                    status: "Ok",
                    message: "Success",
                    access_token
                })
            })
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}
