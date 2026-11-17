import React from 'react';
import { Flame, MessageCircle, Lock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ config, customizer, onNavigateAdmin }) {
  const shopName = customizer?.theme?.shopName || config?.shopName || "Sojib's Mart";
  const logoType = customizer?.theme?.logoType || 'icon';
  const logoImageUrl = customizer?.theme?.logoImageUrl || config?.logoImageUrl || '';

  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--color-border)',
      padding: '3rem 0 2rem 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid var(--color-border-light)'
        }}>
          {/* Shop Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
              {logoType === 'image' && logoImageUrl ? (
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1.5px solid var(--color-border)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src={logoImageUrl} alt="Footer Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
                  <Flame size={22} strokeWidth={2.5} />
                </div>
              )}
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                {shopName}
              </span>
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Direct supplier of premium electric room heaters across Bangladesh. Instant radiant warmth with 100% free delivery on every order.
            </p>
          </div>

          {/* Quick Channels */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Order Channels
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <a
                href={`https://wa.me/${config?.whatsappClean || '8801796017442'}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.92rem',
                  color: '#15803d',
                  fontWeight: 600
                }}
              >
                <MessageCircle size={17} strokeWidth={2.4} />
                <span>WhatsApp: {config?.whatsappNumber || '880 01796017442'}</span>
              </a>

              {config?.facebookPage && (
                <a
                  href={config.facebookPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.92rem',
                    color: '#1d4ed8',
                    fontWeight: 600
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                  <span>Official Facebook Page</span>
                </a>
              )}
            </div>
          </div>

          {/* Guarantee Column */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Winter Assurance
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                <span>100% Free Doorstep Delivery</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                <span>Cash on Delivery (No Advance)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                <span>7-Day Replacement Warranty</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin Link */}
        <div style={{
          paddingTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-subtle)'
        }}>
          <div>
            © {new Date().getFullYear()} {config?.shopName || "Sojib's Mart"}. All rights reserved.
          </div>

          <button
            onClick={onNavigateAdmin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-subtle)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.82rem',
              textDecoration: 'underline'
            }}
          >
            <Lock size={13} />
            <span>Owner Admin Login</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
