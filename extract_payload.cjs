const fs = require('fs');
const content = fs.readFileSync('src/components/BookingModule.jsx', 'utf-8');

const regex = /const bookingData = \{([\s\S]*?)\};\s*try \{/m;
const match = content.match(regex);
if (match) {
  const block = match[1];
  const keys = block.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith('//'))
    .map(line => line.split(':')[0].trim());
  console.log('Keys in bookingData payload:');
  console.log(keys);
} else {
  console.log('Payload not found');
}
