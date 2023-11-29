const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const ticketModel = require("../models/ticketModels");
const usersModel = require("../models/usersModel");
const FaqModel = require("../models/FaqModel");
const KnowledgeBaseModel = require("../models/KnowledgeBaseModel");

const userController = {
  createTicket: async (req, res) => {
    try {
      const Agent_id = await assignAgent(req.body.ticketCategory);
      const ticket = new ticketModel({
        createdBy: req.userId,
        assignedTo: Agent_id,
        ticketCategory: req.body.ticketCategory,
        SubCategory: req.body.SubCategory,
        priority: req.body.priority,
        status: "Open",
        title: req.body.title,
        description: req.body.description,
      });

      const newticket = await ticket.save();
      console.log(newticket);
      return res.status(201).json(newticket);
    } catch (e) {
      return res.status(500).json({ message: e.message });
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
  updateProfile: async (req, res) => {
    try {
      const user = await usersModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }
      if (
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.phone
      ) {
        return res.status(400).json({ message: "Please fill all the fields" });
      }
      user.profile.firstName = req.body.firstName;
      user.profile.lastName = req.body.lastName;
      user.profile.email = req.body.email;
      user.profile.phone = req.body.phone;
      const updatedUser = await user.save();
      return res.status(200).json(updatedUser.profile);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  getFAQ: async (req, res) => {
    try {
      const FAQ = await FaqModel.find();
      return res.status(200).json(FAQ);
    } catch (error) {
      return res.status(500).json({ message: error.message });
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
};
//helper method to assigne agents based on category

const assignAgent = async (category) => {
  try {
    const agents = await usersModel
      .find({ responsibility: category })
      .select("_id");
    return agents[0]._id;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = userController;
