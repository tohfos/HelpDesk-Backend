const express = require('express');
const router = express.Router();
const ticketModel = require('../models/ticketModels');
const chatsModel = require('../models/chatsModel');


// Updated function to accept the io object as a parameter
const chatRoutes = (io) => {

//   // Get all chats for a specific ticket
//   io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('joinRoom', (data) => {
//       socket.join(data.RoomId);
//       console.log(`User ${socket.id} joined room ${data.RoomId}`);
//       socket.emit('Welcome', `Hello ${socket.id}! You joined room ${data.RoomId}`);
//       socket.broadcast.to(data.RoomId).emit('message', `User ${socket.id} joined room ${data.RoomId}`);
//     });

//     socket.on('newMessage', (data) => {
//       console.log(data);
//       socket.broadcast.to(data.RoomId).emit('newMessage', data.message);
//     }
//     );

//     // Leave a room when disconnected
//     socket.on('disconnect', () => {
//       console.log('User disconnected:', socket.id);
//       socket.leaveAll(); // Leave all rooms
//     });
//   });

//   router.get('/:ticketId', async (req, res) => {
//     try {
//       const ticketId = req.params.ticketId;

//       const chats = await chatsModel.findOne({ ticketId }).populate('message.sender.UserName message.receiverId.UserName');
//       if (!chats) {
//         res.status(401).json({ message: 'no chat found' });
//       }

//       if (req.userId != chats.userId || req.userId != chats.agentId) {
//         return res.status(500).json({ error: 'not your chat' });
//       }
//       res.json(chats);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

//   // Create a new chat message
//   router.post('/:ticketId', async (req, res) => {

//     try {
//       const ticket = await ticketModel.findById(req.params.ticketId).select("createdBy assignedTo");

//       if (!ticket) {
//         return res.status(404).json({ message: 'Ticket not found' });
//       }

//       if(req.userId != ticket.createdBy || req.userId != ticket.assignedTo){
//         return res.status(500).json({ error: 'not your chat' });
//       }

//       const user = ticket.createdBy;
//       const agent = ticket.assignedTo;
//       const sender = req.userId;
//       let receiverId = null;

//       if (req.role === "User") {
//         receiverId = agent;
//       } else {
//         receiverId = user;
//       }

//       const newChatMessage = {
//         senderId: req.userId,
//         receiverId: receiverId,
//         message: req.body.messages,
//       };
//       //console.log(newChatMessage)

//       const chat = await chatsModel.findOneAndUpdate(
//         { ticketId: ticket._id, userId: user, agentId: agent },
//         { $push: { "message": newChatMessage } },
//         { new: true, upsert: true }
//       ).populate('message.sender.UserName message.receiverId.UserName');

//       // io.to(roomName).emit('newMessage', req.body.message);
//       // io.emit('newMessage', req.body.message);
//       // broadcast the message to the sender and receiver
//       // io.to('1234').emit('newMessage', req.body.message);

//       res.status(200).json({ message: 'Message saved' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });

//   return router;
};

module.exports = chatRoutes;