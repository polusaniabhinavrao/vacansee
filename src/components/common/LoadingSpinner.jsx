import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LoadingSpinner({ message, size = 26 }) {
  const { t } = useLanguage();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '0.75rem',
      }}
    >
      <Loader2
        size={size}
        style={{
          animation: 'vacanseeSpin 1s linear infinite',
          color: 'var(--accent-primary)',
        }}
      />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        {message || t.common.loading}
      </p>
      <style>{`
        @keyframes vacanseeSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
