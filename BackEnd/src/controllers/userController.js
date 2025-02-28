const userService = require('../services/userService')

const createUser = async (req, res) => {
    try {
        console.log(req.body)
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        const {name, email, password, confirmPassWord, phone} = req.body
        if(!name || !email || !password || !confirmPassWord || !phone){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }else if(!isCheckEmail){
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }else if(password !== confirmPassWord){
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassWord '
            })
        }
        console.log('isCheckEmail', isCheckEmail)
        const result = await userService.createUser();
        return res.status(200).json(result); 
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser
}