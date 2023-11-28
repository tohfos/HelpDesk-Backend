require('dotenv').config();
const express = require("express");
const { default: mongoose } = require('mongoose');
const { logger } = require('./Middleware/logger')
const errorHandler = require('./Middleware/ErrorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const bodyParser = require("body-parser");
const auth = require('./Middleware/authenticationMiddleware')

//const AuthRouter = require('./Routes/Auth')
const userRouter = require("./Routes/userRoutes");
const AgentRouter = require("./Routes/AgentRoutes");
const adminRouter = require("./Routes/adminRoutes");
const authRouter = require('./Routes/authRoutes')

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(logger)
app.use(cors(corsOptions))
app.use(bodyParser.json());
//app.use(auth)


//app.use("/api/v1",AuthRouter);
app.use("/api/v1/agent/",AgentRouter);
app.use("/api/v1/user/",userRouter);
app.use("/api/v1/admin/",adminRouter);
app.use('/auth', authRouter)


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