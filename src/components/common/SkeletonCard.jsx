import React from 'react';

export const SkeletonCard = ({ height = '140px' }) => {
  return (
    <div 
      className="card" 
      style={{
        padding: '1.25rem',
        minHeight: height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.75rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-shimmer" style={{ width: '40%', height: '14px' }} />
        <div className="skeleton-shimmer" style={{ width: '38px', height: '38px', borderRadius: '10px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div className="skeleton-shimmer" style={{ width: '65%', height: '28px', borderRadius: '6px' }} />
        <div className="skeleton-shimmer" style={{ width: '50%', height: '12px' }} />
      </div>
    </div>
  );
};

export default SkeletonCard;
