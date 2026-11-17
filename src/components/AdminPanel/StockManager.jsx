import React, { useState } from 'react';
import { Package, Save, CheckCircle, Flame, AlertCircle } from 'lucide-react';

export default function StockManager({ models = [], onSaveStock }) {
  const [stockState, setStockState] = useState(() =>
    models.map(m => ({
      id: m.id,
      name: m.name,
      size: m.size,
      wattage: m.wattage,
      stock: m.stock,
      isSoldOut: m.isSoldOut
    }))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleStockChange = (id, delta) => {
    setStockState(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newStock = Math.max(0, item.stock + delta);
          return {
            ...item,
            stock: newStock,
            isSoldOut: newStock === 0 ? true : item.isSoldOut
          };
        }
        return item;
      })
    );
  };

  const handleExactStockChange = (id, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setStockState(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            stock: num,
            isSoldOut: num === 0 ? true : item.isSoldOut
          };
        }
        return item;
      })
    );
  };

  const handleToggleSoldOut = (id) => {
    setStockState(prev =>
      prev.map(item => (item.id === id ? { ...item, isSoldOut: !item.isSoldOut } : item))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    try {
      await onSaveStock(stockState);
      setSuccessMsg('Stock counts & sold-out statuses updated! Store page is now in sync.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error updating stock: ' + err.message);
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
            Inventory & Sold-Out Controls
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Adjust available units and toggle the sold-out switch for each model. Sold-out models automatically hide their order button on the storefront.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="btn-primary hover-lift"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save Stock Changes'}</span>
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

      {/* Grid of 4 Models */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {stockState.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              border: item.isSoldOut ? '1.5px solid #e4e4e7' : '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span className="badge badge-ember" style={{ marginBottom: '0.35rem' }}>
                  {item.size} • {item.wattage}W
                </span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  {item.name}
                </h3>
              </div>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: item.isSoldOut ? '#f4f4f5' : 'var(--color-primary-light)',
                color: item.isSoldOut ? '#71717a' : 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={20} strokeWidth={2.5} />
              </div>
            </div>

            {/* Stepper & Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text-muted)' }}>
                Units in Stock
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleStockChange(item.id, -1)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.85rem', fontWeight: 800 }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  value={item.stock}
                  onChange={(e) => handleExactStockChange(item.id, e.target.value)}
                  className="form-input"
                  style={{ width: '85px', textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}
                />
                <button
                  type="button"
                  onClick={() => handleStockChange(item.id, 1)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.85rem', fontWeight: 800 }}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleStockChange(item.id, 5)}
                  className="btn-secondary"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}
                  title="Add 5 units"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Sold-out Switch */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--color-border-light)'
            }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                  Sold-Out Switch
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)' }}>
                  {item.isSoldOut ? 'Order button hidden on store' : 'Available for ordering'}
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={item.isSoldOut}
                  onChange={() => handleToggleSoldOut(item.id)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                />
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: item.isSoldOut ? 'var(--color-danger)' : 'var(--color-success)'
                }}>
                  {item.isSoldOut ? 'SOLD OUT' : 'ACTIVE'}
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
