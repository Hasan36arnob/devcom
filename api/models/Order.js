import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
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
  customerPhone: {
    type: String,
    required: true,
    trim: true,
  },
  customerAddress: {
    type: String,
    required: true,
    trim: true,
  },
  billingAddress: {
    type: String,
    trim: true,
  },
  items: [{
    _id: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  }],
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  tax: {
    type: Number,
    default: 0,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'incomplete'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'bkash', 'nagad', 'rocket', 'sslcommerz'],
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  paymentGateway: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  courier: {
    type: String,
    enum: ['steadfast', 'redx', 'pathao'],
  },
  trackingNumber: {
    type: String,
  },
  invoiceNumber: {
    type: String,
  },
  couponCode: {
    type: String,
  },
  couponDiscount: {
    type: Number,
    default: 0,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
    trim: true,
  },
  zone: {
    type: String,
    trim: true,
  },
  area: {
    type: String,
    trim: true,
  },
  totalWeight: {
    type: Number,
    default: 1,
  },
  note: {
    type: String,
    trim: true,
  },
  trackingHistory: [{
    status: String,
    location: String,
    timestamp: Date,
    description: String,
  }],
}, {
  timestamps: true,
});

// Prevent model recompilation in development
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
