import connectToDatabase from './utils/db.js';
import Order from './models/Order.js';
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
    await handleGetOrders(req, res);
  } else if (method === 'POST') {
    await handleCreateOrder(req, res);
  } else if (method === 'PUT') {
    await handleUpdateOrder(req, res);
  } else if (method === 'DELETE') {
    await handleDeleteOrder(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetOrders(req, res) {
  try {
    const { status, limit, skip, startDate, endDate } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(filter)
      .limit(parseInt(limit) || 0)
      .skip(parseInt(skip) || 0)
      .sort({ createdAt: -1 });
    
    const total = await Order.countDocuments(filter);
    
    res.status(200).json({ orders, total });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders', message: error.message });
  }
}

async function handleCreateOrder(req, res) {
  try {
    if (!hasPermission(req.user.role, 'process_orders')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const order = await Order.create(req.body);
    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order', message: error.message });
  }
}

async function handleUpdateOrder(req, res) {
  try {
    const { _id, status } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Missing order _id' });
    }

    if (status && !hasPermission(req.user.role, 'process_orders')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const order = await Order.findByIdAndUpdate(_id, req.body, { new: true });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order', message: error.message });
  }
}

async function handleDeleteOrder(req, res) {
  try {
    const { _id } = req.query;

    if (!_id) {
      return res.status(400).json({ error: 'Missing order _id' });
    }

    if (!hasPermission(req.user.role, 'cancel_orders')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const order = await Order.findByIdAndDelete(_id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order', message: error.message });
  }
}
