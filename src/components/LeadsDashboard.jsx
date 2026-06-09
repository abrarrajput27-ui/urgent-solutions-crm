import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, LogOut, CheckCircle, Clock, XCircle, Search, Edit2, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const LEAD_STATUSES = ['New', 'Contacted', 'Quote Sent', 'Follow Up', 'Converted', 'Lost'];

const StatusBadge = ({ status }) => {
  const colors = {
    'New': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-orange-100 text-orange-800',
    'Quote Sent': 'bg-purple-100 text-purple-800',
    'Follow Up': 'bg-yellow-100 text-yellow-800',
    'Converted': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status || 'New'}
    </span>
  );
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // Authentication check
  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPin = import.meta.env.VITE_ADMIN_PIN || '7310';
    if (pin === correctPin) {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      fetchLeads();
    } else {
      setError('Invalid PIN');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setLeads([]);
  };

  const fetchLeads = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Anon Key exists?', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      console.log('Supabase returned data:', data);
      console.log('Row count:', data ? data.length : 0);
      setLeads(data || []);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setFetchError(err.message || 'Failed to fetch leads from Supabase. Check RLS policies.');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadField = async (id, field, value) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ [field]: value, updated_at: new Date() })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setLeads(leads.map(lead => lead.id === id ? { ...lead, [field]: value } : lead));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead({ ...selectedLead, [field]: value });
      }
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      alert(`Failed to update ${field}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Helmet><title>Admin Login | Urgent Taxis</title></Helmet>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 mb-8">Admin Access</h2>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter Admin PIN</label>
                <div className="mt-1">
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => { setPin(e.target.value); setError(''); }}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
                    autoFocus
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black focus:outline-none"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet><title>Lead Dashboard | Urgent Taxis</title></Helmet>
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Urgent Taxis CRM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 font-medium">Logged in</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full"><Clock className="w-5 h-5 text-blue-600" /></div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">New Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.filter(l => !l.status || l.status === 'New').length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full"><Clock className="w-5 h-5 text-blue-600" /></div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Converted</p>
              <p className="text-2xl font-bold text-gray-900">{leads.filter(l => l.status === 'Converted').length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full"><CheckCircle className="w-5 h-5 text-green-600" /></div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Lost</p>
              <p className="text-2xl font-bold text-gray-900">{leads.filter(l => l.status === 'Lost').length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full"><XCircle className="w-5 h-5 text-red-600" /></div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">Recent Leads</h3>
            <button onClick={fetchLeads} className="text-sm text-blue-600 font-medium hover:text-blue-800">
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route / Trip</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle / Fare</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">Loading leads...</td></tr>
                ) : fetchError ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center">
                      <div className="bg-red-50 p-4 rounded-md border border-red-200 max-w-2xl mx-auto">
                        <h4 className="text-red-800 font-bold mb-2">Supabase Error:</h4>
                        <p className="text-red-600 font-mono text-sm">{fetchError}</p>
                        <p className="text-sm text-red-700 mt-4 font-medium">Please ensure the Supabase migration script was run and the RLS SELECT policy exists:</p>
                        <code className="block bg-white p-3 mt-2 text-xs text-left overflow-x-auto border border-red-100 rounded text-gray-800">
                          CREATE POLICY "Allow public lead select" ON public.leads FOR SELECT TO anon USING (true);
                        </code>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No leads found in database.</td></tr>
                ) : (
                  leads.map((lead) => {
                    const customerName = lead.name || lead.customer_name || "Unknown";
                    const mobile = lead.mobile || lead.phone || lead.customer_mobile || "Not provided";
                    const pickup = lead.pickup || lead.pickup_location || lead.from || "Pickup not provided";
                    const drop = lead.drop_location || lead.drop || lead.destination || lead.to || "Drop not provided";
                    const tripType = lead.trip_type || lead.tripType || "Not specified";
                    const travelDate = lead.travel_date || lead.trip_date || lead.date_of_travel || "";
                    const travelTime = lead.travel_time || lead.trip_time || "";
                    const vehicle = lead.vehicle_category || lead.vehicle_type || lead.vehicle || "";
                    const estimatedFare = lead.estimated_fare || lead.fare || "";

                    return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}<br/>
                        <span className="text-xs">{new Date(lead.created_at).toLocaleTimeString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{customerName}</div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                          {mobile !== "Not provided" ? (
                            <a href={`tel:${mobile}`} className="flex items-center text-blue-600 hover:text-blue-800">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                              {mobile}
                            </a>
                          ) : (
                            mobile
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium whitespace-nowrap">
                          {pickup} <span className="text-gray-400 mx-1">→</span> {drop}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{tripType}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {travelDate} {travelTime && `• ${travelTime}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">{vehicle}</div>
                        {estimatedFare && <div className="text-xs text-gray-500 mt-1">Est: ₹{estimatedFare}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status || 'New'}
                          onChange={(e) => updateLeadField(lead.id, 'status', e.target.value)}
                          className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {LEAD_STATUSES.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <Edit2 className="w-4 h-4 mr-1" /> View Details
                        </button>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Lead Details */}
      {selectedLead && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 bg-gray-900/30 backdrop-blur-sm transition-opacity" onClick={() => setSelectedLead(null)}>
          <div 
            className="bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-[900px] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white px-6 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-black text-gray-900">
                Lead Details
              </h3>
              <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 py-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Info</h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Name</span>
                        <div className="font-semibold text-gray-900">{selectedLead.name || selectedLead.customer_name || 'Unknown'}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Mobile</span>
                        <div className="font-semibold text-gray-900">{selectedLead.mobile || selectedLead.phone || selectedLead.customer_mobile || 'Not provided'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Route Details</h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Pickup Location</span>
                        <div className="font-semibold text-gray-900">{selectedLead.pickup || selectedLead.pickup_location || selectedLead.from || 'Pickup not provided'}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Drop Location</span>
                        <div className="font-semibold text-gray-900">{selectedLead.drop_location || selectedLead.drop || selectedLead.destination || selectedLead.to || 'Drop not provided'}</div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Trip Type</span>
                        <div className="font-semibold text-gray-900">{selectedLead.trip_type || selectedLead.tripType || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Trip Info</h4>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500 block mb-0.5">Vehicle</span>
                          <div className="font-bold text-blue-600">{selectedLead.vehicle_category || selectedLead.vehicle_type || selectedLead.vehicle || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block mb-0.5">Estimated Fare</span>
                          <div className="font-bold text-green-600">{(selectedLead.estimated_fare || selectedLead.fare) ? `₹${selectedLead.estimated_fare || selectedLead.fare}` : 'TBD'}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500 block mb-0.5">Travel Date</span>
                          <div className="font-semibold text-gray-900">{selectedLead.travel_date || selectedLead.trip_date || selectedLead.date_of_travel || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block mb-0.5">Travel Time</span>
                          <div className="font-semibold text-gray-900">{selectedLead.travel_time || selectedLead.trip_time || 'N/A'}</div>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-0.5">Lead Source</span>
                        <div className="text-sm font-medium text-gray-600">{selectedLead.lead_source || 'Website'} • {selectedLead.route_source || 'General'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">CRM Action Center</h4>
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-blue-900 mb-1">Status</label>
                          <select
                            value={selectedLead.status || 'New'}
                            onChange={(e) => updateLeadField(selectedLead.id, 'status', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 text-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white shadow-sm font-medium"
                          >
                            {LEAD_STATUSES.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-blue-900 mb-1">Follow-up Date</label>
                          <input
                            type="date"
                            value={selectedLead.follow_up_date || ''}
                            onChange={(e) => updateLeadField(selectedLead.id, 'follow_up_date', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 text-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white shadow-sm font-medium"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-blue-900 mb-1">Notes</label>
                        <textarea
                          value={selectedLead.notes || ''}
                          onChange={(e) => updateLeadField(selectedLead.id, 'notes', e.target.value)}
                          rows="2"
                          placeholder="Add details discussed with the customer..."
                          className="mt-1 block w-full px-3 py-2 text-sm border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white shadow-sm resize-none"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 shrink-0 flex flex-wrap gap-3 justify-end items-center z-10">
              <button
                onClick={() => {
                  const cName = selectedLead.name || selectedLead.customer_name || 'Unknown';
                  const cPhone = selectedLead.mobile || selectedLead.phone || selectedLead.customer_mobile || 'Not provided';
                  const cPickup = selectedLead.pickup || selectedLead.pickup_location || selectedLead.from || 'Pickup not provided';
                  const cDrop = selectedLead.drop_location || selectedLead.drop || selectedLead.destination || selectedLead.to || 'Drop not provided';
                  const cDate = selectedLead.travel_date || selectedLead.trip_date || selectedLead.date_of_travel || 'N/A';
                  
                  const text = `Name: ${cName}\nMobile: ${cPhone}\nPickup: ${cPickup}\nDrop: ${cDrop}\nDate: ${cDate}`;
                  navigator.clipboard.writeText(text);
                  alert('Lead copied to clipboard');
                }}
                className="inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-5 py-2.5 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
              >
                Copy Lead
              </button>
              <a
                href={`tel:${selectedLead.mobile || selectedLead.phone || selectedLead.customer_mobile || ''}`}
                className="inline-flex justify-center rounded-xl border border-transparent shadow-sm px-5 py-2.5 bg-gray-900 text-sm font-bold text-white hover:bg-black focus:outline-none transition-colors"
              >
                Call Customer
              </a>
              <a
                href={`https://wa.me/91${selectedLead.mobile || selectedLead.phone || selectedLead.customer_mobile || ''}?text=${encodeURIComponent(`Hi ${selectedLead.name || selectedLead.customer_name || 'Unknown'}, this is regarding your taxi inquiry.

*Pickup:* ${selectedLead.pickup || selectedLead.pickup_location || selectedLead.from || 'Pickup not provided'}
*Drop:* ${selectedLead.drop_location || selectedLead.drop || selectedLead.destination || selectedLead.to || 'Drop not provided'}
*Trip Type:* ${selectedLead.trip_type || selectedLead.tripType || 'Not specified'}
*Date:* ${selectedLead.travel_date || selectedLead.trip_date || selectedLead.date_of_travel || ''} ${selectedLead.travel_time || selectedLead.trip_time || ''}
*Vehicle:* ${selectedLead.vehicle_category || selectedLead.vehicle_type || selectedLead.vehicle || ''}
*Estimated Fare:* ${(selectedLead.estimated_fare || selectedLead.fare) ? `₹${selectedLead.estimated_fare || selectedLead.fare}` : 'TBD'}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center rounded-xl border border-transparent shadow-sm px-5 py-2.5 bg-[#25D366] text-sm font-bold text-white hover:bg-[#1ebd5a] focus:outline-none transition-colors"
              >
                WhatsApp Customer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
