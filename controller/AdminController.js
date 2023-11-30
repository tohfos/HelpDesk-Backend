const User = require('../models/usersModel')
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const AdminController ={

    CreateUser: async (req, res) => {
        try {
            const { UserName, Password, profile ,Role} = req.body;
                      
           const hashedPassword = await bcrypt.hash(Password, 10);
           const verificationToken = generateVerificationToken(); 

            const newUser = new User({
                UserName,
               Password: hashedPassword,
                profile,
                Role,
                verificationToken:verificationToken
            });
            if(Role=="Agent") {
                newUser.responsibility=req.body.responsibility;
            }
            console.log(verificationToken)
            sendVerificationEmail(req.body.profile.email, verificationToken);
            
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },


}
function generateVerificationToken() {
    return crypto.randomBytes(20).toString('hex');
  }
  const sendVerificationEmail = async (email, verificationToken) => {
  
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
               <a href="http://localhost:3000/verify?token=${verificationToken}">Verify</a>`,
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