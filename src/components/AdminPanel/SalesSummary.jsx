import React from 'react';
import { DollarSign, ShoppingBag, Layers, TrendingUp, Calendar, Clock, Flame } from 'lucide-react';

export default function SalesSummary({ summaryData = {}, currency = '৳' }) {
  const { kpis = {}, byModel = [], daily = [], weekly = [] } = summaryData;

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          Sales & Revenue Analytics
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Real-time performance summary of orders, units sold, and revenue breakdown.
        </p>
      </div>

      {/* KPI Top Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Total Revenue */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total Gross Sales
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-primary)' }}>
            {currency}{(kpis.totalRevenue || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700, marginTop: '2px' }}>
            100% Free Shipping Delivered
          </div>
        </div>

        {/* Total Orders */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total Orders Placed
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
            {kpis.totalOrders || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
            {kpis.pendingOrders || 0} New Pending Action
          </div>
        </div>

        {/* Units Sold */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total Heaters Sold
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
            {kpis.totalUnits || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
            Across all 4 winter models
          </div>
        </div>

        {/* Avg Order Value */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.4rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Average Order Value
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.9rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
            {currency}{(kpis.avgOrderValue || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
            Per completed checkout
          </div>
        </div>
      </div>

      {/* Model Breakdown Table */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Flame size={20} color="var(--color-primary)" />
          <span>Sales Split by Heater Model</span>
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa', borderBottom: '1.5px solid var(--color-border)' }}>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)' }}>Model Specification</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>Orders</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: 700, color: 'var(--color-text-muted)' }}>Units Sold</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--color-text-muted)' }}>Total Revenue</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 700, color: 'var(--color-text-muted)', width: '180px' }}>Revenue Share</th>
              </tr>
            </thead>
            <tbody>
              {byModel.map((item) => {
                const totalRev = kpis.totalRevenue || 1;
                const percentage = Math.round((item.revenue / totalRev) * 100) || 0;

                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontWeight: 800 }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                        {item.size} • {item.wattage}W
                      </div>
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                      {item.ordersCount}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'center', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {item.unitsSold}
                    </td>

                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 800 }}>
                      {currency}{item.revenue.toLocaleString()}
                    </td>

                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          flex: 1,
                          height: '8px',
                          backgroundColor: '#f4f4f5',
                          borderRadius: '9999px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: 'var(--color-primary)',
                            borderRadius: '9999px'
                          }} />
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, width: '32px' }}>
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily & Weekly Side-by-Side Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Daily Sales (Last 7 Days) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} color="var(--color-primary)" />
            <span>Daily Breakdown (Last 7 Days)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {daily.map((day, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#fafafa',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.86rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{day.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>{day.date}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    {currency}{day.revenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                    {day.orders} orders ({day.units} units)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Breakdown (Last 4 Weeks) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--color-primary)" />
            <span>Weekly Breakdown (Last 4 Weeks)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {weekly.map((wk, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.85rem',
                  backgroundColor: '#fafafa',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.86rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{wk.weekLabel}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                    Trailing 7-day period
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    {currency}{wk.revenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                    {wk.orders} orders • {wk.units} units
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
