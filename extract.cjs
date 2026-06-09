const fs = require('fs');
const files = fs.readdirSync('src/components').filter(f => f.endsWith('.jsx'));

const allCols = new Set();
const payloadCols = new Set();

files.forEach(f => {
  const content = fs.readFileSync('src/components/' + f, 'utf-8');
  // Find all data.some_col
  const matches = content.match(/data\.([a-zA-Z0-9_]+)/g);
  if (matches) {
    matches.forEach(m => allCols.add(m.split('.')[1]));
  }
  // Find all b.some_col or booking.some_col
  const matches2 = content.match(/booking\.([a-zA-Z0-9_]+)/g);
  if (matches2) {
    matches2.forEach(m => allCols.add(m.split('.')[1]));
  }
  const matches3 = content.match(/[^a-zA-Z0-9_]b\.([a-zA-Z0-9_]+)/g);
  if (matches3) {
    matches3.forEach(m => allCols.add(m.split('.')[1]));
  }
  const matches4 = content.match(/bookingData\.([a-zA-Z0-9_]+)/g);
  if (matches4) {
    matches4.forEach(m => allCols.add(m.split('.')[1]));
  }
});

console.log('Columns found in code:');
console.log(Array.from(allCols));
