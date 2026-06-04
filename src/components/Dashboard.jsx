import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import '../dashboard.css';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { 
  CalendarDays, DollarSign, Wallet, ArrowUpRight, TrendingUp, TrendingDown,
  Users, UserPlus, CarFront, FileText, ChevronRight, ShieldAlert,
  ShieldCheck, Hourglass, CalendarX, FileWarning
} from 'lucide-react';

const profitData = [
  { name: 'May 1', profit: 10000 },
  { name: 'May 7', profit: 16000 },
  { name: 'May 14', profit: 24000 },
  { name: 'May 21', profit: 30000 },
  { name: 'May 28', profit: 21000 },
  { name: 'May 31', profit: 34000 },
];

const trendData = [
  { name: '1', uv: 20 }, { name: '2', uv: 10 }, { name: '3', uv: 45 }, { name: '4', uv: 15 },
  { name: '5', uv: 30 }, { name: '6', uv: 40 }, { name: '7', uv: 15 }, { name: '8', uv: 55 },
  { name: '9', uv: 10 }, { name: '10', uv: 20 }, { name: '11', uv: 40 }, { name: '12', uv: 50 },
  { name: '13', uv: 30 }, { name: '14', uv: 45 }, { name: '15', uv: 25 }, { name: '16', uv: 55 },
  { name: '17', uv: 80 }, { name: '18', uv: 55 }, { name: '19', uv: 45 }, { name: '20', uv: 65 }
];

const recoveryData = [
  { name: 'Recovered', value: 45.6, color: '#3B82F6' },
  { name: 'Pending', value: 29.7, color: '#22C55E' },
  { name: 'Overdue', value: 18.6, color: '#F97316' },
  { name: 'Partial', value: 6.1, color: '#EF4444' }
];

const vendorData = [
  { name: 'Paid', value: 48.6, color: '#3B82F6' },
  { name: 'Pending', value: 29.7, color: '#22C55E' },
  { name: 'Overdue', value: 17.7, color: '#F97316' },
  { name: 'Hold', value: 4.0, color: '#A855F7' }
];

const recentBookings = [
  { car: 'Toyota Corolla 2024', customer: 'John Smith', status: 'Approved', statusClass: 'status-approved' },
  { car: 'Honda Civic 2024', customer: 'Sarah Johnson', status: 'Pending', statusClass: 'status-pending' },
  { car: 'Suzuki Swift 2024', customer: 'Ali Khan', status: 'Approved', statusClass: 'status-approved' },
  { car: 'Honda City 2024', customer: 'Ahmed Raza', status: 'Under Review', statusClass: 'status-review' }
];

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        <TopNav />
        
        <div className="dashboard-content">
          
          {/* KPI ROW 1 */}
          <div className="row-1">
            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Total Bookings</span>
                <span className="kpi-value">128</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 18.6%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#E0E7FF', color:'#4F46E5'}}><CalendarDays size={20}/></div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Monthly Profit</span>
                <span className="kpi-value">$24,650</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 24.3%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#DCFCE7', color:'#16A34A'}}><DollarSign size={20}/></div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Total Recoveries</span>
                <span className="kpi-value">$32,450</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 15.7%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#DCFCE7', color:'#16A34A'}}><ShieldCheck size={20}/></div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Pending Recoveries</span>
                <span className="kpi-value" style={{color:'#F59E0B'}}>$12,450</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 12.5%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#FEF3C7', color:'#D97706'}}><Hourglass size={20}/></div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Outstanding Debt</span>
                <span className="kpi-value">$18,750</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 10.3%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#F3E8FF', color:'#9333EA'}}><CalendarX size={20}/></div>
            </div>
          </div>

          {/* KPI ROW 2 */}
          <div className="row-2">
            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Monthly EMI</span>
                <span className="kpi-value">$8,750</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 15.4%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#F3E8FF', color:'#9333EA'}}><Wallet size={20}/></div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Vendor Payables</span>
                <span className="kpi-value">$9,250</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 11.8%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#FFEDD5', color:'#EA580C'}}><FileWarning size={20}/></div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Customer Count</span>
                <span className="kpi-value">342</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 8.6%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#E0E7FF', color:'#4F46E5'}}><Users size={20}/></div>
            </div>

            <div className="card kpi-card">
              <div className="kpi-left">
                <span className="kpi-title">Driver Count</span>
                <span className="kpi-value">56</span>
                <div className="kpi-trend">
                  <span className="trend-up"><TrendingUp size={12}/> 7.2%</span>
                  <span className="trend-text">vs last month</span>
                </div>
              </div>
              <div className="kpi-icon" style={{background:'#CCFBF1', color:'#0D9488'}}><UserPlus size={20}/></div>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="row-3">
            <div className="card" style={{display:'flex', flexDirection:'column'}}>
              <div className="card-header">
                <span className="card-title">Monthly Profit Overview</span>
                <select className="card-select"><option>This Month</option></select>
              </div>
              <div className="chart-container">
                <ResponsiveContainer>
                  <AreaChart data={profitData}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill:'#94A3B8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill:'#94A3B8'}} tickFormatter={(val) => val/1000+'K'}/>
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{display:'flex', flexDirection:'column'}}>
              <div className="card-header">
                <span className="card-title">Booking Trend</span>
                <select className="card-select"><option>This Month</option></select>
              </div>
              <div className="chart-container">
                <ResponsiveContainer>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={false} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill:'#94A3B8'}} />
                    <RechartsTooltip cursor={{fill: 'transparent'}}/>
                    <Bar dataKey="uv" radius={[4, 4, 0, 0]}>
                      {trendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index > 10 ? '#22C55E' : '#3B82F6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.65rem', color:'#94A3B8', marginTop:'0.5rem', padding:'0 1rem'}}>
                <span>May 1</span><span>May 7</span><span>May 14</span><span>May 21</span><span>May 28</span><span>May 31</span>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent Bookings</span>
                <a href="#" className="card-action">View All</a>
              </div>
              <div className="recent-bookings-list">
                {recentBookings.map((bk, i) => (
                  <div className="booking-item" key={i}>
                    <div className="booking-item-left">
                      <div className="car-thumb" style={{background:'#F1F5F9'}}><CarFront size={28} color="#94A3B8" style={{margin:'2px'}}/></div>
                      <div className="booking-info">
                        <span className="booking-car">{bk.car}</span>
                        <span className="booking-customer">{bk.customer}</span>
                      </div>
                    </div>
                    <div className="booking-item-right">
                      <span className={`status-badge ${bk.statusClass}`}>{bk.status} <ChevronRight size={14}/></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WIDGETS ROW 1 */}
          <div className="row-4">
            <div className="card">
              <div className="card-header">
                <span className="card-title">Recovery Status</span>
              </div>
              <div style={{ width: '100%', flex: 1, display:'flex', alignItems:'center' }}>
                <ResponsiveContainer width="45%" height="100%">
                  <PieChart>
                    <Pie data={recoveryData} innerRadius={46} outerRadius={69} paddingAngle={2} dataKey="value" stroke="none">
                      {recoveryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', flex:1 }}>
                  {recoveryData.map(item => (
                    <div key={item.name} style={{fontSize:'0.65rem', display:'flex', alignItems:'center', gap:'0.4rem', color:'#64748B'}}>
                      <div style={{width:8, height:8, borderRadius:'50%', background:item.color}}></div>
                      <div><span style={{color:'#0B192C', fontWeight:600}}>{item.name}</span> <br/>${item.value}K ({item.value}%)</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Vendor Settlement</span>
              </div>
              <div style={{ width: '100%', flex: 1, display:'flex', alignItems:'center' }}>
                <ResponsiveContainer width="45%" height="100%">
                  <PieChart>
                    <Pie data={vendorData} innerRadius={46} outerRadius={69} paddingAngle={2} dataKey="value" stroke="none">
                      {vendorData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', flex:1 }}>
                  {vendorData.map(item => (
                    <div key={item.name} style={{fontSize:'0.65rem', display:'flex', alignItems:'center', gap:'0.4rem', color:'#64748B'}}>
                      <div style={{width:8, height:8, borderRadius:'50%', background:item.color}}></div>
                      <div><span style={{color:'#0B192C', fontWeight:600}}>{item.name}</span> <br/>${item.value}K ({item.value}%)</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">EMI Calendar</span>
                <span className="card-title" style={{color:'#0044FF', fontSize:'0.8rem'}}>May 2025 <ChevronRight size={14} style={{verticalAlign:'middle'}}/></span>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'0.5rem', textAlign:'center', fontSize:'0.7rem', fontWeight:600, color:'#94A3B8'}}>
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                <span>27</span><span>28</span><span>29</span><span>30</span><span>1</span><span>2</span><span>3</span>
                <span>4</span><span>5</span><span>6</span><span style={{background:'#10B981', color:'white', borderRadius:'50%', padding:'2px'}}>7</span><span>8</span><span>9</span><span>10</span>
                <span>11</span><span>12</span><span>13</span><span>14</span><span style={{background:'#10B981', color:'white', borderRadius:'50%', padding:'2px'}}>15</span><span>16</span><span>17</span>
                <span>18</span><span>19</span><span>20</span><span>21</span><span>22</span><span>23</span><span>24</span>
                <span>25</span><span style={{background:'#3B82F6', color:'white', borderRadius:'50%', padding:'2px'}}>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Upcoming Reminders</span>
                <a href="#" className="card-action">View All</a>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'0'}}>
                <div className="reminder-item">
                  <div className="reminder-left">
                    <CalendarDays size={16} className="reminder-icon"/>
                    <span className="reminder-text">EMI Due - John Smith</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <span className="reminder-date">May 25, 2025</span>
                    <span className="status-badge status-due">Due</span>
                  </div>
                </div>
                <div className="reminder-item">
                  <div className="reminder-left">
                    <Wallet size={16} className="reminder-icon"/>
                    <span className="reminder-text">Recovery - Ali Khan</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <span className="reminder-date">May 27, 2025</span>
                    <span className="status-badge status-due">Due</span>
                  </div>
                </div>
                <div className="reminder-item">
                  <div className="reminder-left">
                    <FileText size={16} className="reminder-icon"/>
                    <span className="reminder-text">Vendor Payment</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <span className="reminder-date">May 28, 2025</span>
                    <span className="status-badge status-due">Due</span>
                  </div>
                </div>
                <div className="reminder-item" style={{borderBottom:'none'}}>
                  <div className="reminder-left">
                    <ShieldAlert size={16} className="reminder-icon"/>
                    <span className="reminder-text">Review Pending</span>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <span className="reminder-date">May 30, 2025</span>
                    <span className="status-badge status-due">Due</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="row-5">
            
            <div className="card">
              <div className="card-header">
                <span className="card-title">Top Customers</span>
                <a href="#" className="card-action">View All</a>
              </div>
              <div>
                {['John Smith', 'Sarah Johnson', 'Ali Khan', 'Ahmed Raza'].map((name, i) => (
                  <div className="list-item" key={i}>
                    <div className="list-item-left">
                      <span className="rank">{i+1}.</span>
                      <div className="list-avatar"></div>
                      <span className="list-name">{name}</span>
                    </div>
                    <span className="list-value">${[12450, 8750, 6320, 5410][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Top Vendors</span>
                <a href="#" className="card-action">View All</a>
              </div>
              <div>
                {['Zain Travels', 'Umair Cars', 'Al Saeed Cars', 'City Cabs'].map((name, i) => (
                  <div className="list-item" key={i}>
                    <div className="list-item-left">
                      <span className="rank">{i+1}.</span>
                      <div className="list-avatar"></div>
                      <span className="list-name">{name}</span>
                    </div>
                    <span className="list-value">${[18450, 12750, 9650, 7250][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Driver Performance</span>
                <a href="#" className="card-action">View All</a>
              </div>
              <div>
                {['Ali Raza', 'Imran Khan', 'Faisal Ahmed', 'Usman Malik'].map((name, i) => (
                  <div className="list-item" key={i}>
                    <div className="list-item-left" style={{width:'40%'}}>
                      <span className="rank">{i+1}.</span>
                      <div className="list-avatar"></div>
                      <span className="list-name">{name}</span>
                    </div>
                    <div style={{display:'flex', alignItems:'center', flex:1, justifyContent:'flex-end'}}>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{width: ['96%','92%','89%','85%'][i]}}></div>
                      </div>
                      <span className="progress-text">{['96%','92%','89%','85%'][i]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">Loan / Debt Summary</span>
              </div>
              <div style={{display:'flex', flexDirection:'column'}}>
                <div className="summary-item">
                  <span className="summary-label">Total Loan Given</span>
                  <span className="summary-val">$125,000</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Loan Recovered</span>
                  <span className="summary-val">$68,450</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Outstanding</span>
                  <span className="summary-val text-red">$56,550</span>
                </div>
                <div className="summary-item" style={{borderBottom:'none'}}>
                  <span className="summary-label">Overdue Amount</span>
                  <span className="summary-val text-red">$18,750</span>
                </div>
              </div>
            </div>

            <div className="card" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
              <span className="card-title" style={{alignSelf:'flex-start', width:'100%', marginBottom:'1rem'}}>Financial Health Score</span>
              <div style={{position:'relative', width:100, height:100, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <svg viewBox="0 0 100 100" style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#22C55E" strokeWidth="10" strokeDasharray="283" strokeDashoffset="42" strokeLinecap="round" transform="rotate(-90 50 50)" />
                </svg>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                  <span style={{fontSize:'1.5rem', fontWeight:800, color:'#22C55E', lineHeight:1}}>85</span>
                  <span style={{fontSize:'0.6rem', color:'#94A3B8', fontWeight:600}}>/100</span>
                </div>
              </div>
              <div style={{textAlign:'center', marginTop:'1rem'}}>
                <span style={{color:'#16A34A', fontWeight:700, fontSize:'0.9rem', display:'block'}}>Excellent</span>
                <span style={{color:'#64748B', fontSize:'0.7rem'}}>Your business financial health is excellent. Keep going!</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
