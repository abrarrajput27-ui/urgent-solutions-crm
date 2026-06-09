import sys
import re

with open('src/components/BookingModule.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: Route Autogeneration
old_route = '''let generatedRoute = basic.pickup || 'Pickup';
  if (basic.tripType === 'Round-Trip Outstation' && coveredLocations.length > 0) {
    const validStops = coveredLocations.map(c => c.location).filter(s => s.trim() !== '');
    if (validStops.length > 0) {
      generatedRoute += ' -> ' + validStops.join(' -> ');
    }
  }'''
new_route = '''let generatedRoute = basic.pickup || 'Pickup';
  if (basic.tripType === 'Round-Trip Outstation' && basic.stops && basic.stops.length > 0) {
    const validStops = basic.stops.filter(s => s && s.trim() !== '');
    if (validStops.length > 0) {
      generatedRoute += ' -> ' + validStops.join(' -> ');
    }
  }'''
content = content.replace(old_route, new_route)

# Fix 2: Remove setCoveredLocations
content = content.replace('setCoveredLocations(Array.isArray(data.covered_locations) ? data.covered_locations : []);', '')
content = content.replace('const [coveredLocations, setCoveredLocations] = useState([]);', '')

# Fix 3: Add stops to setBasic
old_setbasic = '''tripType: data.trip_type || 'One-Way Outstation',
            rentalPackage: data.rental_package || '',
            pickup: data.pickup_location || '',
            drop: data.drop_location || '',
            route: data.route || '',
            days: data.number_of_days || '',
            notes: data.notes || ''
          });'''
new_setbasic = '''tripType: data.trip_type || 'One-Way Outstation',
            rentalPackage: data.rental_package || '',
            pickup: data.pickup_location || '',
            drop: data.drop_location || '',
            route: data.route || '',
            days: data.number_of_days || '',
            stops: Array.isArray(data.covered_locations) ? data.covered_locations : [],
            notes: data.notes || ''
          });'''
content = content.replace(old_setbasic, new_setbasic)

# Fix 4: covered_locations payload
content = content.replace('covered_locations: coveredLocations,', 'covered_locations: basic.stops || [],')

with open('src/components/BookingModule.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed stops tracking")
