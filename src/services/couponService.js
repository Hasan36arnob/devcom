// Coupon and Discount Management Service

export const CouponService = {
  generateCouponCode: (prefix = 'SAVE', length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = prefix;
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  },

  createCoupon: (couponData) => {
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    
    const newCoupon = {
      id: Date.now().toString(),
      code: couponData.code || CouponService.generateCouponCode(),
      discountType: couponData.discountType || 'percentage', // 'percentage' or 'fixed'
      discountValue: couponData.discountValue,
      minPurchase: couponData.minPurchase || 0,
      maxDiscount: couponData.maxDiscount || null,
      usageLimit: couponData.usageLimit || null,
      usedCount: 0,
      startDate: couponData.startDate || new Date().toISOString(),
      endDate: couponData.endDate || null,
      applicableCategories: couponData.applicableCategories || [],
      applicableProducts: couponData.applicableProducts || [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    coupons.push(newCoupon);
    localStorage.setItem('coupons', JSON.stringify(coupons));
    return newCoupon;
  },

  validateCoupon: (code, cartTotal, cartItems = []) => {
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const coupon = coupons.find(c => c.code === code && c.isActive);

    if (!coupon) {
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
  },

  applyCoupon: (code, cartTotal, cartItems = []) => {
    const validation = CouponService.validateCoupon(code, cartTotal, cartItems);
    
    if (!validation.valid) {
      return validation;
    }

    // Increment usage count
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const couponIndex = coupons.findIndex(c => c.code === code);
    if (couponIndex !== -1) {
      coupons[couponIndex].usedCount += 1;
      localStorage.setItem('coupons', JSON.stringify(coupons));
    }

    return validation;
  },

  getCoupons: () => {
    return JSON.parse(localStorage.getItem('coupons') || '[]');
  },

  getCouponById: (id) => {
    const coupons = CouponService.getCoupons();
    return coupons.find(c => c.id === id);
  },

  updateCoupon: (id, updates) => {
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const index = coupons.findIndex(c => c.id === id);
    
    if (index !== -1) {
      coupons[index] = { ...coupons[index], ...updates };
      localStorage.setItem('coupons', JSON.stringify(coupons));
      return coupons[index];
    }
    
    return null;
  },

  deleteCoupon: (id) => {
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const filtered = coupons.filter(c => c.id !== id);
    localStorage.setItem('coupons', JSON.stringify(filtered));
  },

  toggleCouponStatus: (id) => {
    const coupons = JSON.parse(localStorage.getItem('coupons') || '[]');
    const index = coupons.findIndex(c => c.id === id);
    
    if (index !== -1) {
      coupons[index].isActive = !coupons[index].isActive;
      localStorage.setItem('coupons', JSON.stringify(coupons));
      return coupons[index];
    }
    
    return null;
  },

  calculateDiscount: (cartTotal, couponCode, cartItems = []) => {
    const validation = CouponService.validateCoupon(couponCode, cartTotal, cartItems);
    
    if (validation.valid) {
      return validation.discount;
    }
    
    return 0;
  },
};
