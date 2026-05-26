import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
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
  date: {
    type: Date,
    required: true,
  },
  receiptUrl: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Prevent model recompilation in development
export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
