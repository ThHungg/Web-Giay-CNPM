const express = require("express");
const dotenv = require('dotenv');
const { default: mongoose } = require("mongoose");
const routes = require('./routes');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const cors = require('cors');

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors({
    origin: 'http://localhost:3000',  // Chỉ định rõ domain từ client
    credentials: true,                // Cho phép gửi cookies trong yêu cầu
}));
app.use(bodyParser.json())
app.use(cookieParser())

routes(app)

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect Db success!')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log("Server is running in port: " + port)
})