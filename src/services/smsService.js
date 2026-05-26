// SMS Gateway Integration Service

export const SMSService = {
  sendSMS: async (phoneNumber, message) => {
    const apiKey = process.env.REACT_APP_SMS_GATEWAY_API_KEY;
    const senderId = process.env.REACT_APP_SMS_GATEWAY_SENDER_ID;
    const baseUrl = process.env.REACT_APP_SMS_GATEWAY_URL;

    const data = {
      api_key: apiKey,
      senderid: senderId,
      number: phoneNumber,
      message: message,
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
      console.error('SMS Sending Error:', error);
      throw error;
    }
  },

  sendOrderConfirmationSMS: async (phoneNumber, orderId, totalAmount) => {
    const message = `Dear Customer, Your order #${orderId} has been confirmed. Total amount: ${totalAmount} BDT. Thank you for shopping with us!`;
    return await SMSService.sendSMS(phoneNumber, message);
  },

  sendOrderShippedSMS: async (phoneNumber, orderId, trackingNumber, courier) => {
    const message = `Dear Customer, Your order #${orderId} has been shipped via ${courier}. Tracking number: ${trackingNumber}. Track your order at our website.`;
    return await SMSService.sendSMS(phoneNumber, message);
  },

  sendOrderDeliveredSMS: async (phoneNumber, orderId) => {
    const message = `Dear Customer, Your order #${orderId} has been delivered successfully. Thank you for shopping with us!`;
    return await SMSService.sendSMS(phoneNumber, message);
  },

  sendOTPSMS: async (phoneNumber, otp) => {
    const message = `Your OTP verification code is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`;
    return await SMSService.sendSMS(phoneNumber, message);
  },

  sendPromotionalSMS: async (phoneNumber, promotionMessage) => {
    return await SMSService.sendSMS(phoneNumber, promotionMessage);
  },

  sendBulkSMS: async (phoneNumbers, message) => {
    const promises = phoneNumbers.map(phone => SMSService.sendSMS(phone, message));
    return await Promise.allSettled(promises);
  },
};
