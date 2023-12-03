const usersModel = require("../models/usersModel");
const ticketModel = require("../models/ticketModels");
const reportModel = require("../models/ReportsModel");

const ManagerController = {
    generateReport: async (req, res) => {
        try{
            const ticket = await ticketModel.findById(req.params.id).select("assignedTo rating status updateDate");
            if(!ticket){return res.status(404).json({message:"Ticket Not Found"})}
            var line1 = "ticket status is: " + ticket.status;
            if(ticket.status=="Resolved"){
                var resolutionTime = ticket.updateDate - ticket.timestamp;
                var line2 = "\nticket was resolved in: " +resolutionTime;
            }
            else{
                var line2 = "\nticket is not yet resolved";
            }
            var line3 = "\nthe agent responsible for resolving this ticket got a " +ticket.rating + " star rating for this ticket";
            var details = line1+line2+line3;
            const report = new reportModel({
                ReportDetails: details,
                user: ticket.assignedTo
            });
            report=await reportModel.save();
            return res.status(201).json(report);
        }catch (error) {
            return res.status(500).json({ message: error.message });
          }
    },
    getReportByID: async (req, res) => {
       try{
        const report = await ReportsModel.findById(req.params.id);
        return res.status(201).json(report);
        }catch (error) {
            return res.status(500).json({ message: error.message });
          }
        
    }






};


module.exports = ManagerController;
