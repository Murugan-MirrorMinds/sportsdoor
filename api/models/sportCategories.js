const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const sportCategorySchema = new Schema(
  {
    cat_name: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Y', 'N'], default: 'Y' },   
    sports: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'sports',
          default: ''
      }
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('sportcategories', sportCategorySchema,'sportcategories');