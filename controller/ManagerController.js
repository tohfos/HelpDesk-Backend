const usersModel = require("../models/usersModel");
const ReportsModel = require("../models/ReportsModel");
const ticketModel = require("../models/ticketModel");


const ManagerController = {

    getReports: async (req, res) => {
        try {
            const reports = await ReportsModel.find();
            return res.status(200).json(reports);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

   

    getReportByTicket: async (req, res) => {
        try {
            const report = await ReportsModel.findOne({ ticket: req.params.ticketId });
            return res.status(200).json(report);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    getReportByAgent: async (req, res) => {
        try {
            const report = await ReportsModel.findOne({ Agent: req.params.userId });
            return res.status(200).json(report);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    
  







};













module.exports = ManagerController;


