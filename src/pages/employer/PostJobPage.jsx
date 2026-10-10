import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Store,
  Save,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import styles from './EmployerDashboard.module.css';

export default function PostJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { getJobById, createJob, updateJob } = useJobs();
  const { t } = useLanguage();

  const isEditing = Boolean(id);
  const existingJob = isEditing ? getJobById(id) : null;

  const [formData, setFormData] = useState({
    title: '',
    company_name: profile?.company_name || '',
    category: 'software',
    employment_type: 'full_time',
    location: profile?.location || '',
    is_remote: false,
    is_local_business: false,
    salary_min: '',
    salary_max: '',
    salary_period: 'monthly',
    vacancies: 1,
    description: '',
    requirements: '',
    benefits: '',
    contact_email: user?.email || '',
    contact_phone: profile?.phone || '',
    status: 'active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && existingJob) {
      setFormData({
        title: existingJob.title || '',
        company_name: existingJob.company_name || '',
        category: existingJob.category || 'software',
        employment_type: existingJob.employment_type || 'full_time',
        location: existingJob.location || '',
        is_remote: Boolean(existingJob.is_remote),
        is_local_business: Boolean(existingJob.is_local_business),
        salary_min: existingJob.salary_min || '',
        salary_max: existingJob.salary_max || '',
        salary_period: existingJob.salary_period || 'monthly',
        vacancies: existingJob.vacancies || 1,
        description: existingJob.description || '',
        requirements: Array.isArray(existingJob.requirements)
          ? existingJob.requirements.join('\n')
          : existingJob.requirements || '',
        benefits: Array.isArray(existingJob.benefits)
          ? existingJob.benefits.join('\n')
          : existingJob.benefits || '',
        contact_email: existingJob.contact_email || user?.email || '',
        contact_phone: existingJob.contact_phone || profile?.phone || '',
        status: existingJob.status || 'active',
      });
    }
  }, [isEditing, existingJob, user, profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isOwner = !isEditing || !existingJob || !user || String(existingJob.employer_id) === String(user.id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isEditing && existingJob && String(existingJob.employer_id) !== String(user?.id)) {
      setError("Unauthorized: You do not have permission to edit another employer's posting.");
      return;
    }

    setLoading(true);

    try {
      if (!formData.title.trim()) throw new Error('Job title is required');
      if (!formData.company_name.trim()) throw new Error('Company / Business name is required');
      if (!formData.location.trim()) throw new Error('Location is required');
      if (!formData.description.trim()) throw new Error('Job description is required');

      if (isEditing) {
        await updateJob(id, formData);
      } else {
        await createJob(formData);
      }

      navigate('/employer/jobs');
    } catch (err) {
      setError(err.message || 'Failed to save job vacancy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="employer" />

        <div className={styles.mainContent}>
          {!isOwner ? (
            <div style={{ padding: '2rem 1rem' }}>
              <div
                style={{
                  backgroundColor: 'var(--status-rejected-bg)',
                  border: '1px solid var(--status-rejected-border)',
                  color: 'var(--status-rejected-text)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <AlertCircle size={18} />
                <span>Unauthorized: You cannot edit a job posting that belongs to another employer.</span>
              </div>
              <Link to="/employer/jobs" className="btn btn-secondary btn-sm">
                Return to My Job Postings
              </Link>
            </div>
          ) : (
            <>
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

            <h1 className={styles.title}>
              {isEditing ? t.jobForm.editTitle : t.jobForm.createTitle}
            </h1>
            <p className={styles.subtitle}>
              {t.jobForm.subtitle}
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-rejected-bg)',
                border: '1px solid var(--status-rejected-border)',
                color: 'var(--status-rejected-text)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
            {/* Job Title & Company */}
            <div className="form-group">
              <label className="form-label">{t.jobForm.titleLabel} *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder={t.jobForm.titlePlaceholder}
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t.jobForm.companyLabel} *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. The Roastery Cafe / Deccan Tech"
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.jobForm.categoryLabel} *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                >
                  <option value="software">{t.categories.software}</option>
                  <option value="hospitality">{t.categories.hospitality}</option>
                  <option value="retail">{t.categories.retail}</option>
                  <option value="education">{t.categories.education}</option>
                  <option value="salon">{t.categories.salon}</option>
                  <option value="customerSupport">{t.categories.customerSupport}</option>
                  <option value="healthcare">{t.categories.healthcare}</option>
                  <option value="logistics">{t.categories.logistics}</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t.jobForm.typeLabel} *</label>
                <select
                  className="form-select"
                  value={formData.employment_type}
                  onChange={(e) => handleChange('employment_type', e.target.value)}
                >
                  <option value="full_time">{t.employmentTypes.full_time}</option>
                  <option value="part_time">{t.employmentTypes.part_time}</option>
                  <option value="weekend">{t.employmentTypes.weekend}</option>
                  <option value="internship">{t.employmentTypes.internship}</option>
                  <option value="contract">{t.employmentTypes.contract}</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t.jobForm.locationLabel} *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder={t.jobForm.locationPlaceholder}
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* Business Nature Toggles */}
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-medium)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', marginBottom: '0.55rem', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={formData.is_local_business}
                  onChange={(e) => handleChange('is_local_business', e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--accent-primary)' }}
                />
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Store size={14} color="var(--accent-primary)" />
                  {t.jobForm.isLocalBusinessLabel}
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={formData.is_remote}
                  onChange={(e) => handleChange('is_remote', e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: 'var(--accent-primary)' }}
                />
                <span>{t.jobForm.isRemoteLabel}</span>
              </label>
            </div>

            {/* Salary Range */}
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">{t.jobForm.salaryMinLabel}</label>
                <input
                  type="number"
                  placeholder="10000"
                  className="form-input"
                  value={formData.salary_min}
                  onChange={(e) => handleChange('salary_min', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.jobForm.salaryMaxLabel}</label>
                <input
                  type="number"
                  placeholder="20000"
                  className="form-input"
                  value={formData.salary_max}
                  onChange={(e) => handleChange('salary_max', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.jobForm.salaryPeriodLabel}</label>
                <select
                  className="form-select"
                  value={formData.salary_period}
                  onChange={(e) => handleChange('salary_period', e.target.value)}
                >
                  <option value="monthly">{t.jobs.perMonth}</option>
                  <option value="hourly">{t.jobs.perHour}</option>
                  <option value="daily">{t.jobs.perDay}</option>
                  <option value="yearly">{t.jobs.perYear}</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t.jobForm.vacanciesLabel} *</label>
                <input
                  type="number"
                  min="1"
                  required
                  className="form-input"
                  value={formData.vacancies}
                  onChange={(e) => handleChange('vacancies', e.target.value)}
                />
              </div>

              {isEditing && (
                <div className="form-group">
                  <label className="form-label">{t.jobForm.statusLabel}</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="active">{t.status.active}</option>
                    <option value="closed">{t.status.closed}</option>
                  </select>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">{t.jobForm.descLabel} *</label>
              <textarea
                rows={4}
                required
                className="form-textarea"
                placeholder={t.jobForm.descPlaceholder}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            {/* Requirements & Benefits */}
            <div className="form-group">
              <label className="form-label">{t.jobForm.reqsLabel}</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder={t.jobForm.reqsPlaceholder}
                value={formData.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t.jobForm.benefitsLabel}</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder={t.jobForm.benefitsPlaceholder}
                value={formData.benefits}
                onChange={(e) => handleChange('benefits', e.target.value)}
              />
            </div>

            {/* Contact Information */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">{t.jobForm.contactEmailLabel}</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contact@company.com"
                  value={formData.contact_email}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t.jobForm.contactPhoneLabel}</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98480..."
                  value={formData.contact_phone}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Link to="/employer/jobs" className="btn btn-secondary">
                {t.jobForm.cancel}
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Save size={15} />
                <span>
                  {loading ? t.common.loading : (isEditing ? t.jobForm.submitUpdate : t.jobForm.submitCreate)}
                </span>
              </button>
            </div>
            </form>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
