const ticketModel = require("../models/ticketModels");
const knowledgeBasedModel = require("../models/KnowledgeBaseModel");
const nodemailer = require('nodemailer');
const usersModel = require("../models/usersModel");
const queueModel = require('../models/queueModel')

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

      if(ticket.status!="In Progress"){
        return res
          .status(404)
          .json({ message: "ticket is not in progress " }); 
      }
      sendEmail(ticket.title,req.body.body,creatorEmail.profile.email);
      return res.status(200).json({message:"email sent"})
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
              console.log(req.user)
            sendEmail("Ticket started" ,`Agent: ${req.user} started testing a ticket ` ,creatorEmail.profile.email);
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
            const updatedUser = await usersModel.findOneAndUpdate(
              { _id: req.userId },
              { $pull: { assignedTicket: ticket.id } },
              { new: true }
          );
            console.log(updatedUser)
            const creatorEmail = await usersModel.findById(ticket.createdBy.toString())
            sendEmailWithHerf("Solved Ticket" ,`Agent: ${req.user} Solved testing ticket you can rate the ticket here ` ,creatorEmail.profile.email,req.params.id);
            assigneAgent();
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
};



const sendEmail = async (subject, body ,toEmail) => {
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


const sendEmailWithHerf = async (subject, body, toEmail,id) => {
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
  const htmlBody = `${body}<br/><a href="http://localhost:3000/api/v1/user/rate/${id}">Click here to rate the ticket</a>`;
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
const assignHelper = async(queue) =>{
  if (queue.getSize() != 0){
    const ticket = await queue.getTopTicket();
    const agent = await usersModel.findOne({ Highresponsibility: ticket.ticketCategory })
    const agent2 = await usersModel.findOne({ Midresponsibility: ticket.ticketCategory })
    const agent3 = await usersModel.findOne({ Lowresponsibility: ticket.ticketCategory })

    const arr=agent.assignedTicket|| [];
    const arr2=agent2.assignedTicket|| [];
    const arr3=agent3.assignedTicket|| [];
  
    if(arr.length<5){
      arr.push(ticket)
       await usersModel.findByIdAndUpdate(agent.id,
         {assignedTicket:arr},
        {new:true})
        await ticketModel.findByIdAndUpdate(ticket.id,{assignedTo:agent},{new:true}) 
        await queue.popTicket();
    }
       else  if(arr2.length<5){
          arr2.push(ticket);
          await usersModel.findByIdAndUpdate(agent2.id,
            {assignedTicket:arr2},
            {new:true})
            await ticketModel.findByIdAndUpdate(ticket.id,{assignedTo:agent2},{new:true}) 
            await queue.popTicket();

      }
      else if(arr3.length<5){
        arr3.push(ticket);
        await usersModel.findByIdAndUpdate(agent3.id,
          {assignedTicket:arr3},
          {new:true})
          await ticketModel.findByIdAndUpdate(ticket.id,{assignedTo:agent3},{new:true}) 
          await queue.popTicket();
      }
  }
    
}

//-------
 const assigneAgent =async () => {
  try {
    const highQueue = await queueModel.findOne({ priorityOfQueue : "High Priority Queue"});
    const medQueue = await queueModel.findOne({ priorityOfQueue : "Medium Priority Queue"});
    const lowQueue = await queueModel.findOne({ priorityOfQueue : "Low Priority Queue"});
    await assignHelper(highQueue);
    await assignHelper(medQueue);
    await assignHelper(lowQueue);
  } catch (error) {
    throw new Error(error.message);
  }
}
const addtoQ =async (ticket) => {
     const highQueue = await queueModel.findOne({ priorityOfQueue : "High Priority Queue"});
     const medQueue = await queueModel.findOne({ priorityOfQueue : "Medium Priority Queue"});
     const lowQueue = await queueModel.findOne({ priorityOfQueue : "Low Priority Queue"});
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
