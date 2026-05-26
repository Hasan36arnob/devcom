// Location-based Customer Segmentation Service

export const LocationService = {
  segmentCustomersByLocation: () => {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const locationSegments = {
      dhaka: { customers: [], orders: [], totalRevenue: 0 },
      outsideDhaka: { customers: [], orders: [], totalRevenue: 0 },
      remote: { customers: [], orders: [], totalRevenue: 0 },
      international: { customers: [], orders: [], totalRevenue: 0 },
    };

    customers.forEach(customer => {
      const location = LocationService.detectLocation(customer.address);
      locationSegments[location].customers.push(customer);
    });

    orders.forEach(order => {
      const location = LocationService.detectLocation(order.customerAddress);
      locationSegments[location].orders.push(order);
      locationSegments[location].totalRevenue += order.total;
    });

    return locationSegments;
  },

  detectLocation: (address) => {
    if (!address) return 'outsideDhaka';
    
    const addressLower = address.toLowerCase();
    
    if (addressLower.includes('dhaka') || addressLower.includes('ঢাকা')) {
      return 'dhaka';
    }
    
    if (addressLower.includes('international') || addressLower.includes('usa') || 
        addressLower.includes('uk') || addressLower.includes('canada') ||
        addressLower.includes('australia') || addressLower.includes('europe')) {
      return 'international';
    }
    
    if (addressLower.includes('remote') || addressLower.includes('hill') ||
        addressLower.includes('island') || addressLower.includes('coastal')) {
      return 'remote';
    }
    
    return 'outsideDhaka';
  },

  getLocationBasedOffers: (customerAddress) => {
    const location = LocationService.detectLocation(customerAddress);
    
    const offers = {
      dhaka: {
        freeShippingThreshold: 500,
        deliveryDays: '1-2',
        specialDiscount: 5,
        message: 'Free shipping on orders over 500 BDT within Dhaka!',
      },
      outsideDhaka: {
        freeShippingThreshold: 1000,
        deliveryDays: '2-3',
        specialDiscount: 0,
        message: 'Free shipping on orders over 1000 BDT outside Dhaka!',
      },
      remote: {
        freeShippingThreshold: 1500,
        deliveryDays: '3-5',
        specialDiscount: 0,
        message: 'Free shipping on orders over 1500 BDT for remote areas!',
      },
      international: {
        freeShippingThreshold: 5000,
        deliveryDays: '7-14',
        specialDiscount: 0,
        message: 'International shipping available on orders over 5000 BDT!',
      },
    };

    return offers[location] || offers.outsideDhaka;
  },

  getCustomerLocationStats: (customerId) => {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find(c => c.id === customerId);
    
    if (!customer) {
      return null;
    }

    const location = LocationService.detectLocation(customer.address);
    const offers = LocationService.getLocationBasedOffers(customer.address);

    return {
      location,
      offers,
      customer,
    };
  },

  getRegionalSalesReport: (startDate, endDate) => {
    const locationSegments = LocationService.segmentCustomersByLocation();
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    const regionalSales = {
      dhaka: { orders: [], revenue: 0, avgOrderValue: 0 },
      outsideDhaka: { orders: [], revenue: 0, avgOrderValue: 0 },
      remote: { orders: [], revenue: 0, avgOrderValue: 0 },
      international: { orders: [], revenue: 0, avgOrderValue: 0 },
    };

    filteredOrders.forEach(order => {
      const location = LocationService.detectLocation(order.customerAddress);
      regionalSales[location].orders.push(order);
      regionalSales[location].revenue += order.total;
    });

    // Calculate average order values
    Object.keys(regionalSales).forEach(region => {
      const regionData = regionalSales[region];
      regionData.avgOrderValue = regionData.orders.length > 0 
        ? regionData.revenue / regionData.orders.length 
        : 0;
    });

    return regionalSales;
  },

  targetLocationBasedCampaign: (location, campaignData) => {
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    const targetCustomers = customers.filter(customer => {
      return LocationService.detectLocation(customer.address) === location;
    });

    const campaign = {
      id: Date.now().toString(),
      location,
      targetCustomers: targetCustomers.map(c => c.id),
      ...campaignData,
      createdAt: new Date().toISOString(),
    };

    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    campaigns.push(campaign);
    localStorage.setItem('campaigns', JSON.stringify(campaigns));

    return campaign;
  },

  getLocationHeatmapData: () => {
    const locationSegments = LocationService.segmentCustomersByLocation();
    
    return {
      dhaka: {
        count: locationSegments.dhaka.customers.length,
        revenue: locationSegments.dhaka.totalRevenue,
        percentage: locationSegments.dhaka.customers.length / 
          (locationSegments.dhaka.customers.length + 
           locationSegments.outsideDhaka.customers.length + 
           locationSegments.remote.customers.length + 
           locationSegments.international.customers.length) * 100,
      },
      outsideDhaka: {
        count: locationSegments.outsideDhaka.customers.length,
        revenue: locationSegments.outsideDhaka.totalRevenue,
        percentage: locationSegments.outsideDhaka.customers.length / 
          (locationSegments.dhaka.customers.length + 
           locationSegments.outsideDhaka.customers.length + 
           locationSegments.remote.customers.length + 
           locationSegments.international.customers.length) * 100,
      },
      remote: {
        count: locationSegments.remote.customers.length,
        revenue: locationSegments.remote.totalRevenue,
        percentage: locationSegments.remote.customers.length / 
          (locationSegments.dhaka.customers.length + 
           locationSegments.outsideDhaka.customers.length + 
           locationSegments.remote.customers.length + 
           locationSegments.international.customers.length) * 100,
      },
      international: {
        count: locationSegments.international.customers.length,
        revenue: locationSegments.international.totalRevenue,
        percentage: locationSegments.international.customers.length / 
          (locationSegments.dhaka.customers.length + 
           locationSegments.outsideDhaka.customers.length + 
           locationSegments.remote.customers.length + 
           locationSegments.international.customers.length) * 100,
      },
    };
  },
};
