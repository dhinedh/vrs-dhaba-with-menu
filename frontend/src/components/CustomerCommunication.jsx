import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Smartphone, 
  Gift, 
  FileText, 
  UserCheck, 
  Star, 
  Sparkles, 
  Share2, 
  Percent, 
  RefreshCw 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TEMPLATES = [
  {
    id: 'WELCOME',
    title: '👋 Welcome Message',
    category: 'Onboarding',
    text: `Hello {customer_name}! 🥳 Welcome to {shop_name}.\n\nThank you for visiting us today! Enjoy 10% OFF on your next order using coupon code: WELCOME10.\n\nSee you soon again! 🍲`
  },
  {
    id: 'ORDER_CONFIRM',
    title: '📝 Order Confirmation',
    category: 'Orders',
    text: `Hi {customer_name}! Your order #{order_id} at Table {table} is confirmed! 🍳\n\nItems:\n{items}\nSubtotal: ₹{total}\n\nOur chef is preparing your delicious meal fresh!`
  },
  {
    id: 'BILL',
    title: '🧾 Bill & Digital Receipt',
    category: 'Billing',
    text: `🧾 *{shop_name} - Tax Invoice*\nOrder: #{order_id} | Table: {table}\nDate: {date}\n\nItems:\n{items}\n--------------------\nSubtotal: ₹{subtotal}\nGST ({gst}%): ₹{gst_amount}\nDiscount: ₹{discount}\n*TOTAL PAYABLE: ₹{total}*\n--------------------\nPayment Method: {payment_method}\n\nThank you for dining with us! 🙏`
  },
  {
    id: 'PAYMENT_CONFIRM',
    title: '💳 Payment Confirmation',
    category: 'Billing',
    text: `Hi {customer_name}, we have received your payment of ₹{total} via {payment_method} for Order #{order_id}! 💵\n\nThank you for visiting {shop_name}. Have a wonderful day!`
  },
  {
    id: 'THANK_YOU',
    title: '🙏 Thank-You Message',
    category: 'Post Visit',
    text: `Dear {customer_name}, thank you for choosing {shop_name} today! 🍽️❤️\nWe hope you enjoyed our food and service. Please visit us again soon!`
  },
  {
    id: 'FEEDBACK',
    title: '⭐ Feedback Request',
    category: 'Post Visit',
    text: `Hi {customer_name}! How was your meal at {shop_name} today? ⭐⭐⭐⭐⭐\n\nWe would love your feedback to help us serve you better! Please reply with your comments or rating (1 to 5). Thank you!`
  },
  {
    id: 'OFFERS',
    title: '🏷️ Offers & Discounts Alert',
    category: 'Promotions',
    text: `🎉 *Special Dhaba Offer for {customer_name}!*\nGet 15% OFF on all Naan & Gravy combos today at {shop_name}!\n\nUse Code: *DHABA15* when dining or taking away.\nValid till end of this week! 🥘`
  },
  {
    id: 'BIRTHDAY',
    title: '🎂 Birthday Wishes',
    category: 'Special Days',
    text: `🎂 Happy Birthday {customer_name}! 🎈🎉\nTeam {shop_name} wishes you a wonderful year ahead!\n\nEnjoy a *FREE Dessert* & 20% OFF on your birthday meal with us today! Show this message to claim your gift! 🍰`
  },
  {
    id: 'RE_ENGAGE',
    title: '🔄 We Miss You! (Re-engagement)',
    category: 'Re-engagement',
    text: `Hi {customer_name}, we miss seeing you at {shop_name}! 🍛\nIt's been a while since your last visit. Enjoy ₹100 OFF on orders above ₹500 with code: *WELCOMEBACK*.\n\nCome dine with us this weekend!`
  }
];

export const CustomerCommunication = ({ customers = [], orders = [], settings = {} }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [recipientMobile, setRecipientMobile] = useState('');
  const [recipientName, setRecipientName] = useState('Customer');
  const [customVars, setCustomVars] = useState({
    order_id: 'ORD-101',
    table: '5',
    total: '450',
    subtotal: '428',
    gst: '5',
    gst_amount: '22',
    discount: '50',
    items: '2x Butter Naan\n1x Chicken Masala',
    payment_method: 'UPI (PhonePe)'
  });

  const [copied, setCopied] = useState(false);

  // Generate final parsed message text
  const shopName = settings.name || "VRS Garden Dhaba";
  const currentDate = new Date().toLocaleDateString();

  const finalMessage = selectedTemplate.text
    .replaceAll('{customer_name}', recipientName || 'Valued Customer')
    .replaceAll('{shop_name}', shopName)
    .replaceAll('{order_id}', customVars.order_id)
    .replaceAll('{table}', customVars.table)
    .replaceAll('{total}', customVars.total)
    .replaceAll('{subtotal}', customVars.subtotal)
    .replaceAll('{gst}', customVars.gst)
    .replaceAll('{gst_amount}', customVars.gst_amount)
    .replaceAll('{discount}', customVars.discount)
    .replaceAll('{items}', customVars.items)
    .replaceAll('{payment_method}', customVars.payment_method)
    .replaceAll('{date}', currentDate);

  const handleSelectCustomer = (mob) => {
    setRecipientMobile(mob);
    const found = customers.find(c => c.mobile === mob);
    if (found) setRecipientName(found.name);
  };

  const openWhatsApp = () => {
    if (!recipientMobile || recipientMobile.length < 10) {
      alert('Please enter a valid 10-digit mobile number!');
      return;
    }
    const cleanMob = recipientMobile.replace(/\D/g, '');
    const formattedMob = cleanMob.length === 10 ? `91${cleanMob}` : cleanMob;
    const url = `https://wa.me/${formattedMob}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="comm-container">
      <div className="comm-header">
        <div>
          <h2>📢 Customer Communication & WhatsApp Integration</h2>
          <p>Send instant order bills, payment confirmations, offers, birthday wishes, and re-engagement alerts</p>
        </div>
      </div>

      <div className="comm-grid">
        {/* Left Column: Template Selector & Recipient Input */}
        <div className="comm-col">
          <div className="comm-card">
            <h3>1. Select Message Template</h3>
            <div className="template-list">
              {TEMPLATES.map(tpl => (
                <button
                  key={tpl.id}
                  className={`tpl-btn ${selectedTemplate.id === tpl.id ? 'active' : ''}`}
                  onClick={() => setSelectedTemplate(tpl)}
                >
                  <div className="tpl-title">{tpl.title}</div>
                  <span className="tpl-category">{tpl.category}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="comm-card">
            <h3>2. Recipient Details</h3>
            <div className="form-group">
              <label>Select Saved Customer (Optional)</label>
              <select onChange={e => handleSelectCustomer(e.target.value)} value={recipientMobile}>
                <option value="">-- Choose from CRM --</option>
                {customers.map(c => (
                  <option key={c.mobile} value={c.mobile}>{c.name} ({c.mobile})</option>
                ))}
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210" 
                  value={recipientMobile} 
                  onChange={e => setRecipientMobile(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  placeholder="Customer Name" 
                  value={recipientName} 
                  onChange={e => setRecipientName(e.target.value)} 
                />
              </div>
            </div>

            {/* If template has order variables */}
            {(selectedTemplate.id === 'BILL' || selectedTemplate.id === 'ORDER_CONFIRM' || selectedTemplate.id === 'PAYMENT_CONFIRM') && (
              <div className="variable-inputs">
                <h4>Order Detail Variables</h4>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Order ID</label>
                    <input value={customVars.order_id} onChange={e => setCustomVars({...customVars, order_id: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Table No.</label>
                    <input value={customVars.table} onChange={e => setCustomVars({...customVars, table: e.target.value})} />
                  </div>
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Total Amount (₹)</label>
                    <input value={customVars.total} onChange={e => setCustomVars({...customVars, total: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <input value={customVars.payment_method} onChange={e => setCustomVars({...customVars, payment_method: e.target.value})} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live WhatsApp Interactive Simulator Screen */}
        <div className="comm-col">
          <div className="comm-card simulator-card">
            <div className="sim-header">
              <Smartphone size={20} />
              <h3>WhatsApp Message Preview</h3>
              <span className="wa-online-pill">Online Simulator</span>
            </div>

            {/* Phone Screen Mockup */}
            <div className="phone-screen">
              {/* WhatsApp App Bar */}
              <div className="wa-app-bar">
                <div className="wa-avatar">VRS</div>
                <div className="wa-contact-info">
                  <strong>{shopName}</strong>
                  <small>+91 98765 43210 • Business Account</small>
                </div>
              </div>

              {/* Chat Chat Bubble */}
              <div className="wa-chat-bg">
                <div className="wa-date-pill">Today</div>
                <div className="wa-chat-bubble">
                  <div className="wa-message-text">
                    {finalMessage.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="wa-timestamp">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    <span className="ticks"> ✓✓</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sim-actions">
              <button className="btn-copy" onClick={copyToClipboard}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied to Clipboard!' : 'Copy Text'}
              </button>
              <button className="btn-send-wa" onClick={openWhatsApp}>
                <Send size={16} /> Send via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .comm-container { display: flex; flex-direction: column; gap: 20px; }
        .comm-header { background: white; padding: 20px 24px; border-radius: 20px; border: 1px solid #F0F0F0; }
        .comm-header h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .comm-header p { color: #666; font-size: 0.9rem; }

        .comm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 900px) { .comm-grid { grid-template-columns: 1fr; } }

        .comm-col { display: flex; flex-direction: column; gap: 20px; }
        .comm-card { background: white; border-radius: 20px; padding: 20px; border: 1px solid #F0F0F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
        .comm-card h3 { font-size: 1.05rem; color: #222; margin-bottom: 15px; border-bottom: 1px solid #F5F5F5; padding-bottom: 8px; }

        .template-list { display: grid; grid-template-columns: 1fr; gap: 8px; max-height: 320px; overflow-y: auto; }
        .tpl-btn { background: #F9FAFB; border: 1px solid #EEF0F2; padding: 12px; border-radius: 12px; text-align: left; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
        .tpl-btn:hover { background: #FFF7ED; border-color: #E8621A; }
        .tpl-btn.active { background: #FFE8DC; border-color: #E8621A; }
        .tpl-title { font-weight: 700; font-size: 0.9rem; color: #222; }
        .tpl-category { font-size: 0.7rem; background: rgba(0,0,0,0.05); padding: 3px 8px; border-radius: 50px; font-weight: 600; color: #555; }

        .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .form-group label { font-size: 0.8rem; font-weight: 700; color: #444; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #DDD; outline: none; font-size: 0.9rem; font-family: inherit; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .variable-inputs { background: #F9FAFB; padding: 12px; border-radius: 12px; margin-top: 10px; border: 1px solid #EEF0F2; }
        .variable-inputs h4 { font-size: 0.8rem; text-transform: uppercase; color: #666; margin-bottom: 8px; }

        .simulator-card { display: flex; flex-direction: column; height: 100%; }
        .sim-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
        .sim-header h3 { margin-bottom: 0; border: none; padding: 0; flex: 1; }
        .wa-online-pill { background: #DCFCE7; color: #166534; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; }

        .phone-screen { background: #E5DDD5; border-radius: 20px; border: 4px solid #111; overflow: hidden; display: flex; flex-direction: column; height: 420px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
        .wa-app-bar { background: #075E54; color: white; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
        .wa-avatar { width: 36px; height: 36px; border-radius: 50%; background: #25D366; color: white; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; }
        .wa-contact-info { display: flex; flex-direction: column; }
        .wa-contact-info strong { font-size: 0.95rem; }
        .wa-contact-info small { opacity: 0.8; font-size: 0.7rem; }

        .wa-chat-bg { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background-image: radial-gradient(#00000008 1px, transparent 0); background-size: 10px 10px; }
        .wa-date-pill { align-self: center; background: #E1F5FE; color: #555; font-size: 0.65rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; }

        .wa-chat-bubble { align-self: flex-start; background: white; border-radius: 0 12px 12px 12px; padding: 10px 14px; max-width: 85%; box-shadow: 0 1px 3px rgba(0,0,0,0.12); position: relative; }
        .wa-message-text { font-size: 0.85rem; color: #111; line-height: 1.4; word-break: break-word; }
        .wa-timestamp { display: flex; justify-content: flex-end; align-items: center; gap: 4px; font-size: 0.65rem; color: #888; margin-top: 4px; }
        .ticks { color: #34B7F1; font-weight: bold; }

        .sim-actions { display: flex; gap: 10px; margin-top: 15px; }
        .btn-copy { flex: 1; background: #F5F5F5; border: 1px solid #DDD; color: #333; padding: 12px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
        .btn-send-wa { flex: 1.5; background: #25D366; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 4px 15px rgba(37,211,102,0.3); }
      `}</style>
    </div>
  );
};
