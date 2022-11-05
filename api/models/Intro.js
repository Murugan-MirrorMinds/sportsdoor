const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const introSchema = new Schema(
  {
    image_name: { type: String, default:'' },
    image_title: { type: String, default:'' },
    image_desc: { type: String, default:'' },
    image_pos: { type: Number, default: 0 },
    status: { type: String, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('introscreen', introSchema,'introscreen');
