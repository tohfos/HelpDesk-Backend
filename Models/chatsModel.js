const mongoose = require('mongoose');
const userModel = require("./usersModel.j")

const chatSchema = new mongoose.Schema({

    userId: { 
        type: type.Schema.Types.ObjectID,
        ref: "userModel"
    },
    agentId: {
        type: type.Schema.Types.ObjectID,
        ref: "userModel" 
        },
    timestamp: {
        type: Date,
        default: Date.now 
        },
    message:{
        type: String,
        minLength:1
    }



})

module.exports = mongoose.model('Chat',chatSchema);
module.exports.Schema = chatSchema