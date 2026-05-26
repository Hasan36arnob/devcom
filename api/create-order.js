// Vercel Serverless Function for Courier Order Creation
// Handles Steadfast, Redx, and Pathao courier integration

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { courier, orderData } = req.body;

    // Validate required fields
    if (!courier || !orderData) {
      return res.status(400).json({ error: 'Missing required fields: courier and orderData' });
    }

    let response;

    switch (courier.toLowerCase()) {
      case 'steadfast':
        response = await createSteadfastOrder(orderData);
        break;
      case 'redx':
        response = await createRedxOrder(orderData);
        break;
      case 'pathao':
        response = await createPathaoOrder(orderData);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported courier service' });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Courier order creation error:', error);
    return res.status(500).json({ error: 'Courier order creation failed', message: error.message });
  }
}

// Steadfast Order Creation
async function createSteadfastOrder(orderData) {
  const is_sandbox = process.env.STEADFAST_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.steadfast.com.bd/api/v1/create_order'
    : 'https://steadfast.com.bd/api/v1/create_order';

  const data = {
    invoice: orderData.orderId,
    recipient_name: orderData.customerName,
    recipient_phone: orderData.customerPhone,
    recipient_address: orderData.customerAddress,
    cod_amount: orderData.codAmount,
    note: orderData.note || '',
    parcel_details: orderData.items.map(item => 
      `${item.productName} x ${item.quantity}`
    ).join(', '),
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': process.env.STEADFAST_API_KEY,
      'Secret-Key': process.env.STEADFAST_SECRET_KEY,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: result.status === 200 || result.success,
    trackingNumber: result.tracking_id || result.tracking_number,
    courierResponse: result,
  };
}

// Redx Order Creation
async function createRedxOrder(orderData) {
  const is_sandbox = process.env.REDX_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.redx.com.bd/api/v1/order'
    : 'https://redx.com.bd/api/v1/order';

  const data = {
    customer_name: orderData.customerName,
    customer_phone: orderData.customerPhone,
    customer_address: orderData.customerAddress,
    merchant_name: process.env.STORE_NAME || 'Your Store Name',
    merchant_order_id: orderData.orderId,
    amount: orderData.codAmount,
    item_type: 'parcel',
    item_quantity: orderData.items.length,
    item_weight: orderData.totalWeight || 1,
    item_description: orderData.items.map(item => 
      `${item.productName} x ${item.quantity}`
    ).join(', '),
    special_instruction: orderData.note || '',
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'API-KEY': process.env.REDX_API_KEY,
      'API-SECRET': process.env.REDX_API_SECRET,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: result.status === 200 || result.success,
    trackingNumber: result.tracking_id || result.tracking_number,
    courierResponse: result,
  };
}

// Pathao Order Creation
async function createPathaoOrder(orderData) {
  const is_sandbox = process.env.PATHAO_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox-apis.pathao.com'
    : 'https://apis.pathao.com';

  // Get access token first
  const tokenResponse = await getPathaoAccessToken();
  if (!tokenResponse || !tokenResponse.access_token) {
    throw new Error('Failed to get Pathao access token');
  }

  const data = {
    store_id: 0,
    merchant_order_id: orderData.orderId,
    recipient_name: orderData.customerName,
    recipient_phone: orderData.customerPhone,
    recipient_address: orderData.customerAddress,
    recipient_city: orderData.city || 'Dhaka',
    recipient_zone: orderData.zone || 'Dhaka South',
    recipient_area: orderData.area || 'Dhanmondi',
    delivery_type: '48',
    item_type: 'parcel',
    special_instruction: orderData.note || '',
    item_quantity: orderData.items.length,
    item_weight: orderData.totalWeight || 1,
    amount_to_collect: orderData.codAmount,
    item_description: orderData.items.map(item => 
      `${item.productName} x ${item.quantity}`
    ).join(', '),
  };

  const response = await fetch(`${baseUrl}/aladdin/api/v1/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokenResponse.access_token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  
  // Return standardized response
  return {
    success: result.status === 200 || result.code === 200,
    trackingNumber: result.consignment_id || result.tracking_number,
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
