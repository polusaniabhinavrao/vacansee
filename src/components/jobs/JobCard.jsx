import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building, Bookmark, CheckCircle, Store, Globe2 } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import Badge from '../common/Badge';
import StatusBadge from '../common/StatusBadge';
import styles from './JobCard.module.css';

export default function JobCard({ job }) {
  const { toggleSaveJob, isJobSaved, hasApplied } = useJobs();
  const { t } = useLanguage();

  const saved = isJobSaved(job.id);
  const applied = hasApplied(job.id);

  // Format salary
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) {
      return 'Salary on Application';
    }
    const min = job.salary_min ? `₹${Number(job.salary_min).toLocaleString('en-IN')}` : '';
    const max = job.salary_max ? `₹${Number(job.salary_max).toLocaleString('en-IN')}` : '';
    const period = job.salary_period ? `/${t.jobs[`per${job.salary_period.charAt(0).toUpperCase() + job.salary_period.slice(1)}`] || job.salary_period}` : '';

    if (min && max) return `${min} – ${max} ${period}`;
    if (min) return `From ${min} ${period}`;
    return `Up to ${max} ${period}`;
  };

  const categoryLabel = t.categories[job.category] || job.category;
  const typeLabel = t.employmentTypes[job.employment_type] || job.employment_type;

  return (
    <div className={styles.card}>
      <div>
        {/* Top Header */}
        <div className={styles.cardHeader}>
          <div className={styles.companyInfo}>
            <div className={styles.companyIcon}>
              {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div>
              <div className={styles.companyName}>{job.company_name || 'Employer'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                {job.is_local_business ? (
                  <Badge variant="local" size="sm">
                    <Store size={11} /> Local Business
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">
                    <Building size={11} /> Corporate
                  </Badge>
                )}
                {job.status === 'closed' && <StatusBadge status="closed" />}
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            className={`${styles.saveButton} ${saved ? styles.saveButtonActive : ''}`}
            onClick={(e) => {
              e.preventDefault();
              toggleSaveJob(job.id);
            }}
            title={saved ? t.jobs.saved : t.jobs.saveJob}
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title */}
        <h3 className={styles.jobTitle}>
          <Link to={`/jobs/${job.id}`} className={styles.jobTitleLink}>
            {job.title}
          </Link>
        </h3>

        {/* Meta details */}
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <MapPin size={13} color="var(--accent-primary)" />
            {job.location}
          </span>
          {job.is_remote && (
            <span className={styles.metaItem}>
              <Globe2 size={13} color="var(--accent-secondary)" />
              Remote
            </span>
          )}
          {job.vacancies > 1 && (
            <span className={styles.metaItem}>
              {job.vacancies} openings
            </span>
          )}
        </div>

        {/* Badges */}
        <div className={styles.badgesRow}>
          <Badge variant="primary">{typeLabel}</Badge>
          <Badge variant="neutral">{categoryLabel}</Badge>
        </div>

        {/* Description */}
        <p className={styles.descriptionSnippet}>
          {job.description}
        </p>
      </div>

      {/* Card Footer */}
      <div className={styles.cardFooter}>
        <div className={styles.salary}>{formatSalary()}</div>

        <div className={styles.actions}>
          {applied ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.775rem',
                fontWeight: 600,
                color: 'var(--accent-secondary)',
                backgroundColor: 'var(--accent-secondary-subtle)',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--accent-secondary-border)',
              }}
            >
              <CheckCircle size={13} />
              {t.jobs.appliedAlready}
            </span>
          ) : (
            <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
              {t.jobs.viewDetails}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
