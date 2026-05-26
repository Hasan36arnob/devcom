// Payment Gateway Integration Services
// Supports: SSLCommerz, bKash, Nagad, Rocket

export const SSLCommerzService = {
  initiatePayment: async (paymentData) => {
    const {
      store_id = process.env.REACT_APP_SSLCOMMERZ_STORE_ID,
      store_passwd = process.env.REACT_APP_SSLCOMMERZ_STORE_PASSWORD,
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
    } = paymentData;

    const isSandbox = process.env.REACT_APP_SSLCOMMERZ_SANDBOX === 'true';
    const baseUrl = isSandbox 
      ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php' 
      : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

    const data = {
      store_id,
      store_passwd,
      total_amount,
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
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SSLCommerz Payment Error:', error);
      throw error;
    }
  },

  validatePayment: async (tran_id) => {
    const store_id = process.env.REACT_APP_SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.REACT_APP_SSLCOMMERZ_STORE_PASSWORD;
    const isSandbox = process.env.REACT_APP_SSLCOMMERZ_SANDBOX === 'true';
    const baseUrl = isSandbox 
      ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php' 
      : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

    const data = {
      store_id,
      store_passwd,
      tran_id,
      val_id: tran_id,
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('SSLCommerz Validation Error:', error);
      throw error;
    }
  },
};

export const BkashService = {
  createPayment: async (amount, merchantInvoiceNumber) => {
    const isSandbox = process.env.REACT_APP_BKASH_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create'
      : 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create';

    const credentials = {
      username: process.env.REACT_APP_BKASH_USERNAME,
      password: process.env.REACT_APP_BKASH_PASSWORD,
      appKey: process.env.REACT_APP_BKASH_APP_SECRET,
      appSecret: process.env.REACT_APP_BKASH_APP_SECRET,
    };

    const data = {
      mode: '0011',
      payerReference: ' ',
      callbackURL: `${window.location.origin}/payment/bkash/callback`,
      merchantInvoiceNumber,
      amount: amount.toString(),
      currency: 'BDT',
      intent: 'sale',
      merchantAssociationInfo: 'MI0566_MERCHANT_NAME_ECOMMERCE',
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${credentials.appKey}`,
          'X-APP-Key': credentials.appKey,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash Payment Error:', error);
      throw error;
    }
  },

  executePayment: async (paymentID) => {
    const isSandbox = process.env.REACT_APP_BKASH_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute'
      : 'https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute';

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_BKASH_APP_SECRET}`,
          'X-APP-Key': process.env.REACT_APP_BKASH_APP_SECRET,
        },
        body: JSON.stringify({ paymentID }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('bKash Execute Error:', error);
      throw error;
    }
  },
};

export const NagadService = {
  createPayment: async (amount, orderId) => {
    const isSandbox = process.env.REACT_APP_NAGAD_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.mynagad.com/checkout'
      : 'https://api.mynagad.com/checkout';

    const data = {
      merchantId: process.env.REACT_APP_NAGAD_MERCHANT_ID,
      merchantAccount: process.env.REACT_APP_NAGAD_MERCHANT_ACCOUNT,
      amount: amount.toString(),
      orderId,
      currency: 'BDT',
      dateTime: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      challenge: 'nagad_challenge',
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Nagad Payment Error:', error);
      throw error;
    }
  },

  verifyPayment: async (paymentRefId) => {
    const isSandbox = process.env.REACT_APP_NAGAD_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.mynagad.com/verify'
      : 'https://api.mynagad.com/verify';

    try {
      const response = await fetch(`${baseUrl}/${paymentRefId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Nagad Verification Error:', error);
      throw error;
    }
  },
};

export const RocketService = {
  createPayment: async (amount, orderId) => {
    const isSandbox = process.env.REACT_APP_ROCKET_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.rocket.com.bd/api/payment/create'
      : 'https://api.rocket.com.bd/api/payment/create';

    const data = {
      merchantId: process.env.REACT_APP_ROCKET_MERCHANT_ID,
      merchantAccount: process.env.REACT_APP_ROCKET_MERCHANT_ACCOUNT,
      amount: amount.toString(),
      orderId,
      currency: 'BDT',
      callbackUrl: `${window.location.origin}/payment/rocket/callback`,
    };

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_ROCKET_API_KEY,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Rocket Payment Error:', error);
      throw error;
    }
  },

  verifyPayment: async (transactionId) => {
    const isSandbox = process.env.REACT_APP_ROCKET_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.rocket.com.bd/api/payment/verify'
      : 'https://api.rocket.com.bd/api/payment/verify';

    try {
      const response = await fetch(`${baseUrl}/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.REACT_APP_ROCKET_API_KEY,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Rocket Verification Error:', error);
      throw error;
    }
  },
};

export const PaymentService = {
  processPayment: async (gateway, paymentData) => {
    switch (gateway.toLowerCase()) {
      case 'sslcommerz':
        return await SSLCommerzService.initiatePayment(paymentData);
      case 'bkash':
        return await BkashService.createPayment(paymentData.amount, paymentData.orderId);
      case 'nagad':
        return await NagadService.createPayment(paymentData.amount, paymentData.orderId);
      case 'rocket':
        return await RocketService.createPayment(paymentData.amount, paymentData.orderId);
      default:
        throw new Error('Unsupported payment gateway');
    }
  },

  verifyPayment: async (gateway, transactionId) => {
    switch (gateway.toLowerCase()) {
      case 'sslcommerz':
        return await SSLCommerzService.validatePayment(transactionId);
      case 'bkash':
        return await BkashService.executePayment(transactionId);
      case 'nagad':
        return await NagadService.verifyPayment(transactionId);
      case 'rocket':
        return await RocketService.verifyPayment(transactionId);
      default:
        throw new Error('Unsupported payment gateway');
    }
  },
};
