import React from 'react';

export const SkeletonTable = ({ rows = 5, cols = 4 }) => {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      {/* Table Header Placeholder */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '1rem',
        padding: '0.85rem 1rem',
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: 'var(--bg-subtle)'
      }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div 
            key={`th-${i}`} 
            className="skeleton-shimmer" 
            style={{ height: '14px', width: i === 0 ? '60%' : '80%' }} 
          />
        ))}
      </div>

      {/* Table Body Placeholder Rows */}
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div 
          key={`row-${rIdx}`}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: '1rem',
            padding: '1rem',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-light)'
          }}
        >
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={`cell-${rIdx}-${cIdx}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div 
                className="skeleton-shimmer" 
                style={{ 
                  height: '14px', 
                  width: cIdx === 0 ? '85%' : (cIdx === 1 ? '50%' : '70%') 
                }} 
              />
              {cIdx === 0 && (
                <div 
                  className="skeleton-shimmer" 
                  style={{ height: '10px', width: '55%' }} 
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonTable;
