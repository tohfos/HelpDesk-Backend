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
      enum: ["Software", "Hardware", "Network"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    status: {
      type: String,
      enum: ["Open", "Closed", "In Progress", "Resolved"],
    },
    SubCategory: {
      type: String,
      validate: {
        validator: function (value) {
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
            return true;
          }
        },
        message: (props) =>
          `${props.value} is not a valid sub-category for the selected category.`,
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
      max: 10,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);