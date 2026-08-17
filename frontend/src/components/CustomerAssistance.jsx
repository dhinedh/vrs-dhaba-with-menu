import React from 'react';
import { Bell, FileText, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomerAssistance = ({ requests = [], onResolveRequest, onClearAll }) => {
  const pendingRequests = requests.filter(r => r.status !== 'Resolved');
  const resolvedRequests = requests.filter(r => r.status === 'Resolved');

  return (
    <div className="assistance-container">
      {/* Header */}
      <div className="assistance-header">
        <div>
          <h2>🔔 Live Customer Assistance & Waiter Call Center</h2>
          <p>Real-time notifications when dining customers press "Call Waiter" or "Request Bill" from Table QR</p>
        </div>
        {requests.length > 0 && (
          <button className="btn-clear-all" onClick={onClearAll}>
            <Trash2 size={16} /> Clear Resolved
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="ast-stats-grid">
        <div className="ast-stat yellow">
          <Bell size={24} />
          <div>
            <span>Active Pending Calls</span>
            <h3>{pendingRequests.length}</h3>
          </div>
        </div>

        <div className="ast-stat green">
          <CheckCircle2 size={24} />
          <div>
            <span>Attended / Resolved Today</span>
            <h3>{resolvedRequests.length}</h3>
          </div>
        </div>
      </div>

      {/* Pending Calls List */}
      <div className="ast-section">
        <h3>Pending Service Calls ({pendingRequests.length})</h3>
        {pendingRequests.length === 0 ? (
          <div className="empty-ast-box">
            <Bell size={40} color="#CBD5E1" />
            <p>No active waiter calls or bill requests right now!</p>
          </div>
        ) : (
          <div className="ast-cards-grid">
            {pendingRequests.map(req => (
              <motion.div key={req.id} layout className={`ast-card ${req.type.toLowerCase()}`}>
                <div className="ast-card-top">
                  <span className="tbl-pill">TABLE {req.tableNumber}</span>
                  <span className="time-lbl"><Clock size={12} /> {new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="ast-msg">
                  {req.type === 'CALL_WAITER' ? (
                    <><Bell size={20} color="#EAB308" /> <strong>Call Waiter Requested</strong></>
                  ) : (
                    <><FileText size={20} color="#3B82F6" /> <strong>Request Bill Requested</strong></>
                  )}
                </div>

                <button className="btn-resolve" onClick={() => onResolveRequest(req.id)}>
                  <CheckCircle2 size={16} /> Mark Attended / Done
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved History */}
      {resolvedRequests.length > 0 && (
        <div className="ast-section resolved-sec">
          <h3>Attended Calls History ({resolvedRequests.length})</h3>
          <div className="resolved-list">
            {resolvedRequests.map(req => (
              <div key={req.id} className="resolved-item">
                <span>Table {req.tableNumber} - {req.type === 'CALL_WAITER' ? 'Call Waiter' : 'Request Bill'}</span>
                <span className="r-time">Resolved at {new Date(req.resolvedAt || req.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .assistance-container { display: flex; flex-direction: column; gap: 20px; }
        .assistance-header { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; }
        .assistance-header h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .assistance-header p { color: #666; font-size: 0.9rem; }

        .btn-clear-all { background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; padding: 8px 16px; border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; }

        .ast-stats-grid { display: flex; gap: 16px; }
        .ast-stat { background: white; border: 1px solid #F0F0F0; border-radius: 18px; padding: 20px; display: flex; align-items: center; gap: 14px; min-width: 220px; }
        .ast-stat.yellow { background: #FEFCE8; border-color: #FEF08A; color: #854D0E; }
        .ast-stat.green { background: #F0FDF4; border-color: #DCFCE7; color: #166534; }
        .ast-stat span { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; opacity: 0.8; }
        .ast-stat h3 { font-size: 1.8rem; font-weight: 900; margin-top: 2px; }

        .ast-section { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; }
        .ast-section h3 { font-size: 1.1rem; color: #1E293B; margin-bottom: 16px; }

        .empty-ast-box { text-align: center; color: #94A3B8; padding: 40px; display: flex; flex-direction: column; align-items: center; gap: 10px; }

        .ast-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .ast-card { background: #FFF; border: 2px solid #E2E8F0; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .ast-card.call_waiter { border-color: #EAB308; background: #FEFCE8; }
        .ast-card.request_bill { border-color: #3B82F6; background: #EFF6FF; }

        .ast-card-top { display: flex; justify-content: space-between; align-items: center; }
        .tbl-pill { background: #1E293B; color: white; font-weight: 900; font-size: 0.8rem; padding: 3px 10px; border-radius: 6px; }
        .time-lbl { font-size: 0.7rem; color: #64748B; font-weight: 600; display: flex; align-items: center; gap: 4px; }

        .ast-msg { display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #0F172A; }
        .btn-resolve { background: #22C55E; color: white; border: none; padding: 10px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }

        .resolved-sec { opacity: 0.8; }
        .resolved-list { display: flex; flex-direction: column; gap: 8px; }
        .resolved-item { display: flex; justify-content: space-between; background: #F8FAFC; padding: 10px 14px; border-radius: 8px; font-size: 0.85rem; color: #475569; }
        .r-time { font-size: 0.75rem; color: #94A3B8; }
      `}</style>
    </div>
  );
};
