import React from 'react';
import { Loader2 } from 'lucide-react';

export const ButtonLoader = ({ 
  loading = false, 
  loadingText = 'Processing...', 
  children, 
  icon = null,
  disabled = false,
  className = 'btn btn-primary',
  style = {},
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        position: 'relative',
        transition: 'all 0.2s ease',
        ...style
      }}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default ButtonLoader;
