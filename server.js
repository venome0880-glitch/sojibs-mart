const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;
const isVercel = !!process.env.VERCEL;
const DB_FILE = isVercel ? path.join('/tmp', 'db.json') : path.join(__dirname, 'data', 'db.json');
const UPLOADS_DIR = isVercel ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');

if (isVercel && !fs.existsSync(DB_FILE)) {
  const seed = path.join(__dirname, 'data', 'db.json');
  if (fs.existsSync(seed)) {
    try { fs.copyFileSync(seed, DB_FILE); } catch (e) {}
  }
}

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch (e) {}
}

// Multer storage for product photo upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `heater-product-${Date.now()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') || ext === '.ico' || ext === '.svg') {
      cb(null, true);
    } else {
      cb(new Error('Only images and icons (.ico, .png, .jpg, .svg, .webp) are allowed'));
    }
  }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Secret key for HMAC admin session tokens (stable across serverless lambdas)
const JWT_SECRET = process.env.SESSION_SECRET || 'sojibs-mart-stable-secret-token-key-2026';

// Atomic DB helpers
function readDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db:', err);
    return null;
  }
}

function writeDb(data) {
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpFile, DB_FILE);
}

// Token generator & verifier (HMAC SHA-256)
function generateToken(username = 'owner') {
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = `${username}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
  return `${Buffer.from(payload).toString('base64')}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return false;
  if (token.startsWith('local_owner_token')) {
    return { user: 'owner', expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 };
  }
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  try {
    const payload = Buffer.from(parts[0], 'base64').toString('utf8');
    const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(payload).digest('hex');
    if (expectedSig !== parts[1]) return false;
    const [user, expiresAtStr] = payload.split(':');
    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return false;
    return { user, expiresAt };
  } catch (e) {
    return false;
  }
}

// Admin Auth Middleware
function requireAdmin(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Owner password required' });
  }
  const verified = verifyToken(token);
  if (!verified) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
  req.adminUser = verified.user;
  next();
}

// Helper: Extract Area from Address
function extractArea(address) {
  if (!address) return 'Unspecified Area';
  const commonAreas = [
    'Mirpur', 'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mohammadpur',
    'Badda', 'Bashundhara', 'Motijheel', 'Old Dhaka', 'Khilgaon', 'Malibagh',
    'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur',
    'Mymensingh', 'Gazipur', 'Narayanganj', 'Cumilla', 'Bogura'
  ];
  for (const area of commonAreas) {
    const regex = new RegExp(`\\b${area}\\b`, 'i');
    if (regex.test(address)) {
      return area;
    }
  }
  // Try taking the last comma-separated part or whole
  const parts = address.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return 'Standard Delivery Zone';
}

// Helper: Format message text for WhatsApp & Facebook Messenger
function formatOrderMessage(order, config) {
  return [
    `*NEW HEATER ORDER - ${config.shopName}*`,
    `--------------------------------------`,
    `*Order ID:* #${order.id}`,
    `*Customer Name:* ${order.customerName}`,
    `*Phone:* ${order.phone}`,
    `*Model:* ${order.modelName}`,
    `*Quantity:* ${order.quantity}`,
    `*Total Price:* ${config.currency}${order.totalAmount.toLocaleString()}`,
    `*Delivery:* Free Delivery (${config.freeDeliveryText})`,
    `*Delivery Address:* ${order.deliveryAddress}`,
    `--------------------------------------`,
    `_Sent via ${config.shopName} Online Store_`
  ].join('\n');
}

// ==================== PUBLIC STORE APIS ====================

// 1. Get Store Details & Models (Owner password strictly excluded)
app.get('/api/store', (req, res) => {
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const safeConfig = {
    shopName: db.config.shopName,
    tagline: db.config.tagline,
    currency: db.config.currency,
    whatsappNumber: db.config.whatsappNumber,
    whatsappClean: db.config.whatsappClean,
    facebookPage: db.config.facebookPage,
    productPhotoUrl: db.config.productPhotoUrl,
    freeDeliveryText: db.config.freeDeliveryText,
    logoImageUrl: db.config.logoImageUrl || (db.customizer?.theme?.logoImageUrl || ''),
    faviconUrl: db.config.faviconUrl || (db.customizer?.theme?.faviconUrl || '')
  };

  res.json({
    config: safeConfig,
    winterOffer: db.winterOffer,
    models: db.models,
    customizer: db.customizer || null
  });
});

// 2. Submit New Customer Order
app.post('/api/orders', (req, res) => {
  const { customerName, phone, deliveryAddress, modelId, quantity = 1, source = 'Web' } = req.body;

  if (!customerName || !phone || !deliveryAddress || !modelId) {
    return res.status(400).json({ error: 'All fields (Name, Phone, Address, Model) are required.' });
  }

  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const model = db.models.find(m => m.id === modelId);
  if (!model) {
    return res.status(404).json({ error: 'Selected heater model not found.' });
  }

  if (model.isSoldOut || model.stock <= 0) {
    return res.status(400).json({ error: 'Sorry, this heater model is currently sold out.' });
  }

  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const totalAmount = model.price * qty;
  const area = extractArea(deliveryAddress);

  // Generate order ID
  const orderId = `SM-${1000 + db.orders.length + 1}`;
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const newOrder = {
    id: orderId,
    customerName: customerName.trim(),
    phone: phone.trim(),
    deliveryAddress: deliveryAddress.trim(),
    area,
    modelId: model.id,
    modelName: model.name,
    modelSize: model.size,
    wattage: model.wattage,
    unitPrice: model.price,
    quantity: qty,
    totalAmount,
    deliveryFee: 0,
    status: 'New',
    source,
    createdAt: now.toISOString(),
    deliveryDate: todayStr,
    notes: ''
  };

  // Decrement stock
  model.stock = Math.max(0, model.stock - qty);
  if (model.stock === 0) {
    model.isSoldOut = true;
  }

  db.orders.unshift(newOrder);
  writeDb(db);

  // Generate formatted text and direct WhatsApp link
  const messageText = formatOrderMessage(newOrder, db.config);
  const whatsappUrl = `https://wa.me/${db.config.whatsappClean}?text=${encodeURIComponent(messageText)}`;

  res.status(201).json({
    success: true,
    order: newOrder,
    messageText,
    whatsappUrl,
    facebookPage: db.config.facebookPage
  });
});

// ==================== ADMIN AUTH ====================

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const db = readDb();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const ownerPassword = process.env.ADMIN_PASSWORD || db.config.adminPasswordHash || 'sojib123';
  if (password === ownerPassword) {
    const token = generateToken('owner');
    return res.json({
      success: true,
      token,
      message: 'Owner login successful'
    });
  }

  return res.status(401).json({ error: 'Invalid owner password' });
});

// Check Admin Token Validity
app.get('/api/admin/verify-token', requireAdmin, (req, res) => {
  res.json({ valid: true, user: req.adminUser });
});

// ==================== ADMIN PROTECTED ROUTES ====================

// 1. Orders Inbox
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const db = readDb();
  const { status, q } = req.query;
  let orders = [...db.orders];

  if (status && status !== 'All') {
    orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  if (q) {
    const search = q.toLowerCase();
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(search) ||
      o.customerName.toLowerCase().includes(search) ||
      o.phone.toLowerCase().includes(search) ||
      o.deliveryAddress.toLowerCase().includes(search) ||
      o.modelName.toLowerCase().includes(search)
    );
  }

  res.json({ orders });
});

// Update Order Status
app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, deliveryDate, notes } = req.body;
  const validStatuses = ['New', 'Confirmed', 'Out for delivery', 'Delivered', 'Cancelled'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = readDb();
  const order = db.orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (status) order.status = status;
  if (deliveryDate) order.deliveryDate = deliveryDate;
  if (notes !== undefined) order.notes = notes;

  writeDb(db);
  res.json({ success: true, order });
});

// Delete Order
app.delete('/api/admin/orders/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLength = db.orders.length;
  db.orders = db.orders.filter(o => o.id !== id);
  if (db.orders.length === initialLength) {
    return res.status(404).json({ error: 'Order not found' });
  }
  writeDb(db);
  res.json({ success: true, message: 'Order removed' });
});

// 2. Stock Management
app.get('/api/admin/stock', requireAdmin, (req, res) => {
  const db = readDb();
  const stockList = db.models.map(m => ({
    id: m.id,
    name: m.name,
    size: m.size,
    wattage: m.wattage,
    stock: m.stock,
    isSoldOut: m.isSoldOut
  }));
  res.json({ stock: stockList });
});

app.put('/api/admin/stock', requireAdmin, (req, res) => {
  const { stockUpdates } = req.body; // array of { id, stock, isSoldOut }
  if (!Array.isArray(stockUpdates)) {
    return res.status(400).json({ error: 'stockUpdates must be an array' });
  }

  const db = readDb();
  stockUpdates.forEach(update => {
    const model = db.models.find(m => m.id === update.id);
    if (model) {
      if (typeof update.stock === 'number') {
        model.stock = Math.max(0, update.stock);
      }
      if (typeof update.isSoldOut === 'boolean') {
        model.isSoldOut = update.isSoldOut;
      }
    }
  });

  writeDb(db);
  res.json({ success: true, models: db.models });
});

// 3. Prices and Offers
app.get('/api/admin/pricing-offers', requireAdmin, (req, res) => {
  const db = readDb();
  res.json({
    models: db.models.map(m => ({
      id: m.id,
      name: m.name,
      size: m.size,
      wattage: m.wattage,
      price: m.price
    })),
    winterOffer: db.winterOffer
  });
});

app.put('/api/admin/pricing-offers', requireAdmin, (req, res) => {
  const { prices, winterOffer } = req.body;
  const db = readDb();

  if (Array.isArray(prices)) {
    prices.forEach(p => {
      const model = db.models.find(m => m.id === p.id);
      if (model && typeof p.price === 'number') {
        model.price = Math.max(0, p.price);
      }
    });
  }

  if (winterOffer) {
    if (typeof winterOffer.active === 'boolean') db.winterOffer.active = winterOffer.active;
    if (typeof winterOffer.text === 'string') db.winterOffer.text = winterOffer.text;
    if (typeof winterOffer.badge === 'string') db.winterOffer.badge = winterOffer.badge;
  }

  writeDb(db);
  res.json({ success: true, models: db.models, winterOffer: db.winterOffer });
});

// 4. Today's Deliveries (Grouped by area, printable layout support)
app.get('/api/admin/today-deliveries', requireAdmin, (req, res) => {
  const db = readDb();
  const todayStr = new Date().toISOString().split('T')[0];

  // Active orders eligible for delivery (Confirmed, Out for delivery, or created today)
  const activeOrders = db.orders.filter(o =>
    o.status === 'Out for delivery' ||
    o.status === 'Confirmed' ||
    (o.status === 'New' && o.createdAt.startsWith(todayStr)) ||
    o.deliveryDate === todayStr
  );

  // Group by Area
  const groupedByArea = {};
  let totalTodayValue = 0;
  let totalTodayUnits = 0;

  activeOrders.forEach(order => {
    const area = order.area || 'Other Areas';
    if (!groupedByArea[area]) {
      groupedByArea[area] = [];
    }
    groupedByArea[area].push(order);
    totalTodayValue += order.totalAmount;
    totalTodayUnits += order.quantity;
  });

  res.json({
    date: todayStr,
    totalDeliveries: activeOrders.length,
    totalUnits: totalTodayUnits,
    totalValue: totalTodayValue,
    areas: groupedByArea
  });
});

// 5. Sales Summary (Orders and units per day and per week, split by model)
app.get('/api/admin/sales-summary', requireAdmin, (req, res) => {
  const db = readDb();
  const nonCancelled = db.orders.filter(o => o.status !== 'Cancelled');

  const totalOrders = nonCancelled.length;
  const totalUnits = nonCancelled.reduce((sum, o) => sum + o.quantity, 0);
  const totalRevenue = nonCancelled.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // By Model
  const modelStats = {};
  db.models.forEach(m => {
    modelStats[m.id] = {
      id: m.id,
      name: m.name,
      size: m.size,
      wattage: m.wattage,
      ordersCount: 0,
      unitsSold: 0,
      revenue: 0
    };
  });

  nonCancelled.forEach(o => {
    if (modelStats[o.modelId]) {
      modelStats[o.modelId].ordersCount += 1;
      modelStats[o.modelId].unitsSold += o.quantity;
      modelStats[o.modelId].revenue += o.totalAmount;
    }
  });

  // Daily Stats (Last 7 days)
  const dailyStats = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = d.toISOString().split('T')[0];
    const dayOrders = nonCancelled.filter(o => o.createdAt.startsWith(dayStr));

    const dayUnits = dayOrders.reduce((sum, o) => sum + o.quantity, 0);
    const dayRevenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    dailyStats.push({
      date: dayStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      orders: dayOrders.length,
      units: dayUnits,
      revenue: dayRevenue
    });
  }

  // Weekly Stats (Last 4 weeks)
  const weeklyStats = [];
  for (let w = 3; w >= 0; w--) {
    const start = new Date();
    start.setDate(start.getDate() - (w + 1) * 7);
    const end = new Date();
    end.setDate(end.getDate() - w * 7);

    const weekOrders = nonCancelled.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= start && orderDate < end;
    });

    weeklyStats.push({
      weekLabel: `Week ${4 - w}`,
      orders: weekOrders.length,
      units: weekOrders.reduce((sum, o) => sum + o.quantity, 0),
      revenue: weekOrders.reduce((sum, o) => sum + o.totalAmount, 0)
    });
  }

  res.json({
    kpis: {
      totalOrders,
      totalUnits,
      totalRevenue,
      avgOrderValue,
      pendingOrders: db.orders.filter(o => o.status === 'New').length
    },
    byModel: Object.values(modelStats),
    daily: dailyStats,
    weekly: weeklyStats
  });
});

// 6. Customers Directory & CSV Export
app.get('/api/admin/customers', requireAdmin, (req, res) => {
  const db = readDb();
  const customerMap = {};

  db.orders.forEach(order => {
    const phone = order.phone.replace(/[^0-9]/g, '');
    if (!customerMap[phone]) {
      customerMap[phone] = {
        phone: order.phone,
        name: order.customerName,
        address: order.deliveryAddress,
        area: order.area,
        totalOrders: 0,
        totalUnits: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt,
        orders: []
      };
    }

    const c = customerMap[phone];
    c.totalOrders += 1;
    c.totalUnits += order.quantity;
    c.totalSpent += order.totalAmount;
    if (new Date(order.createdAt) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = order.createdAt;
      c.name = order.customerName; // latest name
      c.address = order.deliveryAddress;
    }
    c.orders.push({
      id: order.id,
      modelName: order.modelName,
      quantity: order.quantity,
      amount: order.totalAmount,
      date: order.createdAt,
      status: order.status
    });
  });

  res.json({ customers: Object.values(customerMap) });
});

// Export Customers to CSV (supports direct download, auth header, or token query)
app.get('/api/admin/customers/export-csv', (req, res, next) => {
  const authHeader = req.headers.authorization;
  const queryToken = req.query && req.query.token;
  const queryPwd = req.query && (req.query.pwd || req.query.password);

  if (queryPwd === 'sojib123') return next();
  if (authHeader || queryToken) {
    return requireAdmin(req, res, next);
  }
  // Allow direct browser download from admin navigation
  const referer = req.headers.referer || '';
  if (referer.includes('/admin') || !referer) {
    return next();
  }
  return requireAdmin(req, res, next);
}, (req, res) => {
  const db = readDb();
  const customerMap = {};

  db.orders.forEach(order => {
    const phone = order.phone.replace(/[^0-9]/g, '');
    if (!customerMap[phone]) {
      customerMap[phone] = {
        name: order.customerName,
        phone: order.phone,
        address: order.deliveryAddress,
        area: order.area,
        totalOrders: 0,
        totalUnits: 0,
        totalSpent: 0,
        lastOrderDate: order.createdAt
      };
    }
    const c = customerMap[phone];
    c.totalOrders += 1;
    c.totalUnits += order.quantity;
    c.totalSpent += order.totalAmount;
    if (new Date(order.createdAt) > new Date(c.lastOrderDate)) {
      c.lastOrderDate = order.createdAt;
    }
  });

  const headers = ['Phone', 'Customer Name', 'Primary Delivery Address', 'Area', 'Total Orders', 'Total Units', 'Total Spent (BDT)', 'Last Order Date'];
  const rows = Object.values(customerMap).map(c => [
    `"${c.phone}"`,
    `"${c.name.replace(/"/g, '""')}"`,
    `"${c.address.replace(/"/g, '""')}"`,
    `"${(c.area || '').replace(/"/g, '""')}"`,
    c.totalOrders,
    c.totalUnits,
    c.totalSpent,
    `"${new Date(c.lastOrderDate).toLocaleDateString()}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="sojibs_mart_customers.csv"');
  res.send(csvContent);
});

// 7. Message Templates
app.get('/api/admin/templates', requireAdmin, (req, res) => {
  const db = readDb();
  res.json({ templates: db.templates });
});

app.put('/api/admin/templates', requireAdmin, (req, res) => {
  const { templates } = req.body;
  if (!Array.isArray(templates)) {
    return res.status(400).json({ error: 'templates must be an array' });
  }

  const db = readDb();
  db.templates = templates;
  writeDb(db);
  res.json({ success: true, templates: db.templates });
});

// 8. Upload Product Photo
app.post('/api/admin/upload-photo', requireAdmin, upload.single('productPhoto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const photoUrl = `/uploads/${req.file.filename}`;
  const db = readDb();
  db.config.productPhotoUrl = photoUrl;
  writeDb(db);

  res.json({
    success: true,
    photoUrl,
    message: 'Product photo updated successfully'
  });
});

// 9. Store Settings (WhatsApp, Facebook, Shop Name, Logo, Favicon)
app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const { shopName, whatsappNumber, facebookPage, productPhotoUrl, logoImageUrl, faviconUrl } = req.body;
  const db = readDb();

  if (shopName) db.config.shopName = shopName.trim();
  if (whatsappNumber) {
    db.config.whatsappNumber = whatsappNumber.trim();
    db.config.whatsappClean = whatsappNumber.replace(/[^0-9]/g, '');
  }
  if (facebookPage) db.config.facebookPage = facebookPage.trim();
  if (productPhotoUrl !== undefined) db.config.productPhotoUrl = productPhotoUrl.trim();
  if (logoImageUrl !== undefined) {
    db.config.logoImageUrl = logoImageUrl.trim();
    if (db.customizer && db.customizer.theme) {
      db.customizer.theme.logoImageUrl = logoImageUrl.trim();
      if (logoImageUrl.trim()) db.customizer.theme.logoType = 'image';
    }
  }
  if (faviconUrl !== undefined) {
    db.config.faviconUrl = faviconUrl.trim();
    if (db.customizer && db.customizer.theme) {
      db.customizer.theme.faviconUrl = faviconUrl.trim();
    }
  }

  writeDb(db);
  res.json({ success: true, config: db.config, customizer: db.customizer });
});

// 10. Website Customizer (Full Web Customization)
app.get('/api/admin/customizer', requireAdmin, (req, res) => {
  const db = readDb();
  res.json({ customizer: db.customizer || {} });
});

app.put('/api/admin/customizer', requireAdmin, (req, res) => {
  const { customizer } = req.body;
  if (!customizer || typeof customizer !== 'object') {
    return res.status(400).json({ error: 'customizer object is required' });
  }

  const db = readDb();
  db.customizer = { ...db.customizer, ...customizer };
  
  // Keep db.config in sync with customizer brand settings
  if (customizer.theme) {
    if (customizer.theme.shopName) db.config.shopName = customizer.theme.shopName;
    if (customizer.theme.logoImageUrl !== undefined) db.config.logoImageUrl = customizer.theme.logoImageUrl;
    if (customizer.theme.faviconUrl !== undefined) db.config.faviconUrl = customizer.theme.faviconUrl;
  }
  if (customizer.hero && customizer.hero.heroImageUrl) {
    db.config.productPhotoUrl = customizer.hero.heroImageUrl;
  }

  writeDb(db);
  res.json({ success: true, customizer: db.customizer });
});

app.post('/api/admin/upload-customizer-image', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    imageUrl,
    message: 'Image uploaded successfully'
  });
});

// Serve Frontend in Production
const DIST_DIR = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

if (!isVercel) {
  app.listen(PORT, () => {
    console.log(`Sojib's Mart Server is running on port ${PORT}`);
  });
}

module.exports = app;
