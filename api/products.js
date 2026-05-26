import connectToDatabase from './utils/db.js';
import Product from './models/Product.js';
import { authenticate, hasPermission } from './utils/authMiddleware.js';

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  // Authentication check for all methods except GET
  if (method !== 'GET') {
    const authResult = await new Promise((resolve) => {
      authenticate(req, res, () => resolve({ success: true }));
    });
    
    if (!authResult.success && res.headersSent) {
      return;
    }
  }

  if (method === 'GET') {
    await handleGetProducts(req, res);
  } else if (method === 'POST') {
    await handleCreateProduct(req, res);
  } else if (method === 'PUT') {
    await handleUpdateProduct(req, res);
  } else if (method === 'DELETE') {
    await handleDeleteProduct(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetProducts(req, res) {
  try {
    const { category, limit, skip } = req.query;
    const filter = category ? { category } : {};
    
    const products = await Product.find(filter)
      .limit(parseInt(limit) || 0)
      .skip(parseInt(skip) || 0)
      .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({ products, total });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
}

async function handleCreateProduct(req, res) {
  try {
    if (!hasPermission(req.user.role, 'add_products')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product', message: error.message });
  }
}

async function handleUpdateProduct(req, res) {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Missing product _id' });
    }

    if (!hasPermission(req.user.role, 'edit_products')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const product = await Product.findByIdAndUpdate(_id, req.body, { new: true });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product', message: error.message });
  }
}

async function handleDeleteProduct(req, res) {
  try {
    const { _id } = req.query;

    if (!_id) {
      return res.status(400).json({ error: 'Missing product _id' });
    }

    if (!hasPermission(req.user.role, 'delete_products')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const product = await Product.findByIdAndDelete(_id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product', message: error.message });
  }
}
