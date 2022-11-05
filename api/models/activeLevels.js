const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const activeLevelsSchema = new Schema(
  {
    level_name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('activelevels', activeLevelsSchema,'activelevels');