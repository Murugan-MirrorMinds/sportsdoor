const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const gameLevelsSchema = new Schema(
  {
    level_name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);

const gameLevels = connection.model('gamelevels', gameLevelsSchema, 'gamelevels');

module.exports = gameLevels;
