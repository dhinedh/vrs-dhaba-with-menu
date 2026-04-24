require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
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

const orderSchema = new mongoose.Schema({
  id: String, // Custom ID like ORD-123
  tableNumber: String,
  items: Array,
  total: Number,
  notes: String,
  status: { type: String, default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
  name: { type: String, default: "VRS Garden Dhaba" },
  tagline: { type: String, default: "Fresh & Tasty" },
  gst: { type: Number, default: 5 }
});

const Menu = mongoose.model('Menu', menuSchema);
const Order = mongoose.model('Order', orderSchema);
const Settings = mongoose.model('Settings', settingsSchema);

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

// --- STATS ---
app.get('/api/stats', async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    res.json({
      totalRevenue,
      totalOrders: orders.length,
      pendingCount: orders.filter(o => o.status === 'Pending').length,
      completedCount: orders.filter(o => o.status === 'Ready').length
    });
  } catch (err) { res.status(500).json(err); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MongoDB Backend running on http://localhost:${PORT}`);
});
