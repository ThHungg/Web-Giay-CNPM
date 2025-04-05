const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const paymentRouter = require('./paymentRouter')
const reviewRouter = require('./reviewRouter')
const voucherRouter = require('./voucherRouter')
const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/cart', cartRouter)
    app.use('/api/order', orderRouter)
    app.use('/', paymentRouter)
    app.use('/api/review', reviewRouter)
    app.use('/api/voucher', voucherRouter)
}

module.exports = routes;