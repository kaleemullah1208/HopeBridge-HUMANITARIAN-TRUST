import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--border-light)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading authentication state...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="container section" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-danger-bg)',
            color: 'var(--status-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldAlert size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--navy)' }}>Admin Access Required</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Your current logged-in role (<strong>{currentUser.role}</strong>) does not have administrative privileges to access the NGO management console.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <Navigate to="/login" />
          </div>
        </div>
      </div>
    );
  }

  return children;
};
