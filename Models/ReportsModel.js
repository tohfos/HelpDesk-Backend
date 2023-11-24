const mongoose = require('mongoose');
const userModel = require("./usersModel.j")

const ReportSchema = new mongoose.Schema(
    
        
        {

            ReportDetails : { 
                type: String,
                minLength: 3,
                maxLength: 500,
            },

            Timestamp:{

                type: Date,
                default: Date.now,

            }
            ,
            user: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true 
            }

            
            
        }
        ,
        {

            strict: true,
            timestamps:true,
        }

);

module.exports = mongoose.model('ReportsModel',ReportSchema);
module.exports.Schema = ReportSchema





