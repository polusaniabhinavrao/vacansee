import React from 'react';
import { FolderSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.75rem',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-medium)',
        maxWidth: '520px',
        margin: '1.5rem auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-primary)',
          border: '1px solid var(--border-medium)',
          marginBottom: '0.25rem',
        }}
      >
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>{title}</h3>
      {description && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px', margin: 0, lineHeight: 1.6 }}>
          {description}
        </p>
      )}
      {(actionLabel && (actionLink || onAction)) && (
        <div style={{ marginTop: '0.5rem' }}>
          {actionLink ? (
            <Link to={actionLink} className="btn btn-secondary btn-sm">
              {actionLabel}
            </Link>
          ) : (
            <button type="button" onClick={onAction} className="btn btn-secondary btn-sm">
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
