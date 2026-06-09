import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Briefcase, 
  Car, 
  Wallet, 
  Banknote, 
  CreditCard, 
  CalendarDays, 
  ShieldAlert, 
  FileText, 
  BellRing, 
  Settings, 
  UserCog, 
  LogOut,
  PlusCircle,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} />, active: location.pathname === '/' },
    { name: 'Leads', path: '/leads', icon: <UserCog size={18} />, active: location.pathname === '/leads' },
    { name: 'Bookings', path: '/coming-soon?module=Bookings', icon: <BookOpen size={18} /> },
    { name: 'Customers', path: '/coming-soon?module=Customers', icon: <Users size={18} /> },
    { name: 'Drivers', path: '/coming-soon?module=Drivers', icon: <Car size={18} /> },
    { name: 'Vendors', path: '/coming-soon?module=Vendors', icon: <Briefcase size={18} /> },
    { name: 'Finance', path: '/coming-soon?module=Finance', icon: <Wallet size={18} /> },
    { name: 'Reports', path: '/coming-soon?module=Reports', icon: <FileText size={18} /> },
    { name: 'Settings', path: '/coming-soon?module=Settings', icon: <Settings size={18} /> },
  ];

  return (
    <>
      <div className="sidebar-overlay" onClick={() => document.body.classList.remove('sidebar-open')}></div>
      <div className="sidebar">
        
        <div className="sidebar-brand">
          <div className="sidebar-logo-svg">
          <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0C22.4 0 0 22.4 0 50C0 85 50 120 50 120C50 120 100 85 100 50C100 22.4 77.6 0 50 0Z" fill="#F1F5F9"/>
            <circle cx="50" cy="45" r="30" fill="#0B192C"/>
            <path d="M50 20C36.2 20 25 31.2 25 45C25 58.8 36.2 70 50 70C63.8 70 75 58.8 75 45C75 31.2 63.8 20 50 20ZM50 26C60.5 26 69 34.5 69 45H53.5V36.5H46.5V45H31C31 34.5 39.5 26 50 26ZM46.5 64V55.5H53.5V64C43.5 63.5 35 57 32 48H42L46.5 53.5L50 50L53.5 53.5L58 48H68C65 57 56.5 63.5 46.5 64Z" fill="#00C853"/>
          </svg>
        </div>
        <div className="sidebar-brand-text">
          <div className="sidebar-logo-title">Urgent<span>Solutions</span></div>
          <div className="sidebar-logo-subtitle">A Unit of Urgent Taxis</div>
        </div>
        <button 
          onClick={() => document.body.classList.remove('sidebar-open')}
          style={{ background: 'none', border: 'none', color: '#94A3B8', marginLeft: 'auto', cursor: 'pointer' }}
          className="mobile-close-btn"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={`menu-item ${item.active ? 'active' : ''}`}
            onClick={() => {
              if (item.path) {
                navigate(item.path);
                document.body.classList.remove('sidebar-open');
              }
            }}
            style={{ cursor: item.path ? 'pointer' : 'default' }}
          >
            <div className="menu-item-left">
              {item.icon}
              <span>{item.name}</span>
            </div>
            {item.badge ? (
              <div className="menu-badge">{item.badge}</div>
            ) : (
              !item.active && <span style={{ fontSize: '10px' }}>❯</span>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer" style={{ padding: '20px', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            <UserCog size={18} color="#64748B" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0B192C' }}>Admin</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>System Administrator</div>
          </div>
        </div>
        <button className="logout-btn" onClick={() => {
          sessionStorage.removeItem('adminAuth');
          navigate('/login');
          document.body.classList.remove('sidebar-open');
        }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', fontSize: '14px', fontWeight: 500 }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
      
    </div>
    </>
  );
};

export default Sidebar;
