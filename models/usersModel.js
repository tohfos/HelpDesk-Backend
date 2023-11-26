const mongoose = require("mongoose")
const userSchema = new mongoose.Schema(

    {
        UserName: {
            type: String,
            unique: true,
            minLength: 8,
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
            minLength: 8,
            maxLength: 64,
            required: true
        },
        Role: {
            type: String,
            enum: ['User', 'Admin', 'Agent','Manager'],
            default: 'User'
        },

        tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tickets' }],

        responsibility: {
            type: {
                software: { type: Number, default: 0 },
                hardware: { type: Number, default: 0 },
                network: { type: Number, default: 0 },
            },
            required: function () {
                return this.Role === 'Agent';
            },
        },
    } // define attr
    ,
    {
        strict: true,
        timestamps: true,
    });

module.exports = mongoose.model('User', userSchema);












