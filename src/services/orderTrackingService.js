// Order Tracking Service with Courier Integration

import { CourierService } from './courierService';

export const OrderTrackingService = {
  createTrackingRecord: (orderId, courier, trackingData) => {
    const trackingRecords = JSON.parse(localStorage.getItem('trackingRecords') || '[]');
    
    const newRecord = {
      id: Date.now().toString(),
      orderId,
      courier,
      trackingNumber: trackingData.trackingNumber,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          description: 'Order placed',
        },
      ],
      estimatedDelivery: trackingData.estimatedDelivery || null,
      actualDelivery: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    trackingRecords.push(newRecord);
    localStorage.setItem('trackingRecords', JSON.stringify(trackingRecords));
    return newRecord;
  },

  getTrackingByOrderId: (orderId) => {
    const trackingRecords = JSON.parse(localStorage.getItem('trackingRecords') || '[]');
    return trackingRecords.find(record => record.orderId === orderId);
  },

  getTrackingByTrackingNumber: (trackingNumber) => {
    const trackingRecords = JSON.parse(localStorage.getItem('trackingRecords') || '[]');
    return trackingRecords.find(record => record.trackingNumber === trackingNumber);
  },

  updateTrackingStatus: (trackingId, status, description = '') => {
    const trackingRecords = JSON.parse(localStorage.getItem('trackingRecords') || '[]');
    const index = trackingRecords.findIndex(record => record.id === trackingId);
    
    if (index !== -1) {
      trackingRecords[index].status = status;
      trackingRecords[index].statusHistory.push({
        status,
        timestamp: new Date().toISOString(),
        description: description || `Status updated to ${status}`,
      });
      
      if (status === 'delivered') {
        trackingRecords[index].actualDelivery = new Date().toISOString();
      }
      
      trackingRecords[index].updatedAt = new Date().toISOString();
      localStorage.setItem('trackingRecords', JSON.stringify(trackingRecords));
      return trackingRecords[index];
    }
    
    return null;
  },

  syncWithCourier: async (trackingId) => {
    const trackingRecord = OrderTrackingService.getTrackingByTrackingId(trackingId);
    
    if (!trackingRecord) {
      throw new Error('Tracking record not found');
    }

    try {
      const courierStatus = await CourierService.trackCourierOrder(
        trackingRecord.courier,
        trackingRecord.trackingNumber
      );

      // Map courier status to internal status
      const statusMapping = {
        'pending': 'pending',
        'picked_up': 'picked_up',
        'in_transit': 'in_transit',
        'out_for_delivery': 'out_for_delivery',
        'delivered': 'delivered',
        'cancelled': 'cancelled',
        'returned': 'returned',
      };

      const internalStatus = statusMapping[courierStatus.status] || 'pending';
      
      return OrderTrackingService.updateTrackingStatus(
        trackingId,
        internalStatus,
        courierStatus.description || ''
      );
    } catch (error) {
      console.error('Courier sync error:', error);
      throw error;
    }
  },

  getTrackingByTrackingId: (trackingId) => {
    const trackingRecords = JSON.parse(localStorage.getItem('trackingRecords') || '[]');
    return trackingRecords.find(record => record.id === trackingId);
  },

  getAllTrackingRecords: () => {
    return JSON.parse(localStorage.getItem('trackingRecords') || '[]');
  },

  getTrackingTimeline: (trackingId) => {
    const trackingRecord = OrderTrackingService.getTrackingByTrackingId(trackingId);
    
    if (!trackingRecord) {
      return [];
    }

    return trackingRecord.statusHistory.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  },

  getTrackingStats: () => {
    const trackingRecords = OrderTrackingService.getAllTrackingRecords();
    
    const stats = {
      total: trackingRecords.length,
      pending: trackingRecords.filter(r => r.status === 'pending').length,
      pickedUp: trackingRecords.filter(r => r.status === 'picked_up').length,
      inTransit: trackingRecords.filter(r => r.status === 'in_transit').length,
      outForDelivery: trackingRecords.filter(r => r.status === 'out_for_delivery').length,
      delivered: trackingRecords.filter(r => r.status === 'delivered').length,
      cancelled: trackingRecords.filter(r => r.status === 'cancelled').length,
      returned: trackingRecords.filter(r => r.status === 'returned').length,
    };

    return stats;
  },

  getDelayedShipments: (delayHours = 48) => {
    const trackingRecords = OrderTrackingService.getAllTrackingRecords();
    const now = new Date();
    
    return trackingRecords.filter(record => {
      if (record.status === 'delivered' || record.status === 'cancelled') {
        return false;
      }
      
      const createdAt = new Date(record.createdAt);
      const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60);
      
      return hoursSinceCreation > delayHours;
    });
  },
};
