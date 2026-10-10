import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Building, Phone, MapPin, UserPlus, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Auth.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const defaultRole = query.get('role') === 'employer' ? 'employer' : 'seeker';
  const redirectPath = query.get('redirect') || '';

  const [role, setRole] = useState(defaultRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (role === 'employer' && !companyName.trim()) {
      setError('Please provide your business or company name.');
      return;
    }

    setLoading(true);
    try {
      await register({
        email,
        password,
        role,
        fullName,
        phone,
        companyName: role === 'employer' ? companyName : '',
        location: userLocation,
      });

      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate(role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>{t.auth.registerTitle}</h1>
          <p className={styles.authSubtitle}>{t.auth.registerSubtitle}</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="form-group">
          <label className="form-label">{t.auth.roleLabel}</label>
          <div className={styles.roleSelector}>
            <div
              className={`${styles.roleOption} ${role === 'seeker' ? styles.roleOptionActive : ''}`}
              onClick={() => setRole('seeker')}
            >
              <GraduationCap size={18} color={role === 'seeker' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
              <div className={styles.roleOptionTitle}>{t.nav.seekerRole}</div>
              <div className={styles.roleOptionDesc}>Students &amp; candidates</div>
            </div>

            <div
              className={`${styles.roleOption} ${role === 'employer' ? styles.roleOptionActive : ''}`}
              onClick={() => setRole('employer')}
            >
              <Building size={18} color={role === 'employer' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
              <div className={styles.roleOptionTitle}>{t.nav.employerRole}</div>
              <div className={styles.roleOptionDesc}>Shops, cafes, startups</div>
            </div>
          </div>
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
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t.auth.fullNameLabel} *</label>
            <div style={{ position: 'relative' }}>
              <User
                size={14}
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '2.1rem' }}
                placeholder="e.g. Sai Krishna / Ramesh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {role === 'employer' && (
            <div className="form-group">
              <label className="form-label">{t.auth.companyNameLabel} *</label>
              <div style={{ position: 'relative' }}>
                <Building
                  size={14}
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  placeholder="e.g. Srikara Retail / Deccan Tech"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t.auth.emailLabel} *</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={14}
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="email"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.auth.phoneLabel}</label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={14}
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

          <div className="form-group">
            <label className="form-label">{t.auth.locationLabel}</label>
            <div style={{ position: 'relative' }}>
              <MapPin
                size={14}
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.1rem' }}
                placeholder="e.g. Hyderabad, Vijayawada, Vizag"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">{t.auth.passwordLabel} *</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={14}
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t.auth.confirmPasswordLabel} *</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={14}
                  style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  required
                  className="form-input"
                  style={{ paddingLeft: '2.1rem' }}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.4rem' }}
            disabled={loading}
          >
            <UserPlus size={15} />
            <span>{loading ? t.common.loading : t.auth.registerBtn}</span>
          </button>
        </form>

        <div className={styles.footerNote}>
          <span>{t.auth.haveAccount} </span>
          <Link to={`/login${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} style={{ fontWeight: 600 }}>
            {t.auth.signInLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
