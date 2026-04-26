const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  videoUrl: {
    type: String,
    default: '' // URL or embed link
  },
  content: {
    type: String,
    default: '' // Reading content for the lesson
  },
  duration: {
    type: Number, // duration in seconds — max 300 (5 min)
    required: true,
    max: [300, 'Video must be ≤ 5 minutes (300 seconds)']
  },
  order: {
    type: Number,
    default: 0
  }
}, { _id: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required']
  },
  lessonCount: {
    type: Number,
    default: 0
  },
  instructor: {
    type: String,
    default: 'SkillHub Team'
  },
  category: {
    type: String,
    enum: ['data-analytics', 'programming', 'design', 'business', 'other'],
    default: 'other'
  },
  icon: {
    type: String,
    default: 'fa-laptop-code'
  },
  lessons: [lessonSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual: count lessons from array
courseSchema.virtual('lessons_count').get(function () {
  return this.lessons ? this.lessons.length : 0;
});

module.exports = mongoose.model('Course', courseSchema);
