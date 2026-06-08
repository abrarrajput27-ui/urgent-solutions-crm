import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, User, Phone, Car, Calendar, TrendingUp, Loader2, Star, Eye } from 'lucide-react';
import '../dashboard.css';

const DriverDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [driver, setDriver] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDriverData();
  }, [id]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);
      // Fetch Driver Profile
      const { data: driverData, error: driverError } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', id)
        .single();

      if (driverError) throw driverError;
      setDriver(driverData);

      // Fetch Driver Bookings History using mobile number
      const { data: bookData, error: bookError } = await supabase
        .from('bookings')
        .select('*')
        .eq('driver_mobile', driverData.mobile)
        .order('created_at', { ascending: false });

      if (bookError) throw bookError;
      setBookings(bookData || []);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <TopNav />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#64748B' }}>
            <Loader2 size={40} className="lucide-spin" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <TopNav />
          <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate('/drivers')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: '600', marginBottom: '1rem' }}>
              <ArrowLeft size={18} /> Back to Drivers
            </button>
            <div style={{ background: '#FEF2F2', padding: '2rem', borderRadius: '12px', border: '1px solid #FCA5A5', color: '#DC2626', textAlign: 'center' }}>
              <h3>Error Loading Driver</h3>
              <p>{error || 'Driver not found.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        
        <div className="dashboard-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header Action */}
          <div style={{ marginBottom: '1.5rem' }}>
            <button onClick={() => navigate('/drivers')} className="btn-modal-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              <ArrowLeft size={16} /> Back to Drivers
            </button>
          </div>

          {/* Profile Card */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: '#F0FDF4', color: '#16A34A', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', fontWeight: '800' }}>
                {driver.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {driver.name}
                  <span style={{ 
                    background: driver.status === 'Active' ? '#DCFCE7' : '#F1F5F9', 
                    color: driver.status === 'Active' ? '#166534' : '#64748B', 
                    padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700' 
                  }}>
                    {driver.status || 'Active'}
                  </span>
                </h1>
                <div style={{ display: 'flex', gap: '1.5rem', color: '#64748B', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={16} /> {driver.mobile}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0B192C', fontWeight: '600' }}>
                    <Car size={16} /> {driver.vehicle_number || 'N/A'} ({driver.vehicle_model} {driver.vehicle_category})
                  </span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Total Trips</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>{driver.total_trips}</div>
              </div>
              <div style={{ width: '1px', background: '#E2E8F0' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Total Earnings</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16A34A' }}>₹{Number(driver.total_driver_amount || 0).toLocaleString()}</div>
              </div>
              <div style={{ width: '1px', background: '#E2E8F0' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Rating</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {Number(driver.rating || 5).toFixed(1)} <Star size={20} fill="#F59E0B" />
                </div>
              </div>
            </div>
          </div>

          {/* Bookings History Section */}
          <h3 style={{ color: '#0F172A', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="#3B82F6" /> Driver Trip History
          </h3>
          
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {bookings.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                No past trips found for this driver.
              </div>
            ) : (
              <div className="all-bookings-table-wrapper" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Booking ID</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Customer</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Route</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Driver Earnings</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600', textAlign: 'center' }}>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s', ':hover': { background: '#F8FAFC' } }}>
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#0B192C' }}>{b.booking_id}</td>
                        <td style={{ padding: '1rem', color: '#64748B' }}>{b.booking_date}</td>
                        <td style={{ padding: '1rem', color: '#334155' }}>{b.customer_name || 'N/A'}</td>
                        <td style={{ padding: '1rem', color: '#334155' }}>{b.route || 'N/A'}</td>
                        <td style={{ padding: '1rem', fontWeight: '600', color: '#16A34A' }}>
                          ₹{b.driver_ownership === 'Outside Driver' ? (b.driver_amount?.toLocaleString() || 0) : 'Salary/Internal'}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            background: b.booking_status === 'Confirmed' ? '#DCFCE7' : b.booking_status === 'Completed' ? '#DBEAFE' : b.booking_status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7', 
                            color: b.booking_status === 'Confirmed' ? '#166534' : b.booking_status === 'Completed' ? '#1E40AF' : b.booking_status === 'Cancelled' ? '#991B1B' : '#92400E', 
                            padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' 
                          }}>
                            {b.booking_status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button 
                            onClick={() => navigate(`/bookings/${b.id}`)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }} 
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DriverDetail;
