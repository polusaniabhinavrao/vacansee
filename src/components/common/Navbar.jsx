import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  User,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronDown,
  Bookmark,
  FileText,
  LayoutDashboard,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useJobs } from '../../context/JobContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, profile, isSeeker, isEmployer, isAuthenticated, logout, loginDemo, isConfigured } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { savedJobIds, userApplications } = useJobs();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getInitial = () => {
    if (profile?.full_name) return profile.full_name[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const isLocalJobsActive =
    location.pathname === '/local-jobs' ||
    (location.pathname === '/jobs' && location.search.includes('local=true'));

  const isFindJobsActive =
    location.pathname === '/jobs' && !location.search.includes('local=true');

  return (
    <header className={styles.header}>
      <div className={`container-wide ${styles.navContainer}`}>
        {/* Editorial Wordmark */}
        <Link to="/" className={styles.brand} onClick={() => setMobileOpen(false)}>
          <span className={styles.brandWordmark}>
            Vacansee<span className={styles.brandDot} />
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks}>
          <li>
            <Link
              to="/jobs"
              className={`${styles.navLink} ${isFindJobsActive ? styles.navLinkActive : ''}`}
            >
              {language === 'te' ? 'ఉద్యోగాలు' : 'Find Jobs'}
            </Link>
          </li>
          <li>
            <Link
              to="/local-jobs"
              className={`${styles.navLink} ${isLocalJobsActive ? styles.navLinkActive : ''}`}
            >
              {language === 'te' ? 'స్థానిక ఉద్యోగాలు' : 'Local Jobs'}
            </Link>
          </li>
          <li>
            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <Sparkles size={13} color="var(--accent-recommendation)" style={{ marginRight: '4px' }} />
              {language === 'te' ? 'నాకు సరిపోయేవి' : 'Jobs That Fit Me'}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={isEmployer ? "/employer/jobs/new" : "/register?role=employer"}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {language === 'te' ? 'యాజమాన్యం కోసం' : 'For Employers'}
            </NavLink>
          </li>

          {/* Seeker Quick Links */}
          {isAuthenticated && isSeeker && (
            <>
              <li>
                <NavLink
                  to="/seeker/applied"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {t.nav.appliedJobs}
                  {userApplications.length > 0 && (
                    <span className={styles.badgeCount}>{userApplications.length}</span>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/seeker/saved"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                  }
                >
                  {t.nav.savedJobs}
                  {savedJobIds.size > 0 && (
                    <span className={styles.badgeCount}>{savedJobIds.size}</span>
                  )}
                </NavLink>
              </li>
            </>
          )}

          {/* Employer Quick Links */}
          {isAuthenticated && isEmployer && (
            <li>
              <NavLink
                to="/employer/jobs"
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
              >
                {t.nav.myListings}
              </NavLink>
            </li>
          )}
        </ul>

        {/* Actions */}
        <div className={styles.navActions}>
          {/* Language Switch */}
          <button
            type="button"
            onClick={toggleLanguage}
            className={styles.langToggle}
            title={language === 'en' ? 'తెలుగులోకి మార్చండి' : 'Switch to English'}
          >
            <Globe size={13} color="var(--accent-primary)" />
            <span>{language === 'en' ? 'తెలుగు' : 'EN'}</span>
          </button>

          {/* Primary Action Button */}
          {(!isAuthenticated || isEmployer) && (
            <Link
              to={isAuthenticated ? '/employer/jobs/new' : '/login?redirect=/employer/jobs/new'}
              className="btn btn-outline-primary btn-sm"
            >
              <Plus size={14} />
              <span>{t.nav.postJob}</span>
            </Link>
          )}

          {/* User authenticated menu */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                className={styles.userMenuButton}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className={styles.userAvatar}>{getInitial()}</div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.full_name || 'Account'}
                </span>
                <ChevronDown size={13} color="var(--text-muted)" />
              </button>

              {dropdownOpen && (
                <div className={styles.userMenuDropdown}>
                  <div style={{ padding: '0.5rem 0.65rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                      {profile?.full_name}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {user?.email}
                    </div>
                    <div style={{ marginTop: '0.35rem' }}>
                      <span
                        style={{
                          fontSize: '0.675rem',
                          padding: '0.1rem 0.45rem',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: isEmployer ? 'var(--accent-primary-subtle)' : 'var(--bg-secondary)',
                          color: isEmployer ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          border: `1px solid ${isEmployer ? 'var(--accent-primary-border)' : 'var(--border-medium)'}`,
                          fontWeight: 600,
                        }}
                      >
                        {isEmployer ? t.nav.employerRole : t.nav.seekerRole}
                      </span>
                    </div>
                  </div>

                  {isSeeker && (
                    <>
                      <Link
                        to="/seeker/dashboard"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard size={14} />
                        <span>{t.nav.dashboard}</span>
                      </Link>
                      <Link
                        to="/recommendations"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Sparkles size={14} color="var(--accent-recommendation)" />
                        <span>Jobs That Fit Me</span>
                      </Link>
                      <Link
                        to="/seeker/profile"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={14} />
                        <span>{t.nav.profile}</span>
                      </Link>
                      <Link
                        to="/seeker/applied"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FileText size={14} />
                        <span>{t.nav.appliedJobs}</span>
                      </Link>
                      <Link
                        to="/seeker/saved"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Bookmark size={14} />
                        <span>{t.nav.savedJobs}</span>
                      </Link>
                    </>
                  )}

                  {isEmployer && (
                    <>
                      <Link
                        to="/employer/dashboard"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard size={14} />
                        <span>{t.nav.dashboard}</span>
                      </Link>
                      <Link
                        to="/employer/jobs/new"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Plus size={14} />
                        <span>{t.nav.postJob}</span>
                      </Link>
                      <Link
                        to="/employer/jobs"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Building2 size={14} />
                        <span>{t.nav.myListings}</span>
                      </Link>
                      <Link
                        to="/employer/profile"
                        className={styles.userMenuItem}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Building2 size={14} color="var(--accent-primary)" />
                        <span>Company Profile</span>
                      </Link>
                    </>
                  )}

                  <div className={styles.menuDivider} />

                  {!isConfigured && (
                    <>
                      <button
                        type="button"
                        className={styles.userMenuItem}
                        onClick={() => {
                          loginDemo(isEmployer ? 'seeker' : 'employer');
                          setDropdownOpen(false);
                        }}
                      >
                        <Sparkles size={14} color="var(--accent-primary)" />
                        <span>Switch to Demo {isEmployer ? 'Seeker' : 'Employer'}</span>
                      </button>
                      <div className={styles.menuDivider} />
                    </>
                  )}

                  <button
                    type="button"
                    className={styles.userMenuItem}
                    onClick={handleLogout}
                    style={{ color: 'var(--status-error)' }}
                  >
                    <LogOut size={14} />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Link to="/login" className="btn btn-ghost btn-sm">
                {t.nav.login}
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                {t.nav.register}
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className={styles.mobileDrawer}>
          <Link
            to="/jobs"
            className={`${styles.navLink} ${isFindJobsActive ? styles.navLinkActive : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {language === 'te' ? 'ఉద్యోగాలు' : 'Find Jobs'}
          </Link>
          <Link
            to="/local-jobs"
            className={`${styles.navLink} ${isLocalJobsActive ? styles.navLinkActive : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            {language === 'te' ? 'స్థానిక ఉద్యోగాలు' : 'Local Jobs'}
          </Link>
          <Link
            to="/recommendations"
            className={styles.navLink}
            onClick={() => setMobileOpen(false)}
          >
            <Sparkles size={14} color="var(--accent-recommendation)" style={{ marginRight: '5px' }} />
            {language === 'te' ? 'నాకు సరిపోయేవి' : 'Jobs That Fit Me'}
          </Link>
          <NavLink
            to={isEmployer ? "/employer/jobs/new" : "/register?role=employer"}
            className={styles.navLink}
            onClick={() => setMobileOpen(false)}
          >
            {language === 'te' ? 'యాజమాన్యం కోసం' : 'For Employers'}
          </NavLink>

          {isAuthenticated && isSeeker && (
            <>
              <NavLink
                to="/seeker/dashboard"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.dashboard}
              </NavLink>
              <NavLink
                to="/seeker/applied"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.appliedJobs} ({userApplications.length})
              </NavLink>
              <NavLink
                to="/seeker/saved"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.savedJobs} ({savedJobIds.size})
              </NavLink>
              <NavLink
                to="/seeker/profile"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.profile}
              </NavLink>
            </>
          )}

          {isAuthenticated && isEmployer && (
            <>
              <NavLink
                to="/employer/dashboard"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.dashboard}
              </NavLink>
              <NavLink
                to="/employer/jobs/new"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.postJob}
              </NavLink>
              <NavLink
                to="/employer/jobs"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.myListings}
              </NavLink>
              <NavLink
                to="/employer/profile"
                className={styles.navLink}
                onClick={() => setMobileOpen(false)}
              >
                Company Profile
              </NavLink>
            </>
          )}

          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.register}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
