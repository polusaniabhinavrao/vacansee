import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, UserCheck, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Auth.module.css';

export default function LoginPage() {
  const { login, loginDemo } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const redirectPath = query.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    loginDemo(role);
    if (redirectPath && redirectPath !== '/') {
      navigate(redirectPath);
    } else {
      navigate(role === 'employer' ? '/employer/dashboard' : '/seeker/dashboard');
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>{t.auth.loginTitle}</h1>
          <p className={styles.authSubtitle}>{t.auth.loginSubtitle}</p>
        </div>

        {/* Demo Fast Login Shortcut */}
        <div className={styles.demoBox}>
          <div className={styles.demoTitle}>
            <Sparkles size={13} />
            <span>{t.auth.demoLoginNotice}</span>
          </div>
          <div className={styles.demoBtns}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => handleDemoLogin('seeker')}
            >
              <UserCheck size={13} color="var(--accent-primary)" />
              <span>{t.auth.demoSeeker}</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
              onClick={() => handleDemoLogin('employer')}
            >
              <Building size={13} color="var(--accent-primary)" />
              <span>{t.auth.demoEmployer}</span>
            </button>
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
            <label className="form-label">{t.auth.emailLabel}</label>
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
            <label className="form-label">{t.auth.passwordLabel}</label>
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.4rem' }}
            disabled={loading}
          >
            <LogIn size={15} />
            <span>{loading ? t.common.loading : t.auth.loginBtn}</span>
          </button>
        </form>

        <div className={styles.footerNote}>
          <span>{t.auth.noAccount} </span>
          <Link to={`/register${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`} style={{ fontWeight: 600 }}>
            {t.auth.signUpLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
