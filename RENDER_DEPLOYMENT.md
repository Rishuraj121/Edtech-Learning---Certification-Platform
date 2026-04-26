# 🚀 Render Deployment Guide - Backend

## Complete Step-by-Step Guide for Deploying SkillHub Backend to Render

### Prerequisites
- GitHub account with SkillHub repository
- Render account (free tier available)
- MongoDB Atlas account for database

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Cluster
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create account
3. Click "Create" → Create a new project
4. Click "Create a Deployment" → Select "M0 Free Tier"
5. Choose your region (closest to your users)
6. Click "Create Cluster" (takes ~5 minutes)

### 1.2 Create Database User
1. In Atlas dashboard, go to "Database Access"
2. Click "Add New Database User"
3. Set username: `skillhub_user`
4. Set password: Generate strong password
5. Click "Add User"
6. Copy the username and password

### 1.3 Get Connection String
1. Go to "Databases" → Click "Connect"
2. Select "Drivers" → Node.js
3. Copy connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `myFirstDatabase` with `skillhub`

**Example:**
```
mongodb+srv://skillhub_user:YourPassword123@cluster.mongodb.net/skillhub?retryWrites=true&w=majority
```

### 1.4 Whitelist IP
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow from Anywhere" (or specify Render's IPs)
4. Confirm

---

## Step 2: Push Code to GitHub

```bash
# In project root (contains backend/ and frontend/)
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

---

## Step 3: Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Sign up"
3. Sign up with GitHub (easier for deployment)
4. Authorize Render to access your repositories

---

## Step 4: Deploy Backend

### 4.1 Create Web Service
1. In Render dashboard, click "New +" → "Web Service"
2. Select your SkillHub repository
3. Click "Connect"

### 4.2 Configure Deployment

Fill in the form:
- **Name**: `skillhub-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Plan**: Select "Free" (or Starter if you want custom domain)

### 4.3 Important: Set Root Directory
⚠️ **Critical Step**
1. Before clicking "Create Web Service"
2. Look for "Root Directory" field
3. Enter: `backend`
4. Then click "Create Web Service"

---

## Step 5: Set Environment Variables

### 5.1 In Render Dashboard
1. Go to your service → "Environment"
2. Click "Add Environment Variable"
3. Add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `5000` | `5000` |
| `MONGODB_URI` | Your MongoDB Atlas URI | `mongodb+srv://...` |
| `JWT_SECRET` | Strong random string | `your$uP3rS3cr3tK3y!` |
| `JWT_EXPIRE` | `7d` | `7d` |

### 5.2 Generate JWT_SECRET
Use this command to generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 6: Monitor Deployment

1. In Render dashboard, watch the "Logs" tab
2. You should see:
   ```
   ✅ MongoDB connected successfully
   ✅ SkillHub backend running on port 5000
   ```

3. Copy your service URL: `https://skillhub-backend.onrender.com`

---

## Step 7: Verify Backend is Working

Test your backend:
```bash
curl https://skillhub-backend.onrender.com
# Should return: {"message":"SkillHub API is running"}
```

---

## Common Issues & Solutions

### Issue: "Build failed"
**Solution:**
- Check that root directory is set to `backend`
- Ensure all dependencies in `backend/package.json` are correct
- Check logs for specific errors

### Issue: "MongoDB connection error"
**Solution:**
- Verify `MONGODB_URI` is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Check username/password are correct

### Issue: "Cannot find module"
**Solution:**
- Run `npm install` locally to verify package.json
- Check syntax errors in code

### Issue: 503 Service Unavailable
**Solution:**
- Wait for Render to fully start (takes ~60 seconds first time)
- Check application logs
- Ensure NODE_ENV is set to production

---

## Next Steps

1. Note your backend URL: `https://skillhub-backend.onrender.com`
2. Use this URL in frontend deployment
3. See "VERCEL_DEPLOYMENT.md" for frontend setup

---

## Auto-Deployment

✅ **Automatic Deployment Enabled**
- Any push to `main` branch automatically redeploys
- Deployment takes ~2-3 minutes
- Check status in Render dashboard

---

## Useful Render Commands

### View Logs
```
Dashboard → Your Service → Logs (live streaming)
```

### Restart Service
```
Dashboard → Your Service → Manual Deploys → Deploy Latest Commit
```

### Scale Service
```
Dashboard → Your Service → Settings → Scaling
```

---

## Free Tier Limitations
- App goes to sleep after 15 min of inactivity
- First wake-up takes ~30 seconds
- 750 hours/month runtime

**For production:** Upgrade to Starter Plan ($7/month)

---

**Backend Deployment Complete! ✅**

Next: Deploy frontend to Vercel using `VERCEL_DEPLOYMENT.md`
