const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    
    text: {
      type: String,
      required: true,
    },
    date:{
        type:Date,
        required:true
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

module.exports = mongoose.model("notification", NotificationSchema);