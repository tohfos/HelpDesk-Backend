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
    }
  },
  {
    strict: true,
    timestamps: true,
  }
);

const notificationModel = mongoose.model('Log', NotificationSchema);

module.exports = { notificationModel }; 