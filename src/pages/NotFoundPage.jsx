import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NotFoundPage() {
  const { language } = useLanguage();

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '3rem 1rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '440px' }}>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-medium)',
            color: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <AlertCircle size={26} />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.35rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          {language === 'te' ? 'పేజీ కనుగొనబడలేదు' : 'Page Not Found'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {language === 'te'
            ? 'మీరు వెతుకుతున్న పేజీ తొలగించబడి ఉండవచ్చు లేదా చిరునామా తప్పుగా ఉంది.'
            : 'The page you are looking for might have been moved or is no longer available.'}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-secondary btn-sm">
            <Home size={14} />
            <span>Go to Home</span>
          </Link>
          <Link to="/jobs" className="btn btn-primary btn-sm">
            <Briefcase size={14} />
            <span>Browse Jobs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
