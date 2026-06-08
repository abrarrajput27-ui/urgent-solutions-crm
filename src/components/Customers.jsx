import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { supabase } from '../lib/supabaseClient';
import { Search, Plus, Eye, Loader2, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../dashboard.css';

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.mobile && c.mobile.includes(searchTerm)) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        
        <div className="dashboard-content" style={{ padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={24} color="#3B82F6" /> Customer Master
            </h2>
          </div>

          {/* Filters Bar */}
          <div className="filters-container" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="filter-item search-item" style={{ flex: 1, position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text" 
                placeholder="Search by Name, Mobile, Email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>
            <button 
              onClick={() => {
                // Future enhancement: Create customer standalone
                alert("Create customer standalone from here coming soon. Customers are auto-created currently via New Booking.");
              }} 
              className="btn-modal-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
            >
              <Plus size={16} /> New Customer
            </button>
          </div>

          {/* Table Area */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                <Loader2 size={32} className="lucide-spin" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                Loading customers...
              </div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#DC2626', background: '#FEF2F2' }}>
                Error fetching data: {error}. Please ensure the `customers` table exists.
              </div>
            ) : (
              <>
              <div className="all-bookings-table-wrapper all-bookings-desktop" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Name</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Mobile</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600', textAlign: 'center' }}>Total Trips</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Total Revenue</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Rating</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Added On</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>
                          No customers found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s', ':hover': { background: '#F8FAFC' } }}>
                          <td style={{ padding: '1rem', fontWeight: '600', color: '#0B192C' }}>{c.name}</td>
                          <td style={{ padding: '1rem', color: '#334155' }}>
                            <div style={{ fontWeight: '600' }}>{c.mobile}</div>
                            {c.alternate_mobile && <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Alt: {c.alternate_mobile}</div>}
                          </td>
                          <td style={{ padding: '1rem', color: '#64748B' }}>{c.email || 'N/A'}</td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <span style={{ background: '#E0E7FF', color: '#4338CA', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                              {c.total_bookings}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#16A34A', fontWeight: '700' }}>₹{Number(c.total_revenue || 0).toLocaleString()}</td>
                          <td style={{ padding: '1rem', color: '#F59E0B', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <Star size={14} fill="#F59E0B" /> {Number(c.rating || 5).toFixed(1)}
                          </td>
                          <td style={{ padding: '1rem', color: '#94A3B8', fontSize: '0.75rem' }}>
                            {new Date(c.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                              <button 
                                onClick={() => navigate(`/customers/${c.id}`)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', transition: 'color 0.2s' }} 
                                title="View Customer Profile"
                              >
                                <Eye size={18} />
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
                {filteredCustomers.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                    No customers found matching your search.
                  </div>
                ) : (
                  filteredCustomers.map((c) => (
                    <div key={c.id} style={{ background: 'white', borderRadius: '12px', padding: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: '700', color: '#0B192C', fontSize: '1.1rem' }}>{c.name}</div>
                          <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.2rem' }}>{c.mobile}</div>
                        </div>
                        <span style={{ 
                          background: '#E0E7FF', color: '#4338CA', 
                          padding: '0.25rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                          display: 'flex', alignItems: 'center', gap: '0.3rem'
                        }}>
                          <Star size={12} fill="#4338CA" /> {Number(c.rating || 5).toFixed(1)}
                        </span>
                      </div>
                      
                      <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', textAlign: 'center' }}>
                        <div>
                          <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700' }}>Trips</div>
                          <div style={{ fontWeight: '700', color: '#0F172A' }}>{c.total_bookings}</div>
                        </div>
                        <div style={{ borderLeft: '1px solid #E2E8F0' }}>
                          <div style={{ color: '#94A3B8', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '700' }}>Total Revenue</div>
                          <div style={{ fontWeight: '800', color: '#16A34A' }}>₹{Number(c.total_revenue || 0).toLocaleString()}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => navigate(`/customers/${c.id}`)}
                          style={{ flex: 1, background: '#0B192C', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Eye size={16} /> View Profile
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

export default Customers;
