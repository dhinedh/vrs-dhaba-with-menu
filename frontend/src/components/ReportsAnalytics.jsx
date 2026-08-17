import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  ShoppingBag, 
  PieChart, 
  CreditCard, 
  Users, 
  Download, 
  Printer, 
  DollarSign, 
  UserCheck, 
  Layers, 
  ChevronRight, 
  ArrowUpRight, 
  Percent 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ReportsAnalytics = ({ orders = [], expenses = [], customers = [] }) => {
  const [activeReportTab, setActiveReportTab] = useState('DAILY'); // DAILY, MONTHLY, ITEM, CATEGORY, WAITER, PAYMENT, CUSTOMER, PROFIT
  const [dateFilter, setDateFilter] = useState('ALL'); // ALL, TODAY, YESTERDAY, THIS_MONTH

  // Date range filtering helper
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return orders.filter(o => {
      if (dateFilter === 'ALL') return true;

      const oDate = new Date(o.timestamp || o.created_at || Date.now());
      const oDateStr = oDate.toISOString().slice(0, 10);

      if (dateFilter === 'TODAY') return oDateStr === todayStr;
      if (dateFilter === 'YESTERDAY') {
        const yest = new Date(now);
        yest.setDate(now.getDate() - 1);
        return oDateStr === yest.toISOString().slice(0, 10);
      }
      if (dateFilter === 'THIS_MONTH') {
        return oDate.getMonth() === now.getMonth() && oDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [orders, dateFilter]);

  // Overall KPI metrics
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.netTotal || o.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const dineInOrders = filteredOrders.filter(o => o.orderType !== 'Takeaway');
  const takeawayOrders = filteredOrders.filter(o => o.orderType === 'Takeaway');
  const totalDiscounts = filteredOrders.reduce((sum, o) => sum + (o.discountAmount || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // 1. Daily Sales Report
  const dailySalesData = useMemo(() => {
    const dayMap = {};
    filteredOrders.forEach(o => {
      const d = new Date(o.timestamp || o.created_at || Date.now()).toLocaleDateString();
      if (!dayMap[d]) dayMap[d] = { date: d, revenue: 0, count: 0, discounts: 0 };
      dayMap[d].revenue += (o.netTotal || o.total || 0);
      dayMap[d].count += 1;
      dayMap[d].discounts += (o.discountAmount || 0);
    });
    return Object.values(dayMap).sort((a,b) => new Date(b.date) - new Date(a.date));
  }, [filteredOrders]);

  // 2. Monthly Sales Report
  const monthlySalesData = useMemo(() => {
    const monthMap = {};
    filteredOrders.forEach(o => {
      const d = new Date(o.timestamp || o.created_at || Date.now());
      const key = `${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`;
      if (!monthMap[key]) monthMap[key] = { month: key, revenue: 0, count: 0 };
      monthMap[key].revenue += (o.netTotal || o.total || 0);
      monthMap[key].count += 1;
    });
    return Object.values(monthMap);
  }, [filteredOrders]);

  // 3. Item-wise Sales Report
  const itemWiseData = useMemo(() => {
    const itemMap = {};
    filteredOrders.forEach(o => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(item => {
          const key = item.name;
          if (!itemMap[key]) itemMap[key] = { name: key, category: item.category || 'General', qty: 0, revenue: 0 };
          itemMap[key].qty += (item.quantity || 1);
          itemMap[key].revenue += (item.price * (item.quantity || 1));
        });
      }
    });
    return Object.values(itemMap).sort((a,b) => b.qty - a.qty);
  }, [filteredOrders]);

  // 4. Category-wise Sales Report
  const categoryWiseData = useMemo(() => {
    const catMap = {};
    itemWiseData.forEach(item => {
      const cat = item.category;
      if (!catMap[cat]) catMap[cat] = { category: cat, qty: 0, revenue: 0 };
      catMap[cat].qty += item.qty;
      catMap[cat].revenue += item.revenue;
    });
    return Object.values(catMap).sort((a,b) => b.revenue - a.revenue);
  }, [itemWiseData]);

  // 5. Waiter-wise Sales Report
  const waiterWiseData = useMemo(() => {
    const wMap = {};
    filteredOrders.forEach(o => {
      const w = o.waiterName || 'Staff';
      if (!wMap[w]) wMap[w] = { name: w, count: 0, revenue: 0 };
      wMap[w].count += 1;
      wMap[w].revenue += (o.netTotal || o.total || 0);
    });
    return Object.values(wMap).sort((a,b) => b.revenue - a.revenue);
  }, [filteredOrders]);

  // 6. Payment-wise Sales Report
  const paymentWiseData = useMemo(() => {
    const pMap = { Cash: 0, UPI: 0, Card: 0 };
    filteredOrders.forEach(o => {
      const pm = o.paymentMethod || 'Cash';
      if (!pMap[pm]) pMap[pm] = 0;
      pMap[pm] += (o.netTotal || o.total || 0);
    });
    return Object.entries(pMap).map(([method, amount]) => ({ method, amount }));
  }, [filteredOrders]);

  // 7. Customer-wise Sales Report
  const customerWiseData = useMemo(() => {
    const cMap = {};
    filteredOrders.forEach(o => {
      const mob = o.customerMobile || 'Walk-in';
      const name = o.customerName || 'Customer';
      if (!cMap[mob]) cMap[mob] = { mobile: mob, name, visits: 0, totalSpend: 0 };
      cMap[mob].visits += 1;
      cMap[mob].totalSpend += (o.netTotal || o.total || 0);
    });
    return Object.values(cMap).sort((a,b) => b.totalSpend - a.totalSpend);
  }, [filteredOrders]);

  // Export to CSV helper
  const exportCurrentReportCSV = () => {
    let headers = [];
    let rows = [];

    if (activeReportTab === 'DAILY') {
      headers = ['Date', 'Total Orders', 'Discounts (₹)', 'Net Sales Revenue (₹)'];
      rows = dailySalesData.map(d => [d.date, d.count, d.discounts, d.revenue]);
    } else if (activeReportTab === 'MONTHLY') {
      headers = ['Month', 'Orders Count', 'Net Sales Revenue (₹)'];
      rows = monthlySalesData.map(m => [m.month, m.count, m.revenue]);
    } else if (activeReportTab === 'ITEM') {
      headers = ['Item Name', 'Category', 'Quantity Sold', 'Total Revenue (₹)'];
      rows = itemWiseData.map(i => [i.name, i.category, i.qty, i.revenue]);
    } else if (activeReportTab === 'CATEGORY') {
      headers = ['Category', 'Total Items Sold', 'Total Revenue (₹)'];
      rows = categoryWiseData.map(c => [c.category, c.qty, c.revenue]);
    } else if (activeReportTab === 'WAITER') {
      headers = ['Waiter Name', 'Orders Processed', 'Total Sales Handled (₹)'];
      rows = waiterWiseData.map(w => [w.name, w.count, w.revenue]);
    } else if (activeReportTab === 'PAYMENT') {
      headers = ['Payment Method', 'Total Sales Amount (₹)'];
      rows = paymentWiseData.map(p => [p.method, p.amount]);
    } else if (activeReportTab === 'CUSTOMER') {
      headers = ['Mobile / Customer', 'Name', 'Total Orders', 'Total Spending (₹)'];
      rows = customerWiseData.map(c => [c.mobile, c.name, c.visits, c.totalSpend]);
    } else if (activeReportTab === 'PROFIT') {
      headers = ['Metric', 'Amount (₹)'];
      rows = [
        ['Total Sales Revenue', totalRevenue],
        ['Total Recorded Expenses', totalExpenses],
        ['Net Operating Profit', netProfit]
      ];
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VRS_Dhaba_${activeReportTab}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports-suite-container">
      {/* Top Header Card */}
      <div className="reports-header-card">
        <div className="r-header-title">
          <div>
            <h2>📊 Admin Reports & Financial Analytics</h2>
            <p>Complete sales breakdown, item rankings, payment splits, waiter performance & profit summary</p>
          </div>
          <div className="r-top-actions">
            <div className="date-filter-group">
              <button className={dateFilter === 'ALL' ? 'active' : ''} onClick={() => setDateFilter('ALL')}>All Time</button>
              <button className={dateFilter === 'TODAY' ? 'active' : ''} onClick={() => setDateFilter('TODAY')}>Today</button>
              <button className={dateFilter === 'YESTERDAY' ? 'active' : ''} onClick={() => setDateFilter('YESTERDAY')}>Yesterday</button>
              <button className={dateFilter === 'THIS_MONTH' ? 'active' : ''} onClick={() => setDateFilter('THIS_MONTH')}>This Month</button>
            </div>
            <button className="btn-export-csv" onClick={exportCurrentReportCSV}>
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card green">
            <div className="kpi-icon"><TrendingUp size={22} /></div>
            <div>
              <span>Total Net Revenue</span>
              <h3>₹{totalRevenue}</h3>
              <small>{totalOrdersCount} Total Orders</small>
            </div>
          </div>

          <div className="kpi-card blue">
            <div className="kpi-icon"><ShoppingBag size={22} /></div>
            <div>
              <span>Dine-in vs Takeaway</span>
              <h3>₹{dineInOrders.reduce((a,b)=>a+(b.netTotal||b.total||0),0)}</h3>
              <small>Takeaway: ₹{takeawayOrders.reduce((a,b)=>a+(b.netTotal||b.total||0),0)}</small>
            </div>
          </div>

          <div className="kpi-card orange">
            <div className="kpi-icon"><Percent size={22} /></div>
            <div>
              <span>Discounts Given</span>
              <h3>₹{totalDiscounts}</h3>
              <small>Promotional & Coupons</small>
            </div>
          </div>

          <div className="kpi-card purple">
            <div className="kpi-icon"><DollarSign size={22} /></div>
            <div>
              <span>Net Estimated Profit</span>
              <h3>₹{netProfit}</h3>
              <small>Revenue (₹{totalRevenue}) - Expenses (₹{totalExpenses})</small>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Navigation Tabs */}
      <div className="report-tabs-bar">
        <button className={activeReportTab === 'DAILY' ? 'active' : ''} onClick={() => setActiveReportTab('DAILY')}>📅 Daily Sales</button>
        <button className={activeReportTab === 'MONTHLY' ? 'active' : ''} onClick={() => setActiveReportTab('MONTHLY')}>📆 Monthly Sales</button>
        <button className={activeReportTab === 'ITEM' ? 'active' : ''} onClick={() => setActiveReportTab('ITEM')}>🍛 Item-wise Sales</button>
        <button className={activeReportTab === 'CATEGORY' ? 'active' : ''} onClick={() => setActiveReportTab('CATEGORY')}>📂 Category-wise</button>
        <button className={activeReportTab === 'WAITER' ? 'active' : ''} onClick={() => setActiveReportTab('WAITER')}>👨‍🍳 Waiter Sales</button>
        <button className={activeReportTab === 'PAYMENT' ? 'active' : ''} onClick={() => setActiveReportTab('PAYMENT')}>💳 Payment Split</button>
        <button className={activeReportTab === 'CUSTOMER' ? 'active' : ''} onClick={() => setActiveReportTab('CUSTOMER')}>👤 Customer Sales</button>
        <button className={activeReportTab === 'PROFIT' ? 'active' : ''} onClick={() => setActiveReportTab('PROFIT')}>💰 Profit & Expense Summary</button>
      </div>

      {/* Main Report View Content */}
      <div className="report-content-card">
        {/* 1. Daily Sales */}
        {activeReportTab === 'DAILY' && (
          <div className="report-table-view">
            <h3>📅 Daily Sales Report</h3>
            <table className="rpt-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Orders Count</th>
                  <th>Discounts Given</th>
                  <th>Net Sales Revenue</th>
                </tr>
              </thead>
              <tbody>
                {dailySalesData.map((d, i) => (
                  <tr key={i}>
                    <td><strong>{d.date}</strong></td>
                    <td>{d.count} orders</td>
                    <td className="orange-txt">₹{d.discounts}</td>
                    <td className="green-txt"><strong>₹{d.revenue}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. Monthly Sales */}
        {activeReportTab === 'MONTHLY' && (
          <div className="report-table-view">
            <h3>📆 Monthly Sales Report</h3>
            <table className="rpt-table">
              <thead>
                <tr>
                  <th>Month & Year</th>
                  <th>Total Orders</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {monthlySalesData.map((m, i) => (
                  <tr key={i}>
                    <td><strong>{m.month}</strong></td>
                    <td>{m.count} orders</td>
                    <td className="green-txt"><strong>₹{m.revenue}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Item-wise Sales */}
        {activeReportTab === 'ITEM' && (
          <div className="report-table-view">
            <h3>🍛 Item-wise Sales Ranking</h3>
            <table className="rpt-table">
              <thead>
                <tr>
                  <th>Rank & Dish Name</th>
                  <th>Category</th>
                  <th>Quantity Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {itemWiseData.map((item, i) => (
                  <tr key={i}>
                    <td><strong>#{i+1} {item.name}</strong></td>
                    <td><span className="cat-chip">{item.category}</span></td>
                    <td><strong>{item.qty} plates</strong></td>
                    <td className="green-txt">₹{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Category-wise Sales */}
        {activeReportTab === 'CATEGORY' && (
          <div className="report-table-view">
            <h3>📂 Category-wise Revenue Split</h3>
            <div className="cat-progress-list">
              {categoryWiseData.map((c, i) => {
                const percent = totalRevenue ? Math.round((c.revenue / totalRevenue) * 100) : 0;
                return (
                  <div key={i} className="cat-bar-item">
                    <div className="cat-bar-header">
                      <strong>{c.category} ({c.qty} items sold)</strong>
                      <span>₹{c.revenue} ({percent}%)</span>
                    </div>
                    <div className="progress-bg">
                      <div className="progress-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Waiter-wise Sales */}
        {activeReportTab === 'WAITER' && (
          <div className="report-table-view">
            <h3>👨‍🍳 Waiter Performance Report</h3>
            <table className="rpt-table">
              <thead>
                <tr>
                  <th>Staff / Waiter Name</th>
                  <th>Orders Processed</th>
                  <th>Total Revenue Handled</th>
                </tr>
              </thead>
              <tbody>
                {waiterWiseData.map((w, i) => (
                  <tr key={i}>
                    <td><strong>{w.name}</strong></td>
                    <td>{w.count} orders</td>
                    <td className="green-txt">₹{w.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. Payment-wise Sales */}
        {activeReportTab === 'PAYMENT' && (
          <div className="report-table-view">
            <h3>💳 Payment Method Split (Cash / UPI / Card)</h3>
            <div className="payment-cards-grid">
              {paymentWiseData.map(p => (
                <div key={p.method} className="payment-kpi-card">
                  <span className="p-method">{p.method}</span>
                  <h3 className="p-amount">₹{p.amount}</h3>
                  <small>{totalRevenue ? Math.round((p.amount / totalRevenue) * 100) : 0}% of total sales</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Customer-wise Sales */}
        {activeReportTab === 'CUSTOMER' && (
          <div className="report-table-view">
            <h3>👤 High-Value Customer Report</h3>
            <table className="rpt-table">
              <thead>
                <tr>
                  <th>Rank & Customer</th>
                  <th>Mobile Number</th>
                  <th>Total Visits / Orders</th>
                  <th>Total Spending</th>
                </tr>
              </thead>
              <tbody>
                {customerWiseData.map((c, i) => (
                  <tr key={i}>
                    <td><strong>#{i+1} {c.name}</strong></td>
                    <td>{c.mobile}</td>
                    <td>{c.visits} visits</td>
                    <td className="green-txt">₹{c.totalSpend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 8. Profit & Expense Summary */}
        {activeReportTab === 'PROFIT' && (
          <div className="report-table-view">
            <h3>💰 Profit & Expense Summary Statement</h3>
            <div className="profit-summary-box">
              <div className="p-row">
                <span>Total Net Sales Revenue</span>
                <strong className="green-txt">+ ₹{totalRevenue}</strong>
              </div>
              <div className="p-row">
                <span>Total Operating Expenses</span>
                <strong className="red-txt">- ₹{totalExpenses}</strong>
              </div>
              <div className="p-row grand-profit">
                <span>Net Estimated Operating Profit</span>
                <strong className={netProfit >= 0 ? 'green-txt' : 'red-txt'}>₹{netProfit}</strong>
              </div>
              <p className="profit-margin-pill">
                Net Profit Margin: <strong>{totalRevenue ? Math.round((netProfit / totalRevenue) * 100) : 0}%</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reports-suite-container { display: flex; flex-direction: column; gap: 20px; }
        .reports-header-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; display: flex; flex-direction: column; gap: 20px; }
        .r-header-title { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 15px; }
        .r-header-title h2 { font-size: 1.5rem; color: #111; margin-bottom: 4px; }
        .r-header-title p { color: #666; font-size: 0.9rem; }

        .r-top-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .date-filter-group { display: flex; background: #F1F5F9; padding: 4px; border-radius: 12px; gap: 4px; }
        .date-filter-group button { border: none; background: transparent; padding: 6px 14px; border-radius: 8px; font-weight: 700; font-size: 0.8rem; color: #475569; cursor: pointer; }
        .date-filter-group button.active { background: white; color: #0F172A; box-shadow: 0 2px 6px rgba(0,0,0,0.06); }
        .btn-export-csv { background: #E8621A; color: white; border: none; padding: 10px 16px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; }

        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
        .kpi-card { border-radius: 16px; padding: 18px; display: flex; align-items: center; gap: 14px; border: 1px solid transparent; }
        .kpi-card.green { background: #F0FDF4; border-color: #DCFCE7; color: #166534; }
        .kpi-card.blue { background: #EFF6FF; border-color: #BFDBFE; color: #1E40AF; }
        .kpi-card.orange { background: #FFF7ED; border-color: #FFEDD5; color: #C2410C; }
        .kpi-card.purple { background: #F3E8FF; border-color: #E9D5FF; color: #6B21A8; }

        .kpi-icon { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.8); display: flex; align-items: center; justify-content: center; }
        .kpi-card span { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; opacity: 0.8; }
        .kpi-card h3 { font-size: 1.5rem; font-weight: 900; margin: 2px 0; }
        .kpi-card small { font-size: 0.75rem; opacity: 0.8; }

        .report-tabs-bar { display: flex; overflow-x: auto; gap: 8px; padding-bottom: 4px; }
        .report-tabs-bar button { flex: 0 0 auto; background: white; border: 1px solid #E2E8F0; padding: 10px 16px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; color: #475569; cursor: pointer; }
        .report-tabs-bar button.active { background: #1A1208; color: white; border-color: #1A1208; }

        .report-content-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid #F0F0F0; min-height: 350px; }
        .report-table-view h3 { font-size: 1.2rem; color: #1E293B; margin-bottom: 18px; }

        .rpt-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
        .rpt-table th { background: #F8FAFC; padding: 12px; border-bottom: 2px solid #E2E8F0; color: #475569; font-weight: 700; }
        .rpt-table td { padding: 12px; border-bottom: 1px solid #F1F5F9; color: #1E293B; }
        .green-txt { color: #16A34A; }
        .red-txt { color: #DC2626; }
        .orange-txt { color: #EA580C; }

        .cat-chip { background: #F1F5F9; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 600; color: #475569; }

        .cat-progress-list { display: flex; flex-direction: column; gap: 16px; }
        .cat-bar-item { display: flex; flex-direction: column; gap: 6px; }
        .cat-bar-header { display: flex; justify-content: space-between; font-size: 0.9rem; color: #334155; }
        .progress-bg { background: #F1F5F9; height: 12px; border-radius: 50px; overflow: hidden; }
        .progress-fill { background: #E8621A; height: 100%; border-radius: 50px; }

        .payment-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .payment-kpi-card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; text-align: center; }
        .p-method { font-weight: 800; text-transform: uppercase; color: #475569; font-size: 0.85rem; }
        .p-amount { font-size: 1.8rem; font-weight: 900; color: #0F172A; margin: 8px 0; }

        .profit-summary-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 20px; padding: 24px; max-width: 500px; display: flex; flex-direction: column; gap: 14px; }
        .p-row { display: flex; justify-content: space-between; font-size: 1rem; color: #334155; }
        .grand-profit { border-top: 2px dashed #CBD5E1; padding-top: 14px; font-size: 1.2rem; font-weight: 800; }
        .profit-margin-pill { background: #DCFCE7; color: #166534; padding: 8px 14px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; text-align: center; margin-top: 6px; }
      `}</style>
    </div>
  );
};
