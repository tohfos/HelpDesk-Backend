const express = require('express');
const router = express.Router();
const ticketModel = require('../models/ticketModels');
const chatsModel = require('../models/chatsModel');

const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = process.env.KEY; // replace with your own secret key
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};
const decrypt = (hash,iv) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrpyted.toString();
};
// Updated function to accept the io object as a parameter
const chatRoutes = (io) => {

  // Get all chats for a specific ticket
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', (data) => {
      socket.join(data.RoomId);
      console.log(`User ${socket.id} joined room ${data.RoomId}`);
      socket.emit('Welcome', `Hello ${socket.id}! You joined room ${data.RoomId}`);
      socket.broadcast.to(data.RoomId).emit('message', `User ${socket.id} joined room ${data.RoomId}`);
    });


    socket.on('newMessage', (data) => {
      console.log(data);
      // socket.broadcast.to(data.RoomId).emit('newMessage', data.message);
      io.to(data.RoomId).emit('newMessage', data.message);
    }
    );

    // Leave a room when disconnected
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      socket.leaveAll(); // Leave all rooms
    });
  });

  router.get('/:ticketId', async (req, res) => {
    try {
      const ticketId = req.params.ticketId;
      const title = await ticketModel.findById(ticketId);
      const chats = await chatsModel.findOne({ ticketId }).populate('message.sender.UserName message.receiverId.UserName');

      if (!chats) {
        res.status(401).json({ message: 'no chat found' });
      }

      if (req.role === "User" && req.userId != chats.userId) {
        return res.status(500).json({ error: 'not your chat' });
      }

      if (req.role === "Agent" && req.userId != chats.agentId) {
        return res.status(500).json({ error: 'not your chat' });
      }
    
 
const decryptedMessages = chats.message.map(m => ({
    ...m.toObject(),
    message: decrypt(m.message, m.iv)
}));

// Construct the response object with decrypted messages
const response = {
    ...chats.toObject(),
    message: decryptedMessages,
    title:title.title
};
res.json(response);

      } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Create a new chat message
  router.post('/:ticketId', async (req, res) => {

    try {

      console.log(req.params.ticketId);

      const ticket = await ticketModel.findById(req.params.ticketId).select("createdBy assignedTo");

      console.log(ticket);

      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }



      const user = ticket.createdBy;
      const agent = ticket.assignedTo;
      const sender = req.userId;
      let receiverId = null;

      if (req.role === "User") {
        receiverId = agent;
      } else {
        receiverId = user;
      }
      const msg =encrypt(req.body.message);
 
      const newChatMessage = {
        sender: sender,
        receiverId: receiverId,
        message:msg.content,
        iv:msg.iv,
        title:ticket.title
    };
    console.log(newChatMessage)

      const chat = await chatsModel.findOneAndUpdate(
        { ticketId: ticket._id, userId: user, agentId: agent },
        { $push: { "message": newChatMessage } },
        { new: true, upsert: true }
      ).populate('message.sender.UserName message.receiverId.UserName');

      // io.to(roomName).emit('newMessage', req.body.message);
      // io.emit('newMessage', req.body.message);
      // broadcast the message to the sender and receiver
      // io.to('1234').emit('newMessage', req.body.message);

      res.status(200).json({ message: 'Message saved' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  return router;
};

module.exports = chatRoutes;