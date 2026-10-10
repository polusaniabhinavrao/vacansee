import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import styles from './EmployerDashboard.module.css';

export default function EmployerProfile() {
  const { user, profile, updateProfile } = useAuth();
  const { t } = useLanguage();

  const [companyName, setCompanyName] = useState(profile?.company_name || '');
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [industry, setIndustry] = useState(profile?.headline || 'Retail & Local Commerce');
  const [bio, setBio] = useState(profile?.bio || '');
  const [website, setWebsite] = useState(profile?.resume_url || '');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!companyName.trim()) {
        throw new Error('Business name is required');
      }

      await updateProfile({
        company_name: companyName,
        full_name: fullName,
        phone,
        location,
        headline: industry,
        bio,
        resume_url: website,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="employer" />

        <div className={styles.mainContent}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>Company Profile</h1>
              <p className={styles.subtitle}>
                Manage your enterprise information, verified recruitment contact, and public business details.
              </p>
            </div>
          </div>

          {success && (
            <div
              style={{
                backgroundColor: 'var(--status-success-bg)',
                border: '1px solid var(--status-success-border)',
                color: 'var(--status-success)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Company profile successfully updated</span>
            </div>
          )}

          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-error-bg)',
                border: '1px solid var(--status-error-border)',
                color: 'var(--status-error)',
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

          <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', maxWidth: '750px' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Business / Company Name *</label>
                <div style={{ position: 'relative' }}>
                  <Building2
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Authorized Contact Person *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Recruiter Email Address</label>
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
                <label className="form-label">Contact Phone / WhatsApp</label>
                <div style={{ position: 'relative' }}>
                  <Phone
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    placeholder="+91 98480..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Primary City / Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    placeholder="e.g. Hyderabad, Telangana"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Website or Google Maps Link</label>
                <div style={{ position: 'relative' }}>
                  <Globe
                    size={15}
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="url"
                    className="form-input"
                    style={{ paddingLeft: '2.1rem' }}
                    placeholder="https://..."
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Industry Sector / Tagline</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Specialty Coffee & Bakery / Modern Tech"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Overview / Workplace Culture</label>
              <textarea
                rows={4}
                className="form-textarea"
                placeholder="Describe your shop, restaurant, salon, or company atmosphere..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={15} />
                <span>{loading ? 'Saving Changes...' : 'Save Company Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

