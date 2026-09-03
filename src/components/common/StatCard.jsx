import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendPositive = true,
  description,
  accentColor = 'var(--primary)',
  bgColor = 'var(--primary-light)'
}) => {
  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--navy)', marginTop: '0.35rem', fontFamily: 'var(--font-heading)' }}>
            {value}
          </div>
        </div>

        {Icon && (
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: bgColor,
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
          }}>
            <Icon size={26} />
          </div>
        )}
      </div>

      {(trend || description) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
          {trend && (
            <span style={{
              fontWeight: '700',
              color: trendPositive ? 'var(--status-success)' : 'var(--status-danger)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              {trendPositive ? '▲' : '▼'} {trend}
            </span>
          )}
          {description && <span style={{ color: 'var(--text-muted)' }}>{description}</span>}
        </div>
      )}
    </div>
  );
};
