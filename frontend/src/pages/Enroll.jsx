import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const Enroll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API } = useContext(AuthContext);
  const { showToast, openModal } = useContext(UIContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      showToast('Please login to enroll', 'info');
      openModal('login');
      navigate('/');
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API}/api/courses/${id}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.course);
          if (user) {
            setFormData({ name: user.name, phone: user.phone || '' });
          }
        } else {
          navigate('/courses');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, API, token, user, navigate, openModal, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch(`${API}/api/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          courseId: course._id,
          userId: user.id || user._id
        })
      });
      const data = await res.json();
      if (data.success) {
        navigate(`/payment/${data.enrollment._id}`, { state: { course, enrollment: data.enrollment } });
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Enrollment failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !course) {
    return <div className="loading-spinner" style={{ marginTop: '5rem' }}><i className="fas fa-spinner fa-spin fa-3x"></i></div>;
  }

  return (
    <div id="enrollPage" className="page-wrapper">
      <div className="container small-container">
        <div className="page-content">
          <h2 className="text-center"><i className="fas fa-edit"></i> Enrollment Details</h2>
          <p className="text-center gradient-text" style={{ fontSize: '1.2rem', fontWeight: 700, margin: '.5rem 0' }}>{course.title}</p>
          <div className="info-box">
            <i className="fas fa-info-circle"></i> Enrolling in <strong>{course.title}</strong>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="enrollName">Full Name</label>
              <input type="text" id="enrollName" required placeholder="Your full name"
                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="enrollPhone">Phone Number</label>
              <input type="tel" id="enrollPhone" required placeholder="Your contact number"
                value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="amount-display">
              <span>Total Amount:</span><span className="price-val">₹{course.price.toLocaleString()}</span>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={processing}>
              {processing ? 'Processing...' : <>Proceed to Payment <i className="fas fa-credit-card"></i></>}
            </button>
            <button type="button" className="btn btn-ghost" style={{ width: '100%', marginTop: '.5rem' }} onClick={() => navigate(`/courses/${course._id}`)}>Cancel</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Enroll;
