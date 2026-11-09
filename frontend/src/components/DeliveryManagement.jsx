import React, { useState } from 'react';
import { 
  Bike, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Printer, 
  Send, 
  Search, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  DollarSign, 
  Package, 
  ArrowRight,
  Filter,
  RefreshCw,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DELIVERY_STAGES = [
  { id: 'Confirmed', label: '📥 New Orders', color: '#3B82F6', bg: '#EFF6FF', desc: 'Accepted & pending prep' },
  { id: 'Kitchen', label: '👨‍🍳 Kitchen Preparing', color: '#EAB308', bg: '#FEFCE8', desc: 'Cooking in dhaba kitchen' },
  { id: 'Dispatched', label: '🛵 Out for Delivery', color: '#EC4899', bg: '#FDF2F8', desc: 'Rider on the road' },
  { id: 'Delivered', label: '✅ Delivered & Closed', color: '#22C55E', bg: '#F0FDF4', desc: 'Delivered to customer' }
];

const PRESET_RIDERS = [
  { name: "Karthik R.", phone: "9845213456", vehicle: "Hero Splendor (TN-30-AZ-4421)" },
  { name: "Murugan S.", phone: "9786123450", vehicle: "Honda Activa (TN-30-BK-7890)" },
  { name: "Suresh Kumar", phone: "9443210987", vehicle: "Bajaj Pulsar (TN-30-CD-1122)" },
  { name: "In-House Delivery Staff", phone: "9876543210", vehicle: "Shop Bike" }
];

export const DeliveryManagement = ({
  orders = [],
  onUpdateDeliveryStatus,
  onAssignRider,
  onPrintDeliveryBill,
  settings = {}
}) => {
  const [activeStageFilter, setActiveStageFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Rider assignment modal
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [selectedRiderName, setSelectedRiderName] = useState(PRESET_RIDERS[0].name);
  const [customRiderPhone, setCustomRiderPhone] = useState(PRESET_RIDERS[0].phone);
  const [customVehicle, setCustomVehicle] = useState(PRESET_RIDERS[0].vehicle);

  // Filter only delivery orders
  const deliveryOrders = orders.filter(o => 
    o.orderType === 'Delivery' || 
    o.tableNumber === 'Delivery' || 
    (o.deliveryAddress && Object.keys(o.deliveryAddress).length > 0)
  );

  // Filtered list
  const filteredOrders = deliveryOrders.filter(ord => {
    const status = ord.deliveryStatus || ord.status || "Confirmed";
    if (activeStageFilter !== "ALL") {
      if (activeStageFilter === "Dispatched" && status !== "Dispatched" && status !== "OutForDelivery") return false;
      if (activeStageFilter === "Delivered" && status !== "Delivered" && status !== "Completed" && status !== "Billed") return false;
      if (activeStageFilter === "Kitchen" && status !== "Kitchen") return false;
      if (activeStageFilter === "Confirmed" && status !== "Confirmed" && status !== "Pending") return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = ord.id?.toLowerCase().includes(q);
      const matchCust = ord.customerName?.toLowerCase().includes(q) || ord.customerMobile?.includes(q);
      const matchRider = ord.deliveryPartner?.name?.toLowerCase().includes(q);
      const matchArea = ord.deliveryAddress?.streetArea?.toLowerCase().includes(q);
      return matchId || matchCust || matchRider || matchArea;
    }
    return true;
  });

  // KPI Metrics
  const totalDeliveryRevenue = deliveryOrders.reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
  const activeDeliveriesCount = deliveryOrders.filter(o => {
    const s = o.deliveryStatus || o.status;
    return s !== 'Delivered' && s !== 'Completed' && s !== 'Billed';
  }).length;
  const onTheRoadCount = deliveryOrders.filter(o => (o.deliveryStatus || o.status) === 'Dispatched' || (o.deliveryStatus || o.status) === 'OutForDelivery').length;
  const deliveredTodayCount = deliveryOrders.filter(o => (o.deliveryStatus || o.status) === 'Delivered' || (o.deliveryStatus || o.status) === 'Completed' || (o.deliveryStatus || o.status) === 'Billed').length;

  // Status transitions
  const handleNextStatus = (ord) => {
    const current = ord.deliveryStatus || ord.status || "Confirmed";
    let next = "Kitchen";
    if (current === "Confirmed" || current === "Pending") next = "Kitchen";
    else if (current === "Kitchen") {
      // Prompt rider assignment before dispatching
      setAssigningOrder(ord);
      return;
    } else if (current === "Dispatched" || current === "OutForDelivery") {
      next = "Delivered";
    }

    if (onUpdateDeliveryStatus) {
      onUpdateDeliveryStatus(ord.id, next);
    }
  };

  // Confirm rider assignment and dispatch
  const handleConfirmDispatch = () => {
    if (!assigningOrder) return;
    const partner = {
      name: selectedRiderName,
      phone: customRiderPhone,
      vehicle: customVehicle,
      rating: 4.9
    };

    if (onAssignRider) {
      onAssignRider(assigningOrder.id, partner);
    }
    if (onUpdateDeliveryStatus) {
      onUpdateDeliveryStatus(assigningOrder.id, "Dispatched");
    }

    // Auto trigger WhatsApp dispatch notification to customer
    sendWhatsAppDispatchAlert(assigningOrder, partner);

    setAssigningOrder(null);
  };

  // WhatsApp Alert for Customer
  const sendWhatsAppDispatchAlert = (ord, partner) => {
    const mob = ord.customerMobile || "9876543210";
    const cleanMob = mob.replace(/\D/g, '');
    const formattedMob = cleanMob.length === 10 ? `91${cleanMob}` : cleanMob;

    const riderName = partner?.name || ord.deliveryPartner?.name || "Our Delivery Rider";
    const riderPhone = partner?.phone || ord.deliveryPartner?.phone || "";
    const itemsList = ord.items ? ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : '';

    const msg = `🛵 *${settings.name || 'VRS Dhaba'} - Order Out for Delivery!*\n\nDear ${ord.customerName || 'Customer'},\nYour hot dhaba order *#${ord.id}* is on the way! 🥳\n\n🛵 *Delivery Partner:* ${riderName} (${riderPhone})\n📍 *Delivering to:* ${ord.deliveryAddress?.houseNo || ''}, ${ord.deliveryAddress?.streetArea || ''}\n🥘 *Items:* ${itemsList}\n💰 *Amount to Pay:* ₹${ord.netTotal || ord.total} (${ord.paymentMethod || 'Cash'})\n\nThank you for choosing VRS Dhaba! Enjoy your meal! 🙏`;

    const url = `https://wa.me/${formattedMob}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="delivery-mgmt-root">
      {/* Top Banner & KPIs */}
      <div className="delivery-top-header">
        <div className="dth-left">
          <h2>🛵 Online Home Delivery Dispatch & Logistics</h2>
          <p>Real-time delivery management like Swiggy / Zomato merchant console</p>
        </div>

        {/* KPI stat counters */}
        <div className="dth-kpi-row">
          <div className="dth-kpi blue">
            <span>Delivery Revenue</span>
            <strong>₹{totalDeliveryRevenue}</strong>
          </div>
          <div className="dth-kpi yellow">
            <span>Active Pipeline</span>
            <strong>{activeDeliveriesCount} Orders</strong>
          </div>
          <div className="dth-kpi purple">
            <span>On The Road</span>
            <strong>{onTheRoadCount} Riders</strong>
          </div>
          <div className="dth-kpi green">
            <span>Delivered Today</span>
            <strong>{deliveredTodayCount} Orders</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="delivery-controls-bar">
        <div className="stage-filter-pills">
          <button 
            className={`s-pill ${activeStageFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveStageFilter('ALL')}
          >
            All Delivery ({deliveryOrders.length})
          </button>
          {DELIVERY_STAGES.map(stage => {
            const count = deliveryOrders.filter(o => {
              const s = o.deliveryStatus || o.status || "Confirmed";
              if (stage.id === "Dispatched") return s === "Dispatched" || s === "OutForDelivery";
              if (stage.id === "Delivered") return s === "Delivered" || s === "Completed" || s === "Billed";
              return s === stage.id;
            }).length;

            return (
              <button 
                key={stage.id}
                className={`s-pill ${activeStageFilter === stage.id ? 'active' : ''}`}
                onClick={() => setActiveStageFilter(stage.id)}
              >
                <span>{stage.label}</span>
                <span className="count-dot" style={{ background: stage.color }}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="delivery-search-box">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Mobile, Customer, Rider, Area..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn-clear" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>
      </div>

      {/* Orders Grid / Cards */}
      <div className="delivery-cards-grid">
        {filteredOrders.length === 0 ? (
          <div className="no-delivery-orders">
            <Bike size={54} color="#CBD5E1" />
            <h3>No delivery orders found</h3>
            <p>Any incoming online orders placed via the delivery portal will appear here in real time.</p>
          </div>
        ) : (
          filteredOrders.map(ord => {
            const currentStatus = ord.deliveryStatus || ord.status || "Confirmed";
            const isDispatched = currentStatus === "Dispatched" || currentStatus === "OutForDelivery";
            const isDelivered = currentStatus === "Delivered" || currentStatus === "Completed" || currentStatus === "Billed";
            const isKitchen = currentStatus === "Kitchen";
            const isNew = currentStatus === "Confirmed" || currentStatus === "Pending";

            return (
              <div 
                key={ord.id} 
                className={`delivery-order-card ${currentStatus.toLowerCase()}`}
              >
                {/* Header row */}
                <div className="doc-top-bar">
                  <div className="doc-id-group">
                    <span className="doc-order-id">#{ord.id}</span>
                    <span className="doc-token-tag">{ord.tokenNumber || "ONLINE"}</span>
                  </div>

                  <span className={`doc-status-badge ${currentStatus.toLowerCase()}`}>
                    {currentStatus === "Dispatched" ? "🛵 On Road" : currentStatus}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="doc-customer-section">
                  <div className="cust-main-name">
                    <strong>{ord.customerName || "Customer"}</strong>
                    <a href={`tel:${ord.customerMobile}`} className="cust-phone-link">
                      <Phone size={12} />
                      <span>{ord.customerMobile}</span>
                    </a>
                  </div>

                  <div className="cust-delivery-address">
                    <MapPin size={14} className="pin-svg" />
                    <span>
                      {ord.deliveryAddress?.houseNo ? `${ord.deliveryAddress.houseNo}, ` : ""}
                      {ord.deliveryAddress?.streetArea || "Delivery Address"}
                      {ord.deliveryAddress?.landmark ? ` (Near: ${ord.deliveryAddress.landmark})` : ""}
                    </span>
                  </div>

                  {ord.deliveryInstructions && (
                    <div className="doc-instructions-note">
                      📝 {ord.deliveryInstructions}
                    </div>
                  )}
                </div>

                {/* Items Summary */}
                <div className="doc-items-box">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="doc-item-line">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Bill & Payment */}
                <div className="doc-bill-row">
                  <div className="payment-mode-pill">
                    {ord.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '📱 Paid via UPI'}
                  </div>
                  <strong className="doc-net-total">Total: ₹{ord.netTotal || ord.total}</strong>
                </div>

                {/* Assigned Rider Info */}
                {ord.deliveryPartner && (
                  <div className="doc-rider-info-pill">
                    <Bike size={14} color="#EA580C" />
                    <div className="rider-mini-text">
                      <strong>Rider: {ord.deliveryPartner.name}</strong>
                      <small>📞 {ord.deliveryPartner.phone} • {ord.deliveryPartner.vehicle || ""}</small>
                    </div>
                  </div>
                )}

                {/* Action Controls */}
                <div className="doc-actions-row">
                  {isNew && (
                    <button 
                      className="btn-action-primary kitchen-btn"
                      onClick={() => handleNextStatus(ord)}
                    >
                      <span>Send to Kitchen</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {isKitchen && (
                    <button 
                      className="btn-action-primary assign-btn"
                      onClick={() => handleNextStatus(ord)}
                    >
                      <Bike size={14} />
                      <span>Assign Rider & Dispatch</span>
                    </button>
                  )}

                  {isDispatched && (
                    <button 
                      className="btn-action-primary delivered-btn"
                      onClick={() => handleNextStatus(ord)}
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark Delivered</span>
                    </button>
                  )}

                  <button 
                    className="btn-action-icon wa-btn"
                    onClick={() => sendWhatsAppDispatchAlert(ord, ord.deliveryPartner)}
                    title="Send WhatsApp update to customer"
                  >
                    <Send size={14} />
                  </button>

                  {onPrintDeliveryBill && (
                    <button 
                      className="btn-action-icon print-btn"
                      onClick={() => onPrintDeliveryBill(ord)}
                      title="Print Delivery Rider Receipt & Address Slip"
                    >
                      <Printer size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Assign Rider Modal */}
      <AnimatePresence>
        {assigningOrder && (
          <div className="assign-modal-backdrop" onClick={() => setAssigningOrder(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="assign-modal-card" 
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-top">
                <Bike size={32} color="#EA580C" />
                <h3>Assign Delivery Rider & Dispatch</h3>
                <p>Order #{assigningOrder.id} • To: {assigningOrder.customerName} ({assigningOrder.customerMobile})</p>
              </div>

              <div className="modal-content-fields">
                <label>Select In-House or Fleet Rider:</label>
                <div className="preset-riders-list">
                  {PRESET_RIDERS.map(r => (
                    <div 
                      key={r.name}
                      className={`preset-rider-pill ${selectedRiderName === r.name ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedRiderName(r.name);
                        setCustomRiderPhone(r.phone);
                        setCustomVehicle(r.vehicle);
                      }}
                    >
                      <strong>{r.name}</strong>
                      <small>📞 {r.phone} • {r.vehicle}</small>
                    </div>
                  ))}
                </div>

                <div className="custom-fields-group">
                  <label>Rider Name</label>
                  <input 
                    type="text" 
                    value={selectedRiderName} 
                    onChange={e => setSelectedRiderName(e.target.value)} 
                  />

                  <label>Rider Mobile</label>
                  <input 
                    type="tel" 
                    value={customRiderPhone} 
                    onChange={e => setCustomRiderPhone(e.target.value)} 
                  />

                  <label>Vehicle / Bike</label>
                  <input 
                    type="text" 
                    value={customVehicle} 
                    onChange={e => setCustomVehicle(e.target.value)} 
                  />
                </div>

                <div className="modal-actions-group">
                  <button className="btn-cancel" onClick={() => setAssigningOrder(null)}>
                    Cancel
                  </button>
                  <button className="btn-confirm-dispatch" onClick={handleConfirmDispatch}>
                    Confirm & Dispatch Order 🛵
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scoped Styles */}
      <style>{`
        .delivery-mgmt-root {
          padding-bottom: 60px;
        }

        .delivery-top-header {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 20px 24px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .dth-left h2 {
          font-size: 1.35rem;
          color: #0F172A;
          margin-bottom: 4px;
        }

        .dth-left p {
          color: #64748B;
          font-size: 0.85rem;
        }

        .dth-kpi-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .dth-kpi {
          padding: 10px 16px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          min-width: 120px;
          border: 1px solid transparent;
        }

        .dth-kpi span {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .dth-kpi strong {
          font-size: 1.15rem;
        }

        .dth-kpi.blue { background: #EFF6FF; border-color: #BFDBFE; color: #1E40AF; }
        .dth-kpi.yellow { background: #FEFCE8; border-color: #FEF08A; color: #854D0E; }
        .dth-kpi.purple { background: #FDF2F8; border-color: #FBCFE8; color: #9D174D; }
        .dth-kpi.green { background: #F0FDF4; border-color: #BBF7D0; color: #166534; }

        /* Controls bar */
        .delivery-controls-bar {
          background: #FFFFFF;
          border-radius: 16px;
          padding: 14px 18px;
          border: 1px solid #E2E8F0;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .stage-filter-pills {
          display: flex;
          gap: 8px;
          overflow-x: auto;
        }

        .s-pill {
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #475569;
          padding: 8px 14px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .s-pill.active {
          background: #1E293B;
          color: white;
          border-color: #1E293B;
        }

        .count-dot {
          color: white;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 50px;
          font-weight: 800;
        }

        .delivery-search-box {
          position: relative;
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          padding: 0 12px;
          flex: 1;
          max-width: 380px;
        }

        .delivery-search-box input {
          border: none;
          background: transparent;
          padding: 10px;
          font-size: 0.85rem;
          outline: none;
          width: 100%;
        }

        .btn-clear {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        /* Cards Grid */
        .delivery-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 18px;
        }

        .delivery-order-card {
          background: #FFFFFF;
          border-radius: 18px;
          padding: 18px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-left: 6px solid #CBD5E1;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .delivery-order-card.confirmed, .delivery-order-card.pending {
          border-left-color: #3B82F6;
        }

        .delivery-order-card.kitchen {
          border-left-color: #EAB308;
        }

        .delivery-order-card.dispatched, .delivery-order-card.outfordelivery {
          border-left-color: #EC4899;
        }

        .delivery-order-card.delivered, .delivery-order-card.completed {
          border-left-color: #22C55E;
        }

        .doc-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .doc-id-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .doc-order-id {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0F172A;
        }

        .doc-token-tag {
          background: #F1F5F9;
          color: #475569;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .doc-status-badge {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 50px;
          text-transform: uppercase;
        }

        .doc-status-badge.confirmed, .doc-status-badge.pending {
          background: #EFF6FF;
          color: #1E40AF;
        }

        .doc-status-badge.kitchen {
          background: #FEFCE8;
          color: #854D0E;
        }

        .doc-status-badge.dispatched, .doc-status-badge.outfordelivery {
          background: #FDF2F8;
          color: #9D174D;
        }

        .doc-status-badge.delivered, .doc-status-badge.completed {
          background: #F0FDF4;
          color: #166534;
        }

        .doc-customer-section {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 10px 12px;
          border: 1px solid #F1F5F9;
        }

        .cust-main-name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .cust-main-name strong {
          font-size: 0.9rem;
          color: #1E293B;
        }

        .cust-phone-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #059669;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
        }

        .cust-delivery-address {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 0.8rem;
          color: #475569;
          line-height: 1.3;
        }

        .pin-svg {
          color: #EA580C;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .doc-instructions-note {
          font-size: 0.72rem;
          color: #C2410C;
          background: #FFF7ED;
          padding: 4px 8px;
          border-radius: 6px;
          margin-top: 6px;
        }

        .doc-items-box {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.82rem;
          color: #334155;
          padding: 4px 0;
          border-top: 1px solid #F1F5F9;
          border-bottom: 1px solid #F1F5F9;
        }

        .doc-item-line {
          display: flex;
          justify-content: space-between;
        }

        .doc-bill-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .payment-mode-pill {
          font-size: 0.75rem;
          color: #64748B;
          background: #F1F5F9;
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
        }

        .doc-net-total {
          font-size: 1.05rem;
          color: #0F172A;
        }

        .doc-rider-info-pill {
          background: #FFF7ED;
          border: 1px solid #FFEDD5;
          padding: 8px 12px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rider-mini-text strong {
          display: block;
          font-size: 0.82rem;
          color: #9A3412;
        }

        .rider-mini-text small {
          font-size: 0.7rem;
          color: #C2410C;
        }

        .doc-actions-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }

        .btn-action-primary {
          flex: 1;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: transform 0.15s;
        }

        .btn-action-primary:hover {
          transform: translateY(-1px);
        }

        .kitchen-btn { background: #EAB308; }
        .assign-btn { background: #EC4899; }
        .delivered-btn { background: #22C55E; }

        .btn-action-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: #FFFFFF;
        }

        .wa-btn {
          color: #25D366;
          border-color: #86EFAC;
          background: #F0FDF4;
        }

        .print-btn {
          color: #475569;
        }

        /* Modal */
        .assign-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.55);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .assign-modal-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }

        .modal-top {
          text-align: center;
          margin-bottom: 20px;
        }

        .modal-top h3 {
          font-size: 1.25rem;
          margin: 6px 0 2px;
          color: #0F172A;
        }

        .modal-top p {
          color: #64748B;
          font-size: 0.82rem;
        }

        .preset-riders-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 10px 0 16px;
        }

        .preset-rider-pill {
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          cursor: pointer;
        }

        .preset-rider-pill.selected {
          border-color: #EA580C;
          background: #FFF7ED;
        }

        .preset-rider-pill strong {
          display: block;
          font-size: 0.88rem;
          color: #0F172A;
        }

        .preset-rider-pill small {
          font-size: 0.75rem;
          color: #64748B;
        }

        .custom-fields-group label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
          display: block;
          margin: 8px 0 3px;
        }

        .custom-fields-group input {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #CBD5E1;
          font-size: 0.85rem;
        }

        .modal-actions-group {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #CBD5E1;
          background: white;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-confirm-dispatch {
          flex: 2;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #EA580C;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .no-delivery-orders {
          grid-column: 1 / -1;
          background: white;
          padding: 50px 20px;
          text-align: center;
          border-radius: 20px;
          border: 1px dashed #CBD5E1;
        }

        .no-delivery-orders h3 {
          margin: 10px 0 4px;
          color: #1E293B;
        }

        .no-delivery-orders p {
          color: #64748B;
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

