// Shipping and Free Shipping Logic Service

export const ShippingService = {
  calculateShippingCost: (orderData) => {
    const freeShippingThreshold = parseFloat(
      process.env.REACT_APP_FREE_SHIPPING_THRESHOLD || 1000
    );
    
    const cartTotal = orderData.subtotal || 0;
    const weight = orderData.totalWeight || 1;
    const location = orderData.location || 'dhaka';
    
    // Free shipping for orders above threshold
    if (cartTotal >= freeShippingThreshold) {
      return {
        cost: 0,
        isFree: true,
        message: 'Free shipping applied',
      };
    }

    // Calculate shipping based on location and weight
    const locationRates = {
      dhaka: { baseRate: 60, perKg: 10 },
      outsideDhaka: { baseRate: 120, perKg: 20 },
      remote: { baseRate: 150, perKg: 25 },
    };

    const rate = locationRates[location] || locationRates.outsideDhaka;
    const shippingCost = rate.baseRate + (weight * rate.perKg);

    return {
      cost: shippingCost,
      isFree: false,
      message: `Shipping cost: ${shippingCost} BDT`,
    };
  },

  checkFreeShippingEligibility: (cartTotal) => {
    const threshold = parseFloat(
      process.env.REACT_APP_FREE_SHIPPING_THRESHOLD || 1000
    );
    
    const remaining = threshold - cartTotal;
    
    if (remaining <= 0) {
      return {
        eligible: true,
        remaining: 0,
        message: 'You qualify for free shipping!',
      };
    }
    
    return {
      eligible: false,
      remaining,
      message: `Add ${remaining.toFixed(2)} BDT more for free shipping`,
    };
  },

  getShippingZones: () => {
    return [
      {
        id: 'dhaka',
        name: 'Dhaka',
        baseRate: 60,
        perKg: 10,
        deliveryDays: '1-2',
      },
      {
        id: 'outsideDhaka',
        name: 'Outside Dhaka',
        baseRate: 120,
        perKg: 20,
        deliveryDays: '2-3',
      },
      {
        id: 'remote',
        name: 'Remote Areas',
        baseRate: 150,
        perKg: 25,
        deliveryDays: '3-5',
      },
    ];
  },

  getEstimatedDeliveryDate: (location, orderDate = new Date()) => {
    const deliveryDays = {
      dhaka: 2,
      outsideDhaka: 3,
      remote: 5,
    };

    const days = deliveryDays[location] || 3;
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + days);

    return deliveryDate;
  },

  calculateOrderWeight: (items) => {
    // Assume average weight per item (in kg)
    const averageWeightPerItem = 0.5;
    return items.reduce((total, item) => total + (item.quantity * averageWeightPerItem), 0);
  },
};
