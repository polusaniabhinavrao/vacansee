import React from 'react';

export default function Badge({ children, variant = 'default', size = 'md' }) {
  const getColors = () => {
    switch (variant) {
      case 'recommendation':
      case 'violet':
      case 'match':
        return {
          bg: 'var(--accent-recommendation-subtle)',
          color: 'var(--accent-recommendation)',
          border: 'var(--accent-recommendation-border)',
        };
      case 'info':
      case 'blue':
        return {
          bg: 'var(--accent-info-subtle)',
          color: 'var(--accent-info)',
          border: 'var(--accent-info-border)',
        };
      case 'primary':
      case 'amber':
      case 'teal':
        return {
          bg: 'var(--accent-primary-subtle)',
          color: 'var(--accent-primary-hover)',
          border: 'var(--accent-primary-border)',
        };
      case 'local':
        return {
          bg: '#F7EBDD',
          color: '#966025',
          border: 'rgba(184, 121, 50, 0.35)',
        };
      case 'sage':
      case 'success':
      case 'green':
        return {
          bg: 'var(--status-success-bg)',
          color: 'var(--status-success)',
          border: 'var(--status-success-border)',
        };
      case 'error':
      case 'danger':
        return {
          bg: 'var(--status-error-bg)',
          color: 'var(--status-error)',
          border: 'var(--status-error-border)',
        };
      case 'neutral':
      default:
        return {
          bg: '#F3F2ED',
          color: 'var(--text-secondary)',
          border: 'var(--border-medium)',
        };
    }
  };

  const style = getColors();
  const padding = size === 'sm' ? '0.15rem 0.45rem' : '0.2rem 0.55rem';
  const fontSize = size === 'sm' ? '0.725rem' : '0.775rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding,
        borderRadius: 'var(--radius-sm)',
        fontSize,
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        lineHeight: 1.25,
      }}
    >
      {children}
    </span>
  );
}
