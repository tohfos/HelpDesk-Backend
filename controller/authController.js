const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const nodemailer = require('nodemailer');
//const userController = require('/userController');


const authRoutes = {
  login: asyncHandler(async (req, res) => {
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await usersModel.findOne({ UserName }).exec();

    if (!foundUser) {
      return res.status(401).json({ message: "No such user exists" });
    }
    if( foundUser.verificationToken != null){
      return res.status(400).json({ message: "your account isnot verified check ur inbox" });
    }
    const match = await bcrypt.compare(Password, foundUser.Password);

    if (!match) return res.status(401).json({ message: "Wrong Password" });

    
    const { generatedOTP, expiry } = generateOTPWithExpiry();
   sendOTPByEmail(foundUser.profile.email, generatedOTP, expiry);
    // const isOTPValid = verifyOTP(OTP, generatedOTP, expiry);
    // if (!isOTPValid) {
    //   return res.status(401).json({ message: "Invalid OTP" });
    // }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.UserName,
          role: foundUser.Role,
          userid: foundUser._id,
          email: foundUser.profile.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { UserName: foundUser.UserName },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      // secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    if(foundUser.firstTime){
      return res.status(200).json({ accessToken, resetPassword: true });
    }
       res.json({ accessToken });


  }),

  

  refresh: (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt)
      return res.status(401).json({ message: "No Cookie found" });

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      asyncHandler(async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await usersModel
          .findOne({ UserName: decoded.UserName })
          .exec();

        if (!foundUser)
          return res.status(401).json({ message: "No user found" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.UserName,
              role: foundUser.Role,
              userid: foundUser._id,
              email: foundUser.profile.email,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      })
    );
  },

  logout: (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
    res.json({ message: "Cookie cleared" });
  },

  verify: async (req,res)=>{
    const { token } = req.query;

    try {
      const user = await usersModel.findByVerificationToken(token);
  
      if (!user) {
        return res.status(404).send('Invalid token or user not found');
      }
  
      user.verificationToken = null; 
      await user.save();
  
      res.send('Account verified successfully');
    } catch (error) {
      res.status(500).json({ message: error.message });

    }
    

  },
 
}
function generateOTPWithExpiry() {
  const generatedOTP = Math.random().toString(36).substr(2, 6); // Generate a new OTP
  const expiry = new Date(); // Set OTP expiry to current time
  expiry.setMinutes(expiry.getMinutes() + 5); // Set expiry time (e.g., 5 minutes from now)
  return { generatedOTP, expiry };
}

function verifyOTP(enteredOTP, generatedOTP, expiry) {
  // Check if the OTP has expired
  if (new Date() > expiry) {
    return false;
  }
  return enteredOTP === generatedOTP; // Compare entered OTP with the generated OTP
}

function sendOTPByEmail(email, otp, expiry) {
  const formattedExpiry = expiry.toLocaleString(); // Format expiry date as a string

  const transporter = nodemailer.createTransport({
    // Configure your email service details here
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const mailOptions = {
    to: email,
    subject: 'Your One-Time Password',
    text: `Your OTP is: ${otp}\nExpiry Date: ${formattedExpiry}` // Include expiry date in the email text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
module.exports = authRoutes;
