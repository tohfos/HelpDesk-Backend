const mongoose = require("mongoose")
const usersModel = require("./userModel");
const TicketsModel= require("./TicketsModel");

const TicketUpdatesSchema = new mongoose.Schema(

    {
        UpdateDetails:{

            type:String,
            required:true
        },
        UserID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "usersModel",
            requied: true,
        },
        TicketID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TicketsModel",
            requied: true,
        },
        date: {
            type: Date,
            default: Date.now,
          },
        },
        // schemaOptions
      {
        strict: true,
        timestamps: true,
      }
);
module.exports = mongoose.model('TicketUpdate',TicketUpdatesSchema);
module.exports.Schema = TicketUpdatesSchema
