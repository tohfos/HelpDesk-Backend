const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(

    {
        UserName: {
            type: String,
            unique: true,
            minLength: 6,
            maxLength: 64,
            required: true
        },
        profile: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            phone: { type: String, required: true, unique: true }
            // Other profile information
        },
        Password: {
            type: String,
            // minLength: 8,
            maxLength: 64,
            
            required: true
        },
        OTP: {
            hashedOTP: {
              type: String,
              default: null,
            },
            OTPExpiry: {
              type: Date,
              default: null,
            },
          },
        Role: {
            type: String,
            enum: ['User', 'Admin', 'Agent','Manager'],
            default: 'User'
        },
        verificationToken: {
            type: String,
            default: null, // Set default as null initially
          },

        // tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tickets' }],
        // responsibilities:{
            Highresponsibility: {
                type: String,
                enum: ['Software', 'Hardware', 'Network'],
                
                required: function () {
                    return this.Role === 'Agent';
                },
            },
            Midresponsibility: {
                type: String,
                enum: ['Software', 'Hardware', 'Network'],
                
                required: function () {
                    return this.Role === 'Agent';
                },
            },
            Lowresponsibility: {
                type: String,
                enum: ['Software', 'Hardware', 'Network'],
                
                required: function () {
                    return this.Role === 'Agent';
                },
            },
        
        firstTime: {
            type: Boolean,
            default: true 
          },
          // Other parts of your schema remain unchanged

assignedTicket: {
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ticket"
    }],
    required: function () {
        return this.Role === 'Agent';
    },
    default: [],
    
}

        

    } // define attr
    ,
    {
        strict: true,
        timestamps: true,
    });
    userSchema.statics.findByVerificationToken = function (token) {
        return this.findOne({ verificationToken: token });
      };
module.exports = mongoose.model('User', userSchema);












