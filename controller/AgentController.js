const ticketModel = require("../models/ticketModels");
const knowledgeBasedModel = require("../models/KnowledgeBaseModel");
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

  startTicket: async (req, res) => {
    try {
      const ticket = await ticketModel
        .findById(req.params.id)
        .select("status assignedTo");
      if (!ticket) {
        return res.status(404).json({ message: "Ticket Not Found" });
      }
      if (ticket.assignedTo.toString() != req.userId) {
        return res
          .status(500)
          .json({ message: "you arenot assigned to that ticket " });
      }
      if (ticket.status == "Open") {
        const update = { status: "In Progress" };
        const ticket = await ticketModel.findByIdAndUpdate(
          req.params.id,
          update,
          { new: true }
        );
        return res
          .status(200)
          .json({ ticket, msg: "ticket opened successfully" });
      } else {
        return res.status(500).json({ message: "this isnot a opened ticket " });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  solveTicket: async (req, res) => {
    try {
      const ticket = await ticketModel
        .findById(req.params.id)
        .select("status assignedTo");
      if (!ticket) {
        return res.status(404).json({ message: "Ticket Not Found" });
      }

      if (ticket.assignedTo.toString() != req.userId) {
        return res
          .status(500)
          .json({ message: "you arenot assigned to that ticket " });
      }
      if (ticket.status == "In Progress") {
        const update = {
          status: "Resolved",
          UpdateDetails: req.body.UpdateDetails,
          updateDate: Date.now(),
        };
        const ticket = await ticketModel.findByIdAndUpdate(
          req.params.id,
          update,
          { new: true }
        );
        return res
          .status(200)
          .json({ ticket, msg: "ticket resolved successfully" });
      } else {
        return res
          .status(500)
          .json({ message: "this isnot a In Progress ticket " });
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
module.exports = AgentController;
