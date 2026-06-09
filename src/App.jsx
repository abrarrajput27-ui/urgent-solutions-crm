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
import './index.css';

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
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<BookingModule />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
        <Route path="/bookings/:id/edit" element={<BookingModule />} />
        <Route path="/all-bookings" element={<AllBookings />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/drivers/:id" element={<DriverDetail />} />
        <Route path="/leads" element={<LeadsDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
