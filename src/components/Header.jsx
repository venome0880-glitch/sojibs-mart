import React from 'react';
import { Flame, MessageCircle, Phone, ShoppingBag } from 'lucide-react';

export default function Header({ config, customizer, onScrollToOrder }) {
  const shopName = customizer?.theme?.shopName || config?.shopName || "Sojib's Mart";
  const tagline = customizer?.theme?.tagline || config?.tagline || 'ইলেকট্রিক হিটার চুলা';
  const logoType = customizer?.theme?.logoType || 'icon';
  const logoImageUrl = customizer?.theme?.logoImageUrl || '';

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '0.85rem',
        paddingBottom: '0.85rem'
      }}>
        {/* Brand Logo */}
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {logoType === 'image' && logoImageUrl ? (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid var(--color-border)'
            }}>
              <img src={logoImageUrl} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)',
              border: '1.5px solid rgba(214, 54, 26, 0.25)'
            }}>
              <Flame size={24} strokeWidth={2.5} />
            </div>
          )}
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-main)',
              lineHeight: 1.1
            }}>
              {shopName}
            </div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-primary)'
            }}>
              {tagline}
            </div>
          </div>
        </a>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* WhatsApp Direct Link */}
          <a
            href={`https://wa.me/${config?.whatsappClean || '8801796017442'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-lift"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #bbf7d0',
              backgroundColor: '#f0fdf4',
              color: '#15803d',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
            aria-label="Direct WhatsApp Contact"
          >
            <MessageCircle size={16} strokeWidth={2.4} />
            <span style={{ display: 'none', md: 'inline' }} className="header-whatsapp-text">
              {config?.whatsappNumber || '880 01796017442'}
            </span>
          </a>

          {/* Facebook Link */}
          {config?.facebookPage && (
            <a
              href={config.facebookPage}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bfdbfe',
                backgroundColor: '#eff6ff',
                color: '#1d4ed8',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
              aria-label="Facebook Page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
              <span className="header-facebook-text">Facebook</span>
            </a>
          )}

          {/* Jump to Order Button */}
          <button
            onClick={onScrollToOrder}
            className="btn-primary hover-lift"
            style={{ padding: '0.52rem 1rem', fontSize: '0.88rem' }}
          >
            <ShoppingBag size={16} />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </header>
  );
}
