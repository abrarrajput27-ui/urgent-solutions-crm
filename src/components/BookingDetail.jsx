import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, Edit3, FileText, Printer, FileSpreadsheet, MapPin, 
  Calendar, User, Phone, Mail, Car, Fuel, Briefcase, Wallet, 
  CheckCircle2, TrendingUp, Calculator, Loader2, Navigation,
  AlertCircle, ShieldAlert, Clock, CheckCircle, Circle, CreditCard, Trash2
} from 'lucide-react';
import '../dashboard.css';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionModal, setActionModal] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      const { error } = await supabase.from('bookings').update({ booking_status: newStatus }).eq('id', id);
      if (error) throw error;
      setBooking({ ...booking, booking_status: newStatus });
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to move this booking to Trash?")) {
      try {
        const { error } = await supabase.from('bookings').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
        if (error) throw error;
        alert("Booking moved to Trash.");
        navigate('/all-bookings');
      } catch (err) {
        alert("Failed to move booking to trash: " + err.message);
      }
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

  if (error || !booking) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content">
          <TopNav />
          <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate('/all-bookings')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontWeight: '600', marginBottom: '1rem' }}>
              <ArrowLeft size={18} /> Back to All Bookings
            </button>
            <div style={{ background: '#FEF2F2', padding: '2rem', borderRadius: '12px', border: '1px solid #FCA5A5', color: '#DC2626', textAlign: 'center' }}>
              <h3>Error Loading Booking</h3>
              <p>{error || 'Booking not found.'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Helper Components
  const Card = ({ children, style }) => (
    <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', ...style }}>
      {children}
    </div>
  );

  const CardHeader = ({ icon: Icon, title, rightElement }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-navy)', fontWeight: '700', fontSize: '1.05rem' }}>
        <Icon size={18} color="#3B82F6" />
        {title}
      </div>
      {rightElement}
    </div>
  );

  const DataRow = ({ label, value, isBold, valueColor }) => (
    <div className="expense-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid #F1F5F9' }}>
      <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '500' }}>{label}</span>
      <span style={{ fontWeight: isBold ? '700' : '500', color: valueColor || '#0F172A', fontSize: '0.9rem', textAlign: 'right', maxWidth: '60%' }}>
        {value || '-'}
      </span>
    </div>
  );

  // Status Colors
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return { bg: '#DCFCE7', text: '#166534' };
      case 'Completed': return { bg: '#DBEAFE', text: '#1E40AF' };
      case 'Cancelled': return { bg: '#FEE2E2', text: '#991B1B' };
      default: return { bg: '#FEF3C7', text: '#92400E' }; // Pending
    }
  };
  const statusStyle = getStatusStyle(booking?.booking_status);

  // Timeline Logic
  const isDriverAssigned = booking?.driver_name && booking?.driver_name.length > 0;
  const isTripStarted = ['In Progress', 'Completed'].includes(booking?.booking_status);
  const isTripCompleted = booking?.booking_status === 'Completed';
  const isReviewDone = booking?.review_status !== 'Pending';

  const TimelineItem = ({ title, active, date }) => (
    <div style={{ display: 'flex', gap: '1rem', position: 'relative', paddingBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ color: active ? '#10B981' : '#CBD5E1', background: 'white', zIndex: 2 }}>
          {active ? <CheckCircle size={20} fill="#D1FAE5" /> : <Circle size={20} />}
        </div>
        <div style={{ width: '2px', background: active ? '#10B981' : '#E2E8F0', flex: 1, position: 'absolute', top: '20px', bottom: '0', left: '9px', zIndex: 1 }}></div>
      </div>
      <div style={{ flex: 1, paddingTop: '2px' }}>
        <div style={{ fontWeight: '600', color: active ? '#0F172A' : '#94A3B8', fontSize: '0.95rem' }}>{title}</div>
        {date && <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>{date}</div>}
      </div>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        
        <div className="dashboard-content" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Quick Actions Row */}
          <div className="quick-actions-wrapper" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <button onClick={() => navigate('/all-bookings')} className="btn-modal-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              <ArrowLeft size={16} /> Back to All Bookings
            </button>
            <div className="btn-group hide-on-print" style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => navigate(`/bookings/${id}/edit`)} className="btn-modal-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><Edit3 size={16} /> Edit Booking</button>
              <button onClick={handleDelete} className="btn-modal-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#DC2626', borderColor: '#FCA5A5', background: '#FEF2F2' }}><Trash2 size={16} /> Delete</button>
              <button onClick={() => setActionModal('Generate Invoice')} className="btn-modal-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><FileText size={16} /> Invoice</button>
              <button onClick={() => setActionModal('Generate Quotation')} className="btn-modal-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><FileSpreadsheet size={16} /> Quotation</button>
              <button onClick={() => window.print()} className="btn-modal-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}><Printer size={16} /> Print</button>
            </div>
          </div>

          {/* Premium Header Card */}
          <div className="hide-on-print premium-header-wrapper" style={{ background: 'linear-gradient(135deg, #0B192C 0%, #1a365d 100%)', borderRadius: '16px', padding: '2rem', color: 'white', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(11,25,44,0.15)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', letterSpacing: '1px' }}>{booking?.booking_id}</h1>
                <span style={{ background: statusStyle.bg, color: statusStyle.text, padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusStyle.text }}></span>
                  <select 
                    value={booking?.booking_status || 'Pending'} 
                    onChange={(e) => updateStatus(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: 'inherit', outline: 'none', cursor: 'pointer', appearance: 'none' }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Started">Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="No Show">No Show</option>
                  </select>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', color: '#94A3B8', fontSize: '0.95rem', fontWeight: '500' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> {new Date(booking?.booking_date).toLocaleDateString()}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Briefcase size={16} /> {booking?.source_category || booking?.booking_source}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: booking?.service_vehicle_type === 'Our Vehicle' ? '#4ADE80' : '#F87171' }}><Car size={16} /> {booking?.service_vehicle_type}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Net Profit Generated</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ADE80' }}>₹{(booking?.profit || 0).toLocaleString()}</div>
            </div>
          </div>

          <div className="responsive-grid" style={{ gap: '1.5rem', alignItems: 'start' }}>
            
            {/* --- LEFT COLUMN --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Route Timeline Card */}
              <Card>
                <CardHeader icon={Navigation} title="Trip & Route Details" rightElement={<span style={{ background: '#F1F5F9', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#475569' }}>{booking?.trip_type} ({booking?.number_of_days} Days)</span>} />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3B82F6', border: '3px solid #DBEAFE', zIndex: 2 }}></div>
                    <div style={{ width: '2px', background: '#E2E8F0', flex: 1, margin: '2px 0' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', border: '3px solid #FEE2E2', zIndex: 2 }}></div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: '2px' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Pickup</div>
                      <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '1.05rem', lineHeight: '1.3' }}>{booking?.pickup_location || 'Not specified'}</div>
                      <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {booking?.pickup_datetime ? new Date(booking?.pickup_datetime).toLocaleString() : 'Time not set'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Drop</div>
                      <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '1.05rem', lineHeight: '1.3' }}>{booking?.drop_location || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px dashed #E2E8F0' }}>
                  <DataRow label="Full Auto-Generated Route" value={booking?.route} />
                </div>
              </Card>

              {/* Driver & Vehicle Information Card */}
              <Card>
                <CardHeader icon={Car} title="Driver & Vehicle Information" />
                <div className="responsive-grid" style={{ gap: '1rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}><User size={16} /> Driver Info</div>
                    <DataRow label="Name" value={booking?.driver_name} isBold />
                    <DataRow label="Mobile" value={booking?.driver_mobile} />
                    <DataRow label="Ownership" value={booking?.driver_ownership} valueColor={booking?.driver_ownership === 'Our Driver' ? '#16A34A' : '#D97706'} />
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A', fontWeight: '700', marginBottom: '0.75rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}><Car size={16} /> Vehicle Info</div>
                    <DataRow label="Number" value={booking?.vehicle_number} isBold color="#2563EB" />
                    <DataRow label="Model" value={booking?.vehicle_model} />
                    <DataRow label="Category" value={booking?.vehicle_category} />
                    <DataRow label="Fuel Type" value={booking?.fuel_type} />
                    <DataRow label="Ownership" value={booking?.vehicle_ownership} valueColor={booking?.vehicle_ownership === 'Our Vehicle' ? '#16A34A' : '#D97706'} />
                  </div>
                </div>
              </Card>

              {/* Customer Card */}
              <Card>
                <CardHeader icon={User} title="Customer Information" />
                <div className="responsive-grid" style={{ gap: '1rem' }}>
                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Primary Contact</div>
                    <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '1.1rem', marginTop: '0.2rem' }}>{booking?.customer_name || 'N/A'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem', marginTop: '0.4rem' }}><Phone size={14} /> {booking?.customer_mobile || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Other Details</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem', marginTop: '0.4rem' }}><Phone size={14} /> Alt: {booking?.alternate_mobile || 'N/A'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.9rem', marginTop: '0.4rem' }}><Mail size={14} /> {booking?.customer_email || 'N/A'}</div>
                  </div>
                </div>
              </Card>

              {/* Collection Details Card */}
              <Card>
                <CardHeader icon={Wallet} title="Collection Breakdown" rightElement={<span style={{ fontWeight: '700', color: '#0F172A', fontSize: '1.1rem' }}>Total: ₹{(booking?.collection_total || 0).toLocaleString()}</span>} />
                <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Collected By</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{booking?.collection_done_by || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Mode</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{booking?.collection_mode || 'N/A'}</span>
                  </div>
                </div>
                <div className="responsive-grid" style={{ gap: '1rem' }}>
                  <DataRow label="Cash" value={`₹${(booking?.cash_collection_amount || 0).toLocaleString()}`} />
                  <DataRow label="Paytm" value={`₹${(booking?.paytm_collection_amount || 0).toLocaleString()}`} />
                  <DataRow label="UPI" value={`₹${(booking?.upi_collection_amount || 0).toLocaleString()}`} />
                  <DataRow label="Bank Transfer" value={`₹${(booking?.bank_collection_amount || 0).toLocaleString()}`} />
                </div>
              </Card>

            </div>

            {/* --- RIGHT COLUMN --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Recovery & Settlement Card */}
              <Card>
                <CardHeader icon={CreditCard} title="Recovery & Settlement" rightElement={
                  <span style={{ background: booking?.settlement_status === 'Settled' ? '#DCFCE7' : '#FEF3C7', color: booking?.settlement_status === 'Settled' ? '#166534' : '#92400E', padding: '0.3rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>
                    {booking?.settlement_status || 'Unsettled'}
                  </span>
                } />
                <div className="responsive-grid" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
                    <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>Collection Total</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A' }}>₹{(booking?.collection_total || 0).toLocaleString()}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                    <div style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase' }}>My Amount</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A' }}>₹{(booking?.my_amount || 0).toLocaleString()}</div>
                  </div>
                </div>
                
                <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '1rem' }}>
                  <DataRow label="Pending Recovery" value={`₹${(booking?.pending_recovery_amount || 0).toLocaleString()}`} valueColor={booking?.pending_recovery_amount > 0 ? '#DC2626' : '#64748B'} isBold={booking?.pending_recovery_amount > 0} />
                  <DataRow label="Vendor Payable" value={`₹${(booking?.driver_ownership !== 'Our Driver' ? booking?.payable_amount : 0 || 0).toLocaleString()}`} valueColor={booking?.payable_amount > 0 ? '#D97706' : '#64748B'} isBold={booking?.payable_amount > 0} />
                  <DataRow label="Driver Payable" value={`₹${(booking?.driver_ownership === 'Our Driver' ? booking?.payable_amount : 0 || 0).toLocaleString()}`} valueColor={booking?.payable_amount > 0 ? '#D97706' : '#64748B'} isBold={booking?.payable_amount > 0} />
                  <DataRow label="Receivable Amount" value={`₹${(booking?.receivable_amount || 0).toLocaleString()}`} valueColor={booking?.receivable_amount > 0 ? '#2563EB' : '#64748B'} isBold={booking?.receivable_amount > 0} />
                  <DataRow label="Extra Collection" value={`₹${(booking?.extra_collection_amount || 0).toLocaleString()}`} valueColor={booking?.extra_collection_amount > 0 ? '#2563EB' : '#64748B'} isBold={booking?.extra_collection_amount > 0} />
                </div>
              </Card>

              {/* Trip Expense Breakdown Card */}
              <Card>
                <CardHeader icon={Calculator} title="Trip Expense Breakdown" rightElement={<span style={{ fontWeight: '700', color: '#DC2626', fontSize: '1.1rem', background: '#FEF2F2', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>Total: ₹{(booking?.total_trip_expenses || 0).toLocaleString()}</span>} />
                <div className="responsive-grid" style={{ gap: '1rem' }}>
                  <DataRow label="CNG" value={`₹${(booking?.expense_cng || 0).toLocaleString()}`} />
                  <DataRow label="Petrol Filled" value={`₹${(booking?.expense_petrol_filled || 0).toLocaleString()}`} />
                  <DataRow label="Petrol Running KM" value={`₹${(booking?.expense_petrol_running_km || 0).toLocaleString()}`} />
                  <DataRow label="Toll" value={`₹${(booking?.expense_toll || 0).toLocaleString()}`} />
                  <DataRow label="State Tax" value={`₹${(booking?.expense_state_tax || 0).toLocaleString()}`} />
                  <DataRow label="Parking" value={`₹${(booking?.expense_parking || 0).toLocaleString()}`} />
                  <DataRow label="Food" value={`₹${(booking?.expense_food || 0).toLocaleString()}`} />
                  <DataRow label="Driver Advance" value={`₹${(booking?.expense_driver_advance || 0).toLocaleString()}`} />
                  <DataRow label="Other" value={`₹${(booking?.expense_other || 0).toLocaleString()}`} />
                </div>
              </Card>

              {/* Booking Timeline Card */}
              <Card>
                <CardHeader icon={Clock} title="Booking Timeline" />
                <div style={{ marginTop: '1rem', marginLeft: '0.5rem' }}>
                  <TimelineItem title="Booking Created" active={true} date={new Date(booking?.created_at).toLocaleString()} />
                  <TimelineItem title="Driver Assigned" active={isDriverAssigned} date={isDriverAssigned ? 'Driver assigned to trip' : 'Awaiting assignment'} />
                  <TimelineItem title="Trip Started" active={isTripStarted} date={isTripStarted ? 'Trip is in progress' : 'Awaiting start'} />
                  <TimelineItem title="Trip Completed" active={isTripCompleted} date={isTripCompleted ? 'Trip has been completed' : 'Pending completion'} />
                  <TimelineItem title="Review Pending" active={isReviewDone} date={isReviewDone ? `Status: ${booking?.review_status}` : 'Pending review submission'} />
                </div>
              </Card>

              {/* Ledger Impact Card */}
              <Card>
                <CardHeader icon={FileSpreadsheet} title="Ledger Impact Preview" />
                <div className="responsive-grid" style={{ gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#166534', background: '#F0FDF4', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><CheckCircle2 size={14} /> Booking Ledger</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#166534', background: '#F0FDF4', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><CheckCircle2 size={14} /> Customer Sheet</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#166534', background: '#F0FDF4', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><CheckCircle2 size={14} /> Driver Sheet</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: booking?.source_category !== 'Direct' ? '#166534' : '#94A3B8', background: booking?.source_category !== 'Direct' ? '#F0FDF4' : '#F8FAFC', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><CheckCircle2 size={14} /> Vendor Sheet</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: booking?.total_trip_expenses > 0 ? '#166534' : '#94A3B8', background: booking?.total_trip_expenses > 0 ? '#F0FDF4' : '#F8FAFC', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><CheckCircle2 size={14} /> Expense Ledger</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#166534', background: '#F0FDF4', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><CheckCircle2 size={14} /> Profit Tracker</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: ((booking?.pending_recovery_amount || 0) + (booking?.pending_extra_collection || 0)) > 0 ? '#DC2626' : '#94A3B8', background: ((booking?.pending_recovery_amount || 0) + (booking?.pending_extra_collection || 0)) > 0 ? '#FEF2F2' : '#F8FAFC', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><AlertCircle size={14} /> Recovery Ledger</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: booking?.payable_amount > 0 ? '#D97706' : '#94A3B8', background: booking?.payable_amount > 0 ? '#FFFBEB' : '#F8FAFC', padding: '0.5rem', borderRadius: '6px', fontWeight: '600' }}><AlertCircle size={14} /> Payment Ledger</div>
                </div>
              </Card>

              {/* Notes & Review Card */}
              <Card>
                <CardHeader icon={ShieldAlert} title="Notes & Post-Trip Review" />
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Special Instructions / Notes</div>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', color: '#334155', minHeight: '80px', lineHeight: '1.5' }}>
                    {booking?.notes || 'No special instructions recorded for this booking.'}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#F1F5F9', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Review Method</span>
                    <span style={{ fontWeight: '700', color: '#0F172A', marginTop: '0.2rem' }}>{booking?.review_method || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Rating</span>
                    <span style={{ fontWeight: '700', color: '#0F172A', marginTop: '0.2rem' }}>{booking?.rating ? `${booking.rating}/5` : 'Not Rated'}</span>
                  </div>
                </div>
                <DataRow label="Review Received" value={booking?.review_received ? 'Yes' : 'No'} />
                <DataRow label="Follow Up Required" value={booking?.follow_up_required ? 'Yes' : 'No'} valueColor={booking?.follow_up_required ? '#DC2626' : undefined} />
                {booking?.review_url && <DataRow label="Review Link" value={<a href={booking.review_url} target="_blank" rel="noreferrer" style={{color:'#3B82F6'}}>View Review</a>} />}
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {actionModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#EFF6FF', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem', color: '#3B82F6' }}>
              <CheckCircle2 size={30} />
            </div>
            <h2 style={{ margin: '0 0 0.5rem', color: '#0F172A', fontSize: '1.25rem' }}>{actionModal}</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              This feature is currently under development and will be available in the next release update.
            </p>
            <button onClick={() => setActionModal(null)} style={{ background: '#0F172A', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingDetail;
