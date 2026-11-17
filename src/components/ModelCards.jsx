import React, { useState, useEffect, useRef } from 'react';
import { Flame, Zap, Shield, Check, ShoppingCart, Ban, Maximize2, ChefHat } from 'lucide-react';

// Wattage count-up hook
function useCountUp(targetNumber, isVisible, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(targetNumber);
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = Math.floor((1 - (1 - progress) * (1 - progress)) * targetNumber);
      setCount(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(targetNumber);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [targetNumber, isVisible, duration]);

  return count;
}

function ModelCard({ model, currency, onSelectModel, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animatedWattage = useCountUp(model.wattage, isVisible);
  const isSoldOut = model.isSoldOut || model.stock <= 0;

  return (
    <div
      ref={cardRef}
      className="hover-lift"
      style={{
        backgroundColor: '#ffffff',
        border: isSoldOut ? '1.5px solid #e4e4e7' : '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s, box-shadow 0.2s ease`
      }}
    >
      <div>
        {/* Top Header & Size Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.85rem'
        }}>
          {/* Size Tag */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: '#f4f4f5',
            color: 'var(--color-text-main)',
            fontSize: '0.8rem',
            fontWeight: 800,
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #e4e4e7'
          }}>
            <Maximize2 size={13} strokeWidth={2.4} />
            {model.size} ({model.sizeNumber === 8 ? '৮ ইঞ্চি' : '১০ ইঞ্চি'})
          </span>

          {/* Stock or Sold Out Badge */}
          {isSoldOut ? (
            <span className="badge badge-soldout">
              <Ban size={12} strokeWidth={2.5} />
              স্টক শেষ (Sold Out)
            </span>
          ) : (
            <span className="badge badge-success">
              স্টকে আছে ({model.stock}টি)
            </span>
          )}
        </div>

        {/* Product Photo Thumbnail */}
        {model.image && (
          <div style={{
            width: '100%',
            height: '170px',
            backgroundColor: '#18181b',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            marginBottom: '1rem',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <img
              src={model.image}
              alt={model.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              backgroundColor: 'rgba(214, 54, 26, 0.9)',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '4px'
            }}>
              {model.wattage}W কয়েল
            </div>
          </div>
        )}

        {/* Model Title & Bengali Name */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--color-text-main)',
          marginBottom: '0.25rem',
          lineHeight: 1.25
        }}>
          {model.name}
        </h3>
        {model.bengaliName && (
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
            {model.bengaliName}
          </div>
        )}
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--color-text-muted)',
          marginBottom: '1.15rem',
          minHeight: '2.4rem',
          lineHeight: 1.45
        }}>
          {model.subtitle}
        </p>

        {/* Dynamic Wattage Meter with Count-Up */}
        <div style={{
          backgroundColor: isSoldOut ? '#fafafa' : 'var(--color-primary-light)',
          border: `1.5px solid ${isSoldOut ? '#e4e4e7' : 'rgba(214, 54, 26, 0.25)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.15rem'
        }}>
          <div>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: isSoldOut ? '#71717a' : 'var(--color-primary)'
            }}>
              কয়েল পাওয়ার ওয়াট
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              fontWeight: 800,
              color: isSoldOut ? '#52525b' : 'var(--color-primary)',
              lineHeight: 1.1
            }}>
              {animatedWattage}
              <span style={{ fontSize: '0.95rem', fontWeight: 700, marginLeft: '2px' }}>W</span>
            </div>
          </div>

          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: isSoldOut ? '#e4e4e7' : '#ffffff',
            color: isSoldOut ? '#71717a' : 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <Flame size={22} strokeWidth={2.4} />
          </div>
        </div>

        {/* Spec Bullet Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-text-main)' }}>
            <ChefHat size={16} color="var(--color-primary)" strokeWidth={2.4} />
            <span>ব্যবহার: <strong>{model.roomCoverage}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--color-text-main)' }}>
            <Flame size={16} color="var(--color-primary)" strokeWidth={2.4} />
            <span>কয়েল টাইপ: <strong>{model.coils}</strong></span>
          </div>

          {model.features && model.features.slice(0, 3).map((feat, fidx) => (
            <div key={fidx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
              <Check size={15} color="#15803d" strokeWidth={2.4} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Price & Order Action */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '1.15rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* Price Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            ফ্রি হোম ডেলিভারি মূল্য:
          </span>
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.65rem',
            fontWeight: 800,
            color: 'var(--color-text-main)'
          }}>
            {currency}{model.price.toLocaleString()}
          </div>
        </div>

        {/* Sold-out model hides its order button as required! */}
        {isSoldOut ? (
          <div style={{
            textAlign: 'center',
            padding: '0.75rem',
            backgroundColor: '#f4f4f5',
            color: '#71717a',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 700,
            border: '1px solid #e4e4e7'
          }}>
            বর্তমানে স্টক শেষ
          </div>
        ) : (
          <button
            onClick={() => onSelectModel(model)}
            className="btn-primary hover-lift"
            style={{ width: '100%', padding: '0.82rem' }}
          >
            <ShoppingCart size={17} />
            <span>এই চুলাটি অর্ডার করুন</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default function ModelCards({ models, customizer, currency, onSelectModel }) {
  const title = customizer?.sections?.modelsTitle || 'আপনার প্রয়োজনীয় সাইজের হিটার চুলা বেছে নিন';
  const subtitle = customizer?.sections?.modelsSubtitle || '৮ ইঞ্চি (১০০০W ও ১৫০০W) এবং ১০ ইঞ্চি (২৫০০W ও ৩০০০W) মডেল। প্রতিটি চুলায় রয়েছে লাল টকটকে নাইক্রোম কয়েল, মজবুত সিরামিক বডি, পাতিল স্ট্যান্ড ক্লিপ এবং সারাদেশে ফ্রি হোম ডেলিভারি।';

  return (
    <section id="models" style={{
      padding: '4rem 0',
      backgroundColor: '#ffffff'
    }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{
          textAlign: 'center',
          maxWidth: '750px',
          margin: '0 auto 3rem auto'
        }}>
          <span className="badge badge-ember" style={{ marginBottom: '0.65rem' }}>
            ইলেকট্রিক হিটার চুলা মডেল ও দাম
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            letterSpacing: '-0.02em',
            marginBottom: '0.8rem'
          }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.02rem', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        {/* 4 Model Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.75rem'
        }}>
          {models.map((model, idx) => (
            <ModelCard
              key={model.id}
              model={model}
              currency={currency}
              onSelectModel={onSelectModel}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
