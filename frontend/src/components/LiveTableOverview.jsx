import React from 'react';
import { Table, Clock, CheckCircle2, DollarSign, Plus, Printer, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveTableOverview = ({ orders = [], onSelectTable, onPrintBill }) => {
  const totalTables = 20;

  // Build table map
  const tableStatusMap = {};
  for (let i = 1; i <= totalTables; i++) {
    tableStatusMap[i.toString()] = {
      tableNumber: i.toString(),
      status: 'Free',
      order: null
    };
  }

  // Populate active non-billed orders into table map
  orders.forEach(o => {
    if (o.tableNumber && o.status !== 'Billed' && o.status !== 'Cancelled') {
      const tNum = o.tableNumber.toString();
      tableStatusMap[tNum] = {
        tableNumber: tNum,
        status: o.status || 'Pending',
        order: o
      };
    }
  });

  const tableList = Object.values(tableStatusMap);

  const activeCount = tableList.filter(t => t.status !== 'Free').length;
  const freeCount = totalTables - activeCount;

  return (
    <div className="table-overview-container">
      {/* Header & Quick Summary */}
      <div className="table-overview-header">
        <div>
          <h2>🪑 Live Table Status & Occupancy Overview</h2>
          <p>Real-time visual monitoring of all 20 Dhaba tables with active order details & bills</p>
        </div>
        <div className="table-summary-pills">
          <div className="pill-item free">
            <span className="dot free"></span>
            <span>Free Tables: <strong>{freeCount}</strong></span>
          </div>
          <div className="pill-item occupied">
            <span className="dot occupied"></span>
            <span>Occupied: <strong>{activeCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="tables-grid">
        {tableList.map(tbl => {
          const isFree = tbl.status === 'Free';
          const ord = tbl.order;

          return (
            <motion.div 
              key={tbl.tableNumber} 
              layout 
              className={`table-card ${tbl.status.toLowerCase()}`}
            >
              <div className="t-card-top">
                <div className="table-badge">
                  <Table size={16} /> Table {tbl.tableNumber}
                </div>
                <span className={`status-pill ${tbl.status.toLowerCase()}`}>
                  {tbl.status}
                </span>
              </div>

              {!isFree && ord ? (
                <div className="t-card-content">
                  <div className="ord-meta-row">
                    <span className="ord-id">#{ord.id}</span>
                    <span className="ord-total">₹{ord.netTotal || ord.total}</span>
                  </div>

                  {ord.customerMobile && (
                    <div className="ord-cust">
                      📱 {ord.customerName ? `${ord.customerName} (${ord.customerMobile})` : ord.customerMobile}
                    </div>
                  )}

                  <div className="ord-items-preview">
                    {ord.items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="preview-item">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {ord.items.length > 3 && (
                      <div className="more-items-tag">+{ord.items.length - 3} more items</div>
                    )}
                  </div>

                  <div className="t-card-actions">
                    <button className="btn-table-act add" onClick={() => onSelectTable(tbl.tableNumber, ord)}>
                      <Plus size={13} /> Add Items
                    </button>
                    <button className="btn-table-act print" onClick={() => onPrintBill(ord)}>
                      <Printer size={13} /> Bill
                    </button>
                  </div>
                </div>
              ) : (
                <div className="free-table-placeholder">
                  <span className="free-text">Table Available</span>
                  <button className="btn-new-table-order" onClick={() => onSelectTable(tbl.tableNumber, null)}>
                    <Plus size={14} /> New Order
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .table-overview-container { display: flex; flex-direction: column; gap: 20px; }
        .table-overview-header { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 15px; }
        .table-overview-header h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .table-overview-header p { color: #666; font-size: 0.9rem; }

        .table-summary-pills { display: flex; gap: 12px; }
        .pill-item { padding: 8px 16px; border-radius: 50px; display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600; }
        .pill-item.free { background: #DCFCE7; color: #166534; }
        .pill-item.occupied { background: #FEF3C7; color: #B45309; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.free { background: #22C55E; }
        .dot.occupied { background: #EAB308; }

        .tables-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
        .table-card { background: white; border-radius: 18px; padding: 16px; border: 2px solid #F0F0F0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; min-height: 180px; transition: all 0.2s; }
        .table-card.free { border-color: #E2E8F0; }
        .table-card.pending { border-color: #EAB308; background: #FEFCE8; }
        .table-card.confirmed { border-color: #3B82F6; background: #EFF6FF; }
        .table-card.ready { border-color: #22C55E; background: #F0FDF4; }

        .t-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .table-badge { font-weight: 800; font-size: 1rem; color: #1E293B; display: flex; align-items: center; gap: 6px; }
        .status-pill { font-size: 0.7rem; font-weight: 800; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; }
        .status-pill.free { background: #F1F5F9; color: #64748B; }
        .status-pill.pending { background: #FEF08A; color: #854D0E; }
        .status-pill.confirmed { background: #BFDBFE; color: #1E40AF; }
        .status-pill.ready { background: #BBF7D0; color: #166534; }

        .t-card-content { display: flex; flex-direction: column; gap: 8px; }
        .ord-meta-row { display: flex; justify-content: space-between; align-items: center; }
        .ord-id { font-size: 0.75rem; font-weight: 700; color: #475569; background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px; }
        .ord-total { font-size: 1.1rem; font-weight: 800; color: #0F172A; }
        .ord-cust { font-size: 0.75rem; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .ord-items-preview { background: rgba(255,255,255,0.7); padding: 8px; border-radius: 8px; font-size: 0.75rem; display: flex; flex-direction: column; gap: 4px; }
        .preview-item { display: flex; justify-content: space-between; color: #334155; }
        .more-items-tag { font-size: 0.65rem; color: #64748B; font-weight: 600; text-align: right; }

        .t-card-actions { display: flex; gap: 6px; margin-top: 6px; }
        .btn-table-act { flex: 1; padding: 8px; border: none; border-radius: 8px; font-weight: 700; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 4px; cursor: pointer; }
        .btn-table-act.add { background: #E8621A; color: white; }
        .btn-table-act.print { background: #334155; color: white; }

        .free-table-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px 0; }
        .free-text { font-size: 0.8rem; color: #94A3B8; font-weight: 600; }
        .btn-new-table-order { background: #F1F5F9; border: 1px dashed #CBD5E1; color: #334155; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .btn-new-table-order:hover { border-color: #E8621A; color: #E8621A; background: #FFF7ED; }
      `}</style>
    </div>
  );
};
