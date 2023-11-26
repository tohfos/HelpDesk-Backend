const User = require('../models/usersModel')
const bcrypt = require("bcrypt");

const userController = {

    register: async (req, res) =>{
        try {
            const { UserName, Password, profile } = req.body;
            const existingUser = await User.findOne({
                $or: [
                    { UserName },
                    { 'profile.email': profile.email },
                ],
            });
    
            if (existingUser) {
                if (existingUser.UserName === UserName) {
                    return res.status(409).json({ error: "Username already exists" });
                } else if (existingUser.profile.email == profile.email) {
                    return res.status(409).json({ error: "Email already exists" });
                }
            }
            const hashedPassword = await bcrypt.hash(Password, 10);
            
            const newUser = new User({
                UserName,
                Password: hashedPassword,
                profile,
            });
            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Server error" });
        }
    }


}

module.exports = userController;