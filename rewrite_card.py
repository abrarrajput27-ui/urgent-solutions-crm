import sys

with open('src/components/AllBookings.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's extract the whole mapping block to rewrite it safely
start_str = '<div className="bookings-grid" style={{ display: "grid", gap: "1.5rem", width: "100%" }}>'
end_str = '</div>\n              )}'

if start_str in content and end_str in content:
    idx_start = content.index(start_str)
    idx_end = content.index(end_str) + len('</div>')
    
    new_card_layout = '''<div className="bookings-grid" style={{ display: "grid", gap: "1rem", width: "100%", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                  {sortedBookings.map((b) => (
                    <div key={b.id} className="booking-card" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", width: "100%", boxSizing: "border-box" }}>
                      
                      {/* TOP: Booking ID & Status */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B' }}>{b.booking_id}</span>
                        <span style={{ background: b.booking_status === 'Confirmed' ? '#EFF6FF' : b.booking_status === 'Completed' ? '#F0FDF4' : b.booking_status === 'Cancelled' ? '#FEF2F2' : '#FFF7ED', color: b.booking_status === 'Confirmed' ? '#2563EB' : b.booking_status === 'Completed' ? '#16A34A' : b.booking_status === 'Cancelled' ? '#DC2626' : '#EA580C', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                          {b.booking_status || 'Pending'}
                        </span>
                      </div>

                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        
                        {/* MAIN: Route */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', wordBreak: 'break-word' }}>{b.pickup_location || 'Not Set'}</span>
                          <ArrowRight size={18} color="#94A3B8" style={{flexShrink: 0}}/>
                          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', wordBreak: 'break-word' }}>{b.drop_location || 'Not Set'}</span>
                        </div>

                        {/* DATE */}
                        <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                          {b.pickup_datetime ? new Date(b.pickup_datetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Date not set'}
                        </div>

                        {/* VEHICLE SECTION */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', background: '#E2E8F0', flexShrink: 0 }}>
                            <img src={getVehicleImage(b.service_vehicle_type)} alt={b.service_vehicle_type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.vehicle_number || b.service_vehicle_type || 'No Vehicle'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.driver_name || 'No Driver'}</div>
                          </div>
                        </div>

                        {/* FINANCIAL SECTION */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                          <div style={{ background: '#F1F5F9', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Amount</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>?{b.my_amount?.toLocaleString() || 0}</div>
                          </div>
                          <div style={{ background: '#F1F5F9', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Expense</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#DC2626' }}>?{b.total_trip_expenses?.toLocaleString() || 0}</div>
                          </div>
                          <div style={{ background: b.profit < 0 ? '#FEF2F2' : '#F0FDF4', padding: '0.5rem', borderRadius: '6px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: b.profit < 0 ? '#991B1B' : '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Profit</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: b.profit < 0 ? '#DC2626' : '#16A34A' }}>?{b.profit?.toLocaleString() || 0}</div>
                          </div>
                        </div>

                        {/* CUSTOMER SECTION */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.customer_name || 'N/A'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{b.customer_mobile || 'N/A'}</div>
                          </div>
                        </div>

                        {/* BUTTONS */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: 'auto' }}>
                          <button onClick={() => navigate(/bookings/)} style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', padding: '0.5rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>View</button>
                          {activeTab === 'All' ? (
                            <>
                              <button onClick={() => navigate(/bookings//edit)} style={{ background: '#FFFBEB', color: '#D97706', border: 'none', padding: '0.5rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                              <button onClick={() => handleDelete(b.id)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.5rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleRestore(b.id)} style={{ background: '#F0FDF4', color: '#16A34A', border: 'none', padding: '0.5rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Restore</button>
                              <button onClick={() => handleDelete(b.id)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', padding: '0.5rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>'''
    
    content = content[:idx_start] + new_card_layout + content[idx_end:]
    
    with open('src/components/AllBookings.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Rewrote AllBookings Card Layout")
else:
    print("Could not find start/end strings")
