// Location-based Customer Segmentation Service
import { api } from '../utils/apiHelper';

export const LocationService = {
  segmentCustomersByLocation: async () => {
    try {
      const [ordersResponse] = await Promise.all([
        api.get('/orders'),
      ]);
      
      const orders = ordersResponse.orders;
      
      const locationSegments = {
        dhaka: { customers: [], orders: [], totalRevenue: 0 },
        outsideDhaka: { customers: [], orders: [], totalRevenue: 0 },
        remote: { customers: [], orders: [], totalRevenue: 0 },
        international: { customers: [], orders: [], totalRevenue: 0 },
      };

      orders.forEach(order => {
        const location = LocationService.detectLocation(order.customerAddress);
        locationSegments[location].orders.push(order);
        locationSegments[location].totalRevenue += order.total;
      });

      return locationSegments;
    } catch (error) {
      console.error('Segment customers by location error:', error);
      throw error;
    }
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

  getCustomerLocationStats: async (customerId) => {
    try {
      // Note: Customer management would need a separate API endpoint
      // For now, we'll use order data to infer location
      const ordersResponse = await api.get('/orders');
      const customerOrders = ordersResponse.orders.filter(o => o.customerEmail === customerId);
      
      if (customerOrders.length === 0) {
        return null;
      }

      const address = customerOrders[0].customerAddress;
      const location = LocationService.detectLocation(address);
      const offers = LocationService.getLocationBasedOffers(address);

      return {
        location,
        offers,
        address,
      };
    } catch (error) {
      console.error('Get customer location stats error:', error);
      throw error;
    }
  },

  getRegionalSalesReport: async (startDate, endDate) => {
    try {
      const response = await api.get(`/orders?startDate=${startDate}&endDate=${endDate}`);
      const orders = response.orders;

      const regionalSales = {
        dhaka: { orders: [], revenue: 0, avgOrderValue: 0 },
        outsideDhaka: { orders: [], revenue: 0, avgOrderValue: 0 },
        remote: { orders: [], revenue: 0, avgOrderValue: 0 },
        international: { orders: [], revenue: 0, avgOrderValue: 0 },
      };

      orders.forEach(order => {
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
    } catch (error) {
      console.error('Get regional sales report error:', error);
      throw error;
    }
  },

  getLocationHeatmapData: async () => {
    try {
      const locationSegments = await LocationService.segmentCustomersByLocation();
      
      const totalCustomers = locationSegments.dhaka.customers.length + 
        locationSegments.outsideDhaka.customers.length + 
        locationSegments.remote.customers.length + 
        locationSegments.international.customers.length;
      
      return {
        dhaka: {
          count: locationSegments.dhaka.customers.length,
          revenue: locationSegments.dhaka.totalRevenue,
          percentage: totalCustomers > 0 ? (locationSegments.dhaka.customers.length / totalCustomers) * 100 : 0,
        },
        outsideDhaka: {
          count: locationSegments.outsideDhaka.customers.length,
          revenue: locationSegments.outsideDhaka.totalRevenue,
          percentage: totalCustomers > 0 ? (locationSegments.outsideDhaka.customers.length / totalCustomers) * 100 : 0,
        },
        remote: {
          count: locationSegments.remote.customers.length,
          revenue: locationSegments.remote.totalRevenue,
          percentage: totalCustomers > 0 ? (locationSegments.remote.customers.length / totalCustomers) * 100 : 0,
        },
        international: {
          count: locationSegments.international.customers.length,
          revenue: locationSegments.international.totalRevenue,
          percentage: totalCustomers > 0 ? (locationSegments.international.customers.length / totalCustomers) * 100 : 0,
        },
      };
    } catch (error) {
      console.error('Get location heatmap data error:', error);
      throw error;
    }
  },
};
