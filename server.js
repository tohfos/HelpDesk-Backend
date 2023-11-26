require('dotenv').config();
const express = require("express");
const { default: mongoose } = require('mongoose');
const { logger } = require('./Middleware/logger')
const errorHandler = require('./Middleware/ErrorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const bodyParser = require("body-parser");
const AuthRouter = require('./Routes/Auth')
const userController = require("./controller/userController");


const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(logger)
app.use(cors(corsOptions))
app.use(bodyParser.json());


app.use("/api/v1",AuthRouter);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (err) {
        console.log(err)
    }
}
connectDB()


app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})