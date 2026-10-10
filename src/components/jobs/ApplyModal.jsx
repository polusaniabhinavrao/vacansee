import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Phone, User, Mail, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const { user, profile } = useAuth();
  const { applyToJob } = useJobs();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: profile?.full_name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    resumeLink: profile?.resume_url || '',
    coverNote: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (!formData.name.trim()) {
        throw new Error('Please enter your full name');
      }
      if (!formData.phone.trim()) {
        throw new Error('Please enter your contact phone or WhatsApp number');
      }
      if (!formData.resumeLink.trim()) {
        throw new Error('Please provide your resume, portfolio, or profile link to apply.');
      }

      await applyToJob({
        jobId: job.id,
        applicantName: formData.name,
        applicantEmail: formData.email,
        contactPhone: formData.phone,
        resumeLink: formData.resumeLink,
        coverNote: formData.coverNote,
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '540px',
          width: '100%',
          padding: '2rem',
          boxShadow: 'var(--shadow-xl)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          color: 'var(--text-primary)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={48} color="var(--accent-secondary)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {t.jobDetail.applySuccess}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              The employer has received your details and will review your application.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.25rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {t.applyModal.title}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t.applyModal.subtitle} <strong style={{ color: 'var(--accent-primary)' }}>{job.title}</strong> at{' '}
                <strong>{job.company_name}</strong>
              </p>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: 'var(--status-rejected-bg)',
                  border: '1px solid var(--status-rejected-border)',
                  color: 'var(--status-rejected-text)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t.applyModal.nameLabel} *</label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">{t.applyModal.emailLabel} *</label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={15}
                      style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                      type="email"
                      required
                      className="form-input"
                      style={{ paddingLeft: '2.1rem', opacity: 0.7 }}
                      value={formData.email}
                      disabled
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.applyModal.phoneLabel} *</label>
                  <div style={{ position: 'relative' }}>
                    <Phone
                      size={15}
                      style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                    />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="form-input"
                      style={{ paddingLeft: '2.1rem' }}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t.applyModal.resumeLabel} *</label>
                <div style={{ position: 'relative' }}>
                  <LinkIcon
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/... or LinkedIn"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    value={formData.resumeLink}
                    onChange={(e) => setFormData({ ...formData, resumeLink: e.target.value })}
                  />
                </div>
                <span className="form-hint">
                  Link to Google Drive resume, portfolio, or LinkedIn profile.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">{t.applyModal.coverNoteLabel}</label>
                <textarea
                  className="form-textarea"
                  placeholder={t.applyModal.coverNotePlaceholder}
                  rows={3}
                  value={formData.coverNote}
                  onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  {t.applyModal.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  <Send size={14} />
                  <span>{submitting ? t.applyModal.submitting : t.applyModal.submitBtn}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
