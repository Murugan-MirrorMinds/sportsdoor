import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    offer_name: { type: String, required: true, trim: true, unique: true },
    offer_image: { type: String, trim: true },
    offer_code: { type: String, trim: true, default: '' },
    offer_target: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
      ref: 'ground',
    },
    offer_terms: { type: String, trim: true, default: '' },
    offer_from: { type: Date, trim: true, default: Date.now },
    offer_to: { type: Date, trim: true, default: Date.now },
    offer_status: { type: String, trim: true, enum: ['Y', 'N'], default: 'Y' },
  },
  {
    timestamps: true,
  }
);

const Offers = mongoose.model('offers', offerSchema);
export default Offers;
