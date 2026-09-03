import React from 'react';

export const Badge = ({ variant = 'primary', children, style, className = '' }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'success':
      case 'Completed':
      case 'Approved':
      case 'Active':
        return 'badge-success';
      case 'warning':
      case 'Pending':
      case 'Urgent':
        return 'badge-warning';
      case 'danger':
      case 'Failed':
      case 'Rejected':
        return 'badge-danger';
      case 'info':
      case 'Monthly':
        return 'badge-info';
      default:
        return 'badge-primary';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()} ${className}`} style={style}>
      {children}
    </span>
  );
};
