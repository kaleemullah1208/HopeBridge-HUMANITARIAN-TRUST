import React from 'react';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('GiveHope Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F8FAFC',
            padding: '2rem 1.5rem',
            fontFamily: 'var(--font-body, system-ui, sans-serif)'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '3rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
              borderRadius: '24px',
              boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)'
              }}
            >
              <ShieldAlert size={40} />
            </div>

            <div>
              <h1 style={{ fontSize: '1.6rem', color: '#0F172A', fontWeight: '800', marginBottom: '0.4rem' }}>
                Something went wrong
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.6' }}>
                We encountered an unexpected application error. Don't worry, your data and active sessions are secure.
              </p>
            </div>

            {this.state.error?.message && (
              <div
                style={{
                  backgroundColor: '#F1F5F9',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  color: '#475569',
                  fontFamily: 'monospace',
                  maxWidth: '100%',
                  overflowX: 'auto',
                  textAlign: 'left'
                }}
              >
                {this.state.error.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button
                onClick={this.handleReload}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RotateCcw size={16} /> Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="btn btn-outline"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Home size={16} /> Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
