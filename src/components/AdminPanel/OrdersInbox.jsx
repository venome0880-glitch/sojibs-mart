import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Search,
  Filter,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Clock,
  Trash2,
  AlertCircle
} from 'lucide-react';

const STATUS_CONFIG = {
  'New': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', icon: Clock },
  'Confirmed': { bg: '#fef3c7', color: '#b45309', border: '#fde68a', icon: CheckCircle },
  'Out for delivery': { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa', icon: Truck },
  'Delivered': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0', icon: Package },
  'Cancelled': { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', icon: XCircle }
};

export default function OrdersInbox({
  orders = [],
  currency = '৳',
  onUpdateStatus,
  onDeleteOrder,
  whatsappClean = '8801796017442'
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(query) ||
      o.customerName.toLowerCase().includes(query) ||
      o.phone.toLowerCase().includes(query) ||
      o.deliveryAddress.toLowerCase().includes(query) ||
      o.modelName.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const getCleanPhone = (phoneStr) => {
    let clean = phoneStr.replace(/[^0-9]/g, '');
    if (clean.startsWith('01')) clean = '88' + clean;
    return clean;
  };

  const getWhatsAppOrderLink = (order) => {
    const cleanPhone = getCleanPhone(order.phone);
    const text = `Hello ${order.customerName}, this is Sojib's Mart regarding your heater order #${order.id} (${order.modelName}). How can we assist you today?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div>
      {/* Search & Filter Bar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={17} color="var(--color-text-subtle)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem', fontSize: '0.88rem' }}
            placeholder="Search by customer name, phone, address, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>
            Status:
          </span>
          {['All', 'New', 'Confirmed', 'Out for delivery', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: statusFilter === st ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                backgroundColor: statusFilter === st ? 'var(--color-primary-light)' : '#ffffff',
                color: statusFilter === st ? 'var(--color-primary)' : 'var(--color-text-muted)',
                cursor: 'pointer'
              }}
            >
              {st}
              {st === 'New' && orders.filter(o => o.status === 'New').length > 0 && (
                <span style={{
                  marginLeft: '0.35rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  padding: '1px 5px',
                  borderRadius: '9999px'
                }}>
                  {orders.filter(o => o.status === 'New').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Count Indicator */}
      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
        Showing {filteredOrders.length} of {orders.length} total orders
      </div>

      {/* DESKTOP DENSE TABLE VIEW */}
      <div className="desktop-orders-table" style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflowX: 'auto',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa', borderBottom: '1.5px solid var(--color-border)' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Order ID / Time</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Customer & Phone</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Delivery Address & Area</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Model & Qty</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Total Amount</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Status Flow</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                  No orders found matching the filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const conf = STATUS_CONFIG[order.status] || STATUS_CONFIG['New'];
                const StatusIcon = conf.icon;
                const cleanPhone = getCleanPhone(order.phone);

                return (
                  <tr
                    key={order.id}
                    style={{
                      borderBottom: '1px solid var(--color-border-light)',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    {/* ID & Time */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-text-main)' }}>
                        #{order.id}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {order.source && (
                        <span style={{ fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 700 }}>
                          via {order.source}
                        </span>
                      )}
                    </td>

                    {/* Customer & Phone */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {order.customerName}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        {order.phone}
                      </div>
                    </td>

                    {/* Address & Area */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', maxWidth: '240px' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                        {order.deliveryAddress}
                      </div>
                      {order.area && (
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: '#f4f4f5',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          marginTop: '3px'
                        }}>
                          Zone: {order.area}
                        </span>
                      )}
                    </td>

                    {/* Model & Qty */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {order.modelName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Qty: <strong>{order.quantity}</strong> ({order.wattage}W)
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.98rem' }}>
                        {currency}{order.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>
                        Free Delivery
                      </div>
                    </td>

                    {/* Status Flow Dropdown */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top' }}>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        style={{
                          backgroundColor: conf.bg,
                          color: conf.color,
                          border: `1px solid ${conf.border}`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.35rem 0.65rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* One-Tap Call & WhatsApp Buttons */}
                    <td style={{ padding: '0.85rem 1rem', verticalAlign: 'top', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                        {/* One-Tap Call Button */}
                        <a
                          href={`tel:${cleanPhone}`}
                          className="hover-lift"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.35rem 0.65rem',
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1d4ed8',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                          title="Call customer"
                        >
                          <Phone size={13} strokeWidth={2.4} />
                          <span>Call</span>
                        </a>

                        {/* One-Tap WhatsApp Button */}
                        <a
                          href={getWhatsAppOrderLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-lift"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.35rem 0.65rem',
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#15803d',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle size={13} strokeWidth={2.4} />
                          <span>WhatsApp</span>
                        </a>

                        {/* Delete button */}
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#a1a1aa',
                            cursor: 'pointer',
                            padding: '0.35rem'
                          }}
                          title="Delete order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
