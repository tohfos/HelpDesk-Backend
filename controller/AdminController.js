
const User = require('../models/usersModel')
const UserPrefrences = require('../models/UserPreferences')
const bcrypt = require("bcrypt");

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const FaqModel = require('../models/FaqModel')
const queueModel = require('../models/queueModel')



const AdminController = {

    CreateUser: async (req, res) => {
        try {
            const { UserName, Password, profile ,Role} = req.body;
            const verificationToken = generateVerificationToken(); 
              sendVerificationEmail(UserName, Password,verificationToken,profile.email);

          const hashedPassword = await bcrypt.hash(Password, 10);

            const newUser = new User({
                UserName,
                Password: hashedPassword,
                profile,
                Role,
                verificationToken: verificationToken
            });
            if(Role=="Agent") {
                newUser.Highresponsibility=req.body.Highresponsibility;

                newUser.Midresponsibility=req.body.Midresponsibility;

                newUser.Lowresponsibility=req.body.Lowresponsibility;

                
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

    ChangeTheme: async (req, res) => {
        try {

            const { mainTheme, secondaryTheme } = req.body;

            // Check if a document already exists
            let preferences = await UserPrefrences.findOne();

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

    AddQueue : async (req, res) => {
        try {
            const { priorityOfQueue } = req.body
    
            const newQueue = new queueModel({ priorityOfQueue : priorityOfQueue});
            await newQueue.save();
            return res.status(201).json(newQueue);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    


}
function generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
  }
  const sendVerificationEmail = async (username,pass,token,email) => {
 
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
               <a href="http://localhost:3000/auth/verify?token=${token}">Verify</a>
               Your username:${username}
               Your passWord:${pass}`,
      };
  
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

