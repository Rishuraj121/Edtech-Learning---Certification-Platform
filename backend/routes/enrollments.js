const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  confirmPayment,
  getMyCourses,
  updateProgress
} = require('../controllers/enrollmentController');
const { getCertificate } = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

// Existing routes (preserved)
router.post('/enroll', createEnrollment);
router.post('/payment', confirmPayment);

// New protected routes
router.get('/my-courses', protect, getMyCourses);
router.post('/progress', protect, updateProgress);
router.get('/certificate/:courseId', protect, getCertificate);

module.exports = router;
