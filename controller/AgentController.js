const ticketModel = require("../models/ticketModels");
const knowledgeBasedModel = require("../models/KnowledgeBaseModel");
const nodemailer = require('nodemailer');
const usersModel = require("../models/usersModel");
const notificationsModel = require("../models/notificationsModel")
const queueModel = require('../models/queueModel')
const { userEvents } = require('./userController');
const chatsModel = require('../models/chatsModel');

const AgentController = {
  getTicket: async (req, res) => {
    try {
      const ticket = await ticketModel.find({ assignedTo: req.userId });
      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getOneTicket: async (req, res) => {
    try {
      const ticket = await ticketModel.findById(req.params.id);
      if (!ticket) {
        return res
          .status(404)
          .json({ message: "No ticket found created by you " });
      }

      return res.status(200).json(ticket);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  communicate: async (req, res) => {
    try {
      const ticket = await ticketModel.findById(req.params.id);
      const creatorEmail = await usersModel.findById(ticket.createdBy.toString())
      console.log(ticket);
      if (!ticket) {
        return res
          .status(404)
          .json({ message: "No ticket found created by you " });
      }

      if (ticket.status != "In Progress") {
        return res
          .status(404)
          .json({ message: "ticket is not in progress " });
      }
      sendEmail(ticket.title,`Send By ${req.user} ${req.body.body}`, creatorEmail.profile.email);
      return res.status(200).json({ message: "email sent" })
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  startTicket: async (req, res) => {
    try {
      const ticket = await ticketModel.findById(req.params.id).select("status assignedTo createdBy");

      if (!ticket) { return res.status(404).json({ message: "Ticket Not Found" }) }
      const userId = ticket.createdBy;
      if (ticket.assignedTo.toString() != req.userId) {
        return res.status(500).json({ message: "you arenot assigned to that ticket " })
      }
      if (ticket.status == "Open") {
        const update = { status: "In Progress" };
        const ticket = await ticketModel.findByIdAndUpdate(
          req.params.id,
          update,
          { new: true }
        );

        const creatorEmail = await usersModel.findById(ticket.createdBy.toString())
        //console.log("creatorEmail",creatorEmail.profile.email)

        const Notification = new notificationsModel({text:`ticket ${ticket.title} is started by agent: ${req.user} `,date : Date.now(),userid:userId});
        const newNotification = await Notification.save();
       
        
        

        sendEmail("Ticket started", `Agent: ${req.user} started testing a ticket `, creatorEmail.profile.email);
        userEvents.emit('ticketCreated', userId); //TODO            

        return res
          .status(200)
          .json({ ticket, msg: "ticket opened successfully" });
      } else {
        return res.status(500).json({ message: "this isnot a opened ticket " });

      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
    }
  },

  solveTicket: async (req, res) => {
    try {
      const ticket = await ticketModel.findById(req.params.id).select("status assignedTo createdBy");
      if (!ticket) { return res.status(404).json({ message: "Ticket Not Found" }) }
      const userId = ticket.createdBy;
      if (ticket.assignedTo.toString() != req.userId) {
        return res.status(500).json({ message: "you are not assigned to that ticket " })
      }
      if (ticket.status == "In Progress") {
        const update = { status: "Resolved", UpdateDetails: req.body.UpdateDetails, updateDate: Date.now() };
        const ticket = await ticketModel.findByIdAndUpdate(
          req.params.id,
          update,
          { new: true }
        );
        const updatedUser = await usersModel.findOneAndUpdate(
          { _id: req.userId },
          { $pull: { assignedTicket: ticket.id } },
          { new: true }
        );
        console.log("after removing ticket", updatedUser)
        const creatorEmail = await usersModel.findById(ticket.createdBy.toString())

        const Notification = new notificationsModel({text:`ticket ${ticket.title} is solved by agent: ${req.user} `,date : Date.now(),userid:userId });
        const newNotification = await Notification.save();
       
     
        sendEmailWithHerf("Solved Ticket", `Agent: ${req.user} Solved testing ticket you can rate the ticket here `, creatorEmail.profile.email);
        assigneAgent();

        userEvents.emit('ticketSolved', userId);//TODO
        return res
          .status(200)
          .json({ ticket, msg: "ticket resolved successfully" });

      }
      else {
        return res.status(500).json({ message: "this is not a In Progress ticket " });

      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  addWorkFlow: async (req, res) => {
    try {
      const { Category, SubCategory, Description } = req.body;
      const newKnowledge = new knowledgeBasedModel({
        Category: Category,
        SubCategory: SubCategory,
        Description: Description
      });
      const knowledge = await newKnowledge.save();
      return res
        .status(201)
        .json({ message: "Knowledge entered successfuly", knowledge });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  GetAllChats: async (req, res) => { 
    try {
      const chats = await chatsModel.find({agentId: req.userId});
      return res.status(200).json(chats);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },


};



const sendEmail = async (subject, body, toEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
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


const sendEmailWithHerf = async (subject, body, toEmail, id) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  // Add HTML markup for the hyperlink
  const htmlBody = `${body}<br/><a href="${process.env.ORIGIN}/api/v1/user/rate/${id}">Click here to rate the ticket</a>`;
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
const assignHelper = async (queue) => {
  if (queue.getSize() != 0) {
    const ticket = await queue.getTopTicket();
    const actualTicket = await ticketModel.findById(ticket._id)
    const agent = await usersModel.findOne({ Highresponsibility: actualTicket.ticketCategory })
    const agent2 = await usersModel.findOne({ Midresponsibility: actualTicket.ticketCategory })
    const agent3 = await usersModel.findOne({ Lowresponsibility: actualTicket.ticketCategory })

    const arr = agent.assignedTicket || [];
    const arr2 = agent2.assignedTicket || [];
    const arr3 = agent3.assignedTicket || [];

    if (arr.length < 5) {
      arr.push(actualTicket)
      await usersModel.findByIdAndUpdate(agent.id,
        { assignedTicket: arr },
        { new: true })
      await ticketModel.findByIdAndUpdate(actualTicket.id, { assignedTo: agent }, { new: true })
      await queue.popTicket();
    }

    else if (arr2.length < 5) {
      arr2.push(actualTicket);
      await usersModel.findByIdAndUpdate(agent2.id,
        { assignedTicket: arr2 },
        { new: true })
      await ticketModel.findByIdAndUpdate(actualTicket.id, { assignedTo: agent2 }, { new: true })
      await queue.popTicket();

    }
    else if (arr3.length < 5) {
      arr3.push(actualTicket);
      await usersModel.findByIdAndUpdate(agent3.id,
        { assignedTicket: arr3 },
        { new: true })
      await ticketModel.findByIdAndUpdate(actualTicket.id, { assignedTo: agent3 }, { new: true })
      await queue.popTicket();
    }
  }

}

//-------
const assigneAgent = async () => {
  try {
    const highQueue = await queueModel.findOne({ priorityOfQueue: "High Priority Queue" });
    const medQueue = await queueModel.findOne({ priorityOfQueue: "Medium Priority Queue" });
    const lowQueue = await queueModel.findOne({ priorityOfQueue: "Low Priority Queue" });
    if (highQueue.getSize() > 0) await assignHelper(highQueue);
    else if (highQueue.getSize() == 0 && medQueue.getSize() > 0) await assignHelper(medQueue);
    else await assignHelper(lowQueue);
  } catch (error) {
    throw new Error(error.message);
  }
}
const addtoQ = async (ticket) => {
  const highQueue = await queueModel.findOne({ priorityOfQueue: "High Priority Queue" });
  const medQueue = await queueModel.findOne({ priorityOfQueue: "Medium Priority Queue" });
  const lowQueue = await queueModel.findOne({ priorityOfQueue: "Low Priority Queue" });
  // console.log(ticket.priority);
  switch (ticket.priority) {
    case "High":
      await highQueue.addTicket(ticket);
      break;
    case "Medium":
      await medQueue.addTicket(ticket);
      break;
    case "Low":
      await lowQueue.addTicket(ticket);
      break;
    default:
      // Handle any other cases here
      break;
  }







}



module.exports = AgentController;
