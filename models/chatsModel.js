const mongoose = require('mongoose');
const usersModel = require("./usersModel");
const chatSchema = new mongoose.Schema({

    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel" 
        },
    message:{
        type: String,
        minLength:1
    }



}
,
{
    timestamps:true

})

module.exports = mongoose.model('Chat',chatSchema);
//module.exports.Schema = chatSchema