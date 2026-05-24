import { useState, useEffect } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fmt12 = (time) => {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

export default function Home() {
  const [cart, setCart] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedChecklist = localStorage.getItem('checklist');
    const savedReminders = localStorage.getItem('reminders');
    
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedChecklist) setChecklist(JSON.parse(savedChecklist));
    if (savedReminders) setReminders(JSON.parse(savedReminders));
    
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('checklist', JSON.stringify(checklist));
    }
  }, [checklist, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('reminders', JSON.stringify(reminders));
    }
  }, [reminders, isLoading]);

  const products = [
    { id: 1, name: 'Fresh Apples', price: '$3.99', category: 'Fruits', emoji: '🍎' },
    { id: 2, name: 'Organic Milk', price: '$4.49', category: 'Dairy', emoji: '🥛' },
    { id: 3, name: 'Whole Wheat Bread', price: '$2.99', category: 'Bakery', emoji: '🍞' },
    { id: 4, name: 'Carrots', price: '$1.49', category: 'Vegetables', emoji: '🥕' },
    { id: 5, name: 'Eggs (Dozen)', price: '$5.99', category: 'Dairy', emoji: '🥚' },
    { id: 6, name: 'Bananas', price: '$2.49', category: 'Fruits', emoji: '🍌' },
    { id: 7, name: 'Chicken Breast', price: '$8.99', category: 'Meat', emoji: '🍗' },
    { id: 8, name: 'Tomatoes', price: '$3.49', category: 'Vegetables', emoji: '🍅' },
  ];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addChecklistItem = () => {
    const name = prompt('Enter item name:');
    if (name && name.trim()) {
      setChecklist([...checklist, { id: Date.now(), name, completed: false }]);
    }
  };

  const deleteChecklistItem = (id) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const addReminder = () => {
    const label = prompt('Enter reminder (e.g., Take Medications):');
    if (label && label.trim()) {
      const time = prompt('Enter time (HH:MM) e.g., 09:00:');
      if (time && time.match(/^\d{2}:\d{2}$/)) {
        setReminders([...reminders, {
          id: Date.now(),
          label,
          time,
          active: true,
          days: [0, 1, 2, 3, 4, 5, 6]
        }]);
      } else {
        alert('Please enter time in HH:MM format');
      }
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.quantity), 0).toFixed(2);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: 20 }}>Loading...</div>;
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif', backgroundColor: '#faf8f3', minHeight: '100vh', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#d4a574', padding: '20px', textAlign: 'center', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>🛒 Senior Grocery</div>
        <div style={{ fontSize: 16 }}>Easy Shopping, Made Simple</div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #d4a574', backgroundColor: '#fff', overflowX: 'auto' }}>
        {[
          { id: 'home', label: '🏠 Home' },
          { id: 'cart', label: '🛒 Cart', badge: cart.length },
          { id: 'checklist', label: '✓ List', badge: checklist.length },
          { id: 'reminders', label: '🔔 Reminders', badge: reminders.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '16px 12px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? '#fffaf5' : '#fff',
              borderBottom: activeTab === tab.id ? '4px solid #d4a574' : 'none',
              fontSize: 16,
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              color: activeTab === tab.id ? '#2c1a0e' : '#b0a090',
              whiteSpace: 'nowrap',
              position: 'relative'
            }}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span style={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: '#d4a574',
                color: '#fff',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 'bold'
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '24px 16px', minHeight: 'calc(100vh - 200px)' }}>
        {activeTab === 'home' && (
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c1a0e' }}>Browse Groceries</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {products.map(product => (
                <div key={product.id} style={{
                  backgroundColor: '#fff',
                  border: '2px solid #e8dcc8',
                  borderRadius: 12,
                  padding: 16,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  minHeight: 200
                }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>{product.emoji}</div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#2c1a0e', marginBottom: 4 }}>{product.name}</div>
                  <div style={{ fontSize: 14, color: '#b0a090', marginBottom: 8 }}>{product.category}</div>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#d4a574', marginBottom: 12 }}>{product.price}</div>
                  <button onClick={() => addToCart(product)} style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#d4a574',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c49461'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d4a574'}
                  >Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2c1a0e' }}>Shopping Cart ({cart.length})</div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 24px', color: '#b0a090' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                <div style={{ fontSize: 20 }}>Cart is empty</div>
                <div style={{ fontSize: 16, marginTop: 8, color: '#a08060' }}>Add items from the home tab</div>
              </div>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    padding: '16px',
                    borderRadius: 8,
                    marginBottom: 12,
                    border: '1px solid #e8dcc8'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#2c1a0e' }}>{item.name}</div>
                      <div style={{ fontSize: 16, color: '#d4a574', marginTop: 4 }}>{item.price} × {item.quantity} = ${(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{
                      padding: '8px 12px',
                      backgroundColor: '#fde8c8',
                      color: '#c0392b',
                      border: 'none',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 16,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fdd4a8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fde8c8'}
                    >🗑 Remove</button>
                  </div>
                ))}
                <div style={{
                  backgroundColor: '#fffaf5',
                  padding: '16px',
                  borderRadius: 8,
                  marginTop: 20,
                  borderTop: '2px solid #d4a574'
                }}>
                  <div style={{ fontSize: 20, fontWeight: 'bold', color: '#2c1a0e', marginBottom: 12 }}>Total: ${cartTotal}</div>
                  <button style={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#27ae60',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#229954'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
                  >Proceed to Checkout</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'checklist' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2c1a0e' }}>My Checklist ({checklist.length})</div>
              <button onClick={addChecklistItem} style={{
                padding: '10px 16px',
                backgroundColor: '#d4a574',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
                fontFamily: 'Georgia, serif',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c49461'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d4a574'}
              >+ Add Item</button>
            </div>
            {checklist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 24px', color: '#b0a090' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
                <div style={{ fontSize: 20 }}>No items yet</div>
                <div style={{ fontSize: 16, marginTop: 8, color: '#a08060' }}>Click + Add Item to create a list</div>
              </div>
            ) : (
              checklist.map(item => (
                <div key={item.id} onClick={() => toggleChecklistItem(item.id)} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px',
                  backgroundColor: item.completed ? '#f0f0f0' : '#fff',
                  borderRadius: 8,
                  marginBottom: 12,
                  border: `2px solid ${item.completed ? '#ddd' : '#d4a574'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    backgroundColor: item.completed ? '#27ae60' : '#fff',
                    border: `2px solid ${item.completed ? '#27ae60' : '#d4a574'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    flexShrink: 0
                  }}>{item.completed ? '✓' : ''}</div>
                  <div style={{
                    flex: 1,
                    fontSize: 18,
                    color: item.completed ? '#999' : '#2c1a0e',
                    textDecoration: item.completed ? 'line-through' : 'none'
                  }}>{item.name}</div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    deleteChecklistItem(item.id);
                  }} style={{
                    padding: '6px 10px',
                    backgroundColor: '#fde8c8',
                    color: '#c0392b',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14
                  }}>🗑</button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'reminders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#2c1a0e' }}>Reminders ({reminders.length})</div>
              <button onClick={addReminder} style={{
                padding: '10px 16px',
                backgroundColor: '#d4a574',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
                fontFamily: 'Georgia, serif',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c49461'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d4a574'}
              >+ Add Reminder</button>
            </div>
            {reminders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 24px', color: '#b0a090' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🔔</div>
                <div style={{ fontSize: 22 }}>No reminders set yet</div>
                <div style={{ fontSize: 16, marginTop: 8, color: '#a08060' }}>Click + Add Reminder to create one</div>
              </div>
            ) : (
              reminders.map(r => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px',
                  borderRadius: 16, marginBottom: 12,
                  border: `2px solid ${r.active ? '#fde8c8' : '#eee'}`,
                  background: r.active ? '#fffaf5' : '#f8f8f8',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 22, fontWeight: 'bold', color: r.active ? '#2c1a0e' : '#aaa' }}>{r.label}</div>
                    <div style={{ fontSize: 24, color: r.active ? '#d4a574' : '#bbb', marginTop: 4 }}>{fmt12(r.time)}</div>
                    <div style={{ fontSize: 16, color: '#a08060', marginTop: 2 }}>
                      {r.days.length === 0 ? 'Every day' : r.days.map(d => DAYS[d]).join(', ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={() => toggleReminder(r.id)} style={{
                      padding: '10px 16px', fontSize: 18, borderRadius: 12,
                      border: 'none', cursor: 'pointer', fontFamily: 'Georgia, serif',
                      background: r.active ? '#27ae60' : '#aaa', color: '#fff', transition: 'all 0.2s',
                      minWidth: 70
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {r.active ? 'ON' : 'OFF'}
                    </button>
                    <button onClick={() => deleteReminder(r.id)} style={{
                      padding: '10px 16px', fontSize: 18, borderRadius: 12,
                      border: 'none', cursor: 'pointer', background: '#fde8c8',
                      color: '#c0392b', fontFamily: 'Georgia, serif',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fdd4a8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fde8c8'}
                    >🗑 Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '8px 16px 24px', color: '#b0a090', fontSize: 15, borderTop: '1px solid #e8dcc8' }}>
        ✓ Your data saves automatically • Easy to use
      </div>
    </div>
  );
}