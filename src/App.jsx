import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BookingModule from './components/BookingModule';
import AllBookings from './components/AllBookings';
import BookingDetail from './components/BookingDetail';
import Customers from './components/Customers';
import CustomerDetail from './components/CustomerDetail';
import Drivers from './components/Drivers';
import DriverDetail from './components/DriverDetail';
import LeadsDashboard from './components/LeadsDashboard';
import ComingSoon from './components/ComingSoon';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const isAuth = sessionStorage.getItem('adminAuth') === 'true';
  return isAuth ? children : <Navigate to="/login" />;
};

const NotFound = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8FAFC', textAlign: 'center' }}>
    <h1 style={{ fontSize: '4rem', color: '#0B192C', margin: 0 }}>404</h1>
    <h2 style={{ color: '#475569', marginBottom: '1.5rem' }}>Page Not Found</h2>
    <p style={{ color: '#64748B', marginBottom: '2rem' }}>The page you are looking for doesn't exist or has been moved.</p>
    <button onClick={() => window.location.href = '/dashboard'} style={{ background: '#0044FF', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
      Go to Dashboard
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><LeadsDashboard /></ProtectedRoute>} />
        <Route path="/coming-soon" element={<ProtectedRoute><ComingSoon /></ProtectedRoute>} />
        
        {/* Legacy / Disabled Routes */}
        <Route path="/bookings" element={<ProtectedRoute><BookingModule /></ProtectedRoute>} />
        <Route path="/bookings/:id" element={<ProtectedRoute><BookingDetail /></ProtectedRoute>} />
        <Route path="/bookings/:id/edit" element={<ProtectedRoute><BookingModule /></ProtectedRoute>} />
        <Route path="/all-bookings" element={<ProtectedRoute><AllBookings /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
        <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>} />
        <Route path="/drivers/:id" element={<ProtectedRoute><DriverDetail /></ProtectedRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
