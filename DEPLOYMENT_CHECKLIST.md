# ✅ SkillHub - Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deploying to production.

## 📋 Backend Preparation

### Code Quality
- [x] All controllers are complete
- [x] All models have proper validation
- [x] All routes are properly mapped
- [x] Middleware authentication works
- [x] Error handling implemented
- [x] Console logs are present for debugging

### Configuration Files
- [x] `.env.example` created with all required variables
- [x] `render.yaml` configured correctly
- [x] `package.json` has all dependencies
- [ ] `.env` file created locally (not committed to git)
- [ ] MONGODB_URI is set with valid credentials
- [ ] JWT_SECRET is a strong random string
- [ ] All environment variables verified

### Testing Locally
- [ ] Start MongoDB connection
- [ ] Run `npm install` without errors
- [ ] Run `npm run seed` to populate database
- [ ] Run `npm run dev` and verify server starts
- [ ] Test API endpoints with Postman/Insomnia
  - [ ] POST /api/auth/signup
  - [ ] POST /api/auth/login
  - [ ] GET /api/courses
  - [ ] POST /api/contact
- [ ] Verify JWT tokens are being generated
- [ ] Check error handling with invalid inputs

### Database
- [x] MongoDB Atlas account created
- [x] Cluster deployed
- [ ] Database user created with credentials
- [ ] IP whitelist configured (allow 0.0.0.0/0 for Render)
- [ ] Connection string tested locally
- [ ] Seed data verified in Atlas

---

## 📱 Frontend Preparation

### Code Quality
- [x] `index.html` properly structured
- [x] `script.js` has all functions implemented
- [x] `style.css` is complete
- [x] API calls use correct endpoints
- [x] Error handling for failed API calls
- [ ] Console.log() statements kept minimal
- [x] No hardcoded URLs (uses environment variables)

### Configuration Files
- [x] `.env.example` created with API URL template
- [x] `package.json` properly configured
- [x] `vite.config.js` exists
- [x] `vercel.json` configured
- [ ] `.env` file created locally
- [ ] `VITE_API_URL` points to backend

### Testing Locally
- [ ] Run `npm install` without errors
- [ ] Run `npm run build` creates dist folder
- [ ] Run `npm run dev` starts dev server on :5173
- [ ] Application loads without errors
- [ ] API calls work locally with http://localhost:5000
- [ ] Forms validate correctly
- [ ] Responsive design verified on mobile
- [ ] All pages accessible
- [ ] Sign up and login functions work

### Build Optimization
- [x] Vite is configured for production
- [x] CSS is minified
- [x] JavaScript is bundled
- [ ] No console errors on production build

---

## 🌐 Deployment Preparation

### GitHub Repository
- [ ] All files committed to git
- [ ] `.env` files are in `.gitignore` (NOT committed)
- [ ] Large files are not committed
- [ ] `.gitignore` properly configured
- [ ] Repository is public (for easy Render/Vercel access)
- [ ] Main branch is stable (no breaking changes)

### Render Preparation
- [ ] Render account created
- [ ] GitHub connected to Render
- [ ] MongoDB Atlas URI ready to paste
- [ ] JWT_SECRET generated and ready
- [ ] Understood free tier limitations
- [ ] Reviewed `RENDER_DEPLOYMENT.md`

### Vercel Preparation
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Backend URL known (for VITE_API_URL)
- [ ] Environment variables prepared
- [ ] Reviewed `VERCEL_DEPLOYMENT.md`

---

## 🚀 Backend Deployment to Render

### Pre-Deployment
- [ ] Final commit: `git push origin main`
- [ ] Verify code is pushed to GitHub
- [ ] All environment variables are ready

### During Deployment
- [ ] Create Render account at render.com
- [ ] Import GitHub repository
- [ ] Set root directory to `backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `node server.js`
- [ ] Add all environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI=mongodb+srv://...`
  - [ ] `JWT_SECRET=...`
  - [ ] `JWT_EXPIRE=7d`

### Post-Deployment
- [ ] Render shows green "Live" status
- [ ] Backend URL is accessible
- [ ] Test health endpoint: `GET /` should return JSON
- [ ] Copy backend URL for frontend deployment
- [ ] Monitor logs for any errors
- [ ] Verify MongoDB connection in logs

---

## 📱 Frontend Deployment to Vercel

### Pre-Deployment
- [ ] Update `VITE_API_URL` in `.env.example`
- [ ] Final commit: `git push origin main`
- [ ] Backend URL is ready (from Render)

### During Deployment
- [ ] Create Vercel account at vercel.com
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL=https://skillhub-backend.onrender.com`
- [ ] Deploy!

### Post-Deployment
- [ ] Vercel shows success message
- [ ] Frontend URL is accessible
- [ ] Sign up page loads
- [ ] Try to sign up with test account
- [ ] Check browser console for errors
- [ ] Verify API calls reach backend (Network tab)

---

## ✨ Post-Deployment Testing

### Functionality Tests
- [ ] **Sign Up**: Create test account
- [ ] **Login**: Log in with test account
- [ ] **View Courses**: List shows all courses
- [ ] **Course Details**: Can view full course info
- [ ] **Enrollment**: Can enroll in a course
- [ ] **Payment**: Payment confirmation works
- [ ] **Progress**: Lesson completion updates progress
- [ ] **Certificate**: Can download certificate PDF
- [ ] **Contact Form**: Can submit message
- [ ] **Logout**: Logout clears session

### Performance Tests
- [ ] Page load time < 3 seconds
- [ ] API responses < 1 second
- [ ] Images are optimized
- [ ] No 404 errors for assets
- [ ] Mobile responsive (test on devices)

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Security Tests
- [ ] JWT token is stored in localStorage
- [ ] Protected routes require login
- [ ] Admin routes require admin role
- [ ] Passwords are hashed in database
- [ ] CORS works properly
- [ ] No sensitive data in console

---

## 🔍 Monitoring Setup

### Render Monitoring
- [ ] Set up email alerts for:
  - [ ] Service down
  - [ ] Build failures
  - [ ] Memory usage > 90%
- [ ] Check logs daily first week
- [ ] Monitor uptime percentage

### Vercel Monitoring
- [ ] Review analytics dashboard
- [ ] Check for 500 errors
- [ ] Monitor build times
- [ ] Check function calls usage

### MongoDB Monitoring
- [ ] Set up performance alerts
- [ ] Monitor disk usage
- [ ] Review slow query logs
- [ ] Set up backup schedule

---

## 📊 Documentation

- [x] README.md - Main documentation
- [x] RENDER_DEPLOYMENT.md - Backend deployment guide
- [x] VERCEL_DEPLOYMENT.md - Frontend deployment guide
- [x] ARCHITECTURE.md - System architecture
- [ ] Update URLs in documentation after deployment
- [ ] Create user guide (optional)
- [ ] Create API documentation (optional)

---

## 🎯 Final Verification

### URLs Should Be:
- Frontend: `https://skillhub-frontend.vercel.app` (or custom domain)
- Backend: `https://skillhub-backend.onrender.com`
- Database: MongoDB Atlas (secure connection)

### Everyone Can:
- [ ] Access frontend without errors
- [ ] Sign up for account
- [ ] Log in to account
- [ ] Browse courses
- [ ] Enroll in courses
- [ ] Track progress
- [ ] Download certificate

### Only Admins Can:
- [ ] Create courses
- [ ] Update courses
- [ ] Delete courses
- [ ] View contact messages

---

## 🎉 Deployment Complete!

Once all checks are complete:

1. ✅ **Share the live links**:
   - Frontend: `https://skillhub-frontend.vercel.app`
   - Backend API: `https://skillhub-backend.onrender.com`

2. 📧 **Send emails to stakeholders**:
   - Include live links
   - Include test credentials
   - Include contact support info

3. 📱 **Test on real devices**:
   - Desktop browsers
   - Mobile phones
   - Different networks

4. 🔒 **Enable monitoring**:
   - Set up alerts
   - Monitor first 24 hours closely
   - Be ready to debug issues

---

## ⚠️ Troubleshooting Guide

If something breaks:

1. Check Render logs → Look for error messages
2. Check Vercel logs → Look for build errors
3. Check browser console → Look for client errors
4. Check MongoDB Atlas → Verify connection
5. Test API directly with curl/Postman
6. Check environment variables → Correct spelling
7. Verify IP whitelist in MongoDB → Allow Render IPs

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **Node.js Docs**: https://nodejs.org/docs
- **Express Docs**: https://expressjs.com

---

**Good Luck! Your SkillHub platform is ready for the world! 🚀**
