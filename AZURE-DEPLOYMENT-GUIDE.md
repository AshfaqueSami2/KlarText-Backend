# Azure Backend Deployment Configuration Guide

## 🎯 Quick Setup Checklist

Your backend is now configured to work seamlessly with your frontend. Follow these steps to complete the setup:

## 📝 Required Azure Environment Variables

### 1. In Azure Portal → App Service → Configuration → Application Settings

Add all these environment variables:

```bash
# ===== ENVIRONMENT =====
NODE_ENV=production
ENV=production
PORT=8080

# ===== DATABASE =====
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority

# ===== AUTHENTICATION =====
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=12
DEFAULT_PASS=defaultPassword123

# ===== FRONTEND/BACKEND URLS =====
CLIENT_URL=https://your-frontend-domain.vercel.app
BACKEND_URL=https://your-app-name.azurewebsites.net

# Optional: Additional frontend URLs if you have multiple domains
CLIENT_URL_2=https://www.yourdomain.com
CLIENT_URL_3=https://yourdomain.com

# Optional: Custom payment redirect URLs (if different from default /payment/success paths)
FRONTEND_PAYMENT_SUCCESS_URL=https://your-frontend-domain.vercel.app/payment/success
FRONTEND_PAYMENT_FAIL_URL=https://your-frontend-domain.vercel.app/payment/failed
FRONTEND_PAYMENT_CANCEL_URL=https://your-frontend-domain.vercel.app/payment/cancelled

# ===== GOOGLE OAUTH =====
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-app-name.azurewebsites.net/api/v1/auth/google/callback

# ===== CLOUDINARY =====
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ===== AZURE SERVICES =====
# Speech Service
AZURE_SPEECH_KEY=your-azure-speech-key
AZURE_SPEECH_REGION=eastus
AZURE_SPEECH_VOICE=de-DE-KatjaNeural

# Blob Storage
AZURE_BLOB_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_BLOB_CONTAINER=your-container-name

# Translator Service
AZURE_TRANSLATOR_KEY=your-translator-key
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
AZURE_TRANSLATOR_REGION=eastus

# ===== GEMINI API =====
GEMINI_API_KEY=your-gemini-api-key

# ===== PAYMENT (SSLCOMMERZ) =====
SSLCOMMERZ_STORE_ID=your-store-id
SSLCOMMERZ_STORE_PASSWD=your-store-password
SSLCOMMERZ_IS_LIVE=false
# Set to 'true' when going to production with real payments
```

## 🔐 MongoDB Setup

### Allow Azure IP Access:
1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific Azure datacenter IPs for better security

## 🔍 Verify Deployment

### 1. Test Health Endpoint
```bash
curl https://your-app-name.azurewebsites.net/health
```

Expected response:
```json
{
  "success": true,
  "message": "KlarText API is healthy",
  "environment": "production",
  "database": "connected",
  "uptime": 123
}
```

### 2. Test CORS
Open browser console on your frontend and run:
```javascript
fetch('https://your-app-name.azurewebsites.net/api/v1/subscription/plans')
  .then(r => r.json())
  .then(console.log)
```

Should return subscription plans without CORS errors.

## 🎨 Frontend Configuration

In your frontend `.env.production` or `.env`:

```bash
# API Base URL
NEXT_PUBLIC_API_URL=https://your-app-name.azurewebsites.net/api/v1

# Or if using custom domain:
NEXT_PUBLIC_API_URL=https://api.klartext.tech/api/v1
```

### Frontend API Client Example

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = {
  // Get with credentials
  async get(endpoint: string) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include', // Important for cookies/sessions
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  // Post with credentials
  async post(endpoint: string, data: any) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },

  // For file uploads
  async uploadFile(endpoint: string, formData: FormData) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // Don't set Content-Type for FormData
    });
    
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return res.json();
  },
};
```

## 🔄 Google OAuth Setup

### Update Google Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add Authorized redirect URIs:
   ```
   https://your-app-name.azurewebsites.net/api/v1/auth/google/callback
   ```

## 💳 Payment Integration

### SSLCommerz Setup:
1. Update success/fail/cancel URLs in SSLCommerz dashboard to point to:
   - Success: `https://your-app-name.azurewebsites.net/api/v1/payment/success`
   - Fail: `https://your-app-name.azurewebsites.net/api/v1/payment/fail`
   - Cancel: `https://your-app-name.azurewebsites.net/api/v1/payment/cancel`
   - IPN: `https://your-app-name.azurewebsites.net/api/v1/payment/ipn`

Note: Backend handles these callbacks and redirects to your frontend automatically.

## 🚀 Deploy Updates

After making configuration changes:

```bash
# From your local backend directory
git add .
git commit -m "Update configuration for Azure deployment"
git push azure main
```

Or use Azure DevOps/GitHub Actions for CI/CD.

## 🐛 Troubleshooting

### CORS Errors
- Verify `CLIENT_URL` in Azure exactly matches your frontend domain
- Check browser console for specific CORS error
- Ensure credentials: 'include' is set in frontend fetch requests

### Database Connection Issues
- Check MongoDB connection string is correct
- Verify MongoDB allows Azure IPs
- Check Azure logs: Azure Portal → App Service → Log Stream

### Authentication Issues
- Verify all JWT secrets are set
- Check cookie settings work with your domain
- For cross-domain cookies, may need to adjust sameSite policy

### Payment Redirect Issues
- Verify CLIENT_URL points to your frontend
- Check SSLCommerz sandbox vs live mode
- Ensure transaction IDs are unique

## 📊 Monitoring

### Check Logs:
```bash
# Azure CLI
az webapp log tail --name your-app-name --resource-group your-resource-group

# Or use Azure Portal
# App Service → Monitoring → Log Stream
```

### Check App Insights (if enabled):
- Azure Portal → Application Insights
- View real-time metrics, requests, and failures

## ✅ Post-Deployment Checklist

- [ ] All environment variables set in Azure
- [ ] Health endpoint returns "connected" database status
- [ ] CORS allows your frontend domain
- [ ] MongoDB connection successful
- [ ] Google OAuth callback URL updated
- [ ] SSLCommerz URLs configured
- [ ] Frontend can fetch API without CORS errors
- [ ] Authentication flow works end-to-end
- [ ] Payment flow redirects properly

## 🔗 Useful Links

- [Azure App Service Docs](https://docs.microsoft.com/azure/app-service/)
- [MongoDB Atlas Network Access](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
- [Google OAuth Setup](https://console.cloud.google.com)
- [SSLCommerz Integration](https://developer.sslcommerz.com/)

---

## 🎉 You're All Set!

Your backend is now configured for seamless integration with your frontend. All URLs are dynamic and environment-based, making it easy to switch between development, staging, and production.

Need help? Check the logs or open an issue in the repository.
