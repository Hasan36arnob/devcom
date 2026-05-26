# Serverless E-Commerce Integration - Deployment Guide

This guide will help you deploy your React e-commerce application with secure payment gateway and courier service integrations using Vercel serverless functions.

## 📋 Prerequisites

- Node.js installed (v14 or higher)
- Git installed
- Vercel account (free)
- Payment gateway accounts (SSLCommerz, bKash, Nagad, Rocket)
- Courier service accounts (Steadfast, Redx, Pathao)

## 🚀 Deployment Steps

### 1. Set Up Local Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your public variables
# REACT_APP_ADMIN_USERNAME=admin
# REACT_APP_ADMIN_PASSWORD=your_secure_password
# REACT_APP_SITE_URL=http://localhost:3000
```

### 2. Test Locally

```bash
# Start development server
npm start

# Test the application at http://localhost:3000
# Test admin login with credentials from .env.local
```

### 3. Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Add serverless payment and courier integration"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? Your project name
# - Directory? . (current directory)
# - Override settings? No

# Deploy to production
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project settings:
   - Framework Preset: Create React App
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Click "Deploy"

### 5. Configure Environment Variables in Vercel

After deployment, you need to add your secret API keys:

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add the following variables (DO NOT add these to your code):

#### Payment Gateway Variables

```
SSLCOMMERZ_STORE_ID=your_sslcommerz_store_id
SSLCOMMERZ_STORE_PASSWORD=your_sslcommerz_store_password
SSLCOMMERZ_SANDBOX=true

BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
BKASH_REFRESH_TOKEN=your_bkash_refresh_token
BKASH_SANDBOX=true

NAGAD_MERCHANT_ID=your_nagad_merchant_id
NAGAD_MERCHANT_ACCOUNT=your_nagad_merchant_account
NAGAD_PUBLIC_KEY=your_nagad_public_key
NAGAD_PRIVATE_KEY=your_nagad_private_key
NAGAD_SANDBOX=true

ROCKET_MERCHANT_ID=your_rocket_merchant_id
ROCKET_MERCHANT_ACCOUNT=your_rocket_merchant_account
ROCKET_API_KEY=your_rocket_api_key
ROCKET_SANDBOX=true
```

#### Courier Service Variables

```
STEADFAST_API_KEY=your_steadfast_api_key
STEADFAST_SECRET_KEY=your_steadfast_secret_key
STEADFAST_SANDBOX=true

REDX_API_KEY=your_redx_api_key
REDX_API_SECRET=your_redx_api_secret
REDX_SANDBOX=true

PATHAO_CLIENT_ID=your_pathao_client_id
PATHAO_CLIENT_SECRET=your_pathao_client_secret
PATHAO_SANDBOX=true
```

#### Additional Variables

```
STORE_NAME=Your Store Name
SITE_URL=https://your-domain.vercel.app
```

6. Click **Save** and then **Redeploy** to apply changes

### 6. Update Production Environment Variables

Update your `.env.local` file for production:

```env
REACT_APP_API_URL=/api
REACT_APP_SITE_URL=https://your-domain.vercel.app
```

## 🧪 Testing

### Local Testing

```bash
# Start the development server
npm start

# Test admin login at http://localhost:3000/admin/login
# Use credentials from .env.local

# Test payment initiation (will fail without real API keys)
# Test courier order creation (will fail without real API keys)
```

### Production Testing

1. **Test Admin Login**
   - Go to `https://your-domain.vercel.app/admin/login`
   - Use credentials from Vercel environment variables

2. **Test Payment Initiation**
   - Create a test order in your app
   - Initiate payment using any gateway
   - Check if payment page loads correctly

3. **Test Courier Integration**
   - Create a test order with shipping
   - Select a courier service
   - Check if tracking number is generated

4. **Test Webhooks**
   - Complete a test payment
   - Verify payment status updates
   - Check order status changes

## 🔒 Security Best Practices

1. **Never commit `.env.local` to Git**
   - Add `.env.local` to `.gitignore`
   - Only commit `.env.example`

2. **Keep secrets in Vercel only**
   - All API keys should be in Vercel environment variables
   - Never expose them in frontend code

3. **Use sandbox mode for testing**
   - Set `*_SANDBOX=true` for all services during development
   - Switch to production only after thorough testing

4. **Rotate credentials regularly**
   - Change API keys periodically
   - Update Vercel environment variables accordingly

## 📝 Payment Gateway Setup

### SSLCommerz

1. Sign up at [sslcommerz.com](https://sslcommerz.com)
2. Get Store ID and Store Password from dashboard
3. Set up success/fail/cancel URLs in SSLCommerz dashboard:
   - Success: `https://your-domain.vercel.app/payment/success`
   - Fail: `https://your-domain.vercel.app/payment/fail`
   - Cancel: `https://your-domain.vercel.app/payment/cancel`
   - IPN: `https://your-domain.vercel.app/api/verify-payment`

### bKash

1. Sign up at [bka.sh](https://bka.sh)
2. Create a merchant account
3. Get App Key, App Secret, and Refresh Token
4. Set up callback URL in bKash dashboard

### Nagad

1. Sign up at [mynagad.com](https://mynagad.com)
2. Get Merchant ID and Account details
3. Generate Public/Private key pair

### Rocket

1. Sign up at [rocket.com.bd](https://rocket.com.bd)
2. Get Merchant ID and API Key
3. Set up callback URL

## 🚚 Courier Service Setup

### Steadfast

1. Sign up at [steadfast.com.bd](https://steadfast.com.bd)
2. Get API Key and Secret Key from dashboard
3. Enable API access in settings

### Redx

1. Sign up at [redx.com.bd](https://redx.com.bd)
2. Get API Key and Secret Key
3. Configure webhook for status updates

### Pathao

1. Sign up at [pathao.com](https://pathao.com)
2. Get Client ID and Client Secret
3. Set up API access in merchant dashboard

## 🐛 Troubleshooting

### Common Issues

**Issue: API calls failing with CORS errors**
- Solution: Ensure you're calling `/api/` endpoints, not direct gateway URLs

**Issue: Payment initiation fails**
- Solution: Check if API keys are correctly set in Vercel environment variables
- Solution: Verify sandbox mode is enabled for testing

**Issue: Courier order creation fails**
- Solution: Check courier API credentials
- Solution: Verify order data format matches courier requirements

**Issue: Webhook not receiving updates**
- Solution: Check if webhook URL is correctly configured in payment gateway
- Solution: Ensure Vercel deployment is live (not in preview)

### Debug Mode

Add console logging to serverless functions for debugging:

```javascript
// In api/create-payment.js
console.log('Payment initiation request:', { gateway, paymentData });
console.log('Environment check:', {
  hasSSLCommerz: !!process.env.SSLCOMMERZ_STORE_ID,
  hasBkash: !!process.env.BKASH_APP_KEY,
});
```

## 📚 API Usage Examples

### Payment Initiation

```javascript
import { initiateSSLCommerzPayment } from '../utils/api';

const handlePayment = async () => {
  const result = await initiateSSLCommerzPayment({
    total_amount: 1000,
    tran_id: 'ORDER123',
    success_url: `${window.location.origin}/payment/success`,
    fail_url: `${window.location.origin}/payment/fail`,
    cancel_url: `${window.location.origin}/payment/cancel`,
    ipn_url: `${window.location.origin}/api/verify-payment`,
    product_name: 'Product Name',
    product_category: 'Category',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'customer@email.com',
    cus_phone: '+8801700000000',
    cus_add1: 'Customer Address',
    cus_city: 'Dhaka',
    cus_country: 'Bangladesh',
    ship_name: 'Customer Name',
    ship_add1: 'Customer Address',
    ship_city: 'Dhaka',
    ship_country: 'Bangladesh',
  });

  if (result.GatewayPageURL) {
    window.location.href = result.GatewayPageURL;
  }
};
```

### Courier Order Creation

```javascript
import { createSteadfastOrder } from '../utils/api';

const handleCourierOrder = async () => {
  const result = await createSteadfastOrder({
    orderId: 'ORDER123',
    customerName: 'John Doe',
    customerPhone: '+8801700000000',
    customerAddress: 'Dhaka, Bangladesh',
    codAmount: 1000,
    items: [
      { productName: 'Product A', quantity: 1 },
      { productName: 'Product B', quantity: 2 },
    ],
  });

  console.log('Tracking number:', result.trackingNumber);
};
```

### Shipment Tracking

```javascript
import { trackShipment } from '../utils/api';

const handleTracking = async () => {
  const result = await trackShipment('steadfast', 'TRACK123');
  console.log('Current status:', result.status);
  console.log('Tracking history:', result.trackingHistory);
};
```

## 🎯 Next Steps

1. **Set up real payment gateway accounts**
2. **Configure webhook URLs in payment gateways**
3. **Test sandbox payments thoroughly**
4. **Switch to production mode**
5. **Monitor logs in Vercel dashboard**
6. **Set up error monitoring (optional)**

## 📞 Support

For issues with:
- **Vercel deployment**: Check [Vercel docs](https://vercel.com/docs)
- **Payment gateways**: Contact respective payment gateway support
- **Courier services**: Contact respective courier API support

## ⚡ Performance Tips

1. **Enable caching** for static assets in Vercel
2. **Use CDN** for product images
3. **Optimize API calls** by batching requests
4. **Monitor Vercel analytics** for performance insights

---

**Deployment time: ~10 minutes**
**Total setup time: ~30-45 minutes** (including account setup)
