import React, { useState } from 'react';
import { Flame, Zap, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function HeaterGraphic({
  photoUrl = '/images/chula-glowing-red.jpg',
  activeWattage = 2000,
  activeSize = '8 / 10 inch'
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(photoUrl || '/images/chula-glowing-red.jpg');

  const photos = [
    { id: 'glow', label: 'গ্লোয়িং লাল কয়েল', url: '/images/chula-glowing-red.jpg', subtitle: 'চালু অবস্থায় লাল টকটকে' },
    { id: 'body', label: 'সিরামিক বডি ও ক্লিপ', url: '/images/chula-ceramic-clips.jpg', subtitle: 'মজবুত সিরামিক খাঁজ' },
    { id: 'angle', label: 'টার্মিনাল ব্লক', url: '/images/chula-angle-block.jpg', subtitle: 'হেভি কানেক্টর' },
    { id: 'setup', label: 'সম্পূর্ণ সেটআপ', url: '/images/chula-full-setup.jpg', subtitle: 'তার ও প্লাগ সহ রেডি' }
  ];

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '480px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem 0.5rem'
    }}>
      {/* Background Pulsing Fire / Ember Glow Aura */}
      <div
        className="animate-pulse-glow"
        style={{
          position: 'absolute',
          top: '25%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(214, 54, 26, 0.55) 0%, rgba(255, 69, 0, 0.3) 45%, rgba(255, 255, 255, 0) 72%)',
          filter: 'blur(35px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* Floating Main Product Card */}
      <div
        className="animate-pop-in animate-float"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Main Photo Frame with Glowing Accent Border */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          border: '2.5px solid var(--color-primary)',
          boxShadow: 'var(--shadow-glow), 0 20px 40px -10px rgba(214, 54, 26, 0.28)'
        }}>
          {/* Top Live Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 3,
            backgroundColor: 'rgba(214, 54, 26, 0.92)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
          }}>
            <Flame size={14} />
            <span>ইলেকট্রিক হিটার চুলা</span>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 3,
            backgroundColor: 'rgba(24, 24, 27, 0.88)',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.74rem',
            fontWeight: 700
          }}>
            অরিজিনাল প্রোডাক্ট ফটো
          </div>

          {/* Product Image */}
          <div style={{
            width: '100%',
            height: '280px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#18181b',
            overflow: 'hidden'
          }}>
            <img
              src={selectedPhoto}
              alt="Electric Heater Chula with Glowing Red Coil"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                transition: 'transform 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Real Product Photo Thumbnails Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          width: '100%',
          maxWidth: '380px',
          marginTop: '0.85rem',
          zIndex: 3
        }}>
          {photos.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPhoto(item.url)}
              style={{
                borderRadius: '8px',
                border: selectedPhoto === item.url ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                padding: '2px',
                textAlign: 'center',
                boxShadow: selectedPhoto === item.url ? '0 0 10px rgba(214, 54, 26, 0.35)' : 'var(--shadow-sm)'
              }}
              title={item.label}
            >
              <img
                src={item.url}
                alt={item.label}
                style={{ width: '100%', height: '48px', objectFit: 'contain', display: 'block', borderRadius: '5px' }}
              />
              <div style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                color: selectedPhoto === item.url ? 'var(--color-primary)' : 'var(--color-text-muted)',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {item.label}
              </div>
            </button>
          ))}
        </div>

        {/* Feature Badges */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1.15rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#ffffff',
            border: '1.5px solid rgba(214, 54, 26, 0.25)',
            borderRadius: '9999px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'var(--color-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Flame size={14} strokeWidth={2.4} />
            <span>লাল টকটকে কয়েল</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#ffffff',
            border: '1.5px solid #e4e4e7',
            borderRadius: '9999px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Zap size={14} color="#b45309" strokeWidth={2.4} />
            <span>রান্না ও ঘর গরম দুটোই</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#ffffff',
            border: '1.5px solid #bbf7d0',
            borderRadius: '9999px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#15803d',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <ShieldCheck size={14} strokeWidth={2.4} />
            <span>ফায়ারপ্রুফ সিরামিক বডি</span>
          </div>
        </div>
      </div>
    </div>
  );
}
