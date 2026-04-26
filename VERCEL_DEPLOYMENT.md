# 🚀 Vercel Deployment Guide - Frontend

## Complete Step-by-Step Guide for Deploying SkillHub Frontend to Vercel

### Prerequisites
- GitHub account with SkillHub repository
- Vercel account (free tier)
- Backend already deployed on Render (get URL from RENDER_DEPLOYMENT.md)

---

## Step 1: Vercel Account Setup

### 1.1 Create Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Vercel to access your repositories

---

## Step 2: Import Project to Vercel

### 2.1 Import Repository
1. In Vercel dashboard, click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Search for your SkillHub repository
4. Click "Import"

### 2.2 Configure Project

After clicking Import, fill the form:

**Project Settings:**
- **Project Name**: `skillhub-frontend`
- **Framework Preset**: `Other`
- **Root Directory**: `frontend`

**Build Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## Step 3: Set Environment Variables

### 3.1 Add API URL
Before clicking "Deploy", add environment variable:

1. Click "Environment Variables"
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: Your Render backend URL
   
   **Example**:
   ```
   https://skillhub-backend.onrender.com
   ```

3. Make sure it's set for "Production"

### 3.2 Deployment Configuration
Vercel should auto-detect Vite. If not:
1. Scroll down to "Build and Output Settings"
2. Set:
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## Step 4: Deploy

Click "Deploy" and wait for deployment to complete (2-3 minutes)

You'll see:
```
✅ Build completed
✅ Domain: skillhub-frontend.vercel.app
```

---

## Step 5: Get Your Frontend URL

1. Copy the domain shown after deployment
2. Your frontend is live at: `https://skillhub-frontend.vercel.app`

---

## Step 6: Test the Application

### 6.1 Verify API Connection
1. Open frontend URL
2. Try to:
   - Sign up with test account
   - Log in
   - View courses
   - Submit contact form

### 6.2 Debug Connection Issues
If frontend can't reach backend:
1. Check browser DevTools → Network tab
2. Look for failed API calls
3. Verify `VITE_API_URL` is correct in Vercel settings
4. Ensure Render backend is awake (visit it first)

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter your custom domain
4. Follow DNS configuration steps

---

## Step 8: Enable Auto-Deployment

✅ **Already Enabled**
- Any push to `main` branch auto-redeploys
- Takes ~2-3 minutes
- Status shown in Vercel dashboard

---

## Common Issues & Solutions

### Issue: Blank Page or 404
**Solution:**
- Check build logs in Vercel
- Ensure `dist` folder is being built
- Verify vite.config.js is correct
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: Can't Connect to API
**Solution:**
- Check `VITE_API_URL` in Vercel environment variables
- Make sure backend is running on Render
- Ensure backend CORS is properly configured
- Try API directly: `curl https://skillhub-backend.onrender.com`

### Issue: "Cannot find module"
**Solution:**
- Check package.json dependencies are correct
- Run locally: `npm install && npm run build`
- Check build logs for exact error

### Issue: Styling not loading
**Solution:**
- Check CSS file paths in index.html
- Ensure style.css is in frontend root
- Check browser console for 404 errors

### Issue: "VITE_API_URL is undefined"
**Solution:**
- Set environment variable in Vercel dashboard
- Trigger redeploy after setting variables
- In script.js, it reads: `import.meta.env.VITE_API_URL`

---

## Useful Vercel Commands

### View Logs
```
Dashboard → Your Project → Deployments → Logs
```

### Redeploy
```
Dashboard → Your Project → Deployments → Redeploy
```

### Rollback to Previous Version
```
Dashboard → Your Project → Deployments → Select Previous → Promote
```

### View Analytics
```
Dashboard → Your Project → Analytics
```

---

## Environment Variables Reference

**Production (.env file):**
```env
VITE_API_URL=https://skillhub-backend.onrender.com
```

**Local Development (.env file):**
```env
VITE_API_URL=http://localhost:5000
```

---

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN (64+ edge locations)
- ✅ Automatic HTTPS
- ✅ Gzip compression
- ✅ Image optimization
- ✅ Serverless functions

---

## Monitoring

### 6.1 Check Application Health
1. Visit your frontend: `https://skillhub-frontend.vercel.app`
2. Sign up for test account
3. Enroll in a course
4. Download a certificate

### 6.2 View Analytics
1. Vercel Dashboard → Your Project → Analytics
2. Monitor:
   - Page Views
   - Edge Network Requests
   - Build Times

---

## Free Tier Limits

- **Bandwidth**: 100GB/month
- **Serverless Functions**: 10,000 API calls/month
- **Build Time**: 100 hours/month

**For production:** Consider Vercel Pro ($20/month)

---

## Final Checklist

- ✅ Backend running on Render
- ✅ Frontend deployed on Vercel
- ✅ Environment variables set correctly
- ✅ CORS configured on backend
- ✅ API URL correct on frontend
- ✅ User can sign up
- ✅ User can log in
- ✅ Courses display correctly
- ✅ Contact form works
- ✅ Certificate generation works

---

## Links & Resources

- Frontend URL: `https://skillhub-frontend.vercel.app`
- Backend URL: `https://skillhub-backend.onrender.com`
- Vercel Dashboard: `https://vercel.com/dashboard`
- Render Dashboard: `https://dashboard.render.com`
- GitHub Repository: Your repository URL

---

**Frontend Deployment Complete! ✅**

Your SkillHub platform is now live and accessible to users worldwide!
