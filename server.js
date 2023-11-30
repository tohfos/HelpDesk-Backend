require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const { logger } = require('./Middleware/logger');
const errorHandler = require('./Middleware/ErrorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const bodyParser = require("body-parser");
// const nodemailer = require('nodemailer');

// Routes
const userRouter = require("./Routes/userRoutes");
const AgentRouter = require("./Routes/AgentRoutes");
const adminRouter = require("./Routes/adminRoutes");
const authRouter = require('./Routes/authRoutes');
const messagingRouter = require('./Routes/messgaingRoute/messagingRoute')
const userController = require('./controller/userController')
const AgentController = require('./controller/AgentController')
const authenticateJWT = require('./Middleware/authenticateJWT');

// Socket.IO
const http = require('http');
const socketIO = require('socket.io');


const NormalPORT = process.env.PORT; // Use a default port if not provided in the environment
const MessagePORT = process.env.MESSAGE_PORT;

const app = express();
const messagingApiApp = express();
const server = http.createServer(messagingApiApp); // Create an HTTP server
const io = socketIO(server)


app.use(express.json());
messagingApiApp.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(errorHandler);
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRouter);
app.use(authenticateJWT);
messagingApiApp.use(authenticateJWT);
messagingApiApp.use('/api/chat/', messagingRouter);
app.use("/api/v1/agent/", AgentRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/admin/", adminRouter);



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (err) {
        console.log(err);
    }
};

connectDB();



// Socket.io integration
io.on('connection', (socket) => {
    console.log('A user connected');
    messagingApiApp.use('/api/chat/', messagingRouter);
    // Handle events (e.g., messages)
    socket.on('message', (data) => {
      // Broadcast the message to all connected clients
      io.emit('message', data);
      console.log(data)
    });
  
    // Handle disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

userController.initSocketIo(io);
AgentController.initSocketIo(io);


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(NormalPORT, () => console.log(`Server running on port ${NormalPORT}`));

    server.listen(MessagePORT, () => {
        console.log(`Messaging API server is running on port ${MessagePORT}`);
    });
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
