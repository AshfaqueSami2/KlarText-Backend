# Vercel Deployment Guide for KlarText API

## ✅ Prerequisites Completed
- ✅ Removed Socket.io dependencies (not needed without voice room)
- ✅ Created `vercel.json` configuration
- ✅ Adjusted timeout settings for Vercel limits

## 📋 Deployment Steps

### 1. Build Your Project
```bash
npm run build
```

### 2. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 3. Login to Vercel
```bash
vercel login
```

### 4. Deploy to Vercel
```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

## 🔧 Environment Variables to Configure in Vercel

Go to your Vercel project settings → Environment Variables and add:

### Required Variables:
- `NODE_ENV` = `production`
- `DATABASE_URL` = Your MongoDB connection string
- `JWT_SECRET` = Your JWT secret key
- `JWT_EXPIRES_IN` = Token expiration (e.g., `7d`)
- `BCRYPT_SALT_ROUNDS` = `12`
- `CLIENT_URL` = Your frontend URL

### OAuth (Google):
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`

### Azure TTS:
- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`

### Azure Blob Storage:
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_STORAGE_CONTAINER_NAME`

### Payment (SSLCommerz):
- `SSLCOMMERZ_STORE_ID`
- `SSLCOMMERZ_STORE_PASSWORD`
- `SSLCOMMERZ_IS_LIVE` = `false` (for sandbox)

### Optional (Redis):
- If using external Redis (e.g., Upstash):
  - `REDIS_URL` = Your Redis connection URL
  - `REDIS_PASSWORD` = Your Redis password

## ⚠️ Important Vercel Limitations

### 1. **Timeout Limits**
- **Hobby Plan**: 10 seconds max
- **Pro Plan**: 60 seconds max (configured in vercel.json)
- Your app is configured for 50s timeout to stay under the limit

### 2. **No Redis by Default**
- Your app gracefully handles missing Redis (caching disabled)
- For Redis on Vercel, use external service: [Upstash Redis](https://upstash.com/)

### 3. **Stateless Functions**
- Each request may hit a different serverless function instance
- Sessions work fine (stored in MongoDB)
- No persistent file storage (use Azure Blob for uploads)

### 4. **File Uploads**
- Already using Azure Blob Storage ✅
- Audio files should be served from Azure, not local storage

### 5. **Environment-Specific**
- PM2 features (clustering, watch mode) won't work on Vercel
- Use Vercel's auto-scaling instead

## 🚀 Deployment Command Summary

```bash
# 1. Build the project
npm run build

# 2. Test locally (optional)
vercel dev

# 3. Deploy to production
vercel --prod
```

## 📝 Post-Deployment Checklist

- [ ] Verify all environment variables are set in Vercel dashboard
- [ ] Test API health endpoint: `https://your-app.vercel.app/health`
- [ ] Update frontend API URL to point to Vercel deployment
- [ ] Test authentication flows (JWT, Google OAuth)
- [ ] Test file uploads (should use Azure Blob)
- [ ] Monitor function execution times (should be under 60s)
- [ ] Check MongoDB connection (use MongoDB Atlas for best results)

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Upstash Redis](https://upstash.com/) (if needed)

## 🐛 Troubleshooting

### "Function execution timed out"
- Check if any routes take longer than 60 seconds
- Optimize database queries
- Consider upgrading to Pro plan if needed

### "Cannot connect to MongoDB"
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Vercel's IP ranges to whitelist

### "Redis connection failed"
- This is normal if not using external Redis
- App continues working without caching

### "CORS errors"
- Add your Vercel domain to allowed origins in `src/app.ts`
- Already includes: `https://klartext-wine.vercel.app`
