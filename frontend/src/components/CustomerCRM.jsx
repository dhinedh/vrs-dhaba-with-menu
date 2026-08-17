import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Plus, 
  Calendar, 
  Award, 
  TrendingUp, 
  ShoppingBag, 
  MessageSquare, 
  Download, 
  Star, 
  Clock, 
  Heart, 
  Tag, 
  X, 
  Edit3, 
  CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CustomerCRM = ({ customers = [], orders = [], onSaveCustomer, onSendWhatsApp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('ALL'); // ALL, VIP, INACTIVE, BIRTHDAY
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    birthday: '',
    anniversary: '',
    notes: '',
    tags: 'Regular'
  });

  // Calculate customer insights from orders dynamically if not already computed
  const customerListWithStats = useMemo(() => {
    // Map mobile -> order history
    const customerOrdersMap = {};
    orders.forEach(o => {
      const mob = o.customerMobile || (o.notes && o.notes.match(/\d{10}/)?.[0]);
      if (mob) {
        if (!customerOrdersMap[mob]) customerOrdersMap[mob] = [];
        customerOrdersMap[mob].push(o);
      }
    });

    // Merge existing stored customers with orders
    const allMobiles = new Set([
      ...customers.map(c => c.mobile),
      ...Object.keys(customerOrdersMap)
    ]);

    return Array.from(allMobiles).map(mob => {
      const existing = customers.find(c => c.mobile === mob) || {};
      const mobOrders = customerOrdersMap[mob] || [];

      const totalSpendFromOrders = mobOrders.reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
      const totalSpend = Math.max(existing.totalSpend || 0, totalSpendFromOrders);
      const visitCount = Math.max(existing.totalVisits || 0, mobOrders.length);

      // Compute favourite items
      const itemCounts = {};
      mobOrders.forEach(o => {
        if (o.items && Array.isArray(o.items)) {
          o.items.forEach(item => {
            const key = item.name;
            itemCounts[key] = (itemCounts[key] || 0) + (item.quantity || 1);
          });
        }
      });

      const favourites = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, qty]) => ({ name, qty }));

      // Last visit
      let lastVisit = existing.lastVisit ? new Date(existing.lastVisit) : null;
      if (mobOrders.length > 0) {
        const latestOrderTime = new Date(mobOrders[0].timestamp || mobOrders[0].created_at);
        if (!lastVisit || latestOrderTime > lastVisit) {
          lastVisit = latestOrderTime;
        }
      }

      // Determine tier
      let tier = 'Bronze';
      if (totalSpend >= 5000) tier = 'VIP Gold';
      else if (totalSpend >= 2000) tier = 'Silver';

      return {
        id: existing.id || mob,
        name: existing.name || mobOrders[0]?.customerName || 'Customer',
        mobile: mob,
        email: existing.email || '',
        birthday: existing.birthday || '',
        anniversary: existing.anniversary || '',
        notes: existing.notes || '',
        tags: existing.tags || ['Regular'],
        totalSpend,
        totalVisits: visitCount,
        lastVisit: lastVisit ? lastVisit.toISOString() : new Date().toISOString(),
        favourites,
        orderHistory: mobOrders,
        tier
      };
    });
  }, [customers, orders]);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();

    return customerListWithStats.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.mobile.includes(searchTerm);

      if (!matchesSearch) return false;

      if (filterTag === 'VIP') return c.totalSpend >= 3000 || c.tier.includes('VIP');
      if (filterTag === 'INACTIVE') {
        if (!c.lastVisit) return false;
        const daysDiff = (now - new Date(c.lastVisit)) / (1000 * 60 * 60 * 24);
        return daysDiff >= 30;
      }
      if (filterTag === 'BIRTHDAY') {
        if (!c.birthday) return false;
        const bdayMonth = new Date(c.birthday).getMonth();
        return bdayMonth === currentMonth;
      }
      return true;
    });
  }, [customerListWithStats, searchTerm, filterTag]);

  const handleOpenAdd = (cust = null) => {
    if (cust) {
      setEditingCustomer(cust);
      setFormData({
        name: cust.name,
        mobile: cust.mobile,
        email: cust.email || '',
        birthday: cust.birthday || '',
        anniversary: cust.anniversary || '',
        notes: cust.notes || '',
        tags: Array.isArray(cust.tags) ? cust.tags.join(', ') : 'Regular'
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        mobile: '',
        email: '',
        birthday: '',
        anniversary: '',
        notes: '',
        tags: 'Regular'
      });
    }
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.mobile || formData.mobile.length < 10) {
      alert('Please enter a valid 10-digit customer mobile number');
      return;
    }
    const updated = {
      id: editingCustomer ? editingCustomer.id : Date.now().toString(),
      name: formData.name || 'Customer',
      mobile: formData.mobile,
      email: formData.email,
      birthday: formData.birthday,
      anniversary: formData.anniversary,
      notes: formData.notes,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      totalSpend: editingCustomer ? editingCustomer.totalSpend : 0,
      totalVisits: editingCustomer ? editingCustomer.totalVisits : 1,
      lastVisit: editingCustomer ? editingCustomer.lastVisit : new Date().toISOString()
    };
    onSaveCustomer(updated);
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const headers = ['Name', 'Mobile', 'Total Spend (₹)', 'Total Visits', 'Last Visit', 'Tier', 'Birthday'];
    const rows = filteredCustomers.map(c => [
      `"${c.name}"`,
      `"${c.mobile}"`,
      c.totalSpend,
      c.totalVisits,
      new Date(c.lastVisit).toLocaleDateString(),
      `"${c.tier}"`,
      `"${c.birthday || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VRS_Dhaba_Customers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="crm-container">
      {/* Header Bar */}
      <div className="crm-header-card">
        <div className="crm-title-group">
          <div>
            <h2>👥 Customer CRM</h2>
            <p>Manage customer profiles, visit history, loyalty, and targeted re-engagement</p>
          </div>
          <div className="crm-top-actions">
            <button className="btn-export" onClick={exportCSV} title="Export customer data to CSV">
              <Download size={16} /> Export CSV
            </button>
            <button className="btn-add-cust" onClick={() => handleOpenAdd()}>
              <Plus size={16} /> Add Customer
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="crm-stats-grid">
          <div className="crm-stat-item">
            <div className="stat-icon purple"><Users size={20} /></div>
            <div>
              <span className="stat-label">Total Customers</span>
              <h3 className="stat-value">{customerListWithStats.length}</h3>
            </div>
          </div>
          <div className="crm-stat-item">
            <div className="stat-icon gold"><Award size={20} /></div>
            <div>
              <span className="stat-label">VIP Spenders</span>
              <h3 className="stat-value">{customerListWithStats.filter(c => c.totalSpend >= 3000).length}</h3>
            </div>
          </div>
          <div className="crm-stat-item">
            <div className="stat-icon green"><TrendingUp size={20} /></div>
            <div>
              <span className="stat-label">Avg Customer Spend</span>
              <h3 className="stat-value">
                ₹{customerListWithStats.length ? Math.round(customerListWithStats.reduce((a,b)=>a+b.totalSpend,0) / customerListWithStats.length) : 0}
              </h3>
            </div>
          </div>
          <div className="crm-stat-item">
            <div className="stat-icon orange"><Clock size={20} /></div>
            <div>
              <span className="stat-label">Inactive (&gt;30 days)</span>
              <h3 className="stat-value">{customerListWithStats.filter(c => {
                const diff = (new Date() - new Date(c.lastVisit)) / (1000*60*60*24);
                return diff >= 30;
              }).length}</h3>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="crm-filter-bar">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by Customer Name or Mobile Number..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className="filter-pills">
            <button className={filterTag === 'ALL' ? 'active' : ''} onClick={() => setFilterTag('ALL')}>
              All Customers ({customerListWithStats.length})
            </button>
            <button className={filterTag === 'VIP' ? 'active' : ''} onClick={() => setFilterTag('VIP')}>
              ⭐ VIP Spenders
            </button>
            <button className={filterTag === 'INACTIVE' ? 'active' : ''} onClick={() => setFilterTag('INACTIVE')}>
              ⏰ Inactive (&gt;30 Days)
            </button>
            <button className={filterTag === 'BIRTHDAY' ? 'active' : ''} onClick={() => setFilterTag('BIRTHDAY')}>
              🎂 Birthday This Month
            </button>
          </div>
        </div>
      </div>

      {/* Customer List Grid / Table */}
      <div className="customer-grid">
        {filteredCustomers.length === 0 ? (
          <div className="empty-crm">
            <Users size={48} color="#CCC" />
            <p>No customers found matching your search criteria.</p>
          </div>
        ) : (
          filteredCustomers.map(cust => (
            <motion.div key={cust.mobile} layout className="cust-card" onClick={() => setSelectedCustomer(cust)}>
              <div className="cust-card-header">
                <div className="avatar-circle">
                  {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="cust-header-info">
                  <h4>{cust.name}</h4>
                  <div className="cust-phone">
                    <Phone size={13} /> {cust.mobile}
                  </div>
                </div>
                <span className={`tier-badge ${cust.tier.toLowerCase().replace(' ', '-')}`}>
                  {cust.tier}
                </span>
              </div>

              <div className="cust-card-stats">
                <div className="c-stat">
                  <span>Total Spend</span>
                  <strong>₹{cust.totalSpend}</strong>
                </div>
                <div className="c-stat">
                  <span>Visits</span>
                  <strong>{cust.totalVisits}</strong>
                </div>
                <div className="c-stat">
                  <span>Last Visit</span>
                  <strong>{cust.lastVisit ? new Date(cust.lastVisit).toLocaleDateString() : 'N/A'}</strong>
                </div>
              </div>

              {cust.favourites && cust.favourites.length > 0 && (
                <div className="cust-favourites-chips">
                  <Heart size={12} color="#E8621A" />
                  <span>Favs: {cust.favourites.map(f => f.name).join(', ')}</span>
                </div>
              )}

              <div className="cust-card-actions" onClick={e => e.stopPropagation()}>
                <button className="btn-wa" onClick={() => onSendWhatsApp && onSendWhatsApp(cust, 'WELCOME')}>
                  <MessageSquare size={14} /> WhatsApp
                </button>
                <button className="btn-edit-sm" onClick={() => handleOpenAdd(cust)}>
                  <Edit3 size={14} /> Edit
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Customer Detail Drawer / Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="crm-modal-bg" onClick={() => setSelectedCustomer(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="crm-detail-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-top">
                <div className="top-cust-info">
                  <div className="big-avatar">
                    {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <h3>{selectedCustomer.name}</h3>
                    <p><Phone size={14} /> {selectedCustomer.mobile} {selectedCustomer.email ? `• ${selectedCustomer.email}` : ''}</p>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedCustomer(null)}><X size={20}/></button>
              </div>

              <div className="modal-body-grid">
                {/* Left Column: Stats & Favourites */}
                <div className="detail-col">
                  <div className="info-card">
                    <h4>Customer Profile Summary</h4>
                    <div className="info-row"><span>Loyalty Tier</span><strong className="orange-text">{selectedCustomer.tier}</strong></div>
                    <div className="info-row"><span>Total Revenue</span><strong>₹{selectedCustomer.totalSpend}</strong></div>
                    <div className="info-row"><span>Total Visits</span><strong>{selectedCustomer.totalVisits} visits</strong></div>
                    <div className="info-row"><span>First Visit</span><span>{new Date(selectedCustomer.lastVisit).toLocaleDateString()}</span></div>
                    <div className="info-row"><span>Last Visit</span><span>{new Date(selectedCustomer.lastVisit).toLocaleString()}</span></div>
                    {selectedCustomer.birthday && <div className="info-row"><span>Birthday</span><span>🎂 {selectedCustomer.birthday}</span></div>}
                    {selectedCustomer.notes && <div className="info-row"><span>Notes</span><span>{selectedCustomer.notes}</span></div>}
                  </div>

                  <div className="info-card">
                    <h4><Heart size={16} color="#E8621A" /> Favourite Items Ordered</h4>
                    {selectedCustomer.favourites && selectedCustomer.favourites.length > 0 ? (
                      <div className="fav-list">
                        {selectedCustomer.favourites.map((fav, i) => (
                          <div key={i} className="fav-item-row">
                            <span>#{i+1} {fav.name}</span>
                            <span className="qty-tag">{fav.qty} times</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="small-text">No order history available yet.</p>
                    )}
                  </div>

                  <div className="wa-quick-actions">
                    <h4>📢 Trigger WhatsApp Message</h4>
                    <div className="wa-btn-grid">
                      <button onClick={() => onSendWhatsApp(selectedCustomer, 'THANK_YOU')}>🙏 Thank You</button>
                      <button onClick={() => onSendWhatsApp(selectedCustomer, 'OFFERS')}>🏷️ Send Offer</button>
                      <button onClick={() => onSendWhatsApp(selectedCustomer, 'BIRTHDAY')}>🎂 Birthday Wish</button>
                      <button onClick={() => onSendWhatsApp(selectedCustomer, 'RE_ENGAGE')}>🔄 Re-engage</button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Order History Timeline */}
                <div className="detail-col">
                  <div className="info-card history-card">
                    <h4><ShoppingBag size={16} /> Visit & Order History ({selectedCustomer.orderHistory.length})</h4>
                    <div className="timeline-list">
                      {selectedCustomer.orderHistory.length === 0 ? (
                        <p className="small-text">No orders recorded for this mobile number yet.</p>
                      ) : (
                        selectedCustomer.orderHistory.map((ord, idx) => (
                          <div key={ord.id || idx} className="timeline-item">
                            <div className="timeline-badge">#{ord.id}</div>
                            <div className="timeline-content">
                              <div className="t-top">
                                <strong>Table {ord.tableNumber || 'Takeaway'}</strong>
                                <span className="t-amount">₹{ord.netTotal || ord.total}</span>
                              </div>
                              <div className="t-date">{new Date(ord.timestamp || ord.created_at || Date.now()).toLocaleString()}</div>
                              <div className="t-items">
                                {ord.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Customer Form Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="crm-modal-bg" onClick={() => setShowAddModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="crm-form-modal"
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{editingCustomer ? 'Edit Customer Details' : 'Add New Customer Profile'}</h3>
                <button onClick={() => setShowAddModal(false)}><X size={18}/></button>
              </div>
              <form onSubmit={handleFormSubmit} className="crm-form">
                <div className="form-row-2">
                  <div>
                    <label>Customer Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Kumar" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label>Mobile Number * (10 Digits)</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210" 
                      value={formData.mobile} 
                      onChange={e => setFormData({...formData, mobile: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div>
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      placeholder="customer@gmail.com" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label>Birthday (YYYY-MM-DD)</label>
                    <input 
                      type="date" 
                      value={formData.birthday} 
                      onChange={e => setFormData({...formData, birthday: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="form-row-1">
                  <label>Tags (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Regular, VIP, Weekend Guest" 
                    value={formData.tags} 
                    onChange={e => setFormData({...formData, tags: e.target.value})} 
                  />
                </div>

                <div className="form-row-1">
                  <label>Customer Notes & Preferences</label>
                  <textarea 
                    placeholder="e.g. Prefers less spicy, regular table 5..." 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn-save">Save Customer Profile</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .crm-container { display: flex; flex-direction: column; gap: 20px; font-family: inherit; }
        .crm-header-card { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #F0F0F0; }
        .crm-title-group { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .crm-title-group h2 { font-size: 1.6rem; color: #111; margin-bottom: 4px; }
        .crm-title-group p { color: #666; font-size: 0.9rem; }
        .crm-top-actions { display: flex; gap: 10px; }

        .btn-export { background: #F5F5F5; border: 1px solid #DDD; color: #333; padding: 10px 16px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
        .btn-add-cust { background: #E8621A; color: white; border: none; padding: 10px 18px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }

        .crm-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .crm-stat-item { background: #F9FAFB; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; border: 1px solid #EEF0F2; }
        .stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.purple { background: #F3E8FF; color: #9333EA; }
        .stat-icon.gold { background: #FEF3C7; color: #D97706; }
        .stat-icon.green { background: #DCFCE7; color: #16A34A; }
        .stat-icon.orange { background: #FFEDD5; color: #EA580C; }
        .stat-label { font-size: 0.75rem; color: #666; font-weight: 600; text-transform: uppercase; }
        .stat-value { font-size: 1.4rem; font-weight: 800; color: #111; margin-top: 2px; }

        .crm-filter-bar { display: flex; flex-wrap: wrap; gap: 15px; align-items: center; justify-content: space-between; }
        .search-box { display: flex; align-items: center; gap: 10px; background: #F5F5F5; padding: 10px 16px; border-radius: 12px; flex: 1; min-width: 280px; }
        .search-box input { border: none; background: transparent; width: 100%; outline: none; font-size: 0.95rem; }
        .filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
        .filter-pills button { background: #F5F5F5; border: none; padding: 8px 16px; border-radius: 50px; font-weight: 600; font-size: 0.85rem; color: #555; cursor: pointer; }
        .filter-pills button.active { background: #1A1208; color: white; }

        .customer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
        .empty-crm { grid-column: 1 / -1; background: white; padding: 60px; text-align: center; border-radius: 20px; color: #888; }

        .cust-card { background: white; border-radius: 16px; padding: 18px; border: 1px solid #F0F0F0; box-shadow: 0 2px 10px rgba(0,0,0,0.03); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 12px; }
        .cust-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); border-color: #E8621A; }
        .cust-card-header { display: flex; align-items: center; gap: 12px; }
        .avatar-circle { width: 42px; height: 42px; border-radius: 50%; background: #FFE8DC; color: #E8621A; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .cust-header-info { flex: 1; }
        .cust-header-info h4 { font-size: 1.05rem; font-weight: 700; color: #222; }
        .cust-phone { font-size: 0.8rem; color: #666; display: flex; align-items: center; gap: 4px; }

        .tier-badge { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 50px; text-transform: uppercase; }
        .tier-badge.vip-gold { background: #FEF3C7; color: #B45309; }
        .tier-badge.silver { background: #F3F4F6; color: #4B5563; }
        .tier-badge.bronze { background: #FFF7ED; color: #C2410C; }

        .cust-card-stats { display: flex; justify-content: space-between; background: #F9FAFB; padding: 10px 12px; border-radius: 10px; font-size: 0.8rem; }
        .c-stat { display: flex; flex-direction: column; }
        .c-stat span { color: #888; font-size: 0.7rem; }
        .c-stat strong { font-size: 0.95rem; color: #111; }

        .cust-favourites-chips { font-size: 0.75rem; color: #444; background: #FFF5F0; padding: 6px 10px; border-radius: 8px; display: flex; align-items: center; gap: 6px; }

        .cust-card-actions { display: flex; gap: 8px; margin-top: 4px; }
        .btn-wa { flex: 1; background: #25D366; color: white; border: none; padding: 8px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; }
        .btn-edit-sm { background: #F0F0F0; border: none; padding: 8px 12px; border-radius: 8px; color: #555; font-weight: 600; font-size: 0.8rem; display: flex; align-items: center; gap: 4px; cursor: pointer; }

        .crm-modal-bg { position: fixed; top:0; bottom:0; left:0; right:0; background: rgba(0,0,0,0.6); z-index: 2500; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .crm-detail-modal { background: white; width: 100%; max-width: 900px; max-height: 90vh; border-radius: 24px; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .modal-top { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #EEE; padding-bottom: 16px; }
        .top-cust-info { display: flex; align-items: center; gap: 16px; }
        .big-avatar { width: 56px; height: 56px; border-radius: 50%; background: #E8621A; color: white; font-weight: 800; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; }
        .close-btn { background: #F0F0F0; border: none; padding: 8px; border-radius: 50%; cursor: pointer; }

        .modal-body-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 768px) { .modal-body-grid { grid-template-columns: 1fr; } }
        .detail-col { display: flex; flex-direction: column; gap: 16px; }
        .info-card { background: #F9FAFB; padding: 18px; border-radius: 16px; border: 1px solid #EEE; display: flex; flex-direction: column; gap: 10px; }
        .info-card h4 { font-size: 0.95rem; color: #111; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #EAEAEA; padding-bottom: 8px; }
        .info-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #555; }
        .orange-text { color: #E8621A; }

        .fav-list { display: flex; flex-direction: column; gap: 8px; }
        .fav-item-row { display: flex; justify-content: space-between; font-size: 0.85rem; background: white; padding: 8px 12px; border-radius: 8px; border: 1px solid #EFEFEF; }
        .qty-tag { background: #FFE8DC; color: #E8621A; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; }

        .wa-quick-actions { background: #F0FDF4; border: 1px solid #DCFCE7; padding: 16px; border-radius: 16px; }
        .wa-quick-actions h4 { color: #166534; font-size: 0.9rem; margin-bottom: 10px; }
        .wa-btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .wa-btn-grid button { background: white; border: 1px solid #BBF7D0; color: #15803D; padding: 10px; border-radius: 10px; font-weight: 700; font-size: 0.8rem; cursor: pointer; }
        .wa-btn-grid button:hover { background: #25D366; color: white; }

        .history-card { max-height: 400px; overflow-y: auto; }
        .timeline-list { display: flex; flex-direction: column; gap: 12px; margin-top: 8px; }
        .timeline-item { display: flex; gap: 12px; background: white; padding: 12px; border-radius: 12px; border: 1px solid #EAEAEA; }
        .timeline-badge { background: #E8621A; color: white; font-weight: 800; font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; height: max-content; }
        .timeline-content { flex: 1; }
        .t-top { display: flex; justify-content: space-between; font-size: 0.85rem; }
        .t-amount { font-weight: 800; color: #2e7d32; }
        .t-date { font-size: 0.7rem; color: #888; margin-bottom: 4px; }
        .t-items { font-size: 0.75rem; color: #555; }

        .crm-form-modal { background: white; width: 100%; max-width: 500px; border-radius: 20px; padding: 24px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .crm-form { display: flex; flex-direction: column; gap: 14px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .crm-form label { font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 4px; }
        .crm-form input, .crm-form textarea { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #DDD; outline: none; font-family: inherit; font-size: 0.9rem; }
        .crm-form textarea { height: 70px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; }
        .btn-cancel { background: #F0F0F0; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; cursor: pointer; }
        .btn-save { background: #E8621A; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; }
      `}</style>
    </div>
  );
};
