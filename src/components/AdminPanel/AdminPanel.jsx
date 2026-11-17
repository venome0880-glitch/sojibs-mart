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

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid password');
      }

      setToken(data.token);
      sessionStorage.setItem('sojib_admin_token', data.token);
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

  // Fetch all admin data
  const fetchAdminData = async () => {
    if (!token) return;
    setIsLoading(true);

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [
        ordersRes,
        pricingRes,
        todayRes,
        salesRes,
        customersRes,
        templatesRes,
        customizerRes,
        storeRes
      ] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/pricing-offers', { headers }),
        fetch('/api/admin/today-deliveries', { headers }),
        fetch('/api/admin/sales-summary', { headers }),
        fetch('/api/admin/customers', { headers }),
        fetch('/api/admin/templates', { headers }),
        fetch('/api/admin/customizer', { headers }),
        fetch('/api/store')
      ]);

      if (ordersRes.status === 401) {
        handleLogout();
        return;
      }

      const ordersData = await ordersRes.json();
      const pricingData = await pricingRes.json();
      const todayData = await todayRes.json();
      const salesData = await salesRes.json();
      const customersData = await customersRes.json();
      const templatesData = await templatesRes.json();
      const customizerData = await customizerRes.json();
      const storeData = await storeRes.json();

      setOrders(ordersData.orders || []);
      setModels(storeData.models || []);
      setWinterOffer(pricingData.winterOffer || {});
      setTodayDeliveries(todayData || {});
      setSalesSummary(salesData || {});
      setCustomers(customersData.customers || []);
      setTemplates(templatesData.templates || []);
      setCustomizer(customizerData.customizer || {});
      setConfig(storeData.config || {});
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
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
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  // Delete order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      alert('Error deleting order: ' + err.message);
    }
  };

  // Save Stock
  const handleSaveStock = async (stockUpdates) => {
    const res = await fetch('/api/admin/stock', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stockUpdates })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchAdminData();
  };

  // Save Pricing & Offers
  const handleSavePricingOffers = async (payload) => {
    const res = await fetch('/api/admin/pricing-offers', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchAdminData();
  };

  // Save Templates
  const handleSaveTemplates = async (newTemplates) => {
    const res = await fetch('/api/admin/templates', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ templates: newTemplates })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    fetchAdminData();
  };

  // Export CSV (Direct in-browser download with Auth token)
  const handleExportCsv = async () => {
    try {
      const res = await fetch(`/api/admin/customers/export-csv?token=${encodeURIComponent(token)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Export failed' }));
        throw new Error(data.error || 'Failed to export CSV');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sojibs_mart_customers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('CSV Export failed: ' + err.message);
    }
  };

  // Save Settings
  const handleSaveSettings = async (settings) => {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    if (data.config) setConfig(data.config);
    if (data.customizer) setCustomizer(data.customizer);
    fetchAdminData();
  };

  // Save Website Customizer
  const handleSaveCustomizer = async (newCustomizer) => {
    const res = await fetch('/api/admin/customizer', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ customizer: newCustomizer })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setCustomizer(data.customizer);
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
