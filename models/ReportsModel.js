const mongoose = require('mongoose');
const userModel = require("./userModel")

const ReportSchema = new mongoose.Schema(
    
        
        {

            ReportDetails : { 
                type: String,
                minLength: 3,
                maxLength: 500,
            },
            ticket: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Ticket', 
                required: true 
            },
            user: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true 
            },
            Agent: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true 
            },

            
            
        }
        ,
        {

            strict: true,
            timestamps:true,
        }

);

module.exports = mongoose.model('Report',ReportSchema);
module.exports.Schema = ReportSchema





