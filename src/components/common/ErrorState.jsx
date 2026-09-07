import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ 
  title = 'Failed to load live data', 
  message = 'We encountered an error connecting to Firebase real-time ledger. Please check your network connection and try again.', 
  onRetry 
}) => {
  return (
    <div className="card" style={{
      padding: '2.5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '1rem',
      border: '1px dashed var(--status-danger-border)',
      backgroundColor: 'var(--status-danger-bg)'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: '#FEE2E2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--status-danger)'
      }}>
        <AlertTriangle size={28} />
      </div>

      <div>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--status-danger-text)', marginBottom: '0.35rem' }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto' }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <button 
          onClick={onRetry} 
          className="btn btn-sm btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}
        >
          <RefreshCw size={15} /> Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
