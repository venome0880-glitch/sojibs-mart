import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import WinterBanner from './components/WinterBanner';
import Hero from './components/Hero';
import Perks from './components/Perks';
import ModelCards from './components/ModelCards';
import HowOrderingWorks from './components/HowOrderingWorks';
import OrderForm from './components/OrderForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel/AdminPanel';
import { getLocalStoreData, safeFetchJson } from './utils/localStoreFallback';

export default function App() {
  const [view, setView] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin')
      ? 'admin'
      : 'store';
  });

  const [storeData, setStoreData] = useState({
    config: {
      shopName: "Sojib's Mart",
      tagline: 'Online Electric Heater Shop',
      currency: '৳',
      whatsappNumber: '880 01796017442',
      whatsappClean: '8801796017442',
      facebookPage: 'https://www.facebook.com/profile.php?id=61595742304637',
      productPhotoUrl: '',
      freeDeliveryText: 'Free delivery nationwide'
    },
    winterOffer: {
      active: true,
      badge: 'Winter Special Deal',
      text: 'Winter Special: Free Express Home Delivery + Instant WhatsApp Order Confirmation across Bangladesh!'
    },
    models: []
  });

  const [selectedModel, setSelectedModel] = useState(null);
  const orderFormRef = useRef(null);

  // Sync URL changes
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/admin') || window.location.hash.includes('admin')) {
        setView('admin');
      } else {
        setView('store');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch store data
  const fetchStoreData = async () => {
    try {
      const res = await safeFetchJson('/api/store');
      if (res.ok && res.data) {
        setStoreData(res.data);
        return;
      }
    } catch (err) {
      console.warn('API store unavailable, falling back to local data:', err);
    }
    const local = getLocalStoreData();
    setStoreData(local);
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  // Dynamically apply theme color from customizer
  useEffect(() => {
    const primary = storeData.customizer?.theme?.primaryColor;
    if (primary) {
      document.documentElement.style.setProperty('--color-primary', primary);
      document.documentElement.style.setProperty('--color-primary-hover', storeData.customizer.theme.primaryColorHover || primary);
      document.documentElement.style.setProperty('--color-primary-light', `${primary}18`);
      document.documentElement.style.setProperty('--color-primary-glow', `${primary}38`);
    }
  }, [storeData.customizer]);

  // Dynamically update Favicon and Document Title
  useEffect(() => {
    const customizerTheme = storeData.customizer?.theme;
    const faviconUrl = customizerTheme?.faviconUrl || (customizerTheme?.logoType === 'image' ? customizerTheme.logoImageUrl : null) || storeData.config?.faviconUrl;
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    if (faviconUrl) {
      link.href = faviconUrl;
      if (faviconUrl.endsWith('.svg')) {
        link.type = 'image/svg+xml';
      } else if (faviconUrl.endsWith('.ico')) {
        link.type = 'image/x-icon';
      } else {
        link.type = 'image/png';
      }
    } else {
      const primary = customizerTheme?.primaryColor || '#d6361a';
      const encodedColor = encodeURIComponent(primary);
      link.type = 'image/svg+xml';
      link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodedColor}'><path d='M12 2c1.1 0 2 .9 2 2v1.1C17.6 5.8 20 8.7 20 12c0 4.4-3.6 8-8 8s-8-3.6-8-8c0-3.3 2.4-6.2 6-6.9V4c0-1.1.9-2 2-2zm0 5a5 5 0 0 0-5 5c0 2.8 2.2 5 5 5s5-2.2 5-5a5 5 0 0 0-5-5z'/></svg>`;
    }

    const shopName = customizerTheme?.shopName || storeData.config?.shopName || "Sojib's Mart";
    if (view === 'admin') {
      document.title = `${shopName} • Owner Admin Panel`;
    } else {
      document.title = `${shopName} | Winter Electric Heaters - Free Delivery`;
    }
  }, [storeData.customizer, storeData.config, view]);

  // Navigation handlers
  const handleNavigateAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setView('admin');
  };

  const handleBackToStore = () => {
    window.history.pushState({}, '', '/');
    setView('store');
    fetchStoreData(); // Refresh any changes from admin
  };

  const handleScrollToModels = () => {
    const el = document.getElementById('models');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToOrder = () => {
    if (orderFormRef.current) {
      orderFormRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById('order-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    handleScrollToOrder();
  };

  if (view === 'admin') {
    return (
      <AdminPanel
        onBackToStore={handleBackToStore}
        storeConfig={storeData.config}
        currency={storeData.config.currency || '৳'}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Top Winter Offer Announcement */}
      <WinterBanner offer={storeData.winterOffer} />

      {/* Main Header */}
      <Header
        config={storeData.config}
        customizer={storeData.customizer}
        onScrollToOrder={handleScrollToOrder}
      />

      <main style={{ flex: 1 }}>
        {/* 1. Hero Section ("A warmer room this winter. Delivered free.") */}
        <Hero
          config={storeData.config}
          customizer={storeData.customizer}
          onScrollToModels={handleScrollToModels}
          onScrollToOrder={handleScrollToOrder}
        />

        {/* 2. Three Perks (Free Delivery, Four Models, Order by Message) */}
        <Perks customizer={storeData.customizer} />

        {/* 3. Four Model Cards with Count-Up Wattage & Stock */}
        <ModelCards
          models={storeData.models}
          customizer={storeData.customizer}
          currency={storeData.config.currency || '৳'}
          onSelectModel={handleSelectModel}
        />

        {/* 4. How Ordering Works (3 Steps) */}
        <HowOrderingWorks
          customizer={storeData.customizer}
          onScrollToOrder={handleScrollToOrder}
        />

        {/* 5. Order Form (WhatsApp & Messenger Buttons + DB Persistence) */}
        <OrderForm
          formRef={orderFormRef}
          models={storeData.models}
          currency={storeData.config.currency || '৳'}
          config={storeData.config}
          selectedModel={selectedModel}
        />
      </main>

      {/* 6. Footer */}
      <Footer
        config={storeData.config}
        customizer={storeData.customizer}
        onNavigateAdmin={handleNavigateAdmin}
      />
    </div>
  );
}
