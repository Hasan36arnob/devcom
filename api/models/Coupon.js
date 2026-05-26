import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage',
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxDiscount: {
    type: Number,
    min: 0,
  },
  usageLimit: {
    type: Number,
    min: 0,
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  applicableCategories: [{
    type: String,
  }],
  applicableProducts: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Prevent model recompilation in development
export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
