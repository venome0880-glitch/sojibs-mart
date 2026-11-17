// Local storage fallback for GitHub Pages and offline/static hosting
export const DEFAULT_STORE_DATA = {
  config: {
    shopName: "Sojib's Mart",
    tagline: "Electric Heater Chula & Room Heating",
    currency: "৳",
    whatsappNumber: "880 01796017442",
    whatsappClean: "8801796017442",
    facebookPage: "https://www.facebook.com/profile.php?id=61595742304637",
    productPhotoUrl: "/uploads/heater-product-1794951333947.jpg",
    bannerPhotoUrl: "/images/heater-chula-banner.jpg",
    freeDeliveryText: "Free Delivery Nationwide • Cash on Delivery",
    logoImageUrl: "/uploads/heater-product-1794953581498.jpg",
    faviconUrl: "/uploads/heater-product-1794953542927.jpg"
  },
  winterOffer: {
    active: true,
    badge: "Winter Special Deal",
    text: "Winter Special: Free Express Home Delivery + Instant WhatsApp Order Confirmation across Bangladesh!"
  },
  models: [
    {
      id: "model-8-1000",
      size: "8 inch",
      sizeNumber: 8,
      wattage: 1000,
      name: "8\" Electric Heater Chula 1000W",
      subtitle: "Ceramic Coil Stove - Daily Cooking, Tea & Room Warmth",
      price: 950,
      stock: 24,
      isSoldOut: false,
      roomCoverage: "Small Room & Daily Cooking",
      coils: "1000W Red Nichrome Heating Coil",
      image: "/images/chula-ceramic-clips.jpg",
      features: [
        "Glowing red nichrome heating coil",
        "Heavy-duty kiln ceramic fireproof body",
        "Sturdy steel pot-holder clips",
        "Energy efficient 1000W single phase"
      ]
    },
    {
      id: "model-8-1500",
      size: "8 inch",
      sizeNumber: 8,
      wattage: 1500,
      name: "8\" Heavy-Duty Heater Chula 1500W",
      subtitle: "1500W Red Hot Coil - Fast Boiling & Family Cooking",
      price: 1250,
      stock: 17,
      isSoldOut: false,
      roomCoverage: "Medium Room & Family Meals",
      coils: "1500W Heavy Nichrome Spring Coil",
      image: "/images/chula-glowing-red.jpg",
      features: [
        "Turns red hot in 3 seconds for instant warmth",
        "Insulated ceramic base & ceramic terminal block",
        "Long-lasting high-durability coil",
        "Free doorstep home delivery with Cash on Delivery"
      ]
    },
    {
      id: "model-10-2500",
      size: "10 inch",
      sizeNumber: 10,
      wattage: 2500,
      name: "10\" Jumbo Heater Chula 2500W",
      subtitle: "Large 10-inch Ceramic Plate for Large Pots & Big Rooms",
      price: 1750,
      stock: 14,
      isSoldOut: false,
      roomCoverage: "Large Pots & Room Heating",
      coils: "2500W Heavy Gauge Power Coil",
      image: "/images/chula-angle-block.jpg",
      features: [
        "10-inch extra wide ceramic surface for large cooking pans",
        "2500W powerful radiant heat and heavy-gauge coil",
        "Reinforced high-temperature wiring & block",
        "Keeps large living rooms comfortably warm"
      ]
    },
    {
      id: "model-10-3000",
      size: "10 inch",
      sizeNumber: 10,
      wattage: 3000,
      name: "10\" Turbo Power Heater Chula 3000W",
      subtitle: "Commercial & Heavy Household 3000W Max Power",
      price: 2150,
      stock: 9,
      isSoldOut: false,
      roomCoverage: "Heavy Commercial & Large Hall Warmth",
      coils: "3000W Ultra-Power Nichrome Coil",
      image: "/images/chula-full-setup.jpg",
      features: [
        "Maximum 3000W commercial heat output",
        "Extra heavy copper cables & fireproof ceramic",
        "Rapid room warming and heavy-duty cooking",
        "7-day replacement warranty"
      ]
    }
  ],
  templates: [
    {
      id: "tpl-confirmed",
      name: "Order confirmed",
      body: "Hello {customer_name}! Your order for {quantity}x {model} has been confirmed by Sojib's Mart. Total amount: {total} with 100% Free Home Delivery. Delivery Address: {address}. We are packing your heater chula right now!"
    },
    {
      id: "tpl-out-delivery",
      name: "Out for delivery",
      body: "Good news {customer_name}! Your electric heater chula ({model}) is out for delivery today to {address}. Please keep {total} ready in Cash on Delivery. Our delivery rider will reach you shortly."
    },
    {
      id: "tpl-delivered",
      name: "Delivered",
      body: "Thank you for shopping at Sojib's Mart, {customer_name}! Your {model} heater chula has been successfully delivered. Happy cooking & warm winter! Message us anytime if you need extra coils or wire."
    },
    {
      id: "tpl-cancelled",
      name: "Order cancelled",
      body: "Hello {customer_name}, as per your request/verification, your order #{order_id} for {model} has been cancelled. Feel free to contact Sojib's Mart if you change your mind!"
    }
  ],
  customizer: {
    theme: {
      primaryColor: "#7c3aed",
      primaryColorHover: "#6d28d9",
      logoType: "icon",
      logoImageUrl: "/uploads/heater-product-1794953581498.jpg",
      faviconUrl: "/uploads/heater-product-1794953542927.jpg",
      shopName: "Sojib's Mart",
      tagline: "Electric Heater Chula & Room Heating"
    },
    hero: {
      badge: "Electric Heater Chula • 100% Free Nationwide Delivery",
      headline: "A warmer room this winter.",
      headlineAccent: "Delivered free.",
      subHeadline: "Heavy-Duty Ceramic Electric Heater Stoves — Fast Cooking & Room Warmth",
      description: "High-temperature fireproof ceramic body with glowing red nichrome heating coils. Available in 8-inch and 10-inch models from 1000W to 3000W. Free doorstep delivery with Cash on Delivery across Bangladesh.",
      footnote: "Cash on Delivery • Package Inspection on Arrival • 7-Day Replacement Warranty",
      heroImageUrl: "/uploads/heater-product-1794951333947.jpg"
    },
    sections: {
      perksTitle: "Why Buy From Sojib's Mart?",
      perksSubtitle: "Fireproof ceramic bodies, genuine glowing red nichrome heating coils, and fast delivery.",
      modelsTitle: "Select Your Electric Heater Chula Model",
      modelsSubtitle: "Available in 8\" (1000W & 1500W) and 10\" (2500W & 3000W). Genuine nichrome coils, safety pot stands, and free shipping.",
      stepsTitle: "How Ordering Works",
      stepsSubtitle: "Simple 3-step checkout with zero advance payment required."
    },
    perks: [
      {
        title: "100% Free Nationwide Delivery",
        description: "Zero shipping fee across Bangladesh. No advance payment required; inspect your parcel upon arrival with Cash on Delivery.",
        tag: "Free Shipping"
      },
      {
        title: "4 Tailored Heater Chula Models",
        description: "8\" (1000W & 1500W) for tea and daily cooking, and 10\" (2500W & 3000W) for heavy cooking pots and large room heating.",
        tag: "8\" & 10\" Ceramic"
      },
      {
        title: "Order Direct by Message",
        description: "No account needed. Place your order with 1 click on WhatsApp or Messenger for instant confirmation.",
        tag: "Instant Confirmation"
      }
    ],
    steps: [
      {
        step: "01",
        title: "Choose Model & Enter Address",
        description: "Select your preferred wattage and fill in your name, phone number, and delivery address."
      },
      {
        step: "02",
        title: "Confirm Your Order",
        description: "Click \"Confirm Order\" to save your order directly or dispatch via WhatsApp."
      },
      {
        step: "03",
        title: "Receive & Pay Cash on Delivery",
        description: "Our rider brings your heater chula right to your doorstep. Inspect the parcel and pay cash on delivery."
      }
    ]
  }
};

const STORAGE_KEY = 'sojibs_mart_db_v1';
const ORDERS_KEY = 'sojibs_mart_orders_v1';

// Read store data from localStorage or default
export function getLocalStoreData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STORE_DATA, ...parsed };
    }
  } catch (e) {
    console.error('Error reading local store data:', e);
  }
  return DEFAULT_STORE_DATA;
}

// Save store data to localStorage
export function saveLocalStoreData(partial) {
  try {
    const current = getLocalStoreData();
    const updated = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving local store data:', e);
  }
  return null;
}

// Read orders
export function getLocalOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [
    {
      id: "SM-1001",
      customerName: "Sample Customer",
      phone: "01716891190",
      deliveryAddress: "Rangpur Sadar, Rangpur",
      area: "Rangpur",
      modelId: "model-8-1000",
      modelName: "8\" Electric Heater Chula 1000W",
      modelSize: "8 inch",
      wattage: 1000,
      unitPrice: 950,
      quantity: 1,
      totalAmount: 950,
      deliveryFee: 0,
      status: "Delivered",
      source: "Website Direct",
      createdAt: new Date().toISOString(),
      deliveryDate: new Date().toISOString().split('T')[0],
      notes: ""
    }
  ];
}

// Add an order
export function addLocalOrder(orderData, config) {
  const orders = getLocalOrders();
  const store = getLocalStoreData();
  const model = store.models.find(m => m.id === orderData.modelId) || store.models[0];
  
  const qty = parseInt(orderData.quantity, 10) || 1;
  const newOrder = {
    id: `SM-${1000 + orders.length + 1}`,
    customerName: orderData.customerName,
    phone: orderData.phone,
    deliveryAddress: orderData.deliveryAddress,
    area: orderData.deliveryAddress.split(',').pop()?.trim() || 'Standard Delivery Zone',
    modelId: model.id,
    modelName: model.name,
    modelSize: model.size,
    wattage: model.wattage,
    unitPrice: model.price,
    quantity: qty,
    totalAmount: model.price * qty,
    deliveryFee: 0,
    status: 'New',
    source: orderData.source || 'Website Direct',
    createdAt: new Date().toISOString(),
    deliveryDate: new Date().toISOString().split('T')[0],
    notes: ''
  };

  orders.unshift(newOrder);
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {}

  // Format message
  const msg = [
    `*NEW HEATER ORDER - ${config.shopName}*`,
    `--------------------------------------`,
    `*Order ID:* #${newOrder.id}`,
    `*Customer Name:* ${newOrder.customerName}`,
    `*Phone Number:* ${newOrder.phone}`,
    `*Delivery Address:* ${newOrder.deliveryAddress}`,
    `--------------------------------------`,
    `*Model:* ${newOrder.modelName} (${newOrder.modelSize})`,
    `*Wattage:* ${newOrder.wattage}W`,
    `*Quantity:* ${newOrder.quantity}`,
    `*Total Price:* ৳${newOrder.totalAmount.toLocaleString()}`,
    `*Delivery Fee:* ৳0 (Free Delivery)`,
    `*Payment Method:* Cash on Delivery`,
    `--------------------------------------`,
    `Please confirm my order for delivery.`
  ].join('\n');

  const cleanPhone = (config.whatsappClean || '8801796017442').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

  return {
    success: true,
    order: newOrder,
    messageText: msg,
    whatsappUrl,
    facebookPage: config.facebookPage
  };
}

// Update order status
export function updateLocalOrderStatus(orderId, status) {
  const orders = getLocalOrders();
  const target = orders.find(o => o.id === orderId);
  if (target) {
    target.status = status;
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {}
  }
  return orders;
}

// Delete order
export function deleteLocalOrder(orderId) {
  const orders = getLocalOrders().filter(o => o.id !== orderId);
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {}
  return orders;
}

// Calculate summary
export function calculateLocalSummary(orders, models) {
  const nonCancelled = orders.filter(o => o.status !== 'Cancelled');
  const totalOrders = nonCancelled.length;
  const totalUnits = nonCancelled.reduce((sum, o) => sum + (o.quantity || 1), 0);
  const totalRevenue = nonCancelled.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const modelStats = {};
  models.forEach(m => {
    modelStats[m.id] = { id: m.id, name: m.name, size: m.size, wattage: m.wattage, ordersCount: 0, unitsSold: 0, revenue: 0 };
  });
  nonCancelled.forEach(o => {
    if (modelStats[o.modelId]) {
      modelStats[o.modelId].ordersCount += 1;
      modelStats[o.modelId].unitsSold += o.quantity || 1;
      modelStats[o.modelId].revenue += o.totalAmount || 0;
    }
  });

  return {
    kpis: {
      totalOrders,
      totalUnits,
      totalRevenue,
      avgOrderValue,
      pendingOrders: orders.filter(o => o.status === 'New').length
    },
    byModel: Object.values(modelStats),
    daily: [],
    weekly: []
  };
}

// Calculate customers
export function getLocalCustomers(orders) {
  const customerMap = {};
  orders.forEach(order => {
    const phone = (order.phone || '').replace(/[^0-9]/g, '');
    if (!phone) return;
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
    c.totalUnits += order.quantity || 1;
    c.totalSpent += order.totalAmount || 0;
    c.orders.push({ id: order.id, modelName: order.modelName, quantity: order.quantity, amount: order.totalAmount, date: order.createdAt, status: order.status });
  });
  return Object.values(customerMap);
}

// Safe fetch json helper
export async function safeFetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data, error: !res.ok ? (data.error || 'Request failed') : null };
    }
    // Returned HTML (e.g. 404 page on GitHub Pages)
    return { ok: false, status: res.status, isHtml: true, error: `Static or HTML response (${res.status})` };
  } catch (err) {
    return { ok: false, status: 0, networkError: true, error: err.message };
  }
}
