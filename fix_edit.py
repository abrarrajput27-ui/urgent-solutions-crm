import sys

with open('src/components/BookingModule.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_basic = '''          setBasic({
            status: data.booking_status || 'Pending',
            date: data.booking_date || '',
            pickupDate: data.pickup_date || (data.pickup_datetime ? data.pickup_datetime.split('T')[0] : ''),
            pickupTime: data.pickup_time || (data.pickup_datetime && data.pickup_datetime.includes('T') ? data.pickup_datetime.split('T')[1].substring(0, 5) : ''),
            tripType: data.trip_type || 'One-Way Drop',
            rentalPackage: data.rental_package || '',
            pickup: data.pickup_location || '',
            drop: data.drop_location || '',
            notes: data.notes || ''
          });'''

new_basic = '''          setBasic({
            status: data.booking_status || 'Pending',
            date: data.booking_date || '',
            pickupDate: data.pickup_date || (data.pickup_datetime ? data.pickup_datetime.split('T')[0] : ''),
            pickupTime: data.pickup_time || (data.pickup_datetime && data.pickup_datetime.includes('T') ? data.pickup_datetime.split('T')[1].substring(0, 5) : ''),
            tripType: data.trip_type || 'One-Way Drop',
            rentalPackage: data.rental_package || '',
            days: data.number_of_days || 1,
            pickup: data.pickup_location || '',
            drop: data.drop_location || '',
            notes: data.notes || ''
          });'''

if old_basic in content:
    content = content.replace(old_basic, new_basic)
    with open('src/components/BookingModule.jsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed basic.days in BookingModule.jsx")
else:
    print("Could not find basic block")
