import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Bell,
  SlidersHorizontal,
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Heart,
  Trash2,
  X, 
  CheckCircle2, 
  Phone, 
  ChevronRight, 
  Sparkles, 
  Navigation, 
  Bike, 
  Home as HomeIcon, 
  Briefcase, 
  UtensilsCrossed, 
  MapPin,
  Send,
  Tag,
  User,
  RotateCcw,
  Copy,
  Check,
  Menu as MenuIcon,
  ShieldCheck,
  Percent,
  Clock,
  AlertCircle,
  Play,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Curated high-definition food photography for authentic dishes
const getDishImage = (item) => {
  if (item?.image) return item.image;
  const name = (item?.name || "").toLowerCase();
  const cat = (item?.category || "").toLowerCase();

  if (name.includes("fried rice") || name.includes("rice and chicken")) {
    return "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80";
  }
  if (name.includes("65") || name.includes("lollipop") || cat.includes("65")) {
    return "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("burger")) {
    return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("tikka") || name.includes("tandoori")) {
    return "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("salad") || name.includes("fruit")) {
    return "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("crab") || name.includes("fish") || name.includes("seafood") || name.includes("prawn") || name.includes("squid")) {
    return "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("roti") || name.includes("naan") || name.includes("paratha") || cat.includes("roti")) {
    return "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("mutton") || name.includes("kadai") || name.includes("quail") || name.includes("kozhi")) {
    return "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("chicken") || cat.includes("chicken")) {
    return "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("dal")) {
    return "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("paneer") || name.includes("veg") || cat.includes("veg") || name.includes("gobi") || name.includes("mushroom")) {
    return "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("biryani") || name.includes("rice") || cat.includes("rice") || name.includes("sadham")) {
    return "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("noodle") || cat.includes("noodle")) {
    return "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80";
  }
  if (name.includes("egg") || cat.includes("egg") || name.includes("podimas") || name.includes("keema")) {
    return "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80";
  }

  return item?.veg 
    ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
    : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=80";
};

// Add-ons list for Combo Checkout Screen (Screen 2 from Mockup)
const COMBO_ADDONS = [
  {
    id: "salad",
    name: "Tomato Salads",
    price: 25,
    priceStr: "$02.50",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "juice",
    name: "Orange Juice",
    price: 40,
    priceStr: "$04.00",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: "naan",
    name: "Butter Garlic Naan",
    price: 30,
    priceStr: "$03.00",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=200&auto=format&fit=crop&q=80"
  }
];

// Ingredients resolver for Food Detail
const getDishIngredients = (item) => {
  const name = (item?.name || "").toLowerCase();
  if (name.includes("burger")) {
    return [
      { icon: "🥬", name: "Crisp Lettuce" },
      { icon: "🍅", name: "Juicy Tomato" },
      { icon: "🧀", name: "Cheddar Cheese" },
      { icon: "🥩", name: "Grilled Patty" },
      { icon: "🧅", name: "Caramelized Onion" }
    ];
  }
  if (name.includes("salad") || name.includes("fruit")) {
    return [
      { icon: "🍎", name: "Fresh Apple" },
      { icon: "🥬", name: "Baby Greens" },
      { icon: "🍅", name: "Cherry Tomato" },
      { icon: "🥑", name: "Creamy Avocado" },
      { icon: "🌽", name: "Sweet Corn" }
    ];
  }
  if (name.includes("crab") || name.includes("fish") || name.includes("seafood")) {
    return [
      { icon: "🦀", name: "Fresh Crab" },
      { icon: "🌶️", name: "Spicy Pepper" },
      { icon: "🧄", name: "Garlic" },
      { icon: "🌿", name: "Curry Leaves" },
      { icon: "🍋", name: "Lemon" }
    ];
  }
  if (item?.veg) {
    return [
      { icon: "🧀", name: "Fresh Paneer" },
      { icon: "🍅", name: "Tomato Puree" },
      { icon: "🧈", name: "Desi Butter" },
      { icon: "🧅", name: "Crispy Onion" },
      { icon: "🌿", name: "Kasoori Methi" },
      { icon: "🧄", name: "Ginger Garlic" }
    ];
  }
  return [
    { icon: "🍗", name: "Farm Chicken" },
    { icon: "🍅", name: "Rich Tomato Gravy" },
    { icon: "🧈", name: "Makkhan Butter" },
    { icon: "🧅", name: "Golden Onion" },
    { icon: "🧄", name: "Garlic Cloves" },
    { icon: "🌿", name: "Fresh Coriander" }
  ];
};

// Calorie & Portion Subtitle
const getDishSubtitle = (item) => {
  const name = (item?.name || "").toLowerCase();
  if (name.includes("salad")) return "210 cal • 500 g";
  if (name.includes("burger")) return "380 cal • 320 g";
  if (name.includes("crab") || name.includes("fish")) return "290 cal • 400 g";
  if (name.includes("roti") || name.includes("naan")) return "160 cal • 2 pcs";
  if (name.includes("biryani") || name.includes("rice")) return "510 cal • 450 g";
  return "320 cal • 350 g";
};

// Realistic mock delivery riders
const MOCK_RIDERS = [
  { name: "Karthik R.", phone: "9845213456", rating: 4.9, trips: 1420, vehicle: "Hero Splendor (TN-30-AZ-4421)" },
  { name: "Murugan S.", phone: "9786123450", rating: 4.8, trips: 890, vehicle: "Honda Activa (TN-30-BK-7890)" },
  { name: "Suresh Kumar", phone: "9443210987", rating: 4.9, trips: 2100, vehicle: "Bajaj Pulsar (TN-30-CD-1122)" },
  { name: "Praveen M.", phone: "9600123984", rating: 4.7, trips: 650, vehicle: "TVS Jupiter (TN-30-EF-5544)" }
];

export const OnlineDeliveryPortal = ({
  menu = [],
  orders = [],
  settings = {},
  offers = [],
  customers = [],
  onPlaceDeliveryOrder,
  onSwitchToDineIn
}) => {
  // Navigation: 'Home' | 'Offer' | 'Menu' | 'Orders' | 'Account' | 'Cart'
  const [activeTab, setActiveTab] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false);
  const [nonVegOnlyFilter, setNonVegOnlyFilter] = useState(false);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);

  // 🌟 PAGE 1 STATE: Welcome Splash Onboarding ("Delicious Foods")
  const [showWelcomeSplash, setShowWelcomeSplash] = useState(() => {
    return !localStorage.getItem("vrs_seen_welcome_splash");
  });

  // 🍗 PAGE 2 STATE: Dish Combo & Add-ons Checkout ("Fried Rice and Chicken")
  const [comboDish, setComboDish] = useState(null);
  const [comboQty, setComboQty] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState({
    salad: true,
    juice: true,
    naan: false
  });

  // Food Detail Modal
  const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

  // Favorites toggle
  const [favorites, setFavorites] = useState({});

  // Cart state
  const [cart, setCart] = useState({});
  const [cookingInstructions, setCookingInstructions] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState([]);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("UPI"); // 'UPI' | 'COD' | 'Card'

  // Delivery Address Form State
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [streetArea, setStreetArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("636001");
  const [addressType, setAddressType] = useState("Home"); // 'Home' | 'Work' | 'Other'
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Active Live Tracking Order State
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState(() => {
    return localStorage.getItem("vrs_active_delivery_order_id") || null;
  });

  // Load saved delivery address if available
  useEffect(() => {
    const savedAddr = localStorage.getItem("vrs_delivery_address");
    if (savedAddr) {
      try {
        const parsed = JSON.parse(savedAddr);
        setCustomerName(parsed.name || "");
        setCustomerMobile(parsed.mobile || "");
        setHouseNo(parsed.houseNo || "");
        setStreetArea(parsed.streetArea || "");
        setLandmark(parsed.landmark || "");
        setPincode(parsed.pincode || "636001");
        setAddressType(parsed.addressType || "Home");
      } catch (e) {}
    }
  }, []);

  // Look up customer name automatically if mobile matches CRM
  useEffect(() => {
    if (customerMobile && customerMobile.length === 10) {
      const match = customers.find(c => c.mobile === customerMobile);
      if (match && match.name && !customerName) {
        setCustomerName(match.name);
      }
    }
  }, [customerMobile, customers, customerName]);

  // Categories list
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(menu.map(i => i.category).filter(Boolean))];
    return ["All", ...uniqueCats];
  }, [menu]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menu.filter(item => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q) || String(item.no || '').includes(q);
        const matchesCat = item.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesCat) return false;
      }
      if (activeCategory !== "All" && item.category !== activeCategory) {
        return false;
      }
      if (vegOnlyFilter && !item.veg) return false;
      if (nonVegOnlyFilter && item.veg) return false;
      if (bestsellerOnly && !item.is_special && item.price < 150) return false;
      return true;
    });
  }, [menu, searchQuery, activeCategory, vegOnlyFilter, nonVegOnlyFilter, bestsellerOnly]);

  // Daily Deals for Home Screen (cards matching Screen 1)
  const dailyDeals = useMemo(() => {
    if (menu.length === 0) return [];
    return menu.slice(0, 6);
  }, [menu]);

  // Top of the Week item (horizontal card matching Screen 1)
  const topOfTheWeek = useMemo(() => {
    if (menu.length === 0) return null;
    return menu.find(i => i.is_special) || menu[1] || menu[0];
  }, [menu]);

  // Dedicated "Fried Rice and Chicken" dish for combo screen
  const friedRiceDish = useMemo(() => {
    return menu.find(i => (i.name || '').toLowerCase().includes('rice') || (i.name || '').toLowerCase().includes('chicken')) || {
      id: "COMBO-FRC",
      name: "Fried Rice and Chicken",
      price: 350,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
      category: "Special Combos"
    };
  }, [menu]);

  // Cart calculations
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartSubtotal = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = menu.find(i => String(i.id) === String(id));
      if (item) return sum + (item.price * qty);
      // check if it's an add-on
      const addon = COMBO_ADDONS.find(a => a.id === id);
      if (addon) return sum + (addon.price * qty);
      return sum;
    }, 0);
  }, [cart, menu]);

  const baseDeliveryFee = 40;
  const freeDeliveryThreshold = 299;
  const deliveryFee = cartSubtotal >= freeDeliveryThreshold ? 0 : baseDeliveryFee;
  const packagingFee = cartItemCount > 0 ? 15 : 0;
  const gstPercentage = 5;
  const gstAmount = Math.round((cartSubtotal * gstPercentage) / 100);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedOffer) return 0;
    if (appliedOffer.discountType === "percentage") {
      return Math.round((cartSubtotal * (appliedOffer.discountValue || 10)) / 100);
    }
    return Math.min(appliedOffer.discountValue || 0, cartSubtotal);
  }, [appliedOffer, cartSubtotal]);

  const cartNetTotal = Math.max(0, cartSubtotal + deliveryFee + packagingFee + gstAmount - discountAmount);

  // Cart handlers
  const handleAddToCart = (itemId, qtyToAdd = 1) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + qtyToAdd
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const handleDeleteItem = (itemId) => {
    setCart(prev => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const toggleFavorite = (itemId, e) => {
    e?.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Open Food Detail Modal
  const openItemDetail = (item) => {
    setSelectedItemForDetail(item);
    setDetailQuantity(cart[item.id] || 1);
  };

  // Open Dish Combo Checkout Screen
  const openComboScreen = (dish) => {
    setComboDish(dish || friedRiceDish);
    setComboQty(1);
    setSelectedAddons({ salad: true, juice: true, naan: false });
  };

  // Checkout from Combo Screen
  const handleComboCheckout = () => {
    if (!comboDish) return;
    // Add main dish to cart
    handleAddToCart(comboDish.id, comboQty);
    // Add selected add-ons to cart
    Object.entries(selectedAddons).forEach(([addonId, isSelected]) => {
      if (isSelected) {
        handleAddToCart(addonId, 1);
      }
    });
    setComboDish(null);
    setActiveTab("Cart");
  };

  // Available Offers list
  const availableOffersList = useMemo(() => {
    const list = [...offers];
    if (!list.some(o => o.code === "WELCOME50")) {
      list.push({
        id: "OFF-W50",
        code: "WELCOME50",
        title: "First Order Discount",
        discountType: "flat",
        discountValue: 50,
        minBillAmount: 200,
        notes: "Flat ₹50 OFF on food bill above ₹200",
        isActive: true
      });
    }
    if (!list.some(o => o.code === "FREEDEL")) {
      list.push({
        id: "OFF-FD",
        code: "FREEDEL",
        title: "Free Delivery Special",
        discountType: "flat",
        discountValue: baseDeliveryFee,
        minBillAmount: 150,
        notes: `Free door delivery on orders above ₹150 (Saves ₹${baseDeliveryFee})`,
        isActive: true
      });
    }
    if (!list.some(o => o.code === "DHABA10")) {
      list.push({
        id: "OFF-D10",
        code: "DHABA10",
        title: "10% Super Saver",
        discountType: "percentage",
        discountValue: 10,
        minBillAmount: 400,
        notes: "10% OFF on all meals above ₹400",
        isActive: true
      });
    }
    return list;
  }, [offers, baseDeliveryFee]);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;
    
    const offer = availableOffersList.find(o => o.code.toUpperCase() === code);
    if (!offer) {
      alert("Invalid or expired coupon code!");
      return;
    }

    if (cartSubtotal > 0 && cartSubtotal < (offer.minBillAmount || 0)) {
      alert(`This coupon requires a minimum food bill of ₹${offer.minBillAmount}`);
      return;
    }

    setAppliedOffer(offer);
    setCouponInput("");
    alert(`🎉 Coupon "${offer.code}" applied successfully!`);
  };

  const copyCouponCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  // Place delivery order (Cart checkout action)
  const handlePlaceOrder = () => {
    if (!customerMobile || customerMobile.trim().length !== 10) {
      alert("Please enter a valid 10-digit mobile number for delivery updates!");
      setShowAddressModal(true);
      return;
    }

    if (!houseNo || !streetArea) {
      alert("Please enter your complete delivery address!");
      setShowAddressModal(true);
      return;
    }

    const itemsArray = Object.entries(cart).map(([id, qty]) => {
      const item = menu.find(i => String(i.id) === String(id));
      if (item) return { ...item, quantity: qty };
      const addon = COMBO_ADDONS.find(a => a.id === id);
      if (addon) return { ...addon, quantity: qty };
      return null;
    }).filter(Boolean);

    if (itemsArray.length === 0) {
      alert("Your cart is empty. Please add items to proceed!");
      return;
    }

    const assignedRider = MOCK_RIDERS[Math.floor(Math.random() * MOCK_RIDERS.length)];
    const newOrderId = "ORD-DEL-" + Math.floor(1000 + Math.random() * 9000);
    const newDeliveryOrder = {
      id: newOrderId,
      tableNumber: "Delivery",
      tokenNumber: "DEL-" + Math.floor(100 + Math.random() * 900),
      orderType: "Delivery",
      items: itemsArray,
      subtotal: cartSubtotal,
      total: cartSubtotal,
      packagingCharge: packagingFee,
      deliveryFee,
      discountAmount,
      discountCode: appliedOffer ? appliedOffer.code : "",
      netTotal: cartNetTotal,
      customerName: customerName.trim() || "Customer",
      customerMobile: customerMobile.trim(),
      deliveryAddress: {
        houseNo: houseNo.trim(),
        streetArea: streetArea.trim(),
        landmark: landmark.trim(),
        pincode: pincode.trim(),
        addressType
      },
      deliveryInstructions: deliveryInstructions.join(", ") + (cookingInstructions ? ` | Note: ${cookingInstructions}` : ""),
      deliveryPartner: assignedRider,
      deliveryStatus: "Confirmed",
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid Online',
      status: "Confirmed",
      estimatedDeliveryTime: "30-35 mins",
      timestamp: new Date().toISOString()
    };

    localStorage.setItem("vrs_delivery_address", JSON.stringify({
      name: customerName,
      mobile: customerMobile,
      houseNo,
      streetArea,
      landmark,
      pincode,
      addressType
    }));

    if (onPlaceDeliveryOrder) {
      onPlaceDeliveryOrder(newDeliveryOrder);
    }

    setActiveTrackingOrderId(newOrderId);
    localStorage.setItem("vrs_active_delivery_order_id", newOrderId);

    setCart({});
    setActiveTab("Orders");
  };

  // Find active tracking order details
  const activeTrackingOrder = useMemo(() => {
    if (!activeTrackingOrderId) return null;
    return orders.find(o => o.id === activeTrackingOrderId) || null;
  }, [orders, activeTrackingOrderId]);

  // Delivery order history
  const pastDeliveryOrders = useMemo(() => {
    return orders.filter(o => o.orderType === "Delivery" || o.tableNumber === "Delivery");
  }, [orders]);

  return (
    <div className="pink-theme-app-container">
      {/* ========================================================= */}
      {/* 🌟 PAGE 1: WELCOME / ONBOARDING SPLASH SCREEN */}
      {/* (Exact match to media_1794039423197_1e6e0fc1.png) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showWelcomeSplash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="welcome-splash-overlay"
          >
            {/* Top 55% Crisp Chicken Wings Image */}
            <div className="wso-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1527477378698-479760449f67?w=800&auto=format&fit=crop&q=80" 
                alt="Delicious glazed crispy chicken wings"
                className="wso-chicken-wings-hero-img"
              />
              <div className="wso-bottom-gradient-fade" />
            </div>

            {/* Bottom Content Area */}
            <div className="wso-content-area">
              <h1 className="wso-title-delicious">
                Delicious<br />
                Foods
              </h1>

              <p className="wso-description-text">
                Let us help you discover the best food of the week
              </p>

              <div className="wso-buttons-flex-row">
                {/* Purple "Get Started" Button */}
                <button 
                  className="wso-purple-start-btn"
                  onClick={() => {
                    setShowWelcomeSplash(false);
                    localStorage.setItem("vrs_seen_welcome_splash", "true");
                  }}
                >
                  Get Started
                </button>

                {/* Circular Coral Play Button */}
                <button 
                  className="wso-coral-play-circle-btn"
                  onClick={() => {
                    setShowWelcomeSplash(false);
                    localStorage.setItem("vrs_seen_welcome_splash", "true");
                  }}
                  aria-label="Play or Explore"
                >
                  <Play size={18} fill="#FFFFFF" color="#FFFFFF" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🍗 PAGE 2: DISH COMBO & ADD-ONS CHECKOUT SCREEN */}
      {/* (Exact match to media_1794039438898_30001ef8.png) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {comboDish && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            className="combo-screen-fullscreen-modal"
          >
            {/* Top Half Dish Image with Translucent Back Button */}
            <div className="cs-top-dish-photo-box">
              <img 
                src={comboDish.image || "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80"}
                alt={comboDish.name}
                className="cs-dish-cover-img"
              />
              <button 
                className="cs-back-translucent-btn"
                onClick={() => setComboDish(null)}
                aria-label="Go Back"
              >
                <ArrowLeft size={20} color="#FFFFFF" />
              </button>
            </div>

            {/* Bottom Content Sheet */}
            <div className="cs-details-sheet">
              {/* Dish Title, Subtitle, Stepper & Price Box */}
              <div className="cs-header-info-row">
                <div className="cs-header-left">
                  <h2 className="cs-dish-headline">{comboDish.name}</h2>
                  <span className="cs-restaurant-sublabel">{settings.name || "Restaurant Name"}</span>

                  {/* [- 1 +] Stepper Pill */}
                  <div className="cs-stepper-pill-box">
                    <button 
                      className="cs-stp-btn minus"
                      onClick={() => setComboQty(q => Math.max(1, q - 1))}
                    >
                      <Minus size={14} color="#0F172A" />
                    </button>
                    <span className="cs-stp-val">{comboQty}</span>
                    <button 
                      className="cs-stp-btn plus"
                      onClick={() => setComboQty(q => q + 1)}
                    >
                      <Plus size={14} color="#0F172A" />
                    </button>
                  </div>
                </div>

                {/* Price Box on Right ($35.00 / ₹240.00 in Mint Green) */}
                <div className="cs-price-outline-box">
                  <span className="cs-price-green-text">
                    ${(comboDish.price / 10).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add-ons Recommendations (Tomato Salads, Orange Juice, etc.) */}
              <div className="cs-addons-list">
                {COMBO_ADDONS.map(addon => {
                  const isChecked = !!selectedAddons[addon.id];
                  return (
                    <div 
                      key={addon.id} 
                      className={`cs-addon-item-card ${isChecked ? 'active' : ''}`}
                      onClick={() => setSelectedAddons(prev => ({
                        ...prev,
                        [addon.id]: !prev[addon.id]
                      }))}
                    >
                      <div className="cs-addon-left-col">
                        <div className="cs-addon-thumb-ring">
                          <img src={addon.image} alt={addon.name} className="cs-addon-thumb-img" />
                        </div>
                        <span className="cs-addon-title">{addon.name}</span>
                      </div>

                      <div className="cs-addon-right-col">
                        <span className="cs-addon-price-mint">{addon.priceStr}</span>
                        <div className={`cs-checkbox-bubble ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dashed Line Separator */}
              <div className="cs-dashed-line-divider" />

              {/* Total Price Row */}
              <div className="cs-total-summary-row">
                <span className="cs-total-text">Total Price</span>
                <span className="cs-total-green-amount">
                  ${(
                    ((comboDish.price * comboQty) / 10) +
                    (selectedAddons.salad ? 2.5 : 0) +
                    (selectedAddons.juice ? 4.0 : 0) +
                    (selectedAddons.naan ? 3.0 : 0)
                  ).toFixed(2)}
                </span>
              </div>

              {/* Coral/Pink Check Out Button */}
              <button 
                className="cs-checkout-coral-pill-btn"
                onClick={handleComboCheckout}
              >
                Check Out
              </button>

              {/* Mockup Bottom Navigation (Heart, Grid, Cart, Profile) */}
              <div className="cs-mockup-bottom-nav">
                <button className="csmb-nav-btn"><Heart size={20} color="#94A3B8" /></button>
                <button className="csmb-nav-btn"><LayoutGrid size={20} color="#94A3B8" /></button>
                <button className="csmb-nav-btn active-tab-box"><ShoppingBag size={20} color="#0F172A" /></button>
                <button className="csmb-nav-btn"><User size={20} color="#0F172A" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🔝 SCREEN 1 SEARCH BAR & FILTERS (Only for Home & Menu) */}
      {/* ========================================================= */}
      {(activeTab === "Home" || activeTab === "Menu") && (
        <header className="pink-top-header">
          {/* Search bar + Pink Filter button */}
          <div className="pth-search-row">
            <div className="pth-search-input-wrapper">
              <Search size={18} className="search-gray-icon" />
              <input 
                type="text" 
                placeholder="Search for Food & Restaurant"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  if (activeTab === "Home" && e.target.value.trim()) {
                    setActiveTab("Menu");
                  }
                }}
              />
              {searchQuery && (
                <button className="btn-clear-q" onClick={() => setSearchQuery("")}>
                  <X size={15} />
                </button>
              )}
            </div>

            <button 
              className="pth-pink-filter-btn"
              onClick={() => setShowFilterDrawer(prev => !prev)}
            >
              <SlidersHorizontal size={18} color="#FFFFFF" />
            </button>
          </div>

          {/* Filter Drawer / Pills */}
          <AnimatePresence>
            {showFilterDrawer && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="filter-chips-expandable"
              >
                <button 
                  className={`quick-pill ${vegOnlyFilter ? 'active' : ''}`}
                  onClick={() => setVegOnlyFilter(v => !v)}
                >
                  🟢 Veg Only
                </button>
                <button 
                  className={`quick-pill ${nonVegOnlyFilter ? 'active' : ''}`}
                  onClick={() => setNonVegOnlyFilter(v => !v)}
                >
                  🔴 Non-Veg
                </button>
                <button 
                  className={`quick-pill ${bestsellerOnly ? 'active' : ''}`}
                  onClick={() => setBestsellerOnly(v => !v)}
                >
                  🔥 Specials
                </button>
                {onSwitchToDineIn && (
                  <button className="quick-pill dinein-pill" onClick={onSwitchToDineIn}>
                    🍽️ Dine-In Mode
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}

      {/* Main Body per Tab */}
      <main className="pink-main-scroll-body">
        {/* ========================================================= */}
        {/* TAB 1: HOME (Screen 1 in Uploaded Mockup) */}
        {/* ========================================================= */}
        {activeTab === "Home" && (
          <div className="screen-home-view">
            {/* Active Delivery Notification Pill (if any) */}
            {activeTrackingOrderId && (
              <div className="active-order-floating-pill" onClick={() => setActiveTab("Orders")}>
                <div className="aofp-left">
                  <Bike size={18} className="anim-bike" />
                  <div>
                    <strong>Order in Delivery Transit</strong>
                    <small>Tap to track live rider location</small>
                  </div>
                </div>
                <ChevronRight size={18} />
              </div>
            )}

            {/* 🔥 HERO SPECIAL DEAL BANNER */}
            <div className="special-deal-banner-card">
              <div className="sdb-dish-left">
                <img 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=450&auto=format&fit=crop&q=80" 
                  alt="Special Deal Burger Feast"
                  className="sdb-popping-dish-img"
                />
              </div>

              <div className="sdb-content-right">
                <span className="sdb-tag">Special Deal For</span>
                <h2 className="sdb-month-title">January Feast</h2>
                <button 
                  className="sdb-buy-now-btn"
                  onClick={() => {
                    if (dailyDeals[0]) {
                      handleAddToCart(dailyDeals[0].id);
                      setActiveTab("Cart");
                    }
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* 🍗 FEATURED CHEF COMBO BANNER (Opens Screen 2: Fried Rice and Chicken) */}
            <div 
              className="featured-combo-promo-strip"
              onClick={() => openComboScreen(friedRiceDish)}
            >
              <div className="fcps-left">
                <span className="fcps-tag">★ Chef's Special Combo</span>
                <h3>Fried Rice & Chicken</h3>
                <p>Includes Tomato Salads & Fresh Orange Juice • $41.50</p>
              </div>
              <button className="fcps-open-btn">
                <span>Customize</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* 🍔 SECTION: YOUR DAILY DEALS (Horizontal Cards from Screen 1) */}
            <div className="home-section-container">
              <div className="hsc-header-row">
                <h3 className="hsc-title">Your Daily Deals</h3>
                <button className="hsc-see-all-link" onClick={() => setActiveTab("Menu")}>
                  See All
                </button>
              </div>

              <div className="daily-deals-scroll-row">
                {dailyDeals.map(item => {
                  return (
                    <div 
                      key={item.id} 
                      className="daily-deal-card"
                      onClick={() => openComboScreen(item)}
                    >
                      <div className="ddc-img-holder">
                        <img 
                          src={getDishImage(item)} 
                          alt={item.name} 
                          className="ddc-dish-img"
                        />
                      </div>

                      <div className="ddc-info">
                        <h4 className="ddc-name">{item.name}</h4>
                        <span className="ddc-sub">Warpenk kita</span>

                        <div className="ddc-bottom-row">
                          <span className="ddc-price">₹ {item.price}</span>
                          
                          <button 
                            className="ddc-pink-plus-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item.id);
                            }}
                            aria-label="Add to cart"
                          >
                            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🥗 SECTION: TOP OF THE WEEK (Horizontal Card from Screen 1) */}
            {topOfTheWeek && (
              <div className="home-section-container">
                <div className="hsc-header-row">
                  <h3 className="hsc-title">Top of The Week</h3>
                  <button className="hsc-see-all-link" onClick={() => setActiveTab("Menu")}>
                    See All
                  </button>
                </div>

                <div 
                  className="top-week-card"
                  onClick={() => openComboScreen(topOfTheWeek)}
                >
                  <div className="twc-left-dish">
                    <img 
                      src={getDishImage(topOfTheWeek)} 
                      alt={topOfTheWeek.name} 
                      className="twc-round-bowl-img"
                    />
                  </div>

                  <div className="twc-center-info">
                    <h4 className="twc-title">{topOfTheWeek.name}</h4>
                    <span className="twc-price">₹ {topOfTheWeek.price}</span>
                    <div className="twc-free-delivery-tag">
                      <Bike size={13} color="#EA580C" />
                      <span>Free delivery</span>
                    </div>
                  </div>

                  <div className="twc-right-actions">
                    <button 
                      className="twc-heart-btn"
                      onClick={(e) => toggleFavorite(topOfTheWeek.id, e)}
                    >
                      <Heart 
                        size={18} 
                        color={favorites[topOfTheWeek.id] ? "#FF2E63" : "#CBD5E1"} 
                        fill={favorites[topOfTheWeek.id] ? "#FF2E63" : "none"}
                      />
                    </button>

                    <button 
                      className="twc-pink-plus-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(topOfTheWeek.id);
                      }}
                      aria-label="Add to cart"
                    >
                      <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: OFFERS (Deals, Promo Coupons & Discounts) */}
        {/* ========================================================= */}
        {activeTab === "Offer" && (
          <div className="screen-offers-view">
            <div className="subpage-header-bar">
              <button className="subpage-back-btn" onClick={() => setActiveTab("Home")}>
                <ArrowLeft size={18} color="#FF2E63" />
              </button>
              <h2 className="subpage-header-title">Offers & Deals</h2>
              <div style={{ width: 42 }} />
            </div>

            <div className="pink-page-title-banner">
              <h2>Exclusive Dhaba Deals & Coupons</h2>
              <p>Apply promo codes at checkout for maximum food savings!</p>
            </div>

            {appliedOffer && (
              <div className="active-applied-coupon-pill">
                <div className="aacp-left">
                  <CheckCircle2 size={18} color="#10B981" />
                  <span>Coupon <strong>{appliedOffer.code}</strong> is active!</span>
                </div>
                <button className="aacp-remove-btn" onClick={() => setAppliedOffer(null)}>
                  Remove
                </button>
              </div>
            )}

            <div className="vouchers-cards-list">
              {availableOffersList.map(off => {
                const isThisApplied = appliedOffer && appliedOffer.code === off.code;
                return (
                  <div key={off.id} className={`voucher-card ${isThisApplied ? 'applied' : ''}`}>
                    <div className="vc-left">
                      <div className="vc-icon-box">
                        <Percent size={24} color="#FF2E63" />
                      </div>
                      <div className="vc-details">
                        <span className="vc-code-badge">{off.code}</span>
                        <h3>{off.title}</h3>
                        <p>{off.notes}</p>
                        <small>Min food bill: ₹{off.minBillAmount || 0}</small>
                      </div>
                    </div>

                    <div className="vc-actions">
                      <button 
                        className="btn-copy-voucher"
                        onClick={() => copyCouponCode(off.code)}
                      >
                        {copiedCoupon === off.code ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedCoupon === off.code ? "Copied" : "Copy"}</span>
                      </button>

                      <button 
                        className={`btn-apply-voucher ${isThisApplied ? 'applied' : ''}`}
                        onClick={() => handleApplyCoupon(off.code)}
                      >
                        {isThisApplied ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: MENU (Complete Dhaba Catalog) */}
        {/* ========================================================= */}
        {activeTab === "Menu" && (
          <div className="screen-menu-view">
            {/* Horizontal Category Chips */}
            <div className="category-chips-scroll">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`menu-cat-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="menu-items-grid">
              {filteredItems.map(item => {
                return (
                  <div 
                    key={item.id} 
                    className="daily-deal-card menu-grid-item"
                    onClick={() => openComboScreen(item)}
                  >
                    <div className="ddc-img-holder">
                      <img 
                        src={getDishImage(item)} 
                        alt={item.name} 
                        className="ddc-dish-img"
                      />
                      <span className={`veg-dot-badge ${item.veg ? 'veg' : 'non-veg'}`} />
                    </div>

                    <div className="ddc-info">
                      <h4 className="ddc-name">{item.name}</h4>
                      <span className="ddc-sub">{item.category || "Dhaba Special"}</span>

                      <div className="ddc-bottom-row">
                        <span className="ddc-price">₹ {item.price}</span>
                        
                        <button 
                          className="ddc-pink-plus-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.id);
                          }}
                        >
                          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: ORDERS (Live Tracking & History) */}
        {/* ========================================================= */}
        {activeTab === "Orders" && (
          <div className="screen-orders-view">
            <div className="subpage-header-bar">
              <button className="subpage-back-btn" onClick={() => setActiveTab("Home")}>
                <ArrowLeft size={18} color="#FF2E63" />
              </button>
              <h2 className="subpage-header-title">My Orders</h2>
              <div style={{ width: 42 }} />
            </div>

            {activeTrackingOrder ? (
              <div className="live-delivery-tracker-card">
                <div className="ldt-header">
                  <span className="pulse-green-dot">● LIVE TRACKING</span>
                  <h2>Arriving in 25-30 mins</h2>
                  <p>Order #{activeTrackingOrder.id}</p>
                </div>

                {/* Stepper Progress */}
                <div className="ldt-stepper">
                  {(() => {
                    const status = activeTrackingOrder.deliveryStatus || "Confirmed";
                    const stages = [
                      { id: "Confirmed", label: "Accepted", icon: "📋" },
                      { id: "Kitchen", label: "Kitchen", icon: "👨‍🍳" },
                      { id: "OutForDelivery", label: "On Road", icon: "🛵" },
                      { id: "Delivered", label: "Delivered", icon: "🎉" }
                    ];

                    let activeIdx = 0;
                    if (status === "Kitchen" || status === "Pending") activeIdx = 1;
                    if (status === "OutForDelivery" || status === "Dispatched") activeIdx = 2;
                    if (status === "Delivered" || status === "Completed") activeIdx = 3;

                    return (
                      <div className="pink-stepper-row">
                        {stages.map((stg, idx) => (
                          <div key={stg.id} className={`pink-step-node ${idx <= activeIdx ? 'done' : ''}`}>
                            <div className="pink-step-circle">
                              <span>{stg.icon}</span>
                            </div>
                            <span className="pink-step-label">{stg.label}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Rider Info Card */}
                {activeTrackingOrder.deliveryPartner && (
                  <div className="rider-summary-card">
                    <div className="rsc-left">
                      <div className="rsc-avatar">
                        <Bike size={20} color="#FF2E63" />
                      </div>
                      <div>
                        <strong>{activeTrackingOrder.deliveryPartner.name}</strong>
                        <p>{activeTrackingOrder.deliveryPartner.vehicle}</p>
                      </div>
                    </div>

                    <a 
                      href={`tel:${activeTrackingOrder.deliveryPartner.phone}`}
                      className="rsc-call-btn"
                    >
                      <Phone size={16} />
                      <span>Call</span>
                    </a>
                  </div>
                )}
              </div>
            ) : null}

            {/* Past Orders */}
            <div className="past-orders-box">
              <h3 className="pob-title">Order History</h3>

              {pastDeliveryOrders.length === 0 && !activeTrackingOrder ? (
                <div className="empty-orders-view">
                  <ShoppingBag size={48} color="#CBD5E1" />
                  <h4>No orders yet</h4>
                  <p>Order delicious dhaba food from our menu!</p>
                  <button className="btn-pink-primary" onClick={() => setActiveTab("Menu")}>
                    Browse Menu
                  </button>
                </div>
              ) : (
                <div className="past-orders-list">
                  {pastDeliveryOrders.map(ord => (
                    <div key={ord.id} className="past-order-item-card">
                      <div className="poi-top">
                        <div>
                          <strong>Order #{ord.id}</strong>
                          <small>{new Date(ord.timestamp || Date.now()).toLocaleDateString()}</small>
                        </div>
                        <span className="poi-status-tag">{ord.deliveryStatus || "Delivered"}</span>
                      </div>

                      <div className="poi-items-list">
                        {ord.items?.map((it, idx) => (
                          <span key={idx}>{it.quantity}x {it.name} </span>
                        ))}
                      </div>

                      <div className="poi-bottom">
                        <strong>Total: ₹{ord.netTotal || ord.total}</strong>
                        <button 
                          className="poi-reorder-btn"
                          onClick={() => {
                            const newCart = {};
                            ord.items?.forEach(i => { newCart[i.id] = i.quantity; });
                            setCart(newCart);
                            setActiveTab("Cart");
                          }}
                        >
                          <RotateCcw size={14} /> Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: ACCOUNT (Profile & Settings) */}
        {/* ========================================================= */}
        {activeTab === "Account" && (
          <div className="screen-account-view">
            <div className="subpage-header-bar">
              <button className="subpage-back-btn" onClick={() => setActiveTab("Home")}>
                <ArrowLeft size={18} color="#FF2E63" />
              </button>
              <h2 className="subpage-header-title">My Account</h2>
              <div style={{ width: 42 }} />
            </div>

            <div className="account-profile-card">
              <div className="apc-avatar">
                <User size={36} color="#FF2E63" />
              </div>
              <div className="apc-details">
                <h2>{customerName || "VRS Dhaba Foodie"}</h2>
                <p>📱 {customerMobile ? `+91 ${customerMobile}` : "No mobile linked"}</p>
                <span className="vip-badge">🌟 Dhaba Gold Member</span>
              </div>
            </div>

            {/* Address Card */}
            <div className="account-white-card">
              <div className="awc-header">
                <div className="awc-title">
                  <MapPin size={18} color="#FF2E63" />
                  <h3>Delivery Address</h3>
                </div>
                <button className="awc-link-btn" onClick={() => setShowAddressModal(true)}>
                  Change
                </button>
              </div>

              {houseNo ? (
                <div className="awc-addr-preview">
                  <span className="addr-type-chip">{addressType}</span>
                  <p>{houseNo}, {streetArea}, {landmark} - {pincode}</p>
                </div>
              ) : (
                <div className="awc-empty-addr" onClick={() => setShowAddressModal(true)}>
                  <Plus size={16} color="#FF2E63" />
                  <span>Add your delivery address</span>
                </div>
              )}
            </div>

            {/* Help Links */}
            <div className="account-white-card">
              <h3>Support & Dhaba Contact</h3>
              <div className="awc-link-row" onClick={() => setShowWelcomeSplash(true)}>
                <Sparkles size={18} color="#7C3AED" />
                <span>View Onboarding Splash ("Delicious Foods")</span>
                <ChevronRight size={16} />
              </div>
              <a href="tel:9876543210" className="awc-link-row">
                <Phone size={18} color="#10B981" />
                <span>Call Restaurant Desk</span>
                <ChevronRight size={16} />
              </a>
              <div 
                className="awc-link-row"
                onClick={() => window.open('https://wa.me/919876543210', '_blank')}
              >
                <Send size={18} color="#25D366" />
                <span>WhatsApp Instant Help</span>
                <ChevronRight size={16} />
              </div>
              {onSwitchToDineIn && (
                <div className="awc-link-row" onClick={onSwitchToDineIn}>
                  <UtensilsCrossed size={18} color="#FF2E63" />
                  <span>Switch to Dine-In / Table Mode</span>
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 🛒 SCREEN 3: CART / ORDER DETAILS */}
        {/* ========================================================= */}
        {activeTab === "Cart" && (
          <div className="screen-cart-order-details">
            {/* Header with Back button and Order details */}
            <div className="cod-header-bar">
              <button 
                className="cod-back-btn" 
                onClick={() => setActiveTab("Home")}
              >
                <ArrowLeft size={18} color="#FF2E63" />
              </button>
              <h2 className="cod-header-title">Order details</h2>
              <div style={{ width: 40 }} />
            </div>

            {cartItemCount === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={56} color="#CBD5E1" />
                <h3>Your cart is empty</h3>
                <p>Explore our menu and add your favorite dishes!</p>
                <button className="btn-pink-primary" onClick={() => setActiveTab("Menu")}>
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="cod-content-layout">
                {/* 1. Items List (Exact Card Style with [-] 1 [+] and Trash from Screen 3) */}
                <div className="cod-items-list">
                  {Object.entries(cart).map(([id, qty]) => {
                    const item = menu.find(i => String(i.id) === String(id));
                    const addon = COMBO_ADDONS.find(a => a.id === id);
                    const displayName = item ? item.name : (addon ? addon.name : "Special Item");
                    const displayPrice = item ? item.price : (addon ? addon.price : 0);
                    const displayImage = item ? getDishImage(item) : (addon ? addon.image : "");

                    return (
                      <div key={id} className="cod-item-card">
                        <div className="cod-item-img-box">
                          <img 
                            src={displayImage} 
                            alt={displayName} 
                            className="cod-dish-thumb"
                          />
                        </div>

                        <div className="cod-item-info">
                          <h4 className="cod-item-name">{displayName}</h4>
                          <span className="cod-item-sub">Warpenk kita</span>
                          <span className="cod-item-price">₹ {displayPrice}</span>
                        </div>

                        <div className="cod-item-actions">
                          {/* Stepper [-] 1 [+] */}
                          <div className="cod-stepper-pill">
                            <button 
                              className="cod-step-minus"
                              onClick={() => handleRemoveFromCart(id)}
                            >
                              <Minus size={13} color="#FF2E63" />
                            </button>
                            <span className="cod-step-qty">{qty}</span>
                            <button 
                              className="cod-step-plus"
                              onClick={() => handleAddToCart(id)}
                            >
                              <Plus size={13} color="#FF2E63" />
                            </button>
                          </div>

                          {/* Red Trash Delete Button */}
                          <button 
                            className="cod-trash-btn"
                            onClick={() => handleDeleteItem(id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} color="#FFFFFF" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Address Pill */}
                <div className="cod-address-pill" onClick={() => setShowAddressModal(true)}>
                  <div className="cap-left">
                    <MapPin size={18} color="#FF2E63" />
                    <div>
                      <strong>Delivering to: {addressType}</strong>
                      <p>{houseNo && streetArea ? `${houseNo}, ${streetArea}` : "Tap to set delivery address"}</p>
                    </div>
                  </div>
                  <button className="cap-change-btn">
                    {houseNo ? "Change" : "Add"}
                  </button>
                </div>

                {/* 2. 💖 PINK GRADIENT BILL CARD (Exact Match to Screen 3) */}
                <div className="pink-gradient-bill-card">
                  <div className="pgb-row">
                    <span>Sub-Total</span>
                    <span>₹ {cartSubtotal}</span>
                  </div>

                  <div className="pgb-row">
                    <span>Delivery Charge</span>
                    <span>{deliveryFee === 0 ? "FREE" : `₹ ${deliveryFee}`}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="pgb-row discount">
                      <span>Discount</span>
                      <span>-₹ {discountAmount}</span>
                    </div>
                  )}

                  <div className="pgb-dashed-line" />

                  <div className="pgb-row pgb-total-row">
                    <span>Total</span>
                    <span className="pgb-total-amount">₹ {cartNetTotal}</span>
                  </div>

                  {/* White Pill Button: "Place My Order" */}
                  <button 
                    className="pgb-place-order-btn"
                    onClick={handlePlaceOrder}
                  >
                    Place My Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Cart Pill (Floats when in Home / Menu if items in cart) */}
      <AnimatePresence>
        {activeTab !== "Cart" && !comboDish && cartItemCount > 0 && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="pink-floating-cart-pill"
            onClick={() => setActiveTab("Cart")}
          >
            <div className="pfcp-inner">
              <div className="pfcp-left">
                <div className="pfcp-count-badge">
                  <ShoppingBag size={18} />
                  <span>{cartItemCount}</span>
                </div>
                <strong>₹ {cartNetTotal}</strong>
              </div>

              <div className="pfcp-right">
                <span>View Cart</span>
                <ChevronRight size={18} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 📱 SLEEK BOTTOM NAVIGATION DOWNBAR (5 Tabs) */}
      {/* ========================================================= */}
      <nav className="pink-bottom-downbar">
        <button 
          className={`pbd-item ${activeTab === 'Home' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Home');
            setComboDish(null);
          }}
        >
          <HomeIcon size={22} />
          <span>Home</span>
          {activeTab === 'Home' && <span className="pbd-active-dot" />}
        </button>

        <button 
          className={`pbd-item ${activeTab === 'Offer' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Offer');
            setComboDish(null);
          }}
        >
          <Tag size={22} />
          <span>Offer</span>
          <span className="pbd-mini-badge">DEALS</span>
          {activeTab === 'Offer' && <span className="pbd-active-dot" />}
        </button>

        <button 
          className={`pbd-item ${activeTab === 'Menu' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Menu');
            setComboDish(null);
          }}
        >
          <UtensilsCrossed size={22} />
          <span>Menu</span>
          {activeTab === 'Menu' && <span className="pbd-active-dot" />}
        </button>

        <button 
          className={`pbd-item ${activeTab === 'Orders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Orders');
            setComboDish(null);
          }}
        >
          <ShoppingBag size={22} />
          <span>Orders</span>
          {activeTrackingOrderId && <span className="pbd-live-tracker-dot" />}
          {activeTab === 'Orders' && <span className="pbd-active-dot" />}
        </button>

        <button 
          className={`pbd-item ${activeTab === 'Account' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Account');
            setComboDish(null);
          }}
        >
          <User size={22} />
          <span>Account</span>
          {activeTab === 'Account' && <span className="pbd-active-dot" />}
        </button>
      </nav>

      {/* Address Form Sheet Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="modal-backdrop-address" onClick={() => setShowAddressModal(false)}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="address-sheet-card"
              onClick={e => e.stopPropagation()}
            >
              <div className="sheet-notch" />
              <div className="asc-header-row">
                <h3>Delivery Address</h3>
                <button className="btn-close-asc" onClick={() => setShowAddressModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="asc-body">
                <div className="addr-tag-pills">
                  {["Home", "Work", "Other"].map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`atp-btn ${addressType === t ? 'active' : ''}`}
                      onClick={() => setAddressType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="asc-field">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="asc-field">
                  <label>10-Digit Mobile Number *</label>
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={customerMobile}
                    onChange={e => setCustomerMobile(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="asc-field">
                  <label>House / Flat / Door No. *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Flat 302, Green Meadows"
                    value={houseNo}
                    onChange={e => setHouseNo(e.target.value)}
                  />
                </div>

                <div className="asc-field">
                  <label>Street / Area / Landmark *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Near Bus Stand, Omalur Road"
                    value={streetArea}
                    onChange={e => setStreetArea(e.target.value)}
                  />
                </div>

                <button 
                  className="btn-save-address-pink"
                  onClick={() => {
                    if (!customerMobile || customerMobile.length !== 10) {
                      alert("Please provide a valid 10-digit mobile number!");
                      return;
                    }
                    if (!houseNo || !streetArea) {
                      alert("Please provide complete house and street area!");
                      return;
                    }
                    setShowAddressModal(false);
                  }}
                >
                  Save & Confirm Address
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🎨 COMPLETE COMPONENT STYLES */}
      {/* ========================================================= */}
      <style>{`
        .pink-theme-app-container,
        .pink-theme-app-container *,
        .pink-theme-app-container h1,
        .pink-theme-app-container h2,
        .pink-theme-app-container h3,
        .pink-theme-app-container h4,
        .pink-theme-app-container h5,
        .pink-theme-app-container h6,
        .pink-theme-app-container p,
        .pink-theme-app-container span,
        .pink-theme-app-container button,
        .pink-theme-app-container input {
          font-family: -apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        }

        .pink-theme-app-container {
          min-height: 100vh;
          background: #FAFAFC;
          color: #1E293B;
          padding-bottom: 90px;
          max-width: 520px;
          margin: 0 auto;
          position: relative;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.05);
        }

        /* ------------------------------------------------------------- */
        /* 🌟 PAGE 1: WELCOME SPLASH SCREEN (media_1794039423197_1e6e0fc1.png) */
        /* ------------------------------------------------------------- */
        .welcome-splash-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #FFFFFF;
          z-index: 3000;
          display: flex;
          flex-direction: column;
          max-width: 520px;
          margin: 0 auto;
          overflow: hidden;
        }

        .wso-image-wrapper {
          position: relative;
          width: 100%;
          height: 56vh;
          overflow: hidden;
        }

        .wso-chicken-wings-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .wso-bottom-gradient-fade {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 160px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 55%, #FFFFFF 100%);
        }

        .wso-content-area {
          flex: 1;
          background: #FFFFFF;
          padding: 20px 28px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .wso-title-delicious {
          font-size: 2.8rem;
          font-weight: 800;
          line-height: 1.15;
          color: #0F172A;
          margin: 0 0 14px;
          letter-spacing: -0.025em;
        }

        .wso-description-text {
          font-size: 0.95rem;
          color: #64748B;
          line-height: 1.5;
          margin: 0 0 30px;
          max-width: 300px;
          font-weight: 500;
        }

        .wso-buttons-flex-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .wso-purple-start-btn {
          flex: 1;
          background: #7C3AED;
          color: #FFFFFF;
          border: none;
          padding: 16px 28px;
          border-radius: 50px;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(124, 58, 237, 0.4);
          transition: transform 0.15s, background 0.15s;
        }

        .wso-purple-start-btn:active {
          transform: scale(0.97);
          background: #6D28D9;
        }

        .wso-coral-play-circle-btn {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #FF4757;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(255, 71, 87, 0.4);
          transition: transform 0.15s;
          flex-shrink: 0;
        }

        .wso-coral-play-circle-btn:active {
          transform: scale(0.92);
        }

        /* ------------------------------------------------------------- */
        /* 🍗 PAGE 2: DISH COMBO CHECKOUT (media_1794039438898_30001ef8.png) */
        /* ------------------------------------------------------------- */
        .combo-screen-fullscreen-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #FFFFFF;
          z-index: 2800;
          display: flex;
          flex-direction: column;
          max-width: 520px;
          margin: 0 auto;
          overflow-y: auto;
          scrollbar-width: none;
        }

        .combo-screen-fullscreen-modal::-webkit-scrollbar {
          display: none;
        }

        .cs-top-dish-photo-box {
          position: relative;
          width: 100%;
          height: 42vh;
          background: #000000;
        }

        .cs-dish-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cs-back-translucent-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.35);
          backdrop-filter: blur(4px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .cs-details-sheet {
          flex: 1;
          background: #FFFFFF;
          border-radius: 28px 28px 0 0;
          margin-top: -24px;
          position: relative;
          z-index: 5;
          padding: 24px 22px 20px;
          display: flex;
          flex-direction: column;
        }

        .cs-header-flex-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .cs-title-col {
          flex: 1;
        }

        .cs-dish-headline {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 2px;
        }

        .cs-restaurant-sublabel {
          font-size: 0.78rem;
          color: #94A3B8;
          display: block;
          margin-bottom: 14px;
        }

        .cs-stepper-pill-box {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 6px 14px;
          border-radius: 50px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }

        .cs-stp-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }

        .cs-stp-val {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
          min-width: 14px;
          text-align: center;
        }

        .cs-price-outline-box {
          border: 1.5px solid #E2E8F0;
          padding: 10px 18px;
          border-radius: 14px;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .cs-price-green-text {
          color: #10B981;
          font-size: 1.15rem;
          font-weight: 800;
        }

        /* Add-ons list */
        .cs-addons-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .cs-addon-item-card {
          background: #FAFAFC;
          border: 1px solid #F1F5F9;
          border-radius: 18px;
          padding: 10px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cs-addon-item-card.active {
          background: #FFFFFF;
          border-color: #10B981;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.12);
        }

        .cs-addon-left-col {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cs-addon-thumb-ring {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          overflow: hidden;
          background: #F1F5F9;
        }

        .cs-addon-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cs-addon-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #1E293B;
        }

        .cs-addon-right-col {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cs-addon-price-mint {
          font-size: 0.92rem;
          font-weight: 800;
          color: #10B981;
        }

        .cs-checkbox-bubble {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #CBD5E1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .cs-checkbox-bubble.checked {
          background: #10B981;
          border-color: #10B981;
        }

        .cs-dashed-line-divider {
          border-top: 1.5px dashed #E2E8F0;
          margin: 10px 0 16px;
        }

        .cs-total-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .cs-total-text {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
        }

        .cs-total-green-amount {
          font-size: 1.25rem;
          font-weight: 800;
          color: #10B981;
        }

        .cs-checkout-coral-btn {
          width: 100%;
          background: #FF2E63;
          color: #FFFFFF;
          border: none;
          padding: 16px;
          border-radius: 50px;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(255, 46, 99, 0.4);
          transition: transform 0.15s;
          margin-bottom: 20px;
        }

        .cs-checkout-coral-btn:active {
          transform: scale(0.98);
        }

        .cs-mockup-bottom-bar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 10px 0;
          border-top: 1px solid #F1F5F9;
        }

        .csmb-icon-btn {
          background: none;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
        }

        .csmb-icon-btn.active-pill {
          background: #F1F5F9;
          border-radius: 14px;
        }

        /* ------------------------------------------------------------- */
        /* FEATURED COMBO BANNER IN HOME */
        /* ------------------------------------------------------------- */
        .featured-combo-promo-strip {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          border: 1px solid #F1F5F9;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.03);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .featured-combo-promo-strip:hover {
          transform: translateY(-2px);
        }

        .fcps-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #7C3AED;
          background: #F5F3FF;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 4px;
        }

        .fcps-left h3 {
          font-size: 1rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 2px;
        }

        .fcps-left p {
          font-size: 0.75rem;
          color: #64748B;
          margin: 0;
        }

        .fcps-open-btn {
          background: #FF2E63;
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        /* ------------------------------------------------------------- */
        /* TOP HEADER (SEARCH & FILTERS) */
        /* ------------------------------------------------------------- */
        .pink-top-header {
          padding: 16px 20px 12px;
          background: #FAFAFC;
        }

        .pth-search-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pth-search-input-wrapper {
          flex: 1;
          background: #FFFFFF;
          border-radius: 18px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          height: 52px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
          border: 1px solid #F1F5F9;
        }

        .search-gray-icon {
          color: #94A3B8;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .pth-search-input-wrapper input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          font-size: 0.92rem;
          color: #1E293B;
          font-weight: 500;
        }

        .pth-search-input-wrapper input::placeholder {
          color: #CBD5E1;
          font-weight: 400;
        }

        .btn-clear-q {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .pth-pink-filter-btn {
          width: 52px;
          height: 52px;
          border-radius: 18px;
          background: linear-gradient(135deg, #FF2E63 0%, #FF4D79 100%);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(255, 46, 99, 0.35);
          transition: transform 0.2s;
        }

        .pth-pink-filter-btn:active {
          transform: scale(0.95);
        }

        .filter-chips-expandable {
          display: flex;
          gap: 8px;
          padding-top: 12px;
          flex-wrap: wrap;
        }

        .quick-pill {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          color: #475569;
        }

        .quick-pill.active {
          background: #FF2E63;
          color: white;
          border-color: #FF2E63;
        }

        .dinein-pill {
          background: #FEF3C7;
          border-color: #FDE68A;
          color: #B45309;
        }

        /* ------------------------------------------------------------- */
        /* HERO SPECIAL DEAL BANNER */
        /* ------------------------------------------------------------- */
        .screen-home-view {
          padding: 6px 20px 20px;
        }

        .active-order-floating-pill {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          padding: 10px 14px;
          border-radius: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          cursor: pointer;
          color: #1E40AF;
        }

        .aofp-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .aofp-left strong {
          display: block;
          font-size: 0.85rem;
        }

        .aofp-left small {
          font-size: 0.72rem;
          opacity: 0.85;
        }

        .anim-bike {
          animation: bounce 1s infinite alternate;
        }

        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-3px); }
        }

        .special-deal-banner-card {
          background: linear-gradient(135deg, #FF2E63 0%, #FF4572 100%);
          border-radius: 26px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: visible;
          margin-bottom: 20px;
          box-shadow: 0 12px 28px rgba(255, 46, 99, 0.28);
        }

        .sdb-dish-left {
          width: 44%;
          display: flex;
          justify-content: center;
        }

        .sdb-popping-dish-img {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          border: 3px solid rgba(255, 255, 255, 0.6);
          transform: scale(1.08);
        }

        .sdb-content-right {
          width: 54%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          color: #FFFFFF;
        }

        .sdb-tag {
          font-size: 0.82rem;
          font-weight: 600;
          opacity: 0.95;
          letter-spacing: -0.01em;
        }

        .sdb-month-title {
          font-size: 1.35rem;
          font-weight: 800;
          margin: 2px 0 12px;
          line-height: 1.15;
          color: #FFFFFF;
        }

        .sdb-buy-now-btn {
          background: #FFFFFF;
          color: #FF2E63;
          border: none;
          padding: 8px 22px;
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
          transition: transform 0.15s;
        }

        .sdb-buy-now-btn:active {
          transform: scale(0.95);
        }

        /* ------------------------------------------------------------- */
        /* YOUR DAILY DEALS SECTION */
        /* ------------------------------------------------------------- */
        .home-section-container {
          margin-bottom: 26px;
        }

        .hsc-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .hsc-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .hsc-see-all-link {
          background: none;
          border: none;
          color: #FF2E63;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }

        .daily-deals-scroll-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }

        .daily-deals-scroll-row::-webkit-scrollbar {
          display: none;
        }

        .daily-deal-card {
          background: #FFFFFF;
          border-radius: 22px;
          padding: 14px;
          min-width: 155px;
          max-width: 165px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          border: 1px solid #F8FAFC;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .daily-deal-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
        }

        .ddc-img-holder {
          width: 100%;
          height: 110px;
          border-radius: 16px;
          overflow: hidden;
          background: #F1F5F9;
          position: relative;
          margin-bottom: 10px;
        }

        .ddc-dish-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ddc-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .ddc-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ddc-sub {
          font-size: 0.72rem;
          color: #94A3B8;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .ddc-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }

        .ddc-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: #FF2E63;
        }

        .ddc-pink-plus-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #FF2E63;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 46, 99, 0.35);
          transition: transform 0.15s;
        }

        .ddc-pink-plus-btn:active {
          transform: scale(0.9);
        }

        /* ------------------------------------------------------------- */
        /* TOP OF THE WEEK SECTION */
        /* ------------------------------------------------------------- */
        .top-week-card {
          background: #FFFFFF;
          border-radius: 22px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
          border: 1px solid #F8FAFC;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .top-week-card:hover {
          transform: translateY(-2px);
        }

        .twc-left-dish {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .twc-round-bowl-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .twc-center-info {
          flex: 1;
        }

        .twc-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 4px;
        }

        .twc-price {
          font-size: 0.88rem;
          font-weight: 700;
          color: #64748B;
          display: block;
          margin-bottom: 4px;
        }

        .twc-free-delivery-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #EA580C;
        }

        .twc-right-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .twc-heart-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .twc-pink-plus-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #FF2E63;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 46, 99, 0.35);
        }

        /* ------------------------------------------------------------- */
        /* CART / ORDER DETAILS (Screen 3) */
        /* ------------------------------------------------------------- */
        .screen-cart-order-details {
          padding: 20px 20px 30px;
        }

        .cod-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .cod-back-btn {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }

        .cod-header-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #10B981;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .cod-items-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        .cod-item-card {
          background: #FFFFFF;
          border-radius: 22px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #F8FAFC;
        }

        .cod-item-img-box {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          overflow: hidden;
          background: #F1F5F9;
          flex-shrink: 0;
        }

        .cod-dish-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cod-item-info {
          flex: 1;
        }

        .cod-item-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 2px;
        }

        .cod-item-sub {
          font-size: 0.7rem;
          color: #94A3B8;
          display: block;
          margin-bottom: 4px;
        }

        .cod-item-price {
          font-size: 0.92rem;
          font-weight: 800;
          color: #FF2E63;
        }

        .cod-item-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cod-stepper-pill {
          background: #FFF0F3;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
        }

        .cod-step-minus,
        .cod-step-plus {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cod-step-qty {
          font-size: 0.85rem;
          font-weight: 800;
          color: #0F172A;
        }

        .cod-trash-btn {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #EF4444;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
        }

        .cod-address-pill {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border: 1px solid #F1F5F9;
          cursor: pointer;
        }

        .cap-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cap-left strong {
          font-size: 0.85rem;
          color: #0F172A;
          display: block;
        }

        .cap-left p {
          font-size: 0.72rem;
          color: #64748B;
          margin: 0;
        }

        .cap-change-btn {
          background: #FFF0F3;
          border: none;
          color: #FF2E63;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 6px 12px;
          border-radius: 50px;
          cursor: pointer;
        }

        .pink-gradient-bill-card {
          background: linear-gradient(135deg, #FF2E63 0%, #D81B60 100%);
          border-radius: 28px;
          padding: 24px;
          color: #FFFFFF;
          box-shadow: 0 14px 35px rgba(255, 46, 99, 0.35);
        }

        .pgb-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.92rem;
          font-weight: 600;
          margin-bottom: 10px;
          opacity: 0.95;
        }

        .pgb-row.discount {
          color: #FEF08A;
        }

        .pgb-dashed-line {
          border-top: 1.5px dashed rgba(255, 255, 255, 0.35);
          margin: 14px 0 16px;
        }

        .pgb-total-row {
          font-size: 1.25rem;
          font-weight: 800;
          opacity: 1;
          margin-bottom: 22px;
        }

        .pgb-total-amount {
          font-size: 1.35rem;
          letter-spacing: -0.01em;
        }

        .pgb-place-order-btn {
          width: 100%;
          background: #FFFFFF;
          color: #FF2E63;
          border: none;
          padding: 16px;
          border-radius: 50px;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transition: transform 0.15s;
        }

        .pgb-place-order-btn:active {
          transform: scale(0.98);
        }

        /* ------------------------------------------------------------- */
        /* OTHER SCREENS: OFFERS, MENU, ORDERS, ACCOUNT */
        /* ------------------------------------------------------------- */
        .pink-page-title-banner {
          margin-bottom: 20px;
        }

        .pink-page-title-banner h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 4px;
        }

        .pink-page-title-banner p {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0;
        }

        .screen-offers-view,
        .screen-menu-view,
        .screen-orders-view,
        .screen-account-view {
          padding: 10px 20px 20px;
        }

        .vouchers-cards-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .voucher-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px dashed #FF2E63;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
        }

        .vc-left {
          display: flex;
          gap: 12px;
          align-items: center;
          flex: 1;
        }

        .vc-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #FFF0F3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .vc-code-badge {
          background: #FF2E63;
          color: white;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .vc-details h3 {
          font-size: 0.95rem;
          margin: 4px 0 2px;
          color: #0F172A;
        }

        .vc-details p {
          font-size: 0.75rem;
          color: #64748B;
          margin: 0 0 2px;
        }

        .vc-details small {
          font-size: 0.68rem;
          color: #94A3B8;
        }

        .vc-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .btn-copy-voucher,
        .btn-apply-voucher {
          border: none;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
        }

        .btn-copy-voucher {
          background: #F1F5F9;
          color: #475569;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-apply-voucher {
          background: #FF2E63;
          color: white;
        }

        .btn-apply-voucher.applied {
          background: #10B981;
        }

        /* Menu Grid */
        .category-chips-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 14px;
          scrollbar-width: none;
        }

        .category-chips-scroll::-webkit-scrollbar {
          display: none;
        }

        .menu-cat-chip {
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748B;
          white-space: nowrap;
          cursor: pointer;
        }

        .menu-cat-chip.active {
          background: #FF2E63;
          color: white;
          border-color: #FF2E63;
        }

        .menu-items-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .menu-grid-item {
          max-width: 100% !important;
          min-width: unset !important;
        }

        .veg-dot-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          width: 12px;
          height: 12px;
          border-radius: 3px;
          border: 2px solid;
          background: white;
        }

        .veg-dot-badge.veg {
          border-color: #10B981;
        }

        .veg-dot-badge.non-veg {
          border-color: #EF4444;
        }

        /* Orders */
        .live-delivery-tracker-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.03);
          border: 1px solid #F1F5F9;
        }

        .ldt-header h2 {
          font-size: 1.25rem;
          color: #0F172A;
          margin: 6px 0 2px;
        }

        .pulse-green-dot {
          color: #10B981;
          font-size: 0.72rem;
          font-weight: 800;
        }

        .pink-stepper-row {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }

        .pink-step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .pink-step-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          border: 2px solid transparent;
        }

        .pink-step-node.done .pink-step-circle {
          background: #FFF0F3;
          border-color: #FF2E63;
        }

        .pink-step-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #64748B;
        }

        .rider-summary-card {
          background: #FAFAFC;
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rsc-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rsc-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFF0F3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rsc-left strong {
          display: block;
          font-size: 0.88rem;
          color: #0F172A;
        }

        .rsc-left p {
          font-size: 0.72rem;
          color: #64748B;
          margin: 0;
        }

        .rsc-call-btn {
          background: #10B981;
          color: white;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ------------------------------------------------------------- */
        /* SUBPAGE HEADER BAR (Offers, Orders, Account, Cart) */
        /* ------------------------------------------------------------- */
        .subpage-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0 18px;
        }

        .subpage-back-btn {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: #FFFFFF;
          border: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transition: transform 0.15s;
        }

        .subpage-back-btn:active {
          transform: scale(0.95);
        }

        .subpage-header-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.01em;
        }

        /* ------------------------------------------------------------- */
        /* ORDER HISTORY & EMPTY STATES */
        /* ------------------------------------------------------------- */
        .past-orders-box {
          margin-top: 10px;
        }

        .pob-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 16px;
          letter-spacing: -0.01em;
        }

        .empty-orders-view,
        .empty-cart-state {
          text-align: center;
          padding: 44px 24px;
          background: #FFFFFF;
          border-radius: 26px;
          border: 1px solid #F1F5F9;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 16px 0;
        }

        .empty-orders-view h4,
        .empty-cart-state h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin: 16px 0 6px;
        }

        .empty-orders-view p,
        .empty-cart-state p {
          font-size: 0.88rem;
          color: #64748B;
          margin: 0 0 22px;
          max-width: 260px;
          line-height: 1.5;
        }

        .btn-pink-primary {
          background: #FF2E63 !important;
          color: #FFFFFF !important;
          border: none !important;
          padding: 13px 32px !important;
          border-radius: 50px !important;
          font-size: 0.95rem !important;
          font-weight: 800 !important;
          cursor: pointer !important;
          box-shadow: 0 8px 24px rgba(255, 46, 99, 0.4) !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          transition: transform 0.15s, box-shadow 0.15s !important;
        }

        .btn-pink-primary:hover {
          background: #E01E53 !important;
          box-shadow: 0 10px 28px rgba(255, 46, 99, 0.5) !important;
        }

        .btn-pink-primary:active {
          transform: scale(0.96) !important;
        }

        .past-orders-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .past-order-item-card {
          background: #FFFFFF;
          border-radius: 20px;
          padding: 16px;
          border: 1px solid #F1F5F9;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }

        .poi-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .poi-top strong {
          display: block;
          font-size: 0.95rem;
          color: #0F172A;
        }

        .poi-top small {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .poi-status-tag {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 50px;
          background: #ECFDF5;
          color: #059669;
        }

        .poi-items-list {
          font-size: 0.82rem;
          color: #475569;
          line-height: 1.4;
          padding: 8px 0;
          border-top: 1px dashed #F1F5F9;
          border-bottom: 1px dashed #F1F5F9;
          margin-bottom: 10px;
        }

        .poi-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .poi-bottom strong {
          font-size: 1rem;
          color: #FF2E63;
        }

        .poi-reorder-btn {
          background: #FFF0F3;
          color: #FF2E63;
          border: none;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .poi-reorder-btn:hover {
          background: #FFE2E7;
        }

        /* Account */
        .account-profile-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
        }

        .apc-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #FFF0F3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .apc-details h2 {
          font-size: 1.15rem;
          color: #0F172A;
          margin: 0 0 2px;
        }

        .apc-details p {
          font-size: 0.78rem;
          color: #64748B;
          margin: 0 0 4px;
        }

        .vip-badge {
          background: #FEF3C7;
          color: #B45309;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .account-white-card {
          background: #FFFFFF;
          border-radius: 22px;
          padding: 18px;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.02);
        }

        .awc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .awc-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .awc-title h3 {
          font-size: 0.95rem;
          margin: 0;
          color: #0F172A;
        }

        .awc-link-btn {
          background: none;
          border: none;
          color: #FF2E63;
          font-size: 0.78rem;
          font-weight: 800;
          cursor: pointer;
        }

        .awc-link-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #F1F5F9;
          text-decoration: none;
          color: #1E293B;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
        }

        .awc-link-row:last-child {
          border-bottom: none;
        }

        /* ------------------------------------------------------------- */
        /* FLOATING CART PILL */
        /* ------------------------------------------------------------- */
        .pink-floating-cart-pill {
          position: fixed;
          bottom: 74px;
          left: 20px;
          right: 20px;
          max-width: 480px;
          margin: 0 auto;
          z-index: 1050;
        }

        .pfcp-inner {
          background: #10B981;
          color: white;
          padding: 14px 20px;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 10px 28px rgba(16, 185, 129, 0.4);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .pfcp-inner:hover {
          transform: scale(1.02);
        }

        .pfcp-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pfcp-count-badge {
          background: rgba(255, 255, 255, 0.25);
          padding: 4px 10px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
        }

        .pfcp-right {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 800;
        }

        /* ------------------------------------------------------------- */
        /* 📱 BOTTOM NAVIGATION DOWNBAR */
        /* ------------------------------------------------------------- */
        .pink-bottom-downbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          max-width: 520px;
          margin: 0 auto;
          background: #FFFFFF;
          border-top: 1px solid #F1F5F9;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 10px 14px 14px;
          z-index: 1200;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.04);
        }

        .pbd-item {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          color: #94A3B8;
          cursor: pointer;
          position: relative;
          padding: 4px 10px;
          flex: 1;
          transition: color 0.2s;
        }

        .pbd-item span {
          font-size: 0.68rem;
          font-weight: 700;
        }

        .pbd-item.active {
          color: #FF2E63;
        }

        .pbd-active-dot {
          width: 4px;
          height: 4px;
          background: #FF2E63;
          border-radius: 50%;
          position: absolute;
          bottom: -4px;
        }

        .pbd-mini-badge {
          position: absolute;
          top: -2px;
          right: 14%;
          background: #FF2E63;
          color: white;
          font-size: 0.52rem;
          font-weight: 900;
          padding: 1px 4px;
          border-radius: 4px;
        }

        .pbd-live-tracker-dot {
          position: absolute;
          top: 4px;
          right: 30%;
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          border: 2px solid white;
        }

        /* ------------------------------------------------------------- */
        /* MODAL BACKDROP & SHEETS */
        /* ------------------------------------------------------------- */
        .modal-backdrop-address {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 2500;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .address-sheet-card {
          background: #FFFFFF;
          width: 100%;
          max-width: 520px;
          border-radius: 32px 32px 0 0;
          padding: 20px 24px 34px;
          box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
        }

        .sheet-notch {
          width: 44px;
          height: 5px;
          background: #E2E8F0;
          border-radius: 10px;
          margin: 0 auto 16px;
        }

        .asc-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .asc-header-row h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }

        .btn-close-asc {
          background: #F1F5F9;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .addr-tag-pills {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
        }

        .atp-btn {
          flex: 1;
          background: #FAFAFC;
          border: 1px solid #F1F5F9;
          padding: 8px;
          border-radius: 12px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
        }

        .atp-btn.active {
          background: #FF2E63;
          color: white;
          border-color: #FF2E63;
        }

        .asc-field {
          margin-bottom: 14px;
        }

        .asc-field label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
        }

        .asc-field input {
          width: 100%;
          box-sizing: border-box;
          background: #FAFAFC;
          border: 1px solid #E2E8F0;
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 0.88rem;
          color: #0F172A;
          outline: none;
        }

        .asc-field input:focus {
          border-color: #FF2E63;
          background: #FFFFFF;
        }

        .btn-save-address-pink {
          width: 100%;
          background: #FF2E63;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          margin-top: 10px;
          box-shadow: 0 8px 20px rgba(255, 46, 99, 0.35);
        }
      `}</style>
    </div>
  );
};

export default OnlineDeliveryPortal;
