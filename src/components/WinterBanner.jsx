import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export default function WinterBanner({ offer }) {
  if (!offer || !offer.active || !offer.text) return null;

  return (
    <div style={{
      backgroundColor: 'var(--color-primary)',
      color: '#ffffff',
      padding: '0.6rem 1rem',
      fontSize: '0.9rem',
      fontWeight: 600,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.65rem',
      flexWrap: 'wrap',
      boxShadow: '0 2px 8px rgba(214, 54, 26, 0.2)'
    }}>
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: '0.15rem 0.55rem',
        borderRadius: '9999px',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        fontWeight: 700
      }}>
        <Flame size={13} strokeWidth={2.5} />
        {offer.badge || 'Winter Offer'}
      </span>
      <span>{offer.text}</span>
    </div>
  );
}
