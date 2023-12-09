const bcrypt = require("bcrypt");
const ticketModel = require("../models/ticketModels");
const usersModel = require("../models/usersModel");
const FaqModel = require("../models/FaqModel");
const KnowledgeBaseModel = require("../models/KnowledgeBaseModel");
//const ticketModel = require("../models/ticketModels")
//const usersModel = require("../models/usersModel")
const chatsModel = require("../models/chatsModel")
const Queue = require("../queue");

const userController = {
  

    createTicket: async (req,res)=>{
        try{
          const category=req.body.ticketCategory
          if(category!="others"){
            const ticket = new ticketModel({
            
            createdBy: req.userId,
            // assignedTo:Agent_id,
            ticketCategory: category,
            SubCategory:req.body.SubCategory,
            priority:req.body.priority,
            status:"Open",
            title:req.body.title,
            description:req.body.description
          });
        
            const newticket=await ticket.save();
            Queue.addtoQ(newticket);
            Queue.assigneAgent();
            return res.status(201).json(newticket);

        }else{
          const chat = new chatsModel({userId:req.userId})
          const newchat=await chat.save();
            console.log(newchat);
            return res.status(201).json(newchat);
        }

      }
        catch(e){
            return res.status(500).json({ message: e.message });
        }
    },
  



      rateTicket: async(req,res)=>{
        try {
          const ticket = await ticketModel.findById(req.params.id);
          if(!ticket){return res.status(404).json({message:"ticket Not Found"})}

          if(ticket.createdBy != req.userId){
            return res.status(403).json({ message: "Not Your Ticket" });
          }

          if(ticket.status != "Resolved"){
            return res.status(500).json({ message: "Ticket is Not Resolved" });
          }
          if(ticket.rating != null){
            return res.status(500).json({ message: "Ticket is already Rated" });
          }

          const update = {rating:req.body.rating};
          const ticketupdate = await ticketModel.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
          );
          return res.status(200).json({message: "ticket rated successfully"});
          
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },


      setPassword:async(req,res)=>{
        try {
          const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
          console.log(req.userId)
            const user = usersModel.findByIdAndUpdate(
            req.userId,
            {Password:hashedPassword,firstTime:false},
            {new:true}
            )
            return res.status(200).json({ message: "Password reseten"})
    
        }catch (error) {
          res.status(500).json({ message: error.message });
    
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
  resetPassword: async (req,res)=>{
   const oldpass =req.body.oldpass
   const newpass =req.body.newpass
   const user=  await usersModel.findById(req.userId)
   const match = await bcrypt.compare(oldpass, user.Password);
   if (!match) return res.status(401).json({ message: "Wrong Password" });
   user.Password=await bcrypt.hash(newpass,10)
   user.firstTime=false

   await user.save();

    return res.status(200).json({message:"password resetten "})
  }
};
//helper method to assigne agents based on category

//helper 


module.exports = userController;




