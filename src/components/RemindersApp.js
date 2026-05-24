import React, { useState, useEffect } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const fmt12 = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export default function RemindersApp() {
  const [data, setData] = useState({ reminders: [], items: [] });
  const [newItemText, setNewItemText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('senior-grocery-data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading data:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever data changes
    localStorage.setItem('senior-grocery-data', JSON.stringify(data));
  }, [data]);

  const toggleReminder = (id) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.map(r =>
        r.id === id ? { ...r, active: !r.active } : r
      )
    }));
  };

  const deleteReminder = (id) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
  };

  const addReminder = () => {
    const newReminder = {
      id: Date.now(),
      label: 'New Reminder',
      time: '10:00',
      days: [],
      active: true
    };
    setData(prev => ({
      ...prev,
      reminders: [...prev.reminders, newReminder]
    }));
  };

  const toggleItem = (id) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const addItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now(),
        text: newItemText,
        checked: false
      };
      setData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
      setNewItemText('');
    }
  };

  const deleteItem = (id) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{
      width: '100%',
      maxWidth: 480,
      background: '#fff',
      borderRadius: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      fontFamily: 'Georgia, serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #d4a574 0%, #c0956f 100%)',
        padding: '32px 24px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
        <div style={{ fontSize: 32, fontWeight: 'bold' }}>Senior Grocery</div>
        <div style={{ fontSize: 16, marginTop: 8, opacity: 0.9 }}>Your grocery reminder app</div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #eee',
        background: '#fafafa'
      }}>
        {['Shopping List', 'Reminders'].map(tab => (
          <button
            key={tab}
            style={{
              flex: 1,
              padding: '16px',
              border: 'none',
              background: 'transparent',
              fontSize: 16,
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              color: '#666',
              borderBottom: tab === 'Shopping List' ? '3px solid #d4a574' : 'none',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 16px' }}>
        {/* Shopping List Section */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Add item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: 16,
                borderRadius: 12,
                border: '2px solid #eee',
                fontFamily: 'Georgia, serif',
                outline: 'none',
                transition: 'border 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d4a574'}
              onBlur={(e) => e.target.style.borderColor = '#eee'}
            />
            <button
              onClick={addItem}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '12px 16px',
                fontSize: 16,
                fontWeight: 'bold',
                borderRadius: 12,
                border: 'none',
                background: '#d4a574',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#c0956f'}
              onMouseLeave={(e) => e.target.style.background = '#d4a574'}
            >
              + Add Item
            </button>
          </div>

          {data.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 24px', color: '#b0a090' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>📝</div>
              <div style={{ fontSize: 22 }}>No items yet</div>
            </div>
          ) : (
            data.items.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px',
                marginBottom: 12,
                borderRadius: 12,
                background: item.checked ? '#f0f0f0' : '#fffaf5',
                border: `2px solid ${item.checked ? '#ddd' : '#fde8c8'}`
              }}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                  style={{
                    width: 24,
                    height: 24,
                    cursor: 'pointer',
                    accentColor: '#d4a574'
                  }}
                />
                <div style={{
                  flex: 1,
                  fontSize: 18,
                  color: item.checked ? '#aaa' : '#2c1a0e',
                  textDecoration: item.checked ? 'line-through' : 'none'
                }}>
                  {item.text}
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={{
                    padding: '8px 12px',
                    fontSize: 16,
                    borderRadius: 8,
                    border: 'none',
                    background: '#fde8c8',
                    color: '#c0392b',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {/* Reminders Section */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={addReminder}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: 16,
              fontWeight: 'bold',
              borderRadius: 12,
              border: 'none',
              background: '#d4a574',
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              marginBottom: 20,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#c0956f'}
            onMouseLeave={(e) => e.target.style.background = '#d4a574'}
          >
            + Add Reminder
          </button>

          {data.reminders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 24px', color: '#b0a090' }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🔔</div>
              <div style={{ fontSize: 22 }}>No reminders set yet</div>
            </div>
          ) : (
            data.reminders.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px',
                borderRadius: 16, marginBottom: 12,
                border: `2px solid ${r.active ? '#fde8c8' : '#eee'}`,
                background: r.active ? '#fffaf5' : '#f8f8f8'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 'bold', color: r.active ? '#2c1a0e' : '#aaa' }}>{r.label}</div>
                  <div style={{ fontSize: 24, color: r.active ? '#c0392b' : '#bbb', marginTop: 4 }}>{fmt12(r.time)}</div>
                  <div style={{ fontSize: 16, color: '#a08060', marginTop: 2 }}>
                    {r.days.length === 0 ? 'Every day' : r.days.map(d => DAYS[d]).join(', ')}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => toggleReminder(r.id)} style={{
                    padding: '10px 16px', fontSize: 18, borderRadius: 12,
                    border: 'none', cursor: 'pointer', fontFamily: 'Georgia, serif',
                    background: r.active ? '#27ae60' : '#aaa', color: '#fff', transition: 'all 0.2s'
                  }}>
                    {r.active ? 'ON' : 'OFF'}
                  </button>
                  <button onClick={() => deleteReminder(r.id)} style={{
                    padding: '10px 16px', fontSize: 18, borderRadius: 12,
                    border: 'none', cursor: 'pointer', background: '#fde8c8',
                    color: '#c0392b', fontFamily: 'Georgia, serif'
                  }}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '8px 16px 24px', color: '#b0a090', fontSize: 15 }}>
        Tap items to check them off • Your list saves automatically
      </div>
    </div>
  );
}
