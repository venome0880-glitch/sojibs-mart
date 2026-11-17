import React from 'react';
import { Flame, MessageCircle, Truck, ArrowDown, Sparkles, ChefHat } from 'lucide-react';
import HeaterGraphic from './HeaterGraphic';

export default function Hero({ config, customizer, onScrollToModels, onScrollToOrder }) {
  const badgeText = customizer?.hero?.badge || 'ইলেকট্রিক হিটার চুলা (Electric Heater Chula) • ফ্রি হোম ডেলিভারি';
  const headline = customizer?.hero?.headline || 'A warmer room this winter.';
  const headlineAccent = customizer?.hero?.headlineAccent || 'Delivered free.';
  const subHeadline = customizer?.hero?.subHeadline || 'খাঁটি সিরামিক ইলেকট্রিক হিটার চুলা — দ্রুত রান্না ও ঘর গরম দুটোই এক সাথে!';
  const description = customizer?.hero?.description || 'উচ্চ তাপমাত্রার পোড়া মাটির ফায়ারপ্রুফ সিরামিক বডি ও লাল টকটকে নাইক্রোম কয়েল। ৮ ইঞ্চি ও ১০ ইঞ্চি মডেলে ১০০০W থেকে ৩০০০W পর্যন্ত। গ্যাস ছাড়া দ্রুত রান্নাবান্না ও তীব্র শীতে রুমের উষ্ণতায় সেরা সমাধান।';
  const footnote = customizer?.hero?.footnote || 'ক্যাশ অন ডেলিভারি • পার্সেল দেখে নেওয়ার সুবিধা • ৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি';
  const heroImageUrl = customizer?.hero?.heroImageUrl || config?.productPhotoUrl || '/images/chula-glowing-red.jpg';

  return (
    <section id="home" style={{
      padding: '2.5rem 0 3.5rem 0',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        gap: '2.5rem'
      }}>
        {/* Left Content Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Tagline Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 800,
            width: 'fit-content',
            border: '1px solid rgba(214, 54, 26, 0.2)'
          }}>
            <Flame size={16} strokeWidth={2.4} />
            <span>{badgeText}</span>
          </div>

          {/* Headline - Slides Up on Load */}
          <h1 className="animate-slide-up" style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-main)'
          }}>
            {headline}{' '}
            <span style={{
              color: 'var(--color-primary)',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(214, 54, 26, 0.3)',
              textUnderlineOffset: '6px'
            }}>
              {headlineAccent}
            </span>
          </h1>

          {/* Bengali Sub-Headline */}
          {subHeadline && (
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              lineHeight: 1.35
            }}>
              {subHeadline}
            </div>
          )}

          {/* Subtitle / Description */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            maxWidth: '540px'
          }}>
            {description}
          </p>

          {/* Value Highlights Pill Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
            padding: '0.4rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 700 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Truck size={16} strokeWidth={2.5} />
              </div>
              <span>৳0 ডেলিভারি চার্জ (ক্যাশ অন ডেলিভারি)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', fontWeight: 700 }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChefHat size={16} strokeWidth={2.5} />
              </div>
              <span>৮" ও ১০" সাইজের ৪টি মডেল</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            flexWrap: 'wrap',
            paddingTop: '0.4rem'
          }}>
            <button
              onClick={onScrollToOrder}
              className="btn-primary hover-lift"
              style={{
                padding: '0.85rem 1.6rem',
                fontSize: '1.02rem',
                boxShadow: '0 6px 20px rgba(214, 54, 26, 0.28)'
              }}
            >
              <span>হিটার চুলা অর্ডার করুন</span>
              <ArrowDown size={18} />
            </button>

            <button
              onClick={onScrollToModels}
              className="btn-secondary hover-lift"
              style={{ padding: '0.85rem 1.4rem', fontSize: '0.98rem' }}
            >
              <span>৪টি মডেল ও দাম দেখুন</span>
            </button>
          </div>

          {/* Trust Footnote */}
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-subtle)', paddingTop: '0.25rem' }}>
            {footnote}
          </div>
        </div>

        {/* Right Visual Column (Heater Chula Photo Switcher & Glowing Aura) */}
        <div>
          <HeaterGraphic
            photoUrl={heroImageUrl}
            activeWattage={2500}
            activeSize="10 inch"
          />
        </div>
      </div>
    </section>
  );
}
