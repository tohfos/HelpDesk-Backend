const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema(
  {
    
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
