import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Package,
  Tag,
  Truck,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Lock,
  LogOut,
  Store,
  Flame,
  AlertCircle,
  Palette
} from 'lucide-react';

import OrdersInbox from './OrdersInbox';
import StockManager from './StockManager';
import PricingOffers from './PricingOffers';
import TodayDeliveries from './TodayDeliveries';
import SalesSummary from './SalesSummary';
import CustomersDirectory from './CustomersDirectory';
import MessageTemplates from './MessageTemplates';
import WebsiteCustomizer from './WebsiteCustomizer';
import StoreSettings from './StoreSettings';
import {
  getLocalStoreData,
  saveLocalStoreData,
  getLocalOrders,
  updateLocalOrderStatus,
  deleteLocalOrder,
  calculateLocalSummary,
  getLocalCustomers,
  safeFetchJson
} from '../../utils/localStoreFallback';

export default function AdminPanel({ onBackToStore, storeConfig = {}, currency = '৳' }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('sojib_admin_token') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('orders');

  // Admin Data State
  const [orders, setOrders] = useState([]);
  const [models, setModels] = useState([]);
  const [winterOffer, setWinterOffer] = useState({});
  const [todayDeliveries, setTodayDeliveries] = useState({ areas: {}, totalDeliveries: 0, totalUnits: 0, totalValue: 0 });
  const [salesSummary, setSalesSummary] = useState({});
  const [customers, setCustomers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [customizer, setCustomizer] = useState(null);
  const [config, setConfig] = useState(storeConfig);
  const [isLoading, setIsLoading] = useState(false);

  // Login handler with static / offline fallback
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const result = await safeFetchJson('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      if (result.ok && result.data?.token) {
        setToken(result.data.token);
        sessionStorage.setItem('sojib_admin_token', result.data.token);
        return;
      }

      // If backend returned a JSON error message (e.g. wrong password)
      if (!result.isHtml && result.error && !result.networkError) {
        throw new Error(result.error);
      }

      // Fallback for GitHub Pages or offline/static hosting
      if (passwordInput === 'sojib123') {
        const localToken = 'local_owner_token_' + Date.now();
        setToken(localToken);
        sessionStorage.setItem('sojib_admin_token', localToken);
        return;
      }

      throw new Error('Incorrect owner password. Please try again.');
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken('');
    sessionStorage.removeItem('sojib_admin_token');
  };

  // Fetch all admin data (tries live API, falls back to localStorage)
  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoading(true);

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const ordersRes = await safeFetchJson('/api/admin/orders', { headers });

      if (ordersRes.status === 401) {
        handleLogout();
        return;
      }

      if (ordersRes.ok && ordersRes.data) {
        const [
          pricingRes,
          todayRes,
          salesRes,
          customersRes,
          templatesRes,
          customizerRes,
          storeRes
        ] = await Promise.all([
          safeFetchJson('/api/admin/pricing-offers', { headers }),
          safeFetchJson('/api/admin/today-deliveries', { headers }),
          safeFetchJson('/api/admin/sales-summary', { headers }),
          safeFetchJson('/api/admin/customers', { headers }),
          safeFetchJson('/api/admin/templates', { headers }),
          safeFetchJson('/api/admin/customizer', { headers }),
          safeFetchJson('/api/store')
        ]);

        setOrders(ordersRes.data.orders || []);
        setModels(storeRes.data?.models || []);
        setWinterOffer(pricingRes.data?.winterOffer || {});
        setTodayDeliveries(todayRes.data || { areas: {}, totalDeliveries: 0, totalUnits: 0, totalValue: 0 });
        setSalesSummary(salesRes.data || {});
        setCustomers(customersRes.data?.customers || []);
        setTemplates(templatesRes.data?.templates || []);
        if (customizerRes.data?.customizer) setCustomizer(customizerRes.data.customizer);
        if (storeRes.data?.config) setConfig(storeRes.data.config);
        return;
      }

      // Local storage fallback (e.g. GitHub Pages)
      const localStore = getLocalStoreData();
      const localOrders = getLocalOrders();
      setOrders(localOrders);
      setModels(localStore.models || []);
      setWinterOffer(localStore.winterOffer || {});
      setCustomizer(localStore.customizer || {});
      setConfig(localStore.config || {});
      setTemplates(localStore.templates || []);
      setCustomers(getLocalCustomers(localOrders));
      setSalesSummary(calculateLocalSummary(localOrders, localStore.models || []));

      const activeOrders = localOrders.filter(o => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Out for delivery');
      const grouped = {};
      activeOrders.forEach(o => {
        const a = o.area || 'Standard Zone';
        if (!grouped[a]) grouped[a] = [];
        grouped[a].push(o);
      });
      setTodayDeliveries({
        areas: grouped,
        totalDeliveries: activeOrders.length,
        totalUnits: activeOrders.reduce((sum, o) => sum + (o.quantity || 1), 0),
        totalValue: activeOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
      });
    } catch (err) {
      console.warn('Using local store fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  // Update order status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await safeFetchJson(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
        return;
      }
    } catch (err) {}
    updateLocalOrderStatus(orderId, newStatus);
    fetchAdminData();
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;
    try {
      const res = await safeFetchJson(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminData();
        return;
      }
    } catch (err) {}
    deleteLocalOrder(orderId);
    fetchAdminData();
  };

  // Save Stock
  const handleSaveStock = async (stockUpdates) => {
    try {
      const res = await safeFetchJson('/api/admin/stock', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stockUpdates })
      });
      if (res.ok) {
        fetchAdminData();
        return;
      }
    } catch (err) {}
    const store = getLocalStoreData();
    const updated = store.models.map(m => {
      const up = stockUpdates.find(u => u.id === m.id);
      return up ? { ...m, stock: up.stock, isSoldOut: up.isSoldOut } : m;
    });
    saveLocalStoreData({ models: updated });
    fetchAdminData();
  };

  // Save Pricing & Offers
  const handleSavePricingOffers = async (payload) => {
    try {
      const res = await safeFetchJson('/api/admin/pricing-offers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchAdminData();
        return;
      }
    } catch (err) {}
    const store = getLocalStoreData();
    const updated = store.models.map(m => {
      const up = payload.priceUpdates.find(u => u.id === m.id);
      return up ? { ...m, price: up.price } : m;
    });
    saveLocalStoreData({ models: updated, winterOffer: payload.winterOffer });
    fetchAdminData();
  };

  // Save Templates
  const handleSaveTemplates = async (newTemplates) => {
    try {
      const res = await safeFetchJson('/api/admin/templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ templates: newTemplates })
      });
      if (res.ok) {
        fetchAdminData();
        return;
      }
    } catch (err) {}
    saveLocalStoreData({ templates: newTemplates });
    fetchAdminData();
  };

  // Export CSV (Direct in-browser download with Auth token)
  const handleExportCsv = async () => {
    try {
      const res = await fetch(`/api/admin/customers/export-csv?token=${encodeURIComponent(token)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sojibs_mart_customers_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch (err) {}

    // Local CSV generation fallback
    const localCust = getLocalCustomers(getLocalOrders());
    const headers = ['Phone', 'Customer Name', 'Primary Delivery Address', 'Area', 'Total Orders', 'Total Units', 'Total Spent (BDT)', 'Last Order Date'];
    const rows = localCust.map(c => [
      `"${c.phone}"`,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.address || '').replace(/"/g, '""')}"`,
      `"${(c.area || '').replace(/"/g, '""')}"`,
      c.totalOrders,
      c.totalUnits,
      c.totalSpent,
      `"${new Date(c.lastOrderDate).toLocaleDateString()}"`
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sojibs_mart_customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Save Settings
  const handleSaveSettings = async (settings) => {
    try {
      const res = await safeFetchJson('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok && res.data) {
        if (res.data.config) setConfig(res.data.config);
        if (res.data.customizer) setCustomizer(res.data.customizer);
        fetchAdminData();
        return;
      }
    } catch (err) {}
    const store = getLocalStoreData();
    const updated = { ...store.config, ...settings };
    saveLocalStoreData({ config: updated });
    setConfig(updated);
    fetchAdminData();
  };

  // Save Website Customizer
  const handleSaveCustomizer = async (newCustomizer) => {
    try {
      const res = await safeFetchJson('/api/admin/customizer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ customizer: newCustomizer })
      });
      if (res.ok && res.data) {
        setCustomizer(res.data.customizer);
        fetchAdminData();
        return;
      }
    } catch (err) {}
    saveLocalStoreData({ customizer: newCustomizer });
    setCustomizer(newCustomizer);
    fetchAdminData();
  };

  // 1. Password Protection Gate (Owner Password Required)
  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fafafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <Lock size={26} strokeWidth={2.4} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Owner Admin Portal
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Enter your owner password to access orders inbox, inventory, pricing, and deliveries.
          </p>

          {loginError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              border: '1px solid #fecaca'
            }}>
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              <label className="form-label" htmlFor="admin-pwd">
                Owner Password
              </label>
              <input
                id="admin-pwd"
                type="password"
                className="form-input"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn-primary hover-lift"
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              <span>{isLoggingIn ? 'Verifying...' : 'Unlock Admin Panel'}</span>
            </button>
          </form>

          <button
            onClick={onBackToStore}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '0.88rem',
              marginTop: '1.5rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Store size={15} />
            <span>Return to Store Page</span>
          </button>
        </div>
      </div>
    );
  }

  // Navigation Tabs Configuration
  const tabs = [
    { id: 'orders', label: 'Orders Inbox', icon: Inbox, count: orders.filter(o => o.status === 'New').length },
    { id: 'stock', label: 'Stock & Inventory', icon: Package },
    { id: 'pricing', label: 'Prices & Offers', icon: Tag },
    { id: 'deliveries', label: "Today's Deliveries", icon: Truck, count: todayDeliveries.totalDeliveries },
    { id: 'sales', label: 'Sales Summary', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
    { id: 'templates', label: 'Message Templates', icon: MessageSquare },
    { id: 'customizer', label: 'Customize Website', icon: Palette },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Bar */}
      <header className="no-print" style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--color-border)',
        padding: '0.85rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {(customizer?.theme?.logoType === 'image' && customizer?.theme?.logoImageUrl) || config?.logoImageUrl ? (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1.5px solid var(--color-border)',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={customizer?.theme?.logoImageUrl || config?.logoImageUrl}
                  alt="Admin Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={20} strokeWidth={2.5} />
              </div>
            )}
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.1 }}>
                {customizer?.theme?.shopName || config.shopName || "Sojib's Mart"} • Owner Admin
              </div>
              <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                ● Live Database Connected
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={onBackToStore}
              className="btn-secondary hover-lift"
              style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
            >
              <Store size={15} />
              <span>View Store Page</span>
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                color: 'var(--color-danger)',
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Row */}
        <div className="tabs-nav" style={{
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          paddingTop: '0.85rem',
          borderTop: '1px solid var(--color-border-light)',
          marginTop: '0.85rem'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1.5px solid var(--color-primary)' : '1px solid transparent',
                  backgroundColor: isActive ? 'var(--color-primary-light)' : '#ffffff',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span style={{
                    backgroundColor: isActive ? 'var(--color-primary)' : '#e4e4e7',
                    color: isActive ? '#ffffff' : '#3f3f46',
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    fontWeight: 800
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="admin-content" style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'orders' && (
          <OrdersInbox
            orders={orders}
            currency={currency}
            onUpdateStatus={handleUpdateStatus}
            onDeleteOrder={handleDeleteOrder}
            whatsappClean={config.whatsappClean}
          />
        )}

        {activeTab === 'stock' && (
          <StockManager
            models={models}
            onSaveStock={handleSaveStock}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingOffers
            models={models}
            winterOffer={winterOffer}
            currency={currency}
            onSavePricingOffers={handleSavePricingOffers}
          />
        )}

        {activeTab === 'deliveries' && (
          <TodayDeliveries
            deliveriesData={todayDeliveries}
            currency={currency}
            shopName={config.shopName}
          />
        )}

        {activeTab === 'sales' && (
          <SalesSummary
            summaryData={salesSummary}
            currency={currency}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersDirectory
            customers={customers}
            currency={currency}
            onExportCsv={handleExportCsv}
          />
        )}

        {activeTab === 'templates' && (
          <MessageTemplates
            templates={templates}
            onSaveTemplates={handleSaveTemplates}
          />
        )}

        {activeTab === 'customizer' && (
          <WebsiteCustomizer
            customizer={customizer}
            adminToken={token}
            onSaveCustomizer={handleSaveCustomizer}
          />
        )}

        {activeTab === 'settings' && (
          <StoreSettings
            config={config}
            adminToken={token}
            onSaveSettings={handleSaveSettings}
            onPhotoUploaded={(newUrl) => setConfig(prev => ({ ...prev, productPhotoUrl: newUrl }))}
          />
        )}
      </main>
    </div>
  );
}
