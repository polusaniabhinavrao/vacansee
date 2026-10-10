import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle,
  PlusCircle,
  Eye,
  Edit,
  Power
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import styles from './EmployerDashboard.module.css';

export default function EmployerDashboard() {
  const { user, profile } = useAuth();
  const { jobs, toggleJobStatus, getJobApplicants } = useJobs();
  const { t } = useLanguage();

  const [applicantCounts, setApplicantCounts] = useState({});

  const employerJobs = jobs.filter((j) => String(j.employer_id) === String(user?.id));
  const activeJobs = employerJobs.filter((j) => j.status === 'active');

  useEffect(() => {
    async function loadCounts() {
      const counts = {};
      for (const j of employerJobs) {
        try {
          const apps = await getJobApplicants(j.id);
          counts[j.id] = apps.length;
        } catch {
          counts[j.id] = 0;
        }
      }
      setApplicantCounts(counts);
    }

    if (employerJobs.length > 0) {
      loadCounts();
    }
  }, [jobs, employerJobs.length]);

  const totalApplicants = Object.values(applicantCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="employer" />

        <div className={styles.mainContent}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>
                {t.employer.welcome}, {profile?.full_name || 'Employer'}
              </h1>
              <p className={styles.subtitle}>
                {profile?.company_name ? `Recruitment workspace for ${profile.company_name}` : 'Manage active vacancies and applicant pipelines.'}
              </p>
            </div>

            <Link to="/employer/jobs/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} />
              <span>Post a Vacancy</span>
            </Link>
          </div>

          {/* Activity Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>{employerJobs.length}</span>
              <span className={styles.statLabel}>{t.employer.totalPosted}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: 'var(--accent-secondary)' }}>
                {activeJobs.length}
              </span>
              <span className={styles.statLabel}>{t.employer.activeListings}</span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statNum} style={{ color: 'var(--accent-primary)' }}>
                {totalApplicants}
              </span>
              <span className={styles.statLabel}>{t.employer.totalApplicants}</span>
            </div>
          </div>

          {/* Job Listings Table */}
          <div className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t.employer.manageTitle}</h2>
              {employerJobs.length > 0 && (
                <Link to="/employer/jobs" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  View All ({employerJobs.length}) →
                </Link>
              )}
            </div>

            {employerJobs.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title={t.employer.noJobsPosted}
                description="Post your shop, cafe, tutoring academy, or corporate vacancy to start receiving verified applicants."
                actionLabel={t.employer.postFirstJob}
                actionLink="/employer/jobs/new"
              />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-medium)' }}>
                      <th style={{ padding: '0.75rem 0.85rem', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Role</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Type</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Applicants</th>
                      <th style={{ padding: '0.65rem 0.85rem', fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employerJobs.slice(0, 6).map((job) => {
                      const applicantsCount = applicantCounts[job.id] || 0;
                      return (
                        <tr key={job.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '0.85rem' }}>
                            <Link to={`/jobs/${job.id}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {job.title}
                            </Link>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {job.location}
                            </div>
                          </td>
                          <td style={{ padding: '0.85rem', color: 'var(--text-secondary)' }}>
                            {t.employmentTypes[job.employment_type] || job.employment_type}
                          </td>
                          <td style={{ padding: '0.85rem' }}>
                            <StatusBadge status={job.status} />
                          </td>
                          <td style={{ padding: '0.85rem' }}>
                            <Link
                              to={`/employer/jobs/${job.id}/applicants`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontWeight: 600,
                                color: applicantsCount > 0 ? 'var(--accent-primary)' : 'var(--text-muted)',
                              }}
                            >
                              <Users size={13} />
                              <span>{applicantsCount} applicants</span>
                            </Link>
                          </td>
                          <td style={{ padding: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <Link
                                to={`/employer/jobs/${job.id}/applicants`}
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '0.2rem 0.55rem' }}
                                title="Review Candidates"
                              >
                                <Eye size={12} />
                                <span>View</span>
                              </Link>
                              <Link
                                to={`/employer/jobs/${job.id}/edit`}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '0.2rem 0.45rem' }}
                                title="Edit Listing"
                              >
                                <Edit size={12} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleJobStatus(job.id, job.status)}
                                className="btn btn-ghost btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.2rem 0.45rem', color: job.status === 'active' ? 'var(--status-rejected-text)' : 'var(--accent-secondary)' }}
                              >
                                {job.status === 'active' ? 'Close' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
