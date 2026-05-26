import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  img: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    trim: true,
  },
  badge: {
    type: Boolean,
    default: false,
  },
  subcategory: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Prevent model recompilation in development
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
