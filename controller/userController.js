const User = require('../models/usersModel')
const bcrypt = require("bcrypt");
const ticketModel = require("../models/ticketModels")
const usersModel = require("../models/usersModel")
const chatsModel = require("../models/chatsModel")


const userController = {

    createTicket: async (req,res)=>{
        try{
          const category=req.body.ticketCategory
          if(category!="others"){
          const Agent_id= await assignAgent(category);
            const ticket = new ticketModel({
            
            createdBy: req.userId,
            assignedTo:Agent_id,
            ticketCategory: category,
            SubCategory:req.body.SubCategory,
            priority:req.body.priority,
            status:"Open",
            title:req.body.title,
            description:req.body.description
          });
        
            const newticket=await ticket.save();
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
  

    getTicket: async (req, res) => {
        try {
          const ticket = await ticketModel.find({"createdBy": req.userId});
          if(!ticket){return res.status(404).json({message:"No tickets found created by you "})}

          return res.status(200).json(ticket);
        } catch (error) {
          return res.status(500).json({ message: error.message });
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
          const hashedPassword = await bcrypt.hash(req.body.Password, 10);
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
        
    }
}
    //helper method to assigne agents based on category

const assignAgent = async (category) => {
  try {
      const agents = await usersModel.find({ responsibility: category }).select('_id');
      return agents[0]._id;
  } catch (error) {
      throw new Error(error.message);
  }
};



module.exports = userController;