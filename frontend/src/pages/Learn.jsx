import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Learn = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, API } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [myCourseData, setMyCourseData] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const readingPanelRef = useRef(null);

  useEffect(() => {
    if (readingPanelRef.current) {
      readingPanelRef.current.scrollTop = 0;
    }
  }, [activeLesson]);

  useEffect(() => {
    const fetchLearnData = async () => {
      try {
        const [myRes, courseRes] = await Promise.all([
          fetch(`${API}/api/my-courses`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API}/api/courses/${id}`)
        ]);
        
        const myData = await myRes.json();
        const courseData = await courseRes.json();

        if (myData.success && courseData.success) {
          const myDataC = myData.courses.find(c => c.courseId === id);
          if (!myDataC) {
            navigate('/dashboard');
            return;
          }
          setMyCourseData(myDataC);
          setCourse(courseData.course);
          
          if (courseData.course.lessons.length > 0) {
            let initialLesson = courseData.course.lessons[0];
            if (myDataC.lastAccessedLesson) {
              const l = courseData.course.lessons.find(l => l._id === myDataC.lastAccessedLesson);
              if (l) initialLesson = l;
            } else {
              const uncompleted = courseData.course.lessons.find(l => !myDataC.completedLessons.includes(l._id));
              if (uncompleted) initialLesson = uncompleted;
            }
            setActiveLesson(initialLesson);
          }
        }
      } catch (err) {
        console.error('Learn page error', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLearnData();
    } else {
      navigate('/');
    }
  }, [id, token, API, navigate]);

  const markLessonComplete = async () => {
    if (!activeLesson || myCourseData.completedLessons.includes(activeLesson._id)) return;

    try {
      const res = await fetch(`${API}/api/progress`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId: course._id, lessonId: activeLesson._id })
      });
      const data = await res.json();
      if (data.success) {
        setMyCourseData(prev => ({
          ...prev,
          completedLessons: data.completedLessons,
          progress: data.progress,
          isCompleted: data.isCompleted
        }));
      }
    } catch (err) {
      console.error('Progress update failed', err);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight > 0 && (scrollTop + clientHeight) / scrollHeight >= 0.95) {
      markLessonComplete();
    }
  };

  if (loading || !course || !myCourseData) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}><i className="fas fa-spinner fa-spin fa-3x"></i></div>;
  }

  return (
    <div id="learnPage" className="page-wrapper">
      <div className="learn-layout">
        <aside className="learn-sidebar" id="learnSidebar">
          <div className="sidebar-header">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}><i className="fas fa-arrow-left"></i> Back</button>
            <h3 id="learnCourseTitle">{course.title}</h3>
            <div className="sidebar-progress">
              <div className="progress-bar-wrap"><div className="progress-bar-fill" style={{ width: `${myCourseData.progress}%` }}></div></div>
              <span id="sidebarProgressText">{myCourseData.progress}% Complete</span>
            </div>
          </div>
          <ul className="lesson-list" id="lessonList">
            {course.lessons.map((lesson, idx) => {
              const isCompleted = myCourseData.completedLessons.includes(lesson._id);
              const isActive = activeLesson && activeLesson._id === lesson._id;
              return (
                <div 
                  key={lesson._id} 
                  className={`lesson-item ${isActive ? 'active' : ''}`} 
                  onClick={() => setActiveLesson(lesson)}
                >
                  <div className={`lesson-status ${isCompleted ? 'completed' : 'pending'}`}>
                    <i className={`fas ${isCompleted ? 'fa-check' : 'fa-book-open'}`}></i>
                  </div>
                  <div className="lesson-details">
                    <h4>{idx + 1}. {lesson.title}</h4>
                    <span>{Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2,'0')}</span>
                  </div>
                </div>
              );
            })}
          </ul>
        </aside>
        <main className="learn-main" id="learnMain">
          <div className="reading-container">
            <div id="readingPanel" className="reading-panel" ref={readingPanelRef} onScroll={handleScroll}>
              {activeLesson ? (
                <div dangerouslySetInnerHTML={{ __html: activeLesson.content }} />
              ) : (
                <div className="reading-placeholder">
                  <i className="fas fa-book-open"></i>
                  <p>Select a lesson to start reading...</p>
                </div>
              )}
            </div>
          </div>
          <div className="lesson-info" id="lessonInfo">
            {activeLesson && (
              <>
                <h2 id="activeLessonTitle">{activeLesson.title}</h2>
                <p id="activeLessonMeta"><i className="fas fa-book-reader"></i> Reading Module &nbsp;&bull;&nbsp; Topic: {course.category.toUpperCase()}</p>
              </>
            )}
            {myCourseData.isCompleted && (
              <div id="completionBanner" className="completion-banner" style={{ display: 'flex' }}>
                <i className="fas fa-trophy"></i>
                <div>
                  <strong>🎉 Course Completed!</strong>
                  <p>You've completed all lessons. Download your certificate!</p>
                </div>
                <button className="btn btn-primary" id="downloadCertBtn">Download Certificate <i className="fas fa-download"></i></button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Learn;
