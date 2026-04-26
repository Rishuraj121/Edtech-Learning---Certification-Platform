import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const Payment = () => {
  const { enrollmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, API } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);

  const course = location.state?.course;
  const enrollment = location.state?.enrollment;

  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState(enrollment?.phone || '');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!course || !enrollment) {
      navigate('/courses');
    }
  }, [course, enrollment, navigate]);

  const handlePaymentConfirm = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${API}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ enrollmentId })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Payment successful', 'success');
        navigate('/success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      showToast('Payment failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (!course || !enrollment) return null;

  return (
    <div id="paymentPage" className="page-wrapper">
      <div className="container small-container">
        <div className="page-content">
          <h2 className="text-center"><i className="fas fa-lock"></i> Confirm Payment</h2>
          <p className="text-center text-muted">Complete your enrollment for <span className="gradient-text" style={{ fontWeight: 700 }}>{course.title}</span></p>
          
          <div className="payment-card">
            <div className="payment-row"><span>Enrollment ID:</span><span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{enrollmentId.toUpperCase()}</span></div>
            <div className="payment-row"><span>Total Amount:</span><strong className="price-val">₹{course.price.toLocaleString()}</strong></div>
          </div>

          <div className="payment-methods" style={{ marginTop: '2rem' }}>
            <h4>Select Payment Method</h4>
            
            <div className="payment-method-options">
              <div className={`method-option ${method === 'upi' ? 'active' : ''}`} onClick={() => setMethod('upi')}>
                <input type="radio" name="payMethod" checked={method === 'upi'} readOnly />
                <label><i className="fas fa-mobile-alt"></i> UPI / PhonePe / GPay</label>
              </div>
              <div className={`method-option ${method === 'card' ? 'active' : ''}`} onClick={() => setMethod('card')}>
                <input type="radio" name="payMethod" checked={method === 'card'} readOnly />
                <label><i className="fas fa-credit-card"></i> Credit / Debit Card</label>
              </div>
            </div>

            {method === 'upi' && (
              <div className="method-details active">
                <div className="form-group">
                  <label htmlFor="upiId">Enter UPI ID or Mobile Number</label>
                  <div className="input-with-icon">
                    <i className="fas fa-at"></i>
                    <input type="text" id="upiId" placeholder="user@upi or 9876543210" required 
                      value={upiId} onChange={e => setUpiId(e.target.value)} />
                  </div>
                  <small className="text-muted">Auto-filled with your saved phone number.</small>
                </div>
              </div>
            )}

            {method === 'card' && (
              <div className="method-details active">
                <div className="card-skeleton"><div className="line"></div><div className="line short"></div></div>
                <p className="text-center text-muted" style={{ fontSize: '0.85rem' }}>Card details section currently in maintenance.</p>
              </div>
            )}
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '2rem' }} disabled={processing} onClick={handlePaymentConfirm}>
            {processing ? 'Confirming...' : <>Confirm & Pay Now <i className="fas fa-check-circle"></i></>}
          </button>
          <button type="button" className="btn btn-ghost" style={{ width: '100%', marginTop: '.5rem' }} onClick={() => navigate(-1)}>Cancel</button>
          
          <div className="simulated-gateway" style={{ marginTop: '1.5rem' }}><i className="fas fa-shield-alt"></i> Secured 256-bit SSL Encryption</div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
