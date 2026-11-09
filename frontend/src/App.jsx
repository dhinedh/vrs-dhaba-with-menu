import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  X, 
  CheckCircle2, 
  LogOut, 
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
  ShoppingBag,
  Users,
  MessageSquare,
  Tag as TagIcon,
  DollarSign,
  Printer,
  Send,
  CreditCard,
  Percent,
  Check,
  Box,
  QrCode,
  Bell,
  FileText,
  Bike
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import heroBg from './assets/hero-bg.png';

// Modular Feature Components
import { CustomerCRM } from './components/CustomerCRM';
import { CustomerCommunication } from './components/CustomerCommunication';
import { OffersEngine, INITIAL_OFFERS } from './components/OffersEngine';
import { LiveTableOverview } from './components/LiveTableOverview';
import { ReportsAnalytics } from './components/ReportsAnalytics';
import { ExpenseTracker, INITIAL_EXPENSES } from './components/ExpenseTracker';
import { TakeawayManagement } from './components/TakeawayManagement';
import { QRTableGenerator } from './components/QRTableGenerator';
import { CustomerAssistance } from './components/CustomerAssistance';
import { OnlineDeliveryPortal } from './components/OnlineDeliveryPortal';
import { DeliveryManagement } from './components/DeliveryManagement';
import { AdminConsole } from './components/AdminConsole';

const INITIAL_MENU = [
  // 01. ROTI VARIETIES
  { id: "1", no: "101", name: "Roti", price: 15, veg: true, icon: "🫓", category: "Roti Varieties" },
  { id: "2", no: "102", name: "Butter Roti", price: 20, veg: true, icon: "🫓", category: "Roti Varieties" },
  { id: "3", no: "103", name: "Butter Naan", price: 50, veg: true, icon: "🫓", category: "Roti Varieties" },
  { id: "4", no: "104", name: "Garlic Roti", price: 30, veg: true, icon: "🫓", category: "Roti Varieties" },
  { id: "5", no: "105", name: "Plain Naan", price: 40, veg: true, icon: "🫓", category: "Roti Varieties" },
  { id: "6", no: "106", name: "Garlic Naan", price: 80, veg: true, icon: "🫓", category: "Roti Varieties" },
  { id: "7", no: "107", name: "Half Naan", price: 25, veg: true, icon: "🫓", category: "Roti Varieties" },

  // 02. CHICKEN GRAVY
  { id: "8", no: "201", name: "Chicken Masala", price: 150, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "9", no: "202", name: "Pepper Chicken", price: 180, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "10", no: "203", name: "Ginger Chicken", price: 170, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "11", no: "204", name: "Garlic Chicken", price: 190, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "12", no: "205", name: "Chettinad Chicken", price: 200, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "13", no: "206", name: "Mughlai Chicken", price: 230, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "14", no: "207", name: "Punjabi Chicken", price: 220, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "15", no: "208", name: "Chilli Chicken", price: 200, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "16", no: "209", name: "Butter Chicken", price: 210, veg: false, icon: "🍗", category: "Chicken Gravy" },
  { id: "17", no: "210", name: "Andhra Chicken", price: 230, veg: false, icon: "🍗", category: "Chicken Gravy" },

  // 03. EGG VARIETIES
  { id: "18", no: "301", name: "Egg Podimas", price: 50, veg: false, icon: "🍳", category: "Egg Varieties" },
  { id: "19", no: "302", name: "Egg Keema", price: 110, veg: false, icon: "🍳", category: "Egg Varieties" },

  // 04. GRAVY
  { id: "20", no: "401", name: "Mutton Masala", price: 250, veg: false, icon: "🍲", category: "Gravy" },
  { id: "21", no: "402", name: "Kadai Masala", price: 170, veg: false, icon: "🍲", category: "Gravy" },
  { id: "22", no: "403", name: "Prawn Masala", price: 250, veg: false, icon: "🍤", category: "Gravy" },
  { id: "23", no: "404", name: "Squid Masala", price: 250, veg: false, icon: "🦑", category: "Gravy" },
  { id: "24", no: "405", name: "Naatu Kozhi", price: 220, veg: false, icon: "🍗", category: "Gravy" },

  // 05. VEG VARIETIES
  { id: "25", no: "501", name: "Dal", price: 100, veg: true, icon: "🥣", category: "Veg Varieties" },
  { id: "26", no: "502", name: "Dal Tadka", price: 130, veg: true, icon: "🥣", category: "Veg Varieties" },
  { id: "27", no: "503", name: "Dal Makhani", price: 150, veg: true, icon: "🥣", category: "Veg Varieties" },
  { id: "28", no: "504", name: "Channa Masala", price: 100, veg: true, icon: "🥣", category: "Veg Varieties" },
  { id: "29", no: "505", name: "Paneer Butter Masala", price: 170, veg: true, icon: "🧀", category: "Veg Varieties" },
  { id: "30", no: "506", name: "Paneer Masala", price: 170, veg: true, icon: "🧀", category: "Veg Varieties" },
  { id: "31", no: "507", name: "Mushroom Masala", price: 160, veg: true, icon: "🍄", category: "Veg Varieties" },
  { id: "32", no: "508", name: "Gobi Masala", price: 150, veg: true, icon: "🥦", category: "Veg Varieties" },

  // 06. VEG RICE VARIETIES
  { id: "33", no: "601", name: "Channa Rice", price: 100, veg: true, icon: "🍚", category: "Veg Rice Varieties" },
  { id: "34", no: "602", name: "Jeera Rice", price: 100, veg: true, icon: "🍚", category: "Veg Rice Varieties" },
  { id: "35", no: "603", name: "Paneer Rice", price: 170, veg: true, icon: "🍚", category: "Veg Rice Varieties" },
  { id: "36", no: "604", name: "Mushroom Rice", price: 160, veg: true, icon: "🍚", category: "Veg Rice Varieties" },
  { id: "37", no: "605", name: "Special Thayir Sadham", price: 100, veg: true, icon: "🍚", category: "Veg Rice Varieties" },

  // 07. NON-VEG RICE VARIETIES
  { id: "38", no: "701", name: "Chicken Rice", price: 120, veg: false, icon: "🍛", category: "Non-Veg Rice Varieties" },
  { id: "39", no: "702", name: "Dhaba Chicken Rice", price: 130, veg: false, icon: "🍛", category: "Non-Veg Rice Varieties" },
  { id: "40", no: "703", name: "Kadai Rice", price: 170, veg: false, icon: "🍛", category: "Non-Veg Rice Varieties" },
  { id: "41", no: "704", name: "Mutton Rice", price: 250, veg: false, icon: "🍛", category: "Non-Veg Rice Varieties" },
  { id: "42", no: "705", name: "Prawn Rice", price: 250, veg: false, icon: "🍛", category: "Non-Veg Rice Varieties" },
  { id: "43", no: "706", name: "Squid Rice", price: 250, veg: false, icon: "🍛", category: "Non-Veg Rice Varieties" },
  { id: "44", no: "707", name: "Naatu Kozhi Rice", price: 220, veg: false, icon: "🍛", category: "Non-Veg Rice Varieties" },
  { id: "45", no: "708", name: "Egg Rice", price: 110, veg: false, icon: "🍳", category: "Non-Veg Rice Varieties" },

  // 08. NOODLES
  { id: "46", no: "801", name: "Chicken Noodles", price: 120, veg: false, icon: "🍜", category: "Noodles" },
  { id: "47", no: "802", name: "Egg Noodles", price: 110, veg: false, icon: "🍜", category: "Noodles" },
  { id: "48", no: "803", name: "Gobi Noodles", price: 150, veg: true, icon: "🍜", category: "Noodles" },
  { id: "49", no: "804", name: "Veg Noodles", price: 100, veg: true, icon: "🍜", category: "Noodles" },

  // 09. CHICKEN 65 VARIETIES
  { id: "50", no: "901", name: "Chicken 65", price: 160, veg: false, icon: "🍗", category: "Chicken 65 Varieties" },
  { id: "51", no: "902", name: "Chicken Lollipop", price: 180, veg: false, icon: "🍗", category: "Chicken 65 Varieties" },
  { id: "52", no: "903", name: "Tandoori Chicken", price: 110, veg: false, icon: "🍗", category: "Chicken 65 Varieties" },

  // 10. OTHER NON-VEG VARIETIES
  { id: "53", no: "1001", name: "Quail 65", price: 150, veg: false, icon: "🍗", category: "Other Non-Veg Varieties" },
  { id: "54", no: "1002", name: "Prawn 65", price: 250, veg: false, icon: "🍤", category: "Other Non-Veg Varieties" },

  // 11. VEG 65 VARIETIES
  { id: "55", no: "1101", name: "Paneer 65", price: 200, veg: true, icon: "🧀", category: "Veg 65 Varieties" },
  { id: "56", no: "1102", name: "Mushroom 65", price: 160, veg: true, icon: "🍄", category: "Veg 65 Varieties" },
  { id: "57", no: "1103", name: "Gobi 65", price: 150, veg: true, icon: "🥦", category: "Veg 65 Varieties" }
];

const INITIAL_SETTINGS = {
  name: "VRS Garden Dhaba",
  tagline: "Delicious Taste, Affordable Price",
  gst: 5,
  packagingCharge: 15,
  deliveryFee: 30,
  freeDeliveryAbove: 299,
  deliveryEnabled: true,
  orderingMode: "SELF_ORDER" // 'SELF_ORDER' or 'MENU_ONLY'
};

const INITIAL_ORDERS = [
  {
    id: "ORD-DEL-402",
    tableNumber: "Delivery",
    tokenNumber: "DEL-84",
    orderType: "Delivery",
    items: [
      { id: "3", no: "103", name: "Butter Naan", price: 50, veg: true, icon: "🫓", category: "Roti Varieties", quantity: 3 },
      { id: "16", no: "209", name: "Butter Chicken", price: 210, veg: false, icon: "🍗", category: "Chicken Gravy", quantity: 1 },
      { id: "34", no: "602", name: "Jeera Rice", price: 100, veg: true, icon: "🍚", category: "Veg Rice Varieties", quantity: 1 }
    ],
    subtotal: 460,
    total: 460,
    packagingCharge: 15,
    deliveryFee: 0,
    discountAmount: 50,
    discountCode: "WELCOME50",
    netTotal: 446,
    customerMobile: "9876543210",
    customerName: "Ramesh Kumar",
    deliveryAddress: {
      houseNo: "Plot 42, 2nd Cross",
      streetArea: "Anna Nagar Main Road",
      landmark: "Opp. SBI Bank",
      pincode: "636001",
      addressType: "Home"
    },
    deliveryPartner: {
      name: "Karthik R.",
      phone: "9845213456",
      vehicle: "Hero Splendor (TN-30-AZ-4421)",
      rating: 4.9
    },
    deliveryInstructions: "Leave at door, avoid calling",
    deliveryStatus: "Dispatched",
    paymentMethod: "UPI",
    paymentStatus: "Paid Online (UPI)",
    status: "Confirmed",
    timestamp: "2026-08-17T13:45:00.000Z"
  },
  {
    id: "ORD-307",
    tableNumber: "5",
    tokenNumber: "",
    items: [
      { id: "3", no: "103", name: "Butter Naan", price: 50, veg: true, icon: "🫓", category: "Roti Varieties", quantity: 2 },
      { id: "8", no: "201", name: "Chicken Masala", price: 150, veg: false, icon: "🍗", category: "Chicken Gravy", quantity: 1 }
    ],
    total: 250,
    subtotal: 250,
    packagingCharge: 0,
    discountAmount: 25,
    discountCode: "WELCOME10",
    netTotal: 236,
    customerMobile: "9876543210",
    customerName: "Ramesh Kumar",
    orderType: "Dine-in",
    waiterName: "Murali",
    paymentMethod: "UPI",
    notes: "Medium spicy",
    status: "Ready",
    takeawayStatus: "Ready",
    timestamp: "2026-08-17T13:12:24.952Z"
  }
];

const App = () => {
  const [userRole, setUserRole] = useState(null); // 'admin', 'waiter', 'customer'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // LocalStorage states
  const MENU_VERSION = "2026_11_v3_57_items";
  const [menu, setMenuState] = useState(() => {
    const savedVersion = localStorage.getItem("vrs_menu_version");
    const saved = localStorage.getItem("vrs_menu");
    if (saved && savedVersion === MENU_VERSION) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 57) {
          return parsed;
        }
      } catch (e) {}
    }
    localStorage.setItem("vrs_menu", JSON.stringify(INITIAL_MENU));
    localStorage.setItem("vrs_menu_version", MENU_VERSION);
    return INITIAL_MENU;
  });

  const [orders, setOrdersState] = useState(() => {
    const saved = localStorage.getItem("vrs_orders");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("vrs_orders", JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  });

  const [settings, setSettingsState] = useState(() => {
    const saved = localStorage.getItem("vrs_settings");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("vrs_settings", JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  });

  const [customers, setCustomersState] = useState(() => {
    const saved = localStorage.getItem("vrs_customers");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const init = [
      { id: "1", name: "Ramesh Kumar", mobile: "9876543210", email: "ramesh@gmail.com", totalSpend: 2450, totalVisits: 6, lastVisit: "2026-08-17T12:00:00.000Z", tier: "Silver", tags: ["VIP", "Regular"] }
    ];
    localStorage.setItem("vrs_customers", JSON.stringify(init));
    return init;
  });

  const [offers, setOffersState] = useState(() => {
    const saved = localStorage.getItem("vrs_offers");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("vrs_offers", JSON.stringify(INITIAL_OFFERS));
    return INITIAL_OFFERS;
  });

  const [expenses, setExpensesState] = useState(() => {
    const saved = localStorage.getItem("vrs_expenses");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("vrs_expenses", JSON.stringify(INITIAL_EXPENSES));
    return INITIAL_EXPENSES;
  });

  // Table Service Assistance Calls State
  const [tableRequests, setTableRequestsState] = useState(() => {
    const saved = localStorage.getItem("vrs_table_requests");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // POS / Order sheet states
  const [cart, setCart] = useState({});
  const [tableNumber, setTableNumber] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState("Dine-in"); // 'Dine-in' or 'Takeaway'
  const [packagingCharge, setPackagingCharge] = useState(15);
  const [estimatedPickupTime, setEstimatedPickupTime] = useState("15 mins");
  const [paymentMethod, setPaymentMethod] = useState("Cash"); // 'Cash', 'UPI', 'Card'
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");

  const [activeCategory, setActiveCategory] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [specialNotes, setSpecialNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [waiterTab, setWaiterTab] = useState("Menu");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [assistanceSentAlert, setAssistanceSentAlert] = useState(null);
  const [adminTargetTab, setAdminTargetTab] = useState(null);

  // Sync setters
  const setMenu = (val) => {
    setMenuState(prev => {
      const v = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem("vrs_menu", JSON.stringify(v));
      localStorage.setItem("vrs_menu_version", MENU_VERSION);
      return v;
    });
  };

  const setOrders = (val) => {
    setOrdersState(prev => {
      const v = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem("vrs_orders", JSON.stringify(v));
      return v;
    });
  };

  const setSettings = (val) => {
    setSettingsState(prev => {
      const v = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem("vrs_settings", JSON.stringify(v));
      return v;
    });
  };

  const setCustomers = (val) => {
    setCustomersState(prev => {
      const v = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem("vrs_customers", JSON.stringify(v));
      return v;
    });
  };

  const setOffers = (val) => {
    setOffersState(prev => {
      const v = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem("vrs_offers", JSON.stringify(v));
      return v;
    });
  };

  const setExpenses = (val) => {
    setExpensesState(prev => {
      const v = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem("vrs_expenses", JSON.stringify(v));
      return v;
    });
  };

  const setTableRequests = (val) => {
    setTableRequestsState(prev => {
      const v = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem("vrs_table_requests", JSON.stringify(v));
      return v;
    });
  };

  // Real-time cross-tab & storage synchronization for orders
  useEffect(() => {
    const syncOrdersFromStorage = () => {
      try {
        const saved = localStorage.getItem("vrs_orders");
        if (saved) {
          setOrdersState(prev => {
            if (JSON.stringify(prev) !== saved) {
              try {
                return JSON.parse(saved);
              } catch (e) {
                return prev;
              }
            }
            return prev;
          });
        }
      } catch (e) {}
    };

    const handleStorageChange = (e) => {
      if (!e.key || e.key === "vrs_orders") {
        syncOrdersFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    const pollInterval = setInterval(syncOrdersFromStorage, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  const isOrderBilledOrClosed = (o) => {
    if (!o) return false;
    const s = String(o.status || '').toLowerCase().trim();
    const ps = String(o.paymentStatus || '').toLowerCase().trim();
    const ts = String(o.takeawayStatus || '').toLowerCase().trim();
    if (s === 'billed' || s === 'paid' || s === 'closed' || s === 'completed' || s === 'settled' || s === 'cancelled') return true;
    if (o.isBilled || o.isClosed || o.billedAt) return true;
    if (ps === 'paid' && s !== 'pending' && s !== 'kitchen' && s !== 'preparing' && s !== 'confirmed') return true;
    if (ts === 'billing' || ts === 'completed' || ts === 'billed') return true;
    return false;
  };

  const activeWaiterOrders = useMemo(() => {
    return orders.filter(o => !isOrderBilledOrClosed(o));
  }, [orders]);

  const categories = useMemo(() => {
    const cats = [...new Set(menu.map(item => item.category))];
    return cats.map(c => ({ name: c, icon: "🍽️" }));
  }, [menu]);

  const [customerViewMode, setCustomerViewMode] = useState(() => {
    return localStorage.getItem("vrs_customer_mode") || "DELIVERY";
  });

  const handlePlaceDeliveryOrder = (newDeliveryOrder) => {
    setOrders(prev => [newDeliveryOrder, ...prev]);

    // Update Customer CRM
    if (newDeliveryOrder.customerMobile && newDeliveryOrder.customerMobile.length === 10) {
      const mob = newDeliveryOrder.customerMobile;
      const spend = newDeliveryOrder.netTotal || newDeliveryOrder.total || 0;
      const existingCust = customers.find(c => c.mobile === mob);
      if (existingCust) {
        const updatedCust = {
          ...existingCust,
          name: newDeliveryOrder.customerName || existingCust.name,
          totalSpend: existingCust.totalSpend + spend,
          totalVisits: existingCust.totalVisits + 1,
          lastVisit: new Date().toISOString()
        };
        setCustomers(prev => prev.map(c => c.mobile === mob ? updatedCust : c));
      } else {
        const newCust = {
          id: Date.now().toString(),
          name: newDeliveryOrder.customerName || "Customer",
          mobile: mob,
          totalSpend: spend,
          totalVisits: 1,
          lastVisit: new Date().toISOString(),
          tier: "Bronze",
          tags: ["Online Delivery Customer"]
        };
        setCustomers(prev => [newCust, ...prev]);
      }
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get("table");
    const modeParam = params.get("mode");
    const deliveryParam = params.get("delivery");

    if (tableParam) {
      setIsLoggedIn(true);
      setUserRole("customer");
      setTableNumber(tableParam);
      setCustomerViewMode("DINE_IN");
      localStorage.setItem("vrs_customer_mode", "DINE_IN");
    } else if (modeParam === "delivery" || deliveryParam === "true") {
      setIsLoggedIn(true);
      setUserRole("customer");
      setCustomerViewMode("DELIVERY");
      localStorage.setItem("vrs_customer_mode", "DELIVERY");
    } else {
      const savedLogin = localStorage.getItem("isLoggedIn") === "true";
      const savedRole = localStorage.getItem("userRole");
      if (savedLogin && savedRole) {
        setIsLoggedIn(true);
        setUserRole(savedRole);
      }
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories]);

  // Auto look up customer name when mobile is entered
  useEffect(() => {
    if (customerMobile && customerMobile.length === 10) {
      const found = customers.find(c => c.mobile === customerMobile);
      if (found && found.name) {
        setCustomerName(found.name);
      }
    }
  }, [customerMobile, customers]);

  const triggerTableAssistance = (type) => {
    if (!tableNumber) return;
    const newReq = {
      id: "REQ-" + Date.now(),
      tableNumber: tableNumber.toString(),
      type, // 'CALL_WAITER' or 'REQUEST_BILL'
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setTableRequests([newReq, ...tableRequests]);
    setAssistanceSentAlert(type === 'CALL_WAITER' ? '🔔 Waiter has been notified to attend Table ' + tableNumber : '🧾 Bill request sent to counter!');
    setTimeout(() => setAssistanceSentAlert(null), 3000);
  };

  const filteredMenu = useMemo(() => {
    const base = searchQuery ? menu : menu.filter(i => i.category === activeCategory);
    if (!searchQuery) return base;
    return menu.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      String(item.no).includes(searchQuery)
    );
  }, [activeCategory, searchQuery, menu]);

  const cartSubtotal = useMemo(() => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menu.find(i => String(i.id) === String(id));
      return total + (item ? item.price * qty : 0);
    }, 0);
  }, [cart, menu]);

  const activePackagingCharge = orderType === 'Takeaway' ? packagingCharge : 0;

  const discountAmount = useMemo(() => {
    if (!appliedOffer) return 0;
    if (cartSubtotal < (appliedOffer.minBillAmount || 0)) return 0;

    if (appliedOffer.discountType === 'percentage' || appliedOffer.discountType === 'happy_hours') {
      return Math.round((cartSubtotal * appliedOffer.discountValue) / 100);
    }
    return Math.min(cartSubtotal, appliedOffer.discountValue);
  }, [appliedOffer, cartSubtotal]);

  const taxableAmount = Math.max(0, cartSubtotal - discountAmount + activePackagingCharge);
  const gstAmount = Math.round((taxableAmount * settings.gst) / 100);
  const cartNetTotal = taxableAmount + gstAmount;
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const applyCouponCode = () => {
    if (!couponCodeInput) return;
    const found = offers.find(o => o.code.toUpperCase() === couponCodeInput.trim().toUpperCase() && o.isActive);
    if (found) {
      if (cartSubtotal < (found.minBillAmount || 0)) {
        alert(`This offer requires a minimum bill of ₹${found.minBillAmount}`);
        return;
      }
      setAppliedOffer(found);
      alert(`🎉 Coupon "${found.code}" Applied Successfully!`);
    } else {
      alert("Invalid or expired coupon code!");
    }
  };

  const placeOrder = () => {
    if (orderType === 'Dine-in' && !tableNumber) { 
      alert("Please enter table number for Dine-in orders!"); 
      return; 
    }

    const itemsArray = Object.entries(cart)
      .map(([id, qty]) => {
        const item = menu.find(i => String(i.id) === String(id));
        return item ? { ...item, quantity: qty } : null;
      })
      .filter(item => item !== null);

    if (itemsArray.length === 0) return;

    let updatedOrders = [...orders];
    let createdOrUpdatedOrder = null;

    const takeawayOrdersCount = orders.filter(o => o.orderType === 'Takeaway' || o.tokenNumber).length;
    const newTokenNumber = orderType === 'Takeaway' ? `TK-${String(takeawayOrdersCount + 1).padStart(2, '0')}` : '';

    const cleanInputTable = String(tableNumber || '').replace(/^-+/, '').trim();
    const newOrderId = editingOrderId || ("ORD-" + Math.floor(100 + Math.random() * 900));

    const newOrderObj = {
      id: newOrderId,
      tableNumber: orderType === 'Takeaway' ? 'Takeaway' : (cleanInputTable || tableNumber.toString()),
      tokenNumber: newTokenNumber,
      items: itemsArray,
      subtotal: cartSubtotal,
      total: cartSubtotal,
      packagingCharge: activePackagingCharge,
      discountAmount,
      discountCode: appliedOffer ? appliedOffer.code : "",
      netTotal: cartNetTotal,
      customerMobile,
      customerName: customerName || "Guest Customer",
      orderType,
      estimatedPickupTime: orderType === 'Takeaway' ? estimatedPickupTime : '',
      takeawayStatus: orderType === 'Takeaway' ? 'Order' : '',
      waiterName: userRole === 'waiter' ? 'Staff' : 'Counter Admin',
      paymentMethod,
      notes: specialNotes,
      status: 'Confirmed',
      timestamp: new Date().toISOString()
    };

    if (editingOrderId) {
      updatedOrders = updatedOrders.map(o => o.id === editingOrderId ? newOrderObj : o);
      createdOrUpdatedOrder = newOrderObj;
      setEditingOrderId(null);
    } else {
      const activeOrderIndex = updatedOrders.findIndex(o => {
        const cleanTbl = String(o.tableNumber || '').replace(/^-+/, '').trim();
        return cleanTbl === cleanInputTable && !isOrderBilledOrClosed(o) && orderType === 'Dine-in';
      });

      if (activeOrderIndex !== -1) {
        const activeOrder = updatedOrders[activeOrderIndex];
        const mergedItems = [...activeOrder.items];
        itemsArray.forEach(newItem => {
          const existing = mergedItems.find(i => String(i.id) === String(newItem.id));
          if (existing) {
            existing.quantity += newItem.quantity;
          } else {
            mergedItems.push(newItem);
          }
        });

        const mergedSubtotal = mergedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const mergedNetTotal = mergedSubtotal - discountAmount + Math.round(((mergedSubtotal - discountAmount) * settings.gst)/100);

        createdOrUpdatedOrder = {
          ...activeOrder,
          items: mergedItems,
          subtotal: mergedSubtotal,
          total: mergedSubtotal,
          discountAmount,
          discountCode: appliedOffer ? appliedOffer.code : activeOrder.discountCode,
          netTotal: mergedNetTotal,
          customerMobile: customerMobile || activeOrder.customerMobile,
          customerName: customerName || activeOrder.customerName,
          notes: activeOrder.notes ? activeOrder.notes + (specialNotes ? " | " + specialNotes : "") : specialNotes,
          status: 'Confirmed',
          timestamp: new Date().toISOString()
        };

        updatedOrders[activeOrderIndex] = createdOrUpdatedOrder;
      } else {
        createdOrUpdatedOrder = newOrderObj;
        updatedOrders = [createdOrUpdatedOrder, ...updatedOrders];
      }
    }

    if (customerMobile && customerMobile.length === 10) {
      const existingCust = customers.find(c => c.mobile === customerMobile);
      if (existingCust) {
        const updatedCust = {
          ...existingCust,
          name: customerName || existingCust.name,
          totalSpend: existingCust.totalSpend + cartNetTotal,
          totalVisits: existingCust.totalVisits + 1,
          lastVisit: new Date().toISOString()
        };
        setCustomers(prev => prev.map(c => c.mobile === customerMobile ? updatedCust : c));
      } else {
        const newCust = {
          id: Date.now().toString(),
          name: customerName || "Guest",
          mobile: customerMobile,
          totalSpend: cartNetTotal,
          totalVisits: 1,
          lastVisit: new Date().toISOString(),
          tier: "Bronze",
          tags: ["New Customer"]
        };
        setCustomers(prev => [newCust, ...prev]);
      }
    }

    setOrders(updatedOrders);
    setLastOrder(createdOrUpdatedOrder);
    setCart({});
    setShowCart(false);
    setSpecialNotes("");
    setAppliedOffer(null);
    setEditingOrderId(null);

    // Persist to backend server API
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdOrUpdatedOrder)
      }).catch(() => {});
    } catch (e) {}

    // Send and redirect directly to Admin Side Order Page
    setUserRole('admin');
    setIsLoggedIn(true);
    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('isLoggedIn', 'true');
    setAdminTargetTab({
      tab: 'order',
      subTab: 'all-orders',
      newOrderId: createdOrUpdatedOrder.id,
      timestamp: Date.now()
    });
  };

  if (!isLoggedIn) {
    return <UnifiedLogin onLogin={(role, initialCustomerMode) => { 
      setIsLoggedIn(true); 
      setUserRole(role); 
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);
      if (role === 'customer' && initialCustomerMode) {
        setCustomerViewMode(initialCustomerMode);
        localStorage.setItem("vrs_customer_mode", initialCustomerMode);
      }
    }} settings={settings} />;
  }

  if (userRole === 'admin') {
    return (
      <div className="app-container">
        <AdminConsole 
          orders={orders} setOrders={setOrders} 
          onLogout={() => { 
            setIsLoggedIn(false); 
            setUserRole(null); 
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userRole");
          }} 
          onSwitchRole={(role) => {
            setUserRole(role);
            localStorage.setItem("userRole", role);
          }}
          menu={menu} setMenu={setMenu}
          settings={settings} setSettings={setSettings}
          customers={customers} setCustomers={setCustomers}
          offers={offers} setOffers={setOffers}
          expenses={expenses} setExpenses={setExpenses}
          tableRequests={tableRequests} setTableRequests={setTableRequests}
          adminTargetTab={adminTargetTab}
          onSelectTableForOrder={(tblNo, ord) => {
            setTableNumber(tblNo);
            setOrderType("Dine-in");
            if (ord) {
              const newCart = {};
              ord.items.forEach(i => newCart[i.id] = i.quantity);
              setCart(newCart);
              setEditingOrderId(ord.id);
              setCustomerMobile(ord.customerMobile || "");
              setCustomerName(ord.customerName || "");
            }
            setShowCart(true);
          }}
        />
      </div>
    );
  }

  const isCustomer = userRole === 'customer';
  const isMenuOnlyMode = settings.orderingMode === 'MENU_ONLY' && isCustomer;

  if (isCustomer && customerViewMode === 'DELIVERY') {
    return (
      <OnlineDeliveryPortal
        menu={menu}
        orders={orders}
        settings={settings}
        offers={offers}
        customers={customers}
        onPlaceDeliveryOrder={handlePlaceDeliveryOrder}
        onSwitchToDineIn={() => {
          setCustomerViewMode('DINE_IN');
          localStorage.setItem('vrs_customer_mode', 'DINE_IN');
        }}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Hero Header */}
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

      {/* Switch to Online Delivery Banner */}
      {isCustomer && (
        <div 
          className="delivery-promo-switch-banner"
          onClick={() => {
            setCustomerViewMode('DELIVERY');
            localStorage.setItem('vrs_customer_mode', 'DELIVERY');
          }}
        >
          <div className="dpsb-left">
            <div className="dpsb-icon-circle">
              <Bike size={20} color="#EA580C" />
            </div>
            <div>
              <strong>Looking for Home Delivery?</strong>
              <small>⚡ 30-35 mins delivery • Live tracking like Swiggy / Zomato</small>
            </div>
          </div>
          <button className="btn-go-delivery">
            <span>Order Online</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Menu Only Mode Notice Banner */}
      {isMenuOnlyMode && (
        <div className="menu-only-banner">
          📢 <strong>Menu Browsing Mode Active</strong>: Self-ordering is currently turned off. Please inform our waiter to place your order!
        </div>
      )}

      {/* Assistance Alert Banner */}
      {assistanceSentAlert && (
        <div className="assistance-alert-banner">
          {assistanceSentAlert}
        </div>
      )}

      {/* Floating Header */}
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
            <div className="customer-table-pill">
              T-{tableNumber}
            </div>
          )}
        </div>
        
        {/* Customer Assistance Action Buttons */}
        {isCustomer && (
          <div className="customer-assistance-bar">
            <button className="btn-call-waiter" onClick={() => triggerTableAssistance('CALL_WAITER')}>
              <Bell size={14} /> Call Waiter
            </button>
            <button className="btn-req-bill" onClick={() => triggerTableAssistance('REQUEST_BILL')}>
              <FileText size={14} /> Request Bill
            </button>
          </div>
        )}

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
        <div className="menu-section">
          <div className="section-header">
            <h2>{searchQuery ? 'Search Results' : activeCategory}</h2>
          </div>
          
          <div className="menu-list">
            {filteredMenu.map(item => (
              <MenuCard 
                key={item.id} item={item} isWaiter={true} 
                qty={cart[item.id] || 0}
                onAdd={() => {
                  if (isMenuOnlyMode) {
                    alert("Menu Browsing Mode: Self-ordering is disabled. Please inform staff to order!");
                    return;
                  }
                  setCart({...cart, [item.id]: (cart[item.id] || 0) + 1});
                }}
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
      ) : (
        <div className="active-orders-section" style={{padding: '20px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px'}}>
            <h2 style={{fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', margin: 0}}>Active Orders</h2>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              background: '#FFF7ED',
              color: '#EA580C',
              padding: '4px 10px',
              borderRadius: '50px',
              border: '1px solid #FFEDD5'
            }}>
              {activeWaiterOrders.length} {activeWaiterOrders.length === 1 ? 'Live Table' : 'Live Tables'}
            </span>
          </div>

          <div className="order-list">
            {activeWaiterOrders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '44px 20px',
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px dashed #E2E8F0',
                marginTop: '10px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
              }}>
                <div style={{ fontSize: '2.4rem', marginBottom: '10px' }}>🧾</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', margin: '0 0 6px 0' }}>
                  No Active Orders
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                  All bills have been settled & closed by the admin.
                </p>
              </div>
            ) : (
              activeWaiterOrders.map(o => {
                const cleanTable = String(o.tableNumber || '').replace(/^-+/, '').trim();
                const displayTitle = o.orderType === 'Takeaway' 
                  ? `Token #${o.tokenNumber || o.id}` 
                  : (cleanTable ? `Table ${cleanTable}` : 'Dine-in');
                const displayStatus = o.orderType === 'Takeaway' ? (o.takeawayStatus || o.status || 'Active') : (o.status || 'Active');

                return (
                  <div key={o.id} className="order-card" style={{
                    background: 'white', 
                    padding: '16px', 
                    borderRadius: '16px', 
                    marginBottom: '12px', 
                    border: '1px solid #F1F5F9',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <strong style={{fontSize: '1rem', color: '#0F172A'}}>{displayTitle} ({o.orderType || 'Dine-in'})</strong>
                      <span style={{
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        color: displayStatus === 'Preparing' ? '#D97706' : (displayStatus === 'Ready' ? '#059669' : (displayStatus === 'Billed' ? '#64748B' : '#EA580C')),
                        background: displayStatus === 'Preparing' ? '#FEF3C7' : (displayStatus === 'Ready' ? '#D1FAE5' : (displayStatus === 'Billed' ? '#F1F5F9' : '#FFF7ED')),
                        padding: '4px 10px',
                        borderRadius: '50px'
                      }}>
                        {displayStatus}
                      </span>
                    </div>
                    <div style={{fontSize: '0.9rem', margin: '8px 0', color: '#334155', lineHeight: 1.4}}>
                      {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    {o.customerMobile && (
                      <div style={{fontSize: '0.8rem', color: '#EA580C', fontWeight: '600', marginBottom: '8px'}}>
                        📱 {o.customerName} ({o.customerMobile})
                      </div>
                    )}
                    <button 
                      className="btn-edit-order" 
                      style={{
                        background: '#EA580C', 
                        color: 'white', 
                        border: 'none', 
                        padding: '9px 18px', 
                        borderRadius: '10px', 
                        fontWeight: '700', 
                        fontSize: '0.88rem',
                        marginTop: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(234, 88, 12, 0.25)'
                      }}
                      onClick={() => {
                        const newCart = {};
                        o.items.forEach(i => newCart[i.id] = i.quantity);
                        setCart(newCart);
                        setTableNumber(cleanTable || o.tableNumber);
                        setEditingOrderId(o.id);
                        setCustomerMobile(o.customerMobile || "");
                        setCustomerName(o.customerName || "");
                        setOrderType(o.orderType || "Dine-in");
                        setWaiterTab("Menu");
                        setShowCart(true);
                      }}
                    >
                      Edit / Add Items
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Floating Cart Pill */}
      <AnimatePresence>
        {cartCount > 0 && !isMenuOnlyMode && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="floating-cart">
            <div className="cart-pill" onClick={() => setShowCart(true)}>
              <div className="cart-badge">{cartCount}</div>
              <div className="cart-text">
                <span>{isCustomer ? 'View My Order' : 'View Order Summary'}</span>
                {userRole !== 'waiter' && <small>₹{cartNetTotal}</small>}
              </div>
              <ArrowRight size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation for Staff */}
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

      {/* POS Cart & Checkout Sheet */}
      <AnimatePresence>
        {showCart && (
          <div className="modal-bg" onClick={() => setShowCart(false)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="sheet" onClick={e => e.stopPropagation()}>
              <div className="sheet-bar" />
              <div className="sheet-header">
                <h3>POS Checkout & Order Summary</h3>
                <button onClick={() => setShowCart(false)}><X /></button>
              </div>
              <div className="sheet-content">
                {/* Order Type Selector */}
                <div className="order-type-tabs">
                  <button className={orderType === 'Dine-in' ? 'active' : ''} onClick={() => setOrderType('Dine-in')}>🍽️ Dine-in</button>
                  <button className={orderType === 'Takeaway' ? 'active' : ''} onClick={() => setOrderType('Takeaway')}>📦 Takeaway / Parcel</button>
                </div>

                {/* Customer Details Input */}
                <div className="customer-input-box">
                  <h4>👥 Customer Details (Mobile is Key Identifier)</h4>
                  <div className="form-row-2">
                    <input 
                      type="tel" 
                      placeholder="Customer Mobile (10 Digits) *" 
                      value={customerMobile} 
                      onChange={e => setCustomerMobile(e.target.value)} 
                    />
                    <input 
                      type="text" 
                      placeholder="Customer Name" 
                      value={customerName} 
                      onChange={e => setCustomerName(e.target.value)} 
                    />
                  </div>
                </div>

                {orderType === 'Dine-in' ? (
                  <div className="sheet-table-box">
                    <Table size={18} color="#E8621A" />
                    <input 
                      type="number" 
                      placeholder="Enter Table Number *" 
                      value={tableNumber} 
                      onChange={e => setTableNumber(e.target.value)} 
                    />
                  </div>
                ) : (
                  <div className="parcel-controls-box">
                    <div className="parcel-row">
                      <label>📦 Packaging Container Fee (₹)</label>
                      <input 
                        type="number" 
                        value={packagingCharge} 
                        onChange={e => setPackagingCharge(parseFloat(e.target.value) || 0)} 
                      />
                    </div>
                    <div className="pickup-time-selector">
                      <label>⏰ Estimated Pickup Time</label>
                      <div className="time-pills">
                        {['10 mins', '15 mins', '20 mins', '30 mins'].map(t => (
                          <button 
                            key={t} 
                            type="button"
                            className={estimatedPickupTime === t ? 'active' : ''} 
                            onClick={() => setEstimatedPickupTime(t)}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="cart-items">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = menu.find(i => String(i.id) === String(id));
                    if (!item) return null;
                    return (
                      <div key={id} className="cart-item">
                        <div className="item-main">
                          <span className={item.veg ? "veg-symbol" : "nonveg-symbol"} />
                          <div className="item-name">{item.name}</div>
                        </div>
                        <div className="item-ctrl">
                          <button 
                            type="button"
                            onClick={() => {
                             const newCart = {...cart};
                             if (newCart[id] > 1) newCart[id]--;
                             else delete newCart[id];
                             setCart(newCart);
                            }}
                            title="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span>{qty}</span>
                          <button 
                            type="button"
                            onClick={() => setCart({...cart, [id]: (cart[id] || 0) + 1})}
                            title="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="item-price">₹{item.price * qty}</div>
                      </div>
                    );
                  })}
                </div>

                <button className="btn-add-more" onClick={() => setShowCart(false)}>
                  <Plus size={16} /> Add More Items
                </button>

                <textarea placeholder="Special instructions (e.g. extra spicy parcel...)" value={specialNotes} onChange={e => setSpecialNotes(e.target.value)} />
                
                {userRole !== 'waiter' && (
                  <div className="total-summary">
                    <div className="row"><span>Subtotal</span><span>₹{cartSubtotal}</span></div>
                    {orderType === 'Takeaway' && <div className="row"><span>Packaging Container Fee</span><span>+ ₹{activePackagingCharge}</span></div>}
                    {discountAmount > 0 && <div className="row green-row"><span>Discount ({appliedOffer?.code})</span><span>- ₹{discountAmount}</span></div>}
                    <div className="row"><span>GST ({settings.gst}%)</span><span>₹{gstAmount}</span></div>
                    <div className="row grand"><span>Net Payable Total</span><span>₹{cartNetTotal}</span></div>
                  </div>
                )}
                
                <button className="btn-order" onClick={placeOrder}>
                  {editingOrderId ? 'Update Order' : 'Confirm Order & Send'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {lastOrder && (
          <div className="success-overlay">
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="success-modal">
              <CheckCircle2 size={64} color="#2e7d32" />
              <h2>{lastOrder.orderType === 'Takeaway' ? 'Parcel Order Created!' : 'Order Sent Successfully!'}</h2>
              {lastOrder.tokenNumber && <div className="token-success-badge">PARCEL TOKEN #{lastOrder.tokenNumber}</div>}
              <div className="order-id-badge">#{lastOrder.id}</div>
              <p>Net Bill Total: <strong>₹{lastOrder.netTotal || lastOrder.total}</strong></p>
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

        .menu-only-banner { background: #FEF3C7; color: #92400E; padding: 10px 16px; font-size: 0.85rem; border-bottom: 1px solid #FDE68A; text-align: center; }
        .assistance-alert-banner { background: #DCFCE7; color: #166534; padding: 10px 16px; font-size: 0.85rem; font-weight: 700; text-align: center; border-bottom: 1px solid #BBF7D0; }

        .delivery-promo-switch-banner {
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          padding: 12px 18px;
          margin: 12px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.08);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .delivery-promo-switch-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(234, 88, 12, 0.15);
        }
        .dpsb-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .dpsb-icon-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFEDD5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dpsb-left strong {
          display: block;
          font-size: 0.92rem;
          color: #9A3412;
        }
        .dpsb-left small {
          font-size: 0.75rem;
          color: #C2410C;
        }
        .btn-go-delivery {
          background: #EA580C;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .sticky-header { position: sticky; top: 0; background: white; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header-actions { display: flex; padding: 12px; gap: 10px; }
        .table-selector { background: #F5F5F5; border-radius: 12px; display: flex; align-items: center; padding: 0 10px; flex: 0 0 80px; }
        .table-selector input { border: none; background: transparent; width: 100%; padding: 10px 5px; font-weight: 700; outline: none; }
        .search-pill { background: #F5F5F5; border-radius: 12px; display: flex; align-items: center; padding: 0 12px; flex: 1; }
        .search-pill input { border: none; background: transparent; width: 100%; padding: 10px; outline: none; font-size: 0.9rem; }
        
        .customer-table-pill { background: #E8621A; color: white; padding: 8px 15px; border-radius: 12px; font-weight: 800; }
        .customer-assistance-bar { display: flex; gap: 8px; padding: 0 12px 10px; }
        .btn-call-waiter { flex: 1; background: #FEF08A; color: #854D0E; border: 1px solid #FDE047; padding: 8px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }
        .btn-req-bill { flex: 1; background: #BFDBFE; color: #1E40AF; border: 1px solid #93C5FD; padding: 8px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }

        .category-scroll { display: flex; overflow-x: auto; padding: 0 12px 12px; gap: 8px; }
        .category-scroll button { flex: 0 0 auto; padding: 8px 16px; border-radius: 50px; border: 1px solid #EEE; background: white; font-size: 0.8rem; font-weight: 600; color: #666; }
        .category-scroll button.active { background: var(--primary); color: white; border-color: var(--primary); }

        .menu-section { padding: 20px 16px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .section-header h2 { font-size: 1.1rem; color: #333; }

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
        .cart-pill { background: var(--accent); color: white; padding: 12px 20px; border-radius: 50px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 10px 30px rgba(0,0,0,0.3); cursor: pointer; }
        .cart-badge { background: var(--primary); width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; }
        .cart-text { flex: 1; margin-left: 12px; display: flex; flex-direction: column; }
        .cart-text span { font-weight: 700; font-size: 0.95rem; }
        .cart-text small { opacity: 0.7; font-size: 0.75rem; }

        .bottom-nav { position: fixed; bottom: 0; width: 100%; background: white; display: flex; justify-content: space-around; padding: 10px; border-top: 1px solid #EEE; z-index: 999; }
        .nav-item { border: none; background: none; display: flex; flex-direction: column; align-items: center; gap: 4px; color: #999; cursor: pointer; }
        .nav-item.active { color: var(--primary); }
        .nav-item span { font-size: 0.65rem; font-weight: 600; }

        .modal-bg { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; flex-direction: column; justify-content: flex-end; }
        .sheet { position: relative; width: 100%; box-sizing: border-box; background: white; border-radius: 24px 24px 0 0; padding: 18px 18px 28px; max-height: 90vh; max-height: 90dvh; display: flex; flex-direction: column; }
        .sheet-bar { width: 40px; height: 4px; background: #DDD; border-radius: 2px; margin: 0 auto 12px; flex-shrink: 0; }
        .sheet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-shrink: 0; }
        .sheet-header button { background: #F5F5F5; border: none; padding: 6px; border-radius: 50%; }
        .sheet-content { padding: 4px 2px 24px; max-height: calc(90dvh - 90px); overflow-y: auto; display: flex; flex-direction: column; gap: 12px; box-sizing: border-box; -webkit-overflow-scrolling: touch; }

        .order-type-tabs { display: flex; background: #F5F5F5; padding: 4px; border-radius: 12px; gap: 4px; }
        .order-type-tabs button { flex: 1; padding: 10px; border: none; border-radius: 10px; font-weight: 700; color: #555; background: transparent; cursor: pointer; }
        .order-type-tabs button.active { background: white; color: #E8621A; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

        .customer-input-box { background: #F9FAFB; padding: 12px; border-radius: 12px; border: 1px solid #EEF0F2; }
        .customer-input-box h4 { font-size: 0.8rem; color: #444; margin-bottom: 8px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .customer-input-box input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #DDD; outline: none; font-size: 0.85rem; }

        .parcel-controls-box { background: #FFF7ED; border: 1px solid #FFEDD5; padding: 12px; border-radius: 12px; display: flex; flex-direction: column; gap: 10px; }
        .parcel-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #C2410C; font-weight: 700; }
        .parcel-row input { width: 80px; padding: 6px; border-radius: 6px; border: 1px solid #FDBA74; text-align: center; font-weight: bold; }

        .pickup-time-selector { display: flex; flex-direction: column; gap: 6px; }
        .pickup-time-selector label { font-size: 0.75rem; color: #C2410C; font-weight: 700; }
        .time-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .time-pills button { background: white; border: 1px solid #FDBA74; color: #9A3412; padding: 6px 12px; border-radius: 50px; font-weight: 700; font-size: 0.75rem; cursor: pointer; }
        .time-pills button.active { background: #EA580C; color: white; border-color: #EA580C; }

        .sheet-table-box {
          background: #F8FAFC;
          padding: 12px 16px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1.5px solid #E2E8F0;
          transition: border-color 0.15s, box-shadow 0.15s;
          margin-bottom: 12px;
        }
        .sheet-table-box:focus-within {
          border-color: #EA580C;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
        }
        .sheet-table-box input {
          border: none;
          background: transparent;
          font-size: 0.95rem;
          font-weight: 700;
          color: #0F172A;
          width: 100%;
          outline: none;
        }

        /* Cart Items & Stepper Styling */
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 8px;
        }
        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          border-radius: 14px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          gap: 12px;
        }
        .item-main {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .item-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #0F172A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* FSSAI Standard Veg & Non-Veg Badges */
        .veg-symbol {
          width: 15px;
          height: 15px;
          border: 1.5px solid #16A34A;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          flex-shrink: 0;
        }
        .veg-symbol::after {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16A34A;
        }
        .nonveg-symbol {
          width: 15px;
          height: 15px;
          border: 1.5px solid #DC2626;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          flex-shrink: 0;
        }
        .nonveg-symbol::after {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #DC2626;
        }

        /* Custom Modern Stepper Button (- 1 +) */
        .item-ctrl {
          display: flex;
          align-items: center;
          background: #FFF7ED;
          border: 1.5px solid #FDBA74;
          border-radius: 10px;
          padding: 2px 4px;
          gap: 6px;
          flex-shrink: 0;
        }
        .item-ctrl button {
          background: transparent;
          border: none;
          color: #EA580C;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          padding: 0;
        }
        .item-ctrl button:hover {
          background: #FED7AA;
        }
        .item-ctrl button:active {
          transform: scale(0.9);
        }
        .item-ctrl span {
          font-size: 0.9rem;
          font-weight: 800;
          color: #9A3412;
          min-width: 16px;
          text-align: center;
        }

        .item-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: #EA580C;
          min-width: 50px;
          text-align: right;
          flex-shrink: 0;
        }

        .btn-add-more {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1.5px dashed #FDBA74;
          background: #FFFDF9;
          color: #EA580C;
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.15s;
          margin: 6px 0 10px;
        }
        .btn-add-more:hover {
          background: #FFF7ED;
          border-color: #EA580C;
        }

        .sheet textarea {
          width: 100%;
          box-sizing: border-box;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          padding: 12px 14px;
          border-radius: 14px;
          min-height: 72px;
          font-family: inherit;
          font-size: 0.88rem;
          color: #0F172A;
          outline: none;
          resize: vertical;
          line-height: 1.4;
          transition: border-color 0.15s, background 0.15s;
          flex-shrink: 0;
          margin-bottom: 4px;
        }
        .sheet textarea:focus {
          border-color: #EA580C;
          background: #FFFFFF;
        }
        .total-summary { background: #F9F9F9; padding: 14px; border-radius: 16px; flex-shrink: 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.85rem; color: #666; }
        .green-row { color: #16A34A; font-weight: 700; }
        .grand { border-top: 1px dashed #DDD; padding-top: 8px; margin-top: 6px; font-weight: 800; color: #000; font-size: 1.1rem; }
        .btn-order { 
          width: 100%; 
          background: var(--primary); 
          color: white; 
          border: none; 
          padding: 16px; 
          border-radius: 16px; 
          font-weight: 700; 
          font-size: 1.1rem; 
          cursor: pointer; 
          flex-shrink: 0;
          margin-top: 4px;
        }

        .success-overlay { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: white; z-index: 3000; display: flex; align-items: center; justify-content: center; }
        .success-modal { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; }
        .token-success-badge { background: #FEF3C7; color: #B45309; padding: 6px 18px; border-radius: 50px; font-weight: 900; font-size: 1.1rem; }
        .order-id-badge { background: #F0F7F0; color: #2e7d32; padding: 8px 20px; border-radius: 50px; font-weight: 800; font-size: 1.2rem; }
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
    <div className="login-screen" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: '20px'}}>
      <div className="login-box" style={{background: 'white', padding: '40px 30px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '420px', textAlign: 'center'}}>
        <ChefHat size={60} color="#E8621A" style={{marginBottom: '15px'}} />
        <h1 style={{fontSize: '1.8rem', marginBottom: '6px'}}>{settings.name}</h1>
        <p style={{color: '#666', marginBottom: '24px'}}>{settings.tagline || "Fresh & Tasty Dhaba Cuisine"}</p>

        {/* Customer Direct Entry Options */}
        <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '16px', padding: '16px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.78rem', color: '#9A3412', fontWeight: '800', letterSpacing: '0.5px' }}>CUSTOMER QUICK ACCESS</span>
          
          <button 
            type="button"
            onClick={() => onLogin('customer', 'DELIVERY')}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#EA580C', color: 'white', fontWeight: '800', fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)' }}
          >
            <Bike size={18} />
            <span>Order Online Delivery (Swiggy / Zomato Style)</span>
          </button>

          <button 
            type="button"
            onClick={() => onLogin('customer', 'DINE_IN')}
            style={{ width: '100%', padding: '11px', borderRadius: '12px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <UtensilsCrossed size={15} />
            <span>Browse Dine-In / Table Menu</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#94A3B8' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ padding: '0 10px', fontSize: '0.75rem', fontWeight: '700' }}>OR STAFF SIGN IN</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>
        
        <input 
          placeholder="Staff Username (admin / waiter)" 
          value={user} 
          onChange={e => setUser(e.target.value)} 
          style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '12px', outline: 'none', fontSize: '0.9rem'}} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={pass} 
          onChange={e => setPass(e.target.value)} 
          style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #eee', marginBottom: '20px', outline: 'none', fontSize: '0.9rem'}} 
        />
        
        <button 
          onClick={handleLogin} 
          className="btn-primary" 
          style={{width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#1E293B', color: 'white', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'}}
        >
          Sign In to Staff Console
        </button>
      </div>
    </div>
  );
};

// Expanded Admin Dashboard
const AdminDashboard = ({ 
  orders, setOrders, onLogout, menu, setMenu, settings, setSettings, 
  customers, setCustomers, offers, setOffers, expenses, setExpenses,
  tableRequests, setTableRequests, onSelectTableForOrder 
}) => {
  const [tab, setTab] = useState("Orders");
  const [printingOrder, setPrintingOrder] = useState(null);

  const pendingRequestsCount = tableRequests.filter(r => r.status !== 'Resolved').length;

  const updateStatus = (id, status) => {
    const isBilledStatus = status === 'Billed' || status === 'Paid' || status === 'Closed';
    const nowIso = new Date().toISOString();
    setOrders(prev => prev.map(o => o.id === id ? { 
      ...o, 
      status,
      ...(isBilledStatus ? { 
        takeawayStatus: 'Billed', 
        isBilled: true, 
        isClosed: true, 
        paymentStatus: 'Paid', 
        billedAt: nowIso 
      } : {})
    } : o));

    try {
      fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          ...(isBilledStatus ? { 
            paymentStatus: 'Paid', 
            isBilled: true, 
            isClosed: true, 
            takeawayStatus: 'Billed',
            billedAt: nowIso
          } : {})
        })
      }).catch(() => {});
    } catch (e) {}
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

  const activeDeliveryOrdersCount = orders.filter(o => 
    o.orderType === 'Delivery' && 
    (o.deliveryStatus || o.status) !== 'Delivered' && 
    (o.deliveryStatus || o.status) !== 'Completed' &&
    o.status !== 'Billed'
  ).length;

  const handlePrint = (order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
      updateStatus(order.id, 'Billed');
    }, 500);
  };

  const sendWhatsAppBill = (order) => {
    const mob = order.customerMobile || "9876543210";
    const cleanMob = mob.replace(/\D/g, '');
    const formattedMob = cleanMob.length === 10 ? `91${cleanMob}` : cleanMob;
    
    const itemsStr = order.items.map(i => `${i.quantity}x ${i.name} = ₹${i.price * i.quantity}`).join('\n');
    const msg = `🧾 *${settings.name} - Digital Receipt*\nOrder: #${order.id} | ${order.tokenNumber ? `TOKEN #${order.tokenNumber}` : `Table: ${order.tableNumber}`}\nDate: ${new Date().toLocaleString()}\n\nItems:\n${itemsStr}\n--------------------\nSubtotal: ₹${order.subtotal || order.total}\n${order.packagingCharge > 0 ? `Packaging Container Fee: +₹${order.packagingCharge}\n` : ''}${order.deliveryFee > 0 ? `Delivery Fee: +₹${order.deliveryFee}\n` : ''}GST (${settings.gst}%): ₹${Math.round(((order.subtotal || order.total) * settings.gst)/100)}\nDiscount: ₹${order.discountAmount || 0}\n*TOTAL PAYABLE: ₹${order.netTotal || order.total}*\nPayment Method: ${order.paymentMethod || 'Cash'}\n--------------------\nThank you for dining with us! 🙏`;
    
    const url = `https://wa.me/${formattedMob}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div className="row">
          <div className="brand-title">
            <h2>{settings.name} Admin Panel</h2>
          </div>
          <button className="btn-logout" onClick={onLogout} title="Logout"><LogOut size={18} /> Logout</button>
        </div>
        
        <div className="dash-tabs">
          <button className={tab === 'Orders' ? 'active' : ''} onClick={() => setTab('Orders')}><ShoppingBag size={14}/> Orders</button>
          <button className={tab === 'Delivery' ? 'active' : ''} onClick={() => setTab('Delivery')}>
            <Bike size={14}/> Online Delivery
            {activeDeliveryOrdersCount > 0 && <span className="tab-badge">{activeDeliveryOrdersCount}</span>}
          </button>
          <button className={tab === 'Takeaway' ? 'active' : ''} onClick={() => setTab('Takeaway')}><Box size={14}/> Parcel Pipeline</button>
          <button className={tab === 'Tables' ? 'active' : ''} onClick={() => setTab('Tables')}><Table size={14}/> Tables Grid</button>
          <button className={tab === 'QRGen' ? 'active' : ''} onClick={() => setTab('QRGen')}><QrCode size={14}/> QR Generator</button>
          <button className={tab === 'Assistance' ? 'active' : ''} onClick={() => setTab('Assistance')}>
            <Bell size={14}/> Calls
            {pendingRequestsCount > 0 && <span className="tab-badge">{pendingRequestsCount}</span>}
          </button>
          <button className={tab === 'CRM' ? 'active' : ''} onClick={() => setTab('CRM')}><Users size={14}/> Customer CRM</button>
          <button className={tab === 'WhatsApp' ? 'active' : ''} onClick={() => setTab('WhatsApp')}><MessageSquare size={14}/> WhatsApp</button>
          <button className={tab === 'Offers' ? 'active' : ''} onClick={() => setTab('Offers')}><TagIcon size={14}/> Offers & Coupons</button>
          <button className={tab === 'Reports' ? 'active' : ''} onClick={() => setTab('Reports')}><TrendingUp size={14}/> Reports & Analytics</button>
          <button className={tab === 'Expenses' ? 'active' : ''} onClick={() => setTab('Expenses')}><DollarSign size={14}/> Expenses</button>
          <button className={tab === 'Menu' ? 'active' : ''} onClick={() => setTab('Menu')}><Package size={14}/> Menu Mgmt</button>
          <button className={tab === 'Settings' ? 'active' : ''} onClick={() => setTab('Settings')}><Settings size={14}/> Settings</button>
        </div>
      </div>

      <div className="dash-content">
        {tab === 'Orders' && (
          <div className="order-list">
            {orders.map(o => (
              <div key={o.id} className={`order-card ${(o.status || 'Pending').toLowerCase()}`}>
                <div className="card-top">
                  <span className="table-tag">
                    {o.tokenNumber ? `Token #${o.tokenNumber}` : `T-${o.tableNumber}`} ({o.orderType || 'Dine-in'})
                  </span>
                  <span className={`status-badge ${(o.status || 'Pending').toLowerCase()}`}>{o.status}</span>
                </div>
                <div className="card-meta">
                  <span>Order #{o.id}</span>
                  <strong className="net-amt">₹{o.netTotal || o.total}</strong>
                </div>

                {o.customerMobile && (
                  <div className="cust-row-info">
                    📱 {o.customerName ? `${o.customerName} (${o.customerMobile})` : o.customerMobile}
                  </div>
                )}

                <div className="card-items">
                  {o.items.map((i, idx) => <div key={idx}>{i.quantity}x {i.name} (₹{i.price * i.quantity})</div>)}
                </div>

                {o.packagingCharge > 0 && <div className="pkg-fee-tag">📦 Packaging Fee: +₹{o.packagingCharge}</div>}
                {o.discountAmount > 0 && <div className="discount-tag-row">🏷️ Discount ({o.discountCode}): -₹{o.discountAmount}</div>}

                <div className="card-btns">
                  {o.status === 'Billed' ? (
                    <button 
                      className="btn-billed-done" 
                      style={{ background: '#DCFCE7', color: '#16A34A', border: '1px solid #86EFAC', borderRadius: 10, padding: '7px 12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={() => alert(`Order #${o.id} is already Billed and stored in the Billing page!`)}
                    >
                      <CheckCircle2 size={13} /> Billed
                    </button>
                  ) : (
                    <button 
                      className="btn-bill" 
                      style={{ background: '#EA580C', color: 'white', border: 'none', borderRadius: 10, padding: '7px 12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                      onClick={() => {
                        updateStatus(o.id, 'Billed');
                        alert(`✅ Order #${o.id} Billed & Saved to Billing Page!`);
                      }}
                    >
                      <Receipt size={13} /> Bill
                    </button>
                  )}
                  <button className="btn-wa-bill" onClick={() => sendWhatsAppBill(o)}>
                    <Send size={13} /> WA Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Delivery' && (
          <DeliveryManagement 
            orders={orders}
            onUpdateDeliveryStatus={updateDeliveryStatus}
            onAssignRider={assignDeliveryRider}
            onPrintDeliveryBill={handlePrint}
            settings={settings}
          />
        )}

        {tab === 'Takeaway' && (
          <TakeawayManagement 
            orders={orders}
            onUpdateTakeawayStatus={updateTakeawayStatus}
            onPrintBill={handlePrint}
            settings={settings}
          />
        )}

        {tab === 'Tables' && (
          <LiveTableOverview 
            orders={orders} 
            onSelectTable={(tblNo, ord) => onSelectTableForOrder(tblNo, ord)}
            onPrintBill={handlePrint}
          />
        )}

        {tab === 'QRGen' && (
          <QRTableGenerator settings={settings} totalTablesCount={20} />
        )}

        {tab === 'Assistance' && (
          <CustomerAssistance 
            requests={tableRequests}
            onResolveRequest={(reqId) => {
              setTableRequests(tableRequests.map(r => r.id === reqId ? { ...r, status: 'Resolved', resolvedAt: new Date().toISOString() } : r));
            }}
            onClearAll={() => setTableRequests(tableRequests.filter(r => r.status !== 'Resolved'))}
          />
        )}

        {tab === 'CRM' && (
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
            onSendWhatsApp={(cust, tpl) => {
              setTab('WhatsApp');
            }}
          />
        )}

        {tab === 'WhatsApp' && (
          <CustomerCommunication 
            customers={customers} 
            orders={orders} 
            settings={settings} 
          />
        )}

        {tab === 'Offers' && (
          <OffersEngine 
            offers={offers}
            onSaveOffer={(newOff) => setOffers([newOff, ...offers])}
            onDeleteOffer={(offId) => setOffers(offers.filter(o => o.id !== offId))}
            onToggleOffer={(offId) => setOffers(offers.map(o => o.id === offId ? { ...o, isActive: !o.isActive } : o))}
          />
        )}

        {tab === 'Reports' && (
          <ReportsAnalytics orders={orders} expenses={expenses} customers={customers} />
        )}

        {tab === 'Expenses' && (
          <ExpenseTracker 
            expenses={expenses}
            onAddExpense={(exp) => setExpenses([exp, ...expenses])}
            onDeleteExpense={(expId) => setExpenses(expenses.filter(e => e.id !== expId))}
          />
        )}

        {tab === 'Menu' && <MenuMgmt menu={menu} setMenu={setMenu} />}
        {tab === 'Settings' && <SettingsEditor settings={settings} setSettings={setSettings} />}
      </div>

      {/* Printable Thermal Receipt */}
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
            {printingOrder.estimatedPickupTime && <p><strong>Pickup Time:</strong> {printingOrder.estimatedPickupTime}</p>}
            {printingOrder.customerMobile && printingOrder.orderType !== 'Delivery' && (
              <p><strong>Customer:</strong> {printingOrder.customerName} ({printingOrder.customerMobile})</p>
            )}
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
            <div className="row"><span>Subtotal</span><span>₹{printingOrder.subtotal || printingOrder.total}</span></div>
            {printingOrder.packagingCharge > 0 && <div className="row"><span>Packaging Container Fee</span><span>+ ₹{printingOrder.packagingCharge}</span></div>}
            {printingOrder.deliveryFee > 0 && <div className="row"><span>Delivery Fee</span><span>+ ₹{printingOrder.deliveryFee}</span></div>}
            {printingOrder.discountAmount > 0 && <div className="row"><span>Discount ({printingOrder.discountCode})</span><span>- ₹{printingOrder.discountAmount}</span></div>}
            <div className="row"><span>GST ({settings.gst}%)</span><span>₹{Math.round(((printingOrder.subtotal || printingOrder.total) * settings.gst) / 100)}</span></div>
            <div className="row grand"><span>NET PAYABLE TOTAL</span><span>₹{printingOrder.netTotal || printingOrder.total}</span></div>
            <div className="row"><span>Payment Method</span><span>{printingOrder.paymentMethod || 'Cash'}</span></div>
          </div>
          <div className="receipt-footer">
            <p>Thank you! Visit Again</p>
          </div>
        </div>
      )}

      <style>{`
        .dashboard { min-height: 100vh; background: #F8F8F8; }
        .dash-header { background: white; padding: 20px 24px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .dash-header .row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .btn-logout { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; padding: 8px 14px; border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; }

        .dash-tabs { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 5px; }
        .dash-tabs button { flex: 0 0 auto; display: flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 12px; border: none; background: #F5F5F5; font-size: 0.8rem; font-weight: 700; color: #666; cursor: pointer; position: relative; }
        .dash-tabs button.active { background: #1A1208; color: white; }
        .tab-badge { background: #EF4444; color: white; border-radius: 50%; font-size: 0.65rem; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }

        .dash-content { padding: 20px 24px; padding-bottom: 100px; }
        .order-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .order-card { background: white; border-radius: 18px; padding: 18px; border-left: 5px solid #DDD; box-shadow: 0 2px 10px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 10px; }
        .order-card.pending { border-left-color: #EAB308; }
        .order-card.confirmed { border-left-color: #3B82F6; }
        .order-card.ready { border-left-color: #22C55E; }

        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .table-tag { font-weight: 800; font-size: 0.95rem; color: #1E293B; }
        .status-badge { font-size: 0.7rem; font-weight: 800; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; }
        .status-badge.pending { background: #FEF08A; color: #854D0E; }
        .status-badge.confirmed { background: #BFDBFE; color: #1E40AF; }
        .status-badge.ready { background: #BBF7D0; color: #166534; }

        .card-meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: #64748B; font-weight: 600; }
        .net-amt { font-size: 1.1rem; color: #0F172A; }

        .cust-row-info { font-size: 0.8rem; color: #E8621A; background: #FFF7ED; padding: 6px 10px; border-radius: 8px; }

        .card-items { border-top: 1px solid #F5F5F5; padding-top: 10px; font-size: 0.85rem; color: #334155; display: flex; flex-direction: column; gap: 4px; }
        .pkg-fee-tag { font-size: 0.75rem; color: #C2410C; font-weight: 700; background: #FFF7ED; padding: 4px 8px; border-radius: 6px; width: max-content; }
        .discount-tag-row { font-size: 0.75rem; color: #16A34A; font-weight: 700; background: #DCFCE7; padding: 4px 8px; border-radius: 6px; width: max-content; }

        .card-btns { display: flex; gap: 6px; margin-top: 6px; }
        .card-btns button { flex: 1; padding: 8px; border: none; border-radius: 8px; font-weight: 700; font-size: 0.75rem; color: white; display: flex; align-items: center; justify-content: center; gap: 4px; cursor: pointer; }
        .btn-c { background: #3B82F6; }
        .btn-r { background: #22C55E; }
        .btn-wa-bill { background: #25D366; }
        .btn-p { background: #475569; }

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

const MenuMgmt = ({ menu, setMenu }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ id: "", name: "", price: "", category: "", veg: true, no: "" });
  const [newItemForm, setNewItemForm] = useState({ name: "", price: "", category: "Roti Varieties", veg: true, no: "" });

  const categories = ["Roti Varieties", "Chicken Gravy", "Egg Varieties", "Gravy", "Veg Varieties", "Veg Rice Varieties", "Non-Veg Rice Varieties", "Noodles", "Chicken 65 Varieties", "Other Non-Veg Varieties", "Veg 65 Varieties"];

  const handleAddNew = (e) => {
    e.preventDefault();
    const newItem = {
      ...newItemForm,
      id: Date.now().toString(),
      price: parseInt(newItemForm.price) || 0,
      icon: newItemForm.veg ? "🥦" : "🍗"
    };
    setMenu(prev => [...prev, newItem]);
    setNewItemForm({ name: "", price: "", category: "Roti Varieties", veg: true, no: "" });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = (id) => {
    setMenu(prev => prev.map(i => String(i.id) === String(id) ? { ...editForm, price: parseInt(editForm.price) || 0 } : i));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    setMenu(prev => prev.filter(i => String(i.id) !== String(id)));
  };

  return (
    <div className="menu-mgmt">
      <form onSubmit={handleAddNew} className="edit-box">
        <h3>Add New Menu Item</h3>
        <div style={{display: 'flex', gap: '10px'}}>
          <input placeholder="Name" value={newItemForm.name} onChange={e => setNewItemForm({...newItemForm, name: e.target.value})} required />
          <input style={{width: '80px'}} placeholder="No" value={newItemForm.no} onChange={e => setNewItemForm({...newItemForm, no: e.target.value})} required />
        </div>
        <div style={{display: 'flex', gap: '10px'}}>
          <input style={{flex: 1}} type="number" placeholder="Price" value={newItemForm.price} onChange={e => setNewItemForm({...newItemForm, price: e.target.value})} required />
          <select style={{flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: '#F5F5F5'}} value={newItemForm.category} onChange={e => setNewItemForm({...newItemForm, category: e.target.value})}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <label style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', padding: '5px 0'}}>
          <input type="checkbox" checked={newItemForm.veg} onChange={e => setNewItemForm({...newItemForm, veg: e.target.checked})} />
          Vegetarian Item
        </label>
        <button type="submit" className="btn-primary" style={{width: '100%', marginTop: '5px'}}>+ Add Menu Item</button>
      </form>

      <div className="list">
        {menu.map(i => {
          const isEditingThis = String(editingId) === String(i.id);
          
          if (isEditingThis) {
            return (
              <div key={i.id} className="row editing-row" style={{flexDirection: 'column', alignItems: 'stretch', gap: '10px', background: '#FFF9F5', border: '2px solid #E8621A', padding: '15px', borderRadius: '14px'}}>
                <div style={{fontWeight: '700', color: '#E8621A', fontSize: '0.9rem'}}>Editing #{i.no} {i.name}</div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <input 
                    style={{flex: 2, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCC'}} 
                    placeholder="Name" 
                    value={editForm.name} 
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                  />
                  <input 
                    style={{width: '70px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCC'}} 
                    placeholder="No" 
                    value={editForm.no} 
                    onChange={e => setEditForm({ ...editForm, no: e.target.value })} 
                  />
                  <input 
                    style={{width: '90px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCC'}} 
                    type="number" 
                    placeholder="Price" 
                    value={editForm.price} 
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })} 
                  />
                </div>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <select 
                    style={{flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CCC', background: 'white'}} 
                    value={editForm.category} 
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <label style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', whiteSpace: 'nowrap'}}>
                    <input 
                      type="checkbox" 
                      checked={editForm.veg} 
                      onChange={e => setEditForm({ ...editForm, veg: e.target.checked })} 
                    />
                    Veg
                  </label>
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '5px'}}>
                  <button 
                    type="button"
                    onClick={() => saveEdit(i.id)} 
                    style={{padding: '8px 16px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'}}
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={cancelEdit} 
                    style={{padding: '8px 16px', background: '#777', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={i.id} className="row">
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <strong>#{i.no} {i.name}</strong>
                <small style={{color: '#666'}}>{i.category} • ₹{i.price}</small>
              </div>
              <div className="acts">
                <button onClick={() => startEdit(i)} title="Edit item inline" style={{marginRight: '8px', padding: '6px 10px', background: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '6px', cursor: 'pointer'}}><Edit2 size={16}/></button>
                <button onClick={() => handleDelete(i.id)} title="Delete item" style={{padding: '6px 10px', background: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '6px', cursor: 'pointer'}}><Trash2 size={16}/></button>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`
        .edit-box { background: white; padding: 20px; border-radius: 20px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .edit-box input { background: #F5F5F5; border: none; padding: 12px; border-radius: 10px; font-family: inherit; }
        .list .row { display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px; border-radius: 12px; margin-bottom: 8px; font-size: 0.9rem; border: 1px solid #F0F0F0; transition: all 0.2s; }
        .acts { display: flex; }
      `}</style>
    </div>
  );
};

const SettingsEditor = ({ settings, setSettings }) => {
  const save = () => {
    alert("Settings saved successfully!");
  };
  return (
    <div className="settings">
      <div className="edit-box">
        <h3>Shop Settings & QR Ordering Mode</h3>
        
        <label>Shop Name</label>
        <input value={settings.name} onChange={e => setSettings({...settings, name: e.target.value})} className="input-field" />
        
        <label>GST %</label>
        <input type="number" value={settings.gst} onChange={e => setSettings({...settings, gst: parseInt(e.target.value) || 0})} className="input-field" />
        
        <label>Default Packaging Container Fee (₹)</label>
        <input type="number" value={settings.packagingCharge || 15} onChange={e => setSettings({...settings, packagingCharge: parseInt(e.target.value) || 0})} className="input-field" />

        <label style={{marginTop: '10px', fontWeight: 'bold'}}>🛵 Online Delivery Fee & Policies (Swiggy / Zomato Style)</label>
        <div style={{display: 'flex', gap: '10px'}}>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px'}}>
            <label style={{fontSize: '0.8rem', color: '#666'}}>Base Delivery Fee (₹)</label>
            <input 
              type="number" 
              value={settings.deliveryFee ?? 30} 
              onChange={e => setSettings({...settings, deliveryFee: parseInt(e.target.value) || 0})} 
              className="input-field" 
            />
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '4px'}}>
            <label style={{fontSize: '0.8rem', color: '#666'}}>Free Delivery Above (₹)</label>
            <input 
              type="number" 
              value={settings.freeDeliveryAbove ?? 299} 
              onChange={e => setSettings({...settings, freeDeliveryAbove: parseInt(e.target.value) || 0})} 
              className="input-field" 
            />
          </div>
        </div>

        <label style={{marginTop: '10px', fontWeight: 'bold'}}>📱 QR Table Ordering Mode (Admin Mode)</label>
        <select 
          value={settings.orderingMode || 'SELF_ORDER'} 
          onChange={e => setSettings({...settings, orderingMode: e.target.value})}
          style={{padding: '12px', borderRadius: '10px', border: '1px solid #CCC', background: 'white', fontSize: '0.95rem'}}
        >
          <option value="SELF_ORDER">Menu + Self Ordering (Customers place order directly)</option>
          <option value="MENU_ONLY">Menu Only (Read-only menu, staff places order)</option>
        </select>

        <button onClick={save} className="btn-primary" style={{marginTop: '15px'}}>Update Shop Settings</button>
      </div>
    </div>
  );
};

export default App;
