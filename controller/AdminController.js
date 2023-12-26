
const User = require('../models/usersModel')
const bcrypt = require("bcrypt");

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const FaqModel = require('../models/FaqModel')
const queueModel = require('../models/queueModel')
const KnowledgeBaseModel = require('../models/KnowledgeBaseModel')
const backupMongoDB = require("../backup");
const restoreMongoDB = require("../restore");
const usersModel = require('../models/usersModel');
const UserPreferences = require('../models/UserPreferences')
const LogModel = require('../models/LogModel')



const AdminController = {

    CreateUser: async (req, res) => {
        try {
            const { UserName, Password, profile, Role } = req.body;
            const verificationToken = generateVerificationToken();
            sendVerificationEmail(UserName, Password, verificationToken, profile.email);

            const hashedPassword = await bcrypt.hash(Password, 10);

            const newUser = new User({
                UserName,
                Password: hashedPassword,
                profile,
                Role,
                verificationToken: verificationToken
            });
            if (Role == "Agent") {
                const users = await usersModel.find({ Role: "Agent" })
                if (users.length >= 3) {
                    return res.status(403).json({ message: "you can't add more than three agents" });
                }
                newUser.Highresponsibility = req.body.Highresponsibility;

                newUser.Midresponsibility = req.body.Midresponsibility;

                newUser.Lowresponsibility = req.body.Lowresponsibility;


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
    AddDataToKnowledgeBase: async (req, res) => {


        try {
            const { Category, SubCategory, Question, Answer } =
                req.body;
            const newKnowledgeBase = new KnowledgeBaseModel({
                Category,
                SubCategory,
                Question,
                Answer,
            });
            await newKnowledgeBase.save();
            res.status(201).json({ message: "Question added successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },

    ChangeTheme: async (req, res) => {
        try {

            const { mainTheme, secondaryTheme } = req.body;

            // Check if a document already exists
            let preferences = await UserPreferences.findOne();

            if (!preferences) {
                // If no document exists, create a new one
                preferences = new UserPreferences({
                    mainTheme,
                    secondaryTheme,
                });
            } else {
                // If a document exists, update the existing one
                preferences.mainTheme = mainTheme;
                preferences.secondaryTheme = secondaryTheme;
            }

            // Save the document to the collection
            await preferences.save();

            res.status(201).json({ message: "Theme changed successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },

    AddQueue: async (req, res) => {
        try {
            const { priorityOfQueue } = req.body

            const newQueue = new queueModel({ priorityOfQueue: priorityOfQueue });
            await newQueue.save();
            return res.status(201).json(newQueue);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    updateRole: async (req, res) => {
        try {
            const userId = req.params.id;
            const { role, Highresponsibility, Midresponsibility, Lowresponsibility } = req.body;
    
            const users = await usersModel.find({ Role: "Agent" });
    
            if (users.length >= 3 && role === "Agent") {
                return res.status(403).json({ message: "You can't add more than three agents" });
            }
    
            const userWithId = await usersModel.findById(userId);
    
            let updateObject = { Role: role };
    
            if (userWithId.Role === "Agent" && role !== "Agent") {
                if(userWithId.assignedTickets.length > 0) {
                    return res.status(403).json({ message: "You can't change the role of an agent who has assigned tickets" });
                }
                updateObject = { ...updateObject, Highresponsibility: null, Midresponsibility: null, Lowresponsibility: null };
            }
    
            if (role === "Agent" && (!Highresponsibility || !Midresponsibility || !Lowresponsibility)) {
                return res.status(403).json({ message: "Please fill all the fields" });
            }
    
            if (role === "Agent") {
                updateObject = { ...updateObject, Highresponsibility, Midresponsibility, Lowresponsibility };
            }
    
            const user = await usersModel.findByIdAndUpdate(userId, updateObject, { new: true });
    
            return res.status(200).json({ message: "Role updated" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    

    getAllUsers: async (req, res) => {
        try {
            const users = await usersModel.find().select('_id profile UserName Role Highresponsibility Midresponsibility Lowresponsibility');
            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
            return res.status(200).json(users);

        } catch (error) {
            return res.status(500).json({ message: error.message });

        }
    },

    backup: async (req, res) => {
        try {
            return res.status(200).json({ message: backupMongoDB() });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    restore: async (req, res) => {
        try {
            return res.status(200).json({ message: restoreMongoDB() });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getLogs: async (req, res) => {
        console.log("getLogs");
        try {
            const logs = await LogModel.find();
            console.log(logs);
            return res.status(200).json(logs);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

}
function generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
}
const sendVerificationEmail = async (username, pass, token, email) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS,
        },
    });

    const mailOptions = {
        to: email,
        subject: 'Account Verification',
        html: `<p>Please click the following link to verify your account:</p>
               <a href="${process.env.ORIGIN}/auth/verify?token=${token}">Verify</a>
               Your username:${username}
               Your passWord:${pass}`,
    };
    // 7afa4d9f-7c5b-4d0b-8d9f-3e8f7f3f8f2c

    transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
            console.error(error);
            reject('Error sending verification email');
        } else {
            console.log('Email sent: ' + info.response);
            resolve('Verification email sent');
        }
    });
}
module.exports = AdminController;

