import React, { useState } from 'react';
import { 
  Tag, 
  Percent, 
  Plus, 
  Clock, 
  Calendar, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Gift, 
  Copy, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const INITIAL_OFFERS = [
  {
    id: "OFF-1",
    code: "WELCOME50",
    title: "First Order Discount",
    discountType: "flat",
    discountValue: 50,
    minBillAmount: 200,
    validUntil: "2026-12-31",
    isActive: true,
    notes: "Flat ₹50 OFF for first time mobile customers"
  },
  {
    id: "OFF-2",
    code: "DHABA10",
    title: "Special 10% OFF",
    discountType: "percentage",
    discountValue: 10,
    minBillAmount: 500,
    validUntil: "2026-12-31",
    isActive: true,
    notes: "10% discount on order subtotal above ₹500"
  },
  {
    id: "OFF-3",
    code: "HAPPYHOURS",
    title: "Happy Hours Special (2-5 PM)",
    discountType: "happy_hours",
    discountValue: 15,
    minBillAmount: 300,
    validUntil: "2026-12-31",
    isActive: true,
    notes: "15% off during afternoon hours 2 PM to 5 PM"
  },
  {
    id: "OFF-4",
    code: "FESTIVAL200",
    title: "Festival Feast Offer",
    discountType: "festival",
    discountValue: 200,
    minBillAmount: 1200,
    validUntil: "2026-10-31",
    isActive: true,
    notes: "Flat ₹200 OFF on mega family orders"
  }
];

export const OffersEngine = ({ offers = INITIAL_OFFERS, onSaveOffer, onDeleteOffer, onToggleOffer }) => {
  const [showModal, setShowModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    discountType: 'flat', // flat, percentage, happy_hours, first_order, combo, festival
    discountValue: 50,
    minBillAmount: 200,
    validUntil: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.title) {
      alert("Please fill in coupon code and title!");
      return;
    }

    const newOffer = {
      id: "OFF-" + Date.now(),
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      title: formData.title,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue) || 0,
      minBillAmount: parseFloat(formData.minBillAmount) || 0,
      validUntil: formData.validUntil || '2026-12-31',
      isActive: true,
      notes: formData.notes
    };

    onSaveOffer(newOffer);
    setShowModal(false);
    setFormData({
      code: '',
      title: '',
      discountType: 'flat',
      discountValue: 50,
      minBillAmount: 200,
      validUntil: '',
      notes: ''
    });
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="offers-container">
      {/* Header */}
      <div className="offers-header">
        <div>
          <h2>🏷️ Offers, Coupons & Discounts Engine</h2>
          <p>Create percentage discounts, flat cash off, coupon codes, combo offers, happy hours & festival deals</p>
        </div>
        <button className="btn-create-offer" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create New Offer
        </button>
      </div>

      {/* Offers Cards Grid */}
      <div className="offers-grid">
        {offers.map(offer => (
          <motion.div key={offer.id} layout className={`offer-card ${offer.isActive ? 'active' : 'inactive'}`}>
            <div className="offer-card-top">
              <div className="type-badge">
                {offer.discountType === 'percentage' && <Percent size={14} />}
                {offer.discountType === 'flat' && <Tag size={14} />}
                {offer.discountType === 'happy_hours' && <Clock size={14} />}
                {offer.discountType === 'festival' && <Gift size={14} />}
                <span>{offer.discountType.toUpperCase().replace('_', ' ')}</span>
              </div>
              <button 
                className={`toggle-switch ${offer.isActive ? 'on' : 'off'}`}
                onClick={() => onToggleOffer(offer.id)}
                title="Toggle Active / Inactive status"
              >
                {offer.isActive ? <CheckCircle2 size={18} color="#22C55E" /> : <XCircle size={18} color="#94A3B8" />}
              </button>
            </div>

            <div className="offer-value-display">
              <div className="offer-amount">
                {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
              </div>
              <h3 className="offer-title">{offer.title}</h3>
            </div>

            <div className="coupon-code-pill" onClick={() => copyCode(offer.code)}>
              <code>{offer.code}</code>
              {copiedCode === offer.code ? <Check size={14} color="#22C55E" /> : <Copy size={14} color="#666" />}
            </div>

            <div className="offer-details-list">
              <div className="o-row">
                <span>Min Order Bill:</span>
                <strong>₹{offer.minBillAmount}</strong>
              </div>
              <div className="o-row">
                <span>Valid Until:</span>
                <strong>{offer.validUntil ? new Date(offer.validUntil).toLocaleDateString() : 'No Limit'}</strong>
              </div>
              {offer.notes && <p className="offer-notes">{offer.notes}</p>}
            </div>

            <div className="offer-card-footer">
              <button className="btn-del-offer" onClick={() => onDeleteOffer(offer.id)}>
                <Trash2 size={14} /> Remove Offer
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Offer Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-bg" onClick={() => setShowModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="offer-form-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Create New Offer / Discount Coupon</h3>
                <button onClick={() => setShowModal(false)}>✕</button>
              </div>

              <form onSubmit={handleSubmit} className="offer-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Coupon Code * (Uppercase)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. DHABA50" 
                      value={formData.code} 
                      onChange={e => setFormData({...formData, code: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Offer Type *</label>
                    <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})}>
                      <option value="flat">💵 Flat Discount (₹ Off)</option>
                      <option value="percentage">📊 Percentage Discount (% Off)</option>
                      <option value="first_order">🆕 First-Order Special</option>
                      <option value="happy_hours">⏰ Happy Hours Deal</option>
                      <option value="festival">🎉 Festival Offer</option>
                      <option value="combo">🍔 Combo Offer</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Offer Title / Headline *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Weekend Family Discount 15% OFF" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Discount Value ({formData.discountType === 'percentage' ? '%' : '₹'}) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 50" 
                      value={formData.discountValue} 
                      onChange={e => setFormData({...formData, discountValue: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Minimum Bill Amount (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 300" 
                      value={formData.minBillAmount} 
                      onChange={e => setFormData({...formData, minBillAmount: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Valid Until Date</label>
                  <input 
                    type="date" 
                    value={formData.validUntil} 
                    onChange={e => setFormData({...formData, validUntil: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label>Notes / Description</label>
                  <textarea 
                    placeholder="Describe how or when this offer applies..." 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-sec" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-pri">Save & Activate Offer</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .offers-container { display: flex; flex-direction: column; gap: 20px; }
        .offers-header { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: center; }
        .offers-header h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .offers-header p { color: #666; font-size: 0.9rem; }
        .btn-create-offer { background: #E8621A; color: white; border: none; padding: 12px 20px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
        .offer-card { background: white; border-radius: 20px; padding: 20px; border: 1px solid #F0F0F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 12px; transition: all 0.2s; }
        .offer-card.inactive { opacity: 0.6; background: #F9FAFB; }
        .offer-card-top { display: flex; justify-content: space-between; align-items: center; }
        .type-badge { background: #FFF3EB; color: #E8621A; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; display: flex; align-items: center; gap: 6px; }

        .toggle-switch { background: none; border: none; cursor: pointer; }

        .offer-value-display { margin: 4px 0; }
        .offer-amount { font-size: 1.8rem; font-weight: 900; color: #111; }
        .offer-title { font-size: 0.95rem; font-weight: 700; color: #444; }

        .coupon-code-pill { background: #F1F5F9; border: 1px dashed #94A3B8; padding: 8px 14px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .coupon-code-pill code { font-weight: 800; letter-spacing: 1px; color: #0F172A; font-size: 1rem; }

        .offer-details-list { background: #F8FAFC; padding: 12px; border-radius: 12px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 6px; }
        .o-row { display: flex; justify-content: space-between; color: #64748B; }
        .offer-notes { font-size: 0.75rem; color: #475569; margin-top: 4px; border-top: 1px solid #E2E8F0; padding-top: 4px; }

        .offer-card-footer { display: flex; justify-content: flex-end; margin-top: 4px; }
        .btn-del-offer { background: #FEF2F2; color: #EF4444; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 0.75rem; display: flex; align-items: center; gap: 4px; cursor: pointer; }

        .modal-bg { position: fixed; top: 0; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); z-index: 2500; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .offer-form-modal { background: white; border-radius: 20px; padding: 24px; width: 100%; max-width: 500px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #EEE; padding-bottom: 12px; }
        .offer-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-group label { font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 4px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #DDD; outline: none; font-size: 0.9rem; font-family: inherit; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .btn-sec { background: #F0F0F0; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; }
        .btn-pri { background: #E8621A; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; }
      `}</style>
    </div>
  );
};
