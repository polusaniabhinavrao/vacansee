import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Briefcase, Store, Sparkles } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import styles from './JobsPage.module.css';

export default function JobsPage({ isLocalPage = false }) {
  const { jobs, loading } = useJobs();
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const isLocalMode = isLocalPage || location.pathname === '/local-jobs' || searchParams.get('local') === 'true';

  // Read URL query params
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialType = searchParams.get('type') || 'all';
  const initialLocal = isLocalMode || searchParams.get('local') === 'true';
  const initialRemote = searchParams.get('remote') === 'true';

  const [filters, setFilters] = useState({
    search: initialSearch,
    location: initialLocation,
    category: initialCategory,
    employmentType: initialType,
    localBusinessOnly: initialLocal,
    remoteOnly: initialRemote,
  });

  // Keep state synced if URL changes
  useEffect(() => {
    const isLocalNow = isLocalPage || location.pathname === '/local-jobs' || searchParams.get('local') === 'true';
    setFilters({
      search: searchParams.get('search') || '',
      location: searchParams.get('location') || '',
      category: searchParams.get('category') || 'all',
      employmentType: searchParams.get('type') || 'all',
      localBusinessOnly: isLocalNow || searchParams.get('local') === 'true',
      remoteOnly: searchParams.get('remote') === 'true',
    });
  }, [searchParams, isLocalPage, location.pathname]);

  // Handle filter reset
  const handleResetFilters = () => {
    const empty = {
      search: '',
      location: '',
      category: 'all',
      employmentType: 'all',
      localBusinessOnly: isLocalMode,
      remoteOnly: false,
    };
    setFilters(empty);
    setSearchParams(isLocalMode ? { local: 'true' } : {});
  };

  // Filtered jobs calculation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Must be active
      if (job.status !== 'active') return false;

      // Local Business Only
      if ((isLocalMode || filters.localBusinessOnly) && !job.is_local_business) {
        return false;
      }

      // Search keyword
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const titleMatch = job.title?.toLowerCase().includes(query);
        const compMatch = job.company_name?.toLowerCase().includes(query);
        const descMatch = job.description?.toLowerCase().includes(query);
        const reqMatch = Array.isArray(job.requirements) && job.requirements.some((r) => r.toLowerCase().includes(query));
        if (!titleMatch && !compMatch && !descMatch && !reqMatch) return false;
      }

      // Location
      if (filters.location.trim()) {
        const locQuery = filters.location.toLowerCase();
        if (!job.location?.toLowerCase().includes(locQuery)) return false;
      }

      // Category
      if (filters.category !== 'all') {
        if (job.category !== filters.category) return false;
      }

      // Employment Type
      if (filters.employmentType !== 'all') {
        if (job.employment_type !== filters.employmentType) return false;
      }

      // Remote Only
      if (filters.remoteOnly && !job.is_remote) {
        return false;
      }

      return true;
    });
  }, [jobs, filters, isLocalMode]);

  // Title and subtitle depending on page mode
  const pageTitle = isLocalMode
    ? (language === 'te' ? 'స్థానిక వ్యాపార ఉద్యోగాలు' : 'Local Business Opportunities')
    : (language === 'te' ? 'అందుబాటులో ఉన్న ఉద్యోగ ఖాళీలు' : 'Explore All Opportunities');

  const pageSubtitle = isLocalMode
    ? (language === 'te'
        ? 'దుకాణాలు, హోటళ్లు, రెస్టారెంట్లు, సలూన్లు మరియు ట్యూషన్ల వద్ద అందుబాటులో ఉన్న నమ్మకమైన స్థానిక ఉద్యోగాలు.'
        : 'Discover neighborhood vacancies across local shops, restaurants, salons, cafes, and tutoring academies.')
    : (language === 'te'
        ? 'తెలంగాణ మరియు ఆంధ్రప్రదేశ్‌లోని పారదర్శక ఉద్యోగ అవకాశాలు.'
        : 'Browse verified vacancies across technology, corporate, retail, and local enterprises.');

  return (
    <div className="page-wrapper">
      {/* Light Header Section */}
      <div className={styles.headerSection}>
        <div className="container-wide">
          <div className={styles.headerBadge}>
            {isLocalMode ? (
              <>
                <Store size={14} color="var(--accent-primary)" />
                <span>{language === 'te' ? 'స్థానిక ఉద్యోగ వేదిక' : 'Local Employment Marketplace'}</span>
              </>
            ) : (
              <>
                <Briefcase size={14} color="var(--accent-primary)" />
                <span>{language === 'te' ? 'ఉద్యోగ అన్వేషణ' : 'Verified Vacancies Feed'}</span>
              </>
            )}
          </div>
          <h1 className={styles.headerTitle}>{pageTitle}</h1>
          <p className={styles.headerSubtitle}>{pageSubtitle}</p>
        </div>
      </div>

      <div className="container-wide">
        <div className={styles.jobsLayout}>
          {/* Filters Sidebar */}
          <JobFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />

          {/* Results Main Area */}
          <div className={styles.resultsArea}>
            <div className={styles.resultsHeader}>
              <div className={styles.resultsCount}>
                <span className={styles.countNum}>{filteredJobs.length}</span>{' '}
                <span className={styles.countLabel}>
                  {filteredJobs.length === 1 ? 'opportunity available' : 'opportunities available'}
                </span>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Searching verified vacancies..." />
            ) : filteredJobs.length === 0 ? (
              <EmptyState
                icon={isLocalMode ? Store : Briefcase}
                title={t.jobs.noResultsTitle}
                description={t.jobs.noResultsDesc}
                actionLabel={t.jobs.clearFilters}
                onAction={handleResetFilters}
              />
            ) : (
              <div className={styles.jobsGrid}>
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
