import React, { useState } from 'react';
import {
  Palette,
  Save,
  CheckCircle,
  Image as ImageIcon,
  Type,
  Layers,
  Sparkles,
  Upload,
  Flame,
  Check,
  Eye,
  RefreshCw,
  Globe,
  Trash2,
  ExternalLink
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Ember Red (Default)', hex: '#d6361a', hover: '#b82b13' },
  { name: 'Crimson Flame', hex: '#e11d48', hover: '#be123c' },
  { name: 'Sunset Amber', hex: '#ea580c', hover: '#c2410c' },
  { name: 'Royal Violet', hex: '#7c3aed', hover: '#6d28d9' },
  { name: 'Ocean Blue', hex: '#2563eb', hover: '#1d4ed8' },
  { name: 'Emerald Green', hex: '#059669', hover: '#047857' },
  { name: 'Dark Charcoal', hex: '#18181b', hover: '#09090b' }
];

export default function WebsiteCustomizer({
  customizer = {},
  adminToken,
  onSaveCustomizer
}) {
  const [activeSubTab, setActiveSubTab] = useState('colors');

  // Form states initialized from props or defaults
  const [theme, setTheme] = useState({
    primaryColor: customizer?.theme?.primaryColor || '#d6361a',
    primaryColorHover: customizer?.theme?.primaryColorHover || '#b82b13',
    logoType: customizer?.theme?.logoType || 'icon',
    logoImageUrl: customizer?.theme?.logoImageUrl || '',
    faviconUrl: customizer?.theme?.faviconUrl || '',
    shopName: customizer?.theme?.shopName || "Sojib's Mart",
    tagline: customizer?.theme?.tagline || 'Electric Heater Chula & Room Warmth'
  });

  const [hero, setHero] = useState({
    badge: customizer?.hero?.badge || 'Electric Heater Chula • Free Nationwide Delivery',
    headline: customizer?.hero?.headline || 'A warmer room this winter.',
    headlineAccent: customizer?.hero?.headlineAccent || 'Delivered free.',
    subHeadline: customizer?.hero?.subHeadline || 'Heavy-Duty Ceramic Electric Heater Stoves — Fast Cooking & Room Warmth',
    description: customizer?.hero?.description || 'High-temperature fireproof ceramic body with glowing red nichrome heating coils. Available in 8-inch and 10-inch models from 1000W to 3000W. Free doorstep delivery with Cash on Delivery.',
    footnote: customizer?.hero?.footnote || 'Cash on Delivery • Package Inspection on Arrival • 7-Day Replacement Warranty',
    heroImageUrl: customizer?.hero?.heroImageUrl || '/images/chula-glowing-red.jpg'
  });

  const [sections, setSections] = useState({
    perksTitle: customizer?.sections?.perksTitle || "Why Buy from Sojib's Mart?",
    perksSubtitle: customizer?.sections?.perksSubtitle || 'Fireproof kiln ceramic bodies, genuine red-hot nichrome heating coils, and fast delivery.',
    modelsTitle: customizer?.sections?.modelsTitle || 'Select Your Electric Heater Chula Model',
    modelsSubtitle: customizer?.sections?.modelsSubtitle || 'Available in 8" (1000W & 1500W) and 10" (2500W & 3000W). Genuine nichrome coils, safety pot stands, and free shipping.',
    stepsTitle: customizer?.sections?.stepsTitle || 'How Ordering Works',
    stepsSubtitle: customizer?.sections?.stepsSubtitle || 'Simple 3-step checkout with zero advance payment required.'
  });

  const [perks, setPerks] = useState(customizer?.perks || [
    {
      title: '100% Free Nationwide Delivery',
      description: 'Zero shipping fee across Bangladesh. No advance payment required; inspect your parcel upon arrival with Cash on Delivery.',
      tag: 'Free Shipping'
    },
    {
      title: '4 Tailored Heater Chula Models',
      description: '8" (1000W & 1500W) for tea and daily cooking, and 10" (2500W & 3000W) for heavy cooking pots and large room heating.',
      tag: '8" & 10" Ceramic'
    },
    {
      title: 'Order Direct by Message',
      description: 'No account needed. Place your order with 1 click on WhatsApp or Messenger for instant confirmation.',
      tag: 'Instant Confirmation'
    }
  ]);

  const [steps, setSteps] = useState(customizer?.steps || [
    {
      step: '01',
      title: 'Choose Model & Enter Address',
      description: 'Select your preferred wattage and fill in your name, phone number, and delivery address.'
    },
    {
      step: '02',
      title: 'Confirm Your Order',
      description: 'Click "Confirm Order" to save your order directly or dispatch via WhatsApp.'
    },
    {
      step: '03',
      title: 'Receive & Pay Cash on Delivery',
      description: 'Our rider brings your heater chula right to your doorstep. Inspect the parcel and pay cash on delivery.'
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [uploadingTarget, setUploadingTarget] = useState(null);

  // Generic Image Uploader
  const handleImageUpload = async (e, targetField) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingTarget(targetField);
    try {
      const res = await fetch('/api/admin/upload-customizer-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (targetField === 'logoImageUrl') {
        setTheme(prev => ({ ...prev, logoImageUrl: data.imageUrl, logoType: 'image' }));
      } else if (targetField === 'faviconUrl') {
        setTheme(prev => ({ ...prev, faviconUrl: data.imageUrl }));
      } else if (targetField === 'heroImageUrl') {
        setHero(prev => ({ ...prev, heroImageUrl: data.imageUrl }));
      }
      setSuccessMsg('Image uploaded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setUploadingTarget(null);
    }
  };

  // Save All Customizations
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      const payload = {
        theme,
        hero,
        sections,
        perks,
        steps
      };

      await onSaveCustomizer(payload);
      setSuccessMsg('Website customizations saved successfully! Storefront is updated live.');
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (err) {
      alert('Error saving customizer: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '980px' }}>
      {/* Top Action Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Palette size={22} color={theme.primaryColor} />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900 }}>
              Full Website Customizer
            </h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', marginTop: '2px' }}>
            Customize all website texts, images, logo, and brand theme colors in real time.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="btn-primary hover-lift"
          style={{
            backgroundColor: theme.primaryColor,
            borderColor: theme.primaryColor,
            padding: '0.75rem 1.6rem',
            fontSize: '0.96rem',
            boxShadow: `0 4px 14px ${theme.primaryColor}40`
          }}
        >
          <Save size={17} />
          <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#f0fdf4',
          color: '#15803d',
          border: '1.5px solid #86efac',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontWeight: 800,
          boxShadow: 'var(--shadow-sm)'
        }}>
          <CheckCircle size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sub-Tabs Nav */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        borderBottom: '2px solid var(--color-border)',
        marginBottom: '1.75rem',
        paddingBottom: '0.25rem'
      }}>
        {[
          { id: 'colors', label: 'Theme Colors', icon: Palette },
          { id: 'brand', label: 'Logo & Favicon', icon: Sparkles },
          { id: 'hero', label: 'Hero Section & Images', icon: Type },
          { id: 'perks', label: 'Store Perks (3 Highlights)', icon: Layers },
          { id: 'steps', label: 'Ordering Steps & Headings', icon: Check }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1rem',
                border: 'none',
                borderBottom: isActive ? `3px solid ${theme.primaryColor}` : '3px solid transparent',
                backgroundColor: 'transparent',
                color: isActive ? theme.primaryColor : 'var(--color-text-muted)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: COLORS & THEME
         ========================================================================= */}
      {activeSubTab === 'colors' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Accent Color & Palette
          </h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Select a primary brand color. Buttons, headline highlights, glow effects, and badges across the store will update immediately.
          </p>

          {/* Preset Swatches */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', marginBottom: '0.65rem' }}>
              Choose from popular color presets:
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {PRESET_COLORS.map(c => {
                const isSelected = theme.primaryColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setTheme(prev => ({ ...prev, primaryColor: c.hex, primaryColorHover: c.hover }))}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? `2px solid ${c.hex}` : '1.5px solid var(--color-border)',
                      backgroundColor: isSelected ? `${c.hex}15` : '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '0.82rem'
                    }}
                  >
                    <span style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                    }} />
                    <span>{c.name}</span>
                    {isSelected && <Check size={14} color={c.hex} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div>
              <label className="form-label" style={{ marginBottom: '0.35rem' }}>
                Custom Color Picker (Hex Value):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                  style={{ width: '48px', height: '42px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="form-input"
                  style={{ width: '130px', fontWeight: 800, fontFamily: 'monospace' }}
                  placeholder="#d6361a"
                />
              </div>
            </div>

            {/* Live Mini Preview Box */}
            <div style={{
              flex: 1,
              minWidth: '260px',
              backgroundColor: '#fafafa',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Live Preview:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontWeight: 800,
                    fontSize: '0.88rem'
                  }}
                >
                  Confirm Order
                </button>
                <span style={{
                  backgroundColor: `${theme.primaryColor}18`,
                  color: theme.primaryColor,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  Free Delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: LOGO, BRAND & FAVICON (BROWSER TAB ICON)
         ========================================================================= */}
      {activeSubTab === 'brand' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Card A: Shop Name & Tagline */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Type size={20} color={theme.primaryColor} />
              <span>Store Name & Tagline</span>
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Configure your primary store brand identity displayed across the header, invoices, and messaging.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Shop Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={theme.shopName}
                  onChange={(e) => setTheme(prev => ({ ...prev, shopName: e.target.value }))}
                  placeholder="e.g. Sojib's Mart"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Tagline / Subtitle</label>
                <input
                  type="text"
                  className="form-input"
                  value={theme.tagline}
                  onChange={(e) => setTheme(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="e.g. Electric Heater Chula & Room Heating"
                />
              </div>
            </div>
          </div>

          {/* Card B: Store Header Logo */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Flame size={20} color={theme.primaryColor} />
                <span>Store Header Logo</span>
              </h3>
              <span style={{ fontSize: '0.8rem', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f4f4f5', color: '#52525b', fontWeight: 700 }}>
                Active: {theme.logoType === 'image' && theme.logoImageUrl ? 'Custom Image Logo' : 'Default Flame Icon'}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Choose whether to use the default radiant flame icon or upload your brand's custom logo image.
            </p>

            {/* Logo Style Radio Switches */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1.25rem',
                border: theme.logoType === 'icon' ? `2px solid ${theme.primaryColor}` : '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: theme.logoType === 'icon' ? `${theme.primaryColor}10` : '#fafafa',
                cursor: 'pointer',
                fontWeight: 700
              }}>
                <input
                  type="radio"
                  name="logoType"
                  value="icon"
                  checked={theme.logoType === 'icon'}
                  onChange={() => setTheme(prev => ({ ...prev, logoType: 'icon' }))}
                />
                <Flame size={18} color={theme.primaryColor} />
                <span>Default Flame Icon</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.85rem 1.25rem',
                border: theme.logoType === 'image' ? `2px solid ${theme.primaryColor}` : '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: theme.logoType === 'image' ? `${theme.primaryColor}10` : '#fafafa',
                cursor: 'pointer',
                fontWeight: 700
              }}>
                <input
                  type="radio"
                  name="logoType"
                  value="image"
                  checked={theme.logoType === 'image'}
                  onChange={() => setTheme(prev => ({ ...prev, logoType: 'image' }))}
                />
                <ImageIcon size={18} color={theme.primaryColor} />
                <span>Custom Image Logo</span>
              </label>
            </div>

            {/* Logo Image Controls */}
            {theme.logoType === 'image' && (
              <div style={{
                backgroundColor: '#fafafa',
                border: '1.5px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.75rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {theme.logoImageUrl ? (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '2px solid var(--color-primary)',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <img src={theme.logoImageUrl} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      backgroundColor: '#e4e4e7',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#71717a',
                      fontSize: '0.75rem',
                      textAlign: 'center'
                    }}>
                      <ImageIcon size={28} />
                      <span>No Logo</span>
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <label className="btn-primary hover-lift" style={{ cursor: 'pointer', display: 'inline-flex', padding: '0.65rem 1.25rem' }}>
                        <Upload size={16} />
                        <span>{uploadingTarget === 'logoImageUrl' ? 'Uploading...' : 'Upload Logo File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'logoImageUrl')}
                          style={{ display: 'none' }}
                        />
                      </label>

                      {theme.logoImageUrl && (
                        <button
                          type="button"
                          onClick={() => setTheme(prev => ({ ...prev, logoImageUrl: '', logoType: 'icon' }))}
                          className="btn-secondary"
                          style={{ padding: '0.65rem 1rem', color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={15} />
                          <span>Remove Logo</span>
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', marginTop: '0.5rem' }}>
                      Recommended: Transparent PNG, SVG, or JPG (square or rectangular aspect ratio, 200x200px or larger).
                    </div>
                  </div>
                </div>

                {/* Direct Logo URL Input */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>
                    Or Direct Logo Image URL:
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={theme.logoImageUrl}
                    onChange={(e) => setTheme(prev => ({ ...prev, logoImageUrl: e.target.value, logoType: e.target.value ? 'image' : 'icon' }))}
                    placeholder="https://example.com/my-logo.png or /uploads/..."
                    style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            )}

            {/* Live Store Header Preview */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Storefront Header Preview:
              </label>
              <div style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-xs)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {theme.logoType === 'image' && theme.logoImageUrl ? (
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={theme.logoImageUrl} alt="Header Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  ) : (
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: `${theme.primaryColor}18`,
                      color: theme.primaryColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1.5px solid ${theme.primaryColor}35`
                    }}>
                      <Flame size={22} strokeWidth={2.5} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.1 }}>
                      {theme.shopName || "Sojib's Mart"}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: theme.primaryColor, textTransform: 'uppercase' }}>
                      {theme.tagline || 'Electric Heater Chula'}
                    </div>
                  </div>
                </div>

                <span style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#f0fdf4',
                  color: '#15803d',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: '1px solid #bbf7d0'
                }}>
                  Free Delivery Nationwide
                </span>
              </div>
            </div>
          </div>

          {/* Card C: Browser Tab Favicon */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={20} color={theme.primaryColor} />
                <span>Browser Tab Favicon (Page Icon)</span>
              </h3>
              <span style={{ fontSize: '0.8rem', padding: '3px 10px', borderRadius: '9999px', backgroundColor: '#f4f4f5', color: '#52525b', fontWeight: 700 }}>
                {theme.faviconUrl ? 'Custom Favicon Active' : 'Dynamic Theme Flame (Default)'}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              The favicon is the small icon displayed on your customer's browser tab, in browser bookmarks, and when saved as a home screen icon.
            </p>

            {/* Simulated Realistic Browser Tab Bar Preview */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                Browser Tab Simulation (Live Preview):
              </label>
              
              <div style={{
                backgroundColor: '#e2e8f0',
                borderRadius: '10px 10px 0 0',
                padding: '8px 12px 0 12px',
                border: '1px solid #cbd5e1'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  backgroundColor: '#ffffff',
                  padding: '7px 14px',
                  borderRadius: '8px 8px 0 0',
                  boxShadow: '0 -2px 5px rgba(0,0,0,0.04)',
                  maxWidth: '320px'
                }}>
                  {/* Favicon Icon */}
                  {theme.faviconUrl ? (
                    <img
                      src={theme.faviconUrl}
                      alt="Favicon"
                      style={{ width: '16px', height: '16px', objectFit: 'contain', flexShrink: 0 }}
                    />
                  ) : theme.logoImageUrl ? (
                    <img
                      src={theme.logoImageUrl}
                      alt="Favicon"
                      style={{ width: '16px', height: '16px', objectFit: 'contain', flexShrink: 0 }}
                    />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={theme.primaryColor} style={{ flexShrink: 0 }}>
                      <path d="M12 2c1.1 0 2 .9 2 2v1.1C17.6 5.8 20 8.7 20 12c0 4.4-3.6 8-8 8s-8-3.6-8-8c0-3.3 2.4-6.2 6-6.9V4c0-1.1.9-2 2-2zm0 5a5 5 0 0 0-5 5c0 2.8 2.2 5 5 5s5-2.2 5-5a5 5 0 0 0-5-5z" />
                    </svg>
                  )}
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {theme.shopName || "Sojib's Mart"} | Winter Electric Heaters
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: 'auto', paddingLeft: '6px' }}>✕</span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                padding: '8px 14px',
                fontSize: '0.78rem',
                color: '#64748b',
                fontFamily: 'monospace'
              }}>
                🔒 https://localhost:5000/
              </div>
            </div>

            {/* Favicon Actions Box */}
            <div style={{
              backgroundColor: '#fafafa',
              border: '1.5px dashed var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-xs)'
                }}>
                  {theme.faviconUrl ? (
                    <img src={theme.faviconUrl} alt="Favicon" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                  ) : (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill={theme.primaryColor}>
                      <path d="M12 2c1.1 0 2 .9 2 2v1.1C17.6 5.8 20 8.7 20 12c0 4.4-3.6 8-8 8s-8-3.6-8-8c0-3.3 2.4-6.2 6-6.9V4c0-1.1.9-2 2-2zm0 5a5 5 0 0 0-5 5c0 2.8 2.2 5 5 5s5-2.2 5-5a5 5 0 0 0-5-5z" />
                    </svg>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label className="btn-primary hover-lift" style={{ cursor: 'pointer', display: 'inline-flex', padding: '0.65rem 1.25rem' }}>
                    <Upload size={16} />
                    <span>{uploadingTarget === 'faviconUrl' ? 'Uploading...' : 'Upload Favicon Image'}</span>
                    <input
                      type="file"
                      accept=".ico,.png,.svg,.jpg,.jpeg,.webp,image/*"
                      onChange={(e) => handleImageUpload(e, 'faviconUrl')}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {theme.logoImageUrl && (
                    <button
                      type="button"
                      onClick={() => setTheme(prev => ({ ...prev, faviconUrl: prev.logoImageUrl }))}
                      className="btn-secondary hover-lift"
                      style={{ padding: '0.65rem 1rem' }}
                    >
                      <Sparkles size={15} color={theme.primaryColor} />
                      <span>Use Store Logo as Favicon</span>
                    </button>
                  )}

                  {theme.faviconUrl && (
                    <button
                      type="button"
                      onClick={() => setTheme(prev => ({ ...prev, faviconUrl: '' }))}
                      className="btn-secondary"
                      style={{ padding: '0.65rem 1rem', color: 'var(--color-danger)' }}
                    >
                      <RefreshCw size={14} />
                      <span>Reset to Default</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Direct Favicon URL */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>
                  Favicon Image URL:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={theme.faviconUrl}
                  onChange={(e) => setTheme(prev => ({ ...prev, faviconUrl: e.target.value }))}
                  placeholder="e.g. /favicon.ico, /uploads/... or https://..."
                  style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                  Supported formats: <strong>.ico, .png, .svg, .jpg, .webp</strong> (32x32px or 64x64px recommended).
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: HERO TEXTS & IMAGES
         ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Hero Banner Texts & Main Product Image
          </h3>

          <div className="form-group">
            <label className="form-label">
              Hero Top Badge Text
            </label>
            <input
              type="text"
              className="form-input"
              value={hero.badge}
              onChange={(e) => setHero(prev => ({ ...prev, badge: e.target.value }))}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">
                Main Headline
              </label>
              <input
                type="text"
                className="form-input"
                value={hero.headline}
                onChange={(e) => setHero(prev => ({ ...prev, headline: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Headline Accent Word (Underlined)
              </label>
              <input
                type="text"
                className="form-input"
                value={hero.headlineAccent}
                onChange={(e) => setHero(prev => ({ ...prev, headlineAccent: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Sub-Headline
            </label>
            <input
              type="text"
              className="form-input"
              value={hero.subHeadline}
              onChange={(e) => setHero(prev => ({ ...prev, subHeadline: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Hero Description Paragraph
            </label>
            <textarea
              rows="3"
              className="form-textarea"
              value={hero.description}
              onChange={(e) => setHero(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Trust Footnote
            </label>
            <input
              type="text"
              className="form-input"
              value={hero.footnote}
              onChange={(e) => setHero(prev => ({ ...prev, footnote: e.target.value }))}
            />
          </div>

          {/* Main Hero Image */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
            <label className="form-label">
              Hero Product Image:
            </label>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #ccc', backgroundColor: '#18181b' }}>
                <img src={hero.heroImageUrl} alt="Hero product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>

              <div>
                <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                  <Upload size={16} />
                  <span>{uploadingTarget === 'heroImageUrl' ? 'Uploading...' : 'Upload New Product Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroImageUrl')}
                    style={{ display: 'none' }}
                  />
                </label>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
                  Current active path: <code>{hero.heroImageUrl}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PERKS & HIGHLIGHTS
         ========================================================================= */}
      {activeSubTab === 'perks' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Store Perks Section (3 Value Highlights)
          </h3>

          <div className="form-group">
            <label className="form-label">
              Perks Section Title
            </label>
            <input
              type="text"
              className="form-input"
              value={sections.perksTitle}
              onChange={(e) => setSections(prev => ({ ...prev, perksTitle: e.target.value }))}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">
              Perks Section Subtitle
            </label>
            <input
              type="text"
              className="form-input"
              value={sections.perksSubtitle}
              onChange={(e) => setSections(prev => ({ ...prev, perksSubtitle: e.target.value }))}
            />
          </div>

          {/* 3 Perks Editor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {perks.map((p, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#fafafa',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: theme.primaryColor, marginBottom: '0.65rem' }}>
                  Perk #{idx + 1}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={p.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPerks(prev => prev.map((item, i) => i === idx ? { ...item, title: val } : item));
                      }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Tag Badge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={p.tag}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPerks(prev => prev.map((item, i) => i === idx ? { ...item, tag: val } : item));
                      }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Description</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    value={p.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPerks(prev => prev.map((item, i) => i === idx ? { ...item, description: val } : item));
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: ORDERING STEPS & SECTION HEADINGS
         ========================================================================= */}
      {activeSubTab === 'steps' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Products Heading & How Ordering Works (3 Steps)
          </h3>

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Model Cards Section Header
            </h4>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input
                type="text"
                className="form-input"
                value={sections.modelsTitle}
                onChange={(e) => setSections(prev => ({ ...prev, modelsTitle: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Section Subtitle</label>
              <textarea
                rows="2"
                className="form-textarea"
                value={sections.modelsSubtitle}
                onChange={(e) => setSections(prev => ({ ...prev, modelsSubtitle: e.target.value }))}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              How Ordering Works (3 Steps)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem'
                  }}
                >
                  <div style={{ fontWeight: 800, color: theme.primaryColor, marginBottom: '0.5rem' }}>
                    Step {st.step}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Step Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={st.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSteps(prev => prev.map((item, i) => i === idx ? { ...item, title: val } : item));
                      }}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Step Description</label>
                    <input
                      type="text"
                      className="form-input"
                      value={st.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSteps(prev => prev.map((item, i) => i === idx ? { ...item, description: val } : item));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating/Sticky Save Button Bar */}
      <div style={{
        marginTop: '2rem',
        padding: '1.25rem',
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
          Review your changes and click <strong>"Save All Changes"</strong> to update the storefront.
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="btn-primary hover-lift"
          style={{
            backgroundColor: theme.primaryColor,
            borderColor: theme.primaryColor,
            padding: '0.8rem 1.8rem',
            fontSize: '1rem',
            fontWeight: 800
          }}
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>
    </div>
  );
}
