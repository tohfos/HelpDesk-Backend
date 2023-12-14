const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema(
  {
    Category: {
      type: String,
      enum: ["Software", "Hardware", "Network"],
      required: true,
    },
    SubCategory: {
      type: String,
      validate: {
        validator: function (value) {
          if (this.Category === "Software") {
            return [
              "Operating System",
              "Application Software",
              "Custom Software",
              "Integration Issues",
            ].includes(value);
          } else if (this.Category === "Hardware") {
            return [
              "Desktop",
              "Laptops",
              "Printers",
              "Servers",
              "Networking Equipment",
            ].includes(value);
          } else if (this.Category === "Network") {
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
    Question: {
      type: String,
      required: true,
    },
    Answer: {
      type: String,
      required: true,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("FaqModel", FAQSchema);
