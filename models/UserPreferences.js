const mongoose = require('mongoose');
const userPreferencesSchema = new mongoose.Schema(
    {
        mainTheme: {
            type: String,
            default: 'lofi'
        },
        secondaryTheme: {
            type: String,
            default: 'black'
        },
    },
    {
        strict: true,
        timestamps: true,
    }
);
module.exports = mongoose.model('UserPrefrences', userPreferencesSchema);