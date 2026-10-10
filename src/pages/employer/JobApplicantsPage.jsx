import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertCircle
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import styles from './EmployerDashboard.module.css';

export default function JobApplicantsPage() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { getJobById, getJobApplicants, updateApplicationStatus } = useJobs();
  const { t } = useLanguage();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionError, setActionError] = useState(null);

  const job = getJobById(jobId);
  const isOwner = !job || !user || String(job.employer_id) === String(user.id);

  useEffect(() => {
    async function loadApplicants() {
      setLoading(true);
      try {
        const data = await getJobApplicants(jobId);
        setApplicants(data);
      } catch (err) {
        console.error('Failed to load applicants:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setActionError(null);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      setActionError(err.message || 'Failed to update status');
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="employer" />

        <div className={styles.mainContent}>
          {!isOwner ? (
            <EmptyState
              icon={AlertCircle}
              title="Unauthorized Access"
              description="You do not have permission to view applicants for this posting because it belongs to another employer."
              actionLabel="Back to My Postings"
              onAction={() => { window.location.href = '/employer/jobs'; }}
            />
          ) : (
            <>
              {/* Header */}
              <div>
                <Link
                  to="/employer/jobs"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                    marginBottom: '0.65rem',
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Job Postings</span>
                </Link>

            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.title}>
                  Applicants for {job?.title || 'Job Listing'}
                </h1>
                <p className={styles.subtitle}>
                  Review candidate profiles, contact via phone/WhatsApp, and update their pipeline.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Filter by status:
                </span>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All ({applicants.length})</option>
                  <option value="applied">Applied ({applicants.filter((a) => a.status === 'applied').length})</option>
                  <option value="reviewing">Reviewing ({applicants.filter((a) => a.status === 'reviewing').length})</option>
                  <option value="shortlisted">Shortlisted ({applicants.filter((a) => a.status === 'shortlisted').length})</option>
                  <option value="hired">Hired ({applicants.filter((a) => a.status === 'hired').length})</option>
                  <option value="rejected">Rejected ({applicants.filter((a) => a.status === 'rejected').length})</option>
                </select>
              </div>
            </div>
          </div>

          {actionError && (
            <div
              style={{
                backgroundColor: 'var(--status-rejected-bg)',
                border: '1px solid var(--status-rejected-border)',
                color: 'var(--status-rejected-text)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={15} />
              <span>{actionError}</span>
            </div>
          )}

          {loading ? (
            <LoadingSpinner message="Loading candidate applications..." />
          ) : filteredApplicants.length === 0 ? (
            <EmptyState
              icon={Users}
              title={t.employer.noApplicantsForJob}
              description="Share this vacancy with your network to attract candidates."
              actionLabel="Back to Listings"
              actionLink="/employer/jobs"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredApplicants.map((app) => {
                const profile = app.profiles || {};
                const applicantName = app.applicant_name || profile.full_name || 'Applicant';
                const applicantEmail = app.applicant_email || profile.email || 'No email provided';
                const applicantPhone = app.contact_phone || profile.phone || 'No phone provided';
                const appliedDate = app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recently';

                return (
                  <div key={app.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                          <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-primary)' }}>
                            {applicantName}
                          </h3>
                          <StatusBadge status={app.status} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.8125rem', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Mail size={13} color="var(--accent-primary)" />
                            <a href={`mailto:${applicantEmail}`} style={{ color: 'var(--text-secondary)' }}>{applicantEmail}</a>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Phone size={13} color="var(--accent-primary)" />
                            <a href={`tel:${applicantPhone}`} style={{ color: 'var(--text-secondary)' }}>{applicantPhone}</a>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
                            <Calendar size={13} />
                            {appliedDate}
                          </span>
                        </div>
                      </div>

                      {app.resume_link && (
                        <a
                          href={app.resume_link}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          <span>Resume / Portfolio</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    {/* Cover Note */}
                    {app.cover_note && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          lineHeight: 1.6,
                          color: 'var(--text-secondary)',
                          marginBottom: '1rem',
                          border: '1px solid var(--border-medium)',
                        }}
                      >
                        <strong style={{ color: 'var(--text-primary)' }}>Applicant Note:</strong> {app.cover_note}
                      </div>
                    )}

                    {/* Action Pipeline */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Update Candidate Status:
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'reviewing')}
                          className={`btn ${app.status === 'reviewing' ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          <Clock size={12} />
                          <span>Reviewing</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'shortlisted')}
                          className={`btn ${app.status === 'shortlisted' ? 'btn-secondary' : 'btn-ghost'} btn-sm`}
                          style={{ color: '#966025' }}
                        >
                          <Award size={12} />
                          <span>Shortlist</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'hired')}
                          className={`btn ${app.status === 'hired' ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                          style={{ color: app.status === 'hired' ? '#FFFFFF' : 'var(--accent-secondary)' }}
                        >
                          <CheckCircle2 size={12} />
                          <span>Hire 🎉</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          className={`btn ${app.status === 'rejected' ? 'btn-danger' : 'btn-ghost'} btn-sm`}
                          style={{ color: 'var(--status-rejected-text)' }}
                        >
                          <XCircle size={12} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}
