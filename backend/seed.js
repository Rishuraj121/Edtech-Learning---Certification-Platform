const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Course = require('./models/Course');
const User = require('./models/User');

// Helper: create N demo lessons for a course (each ~4 min = 240s)
function makeLessons(titles, videoId = 'dQw4w9WgXcQ') {
  return titles.map((title, i) => ({
    title,
    videoUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
    content: `
      <h3>${title}</h3>
      <p>Welcome to this module on <strong>${title}</strong>. In this section, we will explore the core concepts and practical applications of this topic. This is designed for absolute beginners who want to master the fundamentals quickly and effectively.</p>
      
      <h4>Key Learning Objectives:</h4>
      <ul>
        <li>Understand the basic syntax and structure.</li>
        <li>Learn how to apply these concepts in real-world scenarios.</li>
        <li>Identify common pitfalls and how to avoid them.</li>
        <li>Master the best practices used by industry experts.</li>
      </ul>

      <p>To get started, let's look at the foundational elements. Every professional in this field started exactly where you are now. The journey of a thousand miles begins with a single step, and today you are taking that step. We have structured this content to be bite-sized and easy to digest, ensuring you don't feel overwhelmed.</p>

      <p>As you progress through this reading, try to visualize how these concepts connect to what you already know. Practical application is key to retention. After finishing this module, we recommend trying out the exercises provided in the supplementary materials. Remember, consistency is more important than intensity when it comes to learning new skills.</p>

      <p>This module covers approximately 200 words of curated information to give you a solid grounding. Take your time to read through each paragraph carefully. Once you reach the bottom of this panel, your progress will be automatically updated. Happy learning!</p>
      
      <p>Furthermore, we will delve into more advanced topics in the subsequent modules. Stay focused and keep up the great momentum! You are doing great so far. Education is the most powerful weapon which you can use to change the world. By mastering ${title}, you are opening doors to numerous career opportunities in the digital age.</p>
    `,
    duration: 240, // 4 minutes
    order: i + 1
  }));
}

const courses = [
  {
    title: 'Excel Mastery Program',
    description: 'Become proficient in Microsoft Excel from basics to advanced. Learn formulas, pivot tables, macros, VBA, and data visualization techniques used by industry professionals. This comprehensive program covers everything from cell formatting to complex business dashboards.',
    price: 2399,
    duration: '13 Hours',
    lessonCount: 6,
    instructor: 'SkillHub Expert',
    category: 'data-analytics',
    icon: 'fa-file-excel',
    lessons: makeLessons([
      'Introduction to Excel Interface',
      'Formulas & Functions Fundamentals',
      'Working with Data & Tables',
      'Pivot Tables & Data Analysis',
      'Charts & Data Visualization',
      'Macros & VBA Basics'
    ], 'Vl0H-qTclOg')
  },
  {
    title: 'Power BI Complete Guide',
    description: 'Master data visualization and business intelligence with Power BI. Create interactive dashboards, connect to multiple data sources, and transform raw data into actionable insights that drive business decisions. Learn DAX formulas and advanced reporting techniques.',
    price: 2399,
    duration: '13 Hours',
    lessonCount: 6,
    instructor: 'SkillHub Expert',
    category: 'data-analytics',
    icon: 'fa-chart-bar',
    lessons: makeLessons([
      'Power BI Desktop Overview',
      'Connecting Data Sources',
      'Data Transformation with Power Query',
      'Building Your First Dashboard',
      'DAX Fundamentals',
      'Publishing & Sharing Reports'
    ], 'AGrl-H87pRU')
  },
  {
    title: 'SQL for Data Professionals',
    description: 'Learn SQL from scratch to advanced level. Write complex queries, manage databases, optimize performance, and handle real-world data manipulation scenarios. Master JOINs, subqueries, window functions, and stored procedures used by top data professionals.',
    price: 2399,
    duration: '8 Hours',
    lessonCount: 6,
    instructor: 'SkillHub Expert',
    category: 'programming',
    icon: 'fa-database',
    lessons: makeLessons([
      'Database Concepts & SQL Basics',
      'SELECT Statements & Filtering',
      'Joins & Relationships',
      'Aggregations & Group By',
      'Subqueries & CTEs',
      'Performance & Indexing'
    ], 'HXV3zePRqGY')
  },
  {
    title: 'Python Programming Bootcamp',
    description: 'Complete Python programming course covering fundamentals, data structures, OOP, file handling, web scraping, and data analysis with pandas and numpy libraries. Go from zero to writing production-ready Python code.',
    price: 2399,
    duration: '14 Hours',
    lessonCount: 6,
    instructor: 'SkillHub Expert',
    category: 'programming',
    icon: 'fa-python',
    lessons: makeLessons([
      'Python Setup & Syntax Basics',
      'Data Types & Control Flow',
      'Functions & Modules',
      'Object-Oriented Programming',
      'File Handling & Libraries',
      'Data Analysis with Pandas'
    ], 'rfscVS0vtbw')
  },
  {
    title: 'AI for Data Analysis',
    description: 'Harness the power of artificial intelligence for data analysis. Learn to use AI tools, automate repetitive tasks, and unlock deeper insights from your datasets using machine learning concepts and modern AI-powered tools.',
    price: 1999,
    duration: '7 Hours',
    lessonCount: 5,
    instructor: 'SkillHub Expert',
    category: 'data-analytics',
    icon: 'fa-robot',
    lessons: makeLessons([
      'Introduction to AI in Data Analysis',
      'Machine Learning Concepts',
      'Using AI Tools for Insights',
      'Automating Analysis Workflows',
      'Building AI-Powered Dashboards'
    ], 'ad79nYk2keg')
  },
  {
    title: 'Power Query Masterclass',
    description: 'Transform and clean data effortlessly with Power Query. Automate data preparation workflows, merge datasets, and create reusable data pipelines for Excel and Power BI. Master M language and advanced transformation techniques.',
    price: 1999,
    duration: '8.4 Hours',
    lessonCount: 5,
    instructor: 'SkillHub Expert',
    category: 'data-analytics',
    icon: 'fa-filter',
    lessons: makeLessons([
      'Power Query Interface & Basics',
      'Data Cleaning Techniques',
      'Merging & Appending Queries',
      'M Language Fundamentals',
      'Building Automated Pipelines'
    ], 'Lp_pD41p-m8')
  }
];

const seedDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillhub';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`📚 Seeded ${createdCourses.length} courses with lessons`);

    // Create or update admin user
    let admin = await User.findOne({ email: 'ujjwal@gmail.com' });
    if (!admin) {
      await User.create({
        name: 'Ujjwal',
        email: 'ujjwal@gmail.com',
        password: '12456',
        role: 'admin'
      });
      console.log('👤 Admin user created (ujjwal@gmail.com / 12456)');
    } else {
      admin.password = '12456';
      admin.name = 'Ujjwal';
      await admin.save();
      console.log('👤 Admin user password updated (ujjwal@gmail.com / 12456)');
    }

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
