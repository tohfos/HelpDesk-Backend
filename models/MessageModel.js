const mongoose = require('mongoose');
const usersModel = require("./usersModel");
const chatsModel = require("./chatsModel");

const MessageSchema = new mongoose.Schema({

    sender: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        },
    chatid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    readBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },



}
,
{
    timestamps:true

})



module.exports = mongoose.model('message',MessageSchema);
