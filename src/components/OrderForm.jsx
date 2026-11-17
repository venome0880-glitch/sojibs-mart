import React, { useState, useEffect } from 'react';
import {
  Send,
  Copy,
  CheckCircle,
  Truck,
  MessageCircle,
  ExternalLink,
  Flame,
  ShieldCheck,
  AlertCircle,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';

export default function OrderForm({
  models = [],
  currency = '৳',
  config = {},
  selectedModel = null,
  formRef
}) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [modelId, setModelId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);

  // Sync selected model if clicked from model cards
  useEffect(() => {
    if (selectedModel && !selectedModel.isSoldOut) {
      setModelId(selectedModel.id);
    } else if (models.length > 0 && !modelId) {
      const firstAvailable = models.find(m => !m.isSoldOut && m.stock > 0);
      if (firstAvailable) setModelId(firstAvailable.id);
    }
  }, [selectedModel, models]);

  const activeModel = models.find(m => m.id === modelId) || models[0] || null;
  const unitPrice = activeModel ? activeModel.price : 0;
  const grandTotal = unitPrice * quantity;

  // Validate form fields
  const validateForm = () => {
    if (!customerName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম লিখুন (Please enter your name).');
      return false;
    }
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('অনুগ্রহ করে সঠিক মোবাইল নম্বর দিন (১০ বা ১১ ডিজিট)।');
      return false;
    }
    if (!modelId) {
      setErrorMessage('একটি হিটার চুলা মডেল নির্বাচন করুন।');
      return false;
    }
    if (!deliveryAddress.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার বিস্তারিত ডেলিভারি ঠিকানা দিন।');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Submit order to backend database
  const submitToDatabase = async (source) => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: phone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          modelId,
          quantity,
          source
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order. Please try again.');
      }

      setSubmittedOrder(data);
      return data;
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong saving the order.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Direct "Confirm Order" Button
  const handleConfirmOrderSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await submitToDatabase('Website Direct');
    if (result) {
      // Smoothly scroll up slightly to show the confirmation receipt
      const el = document.getElementById('order-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. "Send order on WhatsApp" Button
  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await submitToDatabase('WhatsApp');
    if (result && result.whatsappUrl) {
      window.open(result.whatsappUrl, '_blank');
    }
  };

  // Copy order message
  const handleCopyReceipt = async () => {
    if (!submittedOrder) return;
    try {
      await navigator.clipboard.writeText(submittedOrder.messageText);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3500);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = submittedOrder.messageText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3500);
    }
  };

  return (
    <section id="order-form-section" ref={formRef} style={{
      padding: '4.5rem 0',
      backgroundColor: '#ffffff'
    }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto'
        }}>
          <span className="badge badge-ember" style={{ marginBottom: '0.65rem' }}>
            ক্যাশ অন ডেলিভারি অর্ডার ফরম
          </span>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
            letterSpacing: '-0.02em',
            marginBottom: '0.65rem'
          }}>
            হিটার চুলা অর্ডার করুন (Order Form)
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.02rem', lineHeight: 1.55 }}>
            আপনার নাম, মোবাইল নম্বর ও ঠিকানা দিয়ে <strong>"Confirm Order"</strong> বাটনে ক্লিক করে সরাসরি অর্ডার নিশ্চিত করুন।
          </p>
        </div>

        {/* ORDER CONFIRMATION RECEIPT CARD (Shows immediately when order is confirmed) */}
        {submittedOrder && (
          <div style={{
            backgroundColor: '#ffffff',
            border: '2px solid #86efac',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            marginBottom: '2.5rem',
            boxShadow: '0 10px 30px rgba(21, 128, 61, 0.12)',
            position: 'relative'
          }}>
            {/* Top Success Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle size={28} strokeWidth={2.6} />
              </div>
              <div>
                <span className="badge badge-success" style={{ marginBottom: '0.25rem' }}>
                  অর্ডার নিশ্চিত হয়েছে (Order Confirmed)
                </span>
                <h3 style={{ fontSize: '1.45rem', color: '#14532d', fontWeight: 900, lineHeight: 1.2 }}>
                  ধন্যবাদ {submittedOrder.order.customerName}! আপনার অর্ডার গৃহীত হয়েছে।
                </h3>
              </div>
            </div>

            {/* Receipt Summary Grid */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              margin: '1.25rem 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              fontSize: '0.92rem'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  অর্ডার আইডি (Order ID)
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                  #{submittedOrder.order.id}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  নির্বাচিত মডেল ও পরিমাণ
                </div>
                <div style={{ fontWeight: 800, color: '#1e293b' }}>
                  {submittedOrder.order.modelName} (x{submittedOrder.order.quantity})
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  মোট ক্যাশ অন ডেলিভারি
                </div>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', color: '#15803d' }}>
                  {currency}{submittedOrder.order.totalAmount.toLocaleString()}
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginLeft: '4px' }}>
                    (ফ্রি ডেলিভারি)
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  ডেলিভারি ঠিকানা
                </div>
                <div style={{ fontWeight: 600, color: '#334155' }}>
                  {submittedOrder.order.deliveryAddress}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.94rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              আমাদের ডেলিভারি টিম খুব দ্রুত আপনার সাথে <strong>{submittedOrder.order.phone}</strong> নম্বরে যোগাযোগ করে পার্সেলটি পাঠিয়ে দেবে।
            </p>

            {/* Action Row */}
            <div style={{
              display: 'flex',
              gap: '0.85rem',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <a
                href={submittedOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp hover-lift"
                style={{ padding: '0.75rem 1.3rem', fontSize: '0.95rem' }}
              >
                <MessageCircle size={18} strokeWidth={2.4} />
                <span>হোয়াটসঅ্যাপে আপডেট নিন (WhatsApp)</span>
                <ExternalLink size={15} />
              </a>

              <button
                type="button"
                onClick={handleCopyReceipt}
                className="btn-secondary hover-lift"
                style={{ padding: '0.75rem 1.2rem', fontSize: '0.92rem' }}
              >
                <Copy size={16} />
                <span>{copyFeedback ? 'কপি হয়েছে (Copied!)' : 'অর্ডারের বিবরণ কপি করুন'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmittedOrder(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.88rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: 'auto'
                }}
              >
                নতুন আরেকটি অর্ডার করুন
              </button>
            </div>
          </div>
        )}

        {/* Main Order Card */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem 2rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {errorMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid #fecaca'
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Customer Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="customer-name">
                  আপনার নাম (Your Name) *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  className="form-input"
                  placeholder="যেমন: রফিকুল ইসলাম"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="customer-phone">
                  মোবাইল নম্বর (Phone / WhatsApp Number) *
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  className="form-input"
                  placeholder="যেমন: 017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Model Selection */}
            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label className="form-label" htmlFor="heater-model">
                হিটার চুলা মডেল নির্বাচন করুন (Choose Heater Model) *
              </label>
              <select
                id="heater-model"
                className="form-select"
                value={modelId}
                onChange={(e) => setModelId(e.target.value)}
              >
                {models.map((m) => (
                  <option
                    key={m.id}
                    value={m.id}
                    disabled={m.isSoldOut || m.stock <= 0}
                  >
                    {m.name} ({m.wattage}W) — {currency}{m.price.toLocaleString()}
                    {m.isSoldOut || m.stock <= 0 ? ' [স্টক শেষ]' : ` [স্টকে আছে: ${m.stock}টি]`}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Stepper & Active Model Specs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              margin: '1.25rem 0'
            }}>
              {/* Quantity */}
              <div className="form-group">
                <label className="form-label">
                  পরিমাণ (Quantity)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="btn-secondary"
                    style={{ padding: '0.65rem 1rem', fontSize: '1.1rem', fontWeight: 800 }}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <div style={{
                    width: '60px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.55rem 0',
                    backgroundColor: '#ffffff'
                  }}>
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(5, q + 1))}
                    className="btn-secondary"
                    style={{ padding: '0.65rem 1rem', fontSize: '1.1rem', fontWeight: 800 }}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Selected Model Spec Info Box */}
              {activeModel && (
                <div style={{
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1.5px solid rgba(214, 54, 26, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}>
                  <Flame size={26} color="var(--color-primary)" strokeWidth={2.4} />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      নির্বাচিত: {activeModel.name} ({activeModel.wattage}W)
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                      {activeModel.coils} • সিরামিক বডি
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="delivery-address">
                সম্পূর্ণ ডেলিভারি ঠিকানা (Full Delivery Address) *
              </label>
              <textarea
                id="delivery-address"
                rows="3"
                className="form-textarea"
                placeholder="বাসা নং, রোড নং, এলাকা/থানা (যেমন: মিরপুর, উত্তরা, ধানমন্ডি), জেলা..."
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-subtle)' }}>
                আপনার জেলা ও থানার নাম উল্লেখ করুন যেন ডেলিভারি রাইডার সরাসরি পৌঁছে দিতে পারে।
              </span>
            </div>

            {/* Order Summary Box */}
            <div style={{
              backgroundColor: '#fafafa',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              margin: '1.5rem 0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.94rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {activeModel?.name} ({quantity}টি)
                </span>
                <span style={{ fontWeight: 700 }}>
                  {currency}{((activeModel?.price || 0) * quantity).toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.94rem' }}>
                <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Truck size={16} color="#15803d" />
                  সারাদেশে ডেলিভারি চার্জ:
                </span>
                <span style={{ color: '#15803d', fontWeight: 800 }}>
                  সম্পূর্ণ ফ্রি (৳0 FREE)
                </span>
              </div>

              <div style={{
                borderTop: '1.5px dashed var(--color-border)',
                paddingTop: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800 }}>
                  সর্বমোট প্রদেয় টাকা (ক্যাশ অন ডেলিভারি):
                </span>
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.85rem',
                  fontWeight: 900,
                  color: 'var(--color-primary)'
                }}>
                  {currency}{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons: Confirm Order as Primary Button, plus WhatsApp Option */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              {/* PRIMARY ACTION: "Confirm Order" (Replaces Copy order message) */}
              <button
                type="button"
                onClick={handleConfirmOrderSubmit}
                disabled={isSubmitting || activeModel?.isSoldOut}
                className="btn-primary hover-lift"
                style={{
                  padding: '1rem 1.5rem',
                  fontSize: '1.08rem',
                  fontWeight: 900,
                  boxShadow: '0 6px 18px rgba(214, 54, 26, 0.35)'
                }}
              >
                <CheckCircle size={22} strokeWidth={2.6} />
                <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'Confirm Order (অর্ডার কনফার্ম করুন)'}</span>
              </button>

              {/* SECONDARY ACTION: "Send order on WhatsApp" */}
              <button
                type="button"
                onClick={handleWhatsAppSubmit}
                disabled={isSubmitting || activeModel?.isSoldOut}
                className="btn-whatsapp hover-lift"
                style={{
                  padding: '1rem 1.4rem',
                  fontSize: '1.02rem',
                  fontWeight: 800
                }}
              >
                <MessageCircle size={20} strokeWidth={2.4} />
                <span>Send order on WhatsApp</span>
              </button>
            </div>

            <p style={{
              textAlign: 'center',
              fontSize: '0.84rem',
              color: 'var(--color-text-subtle)',
              marginTop: '1.25rem'
            }}>
              কোনো অগ্রিম টাকা দিতে হবে না। পার্সেল হাতে পেয়ে দেখে টাকা পরিশোধ করুন (ক্যাশ অন ডেলিভারি)।
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
