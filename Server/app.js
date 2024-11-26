const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const router = require('./routers/index.js')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

const port = 3010

let corsOptions = {
    origin: ['http://localhost:3002'],
    credentials:true,
}
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use('/', router)


const server = async () => {
    try {
        await mongoose.connect(process.env.Mongo_Link)
    } catch (e) {
        console.log(e);

    }
}
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
server()





