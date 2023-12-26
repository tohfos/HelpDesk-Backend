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
        ticketId:[{type: mongoose.Schema.Types.ObjectId,
            ref: "ticket",
            required: true,}],
        Rating:[{type:Number,required:false}],
        ResolutionTime:[{type:Number,required:false}]
    }

},
{
    strict:true,
    timestamps:true
}
);
module.exports = mongoose.model('Analytics', analyticsSchema);
