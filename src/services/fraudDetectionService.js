// Fraud Customer Checker Service

export const FraudDetectionService = {
  checkCustomerRisk: (customer, orderHistory = []) => {
    const riskFactors = [];
    let riskScore = 0;

    // Check for suspicious email patterns
    if (customer.email) {
      const disposableEmailDomains = [
        'tempmail.com', 'guerrillamail.com', 'mailinator.com',
        '10minutemail.com', 'throwawaymail.com', 'sharklasers.com'
      ];
      const emailDomain = customer.email.split('@')[1]?.toLowerCase();
      if (disposableEmailDomains.includes(emailDomain)) {
        riskFactors.push('Disposable email domain detected');
        riskScore += 30;
      }
    }

    // Check for incomplete orders in history
    const incompleteOrders = orderHistory.filter(
      order => order.status === 'cancelled' || order.status === 'failed'
    );
    if (incompleteOrders.length > 3) {
      riskFactors.push('High number of cancelled/failed orders');
      riskScore += 20 * incompleteOrders.length;
    }

    // Check for rapid ordering pattern
    if (orderHistory.length > 1) {
      const recentOrders = orderHistory
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      const timeDiffs = [];
      for (let i = 0; i < recentOrders.length - 1; i++) {
        const diff = new Date(recentOrders[i].createdAt) - new Date(recentOrders[i + 1].createdAt);
        timeDiffs.push(diff);
      }
      
      const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
      if (avgTimeDiff < 3600000) { // Less than 1 hour between orders
        riskFactors.push('Rapid ordering pattern detected');
        riskScore += 15;
      }
    }

    // Check for high-value orders
    if (orderHistory.length > 0) {
      const avgOrderValue = orderHistory.reduce((sum, order) => sum + order.total, 0) / orderHistory.length;
      if (avgOrderValue > 10000) {
        riskFactors.push('High average order value');
        riskScore += 10;
      }
    }

    // Check for address inconsistencies
    if (customer.address && customer.shippingAddress) {
      if (customer.address !== customer.shippingAddress) {
        riskFactors.push('Billing and shipping address mismatch');
        riskScore += 15;
      }
    }

    // Check for phone number patterns
    if (customer.phone) {
      const phoneDigits = customer.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        riskFactors.push('Invalid phone number format');
        riskScore += 10;
      }
    }

    // Determine risk level
    let riskLevel = 'low';
    if (riskScore >= 50) {
      riskLevel = 'high';
    } else if (riskScore >= 25) {
      riskLevel = 'medium';
    }

    return {
      riskLevel,
      riskScore,
      riskFactors,
      recommendation: FraudDetectionService.getRecommendation(riskLevel),
    };
  },

  getRecommendation: (riskLevel) => {
    switch (riskLevel) {
      case 'high':
        return 'Manual verification required. Consider additional authentication steps.';
      case 'medium':
        return 'Monitor closely. Consider additional verification for large orders.';
      case 'low':
        return 'No immediate action required. Standard processing.';
      default:
        return 'Unable to determine risk level.';
    }
  },

  checkOrderFraud: (order, customer) => {
    const fraudIndicators = [];
    let fraudScore = 0;

    // Check for unusually large order
    if (order.total > 50000) {
      fraudIndicators.push('Unusually large order amount');
      fraudScore += 20;
    }

    // Check for high quantity of same item
    const itemQuantities = order.items.map(item => item.quantity);
    if (itemQuantities.some(qty => qty > 10)) {
      fraudIndicators.push('High quantity of single item');
      fraudScore += 15;
    }

    // Check for COD on high-value orders
    if (order.paymentMethod === 'COD' && order.total > 10000) {
      fraudIndicators.push('COD on high-value order');
      fraudScore += 10;
    }

    // Check for shipping to high-risk areas
    const highRiskAreas = ['Unknown', 'Remote', 'International'];
    if (highRiskAreas.some(area => order.customerAddress?.includes(area))) {
      fraudIndicators.push('Shipping to high-risk area');
      fraudScore += 15;
    }

    // Check for mismatched billing and shipping
    if (order.billingAddress && order.shippingAddress) {
      if (order.billingAddress !== order.shippingAddress) {
        fraudIndicators.push('Billing and shipping address mismatch');
        fraudScore += 10;
      }
    }

    return {
      fraudScore,
      fraudIndicators,
      isSuspicious: fraudScore >= 30,
      actionRequired: fraudScore >= 30,
    };
  },

  blacklistCustomer: (customerId, reason) => {
    const blacklistedCustomers = JSON.parse(
      localStorage.getItem('blacklistedCustomers') || '[]'
    );
    
    if (!blacklistedCustomers.find(c => c.customerId === customerId)) {
      blacklistedCustomers.push({
        customerId,
        reason,
        blacklistedAt: new Date().toISOString(),
      });
      localStorage.setItem('blacklistedCustomers', JSON.stringify(blacklistedCustomers));
    }
  },

  isCustomerBlacklisted: (customerId) => {
    const blacklistedCustomers = JSON.parse(
      localStorage.getItem('blacklistedCustomers') || '[]'
    );
    return blacklistedCustomers.some(c => c.customerId === customerId);
  },

  removeBlacklist: (customerId) => {
    const blacklistedCustomers = JSON.parse(
      localStorage.getItem('blacklistedCustomers') || '[]'
    );
    const filtered = blacklistedCustomers.filter(c => c.customerId !== customerId);
    localStorage.setItem('blacklistedCustomers', JSON.stringify(filtered));
  },

  getBlacklistedCustomers: () => {
    return JSON.parse(localStorage.getItem('blacklistedCustomers') || '[]');
  },
};
