// Product Rating and Review Service

export const ReviewService = {
  addReview: (productId, reviewData) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    const newReview = {
      id: Date.now().toString(),
      productId,
      customerName: reviewData.customerName,
      customerEmail: reviewData.customerEmail,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      pros: reviewData.pros || [],
      cons: reviewData.cons || [],
      images: reviewData.images || [],
      verifiedPurchase: reviewData.verifiedPurchase || false,
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Update product rating
    ReviewService.updateProductRating(productId);
    
    return newReview;
  },

  getProductReviews: (productId) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.filter(r => r.productId === productId);
  },

  getReviewById: (reviewId) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.find(r => r.id === reviewId);
  },

  updateReview: (reviewId, updates) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const index = reviews.findIndex(r => r.id === reviewId);
    
    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('reviews', JSON.stringify(reviews));
      
      // Update product rating
      ReviewService.updateProductRating(reviews[index].productId);
      
      return reviews[index];
    }
    
    return null;
  },

  deleteReview: (reviewId) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const review = reviews.find(r => r.id === reviewId);
    const filtered = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem('reviews', JSON.stringify(filtered));
    
    // Update product rating
    if (review) {
      ReviewService.updateProductRating(review.productId);
    }
  },

  markHelpful: (reviewId) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const index = reviews.findIndex(r => r.id === reviewId);
    
    if (index !== -1) {
      reviews[index].helpful += 1;
      localStorage.setItem('reviews', JSON.stringify(reviews));
      return reviews[index];
    }
    
    return null;
  },

  markNotHelpful: (reviewId) => {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const index = reviews.findIndex(r => r.id === reviewId);
    
    if (index !== -1) {
      reviews[index].notHelpful += 1;
      localStorage.setItem('reviews', JSON.stringify(reviews));
      return reviews[index];
    }
    
    return null;
  },

  updateProductRating: (productId) => {
    const reviews = ReviewService.getProductReviews(productId);
    
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Update product in products array
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productIndex = products.findIndex(p => p._id === productId);
    
    if (productIndex !== -1) {
      products[productIndex].rating = Math.round(averageRating * 10) / 10;
      products[productIndex].reviewCount = reviews.length;
      localStorage.setItem('products', JSON.stringify(products));
    }

    return {
      average: Math.round(averageRating * 10) / 10,
      count: reviews.length,
    };
  },

  getProductRating: (productId) => {
    const reviews = ReviewService.getProductReviews(productId);
    
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      average: Math.round(averageRating * 10) / 10,
      count: reviews.length,
    };
  },

  getTopReviews: (productId, limit = 5) => {
    const reviews = ReviewService.getProductReviews(productId);
    return reviews
      .sort((a, b) => b.helpful - a.helpful)
      .slice(0, limit);
  },

  getRecentReviews: (productId, limit = 5) => {
    const reviews = ReviewService.getProductReviews(productId);
    return reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  getReviewsByRating: (productId, rating) => {
    const reviews = ReviewService.getProductReviews(productId);
    return reviews.filter(r => r.rating === rating);
  },

  getVerifiedPurchaseReviews: (productId) => {
    const reviews = ReviewService.getProductReviews(productId);
    return reviews.filter(r => r.verifiedPurchase);
  },
};
