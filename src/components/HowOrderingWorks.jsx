import React from 'react';
import { MousePointerClick, Send, Home, ArrowRight } from 'lucide-react';

export default function HowOrderingWorks({ customizer, onScrollToOrder }) {
  const title = customizer?.sections?.stepsTitle || 'How Ordering Works';
  const subtitle = customizer?.sections?.stepsSubtitle || 'অর্ডার প্রক্রিয়া অত্যন্ত সহজ ও দ্রুত — কোনো অগ্রিম পেমেন্ট নেই।';

  const defaultIcons = [
    <MousePointerClick size={28} strokeWidth={2.3} />,
    <Send size={28} strokeWidth={2.3} />,
    <Home size={28} strokeWidth={2.3} />
  ];

  const stepList = customizer?.steps || [
    {
      step: '01',
      title: 'মডেল বেছে নিন ও ঠিকানা দিন',
      description: 'আপনার পছন্দের হিটার চুলা সিলেক্ট করে নাম, মোবাইল নম্বর ও ডেলিভারি ঠিকানা পূরণ করুন।'
    },
    {
      step: '02',
      title: 'অর্ডার কনফার্ম করুন',
      description: 'Confirm Order বাটনে চাপ দিয়ে সরাসরি অর্ডার প্লেস করুন অথবা হোয়াটসঅ্যাপে পাঠান।'
    },
    {
      step: '03',
      title: 'ডেলিভারি পেয়ে টাকা দিন',
      description: 'রাইডার আপনার দরজায় পার্সেল নিয়ে পৌঁছাবে। পার্সেল দেখে ক্যাশ অন ডেলিভারিতে মূল্য দিন।'
    }
  ];

  return (
    <section style={{
      padding: '4rem 0',
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container">
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          maxWidth: '650px',
          margin: '0 auto 3rem auto'
        }}>
          <span className="badge badge-ember" style={{ marginBottom: '0.65rem' }}>
            সহজ ৩টি ধাপ
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
            letterSpacing: '-0.02em',
            marginBottom: '0.8rem'
          }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            {subtitle}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          position: 'relative'
        }}>
          {stepList.map((item, idx) => (
            <div
              key={idx}
              className="hover-lift"
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.2rem 1.8rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}
            >
              {/* Step Number Watermark */}
              <div style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.5rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#f4f4f5',
                lineHeight: 1
              }}>
                {item.step || `0${idx + 1}`}
              </div>

              {/* Icon Box */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid rgba(214, 54, 26, 0.25)'
              }}>
                {defaultIcons[idx % defaultIcons.length]}
              </div>

              {/* Step Text */}
              <div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  lineHeight: 1.3
                }}>
                  {item.title}
                </h3>
                <p style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.94rem',
                  lineHeight: 1.6
                }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Center CTA */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button
            onClick={onScrollToOrder}
            className="btn-primary hover-lift"
            style={{ padding: '0.85rem 1.8rem', fontSize: '1rem' }}
          >
            <span>Proceed to Order Form</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
