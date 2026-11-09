import React, { useState } from 'react';
import { Table, Clock, CheckCircle2, DollarSign, Plus, Printer, Eye, ArrowRightLeft, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const LiveTableOverview = ({ orders = [], onSelectTable, onPrintBill, onTransferTable }) => {
  const totalTables = 20;
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'FREE' | 'OCCUPIED'
  const [searchTable, setSearchTable] = useState('');

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
      const cleanNum = String(o.tableNumber || '').replace(/^[T\s\-]+/, '').trim();
      if (cleanNum && tableStatusMap[cleanNum]) {
        tableStatusMap[cleanNum] = {
          tableNumber: cleanNum,
          status: o.status || 'Pending',
          order: o
        };
      }
    }
  });

  const tableList = Object.values(tableStatusMap);
  const activeCount = tableList.filter(t => t.status !== 'Free').length;
  const freeCount = totalTables - activeCount;

  const filteredTables = tableList.filter(t => {
    if (searchTable && !t.tableNumber.includes(searchTable.trim())) return false;
    if (filterMode === 'FREE') return t.status === 'Free';
    if (filterMode === 'OCCUPIED') return t.status !== 'Free';
    return true;
  });

  const handleTransfer = (currentTable) => {
    const target = prompt(`Transfer active order from Table ${currentTable} to another Table (1-${totalTables}):`);
    if (!target) return;
    const cleanTarget = target.replace(/^[T\s\-]+/, '').trim();
    if (!cleanTarget || isNaN(cleanTarget) || Number(cleanTarget) < 1 || Number(cleanTarget) > totalTables) {
      alert(`Invalid table number! Please enter a number between 1 and ${totalTables}.`);
      return;
    }
    if (cleanTarget === String(currentTable)) {
      alert("Source and destination table are the same!");
      return;
    }
    if (tableStatusMap[cleanTarget] && tableStatusMap[cleanTarget].status !== 'Free') {
      const confirmShift = confirm(`Table ${cleanTarget} is currently Occupied. Do you want to merge/transfer order to it?`);
      if (!confirmShift) return;
    }

    if (onTransferTable) {
      onTransferTable(currentTable, cleanTarget);
      alert(`✅ Order transferred successfully from Table ${currentTable} to Table ${cleanTarget}!`);
    }
  };

  return (
    <div className="table-overview-container">
      {/* Header & Quick Summary */}
      <div className="table-overview-header">
        <div>
          <h2>🪑 03. Table Management & Live Layout</h2>
          <p>Real-time visual monitoring, table layouts & instant order transfer across all 20 Dhaba tables</p>
        </div>
        <div className="table-summary-pills">
          <button 
            type="button"
            className={`pill-item ${filterMode === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterMode('ALL')}
          >
            <span>All Tables: <strong>{totalTables}</strong></span>
          </button>
          <button 
            type="button"
            className={`pill-item free ${filterMode === 'FREE' ? 'active' : ''}`}
            onClick={() => setFilterMode('FREE')}
          >
            <span className="dot free"></span>
            <span>Available: <strong>{freeCount}</strong></span>
          </button>
          <button 
            type="button"
            className={`pill-item occupied ${filterMode === 'OCCUPIED' ? 'active' : ''}`}
            onClick={() => setFilterMode('OCCUPIED')}
          >
            <span className="dot occupied"></span>
            <span>Occupied: <strong>{activeCount}</strong></span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="table-search-bar-row">
        <div className="tsb-input-wrapper">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Quick search table number (e.g. 5)..."
            value={searchTable}
            onChange={e => setSearchTable(e.target.value)}
          />
        </div>
        <span className="tsb-count-text">
          Showing {filteredTables.length} of {totalTables} tables
        </span>
      </div>

      {/* Tables Grid */}
      <div className="tables-grid">
        {filteredTables.map(tbl => {
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
                    <button 
                      type="button" 
                      className="btn-table-act add" 
                      onClick={() => onSelectTable(tbl.tableNumber, ord)}
                      title="Add items to table"
                    >
                      <Plus size={13} /> Add
                    </button>
                    <button 
                      type="button" 
                      className="btn-table-act transfer" 
                      onClick={() => handleTransfer(tbl.tableNumber)}
                      title="Transfer table order"
                    >
                      <ArrowRightLeft size={13} /> Transfer
                    </button>
                    <button 
                      type="button" 
                      className="btn-table-act print" 
                      onClick={() => onPrintBill(ord)}
                      title="Generate bill"
                    >
                      <Printer size={13} /> Bill
                    </button>
                  </div>
                </div>
              ) : (
                <div className="free-table-placeholder">
                  <span className="free-text">Table Available</span>
                  <button 
                    type="button" 
                    className="btn-new-table-order" 
                    onClick={() => onSelectTable(tbl.tableNumber, null)}
                  >
                    <Plus size={14} /> New Order
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .table-overview-container { display: flex; flex-direction: column; gap: 16px; }
        .table-overview-header { background: white; padding: 20px 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 15px; }
        .table-overview-header h2 { font-size: 1.35rem; color: #0F172A; margin: 0 0 4px 0; font-weight: 800; }
        .table-overview-header p { color: #64748B; font-size: 0.85rem; margin: 0; }

        .table-summary-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .pill-item { 
          padding: 8px 14px; 
          border-radius: 50px; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          font-size: 0.8rem; 
          font-weight: 700; 
          background: #F8FAFC; 
          border: 1px solid #E2E8F0; 
          color: #334155; 
          cursor: pointer; 
          transition: all 0.15s; 
        }
        .pill-item.active { border-color: #EA580C; color: #EA580C; background: #FFF7ED; }
        .pill-item.free { background: #DCFCE7; color: #166534; border-color: #BBF7D0; }
        .pill-item.free.active { box-shadow: 0 0 0 2px #22C55E; }
        .pill-item.occupied { background: #FEF3C7; color: #B45309; border-color: #FDE68A; }
        .pill-item.occupied.active { box-shadow: 0 0 0 2px #EAB308; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.free { background: #22C55E; }
        .dot.occupied { background: #EAB308; }

        .table-search-bar-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .tsb-input-wrapper { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid #E2E8F0; border-radius: 12px; padding: 8px 14px; flex: 1; max-width: 340px; }
        .tsb-input-wrapper input { border: none; outline: none; font-size: 0.85rem; width: 100%; font-weight: 600; color: #0F172A; }
        .tsb-count-text { font-size: 0.8rem; color: #64748B; font-weight: 600; }

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

        .t-card-actions { display: flex; gap: 5px; margin-top: 6px; }
        .btn-table-act { flex: 1; padding: 8px 4px; border: none; border-radius: 8px; font-weight: 700; font-size: 0.72rem; display: flex; align-items: center; justify-content: center; gap: 3px; cursor: pointer; transition: opacity 0.15s; }
        .btn-table-act:hover { opacity: 0.9; }
        .btn-table-act.add { background: #EA580C; color: white; }
        .btn-table-act.transfer { background: #0284C7; color: white; }
        .btn-table-act.print { background: #334155; color: white; }

        .free-table-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px 0; }
        .free-text { font-size: 0.8rem; color: #94A3B8; font-weight: 600; }
        .btn-new-table-order { background: #F1F5F9; border: 1px dashed #CBD5E1; color: #334155; padding: 8px 16px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .btn-new-table-order:hover { border-color: #EA580C; color: #EA580C; background: #FFF7ED; }
      `}</style>
    </div>
  );
};
