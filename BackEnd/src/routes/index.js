const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const paymentRouter = require('./paymentRouter')
const routes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productRouter)
    app.use('/api/cart', cartRouter)
    app.use('/api/order', orderRouter)
    app.use('/', paymentRouter)
}

module.exports = routes;