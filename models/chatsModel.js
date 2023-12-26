const mongoose = require('mongoose');
const usersModel = require("./usersModel");


const chatSchema = new mongoose.Schema({

    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel" 
        },
    message:[{
        sender:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true },
        iv:{ type: String},
        timestamp: { type: Date, default: Date.now },
        
    }
],
    title:{ type: String, required: true },
}
,
{
    timestamps:true

})

module.exports = mongoose.model('Chat',chatSchema);
//module.exports.Schema = chatSchema