const log = require('./Models/logsModel.js');

const logData = {

    Severity: "low",
    message: "test message"
}
 const newLog = new log(logData);
  newLog.save().then((result) => {
      console.log(result)
  }).catch((err) => {
      console.log(err)
  })
