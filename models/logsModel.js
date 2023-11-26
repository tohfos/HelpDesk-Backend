const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema(
  {
    Severity: {
      type: String,
      minLength: 3,
      maxLength: 10,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const LogsModel = mongoose.model('Log', logsSchema);

module.exports = { LogsModel }; // Change this line
//module.exports.Schema = logsSchema;