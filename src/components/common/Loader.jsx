import React from 'react';
import { Heart, Loader2, Sparkles } from 'lucide-react';

export const Loader = ({ 
  size = 'md', 
  message = 'Loading GiveHope...', 
  subMessage = 'Making a difference together...', 
  fullscreen = false 
}) => {
  const sizeMap = {
    sm: { iconSize: 20, heartSize: 14, titleSize: '0.9rem', subSize: '0.75rem', padding: '1rem' },
    md: { iconSize: 36, heartSize: 22, titleSize: '1.2rem', subSize: '0.85rem', padding: '2.5rem' },
    lg: { iconSize: 48, heartSize: 30, titleSize: '1.5rem', subSize: '0.95rem', padding: '3.5rem' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: currentSize.padding,
      textAlign: 'center',
      gap: '1rem'
    }}>
      {/* Animated Brand Emblem */}
      <div style={{ position: 'relative', width: currentSize.iconSize * 1.8, height: currentSize.iconSize * 1.8 }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid rgba(13, 148, 136, 0.15)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 1.2s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite'
        }} />
        <div style={{
          position: 'absolute',
          inset: '6px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary) 0%, #065F46 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)',
          animation: 'pulseGlow 2s infinite ease-in-out'
        }}>
          <Heart size={currentSize.heartSize} fill="#FFFFFF" />
        </div>
      </div>

      {/* Branded Title & Subtext */}
      <div>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: '800',
          fontSize: currentSize.titleSize,
          color: 'var(--navy)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem'
        }}>
          Give<span style={{ color: 'var(--primary)' }}>Hope</span>
          <Sparkles size={14} color="var(--accent)" />
        </div>
        {message && (
          <div style={{ 
            fontSize: currentSize.subSize, 
            color: 'var(--text-muted)', 
            fontWeight: '600',
            marginTop: '0.35rem' 
          }}>
            {message}
          </div>
        )}
        {subMessage && (
          <div style={{ 
            fontSize: '0.78rem', 
            color: 'var(--text-light)', 
            marginTop: '0.15rem',
            fontStyle: 'italic'
          }}>
            "{subMessage}"
          </div>
        )}
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
