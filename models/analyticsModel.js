const mongoose = require('mongoose');
const usersModel = require("./usersModel");
const ticketModel = require("./ticketModels");

const analyticsSchema = new mongoose.Schema({

    timeframe: {
        startDate:{type:Date,required:false},
        endDate:{type:Date,required:false}
    },
    analyticsFor:{
        type:String,
        enum:['Agent','ticketCategory','SubCategory'],
        required:true
    },
    analyticsDetails:{
        noOfTickets:{type:Number,required:true},
        avgRating:{type:Number,required:true},
        avgResolutionTime:{type:Number,required:true}
    }

},
{
    strict:true,
    timestamps:true
}
);
module.exports = mongoose.model('Analytics', analyticsSchema);
