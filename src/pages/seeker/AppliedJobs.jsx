import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Building2, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import styles from './SeekerDashboard.module.css';

export default function AppliedJobs() {
  const { userApplications, jobs } = useJobs();
  const { t } = useLanguage();

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="seeker" />

        <div className={styles.mainContent}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>
                {t.seeker.myApplications} ({userApplications.length})
              </h1>
              <p className={styles.subtitle}>
                Track real-time hiring progress and employer feedback.
              </p>
            </div>

            <Link to="/jobs" className="btn btn-primary btn-sm">
              Find More Jobs
            </Link>
          </div>

          {userApplications.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={t.seeker.noApplicationsYet}
              description="Start exploring local jobs, weekend shifts, or fresher roles."
              actionLabel={t.seeker.exploreJobsBtn}
              actionLink="/jobs"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userApplications.map((app) => {
                const job = app.jobs || jobs.find((j) => String(j.id) === String(app.job_id)) || {};
                const appliedDate = app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently';

                return (
                  <div key={app.id} className="card" style={{ padding: '1.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '0.85rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                            <Link to={`/jobs/${app.job_id}`} style={{ color: 'var(--text-primary)' }}>
                              {job.title || 'Role'}
                            </Link>
                          </h3>
                          <StatusBadge status={app.status} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Building2 size={13} color="var(--accent-primary)" />
                            {job.company_name || 'Business'}
                          </span>
                          {job.location && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={13} color="var(--accent-primary)" />
                              {job.location}
                            </span>
                          )}
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                            <Calendar size={13} />
                            {appliedDate}
                          </span>
                        </div>
                      </div>

                      <Link to={`/jobs/${app.job_id}`} className="btn btn-secondary btn-sm">
                        <span>View Vacancy</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>

                    {/* Note details */}
                    {(app.cover_note || app.contact_phone || app.resume_link) && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.85rem 1rem',
                          fontSize: '0.825rem',
                          marginTop: '0.5rem',
                          border: '1px solid var(--border-medium)',
                        }}
                      >
                        {app.contact_phone && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            <strong style={{ color: 'var(--text-secondary)' }}>Contact Phone:</strong> {app.contact_phone}
                          </div>
                        )}
                        {app.resume_link && (
                          <div style={{ marginBottom: '0.25rem' }}>
                            <strong style={{ color: 'var(--text-secondary)' }}>Portfolio / Resume:</strong>{' '}
                            <a href={app.resume_link} target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
                              {app.resume_link}
                            </a>
                          </div>
                        )}
                        {app.cover_note && (
                          <div>
                            <strong style={{ color: 'var(--text-secondary)' }}>Cover Note:</strong> <em>"{app.cover_note}"</em>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Timeline Progression */}
                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Hiring Status Progression:
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', fontSize: '0.775rem' }}>
                        <span style={{ fontWeight: app.status === 'applied' ? 700 : 500, color: app.status === 'applied' ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          1. Applied ✓
                        </span>
                        <span style={{ color: 'var(--border-strong)' }}>→</span>
                        <span style={{ fontWeight: app.status === 'reviewing' ? 700 : 500, color: app.status === 'reviewing' ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                          2. Under Review
                        </span>
                        <span style={{ color: 'var(--border-strong)' }}>→</span>
                        <span style={{ fontWeight: app.status === 'shortlisted' ? 700 : 500, color: app.status === 'shortlisted' ? '#E5B580' : 'var(--text-muted)' }}>
                          3. Shortlisted
                        </span>
                        <span style={{ color: 'var(--border-strong)' }}>→</span>
                        <span style={{ fontWeight: app.status === 'hired' ? 700 : 500, color: app.status === 'hired' ? 'var(--accent-secondary)' : (app.status === 'rejected' ? 'var(--status-rejected-text)' : 'var(--text-muted)') }}>
                          {app.status === 'rejected' ? 'Not Selected' : '4. Hired 🎉'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
