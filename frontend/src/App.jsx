import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Modals from './components/Modals';
import Toast from './components/Toast';

import Home from './pages/Home';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import CourseDetails from './pages/CourseDetails';
import Learn from './pages/Learn';
import Enroll from './pages/Enroll';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Certificate from './pages/Certificate';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';

import { AuthProvider } from './context/AuthContext';

export const UIContext = React.createContext(null);

function App() {
  const [activeModal, setActiveModal] = useState(null); // 'login' or 'signup' or null
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  const showToast = (message, type = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const openModal = (id) => {
    setActiveModal(id);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = '';
  };

  return (
    <AuthProvider>
      <UIContext.Provider value={{ activeModal, openModal, closeModal, showToast }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn/:id" element={<Learn />} />
            <Route path="/enroll/:id" element={<Enroll />} />
            <Route path="/payment/:enrollmentId" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/certificate/:id" element={<Certificate />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          <Footer />
          <Modals />
          <Toast toast={toast} />
        </Router>
      </UIContext.Provider>
    </AuthProvider>
  );
}

export default App;
