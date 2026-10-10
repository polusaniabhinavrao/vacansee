import React, { useState } from 'react';
import { Database, CheckCircle2, AlertTriangle, X, ChevronRight, Copy, Check } from 'lucide-react';
import { isConfigured, getSupabaseStatus } from '../../lib/supabase';

export default function SupabaseBanner() {
  const [showGuide, setShowGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const status = getSupabaseStatus();

  if (dismissed) return null;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(
      `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: isConfigured ? '#F2F8F4' : '#FBF6EE',
          borderBottom: `1px solid ${isConfigured ? '#D6E8DE' : 'rgba(184, 121, 50, 0.25)'}`,
          padding: '0.45rem 1.25rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          color: isConfigured ? '#347653' : '#966025',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isConfigured ? (
            <CheckCircle2 size={15} color="#347653" />
          ) : (
            <AlertTriangle size={15} color="#B87932" />
          )}
          <span>
            {isConfigured ? (
              <span style={{ color: 'var(--text-primary)' }}>
                <strong style={{ color: '#347653' }}>Supabase Connected:</strong> Live PostgreSQL &amp; Auth active.
              </span>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>
                <strong style={{ color: '#966025' }}>Local Demo Mode:</strong> Running with local persistence. Add credentials to <code style={{ color: 'var(--text-primary)', backgroundColor: '#F3F2ED', padding: '1px 5px', borderRadius: '3px', border: '1px solid var(--border-medium)' }}>.env</code> for cloud sync.
              </span>
            )}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            style={{
              background: 'none',
              border: 'none',
              color: isConfigured ? '#347653' : '#966025',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontSize: '0.775rem',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            Setup Guide <ChevronRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {showGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(37, 40, 33, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowGuide(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '580px',
              width: '100%',
              padding: '2rem',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: 'var(--text-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={20} color="var(--accent-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Supabase Configuration</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Status:</strong> {isConfigured ? '🟢 Connected to Cloud' : '🟡 Local Mode Active'}</div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Project URL:</strong> <span style={{ color: 'var(--text-primary)' }}>{status.supabaseUrl}</span></div>
              <div><strong style={{ color: 'var(--text-secondary)' }}>Anon Client Key:</strong> <span style={{ color: 'var(--text-primary)' }}>{status.hasKey ? 'Configured' : 'Missing in .env'}</span></div>
            </div>

            <h4 style={{ fontSize: '0.925rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Steps to connect your Supabase project:</h4>
            <ol style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>supabase.com</a>.</li>
              <li>Go to <strong>SQL Editor</strong> and run:
                <br /><code style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-medium)' }}>supabase/migrations/20260311_init_schema_and_rls.sql</code>
              </li>
              <li>(Optional) Run seed data: <code style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-medium)' }}>supabase/migrations/20260311_seed_data.sql</code></li>
              <li>Copy your Project URL and anon public key from <strong>Settings &gt; API</strong> into <code style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>.env</code>:</li>
            </ol>

            <div style={{ position: 'relative', margin: '0.875rem 0', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', padding: '0.85rem 1rem', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'monospace', border: '1px solid var(--border-medium)' }}>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
              <button
                type="button"
                onClick={copyEnvSnippet}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                {copied ? <Check size={12} color="var(--accent-secondary)" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Note: Local demo mode allows complete testing of applicant submission, employer job creation, and status management.
            </p>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
