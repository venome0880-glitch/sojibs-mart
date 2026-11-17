import React, { useState } from 'react';
import { Tag, Save, CheckCircle, Sparkles, Flame } from 'lucide-react';

export default function PricingOffers({
  models = [],
  winterOffer = {},
  currency = '৳',
  onSavePricingOffers
}) {
  const [prices, setPrices] = useState(() =>
    models.map(m => ({
      id: m.id,
      name: m.name,
      size: m.size,
      wattage: m.wattage,
      price: m.price
    }))
  );

  const [offerState, setOfferState] = useState({
    active: winterOffer?.active ?? true,
    badge: winterOffer?.badge || 'Winter Special Deal',
    text: winterOffer?.text || 'Winter Special: Free Express Home Delivery + Instant WhatsApp Order Confirmation across Bangladesh!'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePriceChange = (id, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setPrices(prev => prev.map(p => (p.id === id ? { ...p, price: num } : p)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await onSavePricingOffers({
        prices,
        winterOffer: offerState
      });
      setSuccessMsg('Prices and winter offer banner updated! Storefront is refreshed immediately.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error updating prices & offers: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Prices & Winter Offer Banner
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Set customer prices for each of the four models and configure the top announcement banner.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="btn-primary hover-lift"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Pricing & Banner'}</span>
        </button>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#f0fdf4',
          color: '#15803d',
          border: '1.5px solid #86efac',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700
        }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Model Pricing Grid */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Tag size={18} color="var(--color-primary)" />
          <span>Model Selling Prices ({currency})</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {prices.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#fafafa',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.15rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {item.size} • {item.wattage}W
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                  Free Delivery Included
                </span>
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                {item.name}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
                  className="form-input"
                  style={{ fontWeight: 800, fontSize: '1.1rem' }}
                  value={item.price}
                  onChange={(e) => handlePriceChange(item.id, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Winter Offer Banner Configuration */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--color-primary)" />
            <span>Storefront Winter Offer Banner</span>
          </h3>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={offerState.active}
              onChange={(e) => setOfferState(prev => ({ ...prev, active: e.target.checked }))}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: offerState.active ? 'var(--color-success)' : '#71717a' }}>
              {offerState.active ? 'BANNER ENABLED' : 'BANNER DISABLED'}
            </span>
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">
            Banner Badge Label
          </label>
          <input
            type="text"
            className="form-input"
            value={offerState.badge}
            onChange={(e) => setOfferState(prev => ({ ...prev, badge: e.target.value }))}
            placeholder="e.g. Winter Special Deal, Flash Offer"
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Banner Announcement Text
          </label>
          <input
            type="text"
            className="form-input"
            value={offerState.text}
            onChange={(e) => setOfferState(prev => ({ ...prev, text: e.target.value }))}
            placeholder="e.g. Winter Special: Free Express Home Delivery across Bangladesh!"
          />
        </div>

        {/* Live Preview */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>
            Live Preview on Store Page:
          </div>
          {offerState.active ? (
            <div style={{
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textAlign: 'center'
            }}>
              <span style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                {offerState.badge || 'Offer'}
              </span>
              <span>{offerState.text}</span>
            </div>
          ) : (
            <div style={{ padding: '0.75rem', backgroundColor: '#f4f4f5', color: '#71717a', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              Banner is currently hidden.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
