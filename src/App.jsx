import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingBag,
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
  Filter,
  ArrowRight,
  ChevronRight,
  Smartphone,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroBg from './assets/hero-bg.png';

// --- CONSTANTS ---
const MENU_DATA = {
  "Roti Varieties": [
    { id: 1, no: "101", name: "Roti", price: 15, veg: true, icon: "🫓" },
    { id: 2, no: "102", name: "Butter Roti", price: 20, veg: true, icon: "🫓" },
    { id: 3, no: "103", name: "Butter Naan", price: 50, veg: true, icon: "🫓" },
    { id: 4, no: "104", name: "Garlic Roti", price: 30, veg: true, icon: "🫓" },
    { id: 5, no: "105", name: "Plain Naan", price: 40, veg: true, icon: "🫓" },
    { id: 6, no: "106", name: "Garlic Naan", price: 80, veg: true, icon: "🫓" },
    { id: 7, no: "107", name: "Half Naan", price: 25, veg: true, icon: "🫓" },
  ],
  "Chicken Gravy": [
    { id: 8, no: "201", name: "Chicken Masala", price: 150, veg: false, icon: "🍗" },
    { id: 9, no: "202", name: "Pepper Chicken", price: 180, veg: false, icon: "🍗" },
    { id: 10, no: "203", name: "Ginger Chicken", price: 170, veg: false, icon: "🍗" },
    { id: 11, no: "204", name: "Garlic Chicken", price: 190, veg: false, icon: "🍗" },
    { id: 12, no: "205", name: "Chettinad Chicken", price: 200, veg: false, icon: "🍗" },
    { id: 13, no: "206", name: "Mughlai Chicken", price: 230, veg: false, icon: "🍗" },
    { id: 14, no: "207", name: "Punjabi Chicken", price: 220, veg: false, icon: "🍗" },
    { id: 15, no: "208", name: "Chilli Chicken", price: 200, veg: false, icon: "🍗" },
    { id: 16, no: "209", name: "Butter Chicken", price: 210, veg: false, icon: "🍗" },
    { id: 17, no: "210", name: "Andhra Chicken", price: 230, veg: false, icon: "🍗" },
  ],
  "Egg Varieties": [
    { id: 18, no: "301", name: "Egg Podimas", price: 50, veg: false, icon: "🍳" },
    { id: 19, no: "302", name: "Egg Keema", price: 110, veg: false, icon: "🍳" },
  ],
  "Gravy": [
    { id: 20, no: "401", name: "Mutton Masala", price: 250, veg: false, icon: "🍲" },
    { id: 21, no: "402", name: "Kadai Masala", price: 170, veg: false, icon: "🍲" },
    { id: 22, no: "403", name: "Prawn Masala", price: 250, veg: false, icon: "🍤" },
    { id: 23, no: "404", name: "Squid Masala", price: 250, veg: false, icon: "🦑" },
    { id: 24, no: "405", name: "Naatu Kozhi", price: 220, veg: false, icon: "🍲" },
  ],
  "Veg Varieties": [
    { id: 25, no: "501", name: "Dal", price: 100, veg: true, icon: "🥣" },
    { id: 26, no: "502", name: "Dal Tadka", price: 130, veg: true, icon: "🥣" },
    { id: 27, no: "503", name: "Dal Makhani", price: 150, veg: true, icon: "🥣" },
    { id: 28, no: "504", name: "Channa Masala", price: 100, veg: true, icon: "🥣" },
    { id: 29, no: "505", name: "Paneer Butter Masala", price: 170, veg: true, icon: "🧀" },
    { id: 30, no: "506", name: "Paneer Masala", price: 170, veg: true, icon: "🧀" },
    { id: 31, no: "507", name: "Mushroom Masala", price: 160, veg: true, icon: "🍄" },
    { id: 32, no: "508", name: "Gobi Masala", price: 150, veg: true, icon: "🥦" },
  ],
  "Veg Rice": [
    { id: 33, no: "601", name: "Channa Rice", price: 100, veg: true, icon: "🍚" },
    { id: 34, no: "602", name: "Jeera Rice", price: 100, veg: true, icon: "🍚" },
    { id: 35, no: "603", name: "Paneer Rice", price: 170, veg: true, icon: "🍚" },
    { id: 36, no: "604", name: "Mushroom Rice", price: 160, veg: true, icon: "🍚" },
    { id: 37, no: "605", name: "Special Thayir Sadham", price: 100, veg: true, icon: "🍚" },
  ],
  "Non-Veg Rice": [
    { id: 38, no: "701", name: "Chicken Rice", price: 120, veg: false, icon: "🍛" },
    { id: 39, no: "702", name: "Dhaba Chicken Rice", price: 130, veg: false, icon: "🍛" },
    { id: 40, no: "703", name: "Kadai Rice", price: 170, veg: false, icon: "🍛" },
    { id: 41, no: "704", name: "Mutton Rice", price: 250, veg: false, icon: "🍛" },
    { id: 42, no: "705", name: "Prawn Rice", price: 250, veg: false, icon: "🍛" },
    { id: 43, no: "706", name: "Squid Rice", price: 250, veg: false, icon: "🍛" },
  ]
}
const API_BASE = "http://localhost:3001/api";

  const App = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isWaiter, setIsWaiter] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menu, setMenu] = useState([]);
    const [orders, setOrders] = useState([]);
    const [settings, setSettings] = useState({ name: "VRS Garden Dhaba", tagline: "Delicious", gst: 5 });
    const [cart, setCart] = useState({});
    const [tableNumber, setTableNumber] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [showCart, setShowCart] = useState(false);
    const [lastOrder, setLastOrder] = useState(null);
    const [specialNotes, setSpecialNotes] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = useMemo(() => {
      const cats = [...new Set(menu.map(item => item.category))];
      return cats.map(c => ({ name: c, icon: "🍽️" }));
    }, [menu]);

    useEffect(() => {
      fetchData();
      const interval = setInterval(fetchOrders, 5000); // Poll for new orders
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
        const menuData = await menuRes.json();
        const settingsData = await settingsRes.json();
        setMenu(menuData);
        setSettings(settingsData);
        fetchOrders();
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE}/orders`);
        const data = await res.json();
        setOrders(data.reverse());
      } catch (err) {
        console.error("Order fetch error:", err);
      }
    };

    const filteredMenu = useMemo(() => {
      if (!searchQuery) return menu.filter(i => i.category === activeCategory);
      return menu.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.no.includes(searchQuery)
      );
    }, [activeCategory, searchQuery, menu]);

    const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const cartTotal = useMemo(() => {
      let total = 0;
      Object.entries(cart).forEach(([id, qty]) => {
        const item = menu.find(i => i.id === parseInt(id));
        if (item) total += item.price * qty;
      });
      return total;
    }, [cart, menu]);

    const addToCart = (item) => {
      setCart(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
    };

    const removeFromCart = (item) => {
      setCart(prev => {
        const newCart = { ...prev };
        if (newCart[item.id] > 1) newCart[item.id]--;
        else delete newCart[item.id];
        return newCart;
      });
    };

    const placeOrder = async () => {
      if (!tableNumber) {
        alert("Please enter table number!");
        return;
      }
      const orderItems = Object.entries(cart).map(([id, qty]) => {
        const item = menu.find(i => i.id === parseInt(id));
        return { ...item, quantity: qty };
      });

      const orderData = {
        tableNumber,
        items: orderItems,
        total: cartTotal,
        notes: specialNotes,
        status: "Pending"
      };

      setShowCart(false);
      setSpecialNotes("");
    };

    if (isAdmin) {
      return (
        <div className="app-container">
          {!isLoggedIn ? (
            <AdminLogin onLogin={() => setIsLoggedIn(true)} onBack={() => setIsAdmin(false)} />
          ) : (
            <AdminDashboard
              orders={orders}
              setOrders={setOrders}
              onLogout={() => setIsLoggedIn(false)}
              onBack={() => setIsAdmin(false)}
              menu={menu}
              setMenu={setMenu}
              settings={settings}
              setSettings={setSettings}
              API_BASE={API_BASE}
            />
          )}
        </div>
      );
    }

    return (
      <div className="app-container">
        {/* Hero Section */}
        <div className="hero" style={{ backgroundImage: `linear-gradient(to bottom, rgba(26, 18, 8, 0.7), #1A1208), url(${heroBg})` }}>
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-title"
            >
              {settings.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-tagline"
            >
              {settings.tagline}
            </motion.p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">50+</span>
                <span className="stat-label">Dishes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">₹15</span>
                <span className="stat-label">Starts at</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Fresh Daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Table & Search Bar */}
        <div className="table-search-bar">
          <div className="top-row">
            <div className="table-input-container">
              <Table size={18} className="icon-gold" />
              <input
                type="number"
                placeholder="Table"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="table-input"
              />
            </div>
            <div className="mode-toggle">
              <button
                className={`toggle-btn ${!isWaiter ? 'active' : ''}`}
                onClick={() => setIsWaiter(false)}
              >Customer</button>
              <button
                className={`toggle-btn ${isWaiter ? 'active' : ''}`}
                onClick={() => setIsWaiter(true)}
              >Waiter</button>
            </div>
          </div>
          <div className="search-container">
            <Search size={18} className="icon-gray" />
            <input
              type="text"
              placeholder="Search by name or food number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Category Navigation (Hidden when searching) */}
        {!searchQuery && (
          <div className="category-nav">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`category-btn ${activeCategory === cat.name ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                <span className="cat-emoji">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Menu List */}
        <div className="menu-list">
          <h2 className="section-title">
            {searchQuery ? `Search Results (${filteredMenu.length})` : activeCategory}
          </h2>
          <div className="menu-grid">
            {filteredMenu.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                isWaiter={isWaiter}
                quantity={cart[item.id] || 0}
                onAdd={() => addToCart(item)}
                onRemove={() => removeFromCart(item)}
              />
            ))}
          </div>
        </div>

        {/* Sticky Cart Bar */}
        <AnimatePresence>
          {cartItemsCount > 0 && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="cart-bar"
            >
              <div className="cart-bar-content">
                <div className="cart-info">
                  <span className="cart-count">{cartItemsCount} Items</span>
                  {!isWaiter && <span className="cart-total">₹{cartTotal}</span>}
                </div>
                <button className="btn-view-order" onClick={() => setShowCart(true)}>
                  View Order <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Nav */}
        <div className="bottom-nav">
          <button className="nav-btn active">
            <UtensilsCrossed size={20} />
            <span>Menu</span>
          </button>
          <button className="nav-btn" onClick={() => setIsAdmin(true)}>
            <LayoutDashboard size={20} />
            <span>Admin</span>
          </button>
        </div>

        {/* Checkout Bottom Sheet */}
        <AnimatePresence>
          {showCart && (
            <div className="modal-overlay" onClick={() => setShowCart(false)}>
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bottom-sheet"
                onClick={e => e.stopPropagation()}
              >
                <div className="sheet-handle" />
                <div className="sheet-header">
                  <h3>My Order</h3>
                  <button className="close-btn" onClick={() => setShowCart(false)}><X /></button>
                </div>

                <div className="sheet-body">
                  <div className="order-items">
                    {Object.entries(cart).map(([id, qty]) => {
                      const item = Object.values(MENU_DATA).flat().find(i => i.id === parseInt(id));
                      return (
                        <div key={id} className="order-item">
                          <div className="item-details">
                            <span className={`dot ${item.veg ? 'veg' : 'non-veg'}`}></span>
                            <span className="item-name">{item.name}</span>
                          </div>
                          <div className="item-actions">
                            <div className="qty-control mini">
                              <button onClick={() => removeFromCart(item)}><Minus size={14} /></button>
                              <span>{qty}</span>
                              <button onClick={() => addToCart(item)}><Plus size={14} /></button>
                            </div>
                            <span className="item-price">₹{item.price * qty}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="special-notes">
                    <label>Special Instructions</label>
                    <textarea
                      placeholder="E.g. Less spicy, no onion..."
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                    />
                  </div>

                  {!isWaiter && (
                    <div className="bill-summary">
                      <div className="bill-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      <div className="bill-row">
                        <span>GST ({settings.gst}%)</span>
                        <span>₹{Math.round(cartTotal * (settings.gst / 100))}</span>
                      </div>
                      <div className="bill-row total">
                        <span>To Pay</span>
                        <span>₹{cartTotal + Math.round(cartTotal * (settings.gst / 100))}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="sheet-footer">
                  <button className="btn-place-order" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {lastOrder && (
            <div className="modal-overlay success">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="success-card"
              >
                <div className="success-icon">
                  <CheckCircle2 size={60} color="#2e7d32" />
                </div>
                <h2>Order Placed!</h2>
                <p>Your delicious food is being prepared.</p>
                <div className="order-number-badge">
                  <span className="label">Order ID</span>
                  <span className="value">{lastOrder.id}</span>
                </div>
                <button className="btn-primary" onClick={() => setLastOrder(null)}>
                  Got it
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Styles for the app (Scoped to one file) */}
        <style>{`
        .hero {
          height: 260px;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 24px;
          position: relative;
        }
        .hero-content {
          width: 100%;
        }
        .hero-title {
          color: white;
          font-size: 2rem;
          margin-bottom: 4px;
        }
        .hero-tagline {
          color: var(--secondary);
          font-weight: 500;
          margin-bottom: 16px;
        }
        .hero-stats {
          display: flex;
          gap: 20px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
        }
        .stat-value {
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .stat-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
        }
        .table-search-bar {
          padding: 16px;
          background: white;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .top-row { display: flex; gap: 12px; align-items: center; }
        .table-input-container {
          background: #F8F8F8;
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border: 1px solid #EEE;
          flex: 1;
        }
        .mode-toggle {
          display: flex;
          background: #F0F0F0;
          padding: 4px;
          border-radius: 10px;
        }
        .toggle-btn {
          border: none;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: #666;
        }
        .toggle-btn.active {
          background: white;
          color: var(--primary);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .search-container {
          background: #F8F8F8;
          border-radius: 12px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          border: 1px solid #EEE;
        }
        .search-input {
          border: none;
          background: transparent;
          padding: 12px;
          font-size: 0.9rem;
          width: 100%;
          outline: none;
        }
        .icon-gray { color: #999; }
        .icon-gold { color: var(--secondary); }
        .category-nav {
          display: flex;
          overflow-x: auto;
          padding: 16px;
          gap: 12px;
          scrollbar-width: none;
          background: var(--bg-cream);
        }
        .category-nav::-webkit-scrollbar { display: none; }
        .category-btn {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #EEE;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .category-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(232, 98, 26, 0.2);
        }
        .cat-emoji { font-size: 1.2rem; }
        .cat-name { font-weight: 500; font-size: 0.85rem; }
        
        .menu-list { padding: 16px; }
        .section-title { font-size: 1.2rem; margin-bottom: 16px; color: var(--accent); }
        .menu-grid { display: grid; gap: 16px; }
        
        .menu-card {
          background: white;
          border-radius: var(--radius);
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: var(--shadow);
          border: 1px solid rgba(0,0,0,0.03);
        }
        .item-info { display: flex; flex-direction: column; gap: 4px; }
        .dot-name { display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.veg { background: var(--veg); box-shadow: 0 0 0 2px white, 0 0 0 3px var(--veg); }
        .dot.non-veg { background: var(--non-veg); box-shadow: 0 0 0 2px white, 0 0 0 3px var(--non-veg); }
        .item-no { font-size: 0.75rem; font-weight: 700; color: #999; background: #F0F0F0; padding: 2px 6px; border-radius: 4px; }
        .price-and-actions { display: flex; align-items: center; gap: 16px; }
        .item-name { font-weight: 600; font-size: 0.95rem; color: var(--accent); }
        .item-price { font-weight: 700; color: var(--primary); font-size: 0.95rem; }
        
        .qty-control {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFF5F0;
          border-radius: 8px;
          padding: 4px;
        }
        .qty-control button {
          background: var(--primary);
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .qty-control span { font-weight: 600; min-width: 20px; text-align: center; }
        .btn-add {
          background: white;
          color: var(--primary);
          border: 1px solid var(--primary);
          padding: 6px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-add:hover { background: var(--primary); color: white; }

        .cart-bar {
          position: fixed;
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 448px;
          background: var(--accent);
          border-radius: 16px;
          padding: 16px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .cart-bar-content { display: flex; justify-content: space-between; align-items: center; }
        .cart-info { display: flex; flex-direction: column; color: white; }
        .cart-count { font-size: 0.8rem; opacity: 0.7; }
        .cart-total { font-weight: 700; font-size: 1.1rem; }
        .btn-view-order {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          background: white;
          display: flex;
          justify-content: space-around;
          padding: 12px;
          border-top: 1px solid #EEE;
          z-index: 90;
        }
        .nav-btn {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #999;
          cursor: pointer;
        }
        .nav-btn.active { color: var(--primary); }
        .nav-btn span { font-size: 0.7rem; font-weight: 500; }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .bottom-sheet {
          background: white;
          width: 100%;
          max-width: 480px;
          border-radius: 24px 24px 0 0;
          padding: 24px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }
        .sheet-handle {
          width: 40px;
          height: 4px;
          background: #DDD;
          border-radius: 2px;
          margin: 0 auto 20px;
        }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .sheet-body { overflow-y: auto; flex: 1; }
        .order-items { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }
        .order-item { display: flex; justify-content: space-between; align-items: center; }
        .qty-control.mini button { width: 24px; height: 24px; }
        .special-notes { margin-bottom: 24px; }
        .special-notes label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem; }
        .special-notes textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #EEE;
          border-radius: 12px;
          height: 80px;
          font-family: inherit;
          resize: none;
        }
        .bill-summary { background: #F9F9F9; padding: 16px; border-radius: 16px; }
        .bill-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; }
        .bill-row.total { border-top: 1px dashed #DDD; padding-top: 8px; margin-top: 8px; font-weight: 700; font-size: 1.1rem; color: var(--accent); }
        .btn-place-order {
          width: 100%;
          background: var(--primary);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1rem;
          margin-top: 20px;
          cursor: pointer;
        }

        .success-card {
          background: white;
          padding: 40px 24px;
          border-radius: 24px;
          text-align: center;
          width: calc(100% - 48px);
          max-width: 340px;
        }
        .success-icon { margin-bottom: 20px; }
        .order-number-badge {
          background: #F0F7F0;
          padding: 16px;
          border-radius: 16px;
          margin: 24px 0;
          display: flex;
          flex-direction: column;
        }
        .order-number-badge .label { font-size: 0.8rem; color: #666; }
        .order-number-badge .value { font-size: 1.5rem; font-weight: 800; color: var(--accent); }
      `}</style>
      </div>
    );
  };

  // --- SUB-COMPONENTS ---

  const MenuCard = ({ item, isWaiter, quantity, onAdd, onRemove }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="menu-card"
    >
      <div className="item-info">
        <div className="dot-name">
          <span className={`dot ${item.veg ? 'veg' : 'non-veg'}`}></span>
          <span className="item-no">#{item.no}</span>
          <span className="item-name">{item.name}</span>
        </div>
      </div>
      <div className="price-and-actions">
        <span className="item-price">₹{item.price}</span>
        <div className="item-actions">
          {quantity > 0 ? (
            <div className="qty-control">
              <button onClick={onRemove}><Minus size={16} /></button>
              <span>{quantity}</span>
              <button onClick={onAdd}><Plus size={16} /></button>
            </div>
          ) : (
            <button className="btn-add" onClick={onAdd}>ADD</button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const AdminLogin = ({ onLogin, onBack }) => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (user === "admin" && pass === "vrs2024") {
        onLogin();
      } else {
        alert("Invalid credentials!");
      }
    };

    return (
      <div className="admin-login-screen">
        <div className="login-header">
          <button className="back-btn" onClick={onBack}><X /></button>
          <ChefHat size={48} color="#E8621A" />
          <h2>Staff Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              className="input-field"
              value={user}
              onChange={e => setUser(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              value={pass}
              onChange={e => setPass(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary w-full">Login to Dashboard</button>
        </form>
        <style>{`
        .admin-login-screen { padding: 40px 24px; background: white; min-height: 100vh; }
        .login-header { text-align: center; margin-bottom: 40px; position: relative; }
        .login-header h2 { margin-top: 16px; font-size: 1.8rem; }
        .back-btn { position: absolute; left: 0; top: 0; background: none; border: none; padding: 8px; cursor: pointer; }
        .login-form { display: flex; flex-direction: column; gap: 20px; }
        .input-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 0.9rem; }
        .w-full { width: 100%; margin-top: 10px; }
      `}</style>
      </div>
    );
  };

  const AdminDashboard = ({ orders, setOrders, onLogout, onBack, menu, setMenu, settings, setSettings, API_BASE }) => {
    const [tab, setTab] = useState("Orders");

    const updateStatus = async (orderId, newStatus) => {
      try {
        await fetch(`${API_BASE}/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } catch (err) { alert("Failed to update status"); }
    };

    const revenue = orders.reduce((a, b) => a + b.total, 0);

    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-top">
            <h2>Admin Panel</h2>
            <button className="logout-btn" onClick={onLogout}><LogOut size={20} /></button>
          </div>
          <div className="admin-tabs">
            <button className={tab === 'Orders' ? 'active' : ''} onClick={() => setTab('Orders')}>Orders</button>
            <button className={tab === 'Menu' ? 'active' : ''} onClick={() => setTab('Menu')}>Menu</button>
            <button className={tab === 'Stats' ? 'active' : ''} onClick={() => setTab('Stats')}>Reports</button>
            <button className={tab === 'Settings' ? 'active' : ''} onClick={() => setTab('Settings')}>Settings</button>
          </div>
        </div>

        <div className="dashboard-content">
          {tab === 'Orders' && (
            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="empty-state"><Clock size={48} opacity={0.2} /><p>No orders yet</p></div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className={`order-card status-${order.status.toLowerCase()}`}>
                    <div className="order-card-header">
                      <span className="order-id">{order.id}</span>
                      <span className="order-time">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <div className="order-card-body">
                      <div className="order-meta">
                        <div className="meta-item"><Table size={14} /> Table {order.tableNumber}</div>
                        <div className="meta-item"><IndianRupee size={14} /> ₹{order.total}</div>
                      </div>
                      <div className="order-items-list">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-subitem">{item.quantity}x {item.name}</div>
                        ))}
                      </div>
                      {order.notes && <div className="order-notes-box"><strong>Notes:</strong> {order.notes}</div>}
                    </div>
                    <div className="order-card-actions">
                      {order.status === 'Pending' && (
                        <button className="btn-confirm" onClick={() => updateStatus(order.id, 'Confirmed')}>Confirm Order</button>
                      )}
                      {order.status === 'Confirmed' && (
                        <button className="btn-ready" onClick={() => updateStatus(order.id, 'Ready')}>Mark as Ready</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'Menu' && <MenuManagement menu={menu} setMenu={setMenu} API_BASE={API_BASE} />}

          {tab === 'Stats' && (
            <div className="stats-view">
              <div className="stat-grid">
                <div className="stat-card"><span className="label">Total Revenue</span><span className="value">₹{revenue}</span></div>
                <div className="stat-card"><span className="label">Total Orders</span><span className="value">{orders.length}</span></div>
                <div className="stat-card"><span className="label">Pending</span><span className="value">{orders.filter(o => o.status === 'Pending').length}</span></div>
                <div className="stat-card"><span className="label">Completed</span><span className="value">{orders.filter(o => o.status === 'Ready').length}</span></div>
              </div>
            </div>
          )}

          {tab === 'Settings' && <SettingsModule settings={settings} setSettings={setSettings} API_BASE={API_BASE} />}
        </div>
      </div>
    );
  };

  const MenuManagement = ({menu, setMenu, API_BASE}) => {
  const [editingItem, setEditingItem] = useState(null);
        const [newItem, setNewItem] = useState({name: "", price: "", category: "Roti Varieties", veg: true, no: "" });

  const handleSave = async (e) => {
          e.preventDefault();
        const item = editingItem || newItem;
        const method = editingItem ? 'PUT' : 'POST';
        const url = editingItem ? `${API_BASE}/menu/${editingItem.id}` : `${API_BASE}/menu`;

        try {
          await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        // Refresh menu
        const res = await fetch(`${API_BASE}/menu`);
        setMenu(await res.json());
        setEditingItem(null);
        setNewItem({name: "", price: "", category: "Roti Varieties", veg: true, no: "" });
    } catch (err) {alert("Error saving item"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
        try {
          await fetch(`${API_BASE}/menu/${id}`, { method: 'DELETE' });
      setMenu(menu.filter(i => i.id !== id));
    } catch (err) {alert("Error deleting item"); }
  };

        return (
        <div className="menu-mgmt">
          <form onSubmit={handleSave} className="item-form">
            <h3>{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
            <div className="form-row">
              <input placeholder="Name" value={editingItem ? editingItem.name : newItem.name} onChange={e => editingItem ? setEditingItem({ ...editingItem, name: e.target.value }) : setNewItem({ ...newItem, name: e.target.value })} required />
              <input placeholder="No" value={editingItem ? editingItem.no : newItem.no} onChange={e => editingItem ? setEditingItem({ ...editingItem, no: e.target.value }) : setNewItem({ ...newItem, no: e.target.value })} required />
            </div>
            <div className="form-row">
              <input type="number" placeholder="Price" value={editingItem ? editingItem.price : newItem.price} onChange={e => editingItem ? setEditingItem({ ...editingItem, price: parseInt(e.target.value) }) : setNewItem({ ...newItem, price: parseInt(e.target.value) })} required />
              <select value={editingItem ? editingItem.category : newItem.category} onChange={e => editingItem ? setEditingItem({ ...editingItem, category: e.target.value }) : setNewItem({ ...newItem, category: e.target.value })}>
                <option>Roti Varieties</option>
                <option>Chicken Gravy</option>
                <option>Veg Varieties</option>
                <option>Veg Rice</option>
                <option>Non-Veg Rice</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingItem ? 'Update' : 'Add'}</button>
              {editingItem && <button onClick={() => setEditingItem(null)}>Cancel</button>}
            </div>
          </form>

          <div className="items-table">
            {menu.map(item => (
              <div key={item.id} className="item-row">
                <div className="row-info">
                  <strong>#{item.no}</strong> {item.name} - ₹{item.price}
                </div>
                <div className="row-btns">
                  <button onClick={() => setEditingItem(item)}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
          <style>{`
        .menu-mgmt { display: flex; flex-direction: column; gap: 20px; }
        .item-form { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .form-row { display: flex; gap: 10px; margin-bottom: 10px; }
        .form-row input, .form-row select { flex: 1; padding: 10px; border: 1px solid #EEE; border-radius: 8px; }
        .item-row { display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 10px; border-bottom: 1px solid #EEE; }
        .row-btns { display: flex; gap: 8px; }
        .row-btns button { padding: 4px 8px; border-radius: 4px; border: 1px solid #EEE; cursor: pointer; }
        .row-btns .delete { color: red; }
      `}</style>
        </div>
        );
};

        const SettingsModule = ({settings, setSettings, API_BASE}) => {
  const handleSave = async (e) => {
          e.preventDefault();
        try {
          await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
          });
        alert("Settings saved!");
    } catch (err) {alert("Error saving settings"); }
  };

        return (
        <div className="settings-module">
          <form onSubmit={handleSave} className="item-form">
            <h3>General Settings</h3>
            <div className="input-group">
              <label>Dhaba Name</label>
              <input className="input-field" value={settings.name} onChange={e => setSettings({ ...settings, name: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Tagline</label>
              <input className="input-field" value={settings.tagline} onChange={e => setSettings({ ...settings, tagline: e.target.value })} />
            </div>
            <div className="input-group">
              <label>GST (%)</label>
              <input type="number" className="input-field" value={settings.gst} onChange={e => setSettings({ ...settings, gst: parseInt(e.target.value) })} />
            </div>
            <button type="submit" className="btn-primary">Save Settings</button>
          </form>
        </div>
        );
};

export default App;
