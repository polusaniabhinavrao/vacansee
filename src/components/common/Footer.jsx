import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className="container-wide">
        <div className={styles.footerGrid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandWordmark}>
              Vacansee<span style={{ color: 'var(--accent-primary)' }}>.</span>
            </div>
            <p className={styles.brandDesc}>
              {language === 'te'
                ? 'తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లోని స్థానిక ఉద్యోగాలు, విద్యార్థుల అవకాశాలు మరియు వ్యాపార నియామకాల కోసం పారదర్శక డిజిటల్ వేదిక.'
                : 'A calm, accessible marketplace connecting local businesses, students, freshers, and professionals.'}
            </p>
          </div>

          {/* Quick Links for Seekers */}
          <div>
            <h4 className={styles.colTitle}>Opportunities</h4>
            <ul className={styles.colLinks}>
              <li><Link to="/jobs" className={styles.colLink}>All Listings</Link></li>
              <li><Link to="/jobs?type=weekend" className={styles.colLink}>Weekend Student Jobs</Link></li>
              <li><Link to="/jobs?type=part_time" className={styles.colLink}>Part-Time Roles</Link></li>
              <li><Link to="/local-jobs" className={styles.colLink}>Local Businesses</Link></li>
            </ul>
          </div>

          {/* Quick Links for Employers */}
          <div>
            <h4 className={styles.colTitle}>Employers</h4>
            <ul className={styles.colLinks}>
              <li><Link to="/employer/jobs/new" className={styles.colLink}>Post a Vacancy</Link></li>
              <li><Link to="/employer/dashboard" className={styles.colLink}>Employer Workspace</Link></li>
              <li><Link to="/employer/jobs" className={styles.colLink}>Manage Listings</Link></li>
              <li><Link to="/register?role=employer" className={styles.colLink}>Business Sign Up</Link></li>
            </ul>
          </div>

          {/* Language & Info */}
          <div>
            <h4 className={styles.colTitle}>Language</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`${styles.langPill} ${language === 'en' ? styles.langPillActive : ''}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`${styles.langPill} ${language === 'te' ? styles.langPillActive : ''}`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Telangana &amp; Andhra Pradesh
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div>
            © {new Date().getFullYear()} Vacansee. Designed with care.
          </div>
          <div>
            Bilingual Employment Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
