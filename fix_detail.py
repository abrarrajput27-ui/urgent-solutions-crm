import sys

with open('src/components/BookingDetail.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix detail-grid-container duplicate className
content = content.replace('className="detail-grid-container" className="responsive-grid" style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'1.5rem\', alignItems: \'start\' }}',
'className="responsive-grid" style={{ gap: \'1.5rem\', alignItems: \'start\' }}')

content = content.replace('className="responsive-grid" style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'1rem\' }}',
'className="responsive-grid" style={{ gap: \'1rem\' }}')

content = content.replace('className="responsive-grid" style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'1rem\', marginBottom: \'1rem\' }}',
'className="responsive-grid" style={{ gap: \'1rem\', marginBottom: \'1rem\' }}')

content = content.replace('className="responsive-grid" style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'x 1rem\' }}',
'className="responsive-grid" style={{ gap: \'1rem\' }}')

content = content.replace('className="responsive-grid" style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: \'0.5rem\' }}',
'className="responsive-grid" style={{ gap: \'0.5rem\' }}')

with open('src/components/BookingDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed BookingDetail.jsx duplicate classes and inline grids")
