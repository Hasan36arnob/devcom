import connectToDatabase from './utils/db.js';
import Review from './models/Review.js';
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
    await handleGetReviews(req, res);
  } else if (method === 'POST') {
    await handleCreateReview(req, res);
  } else if (method === 'PUT') {
    await handleUpdateReview(req, res);
  } else if (method === 'DELETE') {
    await handleDeleteReview(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetReviews(req, res) {
  try {
    const { productId, limit, skip } = req.query;
    const filter = productId ? { productId } : {};
    
    const reviews = await Review.find(filter)
      .limit(parseInt(limit) || 0)
      .skip(parseInt(skip) || 0)
      .sort({ createdAt: -1 });
    
    const total = await Review.countDocuments(filter);
    
    res.status(200).json({ reviews, total });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews', message: error.message });
  }
}

async function handleCreateReview(req, res) {
  try {
    const review = await Review.create(req.body);
    
    // Update product rating
    await updateProductRating(req.body.productId);
    
    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review', message: error.message });
  }
}

async function handleUpdateReview(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Missing review id' });
    }

    const review = await Review.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Update product rating
    await updateProductRating(review.productId);
    
    res.status(200).json({ success: true, review });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review', message: error.message });
  }
}

async function handleDeleteReview(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Missing review id' });
    }

    const review = await Review.findByIdAndDelete(id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Update product rating
    await updateProductRating(review.productId);
    
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review', message: error.message });
  }
}

async function updateProductRating(productId) {
  const reviews = await Review.find({ productId });
  
  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0, reviewCount: 0 });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  });
}
