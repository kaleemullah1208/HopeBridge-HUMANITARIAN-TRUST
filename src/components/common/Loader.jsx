import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Loader = ({ 
  size = 'md', 
  message = 'Loading GiveHope...', 
  subMessage = 'Connecting to real-time humanitarian network...', 
  fullscreen = false,
  cardMode = false
}) => {
  const sizeMap = {
    sm: {
      outerSize: 48,
      innerSize: 36,
      heartSize: 18,
      titleSize: '1rem',
      subSize: '0.78rem',
      padding: '1.25rem'
    },
    md: {
      outerSize: 76,
      innerSize: 58,
      heartSize: 28,
      titleSize: '1.25rem',
      subSize: '0.85rem',
      padding: '2.5rem'
    },
    lg: {
      outerSize: 104,
      innerSize: 80,
      heartSize: 38,
      titleSize: '1.5rem',
      subSize: '0.92rem',
      padding: '3.5rem'
    }
  };

  const config = sizeMap[size] || sizeMap.md;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: config.padding,
        textAlign: 'center',
        position: 'relative'
      }}
    >
      {/* Background Soft Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          width: config.outerSize * 2.6,
          height: config.outerSize * 2.6,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, rgba(245, 158, 11, 0.08) 45%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          animation: 'giveHopePulse 3s infinite ease-in-out'
        }}
      />

      {/* Main Multi-Orbit Heart Emblem Container */}
      <div
        style={{
          position: 'relative',
          width: `${config.outerSize}px`,
          height: `${config.outerSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}
      >
        {/* Outer Orbit Ring (Emerald-to-Teal Gradient Spinner) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#0D9488',
            borderRightColor: '#14B8A6',
            borderBottomColor: 'rgba(13, 148, 136, 0.15)',
            borderLeftColor: 'rgba(13, 148, 136, 0.05)',
            animation: 'dualRingSpin 1.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite'
          }}
        />

        {/* Middle Counter-Orbit Ring (Golden Amber Accent Spinner) */}
        <div
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '2px dashed transparent',
            borderBottomColor: '#F59E0B',
            borderLeftColor: '#FBBF24',
            animation: 'reverseSpin 2s linear infinite'
          }}
        />

        {/* Glowing Center Glass Sphere with Heart Emblem */}
        <div
          style={{
            width: `${config.innerSize}px`,
            height: `${config.innerSize}px`,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 50%, #064E3B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(13, 148, 136, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
            position: 'relative',
            zIndex: 2,
            animation: 'giveHopePulse 2.4s ease-in-out infinite'
          }}
        >
          <div style={{ animation: 'heartBeat 1.6s infinite ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={config.heartSize} fill="#FFFFFF" color="#FFFFFF" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Brand Title */}
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: '800',
          fontSize: config.titleSize,
          color: 'var(--navy)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          letterSpacing: '-0.02em'
        }}
      >
        <span>Give</span>
        <span
          style={{
            background: 'linear-gradient(90deg, #0D9488 0%, #10B981 50%, #F59E0B 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Hope
        </span>
        <Sparkles size={16} color="#F59E0B" />
      </div>

      {/* Primary Message */}
      {message && (
        <div
          style={{
            fontSize: config.subSize,
            color: '#334155',
            fontWeight: '600',
            marginTop: '0.4rem',
            maxWidth: '380px'
          }}
        >
          {message}
        </div>
      )}

      {/* Subtitle / Human quote */}
      {subMessage && (
        <div
          style={{
            fontSize: '0.78rem',
            color: '#64748B',
            marginTop: '0.2rem',
            fontStyle: 'italic',
            maxWidth: '340px'
          }}
        >
          "{subMessage}"
        </div>
      )}

      {/* Pulsing Loading Wave Dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '0.85rem'
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#0D9488',
            animation: 'dotPulse 1.2s infinite ease-in-out',
            animationDelay: '0s'
          }}
        />
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            animation: 'dotPulse 1.2s infinite ease-in-out',
            animationDelay: '0.2s'
          }}
        />
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#F59E0B',
            animation: 'dotPulse 1.2s infinite ease-in-out',
            animationDelay: '0.4s'
          }}
        />
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(248, 250, 252, 0.94)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}
      >
        <div
          className="card"
          style={{
            padding: '2rem',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            backgroundColor: '#FFFFFF'
          }}
        >
          {content}
        </div>
      </div>
    );
  }

  if (cardMode) {
    return (
      <div
        className="card"
        style={{
          padding: '2.5rem 1.5rem',
          borderRadius: '20px',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          border: '1px solid var(--border-light)'
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
