const User = require('../models/usersModel')
const bcrypt = require("bcrypt");
const ticketModel = require("../models/ticketModels")
const usersModel = require("../models/usersModel")



const userController = {

    createTicket: async (req,res)=>{
        try{

          const Agent_id= await assignAgent(req.body.ticketCategory);
            const ticket = new ticketModel({
            
            createdBy: req.userId,
            assignedTo:Agent_id,
            ticketCategory: req.body.ticketCategory,
            SubCategory:req.body.SubCategory,
            priority:req.body.priority,
            status:"Open",
            title:req.body.title,
            description:req.body.description
          });
        
            const newticket=await ticket.save();
            console.log(newticket);
            return res.status(201).json(newticket);

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