// Coupon and Discount Management Service
import { api } from '../utils/apiHelper';

export const CouponService = {
  generateCouponCode: (prefix = 'SAVE', length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = prefix;
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  createCoupon: async (couponData) => {
    try {
      const response = await api.post('/coupons', {
        ...couponData,
        code: couponData.code || CouponService.generateCouponCode(),
      });
      return response.coupon;
    } catch (error) {
      console.error('Create coupon error:', error);
      throw error;
    }
  },

  validateCoupon: async (code, cartTotal, cartItems = []) => {
    try {
      const response = await api.get(`/coupons?code=${code.toUpperCase()}`);
      const coupon = response.coupons[0];

      if (!coupon || !coupon.isActive) {
        return { valid: false, message: 'Invalid or expired coupon code' };
      }

      // Check if coupon has expired
      if (coupon.endDate && new Date(coupon.endDate) < new Date()) {
        return { valid: false, message: 'Coupon has expired' };
      }

      // Check if coupon has started
      if (new Date(coupon.startDate) > new Date()) {
        return { valid: false, message: 'Coupon is not yet active' };
      }

      // Check minimum purchase requirement
      if (cartTotal < coupon.minPurchase) {
        return { 
          valid: false, 
          message: `Minimum purchase of ${coupon.minPurchase} BDT required` 
        };
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: 'Coupon usage limit reached' };
      }

      // Check if coupon applies to cart items
      if (coupon.applicableCategories.length > 0 || coupon.applicableProducts.length > 0) {
        const hasApplicableItem = cartItems.some(item => {
          if (coupon.applicableProducts.includes(item._id)) return true;
          if (coupon.applicableCategories.includes(item.category)) return true;
          return false;
        });

        if (!hasApplicableItem) {
          return { valid: false, message: 'Coupon does not apply to any items in cart' };
        }
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === 'percentage') {
        discount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      return {
        valid: true,
        discount,
        coupon,
        message: 'Coupon applied successfully',
      };
    } catch (error) {
      console.error('Validate coupon error:', error);
      return { valid: false, message: 'Error validating coupon' };
    }
  },

  applyCoupon: async (code, cartTotal, cartItems = []) => {
    const validation = await CouponService.validateCoupon(code, cartTotal, cartItems);
    
    if (!validation.valid) {
      return validation;
    }

    // Note: Usage count is incremented when payment is verified on the server
    return validation;
  },

  getCoupons: async (isActive = null) => {
    try {
      const params = isActive !== null ? `isActive=${isActive}` : '';
      const response = await api.get(`/coupons?${params}`);
      return response.coupons;
    } catch (error) {
      console.error('Get coupons error:', error);
      throw error;
    }
  },

  getCouponById: async (id) => {
    try {
      const coupons = await CouponService.getCoupons();
      return coupons.find(c => c._id === id) || null;
    } catch (error) {
      console.error('Get coupon by id error:', error);
      throw error;
    }
  },

  updateCoupon: async (id, updates) => {
    try {
      const response = await api.put('/coupons', { id, ...updates });
      return response.coupon;
    } catch (error) {
      console.error('Update coupon error:', error);
      throw error;
    }
  },

  deleteCoupon: async (id) => {
    try {
      await api.delete(`/coupons?id=${id}`);
      return true;
    } catch (error) {
      console.error('Delete coupon error:', error);
      throw error;
    }
  },

  toggleCouponStatus: async (id) => {
    try {
      const coupons = await CouponService.getCoupons();
      const coupon = coupons.find(c => c._id === id);
      if (coupon) {
        const response = await api.put('/coupons', {
          id,
          isActive: !coupon.isActive,
        });
        return response.coupon;
      }
      return null;
    } catch (error) {
      console.error('Toggle coupon status error:', error);
      throw error;
    }
  },

  calculateDiscount: async (cartTotal, couponCode, cartItems = []) => {
    const validation = await CouponService.validateCoupon(couponCode, cartTotal, cartItems);
    
    if (validation.valid) {
      return validation.discount;
    }
    
    return 0;
  },
};
