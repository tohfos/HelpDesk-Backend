const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema(
    
        
        {

            Severity: { // low , medium , high
                type: String,
                minLength: 3,
                maxLength: 10,
              },
            message:{

                type: String,
                required: true,

            }
        }
        ,{

            strict: true,
            timestamps:true,
        }

);

module.exports = mongoose.model('logsModel',logsSchema);
module.exports.Schema = logsSchema





