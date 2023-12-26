const bcrypt = require("bcrypt");
const ticketModel = require("../models/ticketModels");
const usersModel = require("../models/usersModel");
const FaqModel = require("../models/FaqModel");
const KnowledgeBaseModel = require("../models/KnowledgeBaseModel");
//const ticketModel = require("../models/ticketModels")
//const usersModel = require("../models/usersModel")
const chatsModel = require("../models/chatsModel");
const Queue = require("../queue");
const queueModel = require('../models/queueModel')
const nodemailer = require('nodemailer');
const { EventEmitter } = require('events');// modification
const notificationsModel = require("../models/notificationsModel");
const { response } = require("express");
const userEvents = new EventEmitter();// modification

// userEvents.on('ticketSolved', (userId) => {
//   Notification.requestPermission.then(perm =>  {
//     if(perm=== "granted"){
//       const notification =new Notification("ticket is solved" , {
//       body: `ticket is solved for user ${userId}`,
//       //icon: "../logo.svg",
//       tag:"ticket solved"
//           });
//     }
//   })
// })




// userEvents.on('ticketCreated', (userId) => {
//   Notification.requestPermission.then(perm =>  {
//     if(perm=== "granted"){
//       const notification =new Notification("ticket is created" , {
//       body: `ticket is Created for user ${userId}`,
//       //icon: "../logo.svg",
//       tag:"ticket created"
//           });
//     }
//   })
// })
const userController = {

  createTicket: async (req, res) => {

    try {
      const category = req.body.ticketCategory

      // const Agent_id= await assignAgent(category);

      const ticket = new ticketModel({
        createdBy: req.userId,
        // assignedTo:Agent_id,
        ticketCategory: category,
        priority: req.body.priority,
        status: "Open",
        title: req.body.title,
        description: req.body.description
      });

      if (category != "Other") {
        ticket.SubCategory = req.body.SubCategory;
      } else {

        const agents = await usersModel.find({ Role: "Agent" })
        const randomAgent = agents[Math.floor(Math.random() * 3)];

        console.log("Agents:", agents)
        ticket.assignedTo = randomAgent._id;

        const chat = new chatsModel({ "ticketId": ticket, "userId": req.userId, "agentId": randomAgent._id , "title": ticket.title})
        const newChat = await chat.save();

        ticket.hasChat = true
        const newticket = await ticket.save();

        console.log(newChat);
        sendEmail(`Ticket created ${newticket.title}`, `Ticket Created And Their is Chat Opend For You `, req.email);
        return res.status(201).json({ "ticket": newticket, "hasChat": newticket.hasChat, message: 'Ticket has been created' });
      }

      const newticket = await ticket.save();

      await addtoQ(newticket);
      await assigneAgent();

      const actualTicket = await ticketModel.findById(newticket._id)
      const Notification = new notificationsModel({text:`Ticket ${actualTicket.title} has been assigned to you`,date : Date.now(), userid: actualTicket.assignedTo});
      await Notification.save();

      sendEmail(`Ticket created ${newticket.title}`, `Ticket created `, req.email);

      return res.status(201).json({ "ticket": newticket, "hasChat": newticket.hasChat });


    }
    catch (e) {
      return res.status(500).json({ message: e.message });
    }
  },


  rateTicket: async (req, res) => {
    try {
      const ticket = await ticketModel.findById(req.params.id);
      if (!ticket) { return res.status(404).json({ message: "ticket Not Found" }) }

      if (ticket.createdBy != req.userId) {
        return res.status(403).json({ message: "Not Your Ticket" });
      }

      if (ticket.status != "Resolved") {
        return res.status(500).json({ message: "Ticket is Not Resolved" });
      }
      if (ticket.rating != null) {
        return res.status(500).json({ message: "Ticket is already Rated" });
      }

      const update = { rating: req.body.rating };
      const ticketupdate = await ticketModel.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
      );

      sendEmail("Ticket rate", `You Have Rated Your Ticket ${ticket.title}`, req.email)
      return res.status(200).json({ message: "ticket rated successfully" });

    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  OpenChat: async (req, res) => {
    const ticket = await ticketModel.findById(req.params.id);
    if (!ticket) { return res.status(404).json({ message: "ticket Not Found" }) }
    if (ticket.status != "Resolved") {
      return res.status(500).json({ message: "Ticket is Not Resolved" });
    }
    if(ticket.hasChat === true){
      console.log("in ot not")
      const chat = await chatsModel.findOne({ ticketId: req.params.id })
      return res.status(200).json({ "chat": chat })
    }
    
    const chat = new chatsModel({ "ticketId": ticket, "userId": req.userId, "agentId": ticket.assignedTo, "title": ticket.title })
    const newChat = await chat.save();

    ticket.hasChat = true
    await ticket.save()
    sendEmail(`Chat is Opend For Ticket ${ticket.title}`, `check your message tab For the chat`, req.email)
    return res.status(200).json({ "chat": newChat })
  },

  setPassword: async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      console.log(req.userId);
      const user = usersModel.findByIdAndUpdate(
        req.userId,
        { Password: hashedPassword, firstTime: false },
        { new: true }
      );
      return res.status(200).json({ message: "Password reseten" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getTicket: async (req, res) => {
    try {
      const ticket = await ticketModel.find({ createdBy: req.userId });
      if (!ticket) {
        return res
          .status(404)
          .json({ message: "No tickets found created by you " });
      }

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

  getProfile: async (req, res) => {
    try {
      const user = await usersModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      return res.status(200).json(user.profile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getnotifcations: async (req, res) => {
    try {
      const user = await usersModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      console.log(user)
      const notifcations = await notificationsModel.find({userid : req.userId});
      console.log(notifcations)
      return res.status(200).json(notifcations);
    } catch (error) {
      return res.status(500).json({ message: error.message });

    }



  },
  updateProfile: async (req, res) => {
    try {
      const user = await usersModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      if (
        !req.body.firstName ||
        !req.body.lastName ||
        //  !req.body.email ||
        !req.body.phone
      ) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }
      user.profile.firstName = req.body.firstName;
      user.profile.lastName = req.body.lastName;
      //user.profile.email = req.body.email;
      user.profile.phone = req.body.phone;
      const updatedUser = await user.save();
      return res.status(200).json(updatedUser.profile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getFAQ: async (req, res) => {
    try {
      const FAQ = await KnowledgeBaseModel.find();
      return res.status(200).json(FAQ);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  postQuestion: async (req, res) => {
    try {
      const { Category, SubCategory, Question } = req.body;
      const question = new KnowledgeBaseModel({
        Question: Question,
        Category: Category,
        SubCategory: SubCategory,
      })
      const newQuestion = await question.save();
      return res.status(200).json(newQuestion);
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  },

  filterByCategory: async (req, res) => {
    try {
      const knowledge = await KnowledgeBaseModel.find({
        Category: req.params.Category,
      });


      return res.status(200).json(knowledge);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  filterBySubCategory: async (req, res) => {
    try {
      const knowledge = await KnowledgeBaseModel.find({
        Category: req.params.Category,
        SubCategory: req.params.SubCategory,
      });
      return res.status(200).json(knowledge);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAutomationAndWorkflow: async (req, res) => {
    try {
      const knowledge = await KnowledgeBaseModel.find({
        Category: req.params.Category,
        SubCategory: req.params.SubCategory,
      });
      const filteredKnowledge = knowledge.map((entry) => ({
        Description: entry.Description,
      }));
      return res.status(200).json(filteredKnowledge);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  GetAllChats: async (req, res) => {
    try {
      const chats = await chatsModel.find({ userId: req.userId });
     
      return res.status(200).json(chats);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  resetPassword: async (req, res) => {
    const oldpass = req.body.oldpass;
    const newpass = req.body.newpass;
    const user = await usersModel.findById(req.userId);
    const match = await bcrypt.compare(oldpass, user.Password);
    if (!match) return res.status(401).json({ message: "Wrong Password" });
    user.Password = await bcrypt.hash(newpass, 10);
    user.firstTime = false;

    await user.save();

    return res.status(200).json({ message: "password resetten " });
  },
};
const assignAgent = async (category) => {
  try {
    const agents = await usersModel
      .find({ Highresponsibility: category })
      .select("_id");
    return agents[0]._id;
  } catch (error) {
    throw new Error(error.message);
  }
};

const sendEmail = async (subject, body, toEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'gmail'
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
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const assignHelper = async (queue) => {
  if (queue.getSize() != 0) {
    const ticket = await queue.getTopTicket();
    const actualTicket = await ticketModel.findById(ticket._id);
    //console.log('ticket', ticket)
    // console.log("ticket category", actualTicket.ticketCategory)
    const agent = await usersModel.findOne({
      Highresponsibility: actualTicket.ticketCategory,
    });
    //console.log("agent1", agent)
    const agent2 = await usersModel.findOne({
      Midresponsibility: actualTicket.ticketCategory,
    });
    // console.log("agent2", agent2)
    const agent3 = await usersModel.findOne({
      Lowresponsibility: actualTicket.ticketCategory,
    });
    // console.log("agent3", agent3)

    const arr = agent.assignedTicket || [];
    const arr2 = agent2.assignedTicket || [];
    const arr3 = agent3.assignedTicket || [];

    if (arr.length < 5) {
      arr.push(actualTicket);
      await usersModel.findByIdAndUpdate(
        agent.id,
        { assignedTicket: arr },
        { new: true }
      );
      await ticketModel.findByIdAndUpdate(
        actualTicket.id,
        { assignedTo: agent },
        { new: true }
      );
      await queue.popTicket();
    } else if (arr2.length < 5) {
      arr2.push(actualTicket);
      await usersModel.findByIdAndUpdate(
        agent2.id,
        { assignedTicket: arr2 },
        { new: true }
      );
      await ticketModel.findByIdAndUpdate(
        actualTicket.id,
        { assignedTo: agent2 },
        { new: true }
      );
      await queue.popTicket();
    } else if (arr3.length < 5) {
      arr3.push(actualTicket);
      await usersModel.findByIdAndUpdate(
        agent3.id,
        { assignedTicket: arr3 },
        { new: true }
      );
      await ticketModel.findByIdAndUpdate(
        actualTicket.id,
        { assignedTo: agent3 },
        { new: true }
      );
      await queue.popTicket();
    }
    
  }
};

//-------
const assigneAgent = async () => {
  try {
    const highQueue = await queueModel.findOne({
      priorityOfQueue: "High Priority Queue",
    });
    const medQueue = await queueModel.findOne({
      priorityOfQueue: "Medium Priority Queue",
    });
    const lowQueue = await queueModel.findOne({
      priorityOfQueue: "Low Priority Queue",
    });
    if (highQueue.getSize() > 0) await assignHelper(highQueue);
    else if (highQueue.getSize() == 0 && medQueue.getSize() > 0)
      await assignHelper(medQueue);
    else await assignHelper(lowQueue);
  } catch (error) {
    throw new Error(error.message);
  }
};
const addtoQ = async (ticket) => {
  const highQueue = await queueModel.findOne({
    priorityOfQueue: "High Priority Queue",
  });
  const medQueue = await queueModel.findOne({
    priorityOfQueue: "Medium Priority Queue",
  });
  const lowQueue = await queueModel.findOne({
    priorityOfQueue: "Low Priority Queue",
  });
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




};

module.exports = { userController, userEvents };
