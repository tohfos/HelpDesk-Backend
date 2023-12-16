require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const { logger } = require('./Middleware/logger');
const errorHandler = require('./Middleware/ErrorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const bodyParser = require("body-parser");
const Knowledge = require('./models/KnowledgeBaseModel');
// const nodemailer = require('nodemailer');
//

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
// const io = socketIO(server)
const io = socketIO(server, {
  cors: {
    origin: process.env.REACT_APP_API_URL,
    methods: ['GET', 'POST'],
  }
});


app.use(express.json());
app.use(cookieParser());
app.use(logger);
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


connectDB();

mongoose.connection.once('open', () => {

  console.log('Connected to MongoDB');
//   backupMongoDB();
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

});
app.use(errorHandler)

mongoose.connection.on('error', err => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');

});


// app.get('/autocomplete', async (req, res) => {
//   const { q } = req.query;

//   if (!q) {
//     return res.status(400).json({ error: 'Query parameter "q" is required' });
//   }

//   try {
//     // Perform a case-insensitive search on relevant fields in your models
//     const knowledge = await Knowledge.find({ $text: { $search: q, $caseSensitive: false } }).exec();
 

//     // Combine and send the results as JSON
//     const results = [...knowledge];
//     res.json(results);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });