const User = require('../models/usersModel')
const bcrypt = require("bcrypt");

const userController = {

    createTicket: async (req,res)=>{
        try{
            const category=req.body.ticketCategory;
            console.log(category)
            const ticket = new ticketModel({
            
            createdBy: /* session*/req.params.id,
            //assignedTo:category === 'software' ? 1 : category === 'hardware' ? 2 : category === 'network' ? 3 : 0,
            ticketCategory: req.body.ticketCategory,
            ticketsubCategory: req.body.subcategory,
            priority:req.body.priority,
            status:"Open",
            title:req.body.title,
            description:req.body.description
          });
          console.log("ticket",ticket);
        
            const newticket=await ticket.save();
            console.log(newticket);
            return res.status(201).json(newticket);

        }
        catch(e){
            return res.status(500).json({ message: e.message });
        }
    },
    //helper method to assigne agents based on category
    // assigne:(category)=>{
    //     const result = category === 'software' ? '1' : param === 'hardware' ? '2' : param === 'network' ? '3' : 'Invalid parameter';
    //     return(result);
    // },
    //session

    getTicket: async (req, res) => {
        try {
          const ticket = await ticketModel.findById(req.params.id);
          return res.status(200).json(ticket);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },


}

module.exports = userController;