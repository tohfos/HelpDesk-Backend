const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const FaqModel = require("../models/FaqModel");

const AdminController = {
  CreateUser: async (req, res) => {
    try {
      const { UserName, Password, profile, Role } = req.body;

      const hashedPassword = await bcrypt.hash(Password, 10);

      const newUser = new User({
        UserName,
        Password: hashedPassword,
        profile,
        Role,
      });
      if (Role == "Agent") {
        newUser.responsibility = req.body.responsibility;
      }
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },
  AddQuestionsToFAQ: async (req, res) => {
    try {
      const { Category, SubCategory, Question, Answer } = req.body;
      const newQuestion = new FaqModel({
        Category,
        SubCategory,
        Question,
        Answer,
      });
      await newQuestion.save();
      res.status(201).json({ message: "Question added successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = AdminController;
