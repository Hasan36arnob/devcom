// Product Rating and Review Service
import { api } from '../utils/apiHelper';

export const ReviewService = {
  addReview: async (productId, reviewData) => {
    try {
      const response = await api.post('/reviews', {
        productId,
        ...reviewData,
      });
      return response.review;
    } catch (error) {
      console.error('Add review error:', error);
      throw error;
    }
  },

  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews?productId=${productId}`);
      return response.reviews;
    } catch (error) {
      console.error('Get product reviews error:', error);
      throw error;
    }
  },

  getReviewById: async (reviewId) => {
    try {
      const reviews = await ReviewService.getProductReviews('');
      return reviews.find(r => r._id === reviewId) || null;
    } catch (error) {
      console.error('Get review by id error:', error);
      throw error;
    }
  },

  updateReview: async (reviewId, updates) => {
    try {
      const response = await api.put('/reviews', { id: reviewId, ...updates });
      return response.review;
    } catch (error) {
      console.error('Update review error:', error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      await api.delete(`/reviews?id=${reviewId}`);
      return true;
    } catch (error) {
      console.error('Delete review error:', error);
      throw error;
    }
  },

  markHelpful: async (reviewId) => {
    try {
      const response = await api.put('/reviews', {
        id: reviewId,
        helpful: 1,
      });
      return response.review;
    } catch (error) {
      console.error('Mark helpful error:', error);
      throw error;
    }
  },

  markNotHelpful: async (reviewId) => {
    try {
      const response = await api.put('/reviews', {
        id: reviewId,
        notHelpful: 1,
      });
      return response.review;
    } catch (error) {
      console.error('Mark not helpful error:', error);
      throw error;
    }
  },

  updateProductRating: async (productId) => {
    try {
      const reviews = await ReviewService.getProductReviews(productId);
      
      if (reviews.length === 0) {
        return { average: 0, count: 0 };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      // Update product via API
      await api.put('/products', {
        _id: productId,
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
      });

      return {
        average: Math.round(averageRating * 10) / 10,
        count: reviews.length,
      };
    } catch (error) {
      console.error('Update product rating error:', error);
      throw error;
    }
  },

  getProductRating: async (productId) => {
    try {
      const reviews = await ReviewService.getProductReviews(productId);
      
      if (reviews.length === 0) {
        return { average: 0, count: 0 };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      return {
        average: Math.round(averageRating * 10) / 10,
        count: reviews.length,
      };
    } catch (error) {
      console.error('Get product rating error:', error);
      throw error;
    }
  },

  getTopReviews: async (productId, limit = 5) => {
    try {
      const reviews = await ReviewService.getProductReviews(productId);
      return reviews
        .sort((a, b) => b.helpful - a.helpful)
        .slice(0, limit);
    } catch (error) {
      console.error('Get top reviews error:', error);
      throw error;
    }
  },

  getRecentReviews: async (productId, limit = 5) => {
    try {
      const reviews = await ReviewService.getProductReviews(productId);
      return reviews
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    } catch (error) {
      console.error('Get recent reviews error:', error);
      throw error;
    }
  },

  getReviewsByRating: async (productId, rating) => {
    try {
      const reviews = await ReviewService.getProductReviews(productId);
      return reviews.filter(r => r.rating === rating);
    } catch (error) {
      console.error('Get reviews by rating error:', error);
      throw error;
    }
  },

  getVerifiedPurchaseReviews: async (productId) => {
    try {
      const reviews = await ReviewService.getProductReviews(productId);
      return reviews.filter(r => r.verifiedPurchase);
    } catch (error) {
      console.error('Get verified purchase reviews error:', error);
      throw error;
    }
  },
};
