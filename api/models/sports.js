const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const sportsSchema = new Schema(
  {
    sport_name: { type: String, required: true, unique: true },
    sport_icon: { type: String, default:'' },
    sport_slug: { type: String, default:'' },   
    formats: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'sportformats',
          default: ''
      }
    ],
    status: { type: String, trim: true, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('sports', sportsSchema,'sports');