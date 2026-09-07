import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from './PageLoader';
import { ShieldAlert, LogIn, Home } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <PageLoader 
        message="Verifying secure credentials..." 
        subMessage="Connecting to GiveHope administrative network..." 
      />
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div 
        className="container section" 
        style={{ 
          maxWidth: '600px', 
          textAlign: 'center', 
          minHeight: '70vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto'
        }}
      >
        <div 
          className="card" 
          style={{ 
            padding: '3rem 2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '1.25rem',
            boxShadow: 'var(--shadow-xl)',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            width: '100%'
          }}
        >
          <div 
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)'
            }}
          >
            <ShieldAlert size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)', margin: 0 }}>
            Administrator Access Required
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.92rem' }}>
            Your current account (<strong>{currentUser.email || currentUser.name}</strong>) is signed in with role <span className="badge badge-secondary">{currentUser.role || 'Member'}</span>. Administrative privileges are required to view the management console.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LogIn size={16} /> Sign In with Admin Account
            </Link>
            <Link to="/" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Home size={16} /> Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
