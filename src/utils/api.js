// API Utility for React Components
// This file handles all API calls to Vercel serverless functions
// Keeps all secret keys secure on the server side

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Payment API Functions
 */

// Initiate payment with any supported gateway
export const createPayment = async (gateway, paymentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gateway, paymentData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment initiation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

// Verify payment status
export const verifyPayment = async (gateway, transactionId, paymentData = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gateway, transactionId, paymentData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Payment verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

/**
 * Courier API Functions
 */

// Create courier order
export const createCourierOrder = async (courier, orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courier, orderData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Courier order creation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Courier order creation error:', error);
    throw error;
  }
};

// Track shipment
export const trackShipment = async (courier, trackingNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/track-shipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courier, trackingNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Shipment tracking failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Shipment tracking error:', error);
    throw error;
  }
};

/**
 * Convenience Functions for Common Use Cases
 */

// SSLCommerz specific payment initiation
export const initiateSSLCommerzPayment = async (paymentData) => {
  return createPayment('sslcommerz', paymentData);
};

// bKash specific payment initiation
export const initiateBkashPayment = async (paymentData) => {
  return createPayment('bkash', paymentData);
};

// Nagad specific payment initiation
export const initiateNagadPayment = async (paymentData) => {
  return createPayment('nagad', paymentData);
};

// Rocket specific payment initiation
export const initiateRocketPayment = async (paymentData) => {
  return createPayment('rocket', paymentData);
};

// Steadfast specific order creation
export const createSteadfastOrder = async (orderData) => {
  return createCourierOrder('steadfast', orderData);
};

// Redx specific order creation
export const createRedxOrder = async (orderData) => {
  return createCourierOrder('redx', orderData);
};

// Pathao specific order creation
export const createPathaoOrder = async (orderData) => {
  return createCourierOrder('pathao', orderData);
};

/**
 * Example Usage in React Components:
 * 
 * // Payment Example:
 * const handlePayment = async () => {
 *   try {
 *     const result = await initiateSSLCommerzPayment({
 *       total_amount: 1000,
 *       tran_id: 'ORDER123',
 *       success_url: `${window.location.origin}/payment/success`,
 *       fail_url: `${window.location.origin}/payment/fail`,
 *       // ... other payment data
 *     });
 *     
 *     if (result.GatewayPageURL) {
 *       window.location.href = result.GatewayPageURL;
 *     }
 *   } catch (error) {
 *     console.error('Payment failed:', error);
 *   }
 * };
 * 
 * // Courier Example:
 * const handleCourierOrder = async () => {
 *   try {
 *     const result = await createSteadfastOrder({
 *       orderId: 'ORDER123',
 *       customerName: 'John Doe',
 *       customerPhone: '+8801700000000',
 *       customerAddress: 'Dhaka, Bangladesh',
 *       codAmount: 1000,
 *       items: [{ productName: 'Product A', quantity: 1 }],
 *     });
 *     
 *     console.log('Tracking number:', result.trackingNumber);
 *   } catch (error) {
 *     console.error('Courier order failed:', error);
 *   }
 * };
 * 
 * // Tracking Example:
 * const handleTracking = async () => {
 *   try {
 *     const result = await trackShipment('steadfast', 'TRACK123');
 *     console.log('Current status:', result.status);
 *   } catch (error) {
 *     console.error('Tracking failed:', error);
 *   }
 * };
 */
