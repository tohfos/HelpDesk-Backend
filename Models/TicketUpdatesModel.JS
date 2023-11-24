const mongoose = require("mongoose")
const TicketsModel= require("./TicketsModel");
const usersModel = require("./usersModel");

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
module.exports = mongoose.model('TicketUpdatesModel',TicketUpdatesSchema);
module.exports.Schema = TicketUpdatesSchema
