import React from 'react';
import { Bookmark } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import JobCard from '../../components/jobs/JobCard';
import EmptyState from '../../components/common/EmptyState';
import DashboardSidebar from '../../components/common/DashboardSidebar';
import styles from './SeekerDashboard.module.css';

export default function SavedJobs() {
  const { jobs, savedJobIds } = useJobs();
  const { t } = useLanguage();

  const savedJobsList = jobs.filter((j) => savedJobIds.has(j.id));

  return (
    <div className="page-wrapper">
      <div className={`container-wide ${styles.dashboardLayout}`}>
        <DashboardSidebar role="seeker" />

        <div className={styles.mainContent}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>
                {t.seeker.savedJobs} ({savedJobsList.length})
              </h1>
              <p className={styles.subtitle}>
                Opportunities you bookmarked for review and follow-up.
              </p>
            </div>
          </div>

          {savedJobsList.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No Saved Jobs Yet"
              description="When you find an interesting vacancy, bookmark it to revisit here anytime."
              actionLabel={t.seeker.exploreJobsBtn}
              actionLink="/jobs"
            />
          ) : (
            <div className="grid-2">
              {savedJobsList.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
