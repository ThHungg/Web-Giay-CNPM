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

// app.use(cors());

const cors = require('cors');
app.use(cors({
    origin: "https://cute-gumdrop-984ac1.netlify.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
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