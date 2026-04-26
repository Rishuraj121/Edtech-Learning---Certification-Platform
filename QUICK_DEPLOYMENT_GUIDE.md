# 🚀 SkillHub Deployment Quick Reference

## One-Page Deployment Guide

### Prerequisites
```bash
# Install Node.js 18+
# Create GitHub account
# Create MongoDB Atlas account
# Create Render account
# Create Vercel account
```

---

## Phase 1: MongoDB Atlas Setup (10 min)

```
1. Go to: mongodb.com/cloud/atlas
2. Sign Up → Create Project
3. Create Cluster (Free M0)
4. Wait ~5 minutes for cluster creation
5. Create Database User:
   - Username: skillhub_user
   - Password: [Generate & Save]
6. Get Connection String:
   - Click Connect → Drivers → Node.js
   - Copy: mongodb+srv://skillhub_user:PASSWORD@cluster.mongodb.net/skillhub
7. Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
```

**Save Your MongoDB URI!**
```
mongodb+srv://skillhub_user:YOUR_PASSWORD@cluster.mongodb.net/skillhub?retryWrites=true&w=majority
```

---

## Phase 2: Generate JWT Secret (1 min)

```bash
# Run this command (on any terminal with Node.js):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output example:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Save Your JWT Secret!**

---

## Phase 3: Prepare GitHub (5 min)

```bash
# In your project root (contains backend/ and frontend/):
cd /path/to/Project

# Commit all changes
git add .
git commit -m "Prepare SkillHub for production deployment"
git push origin main

# Verify it's pushed: Check github.com/username/Project
```

---

## Phase 4: Deploy Backend to Render (10 min)

### Step-by-step:

1. **Go to**: https://render.com

2. **Sign Up**: Click "Sign up with GitHub" → Authorize

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Select your Project repository
   - Click "Connect"

4. **Configure Service**:
   | Field | Value |
   |-------|-------|
   | Name | `skillhub-backend` |
   | Environment | `Node` |
   | Region | Your region |
   | Branch | `main` |
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |

5. **Add Environment Variables** (Click "Add Environment Variable"):
   ```
   NODE_ENV         = production
   PORT             = 5000
   MONGODB_URI      = [Your MongoDB connection string]
   JWT_SECRET       = [Your generated secret]
   JWT_EXPIRE       = 7d
   ```

6. **Deploy**: Click "Create Web Service"

7. **Wait**: Watch logs for "Live" status (2-3 min)

8. **Save Backend URL**: Copy URL shown in dashboard
   ```
   https://skillhub-backend.onrender.com
   ```

---

## Phase 5: Deploy Frontend to Vercel (5 min)

### Step-by-step:

1. **Go to**: https://vercel.com

2. **Sign Up**: Click "Sign Up" → Select "GitHub"

3. **Import Project**:
   - Click "Add New" → "Project"
   - Search and select your Project
   - Click "Import"

4. **Configure Project**:
   | Field | Value |
   |-------|-------|
   | Project Name | `skillhub-frontend` |
   | Framework | `Other` |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = [Your Render backend URL]
     Example: https://skillhub-backend.onrender.com
     ```

6. **Deploy**: Click "Deploy"

7. **Wait**: Watch for "Production Deployment" success (2-3 min)

8. **Get Frontend URL**: Copy URL shown
   ```
   https://skillhub-frontend.vercel.app
   ```

---

## Phase 6: Verify Deployment (10 min)

### Test Backend
```bash
# In terminal, test backend health:
curl https://skillhub-backend.onrender.com

# Should return:
# {"message":"SkillHub API is running"}
```

### Test Frontend
1. Visit: https://skillhub-frontend.vercel.app
2. Sign up with test email
3. Log in
4. Browse courses
5. Enroll in a course
6. Check browser console (F12) for errors

---

## 🎯 Common Issues & Fixes

### "MongoDB connection error"
```
FIX: 
1. Check MongoDB URI is correct
2. Verify IP is whitelisted (0.0.0.0/0)
3. Check username/password in URI
4. Test connection locally first
```

### "Frontend can't reach backend"
```
FIX:
1. Verify VITE_API_URL in Vercel settings
2. Ensure backend is "Live" in Render
3. Wait 60 seconds for cold start
4. Check browser Network tab for CORS errors
5. Test backend directly with curl
```

### "Build failed on Render"
```
FIX:
1. Check Root Directory is set to "backend"
2. Verify package.json has all dependencies
3. Check for syntax errors in code
4. Look at build logs for specific error
```

### "Module not found"
```
FIX:
1. Check package.json has all dependencies
2. Run locally: cd backend && npm install
3. Verify no typos in imports
4. Check file paths are correct
```

---

## 📊 Deployment Status Tracking

### Backend (Render)
- [ ] Account created
- [ ] Repository connected
- [ ] Service created
- [ ] Environment variables added
- [ ] Build successful
- [ ] Service "Live"
- [ ] Health check passing

### Frontend (Vercel)
- [ ] Account created
- [ ] Project imported
- [ ] Build command correct
- [ ] Environment variables added
- [ ] Build successful
- [ ] Production deployed
- [ ] App loads without errors

### Database (MongoDB)
- [ ] Cluster created
- [ ] Database user created
- [ ] Connection string copied
- [ ] IP whitelisted
- [ ] Connection tested

---

## 🔐 Security Checklist

- [ ] `.env` files are NOT committed to GitHub
- [ ] `JWT_SECRET` is strong & random
- [ ] `MONGODB_URI` uses username/password
- [ ] IP whitelist set on MongoDB
- [ ] Environment variables set on platforms
- [ ] No console.log() of sensitive data
- [ ] CORS is configured
- [ ] Passwords are hashed

---

## 📱 Testing Checklist

After deployment, test these:

```
Sign Up
[ ] Create account with email
[ ] Password hashing works
[ ] Can't create duplicate email
[ ] Error messages clear

Login
[ ] Login with correct credentials
[ ] JWT token created
[ ] Token stored in localStorage
[ ] Error for wrong password

Courses
[ ] Can view all courses
[ ] Courses load from API
[ ] Enroll button works
[ ] Enrollment creates record

Payment
[ ] Payment confirmation works
[ ] Payment status changes to "paid"
[ ] Access to lessons granted

Progress
[ ] Can mark lessons complete
[ ] Progress % updates
[ ] Lesson completion saved

Certificate
[ ] All lessons marked complete triggers
[ ] Certificate PDF downloads
[ ] PDF shows correct info

Contact
[ ] Can submit message
[ ] Message appears in DB
[ ] Success notification shows

Mobile
[ ] Design responsive
[ ] Buttons clickable
[ ] Forms work
[ ] No layout breaking
```

---

## 🎯 Success Criteria

Your deployment is **successful** when:

✅ Frontend URL loads without errors
✅ Can sign up for new account
✅ Can log in with account
✅ Courses display correctly
✅ Can enroll in course
✅ Browser console has no red errors
✅ API calls complete successfully
✅ Certificate downloads as PDF
✅ Works on mobile devices

---

## 📞 Support Resources

| Problem | Solution |
|---------|----------|
| Render issues | render.com/status or support |
| Vercel issues | vercel.com/support |
| MongoDB issues | mongodb.com/support |
| Node.js issues | stackoverflow.com tag:node.js |
| Express issues | expressjs.com or github |

---

## ⏱️ Timeline Summary

| Task | Time |
|------|------|
| MongoDB setup | 10 min |
| Generate JWT | 1 min |
| GitHub commit | 5 min |
| Deploy Backend | 10 min |
| Deploy Frontend | 5 min |
| Verify & Test | 10 min |
| **TOTAL** | **~40 min** |

---

## 🎉 Final URLs

After successful deployment, you'll have:

```
Frontend:  https://skillhub-frontend.vercel.app
Backend:   https://skillhub-backend.onrender.com
Database:  MongoDB Atlas (secure)
```

**Share these with users!**

---

## 📝 Important Files

Keep these files safe:
1. MongoDB connection string
2. JWT secret key
3. Render backend URL
4. Vercel frontend URL
5. GitHub repository URL

---

**Good Luck! Your SkillHub is about to go live! 🚀**
