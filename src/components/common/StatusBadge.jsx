import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function StatusBadge({ status }) {
  const { t } = useLanguage();

  const getStyleAndLabel = () => {
    switch (status) {
      case 'applied':
        return {
          bg: 'var(--status-applied-bg)',
          color: 'var(--status-applied-text)',
          border: 'var(--status-applied-border)',
          label: t.status.applied,
        };
      case 'reviewing':
        return {
          bg: 'var(--status-reviewing-bg)',
          color: 'var(--status-reviewing-text)',
          border: 'var(--status-reviewing-border)',
          label: t.status.reviewing,
        };
      case 'shortlisted':
        return {
          bg: 'var(--status-shortlisted-bg)',
          color: 'var(--status-shortlisted-text)',
          border: 'var(--status-shortlisted-border)',
          label: t.status.shortlisted,
        };
      case 'rejected':
        return {
          bg: 'var(--status-rejected-bg)',
          color: 'var(--status-rejected-text)',
          border: 'var(--status-rejected-border)',
          label: t.status.rejected,
        };
      case 'hired':
        return {
          bg: 'var(--status-hired-bg)',
          color: 'var(--status-hired-text)',
          border: 'var(--status-hired-border)',
          label: t.status.hired,
        };
      case 'active':
        return {
          bg: 'rgba(52, 118, 83, 0.10)',
          color: '#347653',
          border: 'rgba(52, 118, 83, 0.25)',
          label: t.status.active,
        };
      case 'closed':
        return {
          bg: 'rgba(133, 135, 127, 0.12)',
          color: '#62665E',
          border: 'rgba(133, 135, 127, 0.25)',
          label: t.status.closed,
        };
      default:
        return {
          bg: '#F3F2ED',
          color: 'var(--text-secondary)',
          border: 'var(--border-medium)',
          label: status,
        };
    }
  };

  const style = getStyleAndLabel();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.55rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.725rem',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        lineHeight: 1.25,
      }}
    >
      {style.label}
    </span>
  );
}
