const mongoose = require("mongoose")
const TicketUpdatesSchema = new mongoose.Schema(

    {


        Category: {
            type: String,
            enum: ["Software", "Hardware", "Network"],
            required:true
          },
          HardwareSubCategory: {
            type: String,
            enum: ["Desktop", "Laptops", "Printers", "Servers", "Networking Equipment"],
          },
          SoftwareSubCategory: {
            type: String,
            enum: [
              "Operating System",
              "Application Software",
              "Custom Software",
              "Integration Issues",
            ],
          },
          NetworkSubCategory: {
            type: String,
            enum: ["Email Issues", "Internet Connection Problems", "Website Error"],
          },

          Question: {
            type: String,
            required:true

          },
          Answer: {
            type: String,
            required:true
          }


    },
       // schemaOptions
       {
        strict: true,
        timestamps: true,
      }
)

module.exports = mongoose.model('TicketUpdatesModel',TicketUpdatesSchema);
module.exports.Schema = TicketUpdates
