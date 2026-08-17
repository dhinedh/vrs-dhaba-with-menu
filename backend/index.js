require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const allowedFrontend = process.env.FRONTEND_URL;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin === allowedFrontend) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// --- SCHEMAS & MODELS ---
const menuSchema = new mongoose.Schema({
  no: String,
  code: String,
  name: String,
  name_en: String,
  name_ta: String,
  price: Number,
  category: String,
  category_id: Number,
  veg: { type: Boolean, default: true },
  available: { type: Boolean, default: true },
  is_special: { type: Boolean, default: false }
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: String,
  birthday: String,
  anniversary: String,
  notes: String,
  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },
  totalVisits: { type: Number, default: 1 },
  totalSpend: { type: Number, default: 0 },
  tags: [String]
});

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: String,
  discountType: { type: String, enum: ['flat', 'percentage', 'happy_hours', 'first_order', 'combo', 'festival'], default: 'flat' },
  discountValue: Number,
  minBillAmount: { type: Number, default: 0 },
  validUntil: String,
  isActive: { type: Boolean, default: true },
  notes: String
});

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true }, // 'Vegetables', 'Meat', 'Gas', 'Rent', 'Salary', 'Others'
  amount: { type: Number, required: true },
  notes: String,
  date: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  id: String, // Custom ID like ORD-123
  tableNumber: String,
  tokenNumber: String, // e.g. TK-01
  items: Array,
  total: Number,
  subtotal: Number,
  packagingCharge: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  discountCode: String,
  netTotal: Number,
  customerMobile: String,
  customerName: String,
  orderType: { type: String, default: 'Dine-in' }, // Dine-in vs Takeaway
  estimatedPickupTime: String, // e.g. 15 mins
  takeawayStatus: { type: String, default: 'Order' }, // Order, Kitchen, Ready, Packing, Billing, Payment, Completed
  waiterName: { type: String, default: 'Staff' },
  paymentMethod: { type: String, default: 'Cash' }, // Cash, UPI, Card
  notes: String,
  status: { type: String, default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  name: { type: String, default: "VRS Garden Dhaba" },
  tagline: { type: String, default: "Fresh & Tasty" },
  gst: { type: Number, default: 5 },
  packagingCharge: { type: Number, default: 15 }
});

const Menu = mongoose.model('Menu', menuSchema);
const Order = mongoose.model('Order', orderSchema);
const Settings = mongoose.model('Settings', settingsSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Offer = mongoose.model('Offer', offerSchema);
const Expense = mongoose.model('Expense', expenseSchema);

// Helper to format Mongo docs for frontend
const format = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.id = obj._id.toString();
  return obj;
};

// --- MENU ROUTES ---
app.get('/api/menu', async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items.map(i => ({
      ...i.toObject(),
      id: i._id.toString(),
      name: i.name_en || i.name,
      no: i.code || i.no
    })));
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/menu', async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    await newItem.save();
    res.json(format(newItem));
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    await Menu.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- ORDER ROUTES ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders.map(o => ({ ...o.toObject(), id: o._id.toString() })));
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    // Auto update or create Customer record if customerMobile provided
    if (newOrder.customerMobile && newOrder.customerMobile.trim().length >= 10) {
      const mob = newOrder.customerMobile.trim();
      let customer = await Customer.findOne({ mobile: mob });
      const orderSpend = newOrder.netTotal || newOrder.total || 0;
      if (customer) {
        customer.totalVisits += 1;
        customer.totalSpend += orderSpend;
        customer.lastVisit = new Date();
        if (newOrder.customerName && (!customer.name || customer.name === "Guest")) {
          customer.name = newOrder.customerName;
        }
        await customer.save();
      } else {
        customer = new Customer({
          name: newOrder.customerName || "Customer",
          mobile: mob,
          totalVisits: 1,
          totalSpend: orderSpend,
          firstVisit: new Date(),
          lastVisit: new Date(),
          tags: ["New Customer"]
        });
        await customer.save();
      }
    }

    res.json({ ...newOrder.toObject(), id: newOrder._id.toString() });
  } catch (err) { res.status(500).json(err); }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- CUSTOMER ROUTES ---
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ lastVisit: -1 });
    res.json(customers.map(format));
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.json(format(newCustomer));
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- OFFERS ROUTES ---
app.get('/api/offers', async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers.map(format));
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/offers', async (req, res) => {
  try {
    const newOffer = new Offer(req.body);
    await newOffer.save();
    res.json(format(newOffer));
  } catch (err) { res.status(500).json(err); }
});

app.put('/api/offers/:id', async (req, res) => {
  try {
    await Offer.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/offers/:id', async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- EXPENSES ROUTES ---
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses.map(format));
  } catch (err) { res.status(500).json(err); }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const newExp = new Expense(req.body);
    await newExp.save();
    res.json(format(newExp));
  } catch (err) { res.status(500).json(err); }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- SETTINGS ---
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) { 
    res.json({ name: "VRS Garden Dhaba", tagline: "Fresh & Tasty", gst: 5 });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (settings) {
      Object.assign(settings, req.body);
      await settings.save();
    } else {
      settings = new Settings(req.body);
      await settings.save();
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// --- STATS & REPORTS ---
app.get('/api/stats', async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, o) => acc + (o.netTotal || o.total || 0), 0);
    const dineInRevenue = orders.filter(o => o.orderType !== 'Takeaway').reduce((acc, o) => acc + (o.netTotal || o.total || 0), 0);
    const takeawayRevenue = orders.filter(o => o.orderType === 'Takeaway').reduce((acc, o) => acc + (o.netTotal || o.total || 0), 0);
    
    res.json({
      totalRevenue,
      dineInRevenue,
      takeawayRevenue,
      totalOrders: orders.length,
      pendingCount: orders.filter(o => o.status === 'Pending').length,
      completedCount: orders.filter(o => o.status === 'Ready' || o.status === 'Billed').length
    });
  } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MongoDB Backend running on http://localhost:${PORT}`);
});
