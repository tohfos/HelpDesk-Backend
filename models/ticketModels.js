const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    ticketCategory: {
      type: String,
      enum: ["Software", "Hardware", "Network", "Other"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
    },
    SubCategory: {
      type: String,
      required: function (value) {
        if (this.ticketCategory === "Software") {
          return [
            "Operating System",
            "Application Software",
            "Custom Software",
            "Integration Issues",
          ].includes(value);
        } else if (this.ticketCategory === "Hardware") {
          return [
            "Desktop",
            "Laptops",
            "Printers",
            "Servers",
            "Networking Equipment",
          ].includes(value);
        } else if (this.ticketCategory === "Network") {
          return [
            "Email Issues",
            "Internet Connection Problems",
            "Website Error",
          ].includes(value);
        } else {
          // Handle other cases or allow any value if needed
          return false;
        }
      },

    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    UpdateDetails: {

      type: String,
      required: false
    },
    updateDate: {
      type: Date,
      default: null,
      required: false
    },
    hasChat:{
      type:Boolean,
      default: false 

    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);