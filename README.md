
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
