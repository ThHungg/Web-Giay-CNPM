const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const genneralAccessToken = (payload) => {
    const access_token = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30m' })
    return access_token
}

const genneralRefreshToken = (payload) => {
    const refresh_token = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}

const refreshTokenJwtService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('token', token)
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    console.log(err)
                    resolve({
                        status: "err",
                        message: 'The authemtication'
                    })
                }
                const { payload } = user
                const access_token = await genneralAccessToken({
                    id: payload?.id,
                    isAdmin: payload?.isAdmin
                })
                console.log('Access-Token', access_token)
                resolve({
                    status: "Ok",
                    message: "Sucess",
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