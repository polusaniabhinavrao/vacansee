import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  MapPin,
  Building2,
  ArrowRight,
  Bookmark,
  Store,
  Layers,
  ThumbsUp,
  Info,
  AlertTriangle,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ApplyModal from '../../components/jobs/ApplyModal';
import GuidedQuestionnaire from '../../components/discovery/GuidedQuestionnaire';
import { rankJobsForCandidate } from '../../utils/matchingEngine';
import { getSeekerPreferences, saveSeekerPreferences } from '../../services/preferencesService';
import styles from './PersonalizedJobs.module.css';

export default function PersonalizedJobsPage() {
  const { jobs, loading: jobsLoading, isJobSaved, toggleSaveJob, hasApplied } = useJobs();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState(null);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [isEditingQuestionnaire, setIsEditingQuestionnaire] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);

  // Load saved preferences on mount or auth change
  useEffect(() => {
    let isMounted = true;

    async function loadUserPreferences() {
      setLoadingPreferences(true);
      try {
        const userId = user?.id || 'guest';
        const saved = await getSeekerPreferences(userId);

        if (isMounted) {
          if (saved) {
            setPreferences(saved);
            setIsEditingQuestionnaire(false);
          } else {
            // First time visitor: show guided questionnaire
            setIsEditingQuestionnaire(true);
          }
        }
      } catch (err) {
        console.error('Error loading preferences:', err);
        if (isMounted) setIsEditingQuestionnaire(true);
      } finally {
        if (isMounted) setLoadingPreferences(false);
      }
    }

    loadUserPreferences();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle questionnaire completion
  const handleSaveQuestionnaire = async (completedAnswers) => {
    try {
      const userId = user?.id || 'guest';
      const saved = await saveSeekerPreferences(userId, completedAnswers);
      setPreferences(saved);
      setIsEditingQuestionnaire(false);
    } catch (err) {
      console.error('Failed to save questionnaire answers:', err);
    }
  };

  // Run deterministic matching engine
  const { qualifiedMatches, unmetRequirementMatches } = useMemo(() => {
    if (!preferences || !jobs || jobs.length === 0) {
      return { qualifiedMatches: [], unmetRequirementMatches: [] };
    }
    return rankJobsForCandidate(jobs, preferences);
  }, [jobs, preferences]);

  if (loadingPreferences || jobsLoading) {
    return (
      <div className="page-wrapper" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <LoadingSpinner message="Loading job discovery system..." />
      </div>
    );
  }

  // If user has not completed questionnaire, show guided multi-step questionnaire
  if (isEditingQuestionnaire) {
    return (
      <div className="page-wrapper" style={{ minHeight: '80vh', padding: '2rem 1rem' }}>
        <GuidedQuestionnaire
          initialData={preferences}
          onSubmit={handleSaveQuestionnaire}
          onCancel={preferences ? () => setIsEditingQuestionnaire(false) : () => navigate('/jobs')}
        />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Redesigned Results Header */}
      <div className={styles.headerSection}>
        <div className="container-wide">
          <div className={styles.badgeWrapper}>
            <span className={styles.sparkleBadge}>
              <Sparkles size={14} color="var(--accent-recommendation)" />
              <span>Deterministic Match Engine</span>
            </span>
          </div>

          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.headerTitle}>Your job matches</h1>
              <p className={styles.headerSubtitle}>
                Ranked deterministically using verified qualification requirements, skill overlap, employment type, location, and shift compatibility.
              </p>
            </div>

            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={() => setIsEditingQuestionnaire(true)}
                className="btn btn-secondary btn-sm"
              >
                <SlidersHorizontal size={14} />
                <span>Edit Preferences</span>
              </button>
              <Link to="/jobs" className="btn btn-outline-primary btn-sm">
                <Search size={14} />
                <span>Search All Jobs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container-wide" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        {/* Active Preference Summary Bar */}
        {preferences && (
          <div className={styles.preferenceBar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Saved Criteria:
              </span>

              {preferences.education_level && (
                <span className={styles.criteriaChip}>
                  <GraduationCap size={12} color="var(--accent-primary)" />
                  <span>
                    {preferences.education_level}
                    {preferences.education_field ? ` (${preferences.education_field})` : ''}
                  </span>
                </span>
              )}

              {preferences.preferred_city && (
                <span className={styles.criteriaChip}>
                  <MapPin size={12} color="var(--accent-primary)" />
                  <span>{preferences.preferred_city}</span>
                </span>
              )}

              {Array.isArray(preferences.skills) && preferences.skills.length > 0 && (
                <span className={styles.criteriaChip}>
                  <Sparkles size={12} color="var(--accent-recommendation)" />
                  <span>{preferences.skills.length} skills tracked</span>
                </span>
              )}

              {Array.isArray(preferences.work_types) && preferences.work_types.length > 0 && (
                <span className={styles.criteriaChip}>
                  <Layers size={12} />
                  <span>{preferences.work_types.join(', ')}</span>
                </span>
              )}

              {preferences.experience_level && (
                <span className={styles.criteriaChip}>
                  <Briefcase size={12} />
                  <span>{preferences.experience_level.replace('_', ' ')}</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEditingQuestionnaire(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-recommendation)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Refine Criteria
            </button>
          </div>
        )}

        {/* Results grid */}
        {qualifiedMatches.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="No Matching Vacancies Found"
            description="No active listings currently match your combined qualifications and constraints. Try relaxing your location, salary, or schedule preferences."
            actionLabel="Adjust Questionnaire Answers"
            onAction={() => setIsEditingQuestionnaire(true)}
          />
        ) : (
          <div className={styles.recommendationsGrid}>
            {qualifiedMatches.map((match) => {
              const { job, matchScore, positiveReasons, missingInformation } = match;
              const saved = isJobSaved(job.id);
              const applied = hasApplied(job.id);

              return (
                <div key={job.id} className={styles.matchCard}>
                  {/* Match Score Badge Top Row */}
                  <div className={styles.cardTopRow}>
                    <div className={styles.matchScoreBadge}>
                      <Sparkles size={13} color="var(--accent-recommendation)" />
                      <span>{matchScore}% Match</span>
                    </div>

                    <button
                      type="button"
                      className={styles.saveBtn}
                      onClick={() => toggleSaveJob(job.id)}
                      title={saved ? t.jobs.saved : t.jobs.saveJob}
                    >
                      <Bookmark
                        size={15}
                        fill={saved ? 'var(--accent-primary)' : 'none'}
                        color={saved ? 'var(--accent-primary)' : 'var(--text-muted)'}
                      />
                    </button>
                  </div>

                  {/* Company & Title */}
                  <div style={{ marginBottom: '0.85rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {job.company_name}
                      </span>
                      {job.is_local_business ? (
                        <Badge variant="local" size="sm">
                          <Store size={10} /> Local Business
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          <Building2 size={10} /> Corporate
                        </Badge>
                      )}
                    </div>

                    <h3 className={styles.jobTitle}>
                      <Link to={`/jobs/${job.id}`} className={styles.jobTitleLink}>
                        {job.title}
                      </Link>
                    </h3>
                  </div>

                  {/* Metadata Row */}
                  <div className={styles.metaRow}>
                    <span className={styles.metaItem}>
                      <MapPin size={13} color="var(--accent-primary)" />
                      {job.location}
                    </span>
                    <span className={styles.metaItem}>
                      {t.employmentTypes[job.employment_type] || job.employment_type}
                    </span>
                    {job.salary_min && (
                      <span
                        className={styles.metaItem}
                        style={{ fontWeight: 600, color: 'var(--text-primary)' }}
                      >
                        ₹{Number(job.salary_min).toLocaleString('en-IN')}
                        {job.salary_max
                          ? ` – ₹${Number(job.salary_max).toLocaleString('en-IN')}`
                          : ''}
                      </span>
                    )}
                  </div>

                  {/* Why this matches section (derived from actual fields) */}
                  {positiveReasons && positiveReasons.length > 0 && (
                    <div className={styles.matchExplanationBox}>
                      <div className={styles.matchExplanationHeader}>
                        <ThumbsUp size={12} color="var(--accent-recommendation)" />
                        <span>Why this fits you:</span>
                      </div>
                      <div className={styles.reasonsList}>
                        {positiveReasons.map((reason, idx) => (
                          <span key={idx} className={styles.reasonTag}>
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Limitations & Missing Information (Honest reporting) */}
                  {missingInformation && missingInformation.length > 0 && (
                    <div className={styles.missingInfoBox}>
                      <span className={styles.missingInfoTag}>
                        <Info size={11} />
                        <span>Listing limitations: {missingInformation.slice(0, 2).join(' • ')}</span>
                      </span>
                    </div>
                  )}

                  {/* Card Action Footer */}
                  <div className={styles.cardFooter}>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.8125rem' }}
                    >
                      <span>View Details</span>
                      <ArrowRight size={13} />
                    </Link>

                    {applied ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: 'var(--status-success)',
                        }}
                      >
                        <CheckCircle2 size={14} /> Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setApplyingJob(job)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.8125rem' }}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Unmet Mandatory Prerequisites Section */}
        {unmetRequirementMatches.length > 0 && (
          <div className={styles.unmetSection}>
            <h2 className={styles.unmetHeading}>Opportunities with Unmet Prerequisites</h2>
            <p className={styles.unmetSubtext}>
              These listings do not match your current education stage or experience level based on strict employer requirements.
            </p>

            <div>
              {unmetRequirementMatches.map(({ job, unmetReason }) => (
                <div key={job.id} className={styles.unmetCard}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span className={styles.unmetBadge}>
                        <AlertTriangle size={11} /> Unmet Prerequisite
                      </span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {job.company_name} • {job.location}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
                      {job.title}
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: 'var(--status-rejected-text)', margin: 0 }}>
                      Reason: {unmetReason}
                    </p>
                  </div>

                  <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
                    View Requirements
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={() => setApplyingJob(null)}
        />
      )}
    </div>
  );
}
