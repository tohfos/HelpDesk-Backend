const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(

{
    UserName:{
        type:String,
        minLength:8,
        maxLength:64,
        required:true

    },
    Password:{
        type:String,
        minLength:8,
        maxLength:64,
        required:true

    },
    Salt:{
        type:String,
        minLength:32,
        maxLength:400
    },
    Email:{
        type:String,
        minLength:3,
        maxLength:320,
        required:true
    },
    Phone:{
        type:String,
        minLength:11,
        maxLength:11
    },
    Role: {
        type: String,
        enum : ['user','admin','SupportAgent'],
        default: 'user'
    },



} // define attr

,



{
    strict:true,
    timestamps:true,
} // define options
















);

const User = mongoose.model('Users', userSchema);

module.exports.Schema = userSchema;













