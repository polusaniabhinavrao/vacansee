import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Building2,
  Bookmark,
  Users,
  CheckCircle2,
  Briefcase,
  Store,
  Phone,
  Mail,
  ArrowLeft,
  Share2,
  Check,
  AlertCircle
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Badge from '../../components/common/Badge';
import StatusBadge from '../../components/common/StatusBadge';
import ApplyModal from '../../components/jobs/ApplyModal';
import styles from './JobDetailPage.module.css';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, toggleSaveJob, isJobSaved, hasApplied, userApplications } = useJobs();
  const { user, isEmployer, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const job = getJobById(id);

  if (!job) {
    return (
      <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>
        <h2>Opportunity Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          This vacancy may have closed or does not exist.
        </p>
        <Link to="/jobs" className="btn btn-primary">
          Browse Active Opportunities
        </Link>
      </div>
    );
  }

  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id);
  const application = userApplications.find((a) => String(a.job_id) === String(job.id));

  // Format salary
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) {
      return 'Compensation on Application';
    }
    const min = job.salary_min ? `₹${Number(job.salary_min).toLocaleString('en-IN')}` : '';
    const max = job.salary_max ? `₹${Number(job.salary_max).toLocaleString('en-IN')}` : '';
    const period = job.salary_period ? `/${t.jobs[`per${job.salary_period.charAt(0).toUpperCase() + job.salary_period.slice(1)}`] || job.salary_period}` : '';

    if (min && max) return `${min} – ${max} ${period}`;
    if (min) return `From ${min} ${period}`;
    return `Up to ${max} ${period}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/jobs/${job.id}`);
      return;
    }
    setApplyModalOpen(true);
  };

  return (
    <div className="page-wrapper">
      {/* Back Link */}
      <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', padding: '0.85rem 0' }}>
        <div className="container-wide">
          <Link
            to="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              fontSize: '0.8375rem',
            }}
          >
            <ArrowLeft size={14} />
            <span>{t.jobDetail.backToList}</span>
          </Link>
        </div>
      </div>

      <div className="container-wide">
        <div className={styles.detailLayout}>
          {/* Main Column */}
          <div className={styles.mainCol}>
            {/* Header */}
            <div className={styles.jobHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  {job.is_local_business ? (
                    <Badge variant="local">
                      <Store size={13} /> Local Business
                    </Badge>
                  ) : (
                    <Badge variant="neutral">
                      <Building2 size={13} /> Corporate / Tech
                    </Badge>
                  )}
                  <Badge variant="primary">
                    {t.employmentTypes[job.employment_type] || job.employment_type}
                  </Badge>
                  <Badge variant="neutral">
                    {t.categories[job.category] || job.category}
                  </Badge>
                  {job.status === 'closed' && <StatusBadge status="closed" />}
                </div>

                <h1 className={styles.title}>{job.title}</h1>

                <div className={styles.companyRow}>
                  <Building2 size={17} color="var(--accent-primary)" />
                  <span>{job.company_name}</span>
                </div>
              </div>

              {/* Bookmark & Share */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={handleShare}
                  className="btn btn-secondary btn-sm"
                  title="Copy link"
                >
                  {copiedLink ? <Check size={14} color="var(--accent-secondary)" /> : <Share2 size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleSaveJob(job.id)}
                  className={`btn ${saved ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                >
                  <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
                  <span>{saved ? t.jobs.saved : t.jobs.saveJob}</span>
                </button>
              </div>
            </div>

            {/* Meta Grid */}
            <div className={styles.metaGrid}>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>Compensation</span>
                <span className={styles.metaValue} style={{ color: 'var(--accent-primary)' }}>
                  {formatSalary()}
                </span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>
                  <MapPin size={14} color="var(--accent-primary)" /> {job.location}
                </span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>Openings</span>
                <span className={styles.metaValue}>
                  <Users size={14} color="var(--accent-primary)" /> {job.vacancies} {t.jobs.vacancies}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className={styles.contentSection}>
              <h3 className={styles.sectionHeading}>
                <Briefcase size={18} color="var(--accent-primary)" />
                <span>{t.jobDetail.aboutRole}</span>
              </h3>
              <p className={styles.descParagraph}>{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className={styles.contentSection}>
                <h3 className={styles.sectionHeading}>
                  <CheckCircle2 size={18} color="var(--accent-primary)" />
                  <span>{t.jobDetail.requirements}</span>
                </h3>
                <ul className={styles.bulletList}>
                  {job.requirements.map((req, i) => (
                    <li key={i} className={styles.bulletItem}>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className={styles.contentSection}>
                <h3 className={styles.sectionHeading}>
                  <Users size={18} color="var(--accent-primary)" />
                  <span>{t.jobDetail.benefits}</span>
                </h3>
                <ul className={styles.bulletList}>
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className={styles.bulletItem}>
                      <span style={{ color: 'var(--accent-secondary)', fontWeight: 700 }}>✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Sidebar Action Card */}
          <div className={styles.sidebarCard}>
            <div style={{ textAlign: 'center', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Offered Compensation
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {formatSalary()}
              </div>
            </div>

            {/* Application State & Buttons */}
            {applied ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'center',
                }}
              >
                <CheckCircle2 size={24} color="var(--accent-secondary)" style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  {t.jobDetail.alreadyAppliedMsg}
                </div>
                {application?.status && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Status: </span>
                    <StatusBadge status={application.status} />
                  </div>
                )}
              </div>
            ) : job.status === 'closed' ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}
              >
                {t.jobDetail.closedNotice}
              </div>
            ) : isEmployer ? (
              <div
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontSize: '0.825rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={16} color="var(--accent-primary)" />
                <span>{t.jobDetail.employerCannotApply}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApplyClick}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {t.jobs.applyNow}
              </button>
            )}

            {/* Direct Contact info */}
            {(job.contact_email || job.contact_phone) && (
              <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                  {t.jobDetail.employerContact}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.85rem' }}>
                  {job.contact_phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)' }}>
                      <Phone size={14} color="var(--accent-primary)" />
                      <span>{job.contact_phone}</span>
                    </div>
                  )}
                  {job.contact_email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} color="var(--accent-primary)" />
                      <span>{job.contact_email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
              Verified opportunity. No fees or deposit required.
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <ApplyModal
          job={job}
          onClose={() => setApplyModalOpen(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
