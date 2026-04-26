const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create new enrollment
// @route   POST /api/enroll
exports.createEnrollment = async (req, res) => {
  try {
    const { name, phone, courseId, userId } = req.body;

    if (!name || !phone || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const enrollment = await Enrollment.create({
      name,
      phone,
      courseId,
      userId,
      paymentStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating enrollment'
    });
  }
};

// @desc    Update payment status
// @route   POST /api/payment
exports.confirmPayment = async (req, res) => {
  try {
    const { enrollmentId } = req.body;

    if (!enrollmentId) {
      return res.status(400).json({
        success: false,
        message: 'Enrollment ID is required'
      });
    }

    const enrollment = await Enrollment.findByIdAndUpdate(
      enrollmentId,
      { paymentStatus: 'paid' },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // If userId is present, also update the User's enrolledCourses and phone
    if (enrollment.userId) {
      const user = await User.findById(enrollment.userId);
      if (user) {
        let changed = false;
        if (!user.enrolledCourses.some(id => id.toString() === enrollment.courseId.toString())) {
          user.enrolledCourses.push(enrollment.courseId);
          changed = true;
        }
        if (!user.phone && enrollment.phone) {
          user.phone = enrollment.phone;
          changed = true;
        }
        if (changed) await user.save();
      }
    }

    res.json({
      success: true,
      message: 'Payment confirmed',
      enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating payment'
    });
  }
};

// @desc    Get enrolled courses for logged-in user (paid only)
// @route   GET /api/my-courses
exports.getMyCourses = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const enrollments = await Enrollment.find({
      userId,
      paymentStatus: 'paid'
    }).populate('courseId');

    const courses = enrollments.map(e => {
      const course = e.courseId;
      if (!course) return null;
      const totalLessons = course.lessons ? course.lessons.length : 0;
      const completedCount = e.completedLessons ? e.completedLessons.length : 0;
      const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        enrollmentId: e._id,
        courseId: course._id,
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        duration: course.duration,
        category: course.category,
        icon: course.icon,
        price: course.price,
        totalLessons,
        completedLessons: e.completedLessons || [],
        lastAccessedLesson: e.lastAccessedLesson,
        progress,
        isCompleted: e.isCompleted,
        completedAt: e.completedAt
      };
    }).filter(Boolean);

    res.json({ success: true, courses });
  } catch (error) {
    console.error('getMyCourses error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching enrolled courses' });
  }
};

// @desc    Update lesson progress
// @route   POST /api/progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user.id || req.user._id;

    if (!courseId || !lessonId) {
      return res.status(400).json({ success: false, message: 'courseId and lessonId are required' });
    }

    const enrollment = await Enrollment.findOne({ userId, courseId, paymentStatus: 'paid' });
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Add lesson if not already completed
    const alreadyDone = enrollment.completedLessons.some(id => id.toString() === lessonId.toString());
    if (!alreadyDone) {
      enrollment.completedLessons.push(lessonId);
    }

    // Track last accessed
    enrollment.lastAccessedLesson = lessonId;

    // Check if all lessons are done
    const course = await Course.findById(courseId);
    if (course && course.lessons.length > 0) {
      const allDone = course.lessons.every(lesson =>
        enrollment.completedLessons.some(id => id.toString() === lesson._id.toString())
      );
      if (allDone && !enrollment.isCompleted) {
        enrollment.isCompleted = true;
        enrollment.completedAt = new Date();
      }
    }

    await enrollment.save();

    const totalLessons = course ? course.lessons.length : 0;
    const completedCount = enrollment.completedLessons.length;
    const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    res.json({
      success: true,
      progress,
      completedLessons: enrollment.completedLessons,
      isCompleted: enrollment.isCompleted
    });
  } catch (error) {
    console.error('updateProgress error:', error);
    res.status(500).json({ success: false, message: 'Server error updating progress' });
  }
};
