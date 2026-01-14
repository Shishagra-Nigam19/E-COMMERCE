# 🚀 Deployment to Vercel

Quick deployment instructions for the E-Commerce Platform.

## 📋 Prerequisites

- Vercel account ([Sign up here](https://vercel.com/signup))
- Vercel CLI installed
- Environment variables ready

## ⚡ Quick Start

### 1. Install Vercel CLI

```powershell
npm install -g vercel
```

### 2. Login to Vercel

```powershell
vercel login
```

## 🎯 Option 1: Use Deployment Scripts (Recommended)

### Deploy Backend

```powershell
.\deploy-backend.ps1
```

### Deploy Frontend

```powershell
.\deploy-frontend.ps1
```

## 🎯 Option 2: Manual Deployment

### Backend Deployment

```powershell
cd backend
vercel
# Follow prompts, then:
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add OPENAI_API_KEY
vercel --prod
```

### Frontend Deployment

1. Update `frontend/.env`:
   ```env
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   ```

2. Deploy:
   ```powershell
   cd frontend
   vercel
   vercel env add REACT_APP_API_URL
   vercel --prod
   ```

## 🎯 Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure separately for backend and frontend:
   - **Backend**: Root Directory = `backend`
   - **Frontend**: Root Directory = `frontend`, Framework = Create React App
5. Add environment variables
6. Deploy!

## 📚 Full Documentation

For detailed instructions, troubleshooting, and best practices, see:
- [Complete Deployment Guide](../brain/6bdc3ec4-d012-4964-8e31-3671620ab701/deployment_guide.md)

## 🔑 Required Environment Variables

### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay secret
- `OPENAI_API_KEY` - OpenAI API key

### Frontend
- `REACT_APP_API_URL` - Backend API URL

## ✅ Verify Deployment

### Test Backend
```powershell
curl https://your-backend-url.vercel.app/
```

Expected: `{"message": "E-Commerce API is running"}`

### Test Frontend
Visit your frontend URL and test:
- User registration/login
- Product browsing
- Cart functionality
- Checkout

## 🆘 Need Help?

- Check the [Full Deployment Guide](../brain/6bdc3ec4-d012-4964-8e31-3671620ab701/deployment_guide.md)
- View [Vercel Documentation](https://vercel.com/docs)
- Check deployment logs: `vercel logs`

---

**Ready to deploy? Let's go! 🚀**
