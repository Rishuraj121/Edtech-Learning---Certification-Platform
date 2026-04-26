# 📚 SkillHub - Modern E-Learning Platform

An end-to-end e-learning solution for mastering in-demand tech skills like Excel, Power BI, SQL, Python, and more.

## 📋 Project Overview

SkillHub is a full-stack e-learning platform built with:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Vanilla JavaScript + Vite
- **Database**: MongoDB Atlas
- **Deployment**: Render (Backend) + Vercel (Frontend)

### Features
✅ User authentication with JWT
✅ Course management and catalog
✅ Enrollment and progress tracking
✅ Certificate generation (PDF)
✅ Contact form
✅ Responsive design
✅ Admin capabilities

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas account)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with:
   ```
   MONGODB_URI=mongodb://localhost:27017/skillhub
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Backend runs at: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend runs at: `http://localhost:5173`

---

## 📦 Production Deployment

### Backend Deployment to Render

#### Step 1: Prepare Your Repository
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

#### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub
3. Connect your GitHub repository

#### Step 3: Deploy Backend
1. Click "New" → "Web Service"
2. Select your SkillHub repository
3. Configure as follows:
   - **Name**: `skillhub-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Root Directory**: `backend`

#### Step 4: Set Environment Variables on Render
In Render dashboard, go to "Environment" and add:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong random secret (use generator)
- `NODE_ENV`: `production`
- `PORT`: `5000`

**Get MongoDB Atlas URI:**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster → Create database user → Get connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/skillhub`

#### Step 5: Deploy
Render will automatically deploy when you push to main branch. Check logs for errors.

---

### Frontend Deployment to Vercel

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your SkillHub repository

#### Step 2: Configure Vercel Project
1. Click "Import Project"
2. Select your repository
3. Configure as follows:
   - **Project Name**: `skillhub-frontend`
   - **Framework Preset**: `Other`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Step 3: Set Environment Variables
Add in Vercel dashboard:
- `VITE_API_URL`: Your Render backend URL (e.g., `https://skillhub-backend.onrender.com`)

#### Step 4: Deploy
Vercel will automatically build and deploy. Get your frontend URL.

---

## 🔗 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/enroll/:courseId` - Enroll in course (protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details

### Enrollment
- `POST /api/enroll` - Create enrollment
- `POST /api/payment` - Confirm payment
- `GET /api/my-courses` - Get user's courses (protected)
- `POST /api/progress` - Update lesson progress (protected)
- `GET /api/certificate/:courseId` - Download certificate (protected)

### Contact
- `POST /api/contact` - Submit contact form

---

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['user', 'admin'],
  enrolledCourses: [ObjectId],
  createdAt: Date
}
```

### Course
```javascript
{
  title: String,
  description: String,
  price: Number,
  duration: String,
  category: String,
  instructor: String,
  lessons: [
    {
      title: String,
      videoUrl: String,
      content: String,
      duration: Number
    }
  ]
}
```

### Enrollment
```javascript
{
  name: String,
  phone: String,
  courseId: ObjectId,
  userId: ObjectId,
  paymentStatus: Enum ['pending', 'paid'],
  completedLessons: [ObjectId],
  isCompleted: Boolean,
  createdAt: Date
}
```

---

## 🔐 Security Best Practices Implemented

✅ Password hashing with bcryptjs
✅ JWT token authentication
✅ Protected routes with middleware
✅ Input validation
✅ CORS enabled
✅ Error handling
✅ Environment variables for secrets

---

## 🛠️ Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure PORT is available
- Check environment variables are set

### Frontend can't connect to backend
- Verify `VITE_API_URL` matches backend URL
- Check browser console for CORS errors
- Ensure backend is running

### MongoDB connection fails
- Check username/password in URI
- Ensure IP is whitelisted in MongoDB Atlas
- Test connection string separately

---

## 📝 Development Workflow

### Making Changes
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request on GitHub

### Deployment
- Changes to `main` branch automatically deploy
- Backend deploys on Render
- Frontend deploys on Vercel

---

## 📧 Support & Contact

For issues or questions, use the contact form on the platform or create a GitHub issue.

---

## 📄 License

This project is licensed under the MIT License.

---

**Last Updated**: April 2026
**Status**: Production Ready ✅
