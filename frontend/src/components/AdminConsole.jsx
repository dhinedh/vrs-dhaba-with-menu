import React, { useState, useMemo, useEffect } from 'react';
import {
  Home as HomeIcon,
  ShoppingBag,
  Receipt,
  BarChart3,
  UtensilsCrossed,
  Package,
  Boxes,
  Users,
  Settings,
  LogOut,
  Plus,
  Search,
  Printer,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  CreditCard,
  Wallet,
  ChevronRight,
  Calendar,
  X,
  Bike,
  Box,
  Table as TableIcon,
  QrCode,
  Bell,
  Tag as TagIcon,
  MessageSquare,
  TrendingUp,
  FileText,
  UserCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Existing Sub-modules
import { DeliveryManagement } from './DeliveryManagement';
import { TakeawayManagement } from './TakeawayManagement';
import { LiveTableOverview } from './LiveTableOverview';
import { QRTableGenerator } from './QRTableGenerator';
import { CustomerAssistance } from './CustomerAssistance';
import { CustomerCRM } from './CustomerCRM';
import { CustomerCommunication } from './CustomerCommunication';
import { OffersEngine } from './OffersEngine';
import { ReportsAnalytics } from './ReportsAnalytics';
import { ExpenseTracker } from './ExpenseTracker';

export const AdminConsole = ({
  orders = [],
  setOrders,
  menu = [],
  setMenu,
  settings = {},
  setSettings,
  customers = [],
  setCustomers,
  offers = [],
  setOffers,
  expenses = [],
  setExpenses,
  tableRequests = [],
  setTableRequests,
  onLogout,
  onSelectTableForOrder
}) => {
  // 5 MAIN DOWNBAR TABS:
  // 'home'    => 01. Dashboard, 14. Notifications, 16. Account
  // 'order'   => 02. Order Management, 03. Table Management
  // 'billing' => 04. Billing Management, 05. Payment Management
  // 'report'  => 10. Reports & Analytics, 11. Expense Management, 12. Daily Closing
  // 'menu'    => 06. Menu Management, 07. Inventory, 08. Purchase, 09. Staff, 13. CRM, 15. Settings
  const [activeDownTab, setActiveDownTab] = useState('order');

  // Sub-navigation state per Downbar Category
  const [orderSubTab, setOrderSubTab] = useState('all-orders'); // 'all-orders', 'delivery', 'takeaway', 'tables', 'qr', 'assistance'
  const [orderStageFilter, setOrderStageFilter] = useState('ALL'); // 'ALL', 'Pending', 'Confirmed', 'Kitchen', 'Ready', 'Served', 'Billed', 'Cancelled'
  const [billingSubTab, setBillingSubTab] = useState('bills'); // 'bills', 'create-bill', 'payments'
  const [reportSubTab, setReportSubTab] = useState('reports'); // 'reports', 'expenses', 'daily-closing'
  const [menuSubTab, setMenuSubTab] = useState('menu-items'); // 'menu-items', 'inventory', 'purchase', 'staff', 'crm', 'settings'

  // Search queries
  const [orderSearch, setOrderSearch] = useState('');
  const [menuSearch, setMenuSearch] = useState('');

  // Thermal Printing
  const [printingOrder, setPrintingOrder] = useState(null);

  // Quick Bill Generator state (04. Billing Management)
  const [billTableNo, setBillTableNo] = useState('1');
  const [billCustomerName, setBillCustomerName] = useState('');
  const [billCustomerMobile, setBillCustomerMobile] = useState('');
  const [billItems, setBillItems] = useState({}); // itemId => qty
  const [billDiscount, setBillDiscount] = useState(0);
  const [billPayMethod, setBillPayMethod] = useState('Cash');

  // Inventory Management state (07. Inventory)
  const [inventoryList, setInventoryList] = useState(() => {
    const saved = localStorage.getItem('vrs_inventory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'INV-1', name: 'Basmati Biryani Rice', category: 'Grains', stock: 45, unit: 'kg', minThreshold: 20, costPrice: 95 },
      { id: 'INV-2', name: 'Sharbati Wheat Flour (Atta)', category: 'Flour', stock: 60, unit: 'kg', minThreshold: 25, costPrice: 42 },
      { id: 'INV-3', name: 'Farm Fresh Chicken', category: 'Poultry', stock: 18, unit: 'kg', minThreshold: 15, costPrice: 190 },
      { id: 'INV-4', name: 'Malai Paneer', category: 'Dairy', stock: 8, unit: 'kg', minThreshold: 10, costPrice: 340 },
      { id: 'INV-5', name: 'Desi Pure Ghee', category: 'Dairy', stock: 12, unit: 'litres', minThreshold: 5, costPrice: 620 },
      { id: 'INV-6', name: 'Refined Sunflower Oil', category: 'Oils', stock: 35, unit: 'litres', minThreshold: 15, costPrice: 135 },
      { id: 'INV-7', name: 'Commercial LPG Cylinder', category: 'Fuel', stock: 3, unit: 'cylinders', minThreshold: 2, costPrice: 1850 },
      { id: 'INV-8', name: 'Hand-Ground Garam Masala', category: 'Spices', stock: 6, unit: 'kg', minThreshold: 3, costPrice: 480 },
      { id: 'INV-9', name: 'Fresh Tomatoes', category: 'Vegetables', stock: 14, unit: 'kg', minThreshold: 10, costPrice: 35 },
      { id: 'INV-10', name: 'Red Onions', category: 'Vegetables', stock: 30, unit: 'kg', minThreshold: 15, costPrice: 28 }
    ];
  });

  // Purchase Management state (08. Purchase)
  const [purchaseList, setPurchaseList] = useState(() => {
    const saved = localStorage.getItem('vrs_purchases');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'PO-881', supplier: 'Salem Poultry Traders', date: new Date().toISOString().split('T')[0], amount: 5700, status: 'Paid', items: '30kg Farm Chicken' },
      { id: 'PO-882', supplier: 'Sri Krishna Dairy Farm', date: new Date().toISOString().split('T')[0], amount: 4800, status: 'Paid', items: '15kg Paneer, 5L Ghee' },
      { id: 'PO-883', supplier: 'Omalur Veg Mandi', date: new Date().toISOString().split('T')[0], amount: 2450, status: 'Pending', items: 'Tomatoes, Onions, Ginger' }
    ];
  });

  // Staff Management state (09. Staff)
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('vrs_staff');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'STF-1', name: 'Murali K.', role: 'Admin', phone: '9845213456', shift: 'Full Day', tables: 'All Tables', status: 'Active' },
      { id: 'STF-2', name: 'Ravi Kumar', role: 'Head Chef', phone: '9443210987', shift: 'Morning & Evening', tables: 'Tandoor & Gravy', status: 'Active' },
      { id: 'STF-3', name: 'Suresh S.', role: 'Senior Waiter', phone: '9786123450', shift: 'Lunch & Dinner', tables: 'T-1 to T-6', status: 'Active' },
      { id: 'STF-4', name: 'Manikandan P.', role: 'Waiter', phone: '9600123984', shift: 'Dinner Shift', tables: 'T-7 to T-14', status: 'Active' },
      { id: 'STF-5', name: 'Dinesh V.', role: 'Delivery Partner', phone: '9894123001', shift: 'On Call', tables: 'Online Deliveries', status: 'Active' }
    ];
  });

  // Daily Closing state (12. Daily Closing)
  const [openingCash, setOpeningCash] = useState(() => {
    return Number(localStorage.getItem('vrs_opening_cash') || 3000);
  });
  const [isDayClosed, setIsDayClosed] = useState(false);

  // Sync inventory, purchases, staff to localStorage
  useEffect(() => {
    localStorage.setItem('vrs_inventory', JSON.stringify(inventoryList));
  }, [inventoryList]);

  useEffect(() => {
    localStorage.setItem('vrs_purchases', JSON.stringify(purchaseList));
  }, [purchaseList]);

  useEffect(() => {
    localStorage.setItem('vrs_staff', JSON.stringify(staffList));
  }, [staffList]);

  // Order status actions
  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateTakeawayStatus = (id, takeawayStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, takeawayStatus } : o));
  };

  const updateDeliveryStatus = (id, deliveryStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o,
      deliveryStatus,
      status: deliveryStatus === 'Delivered' ? 'Ready' : (deliveryStatus === 'Dispatched' ? 'Ready' : 'Confirmed')
    } : o));
  };

  const assignDeliveryRider = (id, partner) => {
    setOrders(prev => prev.map(o => o.id === id ? {
      ...o,
      deliveryPartner: partner,
      deliveryStatus: 'Dispatched'
    } : o));
  };

  // Thermal printing handler
  const handlePrint = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      updateStatus(order.id, 'Billed');
    }, 500);
  };

  // WhatsApp Bill Dispatch
  const sendWhatsAppBill = (order) => {
    const mob = order.customerMobile || "9876543210";
    const cleanMob = mob.replace(/\D/g, '');
    const formattedMob = cleanMob.length === 10 ? `91${cleanMob}` : cleanMob;

    const itemsStr = order.items.map(i => `${i.quantity}x ${i.name} = ₹${i.price * i.quantity}`).join('\n');
    const msg = `🧾 *${settings.name} - Digital Receipt*\nOrder: #${order.id} | ${order.tokenNumber ? `TOKEN #${order.tokenNumber}` : `Table: ${order.tableNumber}`}\nDate: ${new Date().toLocaleString()}\n\nItems:\n${itemsStr}\n--------------------\nSubtotal: ₹${order.subtotal || order.total}\n${order.packagingCharge > 0 ? `Packaging Container Fee: +₹${order.packagingCharge}\n` : ''}${order.deliveryFee > 0 ? `Delivery Fee: +₹${order.deliveryFee}\n` : ''}GST (${settings.gst}%): ₹${Math.round(((order.subtotal || order.total) * settings.gst)/100)}\nDiscount: ₹${order.discountAmount || 0}\n*TOTAL PAYABLE: ₹${order.netTotal || order.total}*\nPayment Method: ${order.paymentMethod || 'Cash'}\n--------------------\nThank you for dining with us! 🙏`;

    const url = `https://wa.me/${formattedMob}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Filtered orders list by search & stage
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderSearch) {
        const q = orderSearch.toLowerCase();
        const matchId = String(o.id || '').toLowerCase().includes(q);
        const matchTbl = String(o.tableNumber || '').toLowerCase().includes(q);
        const matchToken = String(o.tokenNumber || '').toLowerCase().includes(q);
        const matchCust = String(o.customerName || '').toLowerCase().includes(q) || String(o.customerMobile || '').includes(q);
        if (!matchId && !matchTbl && !matchToken && !matchCust) return false;
      }

      if (orderStageFilter !== 'ALL') {
        const curr = o.status || 'Pending';
        if (orderStageFilter === 'Pending' && curr !== 'Pending') return false;
        if (orderStageFilter === 'Confirmed' && curr !== 'Confirmed') return false;
        if (orderStageFilter === 'Kitchen' && curr !== 'Kitchen' && curr !== 'Preparing') return false;
        if (orderStageFilter === 'Ready' && curr !== 'Ready') return false;
        if (orderStageFilter === 'Served' && curr !== 'Served') return false;
        if (orderStageFilter === 'Billed' && curr !== 'Billed') return false;
        if (orderStageFilter === 'Cancelled' && curr !== 'Cancelled') return false;
      }
      return true;
    });
  }, [orders, orderSearch, orderStageFilter]);

  // Orders count metrics
  const activeOrdersCount = orders.filter(o => o.status !== 'Billed' && o.status !== 'Cancelled').length;
  const pendingRequestsCount = tableRequests.filter(r => r.status !== 'Resolved').length;
  const activeDeliveryCount = orders.filter(o => o.orderType === 'Delivery' && o.deliveryStatus !== 'Delivered' && o.status !== 'Billed').length;
  const lowStockCount = inventoryList.filter(i => i.stock <= i.minThreshold).length;

  // Daily Sales & Revenue Breakdown
  const totalSalesToday = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
  }, [orders]);

  const cashSalesToday = useMemo(() => {
    return orders
      .filter(o => (o.paymentMethod || '').toLowerCase() === 'cash' || !o.paymentMethod)
      .reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
  }, [orders]);

  const upiSalesToday = useMemo(() => {
    return orders
      .filter(o => (o.paymentMethod || '').toLowerCase() === 'upi')
      .reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
  }, [orders]);

  const cardSalesToday = useMemo(() => {
    return orders
      .filter(o => (o.paymentMethod || '').toLowerCase() === 'card')
      .reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
  }, [orders]);

  const totalExpensesToday = useMemo(() => {
    return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const netClosingCashToday = openingCash + cashSalesToday - totalExpensesToday;

  // Quick Bill calculations
  const billSubtotal = useMemo(() => {
    return Object.entries(billItems).reduce((sum, [id, qty]) => {
      const item = menu.find(m => String(m.id) === String(id));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [billItems, menu]);

  const billGst = Math.round((billSubtotal * (settings.gst || 5)) / 100);
  const billNetTotal = Math.max(0, billSubtotal + billGst - Number(billDiscount || 0));

  const handleCreateQuickBill = () => {
    const itemsArr = Object.entries(billItems).map(([id, qty]) => {
      const item = menu.find(m => String(m.id) === String(id));
      return item ? { ...item, quantity: qty } : null;
    }).filter(Boolean);

    if (itemsArr.length === 0) {
      alert("Please add at least one item to generate bill!");
      return;
    }

    const newBillOrder = {
      id: "BILL-" + Math.floor(1000 + Math.random() * 9000),
      tableNumber: billTableNo,
      tokenNumber: "POS-" + Math.floor(100 + Math.random() * 900),
      orderType: "Dine-in",
      items: itemsArr,
      subtotal: billSubtotal,
      total: billSubtotal,
      discountAmount: Number(billDiscount || 0),
      netTotal: billNetTotal,
      customerName: billCustomerName.trim() || `Table ${billTableNo} Guest`,
      customerMobile: billCustomerMobile.trim() || "9876543210",
      paymentMethod: billPayMethod,
      paymentStatus: 'Paid',
      status: 'Billed',
      timestamp: new Date().toISOString()
    };

    setOrders([newBillOrder, ...orders]);
    setBillItems({});
    setBillDiscount(0);
    setBillCustomerName('');
    setBillCustomerMobile('');
    handlePrint(newBillOrder);
  };

  return (
    <div className="admin-console-layout">
      {/* ========================================================= */}
      {/* 🔝 TOP HEADER BAR */}
      {/* ========================================================= */}
      <header className="admin-top-bar">
        <div className="atb-left">
          <div className="dhaba-logo-icon">
            <UtensilsCrossed size={20} color="#EA580C" />
          </div>
          <div>
            <h1 className="atb-brand-name">{settings.name || "VRS Garden Dhaba"}</h1>
            <span className="atb-portal-subtitle">Smart Restaurant Management ERP</span>
          </div>
        </div>

        <div className="atb-right">
          {/* Quick Notifications Button */}
          <button 
            className="atb-icon-action-btn"
            onClick={() => {
              setActiveDownTab('home');
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {(pendingRequestsCount + activeDeliveryCount) > 0 && (
              <span className="atb-badge-alert">{pendingRequestsCount + activeDeliveryCount}</span>
            )}
          </button>

          {/* Quick Print Last Order */}
          {orders[0] && (
            <button 
              className="atb-icon-action-btn print-quick"
              onClick={() => handlePrint(orders[0])}
              title="Print Last Order Receipt"
            >
              <Printer size={18} />
            </button>
          )}

          {/* Logout */}
          <button className="atb-logout-btn" onClick={onLogout} title="Logout">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 🖥️ MAIN CONTENT CONTAINER */}
      {/* ========================================================= */}
      <main className="admin-main-viewport">
        {/* ========================================================= */}
        {/* TAB 1: 🏠 HOME (01. Dashboard, 14. Notifications, 16. Account) */}
        {/* ========================================================= */}
        {activeDownTab === 'home' && (
          <div className="tab-view-container home-dashboard-view">
            <div className="dashboard-hero-metric-bar">
              <div>
                <h2>Today's Executive Dashboard</h2>
                <p>Real-time financial summary, active pipeline & dhaba health</p>
              </div>
              <div className="dhaba-live-clock">
                <Clock size={16} color="#EA580C" />
                <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="kpi-cards-grid">
              <div className="kpi-card total-rev">
                <div className="kpi-card-header">
                  <span>Today's Total Sales</span>
                  <DollarSign size={20} color="#16A34A" />
                </div>
                <h3>₹{totalSalesToday.toLocaleString('en-IN')}</h3>
                <small>{orders.length} orders processed</small>
              </div>

              <div className="kpi-card live-orders">
                <div className="kpi-card-header">
                  <span>Live Active Orders</span>
                  <ShoppingBag size={20} color="#EA580C" />
                </div>
                <h3>{activeOrdersCount}</h3>
                <small>{activeDeliveryCount} out for delivery</small>
              </div>

              <div className="kpi-card cash-col">
                <div className="kpi-card-header">
                  <span>Cash in Register</span>
                  <Wallet size={20} color="#0284C7" />
                </div>
                <h3>₹{netClosingCashToday.toLocaleString('en-IN')}</h3>
                <small>Opening: ₹{openingCash} • Paid: ₹{cashSalesToday}</small>
              </div>

              <div className="kpi-card upi-col">
                <div className="kpi-card-header">
                  <span>Digital UPI / Card</span>
                  <CreditCard size={20} color="#7C3AED" />
                </div>
                <h3>₹{(upiSalesToday + cardSalesToday).toLocaleString('en-IN')}</h3>
                <small>UPI: ₹{upiSalesToday} • Card: ₹{cardSalesToday}</small>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="dashboard-quick-actions-strip">
              <button 
                className="dqa-btn"
                onClick={() => {
                  setActiveDownTab('billing');
                  setBillingSubTab('create-bill');
                }}
              >
                <Plus size={16} /> Create Quick Bill
              </button>
              <button 
                className="dqa-btn"
                onClick={() => {
                  setActiveDownTab('order');
                  setOrderSubTab('tables');
                }}
              >
                <TableIcon size={16} /> Table Layout
              </button>
              <button 
                className="dqa-btn"
                onClick={() => {
                  setActiveDownTab('order');
                  setOrderSubTab('delivery');
                }}
              >
                <Bike size={16} /> Dispatch Riders
              </button>
              <button 
                className="dqa-btn"
                onClick={() => {
                  setActiveDownTab('report');
                  setReportSubTab('daily-closing');
                }}
              >
                <Receipt size={16} /> Day-End Closing
              </button>
            </div>

            {/* Dual Column: Recent Activities + Alerts */}
            <div className="dashboard-dual-columns">
              {/* Recent Orders Stream */}
              <div className="dash-box recent-orders-box">
                <div className="dash-box-header">
                  <h3>Recent Activities & Orders</h3>
                  <button className="link-text-btn" onClick={() => setActiveDownTab('order')}>
                    View All ({orders.length}) →
                  </button>
                </div>

                <div className="recent-orders-stream">
                  {orders.slice(0, 5).map(ord => (
                    <div key={ord.id} className="stream-order-row">
                      <div className="sor-left">
                        <div className="sor-badge">
                          {ord.tokenNumber ? `#${ord.tokenNumber}` : `T-${ord.tableNumber}`}
                        </div>
                        <div>
                          <strong>Order #{ord.id} ({ord.orderType || 'Dine-in'})</strong>
                          <p>{ord.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                        </div>
                      </div>

                      <div className="sor-right">
                        <strong>₹{ord.netTotal || ord.total}</strong>
                        <span className={`sor-status ${String(ord.status || 'Pending').toLowerCase()}`}>
                          {ord.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 14. Notifications & Live Alerts */}
              <div className="dash-box alerts-box">
                <div className="dash-box-header">
                  <h3>Live Alerts & System Notifications</h3>
                  <span className="live-pulse-tag">● Live Telemetry</span>
                </div>

                <div className="alerts-feed-list">
                  {pendingRequestsCount > 0 && (
                    <div className="alert-item-card urgent">
                      <Bell size={18} color="#DC2626" />
                      <div>
                        <strong>{pendingRequestsCount} Table Assistance Requests</strong>
                        <p>Customers requested waiter/water/bill assistance</p>
                      </div>
                      <button 
                        className="btn-resolve-shortcut"
                        onClick={() => {
                          setActiveDownTab('order');
                          setOrderSubTab('assistance');
                        }}
                      >
                        Attend
                      </button>
                    </div>
                  )}

                  {lowStockCount > 0 && (
                    <div className="alert-item-card warning">
                      <AlertTriangle size={18} color="#D97706" />
                      <div>
                        <strong>{lowStockCount} Inventory Items Low on Stock</strong>
                        <p>Basmati rice, chicken, or LPG approaching threshold</p>
                      </div>
                      <button 
                        className="btn-resolve-shortcut"
                        onClick={() => {
                          setActiveDownTab('menu');
                          setMenuSubTab('inventory');
                        }}
                      >
                        Reorder
                      </button>
                    </div>
                  )}

                  {activeDeliveryCount > 0 && (
                    <div className="alert-item-card info">
                      <Bike size={18} color="#2563EB" />
                      <div>
                        <strong>{activeDeliveryCount} Active Home Deliveries</strong>
                        <p>Orders in preparation or assigned to delivery riders</p>
                      </div>
                      <button 
                        className="btn-resolve-shortcut"
                        onClick={() => {
                          setActiveDownTab('order');
                          setOrderSubTab('delivery');
                        }}
                      >
                        Track
                      </button>
                    </div>
                  )}

                  <div className="alert-item-card neutral">
                    <CheckCircle2 size={18} color="#16A34A" />
                    <div>
                      <strong>System Running Smoothly</strong>
                      <p>KOT printers online, thermal printer ready, cloud synced</p>
                    </div>
                  </div>
                </div>

                {/* 16. Account Profile Card */}
                <div className="account-quick-profile-card">
                  <div className="aqp-avatar">
                    <UserCheck size={20} color="#EA580C" />
                  </div>
                  <div className="aqp-info">
                    <strong>Logged in as Admin Manager</strong>
                    <small>Full administrative control • {settings.name}</small>
                  </div>
                  <button className="btn-logout-small" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: 📦 ORDER (02. Order Management, 03. Table Management) */}
        {/* ========================================================= */}
        {activeDownTab === 'order' && (
          <div className="tab-view-container orders-management-view">
            {/* Top Sub-Nav Pills */}
            <div className="sub-module-nav-pills">
              <button 
                className={`smn-pill ${orderSubTab === 'all-orders' ? 'active' : ''}`}
                onClick={() => setOrderSubTab('all-orders')}
              >
                <ShoppingBag size={14} /> Orders Pipeline ({orders.length})
              </button>

              <button 
                className={`smn-pill ${orderSubTab === 'delivery' ? 'active' : ''}`}
                onClick={() => setOrderSubTab('delivery')}
              >
                <Bike size={14} /> Online Delivery ({activeDeliveryCount})
              </button>

              <button 
                className={`smn-pill ${orderSubTab === 'takeaway' ? 'active' : ''}`}
                onClick={() => setOrderSubTab('takeaway')}
              >
                <Box size={14} /> Parcel Pipeline
              </button>

              <button 
                className={`smn-pill ${orderSubTab === 'tables' ? 'active' : ''}`}
                onClick={() => setOrderSubTab('tables')}
              >
                <TableIcon size={14} /> Tables Layout
              </button>

              <button 
                className={`smn-pill ${orderSubTab === 'assistance' ? 'active' : ''}`}
                onClick={() => setOrderSubTab('assistance')}
              >
                <Bell size={14} /> Table Calls ({pendingRequestsCount})
              </button>

              <button 
                className={`smn-pill ${orderSubTab === 'qr' ? 'active' : ''}`}
                onClick={() => setOrderSubTab('qr')}
              >
                <QrCode size={14} /> QR Generator
              </button>
            </div>

            {/* Sub-view: All Orders Pipeline */}
            {orderSubTab === 'all-orders' && (
              <div className="orders-pipeline-subview">
                {/* Search & Stage Filters */}
                <div className="order-pipeline-filter-bar">
                  <div className="opfb-search-box">
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Search Order #ID, Token, Table, Customer Mobile..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                    />
                    {orderSearch && <button onClick={() => setOrderSearch('')}>✕</button>}
                  </div>

                  {/* Stage filter pills */}
                  <div className="stage-filter-chips">
                    {['ALL', 'Pending', 'Confirmed', 'Kitchen', 'Ready', 'Served', 'Billed', 'Cancelled'].map(stg => (
                      <button
                        key={stg}
                        className={`sfc-chip ${orderStageFilter === stg ? 'active' : ''}`}
                        onClick={() => setOrderStageFilter(stg)}
                      >
                        {stg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Cards Grid */}
                <div className="orders-cards-responsive-grid">
                  {filteredOrders.length === 0 ? (
                    <div className="empty-orders-state">
                      <ShoppingBag size={48} color="#CBD5E1" />
                      <h3>No Orders Found</h3>
                      <p>No orders match the selected stage filter or search criteria.</p>
                    </div>
                  ) : (
                    filteredOrders.map(o => (
                      <div key={o.id} className={`order-card-tile ${(o.status || 'Pending').toLowerCase()}`}>
                        <div className="oct-header">
                          <span className="oct-table-badge">
                            {o.tokenNumber ? `TOKEN #${o.tokenNumber}` : `Table ${o.tableNumber}`}
                          </span>
                          <span className={`oct-status-tag ${(o.status || 'Pending').toLowerCase()}`}>
                            {o.status || 'Pending'}
                          </span>
                        </div>

                        <div className="oct-meta-row">
                          <span className="oct-order-id">#{o.id} • {o.orderType || 'Dine-in'}</span>
                          <strong className="oct-net-price">₹{o.netTotal || o.total}</strong>
                        </div>

                        {o.customerMobile && (
                          <div className="oct-cust-row">
                            📱 {o.customerName ? `${o.customerName} (${o.customerMobile})` : o.customerMobile}
                          </div>
                        )}

                        <div className="oct-items-list">
                          {o.items?.map((it, idx) => (
                            <div key={idx} className="oct-item-row">
                              <span><strong>{it.quantity}x</strong> {it.name}</span>
                              <span>₹{it.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {o.deliveryAddress && (
                          <div className="oct-delivery-address-note">
                            📍 {o.deliveryAddress.houseNo}, {o.deliveryAddress.streetArea} (PIN: {o.deliveryAddress.pincode})
                          </div>
                        )}

                        {o.packagingCharge > 0 && (
                          <small className="oct-pkg-charge">📦 Packaging Container Fee: +₹{o.packagingCharge}</small>
                        )}

                        <div className="oct-actions-bar">
                          {o.status === 'Pending' && (
                            <button className="btn-stg btn-confirm" onClick={() => updateStatus(o.id, 'Confirmed')}>
                              Confirm
                            </button>
                          )}
                          {o.status === 'Confirmed' && (
                            <button className="btn-stg btn-kitchen" onClick={() => updateStatus(o.id, 'Kitchen')}>
                              Send to Kitchen
                            </button>
                          )}
                          {(o.status === 'Kitchen' || o.status === 'Preparing') && (
                            <button className="btn-stg btn-ready" onClick={() => updateStatus(o.id, 'Ready')}>
                              Mark Ready
                            </button>
                          )}
                          {o.status === 'Ready' && (
                            <button className="btn-stg btn-served" onClick={() => updateStatus(o.id, 'Served')}>
                              Mark Served
                            </button>
                          )}

                          <button className="btn-stg btn-wa" onClick={() => sendWhatsAppBill(o)}>
                            <Send size={13} /> WA Bill
                          </button>

                          <button className="btn-stg btn-print" onClick={() => handlePrint(o)}>
                            <Printer size={13} /> Print KOT
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-view: Online Delivery Logistics */}
            {orderSubTab === 'delivery' && (
              <DeliveryManagement 
                orders={orders}
                onUpdateDeliveryStatus={updateDeliveryStatus}
                onAssignRider={assignDeliveryRider}
                onPrintDeliveryBill={handlePrint}
                settings={settings}
              />
            )}

            {/* Sub-view: Takeaway Parcel Pipeline */}
            {orderSubTab === 'takeaway' && (
              <TakeawayManagement 
                orders={orders}
                onUpdateTakeawayStatus={updateTakeawayStatus}
                onPrintBill={handlePrint}
                settings={settings}
              />
            )}

            {/* Sub-view: Live Table Layout */}
            {orderSubTab === 'tables' && (
              <LiveTableOverview 
                orders={orders} 
                onSelectTable={(tblNo, ord) => onSelectTableForOrder(tblNo, ord)}
                onPrintBill={handlePrint}
              />
            )}

            {/* Sub-view: Customer Table Calls / Assistance */}
            {orderSubTab === 'assistance' && (
              <CustomerAssistance 
                requests={tableRequests}
                onResolveRequest={(reqId) => {
                  setTableRequests(tableRequests.map(r => r.id === reqId ? { ...r, status: 'Resolved', resolvedAt: new Date().toISOString() } : r));
                }}
                onClearAll={() => setTableRequests(tableRequests.filter(r => r.status !== 'Resolved'))}
              />
            )}

            {/* Sub-view: QR Generator */}
            {orderSubTab === 'qr' && (
              <QRTableGenerator settings={settings} totalTablesCount={20} />
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: 💳 BILLING (04. Billing Management, 05. Payment Management) */}
        {/* ========================================================= */}
        {activeDownTab === 'billing' && (
          <div className="tab-view-container billing-management-view">
            {/* Top Sub-Nav Pills */}
            <div className="sub-module-nav-pills">
              <button 
                className={`smn-pill ${billingSubTab === 'bills' ? 'active' : ''}`}
                onClick={() => setBillingSubTab('bills')}
              >
                <Receipt size={14} /> Bills & Invoices ({orders.length})
              </button>

              <button 
                className={`smn-pill ${billingSubTab === 'create-bill' ? 'active' : ''}`}
                onClick={() => setBillingSubTab('create-bill')}
              >
                <Plus size={14} /> POS Quick Bill Creator
              </button>

              <button 
                className={`smn-pill ${billingSubTab === 'payments' ? 'active' : ''}`}
                onClick={() => setBillingSubTab('payments')}
              >
                <CreditCard size={14} /> Payment Reconciliation
              </button>
            </div>

            {/* Sub-view: Create New Bill (POS) */}
            {billingSubTab === 'create-bill' && (
              <div className="create-bill-pos-container">
                <div className="cbp-left-menu">
                  <div className="cbp-search">
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Search dishes to add to bill..."
                      value={menuSearch}
                      onChange={e => setMenuSearch(e.target.value)}
                    />
                  </div>

                  <div className="cbp-menu-grid">
                    {menu.filter(m => !menuSearch || m.name.toLowerCase().includes(menuSearch.toLowerCase())).map(item => {
                      const qty = billItems[item.id] || 0;
                      return (
                        <div 
                          key={item.id} 
                          className="cbp-menu-item-tile"
                          onClick={() => {
                            setBillItems(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
                          }}
                        >
                          <div className="cmit-name">
                            <span className={`veg-dot ${item.veg ? 'veg' : 'non-veg'}`} />
                            <strong>{item.name}</strong>
                          </div>
                          <div className="cmit-price-qty">
                            <span>₹{item.price}</span>
                            {qty > 0 && <span className="cmit-qty-badge">{qty}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="cbp-right-invoice-card">
                  <h3>New Tax Invoice (POS)</h3>
                  
                  <div className="cbp-meta-inputs">
                    <div>
                      <label>Table #</label>
                      <input 
                        type="text" 
                        value={billTableNo} 
                        onChange={e => setBillTableNo(e.target.value)}
                        placeholder="Table 1" 
                      />
                    </div>
                    <div>
                      <label>Customer Mobile</label>
                      <input 
                        type="tel" 
                        maxLength={10}
                        value={billCustomerMobile} 
                        onChange={e => setBillCustomerMobile(e.target.value)}
                        placeholder="9876543210" 
                      />
                    </div>
                  </div>

                  {/* Bill Items List */}
                  <div className="cbp-selected-items-list">
                    {Object.keys(billItems).length === 0 ? (
                      <p className="no-items-hint">Tap any dish on the left to add it to the bill</p>
                    ) : (
                      Object.entries(billItems).map(([id, qty]) => {
                        const item = menu.find(m => String(m.id) === String(id));
                        if (!item) return null;
                        return (
                          <div key={id} className="cbp-bill-row">
                            <span className="cbr-name">{item.name}</span>
                            <div className="cbr-qty-stepper">
                              <button onClick={() => {
                                setBillItems(prev => {
                                  const c = { ...prev };
                                  if (c[id] <= 1) delete c[id];
                                  else c[id] -= 1;
                                  return c;
                                });
                              }}>-</button>
                              <span>{qty}</span>
                              <button onClick={() => {
                                setBillItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
                              }}>+</button>
                            </div>
                            <span className="cbr-total">₹{item.price * qty}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Bill Calculation */}
                  <div className="cbp-calc-box">
                    <div className="calc-row">
                      <span>Subtotal</span>
                      <span>₹{billSubtotal}</span>
                    </div>
                    <div className="calc-row">
                      <span>GST ({settings.gst || 5}%)</span>
                      <span>₹{billGst}</span>
                    </div>
                    <div className="calc-row">
                      <span>Discount (₹)</span>
                      <input 
                        type="number" 
                        value={billDiscount} 
                        onChange={e => setBillDiscount(Number(e.target.value) || 0)}
                        style={{ width: 70, textAlign: 'right', padding: 3 }}
                      />
                    </div>
                    <div className="calc-row grand-total">
                      <strong>Net Payable</strong>
                      <strong>₹{billNetTotal}</strong>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="cbp-payment-tabs">
                    {['Cash', 'UPI', 'Card'].map(pm => (
                      <button 
                        key={pm}
                        className={`pm-btn ${billPayMethod === pm ? 'active' : ''}`}
                        onClick={() => setBillPayMethod(pm)}
                      >
                        {pm === 'Cash' && '💵 '}
                        {pm === 'UPI' && '📱 '}
                        {pm === 'Card' && '💳 '}
                        {pm}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="btn-generate-bill-print"
                    onClick={handleCreateQuickBill}
                  >
                    <Printer size={18} /> Print & Settle Invoice (₹{billNetTotal})
                  </button>
                </div>
              </div>
            )}

            {/* Sub-view: Bills & Invoices List */}
            {billingSubTab === 'bills' && (
              <div className="invoices-list-subview">
                <div className="invoices-summary-strip">
                  <div className="iss-box">
                    <span>Total Invoices</span>
                    <strong>{orders.length}</strong>
                  </div>
                  <div className="iss-box">
                    <span>Paid Invoices</span>
                    <strong style={{ color: '#16A34A' }}>{orders.filter(o => o.status === 'Billed').length}</strong>
                  </div>
                  <div className="iss-box">
                    <span>Pending Settlement</span>
                    <strong style={{ color: '#EA580C' }}>{orders.filter(o => o.status !== 'Billed' && o.status !== 'Cancelled').length}</strong>
                  </div>
                  <div className="iss-box">
                    <span>Total Billed Amount</span>
                    <strong>₹{totalSalesToday.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="invoices-table-card">
                  <table className="modern-admin-table">
                    <thead>
                      <tr>
                        <th>Bill ID</th>
                        <th>Table / Token</th>
                        <th>Time</th>
                        <th>Customer</th>
                        <th>Items Count</th>
                        <th>Pay Method</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(ord => (
                        <tr key={ord.id}>
                          <td><strong>#{ord.id}</strong></td>
                          <td>{ord.tokenNumber ? `TOKEN #${ord.tokenNumber}` : `Table ${ord.tableNumber}`}</td>
                          <td>{new Date(ord.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td>{ord.customerName || 'Walk-in'} ({ord.customerMobile || '-'})</td>
                          <td>{ord.items?.length || 0} items</td>
                          <td>
                            <span className="pay-method-badge">{ord.paymentMethod || 'Cash'}</span>
                          </td>
                          <td>
                            <span className={`status-pill ${(ord.status || 'Pending').toLowerCase()}`}>
                              {ord.status || 'Pending'}
                            </span>
                          </td>
                          <td><strong className="table-price">₹{ord.netTotal || ord.total}</strong></td>
                          <td>
                            <div className="tbl-btn-actions">
                              <button className="btn-tbl-action" onClick={() => handlePrint(ord)} title="Reprint Bill">
                                <Printer size={14} />
                              </button>
                              <button className="btn-tbl-action" onClick={() => sendWhatsAppBill(ord)} title="WhatsApp Receipt">
                                <Send size={14} />
                              </button>
                              {ord.status !== 'Billed' && (
                                <button 
                                  className="btn-tbl-action settle" 
                                  onClick={() => updateStatus(ord.id, 'Billed')}
                                  title="Mark Settle / Paid"
                                >
                                  Settle
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-view: 05. Payment Management & Reconciliation */}
            {billingSubTab === 'payments' && (
              <div className="payments-reconciliation-subview">
                <div className="pay-method-cards-grid">
                  <div className="pm-stat-card cash">
                    <div className="pmsc-header">
                      <span>Cash In Register</span>
                      <Wallet size={24} color="#16A34A" />
                    </div>
                    <h3>₹{cashSalesToday.toLocaleString('en-IN')}</h3>
                    <p>Total collected in cash today</p>
                  </div>

                  <div className="pm-stat-card upi">
                    <div className="pmsc-header">
                      <span>UPI Collections (GPay / PhonePe)</span>
                      <CreditCard size={24} color="#0284C7" />
                    </div>
                    <h3>₹{upiSalesToday.toLocaleString('en-IN')}</h3>
                    <p>Direct bank transfers & QR payments</p>
                  </div>

                  <div className="pm-stat-card card">
                    <div className="pmsc-header">
                      <span>Card POS Machine</span>
                      <CreditCard size={24} color="#7C3AED" />
                    </div>
                    <h3>₹{cardSalesToday.toLocaleString('en-IN')}</h3>
                    <p>Credit & Debit card transactions</p>
                  </div>
                </div>

                <div className="payments-log-table-box">
                  <h3>Payment Transactions Log</h3>
                  <table className="modern-admin-table">
                    <thead>
                      <tr>
                        <th>Transaction Ref</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Payment Mode</th>
                        <th>Payment Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td>TXN-{o.id.replace('ORD-', '')}</td>
                          <td>#{o.id}</td>
                          <td>{o.customerName || 'Guest'}</td>
                          <td><strong>{o.paymentMethod || 'Cash'}</strong></td>
                          <td>
                            <span className="pay-status-badge success">✓ Confirmed</span>
                          </td>
                          <td><strong>₹{o.netTotal || o.total}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: 📊 REPORT (10. Reports & Analytics, 11. Expenses, 12. Daily Closing) */}
        {/* ========================================================= */}
        {activeDownTab === 'report' && (
          <div className="tab-view-container reports-management-view">
            {/* Top Sub-Nav Pills */}
            <div className="sub-module-nav-pills">
              <button 
                className={`smn-pill ${reportSubTab === 'reports' ? 'active' : ''}`}
                onClick={() => setReportSubTab('reports')}
              >
                <TrendingUp size={14} /> 10. Reports & Analytics
              </button>

              <button 
                className={`smn-pill ${reportSubTab === 'expenses' ? 'active' : ''}`}
                onClick={() => setReportSubTab('expenses')}
              >
                <DollarSign size={14} /> 11. Expense Management ({expenses.length})
              </button>

              <button 
                className={`smn-pill ${reportSubTab === 'daily-closing' ? 'active' : ''}`}
                onClick={() => setReportSubTab('daily-closing')}
              >
                <Receipt size={14} /> 12. Daily Closing & Balance
              </button>
            </div>

            {/* Sub-view: Reports & Analytics */}
            {reportSubTab === 'reports' && (
              <ReportsAnalytics 
                orders={orders} 
                expenses={expenses} 
                customers={customers} 
              />
            )}

            {/* Sub-view: Expense Tracker */}
            {reportSubTab === 'expenses' && (
              <ExpenseTracker 
                expenses={expenses}
                onAddExpense={(exp) => setExpenses([exp, ...expenses])}
                onDeleteExpense={(expId) => setExpenses(expenses.filter(e => e.id !== expId))}
              />
            )}

            {/* Sub-view: 12. Daily Closing Report */}
            {reportSubTab === 'daily-closing' && (
              <div className="daily-closing-subview">
                <div className="daily-closing-card">
                  <div className="dcc-header">
                    <h2>Day-End Reconciliation & Register Closing</h2>
                    <p>Date: {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  <div className="dcc-breakdown-table">
                    <div className="dcc-row">
                      <span>(+) Opening Drawer Cash</span>
                      <div className="dcc-edit-input">
                        <span>₹</span>
                        <input 
                          type="number" 
                          value={openingCash}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setOpeningCash(val);
                            localStorage.setItem('vrs_opening_cash', String(val));
                          }}
                        />
                      </div>
                    </div>

                    <div className="dcc-row">
                      <span>(+) Cash Orders Collected</span>
                      <strong>+ ₹{cashSalesToday.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="dcc-row">
                      <span>(+) UPI Collections (Bank Direct)</span>
                      <strong>+ ₹{upiSalesToday.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="dcc-row">
                      <span>(+) Card Swipes (POS Machine)</span>
                      <strong>+ ₹{cardSalesToday.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="dcc-row expense-row">
                      <span>(-) Day's Operating Expenses Paid from Cash</span>
                      <strong style={{ color: '#DC2626' }}>- ₹{totalExpensesToday.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="dcc-divider" />

                    <div className="dcc-row net-total-row">
                      <div>
                        <strong>Physical Cash in Register Expected</strong>
                        <small>Opening Cash + Cash Sales - Cash Expenses</small>
                      </div>
                      <strong className="grand-cash-amount">₹{netClosingCashToday.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="dcc-row grand-total-day">
                      <span>Total Gross Dhaba Revenue Today</span>
                      <strong style={{ color: '#16A34A', fontSize: '1.3rem' }}>₹{totalSalesToday.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  <div className="dcc-actions">
                    <button 
                      className="btn-finalize-day"
                      onClick={() => {
                        setIsDayClosed(true);
                        alert(`✅ Daily Closing Finalized!\nOpening Cash: ₹${openingCash}\nTotal Sales: ₹${totalSalesToday}\nExpenses: ₹${totalExpensesToday}\nClosing Cash: ₹${netClosingCashToday}`);
                        window.print();
                      }}
                    >
                      <CheckCircle2 size={18} /> Finalize & Print Day Closing Sheet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: 🍽️ MENU (06. Menu, 07. Inventory, 08. Purchase, 09. Staff, 13. CRM, 15. Settings) */}
        {/* ========================================================= */}
        {activeDownTab === 'menu' && (
          <div className="tab-view-container operations-management-view">
            {/* Top Sub-Nav Pills */}
            <div className="sub-module-nav-pills">
              <button 
                className={`smn-pill ${menuSubTab === 'menu-items' ? 'active' : ''}`}
                onClick={() => setMenuSubTab('menu-items')}
              >
                <Package size={14} /> 06. Menu Management ({menu.length})
              </button>

              <button 
                className={`smn-pill ${menuSubTab === 'inventory' ? 'active' : ''}`}
                onClick={() => setMenuSubTab('inventory')}
              >
                <Boxes size={14} /> 07. Inventory Stock ({inventoryList.length})
              </button>

              <button 
                className={`smn-pill ${menuSubTab === 'purchase' ? 'active' : ''}`}
                onClick={() => setMenuSubTab('purchase')}
              >
                <Truck size={14} /> 08. Purchase ({purchaseList.length})
              </button>

              <button 
                className={`smn-pill ${menuSubTab === 'staff' ? 'active' : ''}`}
                onClick={() => setMenuSubTab('staff')}
              >
                <Users size={14} /> 09. Staff ({staffList.length})
              </button>

              <button 
                className={`smn-pill ${menuSubTab === 'crm' ? 'active' : ''}`}
                onClick={() => setMenuSubTab('crm')}
              >
                <MessageSquare size={14} /> 13. Customer CRM ({customers.length})
              </button>

              <button 
                className={`smn-pill ${menuSubTab === 'offers' ? 'active' : ''}`}
                onClick={() => setMenuSubTab('offers')}
              >
                <TagIcon size={14} /> Offers & Coupons
              </button>

              <button 
                className={`smn-pill ${menuSubTab === 'settings' ? 'active' : ''}`}
                onClick={() => setMenuSubTab('settings')}
              >
                <Settings size={14} /> 15. Settings
              </button>
            </div>

            {/* Sub-view: 06. Menu Management */}
            {menuSubTab === 'menu-items' && (
              <div className="menu-mgmt-subview">
                <div className="menu-mgmt-header-row">
                  <div className="mmh-search">
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Search menu dishes..."
                      value={menuSearch}
                      onChange={e => setMenuSearch(e.target.value)}
                    />
                  </div>

                  <button 
                    className="btn-add-new-dish"
                    onClick={() => {
                      const name = prompt("Enter Dish Name:");
                      if (!name) return;
                      const price = parseInt(prompt("Enter Dish Price (₹):") || "100");
                      const category = prompt("Enter Category (e.g. Roti Varieties, Chicken Gravy):") || "Dhaba Specials";
                      const veg = confirm("Is this dish Pure Veg? (OK = Veg, Cancel = Non-Veg)");
                      const newItem = {
                        id: String(Date.now()),
                        no: String(menu.length + 101),
                        name,
                        price,
                        category,
                        veg,
                        icon: veg ? "🥗" : "🍗"
                      };
                      setMenu([...menu, newItem]);
                    }}
                  >
                    <Plus size={16} /> Add New Dish
                  </button>
                </div>

                <div className="menu-items-table-card">
                  <table className="modern-admin-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Dish Name</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Price (₹)</th>
                        <th>Availability</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menu.filter(m => !menuSearch || m.name.toLowerCase().includes(menuSearch.toLowerCase())).map(item => (
                        <tr key={item.id}>
                          <td><strong>#{item.no || item.id}</strong></td>
                          <td>
                            <div className="mit-name-col">
                              <span>{item.icon || (item.veg ? "🥗" : "🍗")}</span>
                              <strong>{item.name}</strong>
                            </div>
                          </td>
                          <td>
                            <span className={`type-tag ${item.veg ? 'veg' : 'non-veg'}`}>
                              {item.veg ? "🟢 Veg" : "🔴 Non-Veg"}
                            </span>
                          </td>
                          <td>{item.category || "General"}</td>
                          <td><strong>₹{item.price}</strong></td>
                          <td>
                            <span className="stock-status-pill in-stock">Available</span>
                          </td>
                          <td>
                            <div className="tbl-btn-actions">
                              <button 
                                className="btn-tbl-action"
                                onClick={() => {
                                  const newPrice = prompt(`Enter new price for ${item.name}:`, String(item.price));
                                  if (newPrice) {
                                    setMenu(menu.map(m => m.id === item.id ? { ...m, price: parseInt(newPrice) || m.price } : m));
                                  }
                                }}
                              >
                                Edit Price
                              </button>
                              <button 
                                className="btn-tbl-action delete"
                                onClick={() => {
                                  if (confirm(`Delete "${item.name}" from menu?`)) {
                                    setMenu(menu.filter(m => m.id !== item.id));
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-view: 07. Inventory Management */}
            {menuSubTab === 'inventory' && (
              <div className="inventory-mgmt-subview">
                <div className="inv-top-bar">
                  <div>
                    <h3>Raw Material & Ingredient Inventory</h3>
                    <p>Track store room stocks, minimum thresholds & procurement</p>
                  </div>

                  <button 
                    className="btn-add-inv-item"
                    onClick={() => {
                      const name = prompt("Enter Item Name (e.g. Basmati Rice):");
                      if (!name) return;
                      const stock = Number(prompt("Current Stock Quantity:") || 10);
                      const unit = prompt("Unit (kg / litres / packets):") || "kg";
                      const cost = Number(prompt("Cost Price per unit (₹):") || 50);
                      setInventoryList([
                        ...inventoryList,
                        { id: `INV-${Date.now()}`, name, category: 'General', stock, unit, minThreshold: 10, costPrice: cost }
                      ]);
                    }}
                  >
                    <Plus size={16} /> Add Inventory Item
                  </button>
                </div>

                <div className="inv-table-card">
                  <table className="modern-admin-table">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Current Stock</th>
                        <th>Min Threshold</th>
                        <th>Status</th>
                        <th>Stock Adjustment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryList.map(inv => {
                        const isLow = inv.stock <= inv.minThreshold;
                        return (
                          <tr key={inv.id}>
                            <td>{inv.id}</td>
                            <td><strong>{inv.name}</strong></td>
                            <td>{inv.category}</td>
                            <td><strong>{inv.stock} {inv.unit}</strong></td>
                            <td>{inv.minThreshold} {inv.unit}</td>
                            <td>
                              <span className={`stock-status-pill ${isLow ? 'low' : 'good'}`}>
                                {isLow ? '⚠️ LOW STOCK' : '✓ Sufficient'}
                              </span>
                            </td>
                            <td>
                              <div className="inv-adjust-btns">
                                <button onClick={() => {
                                  setInventoryList(inventoryList.map(i => i.id === inv.id ? { ...i, stock: Math.max(0, i.stock - 5) } : i));
                                }}>- 5</button>
                                <button onClick={() => {
                                  setInventoryList(inventoryList.map(i => i.id === inv.id ? { ...i, stock: i.stock + 10 } : i));
                                }}>+ 10</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-view: 08. Purchase Management */}
            {menuSubTab === 'purchase' && (
              <div className="purchase-mgmt-subview">
                <div className="inv-top-bar">
                  <div>
                    <h3>Supplier Purchase Orders & Procurement</h3>
                    <p>Track vendor bills, grocery purchases and payments</p>
                  </div>
                  <button 
                    className="btn-add-inv-item"
                    onClick={() => {
                      const supplier = prompt("Enter Supplier Name:");
                      if (!supplier) return;
                      const amount = Number(prompt("Purchase Bill Amount (₹):") || 1000);
                      const items = prompt("Items description:") || "Kitchen Supplies";
                      setPurchaseList([
                        { id: `PO-${Math.floor(100 + Math.random() * 900)}`, supplier, date: new Date().toISOString().split('T')[0], amount, status: 'Paid', items },
                        ...purchaseList
                      ]);
                    }}
                  >
                    <Plus size={16} /> New Purchase Order
                  </button>
                </div>

                <div className="purchase-table-card">
                  <table className="modern-admin-table">
                    <thead>
                      <tr>
                        <th>PO #</th>
                        <th>Supplier</th>
                        <th>Date</th>
                        <th>Items Bought</th>
                        <th>Status</th>
                        <th>Bill Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseList.map(po => (
                        <tr key={po.id}>
                          <td><strong>{po.id}</strong></td>
                          <td><strong>{po.supplier}</strong></td>
                          <td>{po.date}</td>
                          <td>{po.items}</td>
                          <td><span className="pay-status-badge success">{po.status}</span></td>
                          <td><strong>₹{po.amount}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-view: 09. Staff Management */}
            {menuSubTab === 'staff' && (
              <div className="staff-mgmt-subview">
                <div className="inv-top-bar">
                  <div>
                    <h3>Staff Members, Waiters & Roster</h3>
                    <p>Manage staff attendance, shifts and table assignments</p>
                  </div>
                  <button 
                    className="btn-add-inv-item"
                    onClick={() => {
                      const name = prompt("Enter Staff Name:");
                      if (!name) return;
                      const role = prompt("Role (Waiter / Chef / Cashier):") || "Waiter";
                      const phone = prompt("Mobile Number:") || "9876543210";
                      setStaffList([
                        ...staffList,
                        { id: `STF-${staffList.length + 1}`, name, role, phone, shift: 'Full Shift', tables: 'Assigned', status: 'Active' }
                      ]);
                    }}
                  >
                    <Plus size={16} /> Add Staff Member
                  </button>
                </div>

                <div className="staff-cards-grid">
                  {staffList.map(stf => (
                    <div key={stf.id} className="staff-member-card">
                      <div className="smc-header">
                        <div className="smc-avatar">
                          <UserCheck size={20} color="#EA580C" />
                        </div>
                        <div>
                          <h4>{stf.name}</h4>
                          <span className="smc-role-tag">{stf.role}</span>
                        </div>
                      </div>
                      <div className="smc-body">
                        <p>📱 {stf.phone}</p>
                        <p>🕒 Shift: {stf.shift}</p>
                        <p>📍 Coverage: {stf.tables}</p>
                        <span className="smc-status active">● {stf.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-view: 13. Customer CRM */}
            {menuSubTab === 'crm' && (
              <CustomerCRM 
                customers={customers} 
                orders={orders} 
                onSaveCustomer={(cust) => {
                  const existingIdx = customers.findIndex(c => c.id === cust.id || c.mobile === cust.mobile);
                  if (existingIdx !== -1) {
                    const updated = [...customers];
                    updated[existingIdx] = cust;
                    setCustomers(updated);
                  } else {
                    setCustomers([cust, ...customers]);
                  }
                }}
                onSendWhatsApp={(cust) => {
                  setMenuSubTab('settings');
                }}
              />
            )}

            {/* Sub-view: Offers & Discounts */}
            {menuSubTab === 'offers' && (
              <OffersEngine 
                offers={offers}
                onSaveOffer={(newOff) => setOffers([newOff, ...offers])}
                onDeleteOffer={(offId) => setOffers(offers.filter(o => o.id !== offId))}
                onToggleOffer={(offId) => setOffers(offers.map(o => o.id === offId ? { ...o, isActive: !o.isActive } : o))}
              />
            )}

            {/* Sub-view: 15. Settings */}
            {menuSubTab === 'settings' && (
              <div className="settings-mgmt-subview">
                <div className="settings-editor-box">
                  <h3>Restaurant Configuration & Hotel Profile</h3>
                  
                  <div className="settings-fields-grid">
                    <div className="sfg-field">
                      <label>Dhaba / Hotel Name</label>
                      <input 
                        type="text" 
                        value={settings.name || ''} 
                        onChange={e => setSettings({ ...settings, name: e.target.value })} 
                      />
                    </div>

                    <div className="sfg-field">
                      <label>Tagline / Cuisine</label>
                      <input 
                        type="text" 
                        value={settings.tagline || ''} 
                        onChange={e => setSettings({ ...settings, tagline: e.target.value })} 
                      />
                    </div>

                    <div className="sfg-field">
                      <label>GST Tax Rate (%)</label>
                      <input 
                        type="number" 
                        value={settings.gst || 5} 
                        onChange={e => setSettings({ ...settings, gst: Number(e.target.value) || 0 })} 
                      />
                    </div>

                    <div className="sfg-field">
                      <label>Takeaway Container Packaging Charge (₹)</label>
                      <input 
                        type="number" 
                        value={settings.packagingCharge || 15} 
                        onChange={e => setSettings({ ...settings, packagingCharge: Number(e.target.value) || 0 })} 
                      />
                    </div>

                    <div className="sfg-field">
                      <label>Restaurant Phone Helpline</label>
                      <input 
                        type="text" 
                        value={settings.phone || '9876543210'} 
                        onChange={e => setSettings({ ...settings, phone: e.target.value })} 
                      />
                    </div>

                    <div className="sfg-field">
                      <label>Thermal Receipt Footer Note</label>
                      <input 
                        type="text" 
                        value={settings.footerNote || 'Thank you for dining with us! Visit again.'} 
                        onChange={e => setSettings({ ...settings, footerNote: e.target.value })} 
                      />
                    </div>
                  </div>

                  <button 
                    className="btn-save-settings-action"
                    onClick={() => {
                      localStorage.setItem('vrs_settings', JSON.stringify(settings));
                      alert("Settings saved successfully!");
                    }}
                  >
                    Save & Update Hotel Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 📱 FIXED BOTTOM DOWNBAR NAVIGATION (Home, Order, Billing, Report, Menu) */}
      {/* ========================================================= */}
      <nav className="admin-bottom-downbar">
        {/* 1. Home */}
        <button 
          className={`abd-item ${activeDownTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveDownTab('home')}
        >
          <HomeIcon size={20} />
          <span>Home</span>
          {pendingRequestsCount > 0 && <span className="abd-badge-dot" />}
        </button>

        {/* 2. Order */}
        <button 
          className={`abd-item ${activeDownTab === 'order' ? 'active' : ''}`}
          onClick={() => {
            setActiveDownTab('order');
            setOrderSubTab('all-orders');
          }}
        >
          <ShoppingBag size={20} />
          <span>Order</span>
          {activeOrdersCount > 0 && (
            <span className="abd-counter-pill">{activeOrdersCount}</span>
          )}
        </button>

        {/* 3. Billing */}
        <button 
          className={`abd-item ${activeDownTab === 'billing' ? 'active' : ''}`}
          onClick={() => {
            setActiveDownTab('billing');
            setBillingSubTab('bills');
          }}
        >
          <Receipt size={20} />
          <span>Billing</span>
        </button>

        {/* 4. Report */}
        <button 
          className={`abd-item ${activeDownTab === 'report' ? 'active' : ''}`}
          onClick={() => {
            setActiveDownTab('report');
            setReportSubTab('reports');
          }}
        >
          <BarChart3 size={20} />
          <span>Report</span>
        </button>

        {/* 5. Menu */}
        <button 
          className={`abd-item ${activeDownTab === 'menu' ? 'active' : ''}`}
          onClick={() => {
            setActiveDownTab('menu');
            setMenuSubTab('menu-items');
          }}
        >
          <UtensilsCrossed size={20} />
          <span>Menu</span>
          {lowStockCount > 0 && <span className="abd-badge-dot warning" />}
        </button>
      </nav>

      {/* ========================================================= */}
      {/* 🖨️ THERMAL RECEIPT (Print Only) */}
      {/* ========================================================= */}
      {printingOrder && (
        <div className="print-only">
          <div className="receipt-header">
            <h2>{settings.name}</h2>
            <p>{settings.tagline}</p>
            {printingOrder.orderType === 'Delivery' && (
              <p style={{fontSize: '13px', fontWeight: 'bold', marginTop: '4px'}}>*** ONLINE HOME DELIVERY SLIP ***</p>
            )}
            <hr />
          </div>
          <div className="receipt-meta">
            {printingOrder.orderType === 'Delivery' ? (
              <>
                <p style={{fontSize: '15px', fontWeight: 'bold'}}>DELIVERY TOKEN #{printingOrder.tokenNumber || printingOrder.id}</p>
                <p><strong>Customer:</strong> {printingOrder.customerName} ({printingOrder.customerMobile})</p>
                <p><strong>Deliver To:</strong> {printingOrder.deliveryAddress?.houseNo}, {printingOrder.deliveryAddress?.streetArea}</p>
                {printingOrder.deliveryAddress?.landmark && <p><strong>Landmark:</strong> {printingOrder.deliveryAddress.landmark}</p>}
                <p><strong>PIN:</strong> {printingOrder.deliveryAddress?.pincode}</p>
                {printingOrder.deliveryInstructions && <p><strong>Note:</strong> {printingOrder.deliveryInstructions}</p>}
                {printingOrder.deliveryPartner && (
                  <p><strong>Assigned Rider:</strong> {printingOrder.deliveryPartner.name} ({printingOrder.deliveryPartner.phone})</p>
                )}
              </>
            ) : printingOrder.tokenNumber ? (
              <p style={{fontSize: '16px', fontWeight: 'bold'}}>PARCEL TOKEN #{printingOrder.tokenNumber}</p>
            ) : (
              <p><strong>Table:</strong> {printingOrder.tableNumber}</p>
            )}
            <p><strong>Order ID:</strong> #{printingOrder.id}</p>
            <p><strong>Order Type:</strong> {printingOrder.orderType || 'Dine-in'}</p>
            <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
            <hr />
          </div>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {printingOrder.items?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <div className="receipt-totals">
            <div className="row"><span>Subtotal</span><span>₹{printingOrder.subtotal || printingOrder.total}</span></div>
            {printingOrder.packagingCharge > 0 && <div className="row"><span>Packaging</span><span>+₹{printingOrder.packagingCharge}</span></div>}
            {printingOrder.deliveryFee > 0 && <div className="row"><span>Delivery Fee</span><span>+₹{printingOrder.deliveryFee}</span></div>}
            <div className="row"><span>GST ({settings.gst}%)</span><span>₹{Math.round(((printingOrder.subtotal || printingOrder.total) * (settings.gst || 5)) / 100)}</span></div>
            <div className="row grand"><span>NET TOTAL</span><span>₹{printingOrder.netTotal || printingOrder.total}</span></div>
            <div className="row"><span>Payment</span><span>{printingOrder.paymentMethod || 'Cash'}</span></div>
          </div>
          <div className="receipt-footer">
            <p>{settings.footerNote || 'Thank you for dining with us! Visit again.'}</p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🎨 ADMIN CONSOLE COMPONENT STYLES */}
      {/* ========================================================= */}
      <style>{`
        .admin-console-layout {
          min-height: 100vh;
          background: #F8FAFC;
          color: #0F172A;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding-bottom: 80px;
        }

        /* Top Header */
        .admin-top-bar {
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .atb-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dhaba-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #FFF7ED;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #FFEDD5;
        }

        .atb-brand-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .atb-portal-subtitle {
          font-size: 0.72rem;
          color: #64748B;
          display: block;
        }

        .atb-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .atb-icon-action-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          color: #334155;
        }

        .atb-badge-alert {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #DC2626;
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .atb-logout-btn {
          background: #FFF1F2;
          color: #E11D48;
          border: 1px solid #FFE4E6;
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        /* Main Viewport */
        .admin-main-viewport {
          padding: 16px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Sub Module Nav Pills */
        .sub-module-nav-pills {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 14px;
          margin-bottom: 16px;
          scrollbar-width: none;
        }

        .sub-module-nav-pills::-webkit-scrollbar {
          display: none;
        }

        .smn-pill {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #475569;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .smn-pill.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        /* Dashboard View */
        .dashboard-hero-metric-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .dashboard-hero-metric-bar h2 {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 0 0 2px;
        }

        .dashboard-hero-metric-bar p {
          font-size: 0.85rem;
          color: #64748B;
          margin: 0;
        }

        .dhaba-live-clock {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .kpi-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .kpi-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
        }

        .kpi-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #64748B;
        }

        .kpi-card h3 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 4px;
          color: #0F172A;
        }

        .kpi-card small {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .dashboard-quick-actions-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          margin-bottom: 24px;
          padding-bottom: 4px;
        }

        .dqa-btn {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          padding: 10px 18px;
          border-radius: 14px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1E293B;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .dqa-btn:hover {
          border-color: #EA580C;
          color: #EA580C;
        }

        .dashboard-dual-columns {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .dashboard-dual-columns {
            grid-template-columns: 1fr;
          }
        }

        .dash-box {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
        }

        .dash-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .dash-box-header h3 {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0;
        }

        .link-text-btn {
          background: none;
          border: none;
          color: #EA580C;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        .recent-orders-stream {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .stream-order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #F8FAFC;
          border-radius: 14px;
          border: 1px solid #F1F5F9;
        }

        .sor-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sor-badge {
          background: #0F172A;
          color: white;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 8px;
        }

        .sor-left strong {
          font-size: 0.88rem;
          display: block;
        }

        .sor-left p {
          font-size: 0.72rem;
          color: #64748B;
          margin: 0;
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sor-right {
          text-align: right;
        }

        .sor-right strong {
          display: block;
          font-size: 0.95rem;
          color: #0F172A;
        }

        .sor-status {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .sor-status.confirmed { background: #DCFCE7; color: #15803D; }
        .sor-status.pending { background: #FEF3C7; color: #B45309; }
        .sor-status.ready { background: #DBEAFE; color: #1D4ED8; }
        .sor-status.billed { background: #F1F5F9; color: #475569; }

        /* Alerts feed */
        .alerts-feed-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .alert-item-card {
          padding: 12px 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .alert-item-card.urgent { background: #FEF2F2; border: 1px solid #FECACA; }
        .alert-item-card.warning { background: #FFFBEB; border: 1px solid #FDE68A; }
        .alert-item-card.info { background: #EFF6FF; border: 1px solid #BFDBFE; }
        .alert-item-card.neutral { background: #F0FDF4; border: 1px solid #BBF7D0; }

        .alert-item-card strong {
          display: block;
          font-size: 0.85rem;
        }

        .alert-item-card p {
          font-size: 0.72rem;
          color: #64748B;
          margin: 0;
        }

        .btn-resolve-shortcut {
          margin-left: auto;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 800;
          cursor: pointer;
        }

        .account-quick-profile-card {
          background: #F8FAFC;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #E2E8F0;
        }

        .aqp-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFF7ED;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .aqp-info strong {
          display: block;
          font-size: 0.85rem;
        }

        .aqp-info small {
          font-size: 0.72rem;
          color: #64748B;
        }

        .btn-logout-small {
          margin-left: auto;
          background: none;
          border: 1px solid #FCA5A5;
          color: #DC2626;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Order Management Pipeline */
        .order-pipeline-filter-bar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 18px;
        }

        .opfb-search-box {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 0 14px;
          height: 44px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .opfb-search-box input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 0.88rem;
        }

        .stage-filter-chips {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .stage-filter-chips::-webkit-scrollbar {
          display: none;
        }

        .sfc-chip {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          white-space: nowrap;
        }

        .sfc-chip.active {
          background: #EA580C;
          color: white;
          border-color: #EA580C;
        }

        .orders-cards-responsive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }

        .order-card-tile {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .oct-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .oct-table-badge {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
        }

        .oct-status-tag {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 50px;
        }

        .oct-status-tag.confirmed { background: #DCFCE7; color: #15803D; }
        .oct-status-tag.pending { background: #FEF3C7; color: #B45309; }
        .oct-status-tag.kitchen { background: #FFEDD5; color: #C2410C; }
        .oct-status-tag.ready { background: #DBEAFE; color: #1E40AF; }
        .oct-status-tag.billed { background: #F1F5F9; color: #475569; }

        .oct-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
          color: #64748B;
        }

        .oct-net-price {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
        }

        .oct-cust-row {
          font-size: 0.78rem;
          color: #475569;
          font-weight: 600;
        }

        .oct-items-list {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .oct-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #334155;
        }

        .oct-actions-bar {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-top: 6px;
        }

        .btn-stg {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-confirm { background: #0F172A; color: white; }
        .btn-kitchen { background: #EA580C; color: white; }
        .btn-ready { background: #16A34A; color: white; }
        .btn-served { background: #2563EB; color: white; }
        .btn-wa { background: #22C55E; color: white; }
        .btn-print { background: #334155; color: white; }

        /* POS Quick Bill View */
        .create-bill-pos-container {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .create-bill-pos-container {
            grid-template-columns: 1fr;
          }
        }

        .cbp-left-menu {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #E2E8F0;
        }

        .cbp-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 0 12px;
          height: 42px;
          margin-bottom: 16px;
        }

        .cbp-search input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
        }

        .cbp-menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 10px;
          max-height: 520px;
          overflow-y: auto;
        }

        .cbp-menu-item-tile {
          background: #FAFAFC;
          border: 1px solid #F1F5F9;
          border-radius: 14px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 80px;
        }

        .cbp-menu-item-tile:hover {
          border-color: #EA580C;
          background: #FFF7ED;
        }

        .cmit-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
        }

        .cmit-price-qty {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .cmit-qty-badge {
          background: #EA580C;
          color: white;
          padding: 2px 8px;
          border-radius: 50px;
          font-size: 0.72rem;
        }

        .cbp-right-invoice-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 20px;
          border: 1px solid #E2E8F0;
          display: flex;
          flex-direction: column;
        }

        .cbp-meta-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 14px 0;
        }

        .cbp-meta-inputs label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 4px;
        }

        .cbp-meta-inputs input {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
        }

        .cbp-selected-items-list {
          flex: 1;
          max-height: 220px;
          overflow-y: auto;
          background: #F8FAFC;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 14px;
        }

        .cbp-bill-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          margin-bottom: 8px;
        }

        .cbr-qty-stepper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cbr-qty-stepper button {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid #CBD5E1;
          background: white;
          cursor: pointer;
        }

        .cbp-calc-box {
          border-top: 1px dashed #CBD5E1;
          padding-top: 10px;
          margin-bottom: 14px;
        }

        .calc-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .calc-row.grand-total {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          border-top: 1px solid #E2E8F0;
          padding-top: 6px;
          margin-top: 6px;
        }

        .cbp-payment-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }

        .pm-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .pm-btn.active {
          background: #0F172A;
          color: white;
          border-color: #0F172A;
        }

        .btn-generate-bill-print {
          width: 100%;
          background: #EA580C;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        /* Modern Admin Tables */
        .modern-admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .modern-admin-table th {
          text-align: left;
          padding: 12px;
          background: #F8FAFC;
          color: #64748B;
          font-weight: 700;
          border-bottom: 1px solid #E2E8F0;
        }

        .modern-admin-table td {
          padding: 12px;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
        }

        .invoices-summary-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .iss-box {
          background: #FFFFFF;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
        }

        .iss-box span {
          display: block;
          font-size: 0.78rem;
          color: #64748B;
          margin-bottom: 4px;
        }

        .iss-box strong {
          font-size: 1.35rem;
        }

        .invoices-table-card,
        .purchase-table-card,
        .inv-table-card,
        .menu-items-table-card,
        .payments-log-table-box {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          overflow-x: auto;
        }

        .pay-method-badge {
          background: #F1F5F9;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .tbl-btn-actions {
          display: flex;
          gap: 6px;
        }

        .btn-tbl-action {
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: white;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .btn-tbl-action.settle { background: #DCFCE7; color: #15803D; border-color: #86EFAC; }
        .btn-tbl-action.delete { background: #FEE2E2; color: #DC2626; border-color: #FCA5A5; }

        /* 12. Daily Closing Card */
        .daily-closing-card {
          background: #FFFFFF;
          border-radius: 22px;
          padding: 24px;
          border: 1px solid #E2E8F0;
          max-width: 650px;
          margin: 0 auto;
        }

        .dcc-header {
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 14px;
          margin-bottom: 16px;
        }

        .dcc-header h2 {
          font-size: 1.25rem;
          margin: 0 0 4px;
        }

        .dcc-header p {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0;
        }

        .dcc-breakdown-table {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .dcc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.92rem;
        }

        .dcc-edit-input {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dcc-edit-input input {
          width: 90px;
          padding: 6px 8px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          font-weight: bold;
          text-align: right;
        }

        .dcc-divider {
          border-top: 1px dashed #CBD5E1;
          margin: 8px 0;
        }

        .dcc-row.net-total-row {
          background: #F8FAFC;
          padding: 14px;
          border-radius: 12px;
        }

        .grand-cash-amount {
          font-size: 1.4rem;
          color: #0284C7;
        }

        .btn-finalize-day {
          width: 100%;
          background: #16A34A;
          color: white;
          border: none;
          padding: 16px;
          border-radius: 14px;
          font-size: 1.05rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }

        /* 07 & 09: Staff and Inventory */
        .staff-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 14px;
        }

        .staff-member-card {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid #E2E8F0;
        }

        .smc-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .smc-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #FFF7ED;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .smc-header h4 {
          margin: 0 0 2px;
          font-size: 1rem;
        }

        .smc-role-tag {
          font-size: 0.72rem;
          font-weight: 800;
          color: #EA580C;
          background: #FFF7ED;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .smc-body p {
          font-size: 0.8rem;
          color: #475569;
          margin: 0 0 4px;
        }

        .smc-status.active {
          color: #16A34A;
          font-weight: 800;
          font-size: 0.75rem;
        }

        .inv-top-bar,
        .menu-mgmt-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .btn-add-new-dish,
        .btn-add-inv-item {
          background: #0F172A;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .inv-adjust-btns {
          display: flex;
          gap: 6px;
        }

        .inv-adjust-btns button {
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          cursor: pointer;
          font-weight: 700;
        }

        /* 15. Settings view */
        .settings-editor-box {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #E2E8F0;
          max-width: 700px;
          margin: 0 auto;
        }

        .settings-fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 18px 0;
        }

        .sfg-field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 6px;
        }

        .sfg-field input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          font-size: 0.88rem;
        }

        .btn-save-settings-action {
          width: 100%;
          background: #EA580C;
          color: white;
          border: none;
          padding: 14px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
        }

        /* ========================================================= */
        /* 📱 FIXED BOTTOM DOWNBAR NAVIGATION (Home, Order, Billing, Report, Menu) */
        /* ========================================================= */
        .admin-bottom-downbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 10px 14px 12px;
          z-index: 2000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
        }

        .abd-item {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #64748B;
          cursor: pointer;
          position: relative;
          padding: 4px 12px;
          flex: 1;
          transition: all 0.2s;
        }

        .abd-item span {
          font-size: 0.72rem;
          font-weight: 700;
        }

        .abd-item.active {
          color: #EA580C;
        }

        .abd-counter-pill {
          position: absolute;
          top: 0;
          right: 20%;
          background: #EA580C;
          color: white;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 50px;
          line-height: 1;
        }

        .abd-badge-dot {
          position: absolute;
          top: 4px;
          right: 32%;
          width: 8px;
          height: 8px;
          background: #EF4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        .abd-badge-dot.warning {
          background: #F59E0B;
        }
      `}</style>
    </div>
  );
};

export default AdminConsole;

