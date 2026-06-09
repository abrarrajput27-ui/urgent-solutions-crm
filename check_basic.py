import sys
import re

with open('src/components/BookingModule.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = re.compile(r'setBasic\(\{\s*status: data\.booking_status \|\| \'Pending\',\s*date: data\.booking_date \|\| \'\',\s*pickupDate: data\.pickup_date \|\| \(data\.pickup_datetime \? data\.pickup_datetime\.split\(\'T\'\)\[0\] : \'\'\),\s*pickupTime: data\.pickup_time \|\| \(data\.pickup_datetime && data\.pickup_datetime\.includes\(\'T\'\) \? data\.pickup_datetime\.split\(\'T\'\)\[1\]\.substring\(0, 5\) : \'\'\),\s*tripType: data\.trip_type \|\| \'One-Way Outstation\',\s*rentalPackage: data\.rental_package \|\| \'\',\s*pickup: data\.pickup_location \|\| \'\',\s*drop: data\.drop_location \|\| \'\',\s*route: data\.route \|\| \'\',\s*days: data\.number_of_days \|\| \'\',\s*notes: data\.notes \|\| \'\'\s*\}\);', re.DOTALL)

new_basic = '''setBasic({
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
          });'''
          
# Wait, I realized days: data.number_of_days || '' is ALREADY THERE!
print("Already there! No need to replace.")

