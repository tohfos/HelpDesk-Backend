const User = require('../models/usersModel')
const bcrypt = require("bcrypt");

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const FaqModel = require('../models/FaqModel')



const AdminController ={

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
                verificationToken:verificationToken
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
            const { Question, Answer } = req.body;
            const newQuestion = new FaqModel({
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