const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const badgesSchema = new Schema(
  {
    badge_name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);

const reputationbadges = connection.model('reputationbadges', badgesSchema, 'reputationbadges');

module.exports = reputationbadges;
