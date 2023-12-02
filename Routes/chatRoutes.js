const express = require('express');
const router = express.Router();
const ticketModel = require('../models/ticketModels');
const chatsModel = require('../models/chatsModel');

// Updated function to accept the io object as a parameter
const chatRoutes = (io) => {
  // Get all chats for a specific ticket


  router.get('/:ticketId', async (req, res) => {
    try {
      const ticketId = req.params.ticketId;
      const chats = await chatsModel.findOne({ ticketId }).populate('message.sender.UserName message.receiverId.UserName');
      if(!chats){
        res.status(401).json({ message: 'no chat found' });
      }
      res.json(chats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Create a new chat message
  router.post('/:ticketId', async (req, res) => {
    
    try {
      const ticket = await ticketModel.findById(req.params.ticketId).select("createdBy assignedTo");

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

      const newChatMessage = {
        sender: req.userId,
        receiverId: receiverId,
        message: req.body.messages,
      };
      //console.log(newChatMessage)

      const chat = await chatsModel.findOneAndUpdate(
        { ticketId: ticket._id, userId: user, agentId: agent },
        { $push: { "message": newChatMessage } },
        { new: true, upsert: true }
      ).populate('message.sender.UserName message.receiverId.UserName');
      
      res.json(chat);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  return router;
};

module.exports = chatRoutes;
