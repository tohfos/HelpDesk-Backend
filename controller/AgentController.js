const ticketModel = require('../models/ticketModels')
//const ticketUpdatesModel = require('../models/TicketUpdatesModels')


const AgentController={
    

    getTicket: async (req, res) => {
        try {
          const ticket = await ticketModel.findById(req.params.id);
          return res.status(200).json(ticket);
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      },

    startTicket:async (req,res)=>{
        try {
            const update = {status:"In Progress"};
            const ticket = await ticketModel.findByIdAndUpdate(
              req.params.id,
              update,
              { new: true }
            );
            return res
              .status(200)
              .json({ ticket, msg: "ticket opened successfully" });
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },

    closeTicket:async (req,res)=>{
        try {
            const update = {status:"Closed"};
            const ticketUpdate=new ticketUpdatesModel({
                UpdateDetails:req.body.details,
                UserID:/*session*/0,
                TicketID:req.param.id,

            })
            const ticket = await ticketModel.findByIdAndUpdate(
              req.params.id,
              update,
              { new: true }
            );
            const newticket=ticketUpdate.save();
            return res.status(201).json(newticket);
            // return res
            //   .status(200)
            //   .json({ ticket, msg: "ticket Closed successfully" });
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },

    solveTicket:async (req,res)=>{
        try {
            const ticketUpdate=new ticketUpdatesModel({
                UpdateDetails:req.body.details,
                UserID:/*session*/0,
                TicketID:req.param.id,

            })
            const update = {status:"Resolved"};
            const ticket = await ticketModel.findByIdAndUpdate(
              req.params.id,
              update,
              { new: true }
            );
            const newticket=ticketUpdate.save();
            return res.status(201).json(newticket);
            // return res
            //   .status(200)
            //   .json({ ticket, msg: "ticket Resolved successfully" });
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },







}
module.exports = AgentController;