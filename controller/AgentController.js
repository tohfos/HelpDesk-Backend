const ticketModel = require("../models/ticketModels");
const knowledgeBasedModel = require("../models/KnowledgeBaseModel");
const nodemailer = require('nodemailer');
const usersModel = require("../models/usersModel");
const chatsModel = require("../models/chatsModel")
const messageModel = require("../models/MessageModel")

// const ticketUpdatesModel = require('../models/TicketUpdatesModel')

const AgentController = {
  getTicket: async (req, res) => {
    try {
      const ticket = await ticketModel.find({ assignedTo: req.userId });
      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

    startTicket:async (req,res)=>{
        try {
          const ticket = await ticketModel.findById(req.params.id).select("status assignedTo createdBy"); 
          if(!ticket){return res.status(404).json({message:"Ticket Not Found"})}
          if(ticket.assignedTo.toString()!=req.userId){
            return res.status(500).json({ message: "you arenot assigned to that ticket " })
          }
          if(ticket.status=="Open"){
            const update = {status:"In Progress"};
            const ticket = await ticketModel.findByIdAndUpdate(
              req.params.id,
              update,
              { new: true }
            );

            const creatorEmail = await usersModel.findById(ticket.createdBy.toString())
            //console.log("creatorEmail",creatorEmail.profile.email)

            sendEmail("Ticket started" ,`Agent: ${req.username} started testing a ticket ` ,creatorEmail.profile.email);
            return res
              .status(200)
              .json({ ticket, msg: "ticket opened successfully" });
          }else{
            return res.status(500).json({ message: "this isnot a opened ticket " });

          }
        } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },

    

    solveTicket:async (req,res)=>{
        try {
          const ticket = await ticketModel.findById(req.params.id).select("status assignedTo createdBy"); 
          if(!ticket){return res.status(404).json({message:"Ticket Not Found"})}

          if(ticket.assignedTo.toString()!=req.userId){
            return res.status(500).json({ message: "you are not assigned to that ticket " })
          }       
          if(ticket.status=="In Progress"){
            const update = {status:"Resolved",UpdateDetails:req.body.UpdateDetails,updateDate:Date.now()};
            const ticket = await ticketModel.findByIdAndUpdate(
              req.params.id,
              update,
              { new: true }
            );
            const creatorEmail = await usersModel.findById(ticket.createdBy.toString())
            sendEmailWithHerf("Solved Ticket" ,`Agent: ${req.user} Solved testing ticket you can rate the ticket here ` ,creatorEmail.profile.email);
            return res
              .status(200)
              .json({ ticket, msg: "ticket resolved successfully" });
           
          }
          else{
            return res.status(500).json({ message: "this is not a In Progress ticket " });

          }
        } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },

  addWorkFlow: async (req, res) => {
    try {
      const { Category, SubCategory, Question, Answer } = req.body;
      const newKnowledge = new knowledgeBasedModel({
        Category,
        SubCategory,
        Question,
        Answer,
      });
      await newKnowledge.save();
      return res
        .status(201)
        .json({ message: "Knowledge entered successfuly", newKnowledge });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  },


  sendMessage: async (req,res)=>{
    try {
      const message = req.body.message;
      const sender = req.userId;
      const chatId = req.params.id;
  
      const chat = await chatsModel.findById(chatId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      const newMessage = new messageModel({ sender, message, chatid: chatId });
      await newMessage.save();
  
      chat.message.push(newMessage);
      await chat.save();
  
      // Emit a 'new message' event to the Socket.IO server
      // const io = getIo(); // Get the Socket.IO server instance
      // io.to(chatId).emit('chat message', newMessage);
      
      //console.log("chat: " + chat.message[0])
      return res.status(201).json({"chat":chat,"Message":newMessage.message});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

};



const sendEmail = async (subject, body ,toEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });
  const mailOptions = {
    to: toEmail,
    subject: subject,
    text: body,
  };
  try {
    
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
  

}


const sendEmailWithHerf = async (subject, body, toEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });
  // Add HTML markup for the hyperlink
  const htmlBody = `${body}<br/><a href="http://localhost:3000/api/v1/user/get">Click here to rate the ticket</a>`;
  const mailOptions = {
    to: toEmail,
    subject: subject,
    html: htmlBody, // Specify HTML content instead of plain text
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


module.exports = AgentController;
