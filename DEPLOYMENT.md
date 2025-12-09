# TruEstate Deployment Guide - Render

This guide walks you through deploying the TruEstate application to Render.

## Prerequisites

- ✅ GitHub account
- ✅ Code pushed to GitHub repository
- ✅ MongoDB Atlas database configured
- ✅ Render account (free tier available at [render.com](https://render.com))

## Architecture

- **Backend**: Node.js/Express API → Render Web Service
- **Frontend**: React/Vite SPA → Render Static Site
- **Database**: MongoDB Atlas (already configured)

---

## Part 1: Deploy Backend (Web Service)

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `TruestateAssignment` (or your repo name)

### Step 2: Configure Web Service

Fill in the following settings:

| Setting            | Value                                        |
| ------------------ | -------------------------------------------- |
| **Name**           | `truestate-backend` (or any name you prefer) |
| **Region**         | Choose closest to you (e.g., Singapore)      |
| **Branch**         | `main` (or your default branch)              |
| **Root Directory** | `backend`                                    |
| **Environment**    | `Node`                                       |
| **Build Command**  | `npm install`                                |
| **Start Command**  | `npm start`                                  |
| **Instance Type**  | `Free`                                       |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add the following:

1. **MONGODB_URI**

   - Value: (Copy from your `backend/.env` file)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/truestate`

2. **NODE_ENV**

   - Value: `production`

3. **PORT** (Optional - Render sets this automatically)
   - Value: `10000`

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, you'll see: ✅ **"Live"** status
4. **Copy your backend URL**: `https://truestate-backend-XXXX.onrender.com`

### Step 5: Test Backend

Open in browser or use curl:

```
https://your-backend-url.onrender.com/health
```

You should see:

```json
{
  "status": "OK",
  "message": "TruEstate API is running"
}
```

---

## Part 2: Deploy Frontend (Static Site)

### Step 1: Create New Static Site

1. Go back to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → Select **"Static Site"**
3. Select the same repository: `TruestateAssignment`

### Step 2: Configure Static Site

| Setting               | Value                              |
| --------------------- | ---------------------------------- |
| **Name**              | `truestate-frontend` (or any name) |
| **Branch**            | `main`                             |
| **Root Directory**    | `frontend`                         |
| **Build Command**     | `npm install && npm run build`     |
| **Publish Directory** | `dist`                             |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add:

**VITE_API_URL**

- Value: `https://your-backend-url.onrender.com/api`
- ⚠️ Replace with your actual backend URL from Part 1, Step 4
- ⚠️ Make sure to add `/api` at the end

Example: `https://truestate-backend-xxxx.onrender.com/api`

### Step 4: Deploy

1. Click **"Create Static Site"**
2. Wait for build and deployment (takes 3-7 minutes)
3. Once deployed, you'll see: ✅ **"Live"** status
4. **Copy your frontend URL**: `https://truestate-frontend-XXXX.onrender.com`

### Step 5: Access Your Application

Open the frontend URL in your browser:

```
https://your-frontend-url.onrender.com
```

---

## Part 3: Verification

### Check These Features:

1. ✅ Dashboard loads with charts
2. ✅ KPI cards display total units, revenue, discounts
3. ✅ Search functionality works
4. ✅ Filters work (region, gender, category, etc.)
5. ✅ Pagination navigates between pages
6. ✅ Charts update based on filters
7. ✅ No console errors

### Troubleshooting

**Frontend shows "Network Error" or can't fetch data:**

- Check that `VITE_API_URL` is set correctly in frontend environment variables
- Verify backend URL ends with `/api`
- Check backend is running (visit `/health` endpoint)

**Backend deployment fails:**

- Check build logs for errors
- Verify `MONGODB_URI` is set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**CORS errors:**

- Backend already has `cors()` enabled, should work automatically
- If issues persist, you may need to configure specific origins

---

## Important Notes

### Free Tier Limitations

- ⏰ **Backend sleeps after 15 minutes of inactivity**
  - First request after sleep takes ~30-60 seconds (cold start)
  - Subsequent requests are fast
- 💾 **750 hours/month free** (enough for 1 service running 24/7)

### Updating Your Application

When you push new code to GitHub:

1. Render auto-deploys automatically
2. Or manually trigger deploy from Render dashboard

### Environment Variables

To update environment variables later:

1. Go to your service in Render dashboard
2. Click **"Environment"** tab
3. Edit variables and save
4. Service will redeploy automatically

---

## Next Steps

### Optional Enhancements:

1. **Custom Domain**: Add your own domain in Render dashboard
2. **HTTPS**: Already enabled by default on Render
3. **Monitoring**: Enable notifications for deploy failures
4. **Logs**: View real-time logs in Render dashboard

---

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

## Summary

Your TruEstate application is now live! 🎉

- **Backend API**: `https://your-backend-url.onrender.com`
- **Frontend App**: `https://your-frontend-url.onrender.com`
- **Database**: MongoDB Atlas (cloud)

You can share the frontend URL with anyone to access your analytics dashboard!
