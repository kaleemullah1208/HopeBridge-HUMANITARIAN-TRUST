import React from 'react';

export const Badge = ({ variant = 'primary', children, style, className = '' }) => {
  const getBadgeClass = () => {
    switch (variant) {
      case 'success':
      case 'Completed':
      case 'Approved':
      case 'Active':
      case 'Disbursed':
        return 'badge-success';
      case 'warning':
      case 'Pending':
      case 'Urgent':
      case 'Under Review':
        return 'badge-warning';
      case 'danger':
      case 'Failed':
      case 'Rejected':
        return 'badge-danger';
      case 'info':
      case 'Monthly':
      case 'Medical Aid':
      case 'Education':
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
