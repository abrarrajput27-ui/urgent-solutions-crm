import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import '../dashboard.css';
import '../booking.css';
import { 
  FileText, User, Briefcase, Car, Wallet, Calculator, CheckCircle2,
  Plus, Trash2, Save, FileSpreadsheet, PlusCircle, ArrowRight, Eye, Edit3, ShieldAlert
} from 'lucide-react';

const BookingModule = () => {
  // 1 & 2. Source and Vehicle Type
  const [bookingSource, setBookingSource] = useState('Direct');
  const [serviceVehicleType, setServiceVehicleType] = useState('Our Vehicle');
  const [directCustomerType, setDirectCustomerType] = useState('New Customer');
  
  // 3. Driver/Vehicle Ownership
  const [driverOwnership, setDriverOwnership] = useState('Our Driver');
  const [vehicleOwnership, setVehicleOwnership] = useState('Our Vehicle');

  // Basic States
  const [basic, setBasic] = useState({ 
    status: 'Pending', date: '2026-06-05', pickupDate: '2026-06-06T10:00', 
    tripType: 'One-Way Outstation', pickup: '', drop: '', route: '', days: 1, notes: '',
    stops: []
  });
  const [customer, setCustomer] = useState({ name: '', mobile: '', altMobile: '', email: '' });
  const [vendor, setVendor] = useState({ name: '', mobile: '', panelOwner: 'Abrar', platformName: '' });
  const [driver, setDriver] = useState({ name: '', mobile: '', vehicleNo: '', model: '', category: 'Sedan', fuel: 'Petrol' });
  
  const [fin, setFin] = useState({ 
    myAmount: 0, vendorOrDriverAmount: 0, 
    commissionPercentage: 0, commissionAmount: 0, totalBookingAmount: 0,
    vendorAcceptedAmount: 0, vendorFinalAmount: 0
  });

  // 4. Cash Collection
  const [collection, setCollection] = useState({
    doneBy: 'Our Driver', mode: 'Mixed',
    cash: 0, paytm: 0, upi: 0, bank: 0
  });

  // 5. Extra Collection
  const [extra, setExtra] = useState({ received: 'No', receivedAmount: 0 });

  const [expenses, setExpenses] = useState([
    { id: 1, type: 'CNG', amount: 0 },
    { id: 2, type: 'Petrol Filled', amount: 0 },
    { id: 3, type: 'Petrol Running KM', amount: 0 },
    { id: 4, type: 'Toll', amount: 0 },
    { id: 5, type: 'State Tax', amount: 0 },
    { id: 6, type: 'Parking', amount: 0 },
    { id: 7, type: 'Food', amount: 0 },
    { id: 8, type: 'Driver Advance', amount: 0 },
    { id: 9, type: 'Other', amount: 0 }
  ]);
  const [showManualExpense, setShowManualExpense] = useState(false);

  const [review, setReview] = useState({ status: 'Pending', reminderDate: '', type: 'Payment', notes: '' });
  const [showModal, setShowModal] = useState(false);

  const handleFinChange = (e) => setFin({ ...fin, [e.target.name]: parseFloat(e.target.value) || 0 });
  const handleColChange = (e) => setCollection({ ...collection, [e.target.name]: parseFloat(e.target.value) || 0 });
  const handleExpenseChange = (id, amount) => setExpenses(expenses.map(ex => ex.id === id ? { ...ex, amount: parseFloat(amount) || 0 } : ex));
  const addExpense = () => setExpenses([...expenses, { id: Date.now(), type: 'New Expense', amount: 0 }]);
  const removeExpense = (id) => setExpenses(expenses.filter(ex => ex.id !== id));

  // --- CALCULATIONS ---
  const isOurVehicle = serviceVehicleType === 'Our Vehicle';
  
  const activeExpenses = (isOurVehicle || showManualExpense) ? expenses : [];
  const totalTripExpenses = activeExpenses.reduce((acc, ex) => acc + ex.amount, 0);
  
  const totalDriverCollection = collection.cash + collection.paytm + collection.upi + collection.bank;

  // Primary Profit Logic
  let profit = 0;
  let formulaUsed = '';
  let acceptedBookingAmount = fin.myAmount; // usually my_amount

  // For MYF, "My Amount" acts as "My Booking Amount"
  if (bookingSource === 'MYF') {
    acceptedBookingAmount = fin.totalBookingAmount - fin.commissionAmount;
  }
  
  if (isOurVehicle) {
    profit = acceptedBookingAmount - totalTripExpenses;
    formulaUsed = 'my_amount - total_trip_expenses';
  } else {
    profit = acceptedBookingAmount - fin.vendorOrDriverAmount;
    formulaUsed = 'my_amount - vendor_or_driver_amount';
  }

  // 5 & 6. Extra Collection / Payable Logic (Outsider Vehicle)
  let extraCollectionAmount = 0;
  let pendingExtraCollection = 0;
  let payableToDriverOrVendor = 0;

  if (!isOurVehicle) {
    if (totalDriverCollection > fin.vendorOrDriverAmount) {
      extraCollectionAmount = totalDriverCollection - fin.vendorOrDriverAmount;
      pendingExtraCollection = extra.received === 'No' ? extraCollectionAmount : Math.max(0, extraCollectionAmount - extra.receivedAmount);
    } else if (totalDriverCollection < fin.vendorOrDriverAmount) {
      payableToDriverOrVendor = fin.vendorOrDriverAmount - totalDriverCollection;
    }
  }

  // General Recovery logic for "Our Vehicle" if customer hasn't paid full
  let pendingRecovery = 0;
  if (isOurVehicle && totalDriverCollection < acceptedBookingAmount) {
    pendingRecovery = acceptedBookingAmount - totalDriverCollection;
  }

  // --- ROUTE AUTOGENERATION ---
  let generatedRoute = basic.pickup || 'Pickup';
  if (basic.stops && basic.stops.length > 0) {
    const validStops = basic.stops.filter(s => s.trim() !== '');
    if (validStops.length > 0) {
      generatedRoute += ' -> ' + validStops.join(' -> ');
    }
  }
  if (basic.drop) {
    generatedRoute += ' -> ' + basic.drop;
  }
  if (basic.tripType === 'Round-Trip Outstation' && basic.pickup) {
    generatedRoute += ' -> ' + basic.pickup;
  }

  const handleSave = () => setShowModal(true);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        
        <div className="booking-content">
          {/* LEFT COLUMN: FORM */}
          <div className="booking-form-col">
            
            {/* 1. Source & Vehicle Service */}
            <div className="form-section">
              <div className="form-section-header">
                <Briefcase size={18} /> Booking Source & Service Type
              </div>
              <div className="form-grid form-grid-2" style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #E2E8F0'}}>
                <div className="form-group">
                  <label>Booking Source</label>
                  <select className="form-control" style={{fontWeight:'700', color:'#0044FF'}} value={bookingSource} onChange={e => setBookingSource(e.target.value)}>
                    <option value="Direct">Direct</option>
                    <option value="Savaari">Savaari</option>
                    <option value="Group">Group</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Taxi Sanchalak">Taxi Sanchalak</option>
                    <option value="MYF">MYF / Commission</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Service Vehicle Type</label>
                  <select className="form-control" style={{fontWeight:'700', color:'#00C853'}} value={serviceVehicleType} onChange={e => setServiceVehicleType(e.target.value)}>
                    <option value="Our Vehicle">Our Vehicle</option>
                    <option value="Outsider / Arranged Vehicle">Outsider / Arranged Vehicle</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Source Fields */}
              <div className="form-grid form-grid-3">
                {bookingSource === 'Direct' && (
                  <div className="form-group">
                    <label>Customer Type</label>
                    <select className="form-control" value={directCustomerType} onChange={e => setDirectCustomerType(e.target.value)}>
                      <option>New Customer</option>
                      <option>Old Customer</option>
                      <option>Reference</option>
                    </select>
                  </div>
                )}
                {bookingSource === 'Direct' && directCustomerType === 'Reference' && (
                  <>
                    <div className="form-group"><label>Referred By Name</label><input type="text" className="form-control" /></div>
                    <div className="form-group"><label>Referred By Mobile</label><input type="text" className="form-control" /></div>
                  </>
                )}
                {bookingSource === 'Direct' && directCustomerType === 'Old Customer' && (
                  <>
                    <div className="form-group" style={{gridColumn: 'span 2'}}>
                      <label>Search Old Customer (Mobile No.)</label>
                      <div style={{display:'flex', gap:'0.5rem'}}>
                        <input type="text" className="form-control" placeholder="Enter Mobile Number" style={{flex: 1}} />
                        <button className="btn-modal-secondary" style={{padding:'0 1rem', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>Fetch Data</button>
                      </div>
                    </div>
                    <div style={{gridColumn: 'span 3', background:'#F0FDF4', padding:'0.75rem', borderRadius:'8px', border:'1px solid #86EFAC', fontSize:'0.85rem', color:'#166534', marginTop:'0.5rem'}}>
                      <strong>✓ Customer Found:</strong> Rahul Sharma (+91 9876543210)<br/>
                      <strong>Last Trip:</strong> 15-May-2026 | Delhi to Jaipur | Sedan<br/>
                      <strong>Previous Revenue:</strong> ₹1,500 | <strong>Rating:</strong> ⭐⭐⭐⭐⭐
                    </div>
                  </>
                )}
                {['Vendor', 'Group', 'MYF', 'Taxi Sanchalak'].includes(bookingSource) && (
                  <>
                    <div className="form-group"><label>Source Vendor Name</label><input type="text" className="form-control" /></div>
                    <div className="form-group"><label>Source Vendor Mobile</label><input type="text" className="form-control" /></div>
                  </>
                )}
                {bookingSource === 'Savaari' && (
                  <>
                    <div className="form-group">
                      <label>Panel Owner</label>
                      <select className="form-control" value={vendor.panelOwner} onChange={e => setVendor({...vendor, panelOwner: e.target.value})}>
                        <option>Abrar</option><option>Imran</option><option>Shavej</option>
                      </select>
                    </div>
                    <div className="form-group"><label>Savaari Booking ID</label><input type="text" className="form-control" /></div>
                  </>
                )}
                {bookingSource === 'Taxi Sanchalak' && (
                  <div className="form-group"><label>Platform Name</label><input type="text" className="form-control" /></div>
                )}
              </div>
            </div>

            {/* 2. Basic Booking Details */}
            <div className="form-section">
              <div className="form-section-header">
                <FileText size={18} /> Basic Booking Details
              </div>
              <div className="form-grid form-grid-3">
                <div className="form-group"><label>Booking ID</label><input type="text" className="form-control" value="BK-8092" disabled /></div>
                <div className="form-group">
                  <label>Booking Status</label>
                  <select className="form-control" style={{fontWeight:'700', color: basic.status==='Confirmed' ? '#00C853' : '#0044FF'}} value={basic.status} onChange={e => setBasic({...basic, status: e.target.value})}>
                    <option>Pending</option><option>Confirmed</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </div>
                <div className="form-group"><label>Booking Date</label><input type="date" className="form-control" value={basic.date} onChange={e => setBasic({...basic, date: e.target.value})} /></div>
                <div className="form-group"><label>Pickup Date & Time</label><input type="datetime-local" className="form-control" value={basic.pickupDate} onChange={e => setBasic({...basic, pickupDate: e.target.value})} /></div>
                <div className="form-group">
                  <label>Trip Type</label>
                  <select className="form-control" value={basic.tripType} onChange={e => setBasic({...basic, tripType: e.target.value})}>
                    <option>One-Way Outstation</option>
                    <option>Round-Trip Outstation</option>
                    <option>Local</option>
                    <option>Airport Transfers</option>
                    <option>Railway Transfers</option>
                  </select>
                </div>
                {basic.tripType === 'Local' && (
                  <div className="form-group">
                    <label>Local Package</label>
                    <select className="form-control">
                      <option>4 Hr / 40 Km</option>
                      <option>6 Hr / 60 Km</option>
                      <option>8 Hr / 80 Km</option>
                      <option>10 Hr / 100 Km</option>
                      <option>12 Hr / 120 Km</option>
                    </select>
                  </div>
                )}
                <div className="form-group"><label>Number of Days</label><input type="number" className="form-control" min="1" value={basic.days} onChange={e => setBasic({...basic, days: e.target.value})} /></div>
                <div className="form-group" style={{ gridColumn: 'span 3' }}><label>Pickup Location</label><input type="text" className="form-control" placeholder="City / Complete Address" value={basic.pickup} onChange={e => setBasic({...basic, pickup: e.target.value})} /></div>
                
                {basic.tripType === 'Round-Trip Outstation' && (
                  <div className="form-group" style={{ gridColumn: 'span 3' }}>
                    <label>Intermediate Stops</label>
                    {(basic.stops || []).map((stop, i) => (
                      <div key={i} style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem'}}>
                        <input type="text" className="form-control" placeholder={`Stop ${i+1}`} value={stop} onChange={e => {
                           let newStops = [...basic.stops];
                           newStops[i] = e.target.value;
                           setBasic({...basic, stops: newStops});
                        }} style={{flex: 1}} />
                        <button className="btn-remove-expense" onClick={() => {
                           let newStops = basic.stops.filter((_, idx) => idx !== i);
                           setBasic({...basic, stops: newStops});
                        }}><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button className="btn-add-expense" onClick={() => setBasic({...basic, stops: [...(basic.stops||[]), '']})} style={{width: 'fit-content', padding: '0.4rem 0.8rem'}}><Plus size={14} /> Add Stop</button>
                  </div>
                )}

                <div className="form-group" style={{ gridColumn: 'span 3' }}><label>Drop Location</label><input type="text" className="form-control" placeholder="City / Complete Address" value={basic.drop} onChange={e => setBasic({...basic, drop: e.target.value})} /></div>
                <div className="form-group" style={{ gridColumn: 'span 3' }}><label>Auto-Generated Route</label><input type="text" className="form-control" placeholder="Route will auto-generate..." value={generatedRoute} disabled style={{background:'#F1F5F9', color:'#334155', fontWeight:'600'}} /></div>
              </div>
              <div className="form-group" style={{marginTop:'1rem'}}>
                <label>Booking Notes</label>
                <textarea className="form-control" rows="2" placeholder="Any special instructions..."></textarea>
              </div>
            </div>

            {/* 3. Customer Details */}
            <div className="form-section">
              <div className="form-section-header">
                <User size={18} /> Customer Details
              </div>
              <div className="form-grid form-grid-2">
                <div className="form-group"><label>Customer Name</label><input type="text" className="form-control" placeholder="Full Name" /></div>
                <div className="form-group"><label>Customer Mobile</label><input type="text" className="form-control" placeholder="+91 XXXXX XXXXX" /></div>
                <div className="form-group"><label>Alternate Mobile</label><input type="text" className="form-control" placeholder="+91 XXXXX XXXXX" /></div>
                <div className="form-group"><label>Email (Optional)</label><input type="email" className="form-control" placeholder="customer@email.com" /></div>
              </div>
            </div>

            {/* 4. Driver & Vehicle Ownership Details */}
            <div className="form-section">
              <div className="form-section-header">
                <Car size={18} /> Driver & Vehicle Details
              </div>
              <div className="form-grid form-grid-2" style={{marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #E2E8F0'}}>
                <div className="form-group">
                  <label>Driver Ownership</label>
                  <select className="form-control" value={driverOwnership} onChange={e=>setDriverOwnership(e.target.value)}>
                    <option>Our Driver</option><option>Outside Driver</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Vehicle Ownership</label>
                  <select className="form-control" value={vehicleOwnership} onChange={e=>setVehicleOwnership(e.target.value)}>
                    <option>Our Vehicle</option><option>Outside Vehicle</option>
                  </select>
                </div>
              </div>

              <div className="form-grid form-grid-3">
                <div className="form-group"><label>Driver Name</label><input type="text" className="form-control" /></div>
                <div className="form-group"><label>Driver Mobile</label><input type="text" className="form-control" /></div>
                <div className="form-group"><label>Vehicle Number</label><input type="text" className="form-control" /></div>
                <div className="form-group"><label>Vehicle Model</label><input type="text" className="form-control" /></div>
                <div className="form-group"><label>Category</label><select className="form-control"><option>Sedan</option><option>SUV</option><option>Hatchback</option></select></div>
                {isOurVehicle && (
                  <div className="form-group"><label>Fuel Type</label><select className="form-control"><option>Petrol</option><option>Diesel</option><option>CNG</option><option>EV</option></select></div>
                )}
              </div>
            </div>

            {/* 5. Financial Details */}
            <div className="form-section">
              <div className="form-section-header">
                <Wallet size={18} /> Financial Details
              </div>
              
              <div className="form-grid form-grid-3">
                {/* Standard My Amount for Direct, Savaari, Group, Vendor, Other */}
                {['Direct', 'Savaari', 'Group', 'Vendor', 'Other', 'Taxi Sanchalak'].includes(bookingSource) && (
                  <div className="form-group">
                    <label>My Amount (Accepted Booking Amt)</label>
                    <input type="number" name="myAmount" value={fin.myAmount} onChange={handleFinChange} className="form-control" style={{background:'#F0FDF4', borderColor:'#86EFAC'}} />
                  </div>
                )}
                
                {bookingSource === 'MYF' && (
                  <>
                    <div className="form-group"><label>Total Booking Amount</label><input type="number" name="totalBookingAmount" value={fin.totalBookingAmount} onChange={handleFinChange} className="form-control" /></div>
                    <div className="form-group"><label>Commission %</label><input type="number" name="commissionPercentage" value={fin.commissionPercentage} onChange={handleFinChange} className="form-control" /></div>
                    <div className="form-group"><label>Commission Amount</label><input type="number" name="commissionAmount" value={fin.commissionAmount} onChange={handleFinChange} className="form-control" /></div>
                    <div className="form-group"><label>My Booking Amount</label><input type="number" value={acceptedBookingAmount} className="form-control" style={{background:'#F0FDF4', borderColor:'#86EFAC'}} disabled /></div>
                  </>
                )}

                {/* If Outsider Vehicle, we must pay the driver/vendor */}
                {!isOurVehicle && (
                  <div className="form-group">
                    <label>Outsider Vendor / Driver Amount</label>
                    <input type="number" name="vendorOrDriverAmount" value={fin.vendorOrDriverAmount} onChange={handleFinChange} className="form-control" style={{background:'#FEF2F2', borderColor:'#FCA5A5'}} />
                  </div>
                )}
              </div>
            </div>

            {/* 6. Cash Collection By Driver */}
            <div className="form-section">
              <div className="form-section-header">
                <Wallet size={18} /> Collection Breakdown
              </div>
              <div className="form-grid form-grid-2" style={{marginBottom:'1rem'}}>
                <div className="form-group">
                  <label>Collection Done By</label>
                  <select className="form-control" value={collection.doneBy} onChange={e => setCollection({...collection, doneBy: e.target.value})}>
                    <option>Our Driver</option><option>Outside Driver</option><option>Vendor</option><option>Platform</option><option>Customer Direct</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Collection Mode</label>
                  <select className="form-control" value={collection.mode} onChange={e => setCollection({...collection, mode: e.target.value})}>
                    <option>Mixed</option><option>Cash</option><option>Paytm</option><option>UPI</option><option>Bank</option>
                  </select>
                </div>
              </div>

              <div className="form-grid form-grid-4">
                <div className="form-group"><label>Cash</label><input type="number" name="cash" value={collection.cash} onChange={handleColChange} className="form-control" /></div>
                <div className="form-group"><label>Paytm</label><input type="number" name="paytm" value={collection.paytm} onChange={handleColChange} className="form-control" /></div>
                <div className="form-group"><label>UPI</label><input type="number" name="upi" value={collection.upi} onChange={handleColChange} className="form-control" /></div>
                <div className="form-group"><label>Bank</label><input type="number" name="bank" value={collection.bank} onChange={handleColChange} className="form-control" /></div>
              </div>
              
              <div style={{marginTop:'1rem', fontWeight:'700', color:'var(--primary-navy)'}}>
                Total Driver Collection: ₹{totalDriverCollection.toLocaleString('en-IN')}
              </div>

              {/* Extra Collection Logic for Outsider */}
              {!isOurVehicle && extraCollectionAmount > 0 && (
                <div style={{marginTop:'1rem', padding:'1rem', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:'8px'}}>
                  <div style={{fontWeight:'700', color:'#D97706', marginBottom:'0.5rem'}}>Amount Receivable from Driver/Vendor: ₹{extraCollectionAmount.toLocaleString('en-IN')}</div>
                  <div className="form-grid form-grid-2">
                    <div className="form-group">
                      <label>Extra Amount Received?</label>
                      <select className="form-control" value={extra.received} onChange={e => setExtra({...extra, received: e.target.value})}>
                        <option>No</option><option>Yes</option>
                      </select>
                    </div>
                    {extra.received === 'Yes' && (
                      <div className="form-group">
                        <label>Received Amount</label>
                        <input type="number" className="form-control" value={extra.receivedAmount} onChange={e => setExtra({...extra, receivedAmount: parseFloat(e.target.value)||0})} />
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!isOurVehicle && payableToDriverOrVendor > 0 && (
                <div style={{marginTop:'1rem', padding:'1rem', background:'#FEF2F2', border:'1px solid #FCA5A5', borderRadius:'8px'}}>
                  <div style={{fontWeight:'700', color:'#DC2626'}}>Amount Payable to Driver/Vendor: ₹{payableToDriverOrVendor.toLocaleString('en-IN')}</div>
                </div>
              )}
            </div>

            {/* 7. Expense Module */}
            <div className="form-section" style={{opacity: (!isOurVehicle && !showManualExpense) ? 0.5 : 1}}>
              <div className="form-section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div><Calculator size={18} /> Trip Expenses</div>
                {!isOurVehicle && (
                  <div style={{fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'0.25rem', fontWeight:'500'}}>
                    <input type="checkbox" checked={showManualExpense} onChange={e=>setShowManualExpense(e.target.checked)} />
                    Add manual expense anyway
                  </div>
                )}
              </div>
              
              {(!isOurVehicle && !showManualExpense) ? (
                <div style={{fontSize:'0.85rem', color:'#64748B'}}>Trip Expense section is disabled because an Outsider / Arranged Vehicle served this booking.</div>
              ) : (
                <>
                  <div style={{maxWidth: '500px'}}>
                    {expenses.map((ex) => (
                      <div className="expense-row" key={ex.id}>
                        <input type="text" className="form-control" value={ex.type} onChange={(e) => {
                          setExpenses(expenses.map(x => x.id === ex.id ? {...x, type: e.target.value} : x));
                        }} />
                        <input type="number" className="form-control" value={ex.amount} onChange={(e) => handleExpenseChange(ex.id, e.target.value)} />
                        <button className="btn-remove-expense" onClick={() => removeExpense(ex.id)}><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button className="btn-add-expense" onClick={addExpense}><Plus size={16} /> Add Multiple Expenses</button>
                  </div>
                  <div style={{marginTop: '1rem', fontWeight: '700', fontSize: '1rem', color: 'var(--primary-navy)'}}>
                    Total Trip Expenses: ₹{totalTripExpenses.toLocaleString('en-IN')}
                  </div>
                </>
              )}
            </div>

            {/* 8. Review & Reminder */}
            <div className="form-section">
              <div className="form-section-header">
                <CheckCircle2 size={18} /> Review System & Reminders
              </div>
              <div className="form-grid form-grid-3">
                <div className="form-group">
                  <label>Review Status</label>
                  <select className="form-control" value={review.status} onChange={e => setReview({...review, status: e.target.value})}>
                    <option>Pending</option><option>Sent</option><option>Received</option><option>Follow Up</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Next Reminder Date</label>
                  <input type="date" className="form-control" value={review.reminderDate} onChange={e => setReview({...review, reminderDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Generate Link</label>
                  <button className="form-control" style={{background:'#0B192C', color:'white', fontWeight:'600', cursor:'pointer'}}>Review Link Generator</button>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: LIVE PANEL */}
          <div className="booking-panel-col">
            <div className="live-panel">
              <div className="live-panel-header">
                <Calculator size={20} /> Live Calculation Engine
              </div>
              <div className="live-panel-body">
                
                <div className="profit-box">
                  <div className="profit-label">Final Estimated Profit</div>
                  <div className="profit-value">₹{profit.toLocaleString('en-IN')}</div>
                  <div style={{fontSize:'0.65rem', marginTop:'0.5rem', opacity:0.8}}>Formula: {formulaUsed}</div>
                </div>

                <div>
                  <div className="metric-row"><span className="metric-label">Booking Source</span><span className="metric-val">{bookingSource}</span></div>
                  <div className="metric-row"><span className="metric-label">Service Vehicle Type</span><span className="metric-val">{serviceVehicleType}</span></div>
                  <div className="metric-row"><span className="metric-label">Driver / Vehicle Ownership</span><span className="metric-val">{driverOwnership} / {vehicleOwnership}</span></div>
                  <div className="metric-row"><span className="metric-label">Accepted Booking Amount</span><span className="metric-val">₹{acceptedBookingAmount.toLocaleString('en-IN')}</span></div>
                  
                  {!isOurVehicle && (
                    <div className="metric-row"><span className="metric-label">Vendor / Driver Amount</span><span className="metric-val warning">₹{fin.vendorOrDriverAmount.toLocaleString('en-IN')}</span></div>
                  )}
                  {isOurVehicle && (
                    <div className="metric-row"><span className="metric-label">Total Expenses</span><span className="metric-val warning">₹{totalTripExpenses.toLocaleString('en-IN')}</span></div>
                  )}
                  
                  <div className="metric-row"><span className="metric-label">Total Driver Collection</span><span className="metric-val">₹{totalDriverCollection.toLocaleString('en-IN')}</span></div>

                  {!isOurVehicle && extraCollectionAmount > 0 && (
                    <div className="metric-row"><span className="metric-label" style={{color:'#60A5FA'}}>Extra Collection Amount</span><span className="metric-val info">₹{extraCollectionAmount.toLocaleString('en-IN')}</span></div>
                  )}
                  
                  {!isOurVehicle && pendingExtraCollection > 0 && (
                    <div className="metric-row"><span className="metric-label" style={{color:'#F87171'}}>Pending Extra Collection</span><span className="metric-val negative">₹{pendingExtraCollection.toLocaleString('en-IN')}</span></div>
                  )}

                  {!isOurVehicle && payableToDriverOrVendor > 0 && (
                    <div className="metric-row"><span className="metric-label" style={{color:'#FBBF24'}}>Payable to Driver/Vendor</span><span className="metric-val warning">₹{payableToDriverOrVendor.toLocaleString('en-IN')}</span></div>
                  )}
                  
                  {isOurVehicle && pendingRecovery > 0 && (
                    <div className="metric-row"><span className="metric-label" style={{color:'#F87171'}}>Pending Recovery</span><span className="metric-val negative">₹{pendingRecovery.toLocaleString('en-IN')}</span></div>
                  )}

                </div>
              </div>
            </div>

            {/* LEDGER IMPACT TRACKER */}
            <div className="ledger-impact">
              <div className="ledger-impact-header">
                <FileSpreadsheet size={18} /> Live Ledger Previews
              </div>
              
              <div style={{marginBottom:'0.5rem', fontSize:'0.75rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.25rem'}}>
                <div className="ledger-item active"><CheckCircle2 size={12} className="ledger-icon" /> Booking Ledger</div>
                <div className="ledger-item active"><CheckCircle2 size={12} className="ledger-icon" /> Customer Sheet</div>
                <div className="ledger-item active"><CheckCircle2 size={12} className="ledger-icon" /> Driver Sheet</div>
                <div className={`ledger-item ${!isOurVehicle ? 'active' : ''}`}><CheckCircle2 size={12} className="ledger-icon" /> Vendor Sheet</div>
                <div className={`ledger-item ${(pendingRecovery > 0 || pendingExtraCollection > 0) ? 'active' : ''}`}><CheckCircle2 size={12} className="ledger-icon" /> Recovery Ledger</div>
                <div className={`ledger-item ${payableToDriverOrVendor > 0 ? 'active' : ''}`}><CheckCircle2 size={12} className="ledger-icon" /> Payable Ledger</div>
                <div className={`ledger-item ${isOurVehicle ? 'active' : ''}`}><CheckCircle2 size={12} className="ledger-icon" /> Expense Ledger</div>
                <div className="ledger-item active"><CheckCircle2 size={12} className="ledger-icon" /> Profit Tracker</div>
              </div>
              
              {(pendingRecovery > 0 || pendingExtraCollection > 0) && (
                <div style={{marginBottom:'1rem', fontSize:'0.8rem', color:'#334155', background:'#FEF2F2', padding:'0.5rem', borderRadius:'6px', border:'1px solid #FCA5A5'}}>
                  <strong style={{color:'#B91C1C'}}>Auto-Reminder:</strong> Recovery of ₹{isOurVehicle ? pendingRecovery : pendingExtraCollection} pending.
                </div>
              )}

              <div className="action-area" style={{display:'flex', flexDirection:'column', gap:'0.5rem', marginTop:'auto'}}>
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <button className="btn-modal-secondary" style={{flex:1, borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem', cursor:'pointer'}}><Eye size={16}/> Preview Inv</button>
                  <button className="btn-modal-secondary" style={{flex:1, borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem', cursor:'pointer'}}><Eye size={16}/> Preview Quote</button>
                </div>
                <button className="btn-modal-secondary" style={{borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem', cursor:'pointer', fontWeight:'700'}} onClick={() => {}}><Edit3 size={16}/> Save Draft</button>
                <button className="btn-save-booking" onClick={handleSave}>
                  <Save size={20} /> Save Master Booking
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SAVE MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-wrapper">
              <CheckCircle2 size={36} />
            </div>
            <div className="modal-title">Booking Saved Successfully!</div>
            <div className="modal-subtitle">BK-8092 has been recorded and relevant ledgers are updated.</div>
            
            <div className="modal-actions">
              <button className="btn-modal btn-modal-primary" onClick={() => setShowModal(false)}><PlusCircle size={16} /> Save & New Booking</button>
              <button className="btn-modal btn-modal-secondary" onClick={() => setShowModal(false)}><FileText size={16} /> Save & View Booking</button>
              <button className="btn-modal btn-modal-secondary" onClick={() => setShowModal(false)}><ArrowRight size={16} /> Save & Generate Invoice</button>
              <button className="btn-modal btn-modal-secondary" onClick={() => setShowModal(false)}><FileSpreadsheet size={16} /> Save & Generate Quotation</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookingModule;
