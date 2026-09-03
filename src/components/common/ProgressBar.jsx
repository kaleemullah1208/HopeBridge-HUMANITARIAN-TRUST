import React from 'react';

export const ProgressBar = ({ 
  current = 0, 
  total = 100, 
  isUrgent = false, 
  showLabel = true, 
  height = 8,
  currency = 'Rs.'
}) => {
  const percentage = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 0;

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          fontWeight: '600',
          marginBottom: '0.4rem',
          color: 'var(--navy)'
        }}>
          <span>Raised: {currency} {Number(current).toLocaleString()}</span>
          <span style={{ color: percentage >= 100 ? 'var(--status-success)' : 'var(--primary)' }}>
            {percentage}% of {currency} {Number(total).toLocaleString()}
          </span>
        </div>
      )}
      <div className="progress-track" style={{ height: `${height}px` }}>
        <div
          className={`progress-fill ${isUrgent ? 'progress-fill-urgent' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
