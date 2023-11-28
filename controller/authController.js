const usersModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

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

    const match = await bcrypt.compare(Password, foundUser.Password);

    if (!match) return res.status(401).json({ message: "Wrong Password" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          UserName: foundUser.UserName,
          role: foundUser.Role,
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

    // Send accessToken containing username and roles
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
              userid : foundUser._id,
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
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    res.json({ message: "Cookie cleared" });
  },
};

module.exports = authRoutes;
