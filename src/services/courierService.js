// Courier Integration Services
// Supports: Steadfast, Redx, Pathao

export const SteadfastService = {
  createOrder: async (orderData) => {
    const isSandbox = process.env.REACT_APP_STEADFAST_SANDBOX === 'true';
    const baseUrl = isSandbox
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

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.REACT_APP_STEADFAST_API_KEY,
          'Secret-Key': process.env.REACT_APP_STEADFAST_SECRET_KEY,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Steadfast Order Error:', error);
      throw error;
    }
  },

  trackOrder: async (trackingId) => {
    const isSandbox = process.env.REACT_APP_STEADFAST_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.steadfast.com.bd/api/v1/status'
      : 'https://steadfast.com.bd/api/v1/status';

    try {
      const response = await fetch(`${baseUrl}/${trackingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.REACT_APP_STEADFAST_API_KEY,
          'Secret-Key': process.env.REACT_APP_STEADFAST_SECRET_KEY,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Steadfast Tracking Error:', error);
      throw error;
    }
  },

  cancelOrder: async (trackingId) => {
    const isSandbox = process.env.REACT_APP_STEADFAST_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.steadfast.com.bd/api/v1/cancel_order'
      : 'https://steadfast.com.bd/api/v1/cancel_order';

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.REACT_APP_STEADFAST_API_KEY,
          'Secret-Key': process.env.REACT_APP_STEADFAST_SECRET_KEY,
        },
        body: JSON.stringify({ tracking_id: trackingId }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Steadfast Cancel Error:', error);
      throw error;
    }
  },
};

export const RedxService = {
  createOrder: async (orderData) => {
    const isSandbox = process.env.REACT_APP_REDX_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.redx.com.bd/api/v1/order'
      : 'https://redx.com.bd/api/v1/order';

    const data = {
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_address: orderData.customerAddress,
      merchant_name: 'Your Store Name',
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

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': process.env.REACT_APP_REDX_API_KEY,
          'API-SECRET': process.env.REACT_APP_REDX_API_SECRET,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Redx Order Error:', error);
      throw error;
    }
  },

  trackOrder: async (trackingId) => {
    const isSandbox = process.env.REACT_APP_REDX_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.redx.com.bd/api/v1/track'
      : 'https://redx.com.bd/api/v1/track';

    try {
      const response = await fetch(`${baseUrl}/${trackingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': process.env.REACT_APP_REDX_API_KEY,
          'API-SECRET': process.env.REACT_APP_REDX_API_SECRET,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Redx Tracking Error:', error);
      throw error;
    }
  },

  cancelOrder: async (trackingId) => {
    const isSandbox = process.env.REACT_APP_REDX_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox.redx.com.bd/api/v1/cancel'
      : 'https://redx.com.bd/api/v1/cancel';

    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': process.env.REACT_APP_REDX_API_KEY,
          'API-SECRET': process.env.REACT_APP_REDX_API_SECRET,
        },
        body: JSON.stringify({ tracking_id: trackingId }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Redx Cancel Error:', error);
      throw error;
    }
  },
};

export const PathaoService = {
  getAccessToken: async () => {
    const isSandbox = process.env.REACT_APP_PATHAO_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox-apis.pathao.com'
      : 'https://apis.pathao.com';

    try {
      const response = await fetch(`${baseUrl}/aladdin/api/v1/issue-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.REACT_APP_PATHAO_CLIENT_ID,
          client_secret: process.env.REACT_APP_PATHAO_CLIENT_SECRET,
          username: process.env.REACT_APP_PATHAO_CLIENT_ID,
          password: process.env.REACT_APP_PATHAO_CLIENT_SECRET,
        }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Pathao Token Error:', error);
      throw error;
    }
  },

  createOrder: async (orderData, accessToken) => {
    const isSandbox = process.env.REACT_APP_PATHAO_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox-apis.pathao.com'
      : 'https://apis.pathao.com';

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

    try {
      const response = await fetch(`${baseUrl}/aladdin/api/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Pathao Order Error:', error);
      throw error;
    }
  },

  trackOrder: async (orderId, accessToken) => {
    const isSandbox = process.env.REACT_APP_PATHAO_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox-apis.pathao.com'
      : 'https://apis.pathao.com';

    try {
      const response = await fetch(`${baseUrl}/aladdin/api/v1/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Pathao Tracking Error:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId, accessToken) => {
    const isSandbox = process.env.REACT_APP_PATHAO_SANDBOX === 'true';
    const baseUrl = isSandbox
      ? 'https://sandbox-apis.pathao.com'
      : 'https://apis.pathao.com';

    try {
      const response = await fetch(`${baseUrl}/aladdin/api/v1/orders/cancel/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Pathao Cancel Error:', error);
      throw error;
    }
  },
};

export const CourierService = {
  createCourierOrder: async (courier, orderData) => {
    switch (courier.toLowerCase()) {
      case 'steadfast':
        return await SteadfastService.createOrder(orderData);
      case 'redx':
        return await RedxService.createOrder(orderData);
      case 'pathao':
        const token = await PathaoService.getAccessToken();
        return await PathaoService.createOrder(orderData, token?.data?.access_token);
      default:
        throw new Error('Unsupported courier service');
    }
  },

  trackCourierOrder: async (courier, trackingId) => {
    switch (courier.toLowerCase()) {
      case 'steadfast':
        return await SteadfastService.trackOrder(trackingId);
      case 'redx':
        return await RedxService.trackOrder(trackingId);
      case 'pathao':
        const token = await PathaoService.getAccessToken();
        return await PathaoService.trackOrder(trackingId, token?.data?.access_token);
      default:
        throw new Error('Unsupported courier service');
    }
  },

  cancelCourierOrder: async (courier, trackingId) => {
    switch (courier.toLowerCase()) {
      case 'steadfast':
        return await SteadfastService.cancelOrder(trackingId);
      case 'redx':
        return await RedxService.cancelOrder(trackingId);
      case 'pathao':
        const token = await PathaoService.getAccessToken();
        return await PathaoService.cancelOrder(trackingId, token?.data?.access_token);
      default:
        throw new Error('Unsupported courier service');
    }
  },
};
