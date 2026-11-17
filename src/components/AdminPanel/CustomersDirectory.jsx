import React, { useState } from 'react';
import { Download, Users, Phone, Search, ShoppingBag, Eye, Calendar, MapPin } from 'lucide-react';

export default function CustomersDirectory({
  customers = [],
  currency = '৳',
  onExportCsv
}) {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      (c.area && c.area.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: '1000px' }}>
      {/* Header & Export Action */}
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
            Customer Directory & Order History
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Saved phone numbers aggregated with lifetime orders, total spend, and delivery addresses.
          </p>
        </div>

        <button
          onClick={onExportCsv}
          className="btn-primary hover-lift"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
        >
          <Download size={16} />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1rem',
        marginBottom: '1.25rem',
        position: 'relative',
        maxWidth: '450px'
      }}>
        <Search size={16} color="var(--color-text-subtle)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
          placeholder="Search by name, phone number, or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Customer Count */}
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.85rem', fontWeight: 600 }}>
        Showing {filtered.length} unique customer contacts
      </div>

      {/* Customers Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa', borderBottom: '1.5px solid var(--color-border)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>Customer Name</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>Phone Number</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>Primary Address</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>Total Orders</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-text-muted)' }}>Total Spent</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-text-muted)' }}>History</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                  No customer records found.
                </td>
              </tr>
            ) : (
              filtered.map((cust, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                  {/* Name */}
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>
                    {cust.name}
                  </td>

                  {/* Phone */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <a
                      href={`tel:${cust.phone}`}
                      style={{ color: '#1d4ed8', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Phone size={13} />
                      <span>{cust.phone}</span>
                    </a>
                  </td>

                  {/* Address */}
                  <td style={{ padding: '0.85rem 1rem', maxWidth: '240px', lineHeight: 1.35 }}>
                    <div>{cust.address}</div>
                    {cust.area && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                        Area: {cust.area}
                      </span>
                    )}
                  </td>

                  {/* Total Orders & Units */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>
                    <span style={{ fontWeight: 800 }}>{cust.totalOrders}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                      ({cust.totalUnits} units)
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {currency}{cust.totalSpent.toLocaleString()}
                  </td>

                  {/* View History Button */}
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                    >
                      <Eye size={13} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {selectedCustomer.name}
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#1d4ed8', fontWeight: 700 }}>
                  {selectedCustomer.phone}
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)'
                }}
              >
                ×
              </button>
            </div>

            <div style={{
              backgroundColor: '#fafafa',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.88rem'
            }}>
              <div style={{ marginBottom: '0.35rem' }}>
                <strong>Delivery Address:</strong> {selectedCustomer.address}
              </div>
              <div>
                <strong>Total Lifetime Spent:</strong> {currency}{selectedCustomer.totalSpent.toLocaleString()} ({selectedCustomer.totalOrders} orders)
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Order History:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {selectedCustomer.orders.map((ord, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.86rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      #{ord.id} — {ord.modelName} (x{ord.quantity})
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                      {new Date(ord.date).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                      {currency}{ord.amount.toLocaleString()}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-primary"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.88rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
