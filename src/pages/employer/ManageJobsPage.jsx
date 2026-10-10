import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  PlusCircle,
  Edit,
  Power,
  Store,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/common/StatusBadge';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import styles from './EmployerDashboard.module.css';

export default function ManageJobsPage() {
  const { user } = useAuth();
  const { jobs, toggleJobStatus, getJobApplicants } = useJobs();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('all');
  const [applicantCounts, setApplicantCounts] = useState({});

  const employerJobs = jobs.filter((j) => String(j.employer_id) === String(user?.id));

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

  const filteredJobs = employerJobs.filter((job) => {
    if (activeTab === 'active') return job.status === 'active';
    if (activeTab === 'closed') return job.status === 'closed';
    return true;
  });

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="employer" />

        <div className={styles.mainContent}>
          {/* Header */}
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>{t.employer.manageTitle}</h1>
              <p className={styles.subtitle}>
                Oversee your active postings, pause applications, and review candidate pipelines.
              </p>
            </div>

            <Link to="/employer/jobs/new" className="btn btn-primary btn-sm">
              <PlusCircle size={14} />
              <span>{t.employer.postNewJob}</span>
            </Link>
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{
                fontWeight: activeTab === 'all' ? 700 : 500,
                color: activeTab === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'all' ? '2px solid var(--accent-primary)' : 'none',
                borderRadius: 0,
              }}
              onClick={() => setActiveTab('all')}
            >
              All Vacancies ({employerJobs.length})
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{
                fontWeight: activeTab === 'active' ? 700 : 500,
                color: activeTab === 'active' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'active' ? '2px solid var(--accent-primary)' : 'none',
                borderRadius: 0,
              }}
              onClick={() => setActiveTab('active')}
            >
              Active ({employerJobs.filter((j) => j.status === 'active').length})
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{
                fontWeight: activeTab === 'closed' ? 700 : 500,
                color: activeTab === 'closed' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'closed' ? '2px solid var(--accent-primary)' : 'none',
                borderRadius: 0,
              }}
              onClick={() => setActiveTab('closed')}
            >
              Closed ({employerJobs.filter((j) => j.status === 'closed').length})
            </button>
          </div>

          {/* Listings Cards */}
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title={t.employer.noJobsPosted}
              description="You do not have any listings matching this filter."
              actionLabel={t.employer.postFirstJob}
              actionLink="/employer/jobs/new"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredJobs.map((job) => {
                const applicantsCount = applicantCounts[job.id] || 0;
                return (
                  <div key={job.id} className="card" style={{ padding: '1.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>
                            <Link to={`/jobs/${job.id}`} style={{ color: 'var(--text-primary)' }}>
                              {job.title}
                            </Link>
                          </h3>
                          <StatusBadge status={job.status} />
                          {job.is_local_business ? (
                            <Badge variant="local" size="sm">
                              <Store size={11} /> Local Business
                            </Badge>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              <Building2 size={11} /> Corporate
                            </Badge>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.8125rem', flexWrap: 'wrap', margin: '0.4rem 0' }}>
                          <span><strong>Location:</strong> {job.location}</span>
                          <span><strong>Type:</strong> {t.employmentTypes[job.employment_type] || job.employment_type}</span>
                          <span><strong>Category:</strong> {t.categories[job.category] || job.category}</span>
                          <span><strong>Vacancies:</strong> {job.vacancies}</span>
                        </div>
                      </div>

                      {/* Actions toolbar */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <Link
                          to={`/employer/jobs/${job.id}/applicants`}
                          className="btn btn-secondary btn-sm"
                        >
                          <Users size={13} />
                          <span>Applicants ({applicantsCount})</span>
                        </Link>

                        <Link
                          to={`/employer/jobs/${job.id}/edit`}
                          className="btn btn-ghost btn-sm"
                        >
                          <Edit size={13} />
                          <span>{t.employer.editJob}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => toggleJobStatus(job.id, job.status)}
                          className="btn btn-ghost btn-sm"
                          style={{ fontSize: '0.775rem', color: job.status === 'active' ? 'var(--status-rejected-text)' : 'var(--accent-secondary)' }}
                        >
                          <Power size={13} />
                          <span>{job.status === 'active' ? 'Close' : 'Reactivate'}</span>
                        </button>
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
