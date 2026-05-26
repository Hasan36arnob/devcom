// Vercel Serverless Function for Payment Initiation
// Handles SSLCommerz, bKash, Nagad, and Rocket payment initiation

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { gateway, paymentData } = req.body;

    // Validate required fields
    if (!gateway || !paymentData) {
      return res.status(400).json({ error: 'Missing required fields: gateway and paymentData' });
    }

    let response;

    switch (gateway.toLowerCase()) {
      case 'sslcommerz':
        response = await initiateSSLCommerzPayment(paymentData);
        break;
      case 'bkash':
        response = await initiateBkashPayment(paymentData);
        break;
      case 'nagad':
        response = await initiateNagadPayment(paymentData);
        break;
      case 'rocket':
        response = await initiateRocketPayment(paymentData);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported payment gateway' });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Payment initiation error:', error);
    return res.status(500).json({ error: 'Payment initiation failed', message: error.message });
  }
}

// SSLCommerz Payment Initiation
async function initiateSSLCommerzPayment(data) {
  const {
    total_amount,
    currency = 'BDT',
    tran_id,
    success_url,
    fail_url,
    cancel_url,
    ipn_url,
    product_name,
    product_category,
    product_profile,
    cus_name,
    cus_email,
    cus_phone,
    cus_add1,
    cus_city,
    cus_country,
    ship_name,
    ship_add1,
    ship_city,
    ship_country,
  } = data;

  const store_id = process.env.SSLCOMMERZ_STORE_ID;
  const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const is_sandbox = process.env.SSLCOMMERZ_SANDBOX === 'true';

  const baseUrl = is_sandbox
    ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

  const formData = new URLSearchParams({
    store_id,
    store_passwd,
    total_amount: total_amount.toString(),
    currency,
    tran_id,
    success_url,
    fail_url,
    cancel_url,
    ipn_url,
    product_name,
    product_category,
    product_profile,
    cus_name,
    cus_email,
    cus_phone,
    cus_add1,
    cus_city,
    cus_country,
    ship_name,
    ship_add1,
    ship_city,
    ship_country,
  });

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  const result = await response.json();
  return result;
}

// bKash Payment Initiation
async function initiateBkashPayment(data) {
  const { amount, merchantInvoiceNumber } = data;

  const is_sandbox = process.env.BKASH_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create'
    : 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create';

  const formData = {
    mode: '0011',
    payerReference: ' ',
    callbackURL: data.callbackUrl || `${process.env.SITE_URL}/payment/bkash/callback`,
    merchantInvoiceNumber,
    amount: amount.toString(),
    currency: 'BDT',
    intent: 'sale',
    merchantAssociationInfo: 'MI0566_MERCHANT_NAME_ECOMMERCE',
  };

  // Get access token first
  const tokenResponse = await getBkashAccessToken();
  if (!tokenResponse || !tokenResponse.access_token) {
    throw new Error('Failed to get bKash access token');
  }

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
  return result;
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

// Nagad Payment Initiation
async function initiateNagadPayment(data) {
  const { amount, orderId } = data;

  const is_sandbox = process.env.NAGAD_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.mynagad.com/checkout'
    : 'https://api.mynagad.com/checkout';

  const formData = {
    merchantId: process.env.NAGAD_MERCHANT_ID,
    merchantAccount: process.env.NAGAD_MERCHANT_ACCOUNT,
    amount: amount.toString(),
    orderId,
    currency: 'BDT',
    dateTime: new Date().toISOString(),
    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    challenge: 'nagad_challenge',
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  return result;
}

// Rocket Payment Initiation
async function initiateRocketPayment(data) {
  const { amount, orderId } = data;

  const is_sandbox = process.env.ROCKET_SANDBOX === 'true';
  const baseUrl = is_sandbox
    ? 'https://sandbox.rocket.com.bd/api/payment/create'
    : 'https://api.rocket.com.bd/api/payment/create';

  const formData = {
    merchantId: process.env.ROCKET_MERCHANT_ID,
    merchantAccount: process.env.ROCKET_MERCHANT_ACCOUNT,
    amount: amount.toString(),
    orderId,
    currency: 'BDT',
    callbackUrl: data.callbackUrl || `${process.env.SITE_URL}/payment/rocket/callback`,
  };

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.ROCKET_API_KEY,
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();
  return result;
}
