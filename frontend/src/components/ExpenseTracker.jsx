import React, { useState } from 'react';
import { Wallet, Plus, Trash2, Calendar, Tag, FileText, ArrowDownCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const INITIAL_EXPENSES = [
  { id: "EXP-1", category: "Vegetables", amount: 1200, notes: "Tomatoes, Onions, Paneer", date: "2026-08-17" },
  { id: "EXP-2", category: "Meat", amount: 3500, notes: "Fresh Chicken & Mutton supply", date: "2026-08-17" },
  { id: "EXP-3", category: "Gas", amount: 1800, notes: "Commercial LPG Cylinder refill", date: "2026-08-16" }
];

export const ExpenseTracker = ({ expenses = INITIAL_EXPENSES, onAddExpense, onDeleteExpense }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Vegetables',
    amount: '',
    notes: '',
    date: new Date().toISOString().slice(0, 10)
  });

  const categories = ['Vegetables', 'Meat', 'Gas', 'Rent', 'Staff Salary', 'Grocery & Spices', 'Electricity & Water', 'Others'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid expense amount!");
      return;
    }

    const newExp = {
      id: "EXP-" + Date.now(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      notes: formData.notes,
      date: formData.date
    };

    onAddExpense(newExp);
    setShowModal(false);
    setFormData({
      category: 'Vegetables',
      amount: '',
      notes: '',
      date: new Date().toISOString().slice(0, 10)
    });
  };

  const totalExpense = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="expense-container">
      {/* Header */}
      <div className="expense-header">
        <div>
          <h2>💸 Dhaba Expense Logger & Summary</h2>
          <p>Record daily purchases, ingredient costs, gas bills, rent, and staff salary to calculate true profit</p>
        </div>
        <button className="btn-add-exp" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Record New Expense
        </button>
      </div>

      {/* Expense Stats */}
      <div className="expense-stat-card">
        <div className="e-stat-icon">
          <ArrowDownCircle size={32} color="#EF4444" />
        </div>
        <div>
          <span>Total Recorded Expenses</span>
          <h3>₹{totalExpense}</h3>
        </div>
      </div>

      {/* Expense Table List */}
      <div className="expense-list-card">
        <h3>Recent Recorded Expenses</h3>
        {expenses.length === 0 ? (
          <p className="empty-msg">No expenses recorded yet.</p>
        ) : (
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description / Notes</th>
                <th>Amount (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td><span className="exp-cat-badge">{exp.category}</span></td>
                  <td>{exp.notes || '-'}</td>
                  <td className="exp-amt">₹{exp.amount}</td>
                  <td>
                    <button className="btn-del-exp" onClick={() => onDeleteExpense(exp.id)} title="Delete entry">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-bg" onClick={() => setShowModal(false)}>
          <div className="exp-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Record New Expense Entry</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="exp-form">
              <div className="form-group">
                <label>Category *</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 1500" 
                    value={formData.amount} 
                    onChange={e => setFormData({...formData, amount: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Expense Date *</label>
                  <input 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({...formData, date: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes / Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. 50kg chicken, oil tins..." 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-sec" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-pri">Save Expense Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .expense-container { display: flex; flex-direction: column; gap: 20px; }
        .expense-header { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; }
        .expense-header h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .expense-header p { color: #666; font-size: 0.9rem; }
        .btn-add-exp { background: #E8621A; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        .expense-stat-card { background: white; padding: 20px 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; align-items: center; gap: 16px; width: max-content; }
        .e-stat-icon { background: #FEF2F2; width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .expense-stat-card span { font-size: 0.8rem; color: #64748B; text-transform: uppercase; font-weight: 700; }
        .expense-stat-card h3 { font-size: 1.8rem; color: #EF4444; font-weight: 900; margin-top: 2px; }

        .expense-list-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; }
        .expense-list-card h3 { font-size: 1.1rem; color: #1E293B; margin-bottom: 16px; }

        .expense-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
        .expense-table th { background: #F8FAFC; padding: 12px; border-bottom: 2px solid #E2E8F0; color: #475569; }
        .expense-table td { padding: 12px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
        .exp-cat-badge { background: #F1F5F9; color: #334155; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
        .exp-amt { font-weight: 800; color: #EF4444; }
        .btn-del-exp { background: #FEF2F2; color: #EF4444; border: none; padding: 6px; border-radius: 6px; cursor: pointer; }

        .empty-msg { color: #94A3B8; text-align: center; padding: 30px; }

        .modal-bg { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); z-index: 2500; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .exp-modal { background: white; border-radius: 20px; padding: 24px; width: 100%; max-width: 480px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #EEE; padding-bottom: 12px; }
        .exp-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group label { font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 4px; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #DDD; outline: none; font-size: 0.9rem; font-family: inherit; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .btn-sec { background: #F0F0F0; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; }
        .btn-pri { background: #E8621A; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; }
      `}</style>
    </div>
  );
};
