import sys

with open('src/components/BookingModule.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = '''                        </div>
                      ))}
                      
                    </div>
                  )}'''

new_str = '''                        </div>
                      ))}
                      <button className="btn-modal-secondary" style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', marginTop: '0.5rem'}} onClick={() => setBasic({...basic, stops: [...(basic.stops || []), '']})}>+ Add Stop</button>
                    </div>
                  )}'''

content = content.replace(old_str, new_str)

with open('src/components/BookingModule.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Add Stop button")
