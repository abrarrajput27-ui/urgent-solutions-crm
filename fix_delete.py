import sys

with open('src/components/AllBookings.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix soft delete
old_soft_delete = '''        if (window.confirm("Move this booking to Trash?")) {
          try {
            const { error } = await supabase.from('bookings').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
            // IT IS MISSING: setBookings(bookings.filter(b => b.id !== id)); !!!'''

new_soft_delete = '''        if (window.confirm("Move this booking to Trash?")) {
          try {
            const { error } = await supabase.from('bookings').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
            setBookings(bookings.filter(b => b.id !== id));'''

if "IT IS MISSING" in content:
    content = content.replace(old_soft_delete, new_soft_delete)
else:
    # Let's do a more robust replace
    old_sd2 = '''        if (window.confirm("Move this booking to Trash?")) {
          try {
            const { error } = await supabase.from('bookings').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
            '''
    new_sd2 = '''        if (window.confirm("Move this booking to Trash?")) {
          try {
            const { error } = await supabase.from('bookings').update({ is_deleted: true, deleted_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
            setBookings(bookings.filter(b => b.id !== id));
            '''
    content = content.replace(old_sd2, new_sd2)


with open('src/components/AllBookings.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed handleDelete in AllBookings.jsx")
