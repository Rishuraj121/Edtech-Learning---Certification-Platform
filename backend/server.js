/**
 * Deployment Instructions:
 * Platform: Render
 * Root Directory: backend
 * Build: npm install
 * Start: npm start
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Backend acts as API only

// ── API Routes ─────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api', require('./routes/enrollments'));

// API Health Check
app.get('/', (req, res) => {
  res.json({ message: 'SkillHub API is running' });
});

// ── Database Connection ────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillhub';

console.log('⏳ Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Current MONGODB_URI starts with:', MONGODB_URI.substring(0, 15) + '...');
    console.log('Server is running but database-dependent features will fail.');
  });

// ── Start Server ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n✅ SkillHub backend running on port ${PORT}`);
  console.log(`🚀 API available at: http://localhost:${PORT}/api\n`);
});
