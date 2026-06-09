const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) env[key.trim()] = values.join('=').trim();
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function runTests() {
  console.log('--- STARTING SCHEMA VALIDATION TESTS ---');

  const baseBooking = {
    booking_id: 'TEST-' + Date.now(),
    customer_name: 'Test Customer',
    customer_mobile: '9999999999',
    pickup_location: 'Delhi',
    drop_location: 'Agra',
    service_vehicle_type: 'Our Vehicle',
    booking_status: 'Pending',
    my_amount: 5000,
    total_trip_expenses: 1000,
    profit: 4000
  };

  // Scenario 1: Direct Booking, Our Vehicle
  let { data: b1, error: e1 } = await supabase.from('bookings').insert([{
    ...baseBooking,
    booking_id: 'TEST-DIR-' + Date.now(),
    source_category: 'Direct',
    driver_ownership: 'Our Driver',
    total_booking_amount: 5000
  }]).select();
  if(e1) console.error('Scenario 1 Insert Failed:', e1);
  else console.log('Scenario 1 Insert: SUCCESS (ID:', b1[0].id, ')');

  // Scenario 2: Group Booking, Outsider Vehicle
  let { data: b2, error: e2 } = await supabase.from('bookings').insert([{
    ...baseBooking,
    booking_id: 'TEST-GRP-' + Date.now(),
    source_category: 'Group',
    group_name: 'Travel Group A',
    service_vehicle_type: 'Outsider / Arranged Vehicle',
    vendor_amount: 4000
  }]).select();
  if(e2) console.error('Scenario 2 Insert Failed:', e2);
  else console.log('Scenario 2 Insert: SUCCESS (ID:', b2[0].id, ')');

  // Scenario 3: Edit Works
  if (b1 && b1.length > 0) {
    let { data: b3, error: e3 } = await supabase.from('bookings').update({
      notes: 'Updated Test Note',
      profit: 4500
    }).eq('id', b1[0].id).select();
    if(e3) console.error('Scenario 3 Update Failed:', e3);
    else console.log('Scenario 3 Update: SUCCESS. Profit updated to:', b3[0].profit);
  }

  // Scenario 4: Delete Works (Soft Delete)
  if (b2 && b2.length > 0) {
    let { data: b4, error: e4 } = await supabase.from('bookings').update({
      is_deleted: true,
      deleted_at: new Date().toISOString()
    }).eq('id', b2[0].id).select();
    if(e4) console.error('Scenario 4 Delete Failed:', e4);
    else console.log('Scenario 4 Soft Delete: SUCCESS. is_deleted=', b4[0].is_deleted);

    // Scenario 5: Restore Works
    let { data: b5, error: e5 } = await supabase.from('bookings').update({
      is_deleted: false,
      deleted_at: null
    }).eq('id', b2[0].id).select();
    if(e5) console.error('Scenario 5 Restore Failed:', e5);
    else console.log('Scenario 5 Restore: SUCCESS. is_deleted=', b5[0].is_deleted);
  }

  // Cleanup: Hard delete test bookings
  if (b1) await supabase.from('bookings').delete().eq('id', b1[0].id);
  if (b2) await supabase.from('bookings').delete().eq('id', b2[0].id);
  console.log('--- TESTS COMPLETED AND CLEANED UP ---');
}
runTests();
