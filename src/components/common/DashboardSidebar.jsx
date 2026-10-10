import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  User,
  Building2,
  PlusCircle,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from './DashboardSidebar.module.css';

export default function DashboardSidebar({ role = 'seeker' }) {
  const { profile } = useAuth();
  const { userApplications, savedJobIds, jobs } = useJobs();
  const { t } = useLanguage();

  const getInitial = () => {
    if (profile?.full_name) return profile.full_name[0].toUpperCase();
    return role === 'employer' ? 'E' : 'S';
  };

  const isSeeker = role === 'seeker';
  const employerJobsCount = jobs.filter((j) => String(j.employer_id) === String(profile?.id)).length;

  return (
    <aside className={styles.sidebar}>
      {/* Profile Badge Card */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>{getInitial()}</div>
        <div className={styles.profileInfo}>
          <div className={styles.profileName}>{profile?.full_name || 'My Account'}</div>
          <div className={styles.profileRole}>
            {isSeeker ? t.nav.seekerRole : (profile?.company_name || t.nav.employerRole)}
          </div>
        </div>
      </div>

      {/* Nav Group */}
      <div className={styles.navGroup}>
        {isSeeker ? (
          <>
            <NavLink
              to="/seeker/dashboard"
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <LayoutDashboard size={15} />
                <span>Overview</span>
              </div>
            </NavLink>

            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Sparkles size={15} color="var(--accent-recommendation)" />
                <span style={{ fontWeight: 600 }}>Jobs That Fit Me</span>
              </div>
            </NavLink>

            <NavLink
              to="/seeker/applied"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <FileText size={15} />
                <span>My Applications</span>
              </div>
              {userApplications.length > 0 && (
                <span className={styles.badge}>{userApplications.length}</span>
              )}
            </NavLink>

            <NavLink
              to="/seeker/saved"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Bookmark size={15} />
                <span>Saved Jobs</span>
              </div>
              {savedJobIds.size > 0 && (
                <span className={styles.badge}>{savedJobIds.size}</span>
              )}
            </NavLink>

            <NavLink
              to="/seeker/profile"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <User size={15} />
                <span>Profile</span>
              </div>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/employer/dashboard"
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <LayoutDashboard size={15} />
                <span>Overview</span>
              </div>
            </NavLink>

            <NavLink
              to="/employer/jobs"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Briefcase size={15} />
                <span>Job Postings</span>
              </div>
              {employerJobsCount > 0 && (
                <span className={styles.badge}>{employerJobsCount}</span>
              )}
            </NavLink>

            <NavLink
              to="/employer/jobs/new"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <PlusCircle size={15} />
                <span>Post a Job</span>
              </div>
            </NavLink>

            <NavLink
              to="/employer/profile"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Building2 size={15} />
                <span>Company Profile</span>
              </div>
            </NavLink>
          </>
        )}
      </div>
    </aside>
  );
}
