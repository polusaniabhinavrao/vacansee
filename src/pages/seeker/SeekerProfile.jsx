import React, { useState } from 'react';
import { User, Phone, MapPin, Mail, Link as LinkIcon, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import styles from './SeekerDashboard.module.css';

export default function SeekerProfile() {
  const { user, profile, updateProfile } = useAuth();
  const { t } = useLanguage();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skills, setSkills] = useState(
    Array.isArray(profile?.skills) ? profile.skills.join(', ') : profile?.skills || ''
  );
  const [resumeUrl, setResumeUrl] = useState(profile?.resume_url || '');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const parsedSkills = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateProfile({
        full_name: fullName,
        phone,
        location,
        headline,
        bio,
        skills: parsedSkills,
        resume_url: resumeUrl,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="seeker" />

        <div className={styles.mainContent}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>{t.seeker.profileTitle}</h1>
              <p className={styles.subtitle}>
                Maintain your contact details, skills, and portfolio link for employers.
              </p>
            </div>
          </div>

          {success && (
            <div
              style={{
                backgroundColor: 'var(--accent-secondary-subtle)',
                border: '1px solid var(--accent-secondary-border)',
                color: 'var(--accent-secondary)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Profile successfully updated</span>
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-rejected-bg)',
                border: '1px solid var(--status-rejected-border)',
                color: 'var(--status-rejected-text)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card" style={{ padding: '1.75rem', maxWidth: '700px' }}>
            <div className="form-group">
              <label className="form-label">{t.auth.fullNameLabel} *</label>
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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t.auth.emailLabel}</label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem', backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
                    value={user?.email || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{t.auth.phoneLabel} (with WhatsApp)</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.auth.locationLabel}</label>
              <div style={{ position: 'relative' }}>
                <MapPin
                  size={15}
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  placeholder="e.g. Kukatpally, Hyderabad"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.seeker.headlineLabel}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t.seeker.headlinePlaceholder}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.seeker.skillsLabel}</label>
              <input
                type="text"
                className="form-input"
                placeholder={t.seeker.skillsPlaceholder}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <span className="form-hint">
                Separate with commas (e.g. React.js, Customer Service, Telugu, Cash Billing)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">{t.applyModal.resumeLabel}</label>
              <div style={{ position: 'relative' }}>
                <LinkIcon
                  size={15}
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="url"
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  placeholder="https://drive.google.com/... or LinkedIn"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.seeker.bioLabel}</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Share your background, shift availability, and skills..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={15} />
                <span>{loading ? t.common.loading : t.seeker.saveProfileBtn}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
