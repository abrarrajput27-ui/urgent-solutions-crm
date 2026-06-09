import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import '../dashboard.css';
import '../booking.css';
import { 
  FileText, User, Briefcase, Car, Wallet, Calculator, CheckCircle2,
  Plus, Trash2, Save, FileSpreadsheet, PlusCircle, ArrowRight, Eye, Edit3, ShieldAlert
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const BookingModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [bookingIdLabel, setBookingIdLabel] = useState(`UT-2026-${Date.now()}`);

  // 1 & 2. Source and Vehicle Type
  const [sourceCategory, setSourceCategory] = useState('Direct');
  const [directCustomerType, setDirectCustomerType] = useState('New Customer');
  const [sourceName, setSourceName] = useState('');
  const [applicationName, setApplicationName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [advance, setAdvance] = useState({ paytm: '', status: 'Pending', date: '', notes: '' });

  const [serviceVehicleType, setServiceVehicleType] = useState('Our Vehicle');
  
  // 3. Driver/Vehicle Ownership
  const [driverOwnership, setDriverOwnership] = useState('Our Driver');
  const [vehicleOwnership, setVehicleOwnership] = useState('Our Vehicle');

  // Basic States
  const [basic, setBasic] = useState({ 
    status: 'Pending', date: new Date().toISOString().split('T')[0], pickupDate: '', pickupTime: '', 
    tripType: 'One-Way Outstation', rentalPackage: '', pickup: '', drop: '', route: '', days: '', notes: ''
  });
  const [coveredLocations, setCoveredLocations] = useState([]);
  const [customer, setCustomer] = useState({ name: '', mobile: '', altMobile: '', email: '' });
  const [vendor, setVendor] = useState({ name: '', mobile: '', panelOwner: '', platformName: '' });
  const [driver, setDriver] = useState({ name: '', mobile: '', vehicleNo: '', model: '', brand: '', category: 'Sedan', fuel: 'Petrol' });
  
  const [fin, setFin] = useState({ 
    customerTotalAmount: '',
    myAmount: '', vendorOrDriverAmount: '', 
    commissionPercentage: '', commissionAmount: '', totalBookingAmount: '',
    vendorAcceptedAmount: '', vendorFinalAmount: ''
  });

  const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const formatVehicleNumber = (val) => {
    let raw = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (raw.length === 0) return '';
    if (raw.length <= 2) return raw;
    if (raw.length <= 4) return `${raw.slice(0,2)}-${raw.slice(2)}`;
    let letters = raw.slice(4).replace(/[0-9]/g, '');
    let numbers = raw.slice(4).replace(/[^0-9]/g, '');
    let res = `${raw.slice(0,2)}-${raw.slice(2,4)}`;
    if (letters) res += `-${letters}`;
    if (numbers) res += `-${numbers.slice(0,4)}`;
    return res;
  };

  // 4. Cash Collection
  const [collection, setCollection] = useState({
    doneBy: 'Our Driver', mode: 'Mixed',
    cash: '', paytm: '', upi: '', bank: ''
  });

  // 5. Extra Collection
  const [extra, setExtra] = useState({ received: 'No', receivedAmount: '' });

  const [cngEntries, setCngEntries] = useState([]);
  const [tollEntries, setTollEntries] = useState([]);
  const [expenses, setExpenses] = useState([
    { id: 2, type: 'Petrol Filled', amount: '' },
    { id: 3, type: 'Petrol Running KM', amount: '' },
    { id: 5, type: 'State Tax', amount: '' },
    { id: 6, type: 'Parking', amount: '' },
    { id: 7, type: 'Food', amount: '' },
    { id: 8, type: 'Driver Advance', amount: '' },
    { id: 9, type: 'Other', amount: '' }
  ]);
  const [showManualExpense, setShowManualExpense] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchBookingDetails();
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) {
        setBookingIdLabel(data.booking_id);
        setSourceCategory(data.source_category || 'Direct');
        setSourceName(data.source_name || '');
        setApplicationName(data.application_name || '');
        setGroupName(data.group_name || '');
        setAdvance({
          paytm: data.advance_paytm_amount || '',
          status: data.advance_payment_status || 'Pending',
          date: data.advance_payment_date || '',
          notes: data.advance_notes || ''
        });

        setServiceVehicleType(data.service_vehicle_type || 'Our Vehicle');
        setDriverOwnership(data.driver_ownership || 'Our Driver');
        setVehicleOwnership(data.vehicle_ownership || 'Our Vehicle');
        
        setBasic({
          status: data.booking_status || 'Pending',
          date: data.booking_date || '',
          pickupDate: data.pickup_date || (data.pickup_datetime ? data.pickup_datetime.split('T')[0] : ''),
          pickupTime: data.pickup_time || (data.pickup_datetime && data.pickup_datetime.includes('T') ? data.pickup_datetime.split('T')[1].substring(0, 5) : ''),
          tripType: data.trip_type || 'One-Way Outstation',
          rentalPackage: data.rental_package || '',
          pickup: data.pickup_location || '',
          drop: data.drop_location || '',
          route: data.route || '',
          days: data.number_of_days || '',
          notes: data.notes || ''
        });
        
        setCoveredLocations(Array.isArray(data.covered_locations) ? data.covered_locations : []);

        setCustomer({
          name: data.customer_name || '',
          mobile: data.customer_mobile || '',
          altMobile: data.alternate_mobile || '',
          email: data.customer_email || ''
        });

        setVendor({
          name: data.vendor_name || '',
          mobile: data.vendor_mobile || '',
          panelOwner: data.panel_owner || '',
          platformName: data.platform_name || ''
        });

        setDriver({
          name: data.driver_name || '',
          mobile: data.driver_mobile || '',
          vehicleNo: data.vehicle_number || '',
          model: data.vehicle_model || '',
          brand: data.vehicle_brand || '',
          category: data.vehicle_category || 'Sedan',
          fuel: data.fuel_type || 'Petrol'
        });

        setFin({
          customerTotalAmount: data.customer_total_amount || '',
          myAmount: data.my_amount || '',
          vendorOrDriverAmount: data.vendor_or_driver_amount || data.vendor_amount || data.driver_amount || '',
          commissionPercentage: data.commission_percentage || '',
          commissionAmount: data.commission_amount || '',
          totalBookingAmount: data.total_booking_amount || '',
          vendorAcceptedAmount: '',
          vendorFinalAmount: ''
        });

        setCollection({
          doneBy: data.collection_done_by || 'Our Driver',
          mode: data.collection_mode || 'Mixed',
          cash: data.cash_collection_amount || '',
          paytm: data.paytm_collection_amount || '',
          upi: data.upi_collection_amount || '',
          bank: data.bank_collection_amount || ''
        });
        
        setCngEntries(Array.isArray(data.cng_entries) ? data.cng_entries : []);
        setTollEntries(Array.isArray(data.toll_entries) ? data.toll_entries : []);
        
        // Expenses logic
        const newExpenses = [
          { id: 2, type: 'Petrol Filled', amount: data.expense_petrol_filled || '' },
          { id: 3, type: 'Petrol Running KM', amount: data.expense_petrol_running_km || '' },
          { id: 5, type: 'State Tax', amount: data.expense_state_tax || '' },
          { id: 6, type: 'Parking', amount: data.expense_parking || '' },
          { id: 7, type: 'Food', amount: data.expense_food || '' },
          { id: 8, type: 'Driver Advance', amount: data.expense_driver_advance || '' },
          { id: 9, type: 'Other', amount: data.expense_other || '' }
        ];
        setExpenses(newExpenses);

        setReview({
          method: data.review_method || 'Link Review',
          videoStatus: data.video_review_status || 'Pending',
          videoDate: data.video_review_date || '',
          linkSent: data.review_link_sent ? 'Yes' : 'No',
          linkSentDate: data.review_link_sent_date || '',
          received: data.review_received ? 'Yes' : 'No',
          rating: data.rating || '',
          url: data.review_url || '',
          followUp: data.follow_up_required ? 'Yes' : 'No'
        });
      }
    } catch (err) {
      setSaveError("Failed to load booking details.");
    }
  };

  const [review, setReview] = useState({ 
    method: 'Link Review', videoStatus: 'Pending', videoDate: '',
    linkSent: 'No', linkSentDate: '', received: 'No', rating: '', url: '', followUp: 'No'
  });
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleFinChange = (e) => setFin({ ...fin, [e.target.name]: parseFloat(e.target.value) || 0 });
  const handleColChange = (e) => setCollection({ ...collection, [e.target.name]: parseFloat(e.target.value) || 0 });
  const handleExpenseChange = (id, amount) => setExpenses(expenses.map(ex => ex.id === id ? { ...ex, amount: parseFloat(amount) || 0 } : ex));
  const addExpense = () => setExpenses([...expenses, { id: Date.now(), type: 'New Expense', amount: 0 }]);
  const removeExpense = (id) => setExpenses(expenses.filter(ex => ex.id !== id));

  const fetchCustomerByMobile = async (e) => {
    if (e) e.preventDefault();
    if (!customer.mobile) return;
    
    try {
      const { data, error } = await supabase.from('customers').select('*').eq('mobile', customer.mobile).single();
      if (data) {
        setCustomer({
          ...customer,
          name: data.name || '',
          altMobile: data.alternate_mobile || '',
          email: data.email || ''
        });
        alert("Customer found and auto-filled.");
      } else {
        alert("No existing customer found with this mobile.");
      }
    } catch (err) {
      alert("Error fetching customer or not found.");
    }
  };

  const fetchDriverByMobile = async (e) => {
    if (e) e.preventDefault();
    if (!driver.mobile) return;
    
    try {
      const { data, error } = await supabase.from('drivers').select('*').eq('mobile', driver.mobile).single();
      if (data) {
        setDriver({
          ...driver,
          name: data.name || '',
          vehicleNo: data.vehicle_number || '',
          model: data.vehicle_model || '',
          category: data.vehicle_category || 'Sedan',
          fuel: data.fuel_type || 'Petrol'
        });
        alert("Driver found and auto-filled.");
      } else {
        alert("No existing driver found with this mobile.");
      }
    } catch (err) {
      alert("Error fetching driver or not found.");
    }
  };

  // --- CALCULATIONS ---
  const isOurVehicle = serviceVehicleType === 'Our Vehicle';
  
  const activeExpenses = (isOurVehicle || showManualExpense) ? expenses : [];
  const cngTotal = cngEntries.reduce((acc, cng) => acc + (parseFloat(cng.amount) || 0), 0);
  const tollTotal = tollEntries.reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0);
  const otherTotal = activeExpenses.reduce((acc, ex) => acc + (parseFloat(ex.amount) || 0), 0);
  const totalTripExpenses = cngTotal + tollTotal + otherTotal;
  
  const totalDriverCollection = (parseFloat(collection.cash) || 0) + (parseFloat(collection.paytm) || 0) + (parseFloat(collection.upi) || 0) + (parseFloat(collection.bank) || 0);

  // Primary Profit Logic
  let profit = 0;
  let formulaUsed = '';
  let acceptedBookingAmount = parseFloat(fin.myAmount) || 0;

  // For Application/MakeMyTrip, "My Amount" acts as "My Booking Amount"
  if (sourceCategory === 'Application' && applicationName === 'MakeMyTrip') {
    acceptedBookingAmount = (parseFloat(fin.totalBookingAmount) || 0) - (parseFloat(fin.commissionAmount) || 0);
  }
  
  if (isOurVehicle) {
    profit = acceptedBookingAmount - totalTripExpenses;
    formulaUsed = 'my_amount - total_trip_expenses';
  } else {
    profit = acceptedBookingAmount - (parseFloat(fin.vendorOrDriverAmount) || 0);
    formulaUsed = 'my_amount - vendor_or_driver_amount';
  }

  // 5 & 6. Extra Collection / Payable Logic (Outsider Vehicle)
  let extraCollectionAmount = 0;
  let pendingExtraCollection = 0;
  let payableToDriverOrVendor = 0;

  const vendorAmount = parseFloat(fin.vendorOrDriverAmount) || 0;

  if (!isOurVehicle) {
    if (totalDriverCollection > vendorAmount) {
      extraCollectionAmount = totalDriverCollection - vendorAmount;
      pendingExtraCollection = extra.received === 'No' ? extraCollectionAmount : Math.max(0, extraCollectionAmount - (parseFloat(extra.receivedAmount) || 0));
    } else if (totalDriverCollection < vendorAmount) {
      payableToDriverOrVendor = vendorAmount - totalDriverCollection;
    }
  }

  // General Recovery logic for "Our Vehicle" if customer hasn't paid full
  let pendingRecovery = 0;
  if (isOurVehicle && totalDriverCollection < acceptedBookingAmount) {
    pendingRecovery = acceptedBookingAmount - totalDriverCollection;
  }

  // --- ROUTE AUTOGENERATION ---
  let generatedRoute = basic.pickup || 'Pickup';
  if (basic.tripType === 'Round-Trip Outstation' && coveredLocations.length > 0) {
    const validStops = coveredLocations.map(c => c.location).filter(s => s.trim() !== '');
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

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    if (!customer.name || !customer.mobile || !basic.pickup || !basic.drop || !sourceCategory || !serviceVehicleType || (!fin.myAmount && fin.myAmount !== 0)) {
      setSaveError("Validation Error: Please fill all required fields (Customer Name, Mobile, Pickup, Drop, Source, Service Type, My Amount).");
      setIsSaving(false);
      return;
    }

    const bookingData = {
      booking_id: bookingIdLabel,
      
      source_category: sourceCategory,
      source_name: sourceName,
      application_name: applicationName,
      group_name: groupName,
      advance_paytm_amount: parseFloat(advance.paytm) || 0,
      advance_payment_status: advance.status,
      advance_payment_date: advance.date || null,
      advance_notes: advance.notes,

      service_vehicle_type: serviceVehicleType,
      driver_ownership: driverOwnership,
      vehicle_ownership: vehicleOwnership,
      booking_status: basic.status,
      booking_date: basic.date,
      pickup_datetime: basic.pickupDate && basic.pickupDate.includes('T') ? `${basic.pickupDate}:00` : basic.pickupDate ? `${basic.pickupDate}T${basic.pickupTime || '00:00'}:00` : null,
      pickup_date: basic.pickupDate || null,
      pickup_time: basic.pickupTime || null,
      trip_type: basic.tripType,
      rental_package: basic.rentalPackage,
      number_of_days: parseInt(basic.days) || 1,
      pickup_location: basic.pickup,
      drop_location: basic.drop,
      covered_locations: coveredLocations,
      route: generatedRoute,
      notes: basic.notes,
      
      customer_name: customer.name,
      customer_mobile: customer.mobile,
      alternate_mobile: customer.altMobile,
      customer_email: customer.email,
      
      vendor_name: vendor.name,
      vendor_mobile: vendor.mobile,
      panel_owner: vendor.panelOwner,
      vendor_platform_name: vendor.platformName,
      
      driver_name: driver.name,
      driver_mobile: driver.mobile,
      vehicle_number: driver.vehicleNo,
      vehicle_model: driver.model,
      vehicle_brand: driver.brand,
      vehicle_category: driver.category,
      fuel_type: driver.fuel,
      
      customer_total_amount: parseFloat(fin.customerTotalAmount) || 0,
      my_amount: parseFloat(fin.myAmount) || 0,
      vendor_or_driver_amount: parseFloat(fin.vendorOrDriverAmount) || 0,
      driver_amount: driverOwnership === 'Outside Driver' ? (parseFloat(fin.vendorOrDriverAmount) || 0) : 0,
      total_booking_amount: parseFloat(fin.totalBookingAmount) || 0,
      commission_percentage: parseFloat(fin.commissionPercentage) || 0,
      commission_amount: parseFloat(fin.commissionAmount) || 0,
      
      collection_done_by: collection.doneBy,
      collection_mode: collection.mode,
      cash_collection_amount: parseFloat(collection.cash) || 0,
      paytm_collection_amount: parseFloat(collection.paytm) || 0,
      upi_collection_amount: parseFloat(collection.upi) || 0,
      bank_collection_amount: parseFloat(collection.bank) || 0,
      collection_total: totalDriverCollection,
      
      total_trip_expenses: totalTripExpenses,
      cng_entries: cngEntries,
      toll_entries: tollEntries,
      expense_cng: cngTotal,
      expense_petrol_filled: expenses.find(e => e.type === 'Petrol Filled')?.amount || 0,
      expense_petrol_running_km: expenses.find(e => e.type === 'Petrol Running KM')?.amount || 0,
      expense_toll: tollTotal,
      expense_state_tax: expenses.find(e => e.type === 'State Tax')?.amount || 0,
      expense_parking: expenses.find(e => e.type === 'Parking')?.amount || 0,
      expense_food: expenses.find(e => e.type === 'Food')?.amount || 0,
      expense_driver_advance: expenses.find(e => e.type === 'Driver Advance')?.amount || 0,
      expense_other: expenses.find(e => e.type === 'Other')?.amount || 0,

      profit: profit,
      pending_recovery_amount: isOurVehicle ? pendingRecovery : 0,
      payable_amount: payableToDriverOrVendor,
      receivable_amount: extraCollectionAmount,
      extra_collection_amount: extraCollectionAmount,
      pending_extra_collection: pendingExtraCollection,
      
      review_method: review.method,
      video_review_status: review.videoStatus,
      video_review_date: review.videoDate || null,
      review_link_sent: review.linkSent === 'Yes',
      review_link_sent_date: review.linkSentDate || null,
      review_received: review.received === 'Yes',
      rating: parseFloat(review.rating) || 0,
      review_url: review.url,
      follow_up_required: review.followUp === 'Yes'
    };

    try {
      let error;
      if (isEditMode) {
        const { error: updateError } = await supabase.from('bookings').update(bookingData).eq('id', id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('bookings').insert([bookingData]);
        error = insertError;
      }
      if (error) throw error;

      // Upsert Customer logic
      if (!isEditMode) { // Only increment counts if it's a new booking
        try {
          const { data: existingCust } = await supabase.from('customers').select('*').eq('mobile', customer.mobile).single();
          if (existingCust) {
            await supabase.from('customers').update({
              name: customer.name,
              alternate_mobile: customer.altMobile,
              email: customer.email,
              total_bookings: (existingCust.total_bookings || 0) + 1,
              total_revenue: Number(existingCust.total_revenue || 0) + Number(fin.myAmount || 0),
              last_trip_date: new Date().toISOString()
            }).eq('id', existingCust.id);
          } else {
            await supabase.from('customers').insert([{
              name: customer.name,
              mobile: customer.mobile,
              alternate_mobile: customer.altMobile,
              email: customer.email,
              total_bookings: 1,
              total_revenue: Number(fin.myAmount || 0),
              last_trip_date: new Date().toISOString()
            }]);
          }
        } catch (custErr) {
          console.error("Failed to upsert customer", custErr);
        }

        // Upsert Driver logic
        if (driver.name && driver.mobile) {
          let driverEarnings = 0;
          if (driverOwnership === 'Outside Driver') {
            driverEarnings = fin.vendorOrDriverAmount || 0;
          }
          
          try {
            const { data: existingDriver } = await supabase.from('drivers').select('*').eq('mobile', driver.mobile).single();
            if (existingDriver) {
              await supabase.from('drivers').update({
                name: driver.name,
                vehicle_number: driver.vehicleNo,
                vehicle_model: driver.model,
                vehicle_category: driver.category,
                fuel_type: driver.fuel,
                total_trips: (existingDriver.total_trips || 0) + 1,
                total_driver_amount: Number(existingDriver.total_driver_amount || 0) + Number(driverEarnings),
                last_trip_date: new Date().toISOString()
              }).eq('id', existingDriver.id);
            } else {
              await supabase.from('drivers').insert([{
                name: driver.name,
                mobile: driver.mobile,
                vehicle_number: driver.vehicleNo,
                vehicle_model: driver.model,
                vehicle_category: driver.category,
                fuel_type: driver.fuel,
                total_trips: 1,
                total_driver_amount: Number(driverEarnings),
                last_trip_date: new Date().toISOString()
              }]);
            }
          } catch (driverErr) {
            console.error("Failed to upsert driver", driverErr);
          }
        }
      }
      
      setShowModal(true);
    } catch (err) {
      setSaveError(err.message || "Failed to save booking. Please check database connection.");
    } finally {
      setIsSaving(false);
    }
  };

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
                  <select className="form-control" style={{fontWeight:'700', color:'#0044FF'}} value={sourceCategory} onChange={e => setSourceCategory(e.target.value)}>
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
                {sourceCategory === 'Direct' && (
                  <div className="form-group">
                    <label>Customer Type</label>
                    <select className="form-control" value={directCustomerType} onChange={e => setDirectCustomerType(e.target.value)}>
                      <option>New Customer</option>
                      <option>Old Customer</option>
                      <option>Reference</option>
                    </select>
                  </div>
                )}
                {sourceCategory === 'Direct' && directCustomerType === 'Reference' && (
                  <>
                    <div className="form-group"><label>Referred By Name</label><input type="text" className="form-control" /></div>
                    <div className="form-group"><label>Referred By Mobile</label><input type="text" className="form-control" /></div>
                  </>
                )}
                {sourceCategory === 'Direct' && directCustomerType === 'Old Customer' && (
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
                {['Vendor', 'Group', 'MYF', 'Taxi Sanchalak'].includes(sourceCategory) && (
                  <>
                    <div className="form-group"><label>Source Vendor Name</label><input type="text" className="form-control" /></div>
                    <div className="form-group"><label>Source Vendor Mobile</label><input type="text" className="form-control" /></div>
                  </>
                )}
                {sourceCategory === 'Group' && (
                  <>
                    <div className="form-group"><label>Group Name</label><input type="text" className="form-control" value={groupName} onChange={e => setGroupName(e.target.value)} /></div>
                    <div className="form-group"><label>Advance Paid via Paytm</label><input type="number" className="form-control" value={advance.paytm} onChange={e => setAdvance({...advance, paytm: e.target.value})} /></div>
                    <div className="form-group">
                      <label>Advance Payment Status</label>
                      <select className="form-control" value={advance.status} onChange={e => setAdvance({...advance, status: e.target.value})}>
                        <option>Pending</option><option>Received</option>
                      </select>
                    </div>
                  </>
                )}
                {sourceCategory === 'Taxi Sanchalak' && (
                  <div className="form-group"><label>Application Name</label><input type="text" className="form-control" value={applicationName} onChange={e => setApplicationName(e.target.value)} /></div>
                )}
                {sourceCategory === 'Savaari' && (
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
                {sourceCategory === 'Taxi Sanchalak' && (
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
                <div className="form-group"><label>Booking ID</label><input type="text" className="form-control" value={bookingIdLabel} disabled /></div>
                <div className="form-group">
                  <label>Booking Status</label>
                  <select className="form-control" style={{fontWeight:'700', color: basic.status==='Confirmed' ? '#00C853' : '#0044FF'}} value={basic.status} onChange={e => setBasic({...basic, status: e.target.value})}>
                    <option>Pending</option><option>Confirmed</option><option>In Progress</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </div>
                <div className="form-group"><label>Booking Date</label><input type="date" className="form-control" value={basic.date} onChange={e => setBasic({...basic, date: e.target.value})} /></div>
                <div className="form-group"><label>Pickup Date</label><input type="date" className="form-control" value={basic.pickupDate} onChange={e => setBasic({...basic, pickupDate: e.target.value})} /></div>
                <div className="form-group"><label>Pickup Time</label><input type="time" className="form-control" value={basic.pickupTime} onChange={e => setBasic({...basic, pickupTime: e.target.value})} /></div>
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
                <div className="form-group"><label>Customer Name</label><input type="text" className="form-control" placeholder="Full Name" value={customer.name} onChange={e => setCustomer({...customer, name: toTitleCase(e.target.value)})} /></div>
                <div className="form-group">
                  <label>Customer Mobile</label>
                  <div style={{display:'flex', gap:'0.5rem'}}>
                    <input type="text" className="form-control" placeholder="+91 XXXXX XXXXX" value={customer.mobile} onChange={e => setCustomer({...customer, mobile: e.target.value})} style={{flex: 1}} />
                    <button onClick={fetchCustomerByMobile} type="button" className="btn-modal-secondary" style={{padding:'0 1rem', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>Fetch</button>
                  </div>
                </div>
                <div className="form-group"><label>Alternate Mobile</label><input type="text" className="form-control" placeholder="+91 XXXXX XXXXX" value={customer.altMobile} onChange={e => setCustomer({...customer, altMobile: e.target.value})} /></div>
                <div className="form-group"><label>Email (Optional)</label><input type="email" className="form-control" placeholder="customer@email.com" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} /></div>
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
                <div className="form-group"><label>Driver Name</label><input type="text" className="form-control" value={driver.name} onChange={e => setDriver({...driver, name: toTitleCase(e.target.value)})} /></div>
                <div className="form-group">
                  <label>Driver Mobile</label>
                  <div style={{display:'flex', gap:'0.5rem'}}>
                    <input type="text" className="form-control" value={driver.mobile} onChange={e => setDriver({...driver, mobile: e.target.value})} style={{flex: 1}} />
                    <button onClick={fetchDriverByMobile} type="button" className="btn-modal-secondary" style={{padding:'0 1rem', borderRadius:'6px', cursor:'pointer', fontWeight:'600'}}>Fetch</button>
                  </div>
                </div>
                <div className="form-group"><label>Vehicle Number</label><input type="text" className="form-control" value={driver.vehicleNo} onChange={e => setDriver({...driver, vehicleNo: formatVehicleNumber(e.target.value)})} /></div>
                <div className="form-group"><label>Vehicle Model</label><input type="text" className="form-control" value={driver.model} onChange={e => setDriver({...driver, model: toTitleCase(e.target.value)})} /></div>
                <div className="form-group"><label>Category</label><select className="form-control" value={driver.category} onChange={e => setDriver({...driver, category: e.target.value})}><option>Sedan</option><option>SUV</option><option>Hatchback</option></select></div>
                {isOurVehicle && (
                  <div className="form-group"><label>Fuel Type</label><select className="form-control" value={driver.fuel} onChange={e => setDriver({...driver, fuel: e.target.value})}><option>Petrol</option><option>Diesel</option><option>CNG</option><option>EV</option></select></div>
                )}
              </div>
            </div>

            {/* 5. Financial Details */}
            <div className="form-section">
              <div className="form-section-header">
                <Wallet size={18} /> Financial Details
              </div>
              
              <div className="form-grid form-grid-3">
                <div className="form-group">
                  <label>Customer Total Amount</label>
                  <input type="number" name="customerTotalAmount" value={fin.customerTotalAmount} onChange={handleFinChange} className="form-control" style={{background:'#FFFBEB', borderColor:'#FDE68A'}} />
                </div>
                {/* Standard My Amount for Direct, Savaari, Group, Vendor, Other */}
                {['Direct', 'Savaari', 'Group', 'Vendor', 'Other', 'Taxi Sanchalak'].includes(sourceCategory) && (
                  <div className="form-group">
                    <label>My Amount (Accepted Booking Amt)</label>
                    <input type="number" name="myAmount" value={fin.myAmount} onChange={handleFinChange} className="form-control" style={{background:'#F0FDF4', borderColor:'#86EFAC'}} />
                  </div>
                )}
                
                {sourceCategory === 'MYF' && (
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
                    
                    {/* CNG Entries */}
                    <div style={{marginBottom:'1.5rem', background:'#F8FAFC', padding:'1rem', borderRadius:'8px', border:'1px solid #E2E8F0'}}>
                      <div style={{fontWeight:'600', fontSize:'0.9rem', marginBottom:'0.75rem', color:'#1E293B'}}>CNG Entries</div>
                      {cngEntries.map((cng, i) => (
                        <div className="expense-row" key={`cng-${i}`} style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem'}}>
                          <input type="text" className="form-control" placeholder="CNG Location/Notes" value={cng.notes||''} onChange={e => {
                            const newArr = [...cngEntries]; newArr[i].notes = e.target.value; setCngEntries(newArr);
                          }} style={{flex:2}} />
                          <input type="number" className="form-control" placeholder="₹ Amount" value={cng.amount||''} onChange={e => {
                            const newArr = [...cngEntries]; newArr[i].amount = e.target.value; setCngEntries(newArr);
                          }} style={{flex:1}} />
                          <button className="btn-remove-expense" onClick={() => setCngEntries(cngEntries.filter((_, idx)=>idx!==i))} style={{flexShrink:0}}><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button className="btn-add-expense" onClick={() => setCngEntries([...cngEntries, {notes:'', amount:''}])}><Plus size={14} /> Add CNG</button>
                    </div>

                    {/* Toll Entries */}
                    <div style={{marginBottom:'1.5rem', background:'#F8FAFC', padding:'1rem', borderRadius:'8px', border:'1px solid #E2E8F0'}}>
                      <div style={{fontWeight:'600', fontSize:'0.9rem', marginBottom:'0.75rem', color:'#1E293B'}}>Toll Entries</div>
                      {tollEntries.map((toll, i) => (
                        <div className="expense-row" key={`toll-${i}`} style={{display:'flex', gap:'0.5rem', marginBottom:'0.5rem'}}>
                          <input type="text" className="form-control" placeholder="Toll Name" value={toll.name||''} onChange={e => {
                            const newArr = [...tollEntries]; newArr[i].name = e.target.value; setTollEntries(newArr);
                          }} style={{flex:2}} />
                          <input type="number" className="form-control" placeholder="₹ Amount" value={toll.amount||''} onChange={e => {
                            const newArr = [...tollEntries]; newArr[i].amount = e.target.value; setTollEntries(newArr);
                          }} style={{flex:1}} />
                          <button className="btn-remove-expense" onClick={() => setTollEntries(tollEntries.filter((_, idx)=>idx!==i))} style={{flexShrink:0}}><Trash2 size={16}/></button>
                        </div>
                      ))}
                      <button className="btn-add-expense" onClick={() => setTollEntries([...tollEntries, {name:'', amount:''}])}><Plus size={14} /> Add Toll</button>
                    </div>

                    <div style={{fontWeight:'600', fontSize:'0.9rem', marginBottom:'0.75rem', color:'#1E293B'}}>Other Trip Expenses</div>
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
                  <div className="metric-row"><span className="metric-label">Booking Source</span><span className="metric-val">{sourceCategory}</span></div>
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
                {saveError && (
                  <div style={{background:'#FEF2F2', border:'1px solid #FCA5A5', padding:'0.5rem', borderRadius:'6px', color:'#DC2626', fontSize:'0.8rem', fontWeight:'600'}}>
                    ⚠️ Error: {saveError}
                  </div>
                )}
                <div style={{display:'flex', gap:'0.5rem'}}>
                  <button className="btn-modal-secondary" style={{flex:1, borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem', cursor:'pointer'}}><Eye size={16}/> Preview Inv</button>
                  <button className="btn-modal-secondary" style={{flex:1, borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem', cursor:'pointer'}}><Eye size={16}/> Preview Quote</button>
                </div>
                <button className="btn-modal-secondary" style={{borderRadius:'8px', padding:'0.75rem', fontSize:'0.85rem', cursor:'pointer', fontWeight:'700'}} onClick={() => {}} disabled={isSaving}><Edit3 size={16}/> Save Draft</button>
                <button className="btn-save-booking" onClick={handleSave} disabled={isSaving} style={{opacity: isSaving ? 0.7 : 1}}>
                  <Save size={20} /> {isSaving ? 'Saving...' : (isEditMode ? 'Update Booking' : 'Save Master Booking')}
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
            <div className="modal-title">Booking {isEditMode ? 'Updated' : 'Saved'} Successfully!</div>
            <div className="modal-subtitle">{bookingIdLabel} has been successfully {isEditMode ? 'updated' : 'recorded'}.</div>
            
            <div className="modal-actions">
              <button className="btn-modal btn-modal-primary" onClick={() => setShowModal(false)}><PlusCircle size={16} /> Save & New Booking</button>
              <button className="btn-modal btn-modal-secondary" onClick={() => navigate('/all-bookings')}><FileText size={16} /> View All Bookings</button>
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
