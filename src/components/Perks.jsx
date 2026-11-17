import React from 'react';
import { Truck, Layers, MessageSquare, Flame } from 'lucide-react';

export default function Perks({ customizer }) {
  const title = customizer?.sections?.perksTitle || "কেন সজিব'স মার্টের হিটার চুলা সেরা?";
  const subtitle = customizer?.sections?.perksSubtitle || "খাঁটি আগুনে পোড়া সিরামিক বডি, অরিজিনাল লাল নাইক্রোম কয়েল ও দ্রুততম হোম ডেলিভারি সেবা।";

  const defaultIcons = [
    <Truck size={30} strokeWidth={2.2} />,
    <Flame size={30} strokeWidth={2.2} />,
    <MessageSquare size={30} strokeWidth={2.2} />
  ];

  const items = customizer?.perks || [
    {
      title: 'সারাদেশে ১০০% ফ্রি হোম ডেলিভারি',
      description: 'ঢাকা সহ বাংলাদেশের যেকোনো প্রান্তে সম্পূর্ণ ফ্রিতে হোম ডেলিভারি। কোনো অগ্রিম টাকা লাগবে না, ক্যাশ অন ডেলিভারিতে পার্সেল চেক করে নিন।',
      tag: '100% Free Shipping'
    },
    {
      title: '৪টি সাইজ ও ওয়াটের হিটার চুলা',
      description: '৮ ইঞ্চি (১০০০W ও ১৫০০W) চা ও দৈনন্দিন রান্না এবং ১০ ইঞ্চি (২৫০০W ও ৩০০০W) ভারী রান্নাবান্না ও তীব্র শীতের রুম দ্রুত গরম করার জন্য।',
      tag: '৮" ও ১০" সিরামিক বডি'
    },
    {
      title: 'মেসেজ পাঠিয়ে সরাসরি অর্ডার',
      description: 'কোনো একাউন্ট খুলতে হবে না। ১-ক্লিকে হোয়াটসঅ্যাপে বা ফেসবুক মেসেঞ্জারে আপনার ঠিকানা পাঠিয়ে সাথে সাথে অর্ডার কনফার্ম করুন।',
      tag: 'WhatsApp & Messenger'
    }
  ];

  return (
    <section style={{
      padding: '3rem 0',
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--color-border)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container">
        <div style={{
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            letterSpacing: '-0.02em',
            marginBottom: '0.6rem'
          }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.55 }}>
            {subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}>
          {items.map((perk, idx) => (
            <div
              key={idx}
              className="hover-lift"
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.6rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative'
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(214, 54, 26, 0.2)'
              }}>
                {defaultIcons[idx % defaultIcons.length]}
              </div>

              <div>
                <span className="badge badge-ember" style={{ marginBottom: '0.6rem' }}>
                  {perk.tag}
                </span>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  lineHeight: 1.3
                }}>
                  {perk.title}
                </h3>
                <p style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.94rem',
                  lineHeight: 1.55
                }}>
                  {perk.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
