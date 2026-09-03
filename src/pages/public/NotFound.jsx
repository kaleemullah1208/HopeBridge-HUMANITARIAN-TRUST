import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      textAlign: 'center'
    }}>
      <div className="card" style={{ padding: '3.5rem 2rem', maxWidth: '540px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: '800'
        }}>
          404
        </div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--navy)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
          The humanitarian relief page or resource you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Home size={16} /> Return Home
          </Link>
          <Link to="/campaigns" className="btn btn-outline">
            Browse Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
};
