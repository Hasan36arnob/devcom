import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    trim: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  pros: [{
    type: String,
  }],
  cons: [{
    type: String,
  }],
  images: [{
    type: String,
  }],
  verifiedPurchase: {
    type: Boolean,
    default: false,
  },
  helpful: {
    type: Number,
    default: 0,
  },
  notHelpful: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Prevent model recompilation in development
export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
