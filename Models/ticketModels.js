const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  createdBy: {
    type: type.Schema.Types.ObjectID,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: type.Schema.Types.ObjectID,
    ref: "User",
  },
  ticketCategory: {
    type: String,
    enum: ["Software", "Hardware", "Network"],
  },
  ticketHardwareSubCategory: {
    type: String,
    enum: ["Desktop", "Laptops", "Printers", "Servers", "Networking Equipment"],
  },
  ticketSoftwareSubCategory: {
    type: String,
    enum: [
      "Operating System",
      "Application Software",
      "Custom Software",
      "Integration Issues",
    ],
  },
  ticketNetworkSubCategory: {
    type: String,
    enum: ["Email Issues", "Internet Connection Problems", "Website Error"],
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
  },
  status: {
    type: String,
    enum: ["Open", "Closed", "In Progress", "Resolved"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
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
    max: 10,
    default: null, // You can set a default value if needed
  },
});

module.exports = mongoose.model('Ticket',ticketSchema);
module.exports.Schema = Ticket
