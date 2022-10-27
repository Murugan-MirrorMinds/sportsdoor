const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const gcmRegisterschema = new Schema({
    gcm_id: {
        type: String,
        default: ''
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: ''
    },
    user_type: {
        type: String,
        enum: ['A', 'I'],
        default: 'A',
    },
    gcm_status: {
        type: String,
        enum: ['Y', 'N','D'],
        default: 'Y',
    },
},
{
  timestamps: true,
});

module.exports = mongoose.model('gcmRegister', gcmRegisterschema,'gcmRegister');