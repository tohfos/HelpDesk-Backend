const mongoose = require('mongoose');
const usersModel = require("./usersModel");
const messageModel = require("./MessageModel");

const chatSchema = new mongoose.Schema({

    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel" 
        },
    message:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "message"
    }]

}
,
{
    timestamps:true

})

module.exports = mongoose.model('Chat',chatSchema);
//module.exports.Schema = chatSchema