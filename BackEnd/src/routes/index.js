const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const paymentRouter = require('./paymentRouter')
const reviewRouter = require('./reviewRouter')
const voucherRouter = require('./voucherRouter')
const statRouter = require('./statRouter')
const bannerRouter = require('./bannerRouter')
const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/cart', cartRouter)
    app.use('/api/order', orderRouter)
    app.use('/', paymentRouter)
    app.use('/api/review', reviewRouter)
    app.use('/api/voucher', voucherRouter)
    app.use('/api/stat', statRouter)
    app.use('/api/banner', bannerRouter)
}

module.exports = routes;