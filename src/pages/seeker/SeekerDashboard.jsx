import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  Briefcase,
  ArrowRight,
  TrendingUp,
  User,
  PartyPopper,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import JobCard from '../../components/jobs/JobCard';
import styles from './SeekerDashboard.module.css';

export default function SeekerDashboard() {
  const { profile } = useAuth();
  const { userApplications, savedJobIds, jobs } = useJobs();
  const { language, t } = useLanguage();

  const totalApplied = userApplications.length;
  const totalShortlisted = userApplications.filter((a) => a.status === 'shortlisted').length;
  const totalHired = userApplications.filter((a) => a.status === 'hired').length;
  const totalSaved = savedJobIds.size;

  const recentApplications = userApplications.slice(0, 5);

  const appliedJobIds = new Set(userApplications.map((a) => a.job_id));
  const recommendedJobs = jobs
    .filter((j) => j.status === 'active' && !appliedJobIds.has(j.id))
    .slice(0, 2);

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        {/* Workspace Sidebar */}
        <DashboardSidebar role="seeker" />

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>
                {t.seeker.welcome}, {profile?.full_name || 'Candidate'}
              </h1>
              <p className={styles.subtitle}>
                {profile?.headline || 'Track your live applications and explore open positions.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <Link to="/recommendations" className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--accent-recommendation-border)' }}>
                <Sparkles size={14} color="var(--accent-recommendation)" />
                <span>Jobs That Fit Me</span>
              </Link>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                <Briefcase size={14} />
                <span>Explore Opportunities</span>
              </Link>
            </div>
          </div>

          {/* Activity Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{totalApplied}</span>
              <span className={styles.statLabel}>{t.seeker.totalApplied}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: 'var(--accent-primary)' }}>
                {totalShortlisted}
              </span>
              <span className={styles.statLabel}>{t.seeker.shortlisted}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: 'var(--accent-secondary)' }}>
                {totalHired}
              </span>
              <span className={styles.statLabel}>{t.seeker.hired}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum}>{totalSaved}</span>
              <span className={styles.statLabel}>{t.seeker.savedJobs}</span>
            </div>
          </div>

          {/* Recent Applications Activity */}
          <div className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.seeker.recentApplications}</h2>
              {userApplications.length > 0 && (
                <Link to="/seeker/applied" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  View All ({userApplications.length}) →
                </Link>
              )}
            </div>

            {recentApplications.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={t.seeker.noApplicationsYet}
                description="Browse active vacancies to discover opportunities suited to your schedule."
                actionLabel={t.seeker.exploreJobsBtn}
                actionLink="/jobs"
              />
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Organization</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => {
                      const job = app.jobs || jobs.find((j) => String(j.id) === String(app.job_id)) || {};
                      return (
                        <tr key={app.id}>
                          <td>
                            <Link
                              to={`/jobs/${app.job_id}`}
                              style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                            >
                              {job.title || 'Role'}
                            </Link>
                          </td>
                          <td>{job.company_name || 'Employer'}</td>
                          <td>
                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                          </td>
                          <td>
                            <StatusBadge status={app.status} />
                          </td>
                          <td>
                            <Link to={`/jobs/${app.job_id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.55rem' }}>
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recommended Jobs */}
          {recommendedJobs.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  Recommended For You
                </h2>
                <Link to="/jobs" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  Browse All →
                </Link>
              </div>
              <div className="grid-2">
                {recommendedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
