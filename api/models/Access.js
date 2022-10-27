const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const accessKeySchema = new Schema({
    access_key: {
        type: String,
        default: ''
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: ''
    },
    access_status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y',
    },
    access_expdt: {
        type: Date,
        default: Date.now()
    },
    access_dt: {
        type: Date,
        default: Date.now()
    },
    access_ip: {
        type: String,
        default: ''
    },
},
{
  timestamps: true,
});

module.exports = mongoose.model('accesskey', accessKeySchema,'accesskey');