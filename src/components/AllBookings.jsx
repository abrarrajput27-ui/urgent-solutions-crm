import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { supabase } from '../lib/supabaseClient';
import { Search, Filter, Eye, Loader2, FileText, Download, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';

const AllBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      (b.booking_id && b.booking_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (b.customer_mobile && b.customer_mobile.includes(searchTerm));
    
    const matchesSource = sourceFilter ? b.booking_source === sourceFilter : true;
    const matchesStatus = statusFilter ? b.booking_status === statusFilter : true;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const exportToCSV = () => {
    if (filteredBookings.length === 0) return;
    
    const headers = ['Booking ID', 'Date', 'Customer Name', 'Mobile', 'Source', 'Vehicle Type', 'My Amount', 'Expenses', 'Profit', 'Status'];
    const csvRows = [headers.join(',')];
    
    filteredBookings.forEach(b => {
      const row = [
        b.booking_id,
        b.booking_date,
        `"${b.customer_name || ''}"`,
        b.customer_mobile,
        b.booking_source,
        b.service_vehicle_type,
        b.my_amount || 0,
        b.total_trip_expenses || 0,
        b.profit || 0,
        b.booking_status || 'Pending'
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings_export_${new Date().getTime()}.csv`;
    a.click();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        const { error } = await supabase.from('bookings').delete().eq('id', id);
        if (error) throw error;
        setBookings(bookings.filter(b => b.id !== id));
      } catch (err) {
        alert("Failed to delete booking: " + err.message);
      }
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

          {/* Table Area */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                <Loader2 size={32} className="lucide-spin" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                Loading bookings...
              </div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#DC2626', background: '#FEF2F2' }}>
                Error fetching data: {error}
              </div>
            ) : (
              <>
              <div className="all-bookings-table-wrapper all-bookings-desktop" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Booking ID</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Customer</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Mobile</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Route</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Source</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Vehicle Type</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>My Amt</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Expenses</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Profit</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Recovery</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Created At</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="14" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                          No bookings found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id || b.booking_id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s', ':hover': { background: '#F8FAFC' } }}>
                          <td data-label="Booking ID" style={{ padding: '1rem', fontWeight: '600', color: '#0B192C' }}>{b.booking_id}</td>
                          <td data-label="Date" style={{ padding: '1rem', color: '#64748B' }}>{b.booking_date}</td>
                          <td data-label="Customer" style={{ padding: '1rem', fontWeight: '500' }}>{b.customer_name || 'N/A'}</td>
                          <td data-label="Mobile" style={{ padding: '1rem', color: '#64748B' }}>{b.customer_mobile || 'N/A'}</td>
                          <td data-label="Route" style={{ padding: '1rem', color: '#64748B', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.route || 'N/A'}</td>
                          <td data-label="Source" style={{ padding: '1rem' }}>
                            <span style={{ background: '#E0E7FF', color: '#4338CA', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                              {b.booking_source}
                            </span>
                          </td>
                          <td data-label="Vehicle Type" style={{ padding: '1rem', color: '#64748B' }}>{b.service_vehicle_type}</td>
                          <td data-label="My Amt" style={{ padding: '1rem', fontWeight: '600' }}>₹{b.my_amount?.toLocaleString() || 0}</td>
                          <td data-label="Expenses" style={{ padding: '1rem', color: '#DC2626' }}>₹{b.total_trip_expenses?.toLocaleString() || 0}</td>
                          <td data-label="Profit" style={{ padding: '1rem', color: '#16A34A', fontWeight: '700' }}>₹{b.profit?.toLocaleString() || 0}</td>
                          <td data-label="Recovery" style={{ padding: '1rem', color: '#EA580C' }}>{b.pending_recovery_amount > 0 ? `₹${b.pending_recovery_amount.toLocaleString()}` : '-'}</td>
                          <td data-label="Status" style={{ padding: '1rem' }}>
                            <span style={{ 
                              background: b.booking_status === 'Confirmed' ? '#DCFCE7' : b.booking_status === 'Completed' ? '#DBEAFE' : b.booking_status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7', 
                              color: b.booking_status === 'Confirmed' ? '#166534' : b.booking_status === 'Completed' ? '#1E40AF' : b.booking_status === 'Cancelled' ? '#991B1B' : '#92400E', 
                              padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' 
                            }}>
                              {b.booking_status || 'Pending'}
                            </span>
                          </td>
                          <td data-label="Created At" style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.75rem' }}>
                            {new Date(b.created_at).toLocaleDateString()}
                          </td>
                          <td data-label="Action" style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                              <button 
                                onClick={() => navigate(`/bookings/${b.id}`)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', transition: 'color 0.2s' }} 
                                title="View"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => navigate(`/bookings/${b.id}/edit`)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', transition: 'color 0.2s' }} 
                                title="Edit"
                              >
                                <Edit3 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(b.id)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', transition: 'color 0.2s' }} 
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="all-bookings-mobile">
                {filteredBookings.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                    No bookings found matching your search.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div key={b.id || b.booking_id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0B192C', fontSize: '1.1rem' }}>{b.booking_id}</div>
                          <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.2rem' }}>{b.booking_date}</div>
                        </div>
                        <span style={{ 
                          background: b.booking_status === 'Confirmed' ? '#DCFCE7' : b.booking_status === 'Completed' ? '#DBEAFE' : b.booking_status === 'Cancelled' ? '#FEE2E2' : '#FEF3C7', 
                          color: b.booking_status === 'Confirmed' ? '#166534' : b.booking_status === 'Completed' ? '#1E40AF' : b.booking_status === 'Cancelled' ? '#991B1B' : '#92400E', 
                          padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' 
                        }}>
                          {b.booking_status || 'Pending'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600' }}>Customer</div>
                          <div style={{ fontWeight: '600', color: '#334155' }}>{b.customer_name || 'N/A'}</div>
                          <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{b.customer_mobile}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '600' }}>Route</div>
                          <div style={{ fontWeight: '600', color: '#334155', wordBreak: 'break-word' }}>{b.route || 'N/A'}</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                        <div>
                          <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700' }}>My Amt</div>
                          <div style={{ fontWeight: '700', color: '#0F172A' }}>₹{b.my_amount?.toLocaleString() || 0}</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                          <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700' }}>Expenses</div>
                          <div style={{ fontWeight: '700', color: '#DC2626' }}>₹{b.total_trip_expenses?.toLocaleString() || 0}</div>
                        </div>
                        <div>
                          <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700' }}>Profit</div>
                          <div style={{ fontWeight: '800', color: '#16A34A' }}>₹{b.profit?.toLocaleString() || 0}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => navigate(`/bookings/${b.id}`)}
                          style={{ flex: 1, background: '#0B192C', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Eye size={16} /> View
                        </button>
                        <button 
                          onClick={() => navigate(`/bookings/${b.id}/edit`)}
                          style={{ flex: 1, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Edit3 size={16} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(b.id)}
                          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBookings;
