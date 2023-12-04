require('dotenv').config();
const express = require("express");
const { default: mongoose } = require('mongoose');
const { logger } = require('./Middleware/logger')
const errorHandler = require('./Middleware/ErrorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const bodyParser = require("body-parser");
// const nodemailer = require('nodemailer');
//const auth = require('./Middleware/authenticationMiddleware')

//const AuthRouter = require('./Routes/Auth')
const userRouter = require("./Routes/userRoutes");
const AgentRouter = require("./Routes/AgentRoutes");
const adminRouter = require("./Routes/adminRoutes");
const authRouter = require('./Routes/authRoutes');
const authenticateJWT = require('./Middleware/authenticateJWT');
const chatRoutes = require('./Routes/chatRoutes')

//const chatRoutes = require('./Routes/chatRoutes')
const PORT = process.env.PORT



const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(logger)
app.use(cors(corsOptions))
app.use(bodyParser.json());

//testing
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

//app.use("/api/v1",AuthRouter);
app.use('/auth', authRouter)
app.use(authenticateJWT)
app.use("/api/v1/agent/",AgentRouter);
app.use("/api/v1/user/",userRouter);
app.use("/api/v1/admin/",adminRouter);
app.use('/api/chats', chatRoutes(io));


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (err) {
        console.log(err)
    }
}
connectDB()


app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  
    // Join a room based on ticketId
    socket.on('joinRoom', (data) => {
      socket.join(data.roomName);
      console.log(`User ${socket.id} joined room ${data.roomName}`);
    });
  
    // Leave a room when disconnected
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      socket.leaveAll(); // Leave all rooms
    });
  });
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // e.g., 'gmail'
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASS,
//     },
//     });
// transporter.verify((error,seccess)=>{
//     if(error){
//         console.log(error)
//     } else {
//         console.log("ready for message")
//         console.log(seccess)
//     }
  
//     })
  



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
app.use(errorHandler)
mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})


