const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  first_name: {
      type: String,
      default: ''
  },
  last_name: {
      type: String,
      default: ''
  },
  mobile: {
      type: String,
      default: ''
  },
  email: {
      type: String,
      default: ''
  },
  password: {
      type: String,
      default: ''
  },
  profile_image: {
      type: String,
      default: ''
  },
  user_role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
  },  
  bio: {
    type: String,
    default: ''
    },
  address: [
    {
        address1 :{
            type: String,
            default: ''
        },
        city :{
            type: String,
            default: ''
        },
        state :{
            type: String,
            default: ''
        },
        country :{
            type: String,
            default: ''
        },
        zip :{
            type: String,
            default: ''
        },
        location : {
            latitude :{
                type: String,
                default: ''
            },
            longitude :{
                type: String,
                default: ''
            },
        }
  }
],
  gender: {
      type: String,
      enum: ['M', 'F','O',''],
      default: ''
  },
  dob: {
      type: Date,
      default: Date.now
  },
  fitness_level: {
      type: String,
      default: ''
  },
  my_sports: [
    {
        _id: false,
        sportId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sports',
            default: ''
        },
        level: {
            type: String,
            default: ''
        }
    }
  ],
  my_teams: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'team',
        default: ''
    }
  ],
  fav_venues: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'venues',
        default: ''
    }
  ],
  fav_shops: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shops',
        default: ''
    }
  ],
  fav_academics: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'academics',
        default: ''
    }
  ],
  user_oauth_provider: {
      type: String,
      default: ''
  },
  user_oauth_id: {
      type: String,
      default: ''
  },  
  email_verify_code: {
      type: String,
      default: ''
  },
  email_verify: {
      type: Boolean,
      default: false
  },
  otp: {
      type: String,
      default: ''
  },
  otp_verify: {
      type: Boolean,
      default: false
  },
  status: {
    type: String,
    enum: ['Y', 'N','D'],
    default: 'Y'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
},
{
  timestamps: true,
});

module.exports = mongoose.model('users', UserSchema,'users');
