# 🏗️ SkillHub Architecture & Project Structure

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SKILLHUB PLATFORM                          │
└─────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │    Frontend      │
                              │   (Vercel CDN)   │
                              │  Vanilla JS+CSS  │
                              │   Vite Build     │
                              └────────┬─────────┘
                                       │
                         ┌─────────────┼─────────────┐
                         │             │             │
                         v             v             v
                    ┌────────────────────────────────────────┐
                    │  CORS/HTTPS Layer (Global CDN)         │
                    └────────────────────────────────────────┘
                                    │
                                    v
                    ┌────────────────────────────────────────┐
                    │   Backend API (Render)                 │
                    │   Express.js Server                    │
                    │   Node.js + REST API                   │
                    └────────────────┬───────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                v                   v                   v
        ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
        │  Auth Layer  │    │   Business   │    │   Storage    │
        │   (JWT)      │    │   Logic      │    │   Services   │
        │              │    │              │    │              │
        └──────────────┘    └──────────────┘    └──────────────┘
                │                   │                   │
                └───────────────────┼───────────────────┘
                                    v
                    ┌────────────────────────────────────────┐
                    │   MongoDB Atlas                        │
                    │   (NoSQL Database - Cloud)             │
                    │   - Users, Courses, Enrollments        │
                    │   - Progress Tracking, Contacts        │
                    └────────────────────────────────────────┘
```

## Project Structure

```
skillhub/
├── backend/                          # Node.js + Express Backend
│   ├── controllers/                  # Business Logic
│   │   ├── authController.js        # User Auth (JWT)
│   │   ├── courseController.js      # Course Management
│   │   ├── enrollmentController.js  # Enrollment & Progress
│   │   ├── certificateController.js # PDF Certificate Gen
│   │   └── contactController.js     # Contact Form
│   │
│   ├── models/                       # MongoDB Schemas
│   │   ├── User.js                  # User Model
│   │   ├── Course.js                # Course with Lessons
│   │   ├── Enrollment.js            # Enrollment Tracking
│   │   └── Contact.js               # Contact Messages
│   │
│   ├── routes/                       # API Routes
│   │   ├── auth.js                  # /api/auth
│   │   ├── courses.js               # /api/courses
│   │   ├── enrollments.js           # /api/enroll, /api/progress
│   │   └── contact.js               # /api/contact
│   │
│   ├── middleware/                   # Custom Middleware
│   │   └── auth.js                  # JWT Protection
│   │
│   ├── server.js                    # Main Server File
│   ├── seed.js                      # Database Seeding
│   ├── package.json                 # Dependencies
│   ├── .env.example                 # Environment Template
│   ├── render.yaml                  # Render Config
│   └── .gitignore
│
├── frontend/                         # Vanilla JS + Vite
│   ├── index.html                   # Main HTML
│   ├── script.js                    # Application Logic
│   ├── style.css                    # Styling
│   ├── package.json                 # Dependencies
│   ├── vite.config.js               # Vite Config
│   ├── vercel.json                  # Vercel Config
│   ├── .env.example                 # Environment Template
│   └── .gitignore
│
├── README.md                        # Main Documentation
├── RENDER_DEPLOYMENT.md             # Backend Deploy Guide
├── VERCEL_DEPLOYMENT.md             # Frontend Deploy Guide
└── .gitignore
```

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  phone: String,
  role: Enum['user', 'admin'],
  enrolledCourses: [ObjectId], // References to Courses
  createdAt: Date
}
```

### Course Schema
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  duration: String,
  category: Enum['data-analytics', 'programming', 'design', 'business'],
  instructor: String,
  icon: String,
  lessons: [{
    title: String,
    videoUrl: String,
    content: String,
    duration: Number, // 1-300 seconds
    order: Number
  }],
  createdAt: Date
}
```

### Enrollment Schema
```javascript
{
  _id: ObjectId,
  name: String,
  phone: String,
  courseId: ObjectId,
  userId: ObjectId,
  paymentStatus: Enum['pending', 'paid'],
  completedLessons: [ObjectId],
  lastAccessedLesson: ObjectId,
  isCompleted: Boolean,
  completedAt: Date,
  createdAt: Date
}
```

### Contact Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  message: String,
  createdAt: Date
}
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ JWT | Get current user |
| POST | `/api/auth/enroll/:courseId` | ✅ JWT | Enroll in course |

### Courses
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses` | ❌ | Get all courses |
| GET | `/api/courses/:id` | ❌ | Get course details |
| POST | `/api/courses` | ✅ Admin | Create course |
| PUT | `/api/courses/:id` | ✅ Admin | Update course |
| DELETE | `/api/courses/:id` | ✅ Admin | Delete course |

### Enrollments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/enroll` | ❌ | Create enrollment |
| POST | `/api/payment` | ❌ | Confirm payment |
| GET | `/api/my-courses` | ✅ JWT | Get enrolled courses |
| POST | `/api/progress` | ✅ JWT | Update progress |
| GET | `/api/certificate/:courseId` | ✅ JWT | Get certificate |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | ❌ | Submit contact form |
| GET | `/api/contact` | ✅ Admin | Get all contacts |

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **File Generation**: PDFKit for certificates
- **Environment**: dotenv

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: CSS3 with modern features
- **API Client**: Fetch API
- **Storage**: LocalStorage for tokens
- **Icons**: Font Awesome 6.5

### Deployment
- **Backend**: Render.com (PaaS)
- **Frontend**: Vercel (CDN + Edge Functions)
- **Database**: MongoDB Atlas (Cloud)
- **Version Control**: GitHub

## Authentication Flow

```
1. User Signs Up
   ├── Frontend: Sends email + password
   ├── Backend: Validates, hashes password, creates user
   └── Response: JWT token + user data

2. User Logs In
   ├── Frontend: Sends email + password
   ├── Backend: Finds user, compares password
   ├── Auth check: comparePassword() method
   └── Response: JWT token

3. Protected Requests
   ├── Frontend: Adds "Authorization: Bearer {token}"
   ├── Backend: auth.js middleware validates token
   ├── Token check: jwt.verify()
   └── User attached to req.user

4. Token Storage
   ├── Frontend: localStorage.getItem('skillhub_token')
   ├── Expiration: 7 days (configurable)
   └── Refresh: Must re-login after expiration
```

## Course Enrollment & Progress Flow

```
1. Browse Courses
   ├── User views all courses (no auth required)
   └── Displays: Title, price, duration, lessons

2. Enroll in Course
   ├── User clicks "Enroll" (auth required)
   ├── Creates Enrollment record
   └── Payment status: 'pending'

3. Confirm Payment
   ├── Frontend: Processes payment (simulated)
   ├── Backend: Updates enrollment.paymentStatus = 'paid'
   └── Access: User can now watch lessons

4. Track Progress
   ├── User marks lesson as complete
   ├── Backend: Adds lesson ID to completedLessons[]
   ├── Calculate: progress % = completedLessons / totalLessons
   └── Auto-completion: When all lessons done

5. Generate Certificate
   ├── User completes all lessons
   ├── Backend: Generates PDF certificate
   ├── Content: Student name, course title, date
   └── Download: Browser downloads PDF file
```

## Security Implementations

### Password Security
- ✅ Bcryptjs with salt rounds: 12
- ✅ Never stored in plain text
- ✅ Compared during login: comparePassword()

### JWT Tokens
- ✅ Signed with JWT_SECRET
- ✅ Expiration: 7 days
- ✅ Verified on protected routes
- ✅ Stored in browser localStorage

### Input Validation
- ✅ Email format validation (regex)
- ✅ Password minimum length: 5 chars
- ✅ Name max length: 50 chars
- ✅ Message max length: 1000 chars

### API Security
- ✅ CORS enabled (frontend origin)
- ✅ Protected routes with JWT middleware
- ✅ Admin-only routes with role check
- ✅ Error messages don't leak sensitive data

### Database Security
- ✅ MongoDB Atlas IP whitelist
- ✅ Database user authentication
- ✅ Unique email constraint
- ✅ Indexed fields for performance

## Performance Optimizations

### Frontend
- ✅ Vite for fast bundling
- ✅ Lazy loading of course details
- ✅ LocalStorage for token persistence
- ✅ CSS minification & compression

### Backend
- ✅ MongoDB indexes on frequently queried fields
- ✅ Population of references (Mongoose .populate())
- ✅ Async/await for non-blocking operations
- ✅ Error handling to prevent crashes

### Deployment
- ✅ Vercel CDN for global distribution (frontend)
- ✅ Render auto-scaling (backend)
- ✅ GZIP compression on Vercel
- ✅ MongoDB connection pooling

## Development Workflow

### Local Development
```
1. Clone repository
2. Install dependencies: npm install (both folders)
3. Create .env files from templates
4. Run MongoDB locally OR connect to Atlas
5. Start backend: npm run dev
6. Start frontend: npm run dev
7. Code changes auto-reload via Vite
```

### Testing
```
Frontend Testing:
- Open http://localhost:5173
- Test signup/login flow
- Enroll in courses
- Check console for errors

Backend Testing:
- Use Postman/Insomnia for API calls
- Check server logs in terminal
- Monitor MongoDB Atlas for data
```

### Deployment
```
1. Make changes locally
2. Commit to GitHub: git push origin main
3. Render auto-deploys backend
4. Vercel auto-deploys frontend
5. Monitor dashboards for errors
```

## File Size Analysis

```
Backend:
- node_modules/: ~200MB (not deployed)
- Source code: ~50KB
- Package size: ~1MB (zipped)

Frontend:
- node_modules/: ~150MB (not deployed)
- Source code: ~100KB
- Build (dist/): ~50KB (minified)
- Deployed size: ~50KB (via Vercel CDN)
```

## Scalability Considerations

### Current Capacity
- Free tier: ~1000 users
- ~500MB MongoDB storage
- Limited backend compute

### To Scale:
1. **Backend**: Upgrade Render plan ($7-50/month)
2. **Database**: Upgrade MongoDB tier (2GB+)
3. **Frontend**: Vercel Pro ($20/month)
4. **Load Balancing**: Add multiple backend instances
5. **Caching**: Implement Redis cache layer

## Monitoring & Analytics

### Render
- Dashboard → Logs (real-time)
- Service Health → Uptime
- Metrics → CPU, Memory

### Vercel
- Dashboard → Analytics
- Page Views, Edge Requests
- Build Times

### MongoDB
- Admin → Performance Advisor
- Alerts for disk usage
- Query performance analysis

---

**Last Updated**: April 2026
**Status**: Ready for Production ✅
