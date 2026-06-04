import React from 'react';
import { Search, Bell, Wallet, CalendarDays } from 'lucide-react';

const TopNav = () => {
  return (
    <div className="topnav">
      
      <div className="topnav-left">
        <div className="topnav-title">Dashboard</div>
        <div className="topnav-subtitle">Welcome back, <span>Admin</span> 👋</div>
      </div>

      <div className="topnav-right">
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search anything..." />
          <span className="search-shortcut">Ctrl + K</span>
        </div>

        <div className="nav-actions">
          <div className="nav-icon-btn">
            <Bell size={18} />
            <div className="nav-badge">3</div>
          </div>
          
          <div className="nav-stat">
            <div className="nav-stat-icon" style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <Wallet size={20} />
            </div>
            <div className="nav-stat-info">
              <span className="nav-stat-label">Pending Recoveries</span>
              <span className="nav-stat-value">12</span>
            </div>
          </div>

          <div className="nav-stat">
            <div className="nav-stat-icon" style={{ background: '#FEF08A', color: '#CA8A04' }}>
              <CalendarDays size={20} />
            </div>
            <div className="nav-stat-info">
              <span className="nav-stat-label">Pending Reminders</span>
              <span className="nav-stat-value">5</span>
            </div>
          </div>
        </div>

        <div className="nav-profile">
          <div className="avatar">A</div>
          <div className="profile-info">
            <span className="profile-name">Admin</span>
            <span className="profile-role">Super Admin</span>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default TopNav;
