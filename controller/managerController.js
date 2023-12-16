const usersModel = require("../models/usersModel");
const ticketModel = require("../models/ticketModels");
const reportModel = require("../models/ReportsModel");
const analyticsModel = require("../models/analyticsModel");


const ManagerController = {
    generateReport: async (req, res) => {
        try{
            const ticket = await ticketModel.findById(req.params.id).select("assignedTo rating status updateDate");
            if(!ticket){return res.status(404).json({message:"Ticket Not Found"})}
            var user ="the user that created this ticket is: "+ticket.createdBy;
            var agent="\nthe agent assigned to this ticket is: "+ticket.assignedTo;
            var line1 = "\nticket status is: " + ticket.status;
            if(ticket.status=="Resolved"){
                var resolutionTime = (ticket.updateDate - ticket.createdAt)/1000/60/60;
                var line2 = "\nticket was resolved in: " +resolutionTime +" hour(s)";
                var line3 = "\nthe agent responsible for resolving this ticket got a " +ticket.rating + " star rating for this ticket";
            }
            else{
                line2 = "\nticket is not yet resolved";
                line3 =""; 
            }
            var details = user+agent+line1+line2+line3;
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
        
    },
    getReports: async (req, res) => {
        try{
            const reports = await ReportsModel.find();
            return res.status(201).json(reports);
        }catch (error) {
            return res.status(500).json({ message: error.message });
            }
    },
    generateAnalyticsFor: async(req,res) => {
        try{
         const analyticsFor = req.body.analysisFor;
         return analyticsFor; 
        }catch(error){
            console.error('Error: ', error);
        }

    },
    generateAnalyticsForAgent: async (req,res)=>{
        try{
            const agent = req.params.id;
            const startDate= req.body.startDate;
            const endDate = req.bdy.endDate;
            var condition;
            if(startDate && endDate){
                condition = {
                    createdAt:{$gt:startDate},
                    updateDate:{$lt:endDate},
                    assignedTo:agent
            }
            }
            else if(startDate&&!endDate){
                 condition = {
                    createdAt:{$gt:startDate},
                    assignedTo:agent
            }
        }
            else if(!startDate&&endDate){
                 condition = {
                    updateDate:{$lt:endDate},
                    assignedTo:agent
                }
            }
            else{
                 condition = {
                    assignedTo:agent
                }
            }
            const result = await Ticket.aggregate([
                { $match: condition },
                {
                    $project: {
                      resolutionTime: { $subtract: ['$updateDate', '$createdAt'] },
                    },
                  },
                {
                  $group: {
                    _id: null,
                    count: { $sum: 1 },
                    meanRating: { $avg: '$rating' },
                    averageResolutionTime: { $avg: '$resolutionTime' },
                },
                },
              ]);
          
              const count = result.length > 0 ? result[0].count : null;
              const meanRating = result.length > 0 ? result[0].meanRating : null;
              const averageResolutionTime = result.length > 0 ? result[0].averageResolutionTime : null;
              const avgResolutionTimeInHours=averageResolutionTime/1000/60/60;
              const analysis = new analyticsModel({
                timeframe:{
                    startDate:startDate,
                    endDate:endDate
                },
                analyticsFor:'Agent',
                analyticsDetails:{
                    noOfTickets:count,
                    avgRating:meanRating,
                    avgResolutionTime:avgResolutionTimeInHours
                }
              });
              analysis=await analyticsModel.save();
              return res.status(201).json(analysis);
        }catch(error){
            return res.status(500).json({ message: error.message });
        }
    },
        generateAnalyticsForSubCategory: async (req,res)=>{
            try{
                const SubCategory = req.params.SubCategory;
                const startDate= req.body.startDate;
                const endDate = req.bdy.endDate;
                var condition;
                if(startDate && endDate){
                    condition = {
                        createdAt:{$gt:startDate},
                        updateDate:{$lt:endDate},
                        SubCategory:SubCategory
                }
                }
                else if(startDate&&!endDate){
                    condition = {
                        createdAt:{$gt:startDate},
                        SubCategory:SubCategory
                }
            }
                else if(!startDate&&endDate){
                    condition = {
                        updateDate:{$lt:endDate},
                        SubCategory:SubCategory
                    }
                }
                else{
                    condition = {
                        SubCategory:SubCategory
                    }
                }
                const result = await Ticket.aggregate([
                    { $match: condition },
                    {
                        $project: {
                          resolutionTime: { $subtract: ['$updateDate', '$createdAt'] },
                        },
                      },
                    {
                      $group: {
                        _id: null,
                        count: { $sum: 1 },
                        meanRating: { $avg: '$rating' },
                        averageResolutionTime: { $avg: '$resolutionTime' },
                    },
                    },
                  ]);
              
                  const count = result.length > 0 ? result[0].count : null;
                  const meanRating = result.length > 0 ? result[0].meanRating : null;
                  const averageResolutionTime = result.length > 0 ? result[0].averageResolutionTime : null;
                  const avgResolutionTimeInHours=averageResolutionTime/1000/60/60;
                  const analysis = new analyticsModel({
                    timeframe:{
                        startDate:startDate,
                        endDate:endDate
                    },
                    analyticsFor:'Agent',
                    analyticsDetails:{
                        noOfTickets:count,
                        avgRating:meanRating,
                        avgResolutionTime:avgResolutionTimeInHours
                    }
                  });
                  analysis=await analyticsModel.save();
                  return res.status(201).json(analysis);
            }catch(error){
                return res.status(500).json({ message: error.message });
            }
        },
        generateAnalyticsForCategory:  async (req,res)=>{
            try{
                const Category = req.params.Category;
                const startDate= req.body.startDate;
                const endDate = req.bdy.endDate;
                var condition;
                if(startDate && endDate){
                    condition = {
                        createdAt:{$gt:startDate},
                        updateDate:{$lt:endDate},
                        ticketCategory:Category
                }
                }
                else if(startDate&&!endDate){
                    condition = {
                        createdAt:{$gt:startDate},
                        ticketCategory:Category
                }
            }
                else if(!startDate&&endDate){
                    condition = {
                        updateDate:{$lt:endDate},
                        ticketCategory:Category
                    }
                }
                else{
                    condition = {
                        ticketCategory:Category               
                    }
                }
                const result = await Ticket.aggregate([
                    { $match: condition },
                    {
                        $project: {
                          resolutionTime: { $subtract: ['$updateDate', '$createdAt'] },
                        },
                      },
                    {
                      $group: {
                        _id: null,
                        count: { $sum: 1 },
                        meanRating: { $avg: '$rating' },
                        averageResolutionTime: { $avg: '$resolutionTime' },
                    },
                    },
                  ]);
              
                  const count = result.length > 0 ? result[0].count : null;
                  const meanRating = result.length > 0 ? result[0].meanRating : null;
                  const averageResolutionTime = result.length > 0 ? result[0].averageResolutionTime : null;
                  const avgResolutionTimeInHours=averageResolutionTime/1000/60/60;
                  const analysis = new analyticsModel({
                    timeframe:{
                        startDate:startDate,
                        endDate:endDate
                    },
                    analyticsFor:'Agent',
                    analyticsDetails:{
                        noOfTickets:count,
                        avgRating:meanRating,
                        avgResolutionTime:avgResolutionTimeInHours
                    }
                  });
                  analysis=await analyticsModel.save();
                  return res.status(201).json(analysis);
            }catch(error){
                return res.status(500).json({ message: error.message });
            }
        },





};


module.exports = ManagerController;
