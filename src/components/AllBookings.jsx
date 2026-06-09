import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { supabase } from '../lib/supabaseClient';
import { Search, Filter, Eye, Loader2, FileText, Download, Trash2, Edit3, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';

const getVehicleImage = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('sedan')) return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80';
  if (cat.includes('suv')) return 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=300&q=80';
  if (cat.includes('crysta') || cat.includes('ertiga') || cat.includes('innova')) return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=300&q=80';
  if (cat.includes('tempo') || cat.includes('traveller') || cat.includes('van')) return 'https://images.unsplash.com/photo-1566472856447-19e9842a2754?auto=format&fit=crop&w=300&q=80';
  return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=300&q=80'; // fallback
};

const AllBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Trash'

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      
      if (activeTab === 'Trash') {
        query = query.eq('is_deleted', true);
      } else {
        query = query.or('is_deleted.is.null,is_deleted.eq.false');
      }

      const { data, error } = await query;
      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedBookings = [...bookings].filter(b => {
    const matchesSearch = 
      (b.booking_id && b.booking_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.customer_mobile && b.customer_mobile.includes(searchTerm));
    
    const matchesSource = sourceFilter ? (b.source_category === sourceFilter || b.booking_source === sourceFilter) : true;
    const matchesStatus = statusFilter ? b.booking_status === statusFilter : true;

    return matchesSearch && matchesSource && matchesStatus;
  }).sort((a, b) => {
    const dateA = new Date(a.pickup_datetime || a.created_at).getTime();
    const dateB = new Date(b.pickup_datetime || b.created_at).getTime();
    return dateB - dateA;
  });

  const exportToCSV = () => {
    if (sortedBookings.length === 0) return;
    
    const headers = ['Booking ID', 'Date', 'Customer Name', 'Mobile', 'Source', 'Vehicle Type', 'My Amount', 'Expenses', 'Profit', 'Status'];
    const csvRows = [headers.join(',')];
    
    sortedBookings.forEach(b => {
      const row = [
        b.booking_id,
        b.booking_date,
        `"${b.customer_name || ''}"`,
        b.customer_mobile,
        b.source_category || b.booking_source,
        b.service_vehicle_type,
        b.my_amount || 0,
        b.total_trip_expenses || 0,
        b.profit || 0,
        b.booking_status || 'Pending'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_export_${new Date().getTime()}.csv`;
    a.click();
  };

  const handleDelete = async (id) => {
    if (activeTab === 'Trash') {
      if (window.confirm("Are you sure you want to PERMANENTLY delete this booking? This action cannot be undone.")) {
        try {
          const { error } = await supabase.from('bookings').delete().eq('id', id);
          if (error) throw error;
          setBookings(bookings.filter(b => b.id !== id));
        } catch (err) {
          alert("Failed to delete booking: " + err.message);
        }
      }
    } else {
      if (window.confirm("Move this booking to Trash?")) {
        try {
          const { error } = await supabase.from('bookings').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
          if (error) throw error;
          setBookings(bookings.filter(b => b.id !== id));
          alert("Booking moved to Trash.");
        } catch (err) {
          alert("Failed to trash booking: " + err.message);
        }
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      const { error } = await supabase.from('bookings').update({ is_deleted: false, deleted_at: null }).eq('id', id);
      if (error) throw error;
      setBookings(bookings.filter(b => b.id !== id));
      alert("Booking restored.");
    } catch (err) {
      alert("Failed to restore booking: " + err.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        
        <div className="dashboard-content" style={{ padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: 0 }}>All Bookings</h2>
            <button onClick={exportToCSV} className="btn-modal-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              <Download size={16} /> Export to CSV
            </button>
          </div>

          {/* Tabs UI */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setActiveTab('All')}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'All' ? 'var(--primary-navy)' : '#E2E8F0', color: activeTab === 'All' ? 'white' : '#475569', fontWeight: '600', cursor: 'pointer' }}
            >
              All Bookings
            </button>
            <button 
              onClick={() => setActiveTab('Trash')}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: activeTab === 'Trash' ? '#EF4444' : '#E2E8F0', color: activeTab === 'Trash' ? 'white' : '#475569', fontWeight: '600', cursor: 'pointer' }}
            >
              Trash
            </button>
          </div>

          {/* Filters Bar */}
          <div className="filters-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="filter-item search-item" style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                placeholder="Search by ID, Name, Mobile..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>
            
            <div className="filter-item" style={{ width: '200px' }}>
              <select 
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'white' }}
              >
                <option value="">All Sources</option>
                <option value="Direct">Direct</option>
                <option value="Savaari">Savaari</option>
                <option value="Group">Group</option>
                <option value="Vendor">Vendor</option>
                <option value="Taxi Sanchalak">Taxi Sanchalak</option>
                <option value="MYF">MYF / Commission</option>
              </select>
            </div>

            <div className="filter-item" style={{ width: '200px' }}>
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 1rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'white' }}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Cards Area */}
          <div style={{ borderRadius: '12px', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B', background: 'white', borderRadius: '12px' }}>
                <Loader2 size={32} className="lucide-spin" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                Loading bookings...
              </div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#DC2626', background: '#FEF2F2', borderRadius: '12px' }}>
                Error fetching data: {error}
              </div>
            ) : sortedBookings.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', background: 'white', borderRadius: '12px' }}>
                No bookings found matching your criteria.
              </div>
            ) : (
              <div className="bookings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem', width: '100%' }}>
                {sortedBookings.map((b) => (
                  <div key={b.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* ROW 1: ID & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0B192C' }}>{b.booking_id}</span>
                      <span style={{ 
                        background: b.booking_status === 'Confirmed' ? '#EFF6FF' : b.booking_status === 'Completed' ? '#F0FDF4' : b.booking_status === 'Cancelled' ? '#FEF2F2' : '#FFF7ED', 
                        color: b.booking_status === 'Confirmed' ? '#2563EB' : b.booking_status === 'Completed' ? '#16A34A' : b.booking_status === 'Cancelled' ? '#DC2626' : '#EA580C', 
                        padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' 
                      }}>
                        {b.booking_status || 'Pending'}
                      </span>
                    </div>

                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      
                      {/* ROW 2: Route */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', lineHeight: '1.3' }}>{b.pickup_location || 'Not Set'}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#CBD5E1', flexShrink: 0 }}>
                          <ArrowRight size={24} color="#94A3B8" />
                        </div>
                        <div style={{ flex: 1, fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', lineHeight: '1.3', textAlign: 'right' }}>{b.drop_location || 'Not Set'}</div>
                      </div>

                      {/* ROW 3: Date & Time */}
                      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Pickup</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>
                            {b.pickup_datetime ? new Date(b.pickup_datetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : (b.booking_date || 'N/A')}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Created</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155' }}>
                            {new Date(b.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </div>
                        </div>
                      </div>

                      {/* ROW 4: Vehicle Section */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                          <img src={getVehicleImage(b.service_vehicle_type)} alt={b.service_vehicle_type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.service_vehicle_type || 'Unassigned'}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>{b.vehicle_number || 'No Vehicle No.'}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><User size={12} style={{verticalAlign: 'middle', marginRight: '4px'}}/> {b.driver_name || 'No Driver'}</div>
                        </div>
                      </div>

                      {/* ROW 5: Financial Summary */}
                      <div className="responsive-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>My Amount</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>₹{b.my_amount?.toLocaleString() || 0}</div>
                        </div>
                        <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Expenses</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#DC2626' }}>₹{b.total_trip_expenses?.toLocaleString() || 0}</div>
                        </div>
                        <div style={{ background: b.profit < 0 ? '#FEF2F2' : '#F0FDF4', padding: '0.75rem', borderRadius: '10px' }}>
                          <div style={{ fontSize: '0.7rem', color: b.profit < 0 ? '#991B1B' : '#166534', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Profit</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '800', color: b.profit < 0 ? '#DC2626' : '#16A34A' }}>₹{b.profit?.toLocaleString() || 0}</div>
                        </div>
                      </div>

                      {/* ROW 6 & 7: Customer & Source */}
                      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Customer</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>{b.customer_name || 'N/A'}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.1rem' }}>{b.customer_mobile || 'N/A'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Source</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#334155' }}>{b.source_category || b.booking_source || 'N/A'}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.1rem' }}>{b.booking_source || 'N/A'}</div>
                        </div>
                      </div>

                      {/* ROW 9: Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {b.trip_type && <span style={{ background: '#F1F5F9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{b.trip_type}</span>}
                        {b.service_vehicle_type && <span style={{ background: '#F1F5F9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{b.service_vehicle_type}</span>}
                        {b.collection_mode && <span style={{ background: '#F1F5F9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>{b.collection_mode}</span>}
                      </div>

                      {/* ROW 8: Actions */}
                      <div className="action-buttons-grid" style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button 
                          onClick={() => navigate(`/bookings/${b.id}`)}
                          style={{ flex: 1, background: '#EFF6FF', color: '#2563EB', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                        >
                          <Eye size={16} /> View
                        </button>
                        
                        {activeTab === 'All' ? (
                          <>
                            <button 
                              onClick={() => navigate(`/bookings/${b.id}/edit`)}
                              style={{ flex: 1, background: '#FFFBEB', color: '#D97706', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                            >
                              <Edit3 size={16} /> Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(b.id)}
                              style={{ flex: 1, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleRestore(b.id)}
                              style={{ flex: 1, background: '#F0FDF4', color: '#16A34A', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                            >
                              Restore
                            </button>
                            <button 
                              onClick={() => handleDelete(b.id)}
                              style={{ flex: 1, background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
