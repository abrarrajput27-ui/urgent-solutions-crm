import sys
with open('src/components/AllBookings.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Vehicle Section
old_vehicle = '''{/* ROW 4: Vehicle Section */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                          <div style={{ width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#F1F5F9', flexShrink: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                            <img src={getVehicleImage(b.service_vehicle_type)} alt={b.service_vehicle_type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.service_vehicle_type || 'Unassigned'}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>{b.vehicle_number || 'No Vehicle No.'}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><User size={12} style={{verticalAlign: 'middle', marginRight: '4px'}}/> {b.driver_name || 'No Driver'}</div>
                          </div>
                        </div>'''

new_vehicle = '''{/* ROW 4: Vehicle Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #F1F5F9' }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}><Car size={14} color="#64748B"/> {b.service_vehicle_type || 'Unassigned'}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>{b.vehicle_number || 'No Vehicle No.'}</div>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} color="#64748B"/> Driver</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.driver_name || 'No Driver'}</div>
                            {b.driver_mobile && <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.1rem' }}>{b.driver_mobile}</div>}
                          </div>
                        </div>'''

content = content.replace(old_vehicle, new_vehicle)

# 2. Financial Summary to 2x2 Grid
old_financial = '''{/* ROW 5: Financial Summary */}
                        <div className="responsive-grid-3" style={{ display: "grid", gap: "0.75rem", marginBottom: "1.5rem" }}>
                          <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>My Amount</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>?{b.my_amount?.toLocaleString() || 0}</div>
                          </div>
                          <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Expenses</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#DC2626' }}>?{b.total_trip_expenses?.toLocaleString() || 0}</div>
                          </div>
                          <div style={{ background: b.profit < 0 ? '#FEF2F2' : '#F0FDF4', padding: '0.75rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: b.profit < 0 ? '#991B1B' : '#166534', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Profit</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: b.profit < 0 ? '#DC2626' : '#16A34A' }}>?{b.profit?.toLocaleString() || 0}</div>
                          </div>
                        </div>'''

new_financial = '''{/* ROW 5: Financial Summary */}
                        <div className="responsive-grid-2x2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
                          <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>My Amount</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>?{b.my_amount?.toLocaleString() || 0}</div>
                          </div>
                          <div style={{ background: b.profit < 0 ? '#FEF2F2' : '#F0FDF4', padding: '0.75rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: b.profit < 0 ? '#991B1B' : '#166534', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Profit</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: b.profit < 0 ? '#DC2626' : '#16A34A' }}>?{b.profit?.toLocaleString() || 0}</div>
                          </div>
                          <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Expenses</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#DC2626' }}>?{b.total_trip_expenses?.toLocaleString() || 0}</div>
                          </div>
                          <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Collection</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>?{(b.total_collection || 0).toLocaleString()}</div>
                          </div>
                        </div>'''

content = content.replace(old_financial, new_financial)

# 3. Customer & Source
old_cust = '''{/* ROW 6 & 7: Customer & Source */}
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
                        </div>'''

new_cust = '''{/* ROW 6 & 7: Customer & Source */}
                        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: '#F8FAFC', padding: '1rem', borderRadius: '12px' }}>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '700', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>?? Customer</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>{b.customer_name || 'N/A'}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.1rem' }}>{b.customer_mobile || 'N/A'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '700', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>?? Source</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>{b.source_category || b.booking_source || 'N/A'}</div>
                            {b.source_category !== b.booking_source && <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.1rem' }}>{b.booking_source}</div>}
                          </div>
                        </div>'''

content = content.replace(old_cust, new_cust)

# 4. Action Buttons (Make them inline compact)
old_actions = '''{/* ROW 8: Actions */}
                        <div className="action-buttons-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "0.5rem", marginTop: "auto", width: "100%", overflowWrap: "anywhere" }}>
                          <button 
                            onClick={() => navigate(/bookings/)}
                            style={{ flex: 1, background: '#EFF6FF', color: '#2563EB', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                          >
                            <Eye size={16} /> View
                          </button>
                          
                          {activeTab === 'All' ? (
                            <>
                              <button 
                                onClick={() => navigate(/bookings//edit)}
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
                        </div>'''

new_actions = '''{/* ROW 8: Actions */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1rem', flexWrap: 'wrap' }}>
                          <button onClick={() => navigate(/bookings/)} style={{ background: 'transparent', color: '#2563EB', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                            <Eye size={16} /> View
                          </button>
                          <span style={{ color: '#CBD5E1' }}>|</span>
                          {activeTab === 'All' ? (
                            <>
                              <button onClick={() => navigate(/bookings//edit)} style={{ background: 'transparent', color: '#D97706', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <Edit3 size={16} /> Edit
                              </button>
                              <span style={{ color: '#CBD5E1' }}>|</span>
                              <button onClick={() => handleDelete(b.id)} style={{ background: 'transparent', color: '#DC2626', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <Trash2 size={16} /> Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleRestore(b.id)} style={{ background: 'transparent', color: '#16A34A', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                Restore
                              </button>
                              <span style={{ color: '#CBD5E1' }}>|</span>
                              <button onClick={() => handleDelete(b.id)} style={{ background: 'transparent', color: '#DC2626', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <Trash2 size={16} /> Delete
                              </button>
                            </>
                          )}
                        </div>'''

content = content.replace(old_actions, new_actions)

with open('src/components/AllBookings.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AllBookings.jsx")
