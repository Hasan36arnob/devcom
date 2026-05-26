// Vercel Serverless Function for Shipment Tracking
// Handles Steadfast, Redx, and Pathao shipment tracking

import connectToDatabase from './utils/db.js';
import Order from './models/Order.js';
import { authenticate, authorize } from './utils/authMiddleware.js';

export default async function handler(req, res) {
  await connectToDatabase();

  // Allow both POST and GET requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication check
  const authResult = await new Promise((resolve) => {
    authenticate(req, res, () => resolve({ success: true }));
  });
  
  if (!authResult.success && res.headersSent) {
    return;
  }

  // Authorization check - all authenticated users can track shipments
  const authCheck = authorize(['admin', 'manager', 'accountant', 'staff']);
  const authResult2 = await new Promise((resolve) => {
    authCheck(req, res, () => resolve({ success: true }));
  });
  
  if (!authResult2.success && res.headersSent) {
    return;
  }

  try {
    const { courier, trackingNumber } = req.body || req.query;

    // Validate required fields
    if (!courier || !trackingNumber) {
      return res.status(400).json({ error: 'Missing required fields: courier and trackingNumber' });
    }

    let response;

    switch (courier.toLowerCase()) {
      case 'steadfast':
        response = await trackSteadfastShipment(trackingNumber);
        break;
      case 'redx':
        response = await trackRedxShipment(trackingNumber);
        break;
      case 'pathao':
        response = await trackPathaoShipment(trackingNumber);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported courier service' });
    }

    // Update order in MongoDB with tracking status
    if (response.success) {
      const order = await Order.findOne({ trackingNumber });
      if (order && response.status) {
        order.status = response.status.toLowerCase();
        
        // Update tracking history
        if (response.trackingHistory && response.trackingHistory.length > 0) {
          order.trackingHistory = response.trackingHistory;
        } else if (response.currentLocation) {
          order.trackingHistory.push({
            status: response.status,
            location: response.currentLocation,
            timestamp: new Date(),
            description: `Status updated to ${response.status}`,
          });
        }
        
        await order.save();
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Shipment tracking error:', error);
    return res.status(500).json({ error: 'Shipment tracking failed', message: error.message });
  }
}

// Steadfast Shipment Tracking
async function trackSteadfastShipment(trackingId) {
  const is_sandbox = process.env.STEADFAST_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.steadfast.com.bd/api/v1/status'
    : 'https://steadfast.com.bd/api/v1/status';

  const response = await fetch(`${baseUrl}/${trackingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': process.env.STEADFAST_API_KEY,
      'Secret-Key': process.env.STEADFAST_SECRET_KEY,
    },
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: true,
    trackingNumber: trackingId,
    status: result.status || result.delivery_status,
    currentLocation: result.current_location || result.location,
    estimatedDelivery: result.estimated_delivery,
    trackingHistory: result.tracking_history || [],
    courierResponse: result,
  };
}

// Redx Shipment Tracking
async function trackRedxShipment(trackingId) {
  const is_sandbox = process.env.REDX_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.redx.com.bd/api/v1/track'
    : 'https://redx.com.bd/api/v1/track';

  const response = await fetch(`${baseUrl}/${trackingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'API-KEY': process.env.REDX_API_KEY,
      'API-SECRET': process.env.REDX_API_SECRET,
    },
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: true,
    trackingNumber: trackingId,
    status: result.status || result.delivery_status,
    currentLocation: result.current_location || result.location,
    estimatedDelivery: result.estimated_delivery,
    trackingHistory: result.tracking_history || [],
    courierResponse: result,
  };
}

// Pathao Shipment Tracking
async function trackPathaoShipment(orderId) {
  const is_sandbox = process.env.PATHAO_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox-apis.pathao.com'
    : 'https://apis.pathao.com';

  // Get access token first
  const tokenResponse = await getPathaoAccessToken();
  if (!tokenResponse || !tokenResponse.access_token) {
    throw new Error('Failed to get Pathao access token');
  }

  const response = await fetch(`${baseUrl}/aladdin/api/v1/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokenResponse.access_token}`,
    },
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: true,
    trackingNumber: orderId,
    status: result.status || result.delivery_status,
    currentLocation: result.current_location || result.location,
    estimatedDelivery: result.estimated_delivery,
    trackingHistory: result.tracking_history || [],
    courierResponse: result,
  };
}

// Get Pathao Access Token
async function getPathaoAccessToken() {
  const is_sandbox = process.env.PATHAO_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox-apis.pathao.com'
    : 'https://apis.pathao.com';

  const data = {
    client_id: process.env.PATHAO_CLIENT_ID,
    client_secret: process.env.PATHAO_CLIENT_SECRET,
    username: process.env.PATHAO_CLIENT_ID,
    password: process.env.PATHAO_CLIENT_SECRET,
  };

  const response = await fetch(`${baseUrl}/aladdin/api/v1/issue-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  return result;
}
