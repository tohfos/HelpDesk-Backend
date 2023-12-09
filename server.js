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

//const auth = require('./Middleware/authenticationMiddleware')
const backupMongoDB = require("./backup");


// Routes
const userRouter = require("./Routes/userRoutes");
const AgentRouter = require("./Routes/AgentRoutes");
const adminRouter = require("./Routes/adminRoutes");
const authRouter = require('./Routes/authRoutes');
const userController = require('./controller/userController')
const AgentController = require('./controller/AgentController')
const authenticateJWT = require('./Middleware/authenticateJWT');
const chatRoutes = require('./Routes/chatRoutes')


const PORT = process.env.PORT
const app = express()

// Socket.IO
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app); 
const io = socketIO(server)


app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(errorHandler);
app.use(cors(corsOptions));
app.use(bodyParser.json());


// Routes
app.use('/auth', authRouter);
app.use(authenticateJWT);
app.use("/api/v1/agent/", AgentRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/admin/", adminRouter);
app.use('/api/chats', chatRoutes(io));




const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (err) {
        console.log(err);
    }

}



};

connectDB();

// Socket.io integration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room based on ticketId
  socket.on('joinRoom', (data) => {
    socket.join(data.roomName);
    console.log(`User ${socket.id} joined room ${data.roomName}`);
  });
  socket.on('newMessage', (data) => {
      const roomName = data.roomName;
  
      // Emit the new message only to the sender and receiver
      io.to(socket.id).to(roomName).emit('newMessage', data.message);
    });

  // Leave a room when disconnected
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socket.leaveAll(); // Leave all rooms
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});


mongoose.connection.once('open', () => {

    console.log('Connected to MongoDB');
    backupMongoDB();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

});
app.use(errorHandler)

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
