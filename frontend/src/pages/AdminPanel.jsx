import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, token, API } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);
  
  const [courses, setCourses] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [loading, setLoading] = useState(true);
  
  // Form State for Adding/Editing Course
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: 'programming',
    icon: 'fa-laptop-code'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      showToast('Access Denied', 'error');
      navigate('/');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, messagesRes] = await Promise.all([
        fetch(`${API}/api/courses`),
        fetch(`${API}/api/contact`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const coursesData = await coursesRes.json();
      const messagesData = await messagesRes.json();
      
      if (coursesData.success) setCourses(coursesData.courses);
      if (messagesData.success) setMessages(messagesData.contacts);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/api/courses/${editingId}` : `${API}/api/courses`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseForm)
      });
      const data = await res.json();
      
      if (data.success) {
        showToast(editingId ? 'Course updated' : 'Course added', 'success');
        setEditingId(null);
        setCourseForm({ title: '', description: '', price: '', duration: '', category: 'programming', icon: 'fa-laptop-code' });
        fetchData();
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Operation failed', 'error');
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      const res = await fetch(`${API}/api/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Course deleted', 'success');
        fetchData();
      }
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const startEdit = (course) => {
    setEditingId(course._id);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: course.price,
      duration: course.duration,
      category: course.category,
      icon: course.icon || 'fa-laptop-code'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div id="adminPanelPage" className="page-wrapper">
      <div className="container">
        <div className="dash-header">
          <h1>Admin <span className="gradient-text">Panel</span></h1>
          <div className="admin-tabs" style={{ display: 'flex', gap: '1rem' }}>
            <button className={`btn ${activeTab === 'courses' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('courses')}>Manage Courses</button>
            <button className={`btn ${activeTab === 'messages' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('messages')}>User Messages ({messages.length})</button>
          </div>
        </div>

        {activeTab === 'courses' ? (
          <div className="admin-courses-section">
            {/* Course Form */}
            <div className="payment-card" style={{ marginBottom: '3rem' }}>
              <h3>{editingId ? 'Edit Course' : 'Add New Course'}</h3>
              <form onSubmit={handleCourseSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label>Course Title</label>
                  <input type="text" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={courseForm.price} onChange={(e) => setCourseForm({...courseForm, price: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description</label>
                  <textarea value={courseForm.description} onChange={(e) => setCourseForm({...courseForm, description: e.target.value})} required rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label>Duration (e.g. 4 Weeks)</label>
                  <input type="text" value={courseForm.duration} onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})} required placeholder="e.g. 6 Hours or 4 Weeks" />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={courseForm.category} onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}>
                    <option value="programming">Programming</option>
                    <option value="data-analytics">Data Analytics</option>
                    <option value="business">Business</option>
                    <option value="design">Design</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Icon Class (FontAwesome)</label>
                  <input type="text" value={courseForm.icon} onChange={(e) => setCourseForm({...courseForm, icon: e.target.value})} placeholder="fa-laptop-code" />
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingId ? 'Update Course' : 'Create Course'}</button>
                  {editingId && <button type="button" className="btn btn-outline" onClick={() => {setEditingId(null); setCourseForm({title:'', description:'', price:'', category:'Programming', icon:'fa-laptop-code'})}}>Cancel</button>}
                </div>
              </form>
            </div>

            {/* Course List */}
            <div className="dash-grid">
              {courses.map(course => (
                <div className="dash-card" key={course._id}>
                  <div className="dash-card-header">
                    <div className="dash-card-icon" style={{ background: 'var(--gradient-1)' }}><i className={`fas ${course.icon || 'fa-graduation-cap'}`}></i></div>
                    <div className="dash-card-title">
                      <h4>{course.title}</h4>
                      <span>₹{course.price} | {course.category}</span>
                    </div>
                  </div>
                  <div className="dash-actions" style={{ marginTop: '1.5rem', gap: '0.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => startEdit(course)}><i className="fas fa-edit"></i> Edit</button>
                    <button className="btn btn-outline btn-sm" style={{ color: 'var(--error)' }} onClick={() => deleteCourse(course._id)}><i className="fas fa-trash"></i> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-messages-section">
            <div className="messages-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {messages.length === 0 ? <p>No messages found.</p> : messages.map(msg => (
                <div className="payment-card" key={msg._id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <strong>{msg.name} ({msg.email})</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ color: '#eee', lineHeight: '1.6' }}>{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
