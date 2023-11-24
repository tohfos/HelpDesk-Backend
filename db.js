require('dotenv').config();
const mongoose = require('mongoose');


const setupDB = async () => {
    try {
        // Connect to MongoDB
        mongoose
            .connect(process.env.DB_URL + "/" + process.env.DB_NAME, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() =>
                console.log('MongoDB Connected!')
            )
            .catch(err => console.log(err));
    } catch (error) {
        return null;
    }
};

module.exports = setupDB;
