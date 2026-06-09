import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import '../dashboard.css';
import { supabase } from '../lib/supabaseClient';
import { 
  Users, CheckCircle, Clock, XCircle, Search, 
  MessageCircle, Send
} from 'lucide-react';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase query error:', error);
      } else {
        setLeads(data || []);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (status) => {
    navigate(`/leads?status=${status}`);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <div className="main-content">
        <TopNav />
        
        <div className="dashboard-content p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Leads Overview</h2>
              <p className="text-gray-500">Real-time summary of your customer inquiries</p>
            </div>
            <button 
              onClick={fetchLeads}
              className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            
            <div 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-gray-800"
              onClick={() => handleCardClick('All')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Leads</p>
                  <h3 className="text-3xl font-black text-gray-900">{leads.length}</h3>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500"
              onClick={() => handleCardClick('New')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">New Leads</p>
                  <h3 className="text-3xl font-black text-gray-900">
                    {leads.filter(l => !l.status || l.status === 'New').length}
                  </h3>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-orange-500"
              onClick={() => handleCardClick('Contacted')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Contacted</p>
                  <h3 className="text-3xl font-black text-gray-900">
                    {leads.filter(l => l.status === 'Contacted').length}
                  </h3>
                </div>
                <div className="p-2 bg-orange-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-500"
              onClick={() => handleCardClick('Quote Sent')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Quote Sent</p>
                  <h3 className="text-3xl font-black text-gray-900">
                    {leads.filter(l => l.status === 'Quote Sent').length}
                  </h3>
                </div>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Send className="w-5 h-5 text-purple-500" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-500"
              onClick={() => handleCardClick('Converted')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Converted</p>
                  <h3 className="text-3xl font-black text-gray-900">
                    {leads.filter(l => l.status === 'Converted').length}
                  </h3>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all border-l-4 border-l-red-500"
              onClick={() => handleCardClick('Lost')}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Lost</p>
                  <h3 className="text-3xl font-black text-gray-900">
                    {leads.filter(l => l.status === 'Lost').length}
                  </h3>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </div>

          </div>

          <div className="mt-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Finance Module Coming Soon</h3>
             <p className="text-gray-500 max-w-md mx-auto">
               The financial charts, outstanding debts, and vendor payables tables have been temporarily hidden. They will return once the finance module is fully connected to the database.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
