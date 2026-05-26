import connectToDatabase from './utils/db.js';
import Coupon from './models/Coupon.js';
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
    await handleGetCoupons(req, res);
  } else if (method === 'POST') {
    await handleCreateCoupon(req, res);
  } else if (method === 'PUT') {
    await handleUpdateCoupon(req, res);
  } else if (method === 'DELETE') {
    await handleDeleteCoupon(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetCoupons(req, res) {
  try {
    const { code, isActive, limit, skip } = req.query;
    const filter = {};
    
    if (code) filter.code = code.toUpperCase();
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const coupons = await Coupon.find(filter)
      .limit(parseInt(limit) || 0)
      .skip(parseInt(skip) || 0)
      .sort({ createdAt: -1 });
    
    const total = await Coupon.countDocuments(filter);
    
    res.status(200).json({ coupons, total });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Failed to fetch coupons', message: error.message });
  }
}

async function handleCreateCoupon(req, res) {
  try {
    if (!hasPermission(req.user.role, 'create_coupons')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const couponData = {
      ...req.body,
      code: req.body.code?.toUpperCase(),
    };

    const coupon = await Coupon.create(couponData);
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: 'Failed to create coupon', message: error.message });
  }
}

async function handleUpdateCoupon(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing coupon id' });
    }

    if (!hasPermission(req.user.role, 'edit_coupons')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: 'Failed to update coupon', message: error.message });
  }
}

async function handleDeleteCoupon(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Missing coupon id' });
    }

    if (!hasPermission(req.user.role, 'delete_coupons')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }

    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Failed to delete coupon', message: error.message });
  }
}
