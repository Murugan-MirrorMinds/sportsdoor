import mongoose from 'mongoose';

const groundSchema = new mongoose.Schema(
  {
    ground_name: { type: String, required: true, trim: true, unique: true },
    ground_image: { type: String, trim: true },
    ground_code: { type: String, trim: true, default: '' },
    ground_target: {
      type: mongoose.Types.ObjectId,
      trim: true,
      required: true,
      ref: 'ground',
    },
    ground_terms: { type: String, trim: true, default: '' },
    ground_from: { type: Date, trim: true, default: Date.now },
    ground_to: { type: Date, trim: true, default: Date.now },
    ground_status: { type: String, trim: true, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);

const Offers = mongoose.model('offers', offerSchema);
export default Offers;
