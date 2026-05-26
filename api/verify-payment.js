// Vercel Serverless Function for Payment Verification
// Handles SSLCommerz, bKash, Nagad, and Rocket payment verification webhooks

import connectToDatabase from './utils/db.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';

export default async function handler(req, res) {
  await connectToDatabase();

  // Allow both POST (for webhooks) and GET (for manual verification)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { gateway, transactionId, paymentData } = req.body || req.query;

    // Validate required fields
    if (!gateway || !transactionId) {
      return res.status(400).json({ error: 'Missing required fields: gateway and transactionId' });
    }

    let response;

    switch (gateway.toLowerCase()) {
      case 'sslcommerz':
        response = await verifySSLCommerzPayment(transactionId);
        break;
      case 'bkash':
        response = await verifyBkashPayment(transactionId, paymentData);
        break;
      case 'nagad':
        response = await verifyNagadPayment(transactionId);
        break;
      case 'rocket':
        response = await verifyRocketPayment(transactionId);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported payment gateway' });
    }

    // Update order in MongoDB with payment status
    if (response.success) {
      const order = await Order.findOne({ transactionId });
      if (order) {
        order.paymentStatus = response.status === 'VALID' || response.status === 'Completed' || response.status === 'Success' ? 'Paid' : 'Failed';
        
        // If payment successful and coupon was used, increment coupon usage
        if (order.paymentStatus === 'Paid' && order.couponCode) {
          const coupon = await Coupon.findOne({ code: order.couponCode.toUpperCase() });
          if (coupon) {
            coupon.usedCount += 1;
            await coupon.save();
          }
        }
        
        await order.save();
      }
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Payment verification error:', error);
    return res.status(500).json({ error: 'Payment verification failed', message: error.message });
  }
}

// SSLCommerz Payment Verification
async function verifySSLCommerzPayment(tran_id) {
  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const is_sandbox = process.env.SSLCOMMERZ_SANDBOX === 'true';

  const baseUrl = is_sandbox
    ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
    : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

  const formData = new URLSearchParams({
    store_id,
    store_passwd,
    tran_id,
    val_id: tran_id,
  });

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: result.status === 'VALID' || result.status === 'VALIDATED',
    status: result.status,
    transactionId: tran_id,
    amount: result.amount,
    currency: result.currency,
    cardType: result.card_type,
    gatewayResponse: result,
  };
}

// bKash Payment Verification
async function verifyBkashPayment(paymentId, paymentData) {
  const is_sandbox = process.env.BKASH_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute'
    : 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute';

  // Get access token first
  const tokenResponse = await getBkashAccessToken();
  if (!tokenResponse || !tokenResponse.access_token) {
    throw new Error('Failed to get bKash access token');
  }

  const formData = {
    paymentID: paymentId,
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenResponse.access_token}`,
      'X-APP-Key': process.env.BKASH_APP_KEY,
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: result.statusCode === '0000' || result.status === 'Completed',
    status: result.status,
    transactionId: result.transactionId,
    amount: result.amount,
    currency: result.currency,
    gatewayResponse: result,
  };
}

// Get bKash Access Token
async function getBkashAccessToken() {
  const is_sandbox = process.env.BKASH_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/get_refresh_token'
    : 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/get_refresh_token';

  const formData = {
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET,
    refresh_token: process.env.BKASH_REFRESH_TOKEN || '',
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BKASH_APP_KEY}`,
      'X-APP-Key': process.env.BKASH_APP_KEY,
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  return result;
}

// Nagad Payment Verification
async function verifyNagadPayment(paymentRefId) {
  const is_sandbox = process.env.NAGAD_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.mynagad.com/verify'
    : 'https://api.mynagad.com/verify';

  const response = await fetch(`${baseUrl}/${paymentRefId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: result.status === 'Success' || result.status === 'Completed',
    status: result.status,
    transactionId: paymentRefId,
    amount: result.amount,
    currency: result.currency,
    gatewayResponse: result,
  };
}

// Rocket Payment Verification
async function verifyRocketPayment(transactionId) {
  const is_sandbox = process.env.ROCKET_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.rocket.com.bd/api/payment/verify'
    : 'https://api.rocket.com.bd/api/payment/verify';

  const response = await fetch(`${baseUrl}/${transactionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.ROCKET_API_KEY,
    },
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: result.status === 'Success' || result.status === 'Completed',
    status: result.status,
    transactionId: transactionId,
    amount: result.amount,
    currency: result.currency,
    gatewayResponse: result,
  };
}
