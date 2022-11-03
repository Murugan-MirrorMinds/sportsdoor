const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const config = require('./config');

const connectDB = () => {
    mongoose.connect(config.LOCAL_DB_URL, { useNewUrlParser: true }).then(
    () => { 
        console.log('db connected!');
    },
    err => { 
        console.log('something went wrong!');
    }
    );
};

module.exports = { connectDB };