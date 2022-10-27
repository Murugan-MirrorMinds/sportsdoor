const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const sportFormatsSchema = new Schema(
  {
    format_name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('sportformats', sportFormatsSchema,'sportformats');
