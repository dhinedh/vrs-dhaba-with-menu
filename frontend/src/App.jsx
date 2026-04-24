import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  X, 
  CheckCircle2, 
  LayoutDashboard, 
  LogOut, 
  IndianRupee,
  Clock,
  Table,
  UtensilsCrossed,
  ChefHat,
  Search,
  ArrowRight,
  Settings,
  TrendingUp,
  Package,
  Trash2,
  Edit2,
  ChevronRight,
  User,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroBg from './assets/hero-bg.png';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const App = () => {
  const [userRole, setUserRole] = useState(null); // 'admin', 'waiter', or null
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({ name: "VRS Garden Dhaba", tagline: "Fresh & Tasty", gst: 5 });
  const [cart, setCart] = useState({});
  const [tableNumber, setTableNumber] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [specialNotes, setSpecialNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [waiterTab, setWaiterTab] = useState("Menu"); // "Menu" or "Orders"
  const [editingOrderId, setEditingOrderId] = useState(null);

  const categories = useMemo(() => {
    const cats = [...new Set(menu.map(item => item.category))];
    return cats.map(c => ({ name: c, icon: "🍽️" }));
  }, [menu]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchOrders, 5000);
    
    // Check for Customer Mode (e.g. ?table=5)
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get("table");
    if (tableParam) {
      setIsLoggedIn(true);
      setUserRole("customer");
      setTableNumber(tableParam);
    } else {
      // Restore staff session
      const savedLogin = localStorage.getItem("isLoggedIn") === "true";
      const savedRole = localStorage.getItem("userRole");
      if (savedLogin && savedRole) {
        setIsLoggedIn(true);
        setUserRole(savedRole);
      }
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories]);

  const fetchData = async () => {
    try {
      const [menuRes, settingsRes] = await Promise.all([
        fetch(`${API_BASE}/menu`),
        fetch(`${API_BASE}/settings`)
      ]);
      setMenu(await menuRes.json());
      setSettings(await settingsRes.json());
      fetchOrders();
    } catch (err) { console.error("Fetch error:", err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data.reverse());
      } else {
        setOrders([]);
      }
    } catch (err) { console.error("Order error:", err); }
  };

  const filteredMenu = useMemo(() => {
    const base = searchQuery ? menu : menu.filter(i => i.category === activeCategory);
    if (!searchQuery) return base;
    return menu.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.no.includes(searchQuery)
    );
  }, [activeCategory, searchQuery, menu]);

  const cartTotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menu.find(i => i.id === id);
      return total + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, menu]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const placeOrder = async () => {
    if (!tableNumber) { alert("Please enter table number!"); return; }

    const itemsArray = Object.entries(cart)
      .map(([id, qty]) => {
        const item = menu.find(i => i.id === id);
        return item ? { ...item, quantity: qty } : null;
      })
      .filter(item => item !== null);

    const total = itemsArray.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    try {
      if (editingOrderId) {
        // Replace existing order
        const updatedOrder = {
          id: editingOrderId,
          tableNumber: tableNumber.toString(),
          items: itemsArray,
          total: total,
          notes: specialNotes,
          status: 'Pending'
        };

        await fetch(`${API_BASE}/orders/${editingOrderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedOrder)
        });
        setLastOrder(updatedOrder);
        setEditingOrderId(null);
      } else {
        // Standard flow: Check if table has an active order to merge with
        const activeOrder = orders.find(o => o.tableNumber.toString() === tableNumber.toString() && o.status !== 'Billed');
        
        if (activeOrder) {
          const mergedItems = [...activeOrder.items];
          itemsArray.forEach(newItem => {
            const existing = mergedItems.find(i => i.id === newItem.id);
            if (existing) {
              existing.quantity += newItem.quantity;
            } else {
              mergedItems.push(newItem);
            }
          });
          
          const newTotal = mergedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
          
          const updatedOrder = {
            ...activeOrder,
            items: mergedItems,
            total: newTotal,
            notes: activeOrder.notes ? activeOrder.notes + (specialNotes ? " | " + specialNotes : "") : specialNotes,
            status: 'Pending'
          };

          await fetch(`${API_BASE}/orders/${activeOrder.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedOrder)
          });
          setLastOrder(updatedOrder);
        } else {
          // New Order
          const orderData = {
            tableNumber: tableNumber.toString(),
            items: itemsArray,
            total: total,
            notes: specialNotes,
            status: "Pending"
          };

          const res = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
          });
          setLastOrder(await res.json());
        }
      }
      setCart({});
      setShowCart(false);
      setSpecialNotes("");
      fetchOrders();
    } catch (err) { alert("Order failed!"); }
  };

  if (!isLoggedIn) {
    return <UnifiedLogin onLogin={(role) => { 
      setIsLoggedIn(true); 
      setUserRole(role); 
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
    }} settings={settings} />;
  }

  if (userRole === 'admin') {
    return (
      <div className="app-container">
        <AdminDashboard 
          orders={orders} setOrders={setOrders} 
          onLogout={() => { 
            setIsLoggedIn(false); 
            setUserRole(null); 
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
          }} 
          menu={menu} setMenu={setMenu}
          settings={settings} setSettings={setSettings}
          API_BASE={API_BASE}
        />
      </div>
    );
  }

  const isCustomer = userRole === 'customer';

  return (
    <div className="app-container">
      {/* Premium Hero */}
      <div className="hero" style={{ backgroundImage: `linear-gradient(to bottom, rgba(26, 18, 8, 0.4), #1A1208), url(${heroBg})` }}>
        <div className="hero-content">
          <div className="hero-top">
            <ChefHat color="#E8621A" size={24} />
            <span>Since 1998</span>
          </div>
          <h1>{settings.name}</h1>
          <p>{settings.tagline}</p>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="sticky-header">
        <div className="header-actions">
          {!isCustomer && (
            <div className="table-selector">
              <Table size={16} />
              <input type="number" placeholder="Table" value={tableNumber} onChange={e => setTableNumber(e.target.value)} />
            </div>
          )}
          <div className="search-pill">
            <Search size={16} />
            <input placeholder="Search menu items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          {isCustomer && (
            <div style={{background: '#E8621A', color: 'white', padding: '8px 15px', borderRadius: '12px', fontWeight: '800'}}>
              T-{tableNumber}
            </div>
          )}
        </div>
        
        {/* Horizontal Categories */}
        {!searchQuery && (
          <div className="category-scroll">
            {categories.map(cat => (
              <button 
                key={cat.name} 
                className={activeCategory === cat.name ? 'active' : ''}
                onClick={() => setActiveCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Menu / Orders Toggle */}
      {waiterTab === "Menu" ? (
        <>
          <div className="menu-section">
            <div className="section-header">
              <h2>{searchQuery ? 'Search Results' : activeCategory}</h2>
            </div>
            
            <div className="menu-list">
              {filteredMenu.map(item => (
                <MenuCard 
                  key={item.id} item={item} isWaiter={true} 
                  qty={cart[item.id] || 0}
                  onAdd={() => setCart({...cart, [item.id]: (cart[item.id] || 0) + 1})}
                  onRemove={() => {
                    const newCart = {...cart};
                    if (newCart[item.id] > 1) newCart[item.id]--;
                    else delete newCart[item.id];
                    setCart(newCart);
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="active-orders-section" style={{padding: '20px'}}>
          <h2>Active Orders</h2>
          <div className="order-list">
            {orders.filter(o => o.status !== 'Billed').map(o => (
              <div key={o.id} className="order-card" style={{background: 'white', padding: '15px', borderRadius: '15px', marginBottom: '10px', border: '1px solid #eee'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <strong>Table {o.tableNumber}</strong>
                  <span style={{fontSize: '0.8rem', color: '#666'}}>{o.status}</span>
                </div>
                <div style={{fontSize: '0.9rem', margin: '5px 0'}}>
                  {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                </div>
                <button 
                  className="btn-edit-order" 
                  style={{background: '#E8621A', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: '600', marginTop: '10px'}}
                  onClick={() => {
                    const newCart = {};
                    o.items.forEach(i => newCart[i.id] = i.quantity);
                    setCart(newCart);
                    setTableNumber(o.tableNumber);
                    setEditingOrderId(o.id);
                    setWaiterTab("Menu");
                    setShowCart(true);
                  }}
                >
                  Edit / Add Items
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Cart Pill */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="floating-cart">
            <div className="cart-pill" onClick={() => setShowCart(true)}>
              <div className="cart-badge">{cartCount}</div>
              <div className="cart-text">
                <span>{isCustomer ? 'View My Order' : 'View Order Summary'}</span>
                {userRole !== 'waiter' && <small>₹{cartTotal}</small>}
              </div>
              <ArrowRight size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      {!isCustomer && (
        <div className="bottom-nav">
          <button className={`nav-item ${waiterTab === 'Menu' ? 'active' : ''}`} onClick={() => setWaiterTab('Menu')}><UtensilsCrossed size={22} /><span>Menu</span></button>
          <button className={`nav-item ${waiterTab === 'Orders' ? 'active' : ''}`} onClick={() => setWaiterTab('Orders')}><Clock size={22} /><span>Last Orders</span></button>
          <button className="nav-item" onClick={() => { 
            setIsLoggedIn(false); 
            setUserRole(null); 
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
          }}><LogOut size={22} /><span>Logout</span></button>
        </div>
      )}

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {showCart && (
          <div className="modal-bg" onClick={() => setShowCart(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-bar" />
              <div className="sheet-header">
                <h3>Order Summary</h3>
                <button onClick={() => setShowCart(false)}><X /></button>
              </div>
              <div className="sheet-content">
                <div className="sheet-table-box">
                  <Table size={18} color="#E8621A" />
                  <input 
                    type="number" 
                    placeholder="Enter Table Number" 
                    value={tableNumber} 
                    onChange={e => setTableNumber(e.target.value)} 
                  />
                </div>

                <div className="cart-items">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = menu.find(i => i.id === id);
                    if (!item) return null; // Skip if item not found
                    return (
                      <div key={id} className="cart-item">
                        <div className="item-main">
                          <span className={`dot ${item.veg ? 'veg' : 'non-veg'}`} />
                          <div className="item-name">{item.name}</div>
                        </div>
                        <div className="item-ctrl">
                          <button onClick={() => {
                             const newCart = {...cart};
                             if (newCart[id] > 1) newCart[id]--;
                             else delete newCart[id];
                             setCart(newCart);
                          }}><Minus size={14} /></button>
                          <span>{qty}</span>
                          <button onClick={() => setCart({...cart, [id]: (cart[id] || 0) + 1})}><Plus size={14} /></button>
                        </div>
                        <div className="item-price">₹{item.price * qty}</div>
                      </div>
                    );
                  })}
                </div>
                <button className="btn-add-more" onClick={() => setShowCart(false)}>
                  <Plus size={16} /> Add More Items
                </button>

                <textarea placeholder="Special instructions (e.g. spicy...)" value={specialNotes} onChange={e => setSpecialNotes(e.target.value)} />
                {userRole !== 'waiter' && (
                  <div className="total-summary">
                    <div className="row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                    <div className="row"><span>GST ({settings.gst}%)</span><span>₹{Math.round(cartTotal * settings.gst / 100)}</span></div>
                    <div className="row grand"><span>Total</span><span>₹{cartTotal + Math.round(cartTotal * settings.gst / 100)}</span></div>
                  </div>
                )}
                <button className="btn-order" onClick={placeOrder}>
                  {editingOrderId ? 'Update Order' : 'Confirm Order'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Animation */}
      <AnimatePresence>
        {lastOrder && (
          <div className="success-overlay">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="success-modal">
              <CheckCircle2 size={64} color="#2e7d32" />
              <h2>Order Sent!</h2>
              <div className="order-id-badge">#{lastOrder.id}</div>
              <button className="btn-primary" onClick={() => setLastOrder(null)}>Done</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .hero { height: 180px; background-size: cover; display: flex; align-items: flex-end; padding: 20px; }
        .hero-top { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; color: #E8621A; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }
        .hero h1 { color: white; font-size: 1.8rem; line-height: 1; }
        .hero p { color: #AAA; font-size: 0.9rem; margin-top: 4px; }

        .sticky-header { position: sticky; top: 0; background: white; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header-actions { display: flex; padding: 12px; gap: 10px; }
        .table-selector { background: #F5F5F5; border-radius: 12px; display: flex; align-items: center; padding: 0 10px; flex: 0 0 80px; }
        .table-selector input { border: none; background: transparent; width: 100%; padding: 10px 5px; font-weight: 700; outline: none; }
        .search-pill { background: #F5F5F5; border-radius: 12px; display: flex; align-items: center; padding: 0 12px; flex: 1; }
        .search-pill input { border: none; background: transparent; width: 100%; padding: 10px; outline: none; font-size: 0.9rem; }
        
        .category-scroll { display: flex; overflow-x: auto; padding: 0 12px 12px; gap: 8px; }
        .category-scroll button { flex: 0 0 auto; padding: 8px 16px; border-radius: 50px; border: 1px solid #EEE; background: white; font-size: 0.8rem; font-weight: 600; color: #666; }
        .category-scroll button.active { background: var(--primary); color: white; border-color: var(--primary); }

        .menu-section { padding: 20px 16px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-header h2 { font-size: 1.1rem; color: #333; }
        .mode-badge { background: #F0F0F0; padding: 4px 10px; border-radius: 50px; display: flex; align-items: center; gap: 6px; font-size: 0.7rem; font-weight: 700; color: #666; cursor: pointer; }

        .menu-card { background: white; border-radius: 16px; padding: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); border: 1px solid #F0F0F0; }
        .item-info { display: flex; flex-direction: column; gap: 2px; }
        .dot-name { display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.veg { background: #2e7d32; box-shadow: 0 0 0 2px white, 0 0 0 3px #2e7d32; }
        .dot.non-veg { background: #c62828; box-shadow: 0 0 0 2px white, 0 0 0 3px #c62828; }
        .item-no { font-size: 0.7rem; color: #999; font-weight: 700; background: #F5F5F5; padding: 2px 6px; border-radius: 4px; }
        .price-and-actions { display: flex; align-items: center; gap: 16px; }
        .item-name { font-weight: 600; font-size: 0.95rem; }
        .item-price { color: var(--primary); font-weight: 700; font-size: 0.95rem; }

        .qty-ctrl { display: flex; align-items: center; gap: 12px; background: #FFF5F0; border-radius: 10px; padding: 4px; }
        .qty-ctrl button { background: var(--primary); color: white; border: none; width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .qty-ctrl span { font-weight: 700; min-width: 20px; text-align: center; }
        .btn-add { background: white; border: 1px solid var(--primary); color: var(--primary); padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; }

        .floating-cart { position: fixed; bottom: 85px; left: 16px; right: 16px; z-index: 1000; }
        .cart-pill { background: var(--accent); color: white; padding: 12px 20px; border-radius: 50px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .cart-badge { background: var(--primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
        .cart-text { flex: 1; margin-left: 12px; display: flex; flex-direction: column; }
        .cart-text span { font-weight: 700; font-size: 0.95rem; }
        .cart-text small { opacity: 0.7; font-size: 0.75rem; }

        .bottom-nav { position: fixed; bottom: 0; width: 100%; background: white; display: flex; justify-content: space-around; padding: 10px; border-top: 1px solid #EEE; }
        .nav-item { border: none; background: none; display: flex; flex-direction: column; align-items: center; gap: 4px; color: #999; }
        .nav-item.active { color: var(--primary); }
        .nav-item span { font-size: 0.65rem; font-weight: 600; }

        .modal-bg { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); z-index: 2000; }
        .sheet { position: absolute; bottom: 0; width: 100%; background: white; border-radius: 24px 24px 0 0; padding: 20px; max-height: 90vh; display: flex; flex-direction: column; }
        .sheet-bar { width: 40px; height: 4px; background: #DDD; border-radius: 2px; margin: 0 auto 15px; }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .sheet-header button { background: #F5F5F5; border: none; padding: 6px; border-radius: 50%; }
        .sheet-content { padding: 0 20px 20px; max-height: 70vh; overflow-y: auto; }
        .sheet-table-box { background: #F9F9F9; padding: 15px; border-radius: 12px; display: flex; align-items: center; gap: 12px; margin-bottom: 20px; border: 1px solid #EEE; }
        .sheet-table-box input { border: none; background: transparent; font-size: 1rem; font-weight: 700; width: 100%; outline: none; }
        .cart-items { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; }
        .cart-item { display: flex; justify-content: space-between; align-items: center; }
        .btn-add-more { width: 100%; padding: 12px; border-radius: 12px; border: 2px dashed #DDD; background: transparent; color: #666; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; cursor: pointer; }
        .btn-add-more:hover { border-color: var(--primary); color: var(--primary); }
        .item-main { display: flex; align-items: center; gap: 10px; }
        .item-ctrl { display: flex; align-items: center; gap: 12px; background: #F9F9F9; padding: 4px; border-radius: 8px; }
        .item-ctrl button { border: none; background: #DDD; padding: 4px; border-radius: 4px; }
        .item-price { font-weight: 700; color: #333; width: 60px; text-align: right; }
        .sheet textarea { width: 100%; background: #F9F9F9; border: 1px solid #EEE; padding: 12px; border-radius: 12px; height: 80px; margin-bottom: 20px; font-family: inherit; }
        .total-summary { background: #F9F9F9; padding: 16px; border-radius: 16px; margin-bottom: 20px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: #666; }
        .grand { border-top: 1px dashed #DDD; padding-top: 8px; margin-top: 8px; font-weight: 800; color: #000; font-size: 1.1rem; }
        .btn-order { width: 100%; background: var(--primary); color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 700; font-size: 1.1rem; }

        .success-overlay { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: white; z-index: 3000; display: flex; align-items: center; justify-content: center; }
        .success-modal { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .order-id-badge { background: #F0F7F0; color: #2e7d32; padding: 8px 20px; border-radius: 50px; font-weight: 800; font-size: 1.2rem; margin-bottom: 20px; }
      `}</style>
    </div>
  );
};

const MenuCard = ({ item, isWaiter, qty, onAdd, onRemove }) => (
  <div className="menu-card">
    <div className="item-info">
      <div className="dot-name">
        <span className={`dot ${item.veg ? 'veg' : 'non-veg'}`} />
        <span className="item-no">#{item.no}</span>
        <span className="item-name">{item.name}</span>
      </div>
    </div>
    <div className="price-and-actions">
      <span className="item-price">₹{item.price}</span>
      <div className="item-actions">
        {qty > 0 ? (
          <div className="qty-ctrl">
            <button onClick={onRemove}><Minus size={16} /></button>
            <span>{qty}</span>
            <button onClick={onAdd}><Plus size={16} /></button>
          </div>
        ) : (
          <button className="btn-add" onClick={onAdd}>ADD</button>
        )}
      </div>
    </div>
  </div>
);

const UnifiedLogin = ({ onLogin, settings }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "vrs2024") {
      onLogin('admin');
    } else if (user === "waiter" && pass === "waiter") {
      onLogin('waiter');
    } else {
      alert("Invalid credentials! Try 'admin'/'vrs2024' or 'waiter'/'waiter'");
    }
  };

  return (
    <div className="login-screen" style={{height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '20px'}}>
      <div className="login-box" style={{background: 'white', padding: '40px 30px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center'}}>
        <ChefHat size={60} color="#E8621A" style={{marginBottom: '20px'}} />
        <h1 style={{fontSize: '1.8rem', marginBottom: '10px'}}>{settings.name}</h1>
        <p style={{color: '#666', marginBottom: '30px'}}>Please sign in to continue</p>
        
        <input 
          placeholder="Username" 
          value={user} 
          onChange={e => setUser(e.target.value)} 
          style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '15px', outline: 'none'}} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={pass} 
          onChange={e => setPass(e.target.value)} 
          style={{width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '25px', outline: 'none'}} 
        />
        
        <button 
          onClick={handleLogin} 
          className="btn-primary" 
          style={{width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: '#E8621A', color: 'white', fontSize: '1rem', fontWeight: '700', cursor: 'pointer'}}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = ({ orders, setOrders, onLogout, menu, setMenu, settings, setSettings, API_BASE }) => {
  const [tab, setTab] = useState("Orders");

  const updateStatus = async (id, status) => {
    await fetch(`${API_BASE}/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })});
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const [printingOrder, setPrintingOrder] = useState(null);

  const handlePrint = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      updateStatus(order.id, 'Billed');
    }, 500);
  };

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="row">
          <h2>Admin Panel</h2>
          <button onClick={onLogout}><LogOut size={20} /></button>
        </div>
        <div className="dash-tabs">
          <button className={tab === 'Orders' ? 'active' : ''} onClick={() => setTab('Orders')}><ShoppingBag size={14}/> Orders</button>
          <button className={tab === 'Menu' ? 'active' : ''} onClick={() => setTab('Menu')}><Package size={14}/> Menu</button>
          <button className={tab === 'Stats' ? 'active' : ''} onClick={() => setTab('Stats')}><TrendingUp size={14}/> Stats</button>
          <button className={tab === 'Settings' ? 'active' : ''} onClick={() => setTab('Settings')}><Settings size={14}/> Settings</button>
        </div>
      </div>
      <div className="dash-content">
        {tab === 'Orders' && (
          <div className="order-list">
            {orders.map(o => (
              <div key={o.id} className={`order-card ${o.status.toLowerCase()}`}>
                <div className="card-meta"><span>T{o.tableNumber}</span> <span>₹{o.total}</span></div>
                <div className="card-items">{o.items.map((i, idx) => <div key={idx}>{i.quantity}x {i.name}</div>)}</div>
                <div className="card-btns">
                  {o.status === 'Pending' && <button className="btn-c" onClick={() => updateStatus(o.id, 'Confirmed')}>Confirm</button>}
                  {o.status === 'Confirmed' && <button className="btn-r" onClick={() => updateStatus(o.id, 'Ready')}>Ready</button>}
                  <button className="btn-p" style={{background: '#666'}} onClick={() => handlePrint(o)}>Print Bill</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === 'Menu' && <MenuMgmt menu={menu} setMenu={setMenu} API_BASE={API_BASE} />}
        {tab === 'Stats' && <Reports orders={orders} />}
        {tab === 'Settings' && <SettingsEditor settings={settings} setSettings={setSettings} API_BASE={API_BASE} />}
      </div>

      {/* Hidden Printable Receipt */}
      {printingOrder && (
        <div className="print-only">
          <div className="receipt-header">
            <h2>{settings.name}</h2>
            <p>{settings.tagline}</p>
            <hr />
          </div>
          <div className="receipt-meta">
            <p><strong>Table:</strong> {printingOrder.tableNumber}</p>
            <p><strong>Order ID:</strong> {printingOrder.id}</p>
            <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
            <hr />
          </div>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {printingOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <div className="receipt-total">
            <div className="row"><span>Subtotal</span><span>₹{printingOrder.total}</span></div>
            <div className="row"><span>GST ({settings.gst}%)</span><span>₹{Math.round(printingOrder.total * settings.gst / 100)}</span></div>
            <div className="row grand"><span>Total</span><span>₹{printingOrder.total + Math.round(printingOrder.total * settings.gst / 100)}</span></div>
          </div>
          <div className="receipt-footer">
            <p>Thank you! Visit Again</p>
          </div>
        </div>
      )}

      <style>{`
        .dashboard { min-height: 100vh; background: #F8F8F8; }
        .dash-header { background: white; padding: 20px 16px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .dash-header .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .dash-tabs { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 5px; }
        .dash-tabs button { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 12px; border: none; background: #F5F5F5; font-size: 0.8rem; font-weight: 700; color: #666; }
        .dash-tabs button.active { background: var(--accent); color: white; }
        
        .dash-content { padding: 16px; padding-bottom: 100px; }
        .order-card { background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; border-left: 4px solid #DDD; }
        .order-card.pending { border-left-color: #EAB308; }
        .order-card.confirmed { border-left-color: #3B82F6; }
        .order-card.ready { border-left-color: #22C55E; }
        .card-top { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .card-top .badge { font-size: 0.6rem; font-weight: 800; background: #F0F0F0; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
        .card-meta { display: flex; gap: 15px; font-size: 0.8rem; font-weight: 700; color: #666; margin-bottom: 10px; }
        .card-items { border-top: 1px solid #F5F5F5; padding-top: 10px; font-size: 0.85rem; margin-bottom: 15px; }
        .card-btns { display: flex; gap: 10px; }
        .card-btns button { flex: 1; padding: 10px; border: none; border-radius: 10px; font-weight: 700; color: white; }
        .btn-c { background: #3B82F6; }
         .btn-r { background: #22C55E; }

         /* Printing Styles */
         .print-only { display: none; }
         @media print {
           body * { visibility: hidden; }
           .print-only, .print-only * { visibility: visible; }
           .print-only { 
             display: block; 
             position: absolute; 
             left: 0; 
             top: 0; 
             width: 80mm; 
             padding: 10px;
             font-family: 'Courier New', Courier, monospace;
             font-size: 12px;
             color: black;
           }
           .receipt-header { text-align: center; }
           .receipt-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
           .receipt-table th { text-align: left; border-bottom: 1px solid #000; }
           .receipt-table td { padding: 5px 0; }
           .receipt-total .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
           .receipt-total .grand { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
           .receipt-footer { text-align: center; margin-top: 20px; font-size: 10px; }
         }
       `}</style>
    </div>
  );
};

const MenuMgmt = ({ menu, setMenu, API_BASE }) => {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", category: "Roti Varieties", veg: true, no: "" });

  const save = async (e) => {
    e.preventDefault();
    const item = editing || form;
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_BASE}/menu/${item.id}` : `${API_BASE}/menu`;
    
    await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(item)
    });
    
    const res = await fetch(`${API_BASE}/menu`);
    setMenu(await res.json());
    setEditing(null);
    setForm({ name: "", price: "", category: "Roti Varieties", veg: true, no: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' });
    setMenu(menu.filter(i => i.id !== id));
  };

  const categories = ["Roti Varieties", "Chicken Gravy", "Egg Varieties", "Veg Varieties", "Veg Rice", "Non-Veg Rice", "Veg Noodles"];

  return (
    <div className="menu-mgmt">
      <form onSubmit={save} className="edit-box">
        <h3>{editing ? 'Edit Item' : 'New Item'}</h3>
        <div style={{display: 'flex', gap: '10px'}}>
          <input style={{flex: 1}} placeholder="Name" value={editing ? editing.name : form.name} onChange={e => editing ? setEditing({...editing, name: e.target.value}) : setForm({...form, name: e.target.value})} required />
          <input style={{width: '80px'}} placeholder="No" value={editing ? editing.no : form.no} onChange={e => editing ? setEditing({...editing, no: e.target.value}) : setForm({...form, no: e.target.value})} required />
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <input style={{flex: 1}} type="number" placeholder="Price" value={editing ? editing.price : form.price} onChange={e => editing ? setEditing({...editing, price: parseInt(e.target.value)}) : setForm({...form, price: parseInt(e.target.value)})} required />
          <select style={{flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#F5F5F5'}} value={editing ? editing.category : form.category} onChange={e => editing ? setEditing({...editing, category: e.target.value}) : setForm({...form, category: e.target.value})}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <label style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', padding: '5px 0'}}>
          <input type="checkbox" checked={editing ? editing.veg : form.veg} onChange={e => editing ? setEditing({...editing, veg: e.target.checked}) : setForm({...form, veg: e.target.checked})} />
          Vegetarian Item
        </label>
        <div style={{display: 'flex', gap: '10px'}}>
          <button type="submit" className="btn-primary" style={{flex: 1}}>{editing ? 'Update Item' : 'Add Item'}</button>
          {editing && <button type="button" onClick={() => setEditing(null)} style={{padding: '12px', borderRadius: '10px', border: '1px solid #CCC', background: 'white'}}>Cancel</button>}
        </div>
      </form>
      <div className="list">
        {menu.map(i => (
          <div key={i.id} className="row">
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <strong>#{i.no} {i.name}</strong>
              <small style={{color: '#666'}}>{i.category} • ₹{i.price}</small>
            </div>
            <div className="acts">
              <button onClick={() => setEditing(i)} style={{marginRight: '8px', padding: '6px', background: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '6px', cursor: 'pointer'}}><Edit2 size={16}/></button>
              <button onClick={() => handleDelete(i.id)} style={{padding: '6px', background: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '6px', cursor: 'pointer'}}><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .edit-box { background: white; padding: 20px; border-radius: 20px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .edit-box input { background: #F5F5F5; border: none; padding: 12px; border-radius: 10px; font-family: inherit; }
        .list .row { display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 12px; margin-bottom: 8px; font-size: 0.9rem; border: 1px solid #F0F0F0; }
        .acts { display: flex; }
      `}</style>
    </div>
  );
};

const Reports = ({ orders }) => (
  <div className="stats">
    <div className="stat-card"><span>Revenue</span><strong>₹{orders.reduce((a,b)=>a+b.total,0)}</strong></div>
    <div className="stat-card"><span>Orders</span><strong>{orders.length}</strong></div>
    <style>{`
      .stat-card { background: white; padding: 30px; border-radius: 24px; text-align: center; margin-bottom: 15px; display: flex; flex-direction: column; gap: 5px; }
      .stat-card strong { font-size: 2rem; color: var(--primary); }
    `}</style>
  </div>
);

const SettingsEditor = ({ settings, setSettings, API_BASE }) => {
  const save = async () => {
    await fetch(`${API_BASE}/settings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings)});
    alert("Saved!");
  };
  return (
    <div className="settings">
      <div className="edit-box">
        <label>Shop Name</label>
        <input value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="input-field" />
        <label>GST %</label>
        <input type="number" value={settings.gst} onChange={e => setSettings({...settings, gst: parseInt(e.target.value)})} className="input-field" />
        <button onClick={save} className="btn-primary">Update Shop</button>
      </div>
    </div>
  );
};

export default App;
