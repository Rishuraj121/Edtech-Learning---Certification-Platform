 const API = import.meta.env.VITE_API_URL || 'https://edtech-learning-certification-platform.onrender.com';

// State
let currentUser = null;
let authToken = localStorage.getItem('skillhub_token');
let allCourses = [];
let currentCourse = null;
let currentEnrollment = null;
let activeLesson = null;
let currentMyCourseData = null; // For learn page tracking
let youtubePlayer = null;
let progressCheckInterval = null;
let currentLessonId = null;

document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initForms();
  setupFilterButtons();

  await Promise.all([
    fetchCourses(),
    checkAuth()
  ]);

  // Initial routing
  const hash = window.location.hash.replace('#', '');
  if (hash && ['courses-page', 'about-page', 'dashboard-page'].includes(hash)) {
    navigateTo(hash);
  } else {
    navigateTo('home');
  }
});

// ── Navigation & Routing ─────────────────────────────────
function navigateTo(pageId, data = null) {
  const pages = ['homePage', 'coursesPage', 'aboutPage', 'dashboardPage', 'learnPage', 'courseDetailsPage', 'enrollPage', 'paymentPage', 'successPage'];
  
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // window.scrollTo(0, 0);

  if (pageId === 'home') {
    document.getElementById('homePage').style.display = 'block';
    renderHomeCourses();
    setTimeout(initScrollReveal, 100);
    window.history.pushState(null, '', '#');
  } 
  else if (pageId === 'courses-page') {
    document.getElementById('coursesPage').style.display = 'block';
    renderAllCourses('all');
    window.history.pushState(null, '', '#courses-page');
  }
  else if (pageId === 'about-page') {
    document.getElementById('aboutPage').style.display = 'block';
    window.history.pushState(null, '', '#about-page');
  }
  else if (pageId === 'dashboard-page') {
    if (!currentUser) return handleAuthRedirect('dashboard-page');
    document.getElementById('dashboardPage').style.display = 'block';
    loadDashboard();
    window.history.pushState(null, '', '#dashboard-page');
  }
  else if (pageId === 'certificate-page') {
    if (!currentUser) return handleAuthRedirect();
    document.getElementById('certificatePage').style.display = 'block';
    if (data) setupCertificatePage(data);
    window.history.pushState(null, '', '#certificate-page');
  }
  else if (pageId === 'learn') {
    if (!currentUser) return handleAuthRedirect();
    document.getElementById('learnPage').style.display = 'block';
    setupLearnPage(data);
  }
  else if (pageId === 'course-details') {
    document.getElementById('courseDetailsPage').style.display = 'block';
    if (data) loadCourseDetails(data);
  }
  else if (pageId === 'enroll') {
    if (!currentUser) return handleAuthRedirect('enroll');
    document.getElementById('enrollPage').style.display = 'block';
    setupEnrollPage();
  }
  else if (pageId === 'payment') {
    document.getElementById('paymentPage').style.display = 'block';
    setupPaymentPage();
  }
  else if (pageId === 'success') {
    document.getElementById('successPage').style.display = 'block';
  }

  // Close mobile menu if open
  const navLinks = document.getElementById('navLinks');
  if (navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
  }
}

function handleAuthRedirect(target) {
  showToast('Please login to access this page', 'info');
  openModal('loginModal');
  navigateTo('home');
}

// ── Auth & User ──────────────────────────────────────────
async function checkAuth() {
  if (!authToken) { updateUI(false); return; }
  try {
    const res = await fetch(`${API}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      updateUI(true);
    } else {
      throw new Error('Token invalid');
    }
  } catch (err) {
    logout(false);
  }
}

function updateUI(loggedIn) {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');

  if (loggedIn && currentUser) {
    if(loginBtn) loginBtn.style.display = 'none';
    if(signupBtn) signupBtn.style.display = 'none';
    if(userMenu) userMenu.style.display = 'flex';
    if(userName) userName.textContent = currentUser.name.split(' ')[0];
  } else {
    if(loginBtn) loginBtn.style.display = '';
    if(signupBtn) signupBtn.style.display = '';
    if(userMenu) userMenu.style.display = 'none';
  }
}

function logout(showMsg = true) {
  localStorage.removeItem('skillhub_token');
  authToken = null;
  currentUser = null;
  updateUI(false);
  if (showMsg) showToast('Logged out successfully', 'success');
  navigateTo('home');
}

// ── Courses Data ─────────────────────────────────────────
async function fetchCourses() {
  try {
    const res = await fetch(`${API}/api/courses`);
    const data = await res.json();
    if (data.success) {
      allCourses = data.courses;
    }
  } catch (err) {
    console.error('Failed to fetch courses:', err);
  }
}

function getGradient(cat) {
  const gradients = {
    'data-analytics': '#6c5ce7,#a29bfe',
    'programming': '#00cec9,#81ecec',
    'design': '#fd79a8,#e84393',
    'business': '#fdcb6e,#e17055'
  };
  return gradients[cat] || '#6c5ce7,#00cec9';
}

function renderCourseCard(course) {
  return `
    <div class="course-card reveal">
      <div class="course-thumb" style="background:linear-gradient(135deg,${getGradient(course.category)})">
        <i class="fas ${course.icon || 'fa-laptop-code'}"></i>
      </div>
      <div class="course-body">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
          <span><i class="fas fa-clock"></i> ${course.duration}</span>
          <span><i class="fas fa-book"></i> ${course.lessons ? course.lessons.length : course.lessonCount || 0} Lessons</span>
        </div>
        <div class="course-footer">
          <span class="course-price">₹${(course.price || 0).toLocaleString()}</span>
          <button class="btn btn-primary" onclick="navigateTo('course-details', '${course._id}')">Details</button>
        </div>
      </div>
    </div>
  `;
}

function renderHomeCourses() {
  const grid = document.getElementById('homeCoursesGrid');
  if (!grid) return;
  if (allCourses.length === 0) {
    grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No courses available right now.</p>';
    return;
  }
  // Show first 3
  grid.innerHTML = allCourses.slice(0, 3).map(renderCourseCard).join('');
}

function renderAllCourses(filter = 'all') {
  const grid = document.getElementById('allCoursesGrid');
  if (!grid) return;
  
  let filtered = allCourses;
  if (filter !== 'all') {
    filtered = allCourses.filter(c => c.category === filter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No courses found in this category.</p>';
    return;
  }
  
  grid.innerHTML = filtered.map(renderCourseCard).join('');
  setTimeout(initScrollReveal, 100);
}

function setupFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderAllCourses(e.target.dataset.cat);
    });
  });
}

// ── Course Details ───────────────────────────────────────
async function loadCourseDetails(courseId) {
  const content = document.getElementById('courseDetailsContent');
  content.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin fa-3x"></i><p>Loading details...</p></div>';

  try {
    const res = await fetch(`${API}/api/courses/${courseId}`);
    const data = await res.json();
    if (data.success) {
      currentCourse = data.course;
      const lessonCount = currentCourse.lessons ? currentCourse.lessons.length : 0;
      const objectives = currentCourse.lessons.map(l => l.title).slice(0, 4);
      const objectiveHtml = objectives.map(obj => `<li><i class="fas fa-check-circle"></i> ${obj}</li>`).join('');
      
      content.innerHTML = `
        <button class="btn btn-ghost" onclick="navigateTo('courses-page')" style="margin-bottom:2rem;"><i class="fas fa-arrow-left"></i> Back to Courses</button>
        <div class="details-header">
          <div class="details-thumb" style="background:linear-gradient(135deg,${getGradient(currentCourse.category)})">
            <i class="fas ${currentCourse.icon}"></i>
          </div>
          <div class="details-info">
            <div class="section-tag">${currentCourse.category.replace('-', ' ')}</div>
            <h1 style="font-size:2.5rem; margin-bottom:1rem;">${currentCourse.title}</h1>
            <div class="details-meta">
              <span><i class="fas fa-user-tie"></i> ${currentCourse.instructor}</span>
              <span><i class="fas fa-clock"></i> ${currentCourse.duration}</span>
              <span><i class="fas fa-book"></i> ${lessonCount} Lessons</span>
            </div>
            <p style="color:var(--text-muted); font-size:1.1rem; margin-bottom:2rem;">${currentCourse.description}</p>
            <div class="details-footer" style="margin-top:0; padding-top:0; border-top:none;">
              <span class="course-price" style="font-size:2.5rem;">₹${currentCourse.price.toLocaleString()}</span>
              <button class="btn btn-primary btn-lg" onclick="navigateTo('enroll')">Enroll Now <i class="fas fa-arrow-right"></i></button>
            </div>
          </div>
        </div>

        <div class="details-body" style="margin-top: 4rem;">
          <div class="details-extra-grid">
            <div class="objectives-card">
              <h3><i class="fas fa-graduation-cap"></i> What You'll Learn</h3>
              <ul class="objectives-list">
                ${objectiveHtml}
                <li><i class="fas fa-check-circle"></i> Industry-standard best practices</li>
                <li><i class="fas fa-check-circle"></i> Practical real-world project skills</li>
              </ul>
            </div>
            <div class="curriculum-card">
              <h3><i class="fas fa-list-ul"></i> Course Curriculum</h3>
              <div class="curriculum-preview">
                ${currentCourse.lessons.map((l, i) => `
                  <div class="curr-item">
                    <span class="curr-num">${i + 1}</span>
                    <span class="curr-title">${l.title}</span>
                    <span class="curr-meta"><i class="fas fa-book-open"></i></span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    content.innerHTML = '<p class="text-center error">Failed to load course details.</p>';
  }
}

// ── Enrollment Flow ──────────────────────────────────────
function setupEnrollPage() {
  if (!currentCourse) return navigateTo('courses-page');
  document.getElementById('enrollCourseTitle').textContent = currentCourse.title;
  document.getElementById('enrollCourseId').value = currentCourse._id;
  document.getElementById('enrollTotalAmount').textContent = `₹${currentCourse.price.toLocaleString()}`;
  document.getElementById('enrollInfoBox').innerHTML = `<i class="fas fa-info-circle"></i> Enrolling in <strong>${currentCourse.title}</strong>`;
  if (currentUser) {
    document.getElementById('enrollName').value = currentUser.name;
  }
}

async function handleEnrollmentSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

  try {
    const res = await fetch(`${API}/api/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: document.getElementById('enrollName').value,
        phone: document.getElementById('enrollPhone').value,
        courseId: document.getElementById('enrollCourseId').value,
        userId: currentUser.id || currentUser._id
      })
    });
    const data = await res.json();
    if (data.success) {
      currentEnrollment = data.enrollment;
      navigateTo('payment');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Enrollment failed', 'error');
  }
  btn.disabled = false; btn.innerHTML = 'Proceed to Payment <i class="fas fa-credit-card"></i>';
}

function setupPaymentPage() {
  if (!currentEnrollment || !currentCourse) return navigateTo('home');
  document.getElementById('payCourseName').textContent = currentCourse.title;
  document.getElementById('payAmount').textContent = `₹${currentCourse.price.toLocaleString()}`;
  document.getElementById('payEnrollId').textContent = currentEnrollment._id.toUpperCase();
  
  // Autofill UPI with phone
  const upiInput = document.getElementById('upiId');
  if (upiInput) {
    upiInput.value = currentEnrollment.phone || (currentUser ? currentUser.phone : '');
  }
}

function selectPaymentMethod(method) {
  document.querySelectorAll('.method-option').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.method-details').forEach(el => el.classList.remove('active'));
  
  if (method === 'upi') {
    document.querySelector('.method-option:nth-child(1)').classList.add('active');
    document.getElementById('upiField').classList.add('active');
  } else {
    document.querySelector('.method-option:nth-child(2)').classList.add('active');
    document.getElementById('cardField').classList.add('active');
  }
}

async function handlePaymentConfirm() {
  const btn = document.getElementById('confirmPaymentBtn');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirming...';

  try {
    const res = await fetch(`${API}/api/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enrollmentId: currentEnrollment._id })
    });
    const data = await res.json();
    if (data.success) {
      await checkAuth(); // refresh enrolled status
      navigateTo('success');
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Payment failed', 'error');
  }
  btn.disabled = false; btn.innerHTML = 'Confirm Payment <i class="fas fa-check-circle"></i>';
}

// ── Dashboard ────────────────────────────────────────────
async function loadDashboard() {
  const content = document.getElementById('dashboardContent');
  const certGrid = document.getElementById('certificatesGrid');
  document.getElementById('dashWelcome').textContent = `Welcome back, ${currentUser.name}!`;
  
  content.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
  certGrid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

  try {
    const res = await fetch(`${API}/api/my-courses`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    
    if (data.success) {
      const courses = data.courses;
      if (courses.length === 0) {
        content.innerHTML = `
          <div class="empty-dash">
            <i class="fas fa-book-open"></i>
            <h3>No Courses Enrolled</h3>
            <p style="color:var(--text-muted); margin: 1rem 0 2rem;">Explore our catalog to start your learning journey.</p>
            <button class="btn btn-primary" onclick="navigateTo('courses-page')">Browse Courses</button>
          </div>
        `;
        certGrid.innerHTML = `<div class="empty-dash"><p>No certificates available yet.</p></div>`;
        return;
      }

      // Render Courses
      content.innerHTML = courses.map(c => `
        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-card-icon" style="background:linear-gradient(135deg,${getGradient(c.category)})">
              <i class="fas ${c.icon}"></i>
            </div>
            <div class="dash-card-title">
              <h4>${c.title}</h4>
              <span>${c.totalLessons} Lessons</span>
            </div>
          </div>
          <div class="dash-progress-wrap">
            <div class="dash-progress-meta">
              <span>Progress</span>
              <span style="color:${c.isCompleted ? 'var(--success)' : 'var(--text-main)'}">${c.progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width:${c.progress}%; ${c.isCompleted ? 'background:var(--success)' : ''}"></div>
            </div>
          </div>
          <div class="dash-actions">
            <button class="btn ${c.progress > 0 ? 'btn-primary' : 'btn-outline'}" style="flex:1" onclick="navigateTo('learn', '${c.courseId}')">
              ${c.progress === 0 ? 'Start Course' : c.isCompleted ? 'Review Course' : 'Resume Course'} <i class="fas ${c.isCompleted ? 'fa-redo' : 'fa-play'}"></i>
            </button>
            ${c.isCompleted ? `
              <button class="btn btn-outline" title="Download Notes" onclick="downloadNotes('${c.courseId}')">
                <i class="fas fa-file-download" style="color:var(--secondary)"></i>
              </button>
            ` : ''}
            <button class="btn btn-outline" title="View Certificate" onclick="navigateTo('certificate-page', '${c.courseId}')">
              <i class="fas fa-award" style="color:${c.isCompleted ? 'var(--warning)' : 'var(--text-muted)'}"></i>
            </button>
          </div>
        </div>
      `).join('');

      // Render Certificates section in dashboard
      certGrid.innerHTML = courses.map(c => `
        <div class="cert-card">
          <div class="cert-preview-wrap ${!c.isCompleted ? 'locked' : ''}">
             <div class="cert-overlay">
                <i class="fas ${c.isCompleted ? 'fa-certificate' : 'fa-lock'}"></i>
                <span>${c.isCompleted ? 'Unlocked' : 'Locked'}</span>
             </div>
             <div style="padding: 20px; color: #fff; font-size: 0.5rem; text-align: center; width: 100%;">
                <h2 style="font-size: 1rem;">Certificate</h2>
                <p>of Completion</p>
                <div style="margin-top: 10px; border-bottom: 1px solid #fff; width: 60%; margin-inline: auto;"></div>
                <p style="margin-top: 5px;">${currentUser.name}</p>
             </div>
          </div>
          <div class="cert-card-body">
            <h4>${c.title}</h4>
            <p>${c.isCompleted ? 'Earned on ' + new Date(c.completedAt).toLocaleDateString() : 'Complete course to unlock'}</p>
            <button class="btn ${c.isCompleted ? 'btn-primary' : 'btn-outline'}" style="width: 100%" 
              onclick="navigateTo('certificate-page', '${c.courseId}')">
              ${c.isCompleted ? 'View & Download' : 'Preview Certificate'}
            </button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    content.innerHTML = '<p class="error text-center">Failed to load dashboard data.</p>';
  }
}

async function setupCertificatePage(courseId) {
  const content = document.getElementById('certificateContent');
  content.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

  try {
    const res = await fetch(`${API}/api/my-courses`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    const course = data.courses.find(c => c.courseId === courseId);

    if (!course) {
      content.innerHTML = '<p class="text-center">Course enrollment not found.</p>';
      return;
    }

    content.innerHTML = `
      <div class="section-header">
        <h2>Course <span class="gradient-text">Certificate</span></h2>
        <p>${course.title}</p>
      </div>
      
      <div class="cert-full-view ${!course.isCompleted ? 'locked' : ''}">
        <div class="cert-watermark">SKILLHUB</div>
        <div style="border: 2px solid rgba(255,255,255,0.1); padding: 3rem; height: 100%;">
           <p style="color: var(--primary-light); letter-spacing: 5px; font-weight: 600; margin-bottom: 2rem;">CERTIFICATE OF COMPLETION</p>
           <h3 style="font-size: 1.5rem; color: var(--text-muted); font-weight: 400;">PROUDLY PRESENTED TO</h3>
           <h1 style="font-size: 4rem; margin: 1.5rem 0; font-family: serif; color: #fff;">${currentUser.name}</h1>
           <p style="font-size: 1.2rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 2rem;">
             For successfully completing the comprehensive professional program in <strong>${course.title}</strong>
           </p>
           <div style="display: flex; justify-content: space-around; margin-top: 4rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
              <div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">DATE</p>
                <p style="font-weight: 700;">${course.isCompleted ? new Date(course.completedAt).toLocaleDateString() : '---'}</p>
              </div>
              <div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">INSTRUCTOR</p>
                <p style="font-weight: 700;">SkillHub Expert</p>
              </div>
              <div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">CERTIFICATE ID</p>
                <p style="font-weight: 700; font-family: monospace;">SKH-${course.enrollmentId.slice(-8).toUpperCase()}</p>
              </div>
           </div>
        </div>
      </div>

      <div class="text-center" style="margin-top: 3rem;">
        ${course.isCompleted 
          ? `<button class="btn btn-primary btn-lg" onclick="downloadCertificate('${courseId}')">Download PDF Certificate <i class="fas fa-download"></i></button>`
          : `<div class="alert info" style="display: inline-block; padding: 1rem 2rem; background: rgba(108, 92, 231, 0.1); border-radius: 12px; border: 1px solid var(--primary);">
               <i class="fas fa-lock"></i> Certificate Locked. Complete 100% of the course to unlock.
             </div>`
        }
      </div>
    `;
  } catch (err) {
    content.innerHTML = '<p class="error text-center">Failed to load certificate preview.</p>';
  }
}

// ── Learn / Video Page ───────────────────────────────────
async function setupLearnPage(courseId) {
  const sidebar = document.getElementById('lessonList');
  sidebar.innerHTML = '<div style="padding:2rem;text-align:center"><i class="fas fa-spinner fa-spin"></i></div>';
  
  // Fetch specific course data from my-courses for progress + full course for video URLs
  try {
    const [myRes, courseRes] = await Promise.all([
      fetch(`${API}/api/my-courses`, { headers: { 'Authorization': `Bearer ${authToken}` } }),
      fetch(`${API}/api/courses/${courseId}`)
    ]);
    
    const myData = await myRes.json();
    const courseData = await courseRes.json();

    if (myData.success && courseData.success) {
      currentMyCourseData = myData.courses.find(c => c.courseId === courseId);
      currentCourse = courseData.course;
      
      if (!currentMyCourseData) {
        showToast('You are not enrolled in this course', 'error');
        return navigateTo('dashboard-page');
      }

      document.getElementById('learnCourseTitle').textContent = currentCourse.title;
      updateSidebarProgress(currentMyCourseData.progress);
      renderLessonList();
      checkCompletionState();

      // Auto-select lesson
      if (currentMyCourseData.lastAccessedLesson) {
        const lesson = currentCourse.lessons.find(l => l._id === currentMyCourseData.lastAccessedLesson);
        if (lesson) {
          selectLesson(lesson);
          return;
        }
      }
      // Or select first uncompleted, or first overall
      const uncompleted = currentCourse.lessons.find(l => !currentMyCourseData.completedLessons.includes(l._id));
      selectLesson(uncompleted || currentCourse.lessons[0]);
    }
  } catch (err) {
    console.error('Learn page error', err);
    showToast('Failed to load learning module', 'error');
  }
}

function renderLessonList() {
  const sidebar = document.getElementById('lessonList');
  sidebar.innerHTML = currentCourse.lessons.map((lesson, idx) => {
    const isCompleted = currentMyCourseData.completedLessons.includes(lesson._id);
    return `
      <div class="lesson-item" id="lesson-item-${lesson._id}" onclick="selectLessonById('${lesson._id}')">
        <div class="lesson-status ${isCompleted ? 'completed' : 'pending'}">
          <i class="fas ${isCompleted ? 'fa-check' : 'fa-book-open'}"></i>
        </div>
        <div class="lesson-details">
          <h4>${idx + 1}. ${lesson.title}</h4>
          <span>${Math.floor(lesson.duration / 60)}:${(lesson.duration % 60).toString().padStart(2,'0')}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectLessonById(lessonId) {
  const lesson = currentCourse.lessons.find(l => l._id === lessonId);
  if (lesson) selectLesson(lesson);
}

function selectLesson(lesson) {
  if (!lesson) return;
  activeLesson = lesson;
  currentLessonId = lesson._id;

  // Update UI active state
  document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.getElementById(`lesson-item-${lesson._id}`);
  if (activeEl) activeEl.classList.add('active');

  // Update Main View
  document.getElementById('activeLessonTitle').textContent = lesson.title;
  document.getElementById('activeLessonMeta').innerHTML = `<i class="fas fa-book-reader"></i> Reading Module &nbsp;&bull;&nbsp; Topic: ${currentCourse.category.toUpperCase()}`;

  const panel = document.getElementById('readingPanel');
  if (!panel) return;

  panel.innerHTML = lesson.content || `
    <h3>${lesson.title}</h3>
    <p>Loading content for this module...</p>
  `;
  // panel.scrollTop = 0; // Reset scroll to top

  // Add scroll listener for progress tracking (95% scroll = complete)
  panel.onscroll = () => {
    const scrollPos = panel.scrollTop + panel.clientHeight;
    const scrollHeight = panel.scrollHeight;
    
    // Check if scrolled at least 95%
    if (scrollHeight > 0 && (scrollPos / scrollHeight) >= 0.95) {
      markLessonComplete(lesson._id);
    }
  };
}

async function markLessonComplete(lessonId) {
  // Check if already complete in local state
  if (currentMyCourseData.completedLessons.includes(lessonId)) return;

  try {
    const res = await fetch(`${API}/api/progress`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ courseId: currentCourse._id, lessonId })
    });
    
    const data = await res.json();
    if (data.success) {
      showToast('Lesson completed!', 'success');
      currentMyCourseData.completedLessons = data.completedLessons;
      currentMyCourseData.progress = data.progress;
      currentMyCourseData.isCompleted = data.isCompleted;

      // Update sidebar
      updateSidebarProgress(data.progress);
      renderLessonList();
      selectLesson(activeLesson); // reapply active class

      checkCompletionState();

      // Auto-play next if available
      const currentIndex = currentCourse.lessons.findIndex(l => l._id === lessonId);
      if (currentIndex < currentCourse.lessons.length - 1) {
        setTimeout(() => selectLesson(currentCourse.lessons[currentIndex + 1]), 1500);
      }
    }
  } catch (err) {
    console.error('Progress update failed', err);
  }
}

function updateSidebarProgress(progress) {
  document.getElementById('sidebarProgress').style.width = `${progress}%`;
  document.getElementById('sidebarProgressText').textContent = `${progress}% Complete`;
}

function checkCompletionState() {
  const banner = document.getElementById('completionBanner');
  if (currentMyCourseData.isCompleted) {
    banner.style.display = 'flex';
    document.getElementById('downloadCertBtn').onclick = () => downloadCertificate(currentCourse._id);
  } else {
    banner.style.display = 'none';
  }
}

async function downloadCertificate(courseId) {
  showToast('Generating certificate...', 'info');
  try {
    const res = await fetch(`${API}/api/certificate/${courseId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (res.ok) {
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${courseId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('Certificate downloaded successfully', 'success');
    } else {
      const data = await res.json();
      showToast(data.message || 'Failed to download certificate', 'error');
    }
  } catch (err) {
    showToast('Download error', 'error');
  }
}

async function downloadNotes(courseId) {
  showToast('Preparing your notes...', 'info');
  try {
    const res = await fetch(`${API}/api/courses/${courseId}`);
    const data = await res.json();
    if (data.success) {
      const course = data.course;
      let notesContent = `SKILLHUB - COURSE NOTES\n`;
      notesContent += `COURSE: ${course.title}\n`;
      notesContent += `INSTRUCTOR: ${course.instructor}\n`;
      notesContent += `DATE: ${new Date().toLocaleDateString()}\n`;
      notesContent += `==========================================\n\n`;

      course.lessons.forEach((lesson, index) => {
        notesContent += `MODULE ${index + 1}: ${lesson.title.toUpperCase()}\n`;
        notesContent += `------------------------------------------\n`;
        // Strip HTML tags for clean text notes
        const cleanContent = lesson.content.replace(/<[^>]*>?/gm, '');
        notesContent += cleanContent.trim() + `\n\n`;
      });

      notesContent += `==========================================\n`;
      notesContent += `© 2026 SkillHub. All Rights Reserved.\n`;

      const blob = new Blob([notesContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${course.title.replace(/\s+/g, '_')}_Notes.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      showToast('Notes downloaded successfully', 'success');
    }
  } catch (err) {
    showToast('Failed to download notes', 'error');
  }
}

// ── Modals & Toast ───────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => openModal(to), 200);
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'fa-info-circle';
  if(type === 'success') icon = 'fa-check-circle';
  if(type === 'error') icon = 'fa-exclamation-circle';
  
  toast.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ── Utils ────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function showStatus(el, msg, type) {
  if (!el) return;
  if (!msg) { el.style.display = 'none'; return; }
  el.textContent = msg;
  el.className = `form-status ${type}`;
  el.style.display = 'block';
}

function initForms() {
  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('loginStatus');
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

      try {
        const res = await fetch(`${API}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
          })
        });
        const data = await res.json();
        if (data.success) {
          authToken = data.token;
          localStorage.setItem('skillhub_token', data.token);
          currentUser = data.user;
          updateUI(true);
          closeModal('loginModal');
          showToast(`Welcome back!`, 'success');
          e.target.reset();
          showStatus(status, '', '');
        } else {
          showStatus(status, data.message, 'error');
        }
      } catch (err) {
        showStatus(status, 'Connection error', 'error');
      }
      btn.disabled = false; btn.innerHTML = 'Login <i class="fas fa-arrow-right"></i>';
    });
  }

  // Signup
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('signupStatus');
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

      try {
        const res = await fetch(`${API}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('signupName').value,
            email: document.getElementById('signupEmail').value,
            password: document.getElementById('signupPassword').value
          })
        });
        const data = await res.json();
        if (data.success) {
          authToken = data.token;
          localStorage.setItem('skillhub_token', data.token);
          currentUser = data.user;
          updateUI(true);
          closeModal('signupModal');
          showToast(`Welcome to SkillHub!`, 'success');
          e.target.reset();
          showStatus(status, '', '');
        } else {
          showStatus(status, data.message, 'error');
        }
      } catch (err) {
        showStatus(status, 'Connection error', 'error');
      }
      btn.disabled = false; btn.innerHTML = 'Create Account <i class="fas fa-arrow-right"></i>';
    });
  }

  // Contact
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.getElementById('contactStatus');
      const btn = e.target.querySelector('button[type="submit"]');
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      try {
        const res = await fetch(`${API}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            message: document.getElementById('contactMessage').value
          })
        });
        const data = await res.json();
        if (data.success) {
          showStatus(status, 'Message sent successfully!', 'success');
          e.target.reset();
        } else {
          showStatus(status, data.message, 'error');
        }
      } catch (err) {
        showStatus(status, 'Connection error', 'error');
      }
      btn.disabled = false; btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    });
  }

  // Enrollment
  const enrollmentForm = document.getElementById('enrollmentForm');
  if (enrollmentForm) enrollmentForm.addEventListener('submit', handleEnrollmentSubmit);

  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  if (confirmPaymentBtn) confirmPaymentBtn.addEventListener('click', handlePaymentConfirm);
}
