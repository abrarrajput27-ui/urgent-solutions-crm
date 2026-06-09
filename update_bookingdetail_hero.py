import sys
with open('src/components/BookingDetail.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_hero = '''{/* Premium Header Card */}
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
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Net Profit Generated</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4ADE80' }}>?{(booking?.profit || 0).toLocaleString()}</div>
            </div>
          </div>'''

new_hero = '''{/* Premium Header Card - Redesigned Mobile First */}
          <div className="hide-on-print premium-header-wrapper" style={{ background: 'linear-gradient(135deg, #0B192C 0%, #1a365d 100%)', borderRadius: '16px', padding: '1.5rem', color: 'white', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(11,25,44,0.15)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Route as Title */}
              <div style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1.2', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                <span>{booking?.pickup_location || 'Not Set'}</span>
                <ArrowRight size={24} color="#94A3B8" style={{ flexShrink: 0 }} />
                <span>{booking?.drop_location || 'Not Set'}</span>
              </div>

              {/* ID and Status */}
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#E2E8F0', letterSpacing: '0.5px' }}>{booking?.booking_id}</span>
                <span style={{ background: statusStyle.bg, color: statusStyle.text, padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
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

              {/* Date & Time */}
              <div style={{ color: '#94A3B8', fontSize: '0.95rem', fontWeight: '500', marginTop: '0.2rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} /> 
                  {booking?.pickup_datetime ? new Date(booking?.pickup_datetime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Time not set'}
                </span>
              </div>

              {/* Net Profit (Desktop visible, scaled for mobile) */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Net Profit</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#4ADE80' }}>?{(booking?.profit || 0).toLocaleString()}</div>
              </div>
            </div>
          </div>'''

content = content.replace(old_hero, new_hero)

with open('src/components/BookingDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated BookingDetail Hero")
