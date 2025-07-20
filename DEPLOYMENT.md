# 🚀 Vercel Deployment Guide

This guide will help you deploy your Weather App to Vercel with both frontend and backend.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **MongoDB Atlas**: Your database is already configured
4. **OpenWeatherMap API Key**: Already configured

## 🔧 Deployment Steps

### 1. **Prepare Your Repository**
```bash
# Make sure all files are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com) and login
2. Click **"New Project"**
3. Import your repository
4. Vercel will auto-detect it as a monorepo

### 3. **Configure Environment Variables**

In your Vercel dashboard, go to **Settings → Environment Variables** and add:

**Production Environment Variables:**
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://vermaisha7664:ishav7664@cluster.onukt3p.mongodb.net/weatherapp?retryWrites=true&w=majority&appName=Cluster
OPENWEATHER_API_KEY=068fd9cfd58b4f77b45ac6ff68887799
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app-name.vercel.app
```

### 4. **Update Frontend API URL**

After deployment, update your frontend environment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_URL=https://your-app-name.vercel.app/api`
3. Redeploy the project

### 5. **Custom Domain (Optional)**

1. Go to **Settings → Domains**
2. Add your custom domain
3. Update `FRONTEND_URL` environment variable to match

## 📁 Project Structure for Vercel

```
weatherapp/
├── vercel.json              # Vercel configuration
├── .env.example            # Environment template
├── frontend/               # React frontend
│   ├── .env               # Frontend environment
│   ├── package.json       # Frontend dependencies
│   └── ...
├── backend/               # Express backend
│   ├── api/
│   │   └── index.js      # Vercel API entry point
│   ├── server.js         # Express app
│   └── ...
└── README.md
```

## 🔧 Vercel Configuration

The `vercel.json` file handles:
- **Frontend**: Built as static site and served from `/`
- **Backend**: Runs as serverless functions on `/api/*`
- **Routing**: API calls go to backend, everything else to frontend

## 🌐 URLs After Deployment

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-app-name.vercel.app/api`
- **Health Check**: `https://your-app-name.vercel.app/api/health`

## 🚨 Common Issues & Solutions

### Issue: "Cannot find module" error
**Solution**: Make sure all dependencies are in `package.json`

### Issue: API calls failing
**Solution**: Check that `VITE_API_URL` points to your Vercel URL

### Issue: MongoDB connection fails
**Solution**: Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)

### Issue: Environment variables not working
**Solution**: 
1. Check they're set in Vercel dashboard
2. Redeploy after adding new variables
3. Make sure frontend vars start with `VITE_`

## 📊 Monitoring

- **Vercel Dashboard**: Monitor deployments and errors
- **MongoDB Atlas**: Monitor database connections
- **OpenWeatherMap**: Monitor API usage

## 🔄 Redeployment

Vercel automatically redeploys when you push to your main branch. For manual deployment:

1. Go to Vercel Dashboard
2. Click **"Redeploy"** on your latest deployment

## 📱 Testing

After deployment, test:
1. Visit your Vercel URL
2. Test weather search
3. Test user registration/login
4. Test saving/removing locations
5. Test theme switching

## 🎉 Success!

Your Weather App is now live on Vercel! Share your URL and enjoy your deployed application.

---

**Need help?** Check the Vercel documentation or contact support.
