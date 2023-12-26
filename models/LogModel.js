const mongoose = require('mongoose');
const { format } = require('date-fns')

const LogSchema = new mongoose.Schema({
    dateTime: { type: String, default: format(new Date(), 'yyyyMMdd\tHH:mm:ss') },
    uuid:{
        type: String
    },
    message:{
        type: String
    },
    origin:{
        type: String
    }
});

module.exports = mongoose.model('Log', LogSchema);