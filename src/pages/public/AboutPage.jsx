import React from 'react';
import { Globe, Users, Store, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StaticPages.module.css';

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <div className="page-wrapper">
      <div className={`container ${styles.staticContainer}`}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {language === 'te' ? 'వేకన్సీ గురించి' : 'About Vacansee'}
          </h1>
          <p className={styles.pageSubtitle}>
            {language === 'te'
              ? 'స్థానిక యువత, విద్యార్థులు మరియు చిన్న వ్యాపారాల మధ్య ఉన్న అంతరాన్ని పూడ్చే ఉద్యోగ వేదిక.'
              : 'Bridging local businesses, college students, freshers, and professionals through accessible, bilingual hiring.'}
          </p>
        </div>

        <div className={styles.contentBlock}>
          <h2>{language === 'te' ? 'మా లక్ష్యం' : 'Our Mission'}</h2>
          <p>
            Traditional employment portals cater heavily to multi-year corporate careers, leaving out the vital pulse of local communities:
            college students wanting weekend cafe shifts, freshers eager for entry-level tech and support roles, neighborhood retail shops, salons, and tutoring centers.
          </p>
          <p>
            <strong>Vacansee</strong> decentralizes hiring by providing an accessible, fast, and transparent platform that empowers both job seekers and local employers in their mother tongue and in English.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureTitle}>
                <Globe size={16} color="var(--accent-primary)" />
                <span>Bilingual Empowerment</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Full Telugu &amp; English support ensures that language is never a barrier to discovering fair work or publishing openings.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureTitle}>
                <Store size={16} color="var(--accent-primary)" />
                <span>Local Business Discovery</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Dedicated tags for supermarkets, salons, restaurants, and tutoring academies enable swift neighborhood recruitment.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureTitle}>
                <Users size={16} color="var(--accent-primary)" />
                <span>Student &amp; Fresher Focus</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Weekend jobs, flexible evening hours, and verified entry-level roles designed specifically for college schedules.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureTitle}>
                <CheckCircle2 size={16} color="var(--accent-secondary)" />
                <span>Transparent Status Tracking</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Job seekers clearly see whether their application is Under Review, Shortlisted, or Hired—no ghosting.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.contentBlock}>
          <h2>{language === 'te' ? 'ఆర్కిటెక్చర్ వివరాలు' : 'Technical Architecture'}</h2>
          <p>
            Vacansee is built with React 19, Vite, PostgreSQL with Row Level Security (RLS) policies, and Supabase Authentication. It employs a calm, warm light aesthetic with high-contrast typography, crisp surfaces, and semantic color tokens.
          </p>
        </div>
      </div>
    </div>
  );
}
