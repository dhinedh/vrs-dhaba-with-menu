import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Send, 
  Printer, 
  ChevronRight, 
  ShoppingBag, 
  DollarSign, 
  User, 
  Phone, 
  Box, 
  ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const STAGES = [
  { id: 'Order', title: '📋 Order Received', color: '#3B82F6', bg: '#EFF6FF' },
  { id: 'Kitchen', title: '👨‍🍳 Kitchen Preparing', color: '#EAB308', bg: '#FEFCE8' },
  { id: 'Packing', title: '📦 Packed & Ready', color: '#EC4899', bg: '#FDF2F8' },
  { id: 'Billing', title: '💳 Billing & Payment', color: '#8B5CF6', bg: '#F5F3FF' },
  { id: 'Completed', title: '✅ Completed & Picked Up', color: '#22C55E', bg: '#F0FDF4' }
];

export const TakeawayManagement = ({ orders = [], onUpdateTakeawayStatus, onPrintBill, settings = {} }) => {
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

  // Filter only takeaway / parcel orders
  const takeawayOrders = orders.filter(o => o.orderType === 'Takeaway' || o.tableNumber === 'Takeaway' || o.tokenNumber);

  // Helper stage transition
  const getNextStage = (currentStage) => {
    if (!currentStage || currentStage === 'Order' || currentStage === 'Pending') return 'Kitchen';
    if (currentStage === 'Kitchen') return 'Packing';
    if (currentStage === 'Packing') return 'Billing';
    if (currentStage === 'Billing') return 'Completed';
    return 'Completed';
  };

  const sendWhatsAppPickupAlert = (ord) => {
    const mob = ord.customerMobile || "9876543210";
    const cleanMob = mob.replace(/\D/g, '');
    const formattedMob = cleanMob.length === 10 ? `91${cleanMob}` : cleanMob;
    
    const itemsList = ord.items ? ord.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : '';
    const msg = `📦 *${settings.name || 'VRS Dhaba'} - Parcel Ready for Pickup!*\n\nDear ${ord.customerName || 'Customer'},\nYour parcel *Token #${ord.tokenNumber || ord.id}* is packed and ready for pickup! 🥳\n\nItems: ${itemsList}\nTotal Payable: *₹${ord.netTotal || ord.total}*\n\nPlease show this Token #${ord.tokenNumber || ord.id} at counter for pickup. Thank you! 🙏`;
    
    const url = `https://wa.me/${formattedMob}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Stats metrics
  const totalTakeawayRevenue = takeawayOrders.reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
  const activeParcelsCount = takeawayOrders.filter(o => (o.takeawayStatus || o.status) !== 'Completed' && o.status !== 'Billed').length;
  const completedParcelsCount = takeawayOrders.filter(o => (o.takeawayStatus || o.status) === 'Completed' || o.status === 'Billed').length;

  return (
    <div className="takeaway-container">
      {/* Header Card */}
      <div className="takeaway-header">
        <div>
          <h2>📦 Takeaway & Parcel Management Pipeline</h2>
          <p>Strict workflow: Order → Kitchen → Ready → Packing → Billing → Payment → Completed</p>
        </div>
        
        {/* KPI Stats */}
        <div className="takeaway-kpi-group">
          <div className="tk-kpi">
            <span>Takeaway Revenue</span>
            <strong>₹{totalTakeawayRevenue}</strong>
          </div>
          <div className="tk-kpi yellow">
            <span>Active Parcels</span>
            <strong>{activeParcelsCount} Orders</strong>
          </div>
          <div className="tk-kpi green">
            <span>Completed</span>
            <strong>{completedParcelsCount} Orders</strong>
          </div>
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      <div className="kanban-pipeline">
        {STAGES.map(stage => {
          const stageOrders = takeawayOrders.filter(o => {
            const currentStatus = o.takeawayStatus || (o.status === 'Billed' ? 'Completed' : (o.status === 'Ready' ? 'Packing' : 'Order'));
            return currentStatus === stage.id;
          });

          return (
            <div key={stage.id} className="kanban-col">
              <div className="kanban-col-header" style={{ borderTopColor: stage.color }}>
                <h4>{stage.title}</h4>
                <span className="col-count-badge" style={{ background: stage.bg, color: stage.color }}>
                  {stageOrders.length}
                </span>
              </div>

              <div className="kanban-cards-list">
                {stageOrders.length === 0 ? (
                  <div className="empty-kanban-slot">No orders in this stage</div>
                ) : (
                  stageOrders.map(ord => (
                    <motion.div 
                      key={ord.id} 
                      layout 
                      className="kanban-card"
                      onClick={() => setSelectedOrderForDetails(ord)}
                    >
                      <div className="card-top-bar">
                        <span className="token-badge">#{ord.tokenNumber || ord.id}</span>
                        {ord.estimatedPickupTime && (
                          <span className="time-badge">
                            <Clock size={12} /> {ord.estimatedPickupTime}
                          </span>
                        )}
                      </div>

                      <div className="cust-info">
                        <strong>{ord.customerName || 'Takeaway Customer'}</strong>
                        <small><Phone size={11} /> {ord.customerMobile || 'No Mobile'}</small>
                      </div>

                      <div className="items-summary">
                        {ord.items?.map((item, idx) => (
                          <div key={idx} className="item-line">
                            <span>{item.quantity}x {item.name}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {ord.packagingCharge > 0 && (
                        <div className="pkg-fee-row">
                          <span>📦 Container Fee</span>
                          <span>+ ₹{ord.packagingCharge}</span>
                        </div>
                      )}

                      <div className="card-bottom-row">
                        <span className="net-total">Total: ₹{ord.netTotal || ord.total}</span>
                        <span className="pay-method">{ord.paymentMethod || 'Cash'}</span>
                      </div>

                      {/* Kanban Action Bar */}
                      <div className="kanban-actions" onClick={e => e.stopPropagation()}>
                        {stage.id === 'Packing' && (
                          <button className="btn-wa-alert" onClick={() => sendWhatsAppPickupAlert(ord)}>
                            <Send size={12} /> WA Alert
                          </button>
                        )}
                        {stage.id === 'Billing' && (
                          <button className="btn-print-bill" onClick={() => onPrintBill(ord)}>
                            <Printer size={12} /> Print Bill
                          </button>
                        )}
                        {stage.id !== 'Completed' && (
                          <button 
                            className="btn-next-stage" 
                            style={{ background: stage.color }}
                            onClick={() => onUpdateTakeawayStatus(ord.id, getNextStage(stage.id))}
                          >
                            Advance <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .takeaway-container { display: flex; flex-direction: column; gap: 20px; }
        .takeaway-header { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; }
        .takeaway-header h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .takeaway-header p { color: #666; font-size: 0.9rem; }

        .takeaway-kpi-group { display: flex; gap: 12px; }
        .tk-kpi { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 18px; border-radius: 14px; display: flex; flex-direction: column; }
        .tk-kpi span { font-size: 0.7rem; color: #64748B; text-transform: uppercase; font-weight: 700; }
        .tk-kpi strong { font-size: 1.2rem; color: #0F172A; font-weight: 800; }
        .tk-kpi.yellow { background: #FEFCE8; border-color: #FEF08A; }
        .tk-kpi.yellow strong { color: #854D0E; }
        .tk-kpi.green { background: #F0FDF4; border-color: #DCFCE7; }
        .tk-kpi.green strong { color: #166534; }

        .kanban-pipeline { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; overflow-x: auto; padding-bottom: 10px; }
        .kanban-col { background: #F8FAFC; border-radius: 18px; border: 1px solid #E2E8F0; padding: 16px; display: flex; flex-direction: column; min-height: 500px; }
        .kanban-col-header { display: flex; justify-content: space-between; align-items: center; border-top: 4px solid #CBD5E1; padding-top: 10px; margin-bottom: 14px; border-radius: 4px 4px 0 0; }
        .kanban-col-header h4 { font-size: 0.95rem; color: #1E293B; font-weight: 800; }
        .col-count-badge { font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 50px; }

        .kanban-cards-list { display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .empty-kanban-slot { color: #94A3B8; font-size: 0.8rem; text-align: center; padding: 30px 10px; border: 2px dashed #E2E8F0; border-radius: 12px; }

        .kanban-card { background: white; border-radius: 14px; padding: 14px; border: 1px solid #E2E8F0; box-shadow: 0 2px 8px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 10px; cursor: pointer; transition: all 0.2s; }
        .kanban-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); border-color: #E8621A; }

        .card-top-bar { display: flex; justify-content: space-between; align-items: center; }
        .token-badge { background: #1E293B; color: white; font-weight: 900; font-size: 0.8rem; padding: 3px 8px; border-radius: 6px; }
        .time-badge { background: #FFF7ED; color: #C2410C; font-size: 0.7rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: flex; align-items: center; gap: 4px; }

        .cust-info { display: flex; flex-direction: column; }
        .cust-info strong { font-size: 0.9rem; color: #1E293B; }
        .cust-info small { color: #64748B; font-size: 0.75rem; display: flex; align-items: center; gap: 4px; }

        .items-summary { background: #F8FAFC; padding: 8px; border-radius: 8px; font-size: 0.75rem; display: flex; flex-direction: column; gap: 3px; }
        .item-line { display: flex; justify-content: space-between; color: #334155; }
        .pkg-fee-row { display: flex; justify-content: space-between; font-size: 0.7rem; color: #E8621A; font-weight: 700; }

        .card-bottom-row { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 800; color: #0F172A; border-top: 1px solid #F1F5F9; padding-top: 6px; }
        .pay-method { font-size: 0.75rem; color: #64748B; font-weight: 600; }

        .kanban-actions { display: flex; gap: 6px; margin-top: 4px; }
        .kanban-actions button { flex: 1; padding: 6px; border: none; border-radius: 6px; font-weight: 700; font-size: 0.7rem; color: white; display: flex; align-items: center; justify-content: center; gap: 4px; cursor: pointer; }
        .btn-wa-alert { background: #25D366; }
        .btn-print-bill { background: #475569; }
        .btn-next-stage { color: white; }
      `}</style>
    </div>
  );
};
