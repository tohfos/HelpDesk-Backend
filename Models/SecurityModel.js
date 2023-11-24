const mongoose = require('mongoose');
const userModel = require("./usersModel.j")

const SecuritySchema = new mongoose.Schema(

    
        
        {

            EncryptionKey : { // low , medium , high
                type: String,
                minLength: 3,
                maxLength: 500,
            },

            DataProtectionDetails:{

                type: String,
                required: true,

            }
            ,

            BackupRecoveryDetails :{

                type: String,
                required: true,

            }
            ,
            user: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User', 
                required: true 
            }

            
            
        }
        ,
        {

            strict: true,
            timestamps:true
        }

);

module.exports = mongoose.model('SecurityModel',SecuritySchema);
module.exports.Schema = SecuritySchema;





