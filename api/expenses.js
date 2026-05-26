import connectToDatabase from './utils/db.js';
import Expense from './models/Expense.js';
import { authenticate, hasPermission } from './utils/authMiddleware.js';

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  // Authentication check for all methods
  const authResult = await new Promise((resolve) => {
    authenticate(req, res, () => resolve({ success: true }));
  });
  
  if (!authResult.success && res.headersSent) {
    return;
  }

  if (method === 'GET') {
    await handleGetExpenses(req, res);
  } else if (method === 'POST') {
    await handleCreateExpense(req, res);
  } else if (method === 'DELETE') {
    await handleDeleteExpense(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetExpenses(req, res) {
  try {
    const { category, startDate, endDate, limit, skip } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    const expenses = await Expense.find(filter)
      .limit(parseInt(limit) || 0)
      .skip(parseInt(skip) || 0)
      .sort({ date: -1 });
    
    const total = await Expense.countDocuments(filter);
    const totalAmount = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.status(200).json({ 
      expenses, 
      total, 
      totalAmount: totalAmount[0]?.total || 0 
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses', message: error.message });
  }
}

async function handleCreateExpense(req, res) {
  try {
    if (!hasPermission(req.user.role, 'view_expense_reports')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, expense });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense', message: error.message });
  }
}

async function handleDeleteExpense(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Missing expense id' });
    }

    if (!hasPermission(req.user.role, 'view_expense_reports')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const expense = await Expense.findByIdAndDelete(id);
    
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense', message: error.message });
  }
}
