const User = require('../models/usersModel')
const bcrypt = require("bcrypt");


const AdminController ={

    CreateUser: async (req, res) => {
        try {
            const { UserName, Password, profile } = req.body;
            const hashedPassword = await bcrypt.hash(Password, 10);

            const newUser = new User({
                UserName,
                Password: hashedPassword,
                profile,
            });
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    },


}

module.exports = AdminController;