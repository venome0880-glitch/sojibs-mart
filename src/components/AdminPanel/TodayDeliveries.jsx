import React from 'react';
import { Printer, MapPin, Truck, Phone, Package, CheckSquare, Calendar } from 'lucide-react';

export default function TodayDeliveries({
  deliveriesData = { areas: {}, totalDeliveries: 0, totalUnits: 0, totalValue: 0, date: '' },
  currency = '৳',
  shopName = "Sojib's Mart"
}) {
  const { areas = {}, totalDeliveries = 0, totalUnits = 0, totalValue = 0, date = '' } = deliveriesData;
  const areaKeys = Object.keys(areas);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="delivery-sheet" style={{ maxWidth: '1000px' }}>
      {/* Top Header & Print Action (Hidden during print) */}
      <div className="no-print" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Today's Dispatch & Deliveries
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Active orders grouped by destination area for easy delivery dispatch. Click below to print rider sheets.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn-primary hover-lift"
          style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
        >
          <Printer size={16} />
          <span>Print Delivery Sheet</span>
        </button>
      </div>

      {/* Summary KPI Cards (Screen View) */}
      <div className="no-print" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Total Deliveries Today
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {totalDeliveries}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Total Units to Dispatch
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
            {totalUnits}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem'
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
            Total COD Cash to Collect
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#15803d' }}>
            {currency}{totalValue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* PRINT-ONLY HEADER (Appears only on paper/print preview) */}
      <div className="print-only" style={{ display: 'none', marginBottom: '1.5rem', borderBottom: '2px solid #000', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '18pt', fontWeight: 'bold', margin: 0 }}>
              {shopName} - Daily Delivery Manifest
            </h1>
            <p style={{ margin: 0, fontSize: '10pt', color: '#444' }}>
              Date: {date || new Date().toISOString().split('T')[0]} • Total Parcels: {totalDeliveries} • Cash to Collect: {currency}{totalValue.toLocaleString()}
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: '9pt' }}>
            Rider Name: _______________________<br />
            Vehicle No: _______________________
          </div>
        </div>
      </div>

      {/* Grouped Areas */}
      {areaKeys.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)'
        }}>
          No pending orders scheduled for delivery today.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {areaKeys.map((areaName) => {
            const areaOrders = areas[areaName] || [];
            const areaTotalValue = areaOrders.reduce((s, o) => s + o.totalAmount, 0);
            const areaUnits = areaOrders.reduce((s, o) => s + o.quantity, 0);

            return (
              <div
                key={areaName}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Area Header */}
                <div style={{
                  backgroundColor: '#fafafa',
                  borderBottom: '1px solid var(--color-border)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={18} color="var(--color-primary)" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                      Delivery Zone: {areaName}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span>{areaOrders.length} Parcels ({areaUnits} Units)</span>
                    <span style={{ color: '#15803d' }}>
                      COD: {currency}{areaTotalValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Orders in Area Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-border)' }}>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left', width: '40px' }}>✓</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Order ID</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Customer & Phone</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Exact Address</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Model & Qty</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>COD Amount</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Customer Sign</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areaOrders.map((ord, idx) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                          {/* Checkbox */}
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <input type="checkbox" style={{ width: '16px', height: '16px' }} />
                          </td>

                          {/* ID */}
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                            #{ord.id}
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-subtle)' }}>
                              {ord.status}
                            </div>
                          </td>

                          {/* Customer */}
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: 700 }}>{ord.customerName}</div>
                            <div style={{ fontSize: '0.82rem', color: '#1d4ed8' }}>
                              <a href={`tel:${ord.phone}`}>{ord.phone}</a>
                            </div>
                          </td>

                          {/* Address */}
                          <td style={{ padding: '0.75rem 1rem', maxWidth: '240px', lineHeight: 1.35 }}>
                            {ord.deliveryAddress}
                            {ord.notes && (
                              <div style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '2px' }}>
                                Note: {ord.notes}
                              </div>
                            )}
                          </td>

                          {/* Model */}
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: 600 }}>{ord.modelName}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                              Qty: <strong>{ord.quantity}</strong>
                            </div>
                          </td>

                          {/* COD Amount */}
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                            {currency}{ord.totalAmount.toLocaleString()}
                          </td>

                          {/* Sign Area for Delivery Sheet */}
                          <td style={{ padding: '0.75rem 1rem', color: '#71717a', fontSize: '0.78rem' }}>
                            <div style={{ width: '100px', borderBottom: '1px dotted #999', height: '20px' }}></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
