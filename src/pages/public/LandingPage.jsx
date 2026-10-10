import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  Code,
  Clock,
  Coffee,
  ShoppingBag,
  GraduationCap,
  Briefcase,
  Store,
  ArrowUpRight,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import { useLanguage } from '../../context/LanguageContext';
import JobCard from '../../components/jobs/JobCard';
import Badge from '../../components/common/Badge';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const { jobs } = useJobs();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const handleQuickPill = (keyword) => {
    navigate(`/jobs?search=${encodeURIComponent(keyword)}`);
  };

  // Top active jobs for discovery
  const activeJobs = jobs.filter((j) => j.status === 'active');
  const previewJobs = activeJobs.slice(0, 3);
  const featuredJobs = activeJobs.slice(0, 6);

  const categories = [
    { id: 'software', num: '01', title: 'Software & Technology', telugu: 'సాఫ్ట్‌వేర్ & ఐటీ', icon: Code, desc: 'Junior dev, React, QA, Support' },
    { id: 'hospitality', num: '02', title: 'Hotels & Restaurants', telugu: 'హోటల్ & కేఫ్', icon: Coffee, desc: 'Baristas, shift captains, front desk' },
    { id: 'retail', num: '03', title: 'Retail & Shops', telugu: 'రిటైల్ & సూపర్ మార్కెట్', icon: ShoppingBag, desc: 'Supermarkets, cashiers, store assistants' },
    { id: 'education', num: '04', title: 'Teaching & Tutoring', telugu: 'విద్య & ట్యూషన్లు', icon: GraduationCap, desc: 'Math, Science, foundational coaching' },
    { id: 'part_time', typeParam: 'part_time', num: '05', title: 'Part-time Roles', telugu: 'పార్ట్ టైమ్ ఉద్యోగాలు', icon: Clock, desc: 'Evening hours, student-friendly shifts' },
    { id: 'internship', typeParam: 'internship', num: '06', title: 'Internships', telugu: 'ఇంటర్న్‌షిప్స్', icon: Briefcase, desc: 'Fresher learning pathways & stipends' },
  ];

  return (
    <div className="page-wrapper">
      {/* Editorial Hero Section (Split Layout) */}
      <section className={styles.heroSection}>
        <div className="container-wide">
          <div className={styles.heroSplitGrid}>
            {/* Left: Confident Editorial Copy */}
            <div className={styles.heroLeft}>
              <div className={styles.heroMicroLabel}>
                <span>Vacansee Employment Platform</span>
                <span>•</span>
                <span>{language === 'te' ? 'తెలుగు & English' : 'Bilingual Discovery'}</span>
              </div>

              <h1 className={styles.heroTitle}>
                {language === 'te' ? (
                  <>
                    మీ జీవితానికి తగిన <br />
                    <span style={{ color: 'var(--accent-primary)' }}>ఉద్యోగావకాశాలు.</span>
                  </>
                ) : (
                  <>
                    Work that fits <br />
                    <span style={{ color: 'var(--accent-primary)' }}>your life.</span>
                  </>
                )}
              </h1>

              <p className={styles.heroSubtitle}>
                {language === 'te'
                  ? 'కళాశాల విద్యార్థుల పార్ట్-టైమ్ ఉద్యోగాల నుండి మీ తదుపరి కెరీర్ అడుగు వరకు—మీ సమయానికి, మీ ప్రాంతానికి సరిపోయే ఉద్యోగాలను కనుగొనండి.'
                  : 'From your first part-time job to your next career move, discover opportunities that meet you where you are.'}
              </p>

              <div className={styles.heroCtas}>
                <Link to="/jobs" className="btn btn-primary btn-lg">
                  <span>{language === 'te' ? 'ఉద్యోగాలు చూడండి' : 'Search Jobs'}</span>
                  <ArrowRight size={16} />
                </Link>

                <Link to="/recommendations" className="btn btn-secondary btn-lg" style={{ border: '1px solid var(--accent-recommendation-border)' }}>
                  <Sparkles size={16} color="var(--accent-recommendation)" />
                  <span style={{ color: 'var(--text-primary)' }}>
                    {language === 'te' ? 'నాకు సరిపోయే ఉద్యోగాలు' : 'Find Jobs That Fit Me'}
                  </span>
                </Link>

                <Link to="/employer/jobs/new" className="btn btn-ghost btn-lg">
                  <span>{language === 'te' ? 'ఉద్యోగం ప్రకటించండి' : 'For Employers →'}</span>
                </Link>
              </div>

              <div className={styles.quickPills}>
                <span style={{ color: 'var(--text-muted)' }}>Popular Searches:</span>
                <button type="button" className={styles.pill} onClick={() => handleQuickPill('Weekend')}>
                  Weekend Shifts
                </button>
                <button type="button" className={styles.pill} onClick={() => handleQuickPill('Barista')}>
                  Cafe Barista
                </button>
                <button type="button" className={styles.pill} onClick={() => handleQuickPill('Tutor')}>
                  Evening Tutor
                </button>
                <button type="button" className={styles.pill} onClick={() => handleQuickPill('React')}>
                  Junior React
                </button>
              </div>
            </div>

            {/* Right: Carefully Composed Job Discovery Visual */}
            <div className={styles.heroVisual}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Live Marketplace Feed
                </span>
                <Link to="/jobs" style={{ fontSize: '0.775rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  View All ({activeJobs.length}) →
                </Link>
              </div>

              {previewJobs.map((item, idx) => (
                <div
                  key={item.id}
                  className={`${styles.discoveryCard} ${idx === 0 ? styles.discoveryCardActive : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                        {item.company_name}
                      </span>
                      {item.is_local_business ? (
                        <Badge variant="local" size="sm">Local Store</Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">Tech</Badge>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.location}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                    <Link to={`/jobs/${item.id}`} style={{ color: 'inherit' }}>
                      {item.title}
                    </Link>
                  </h4>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {item.salary_min && item.salary_max
                        ? `₹${Number(item.salary_min).toLocaleString('en-IN')} – ₹${Number(item.salary_max).toLocaleString('en-IN')}`
                        : 'Compensation Disclosed'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {t.employmentTypes[item.employment_type] || item.employment_type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Usable Job Search Section */}
      <section className={styles.searchSection}>
        <div className="container-wide">
          <form onSubmit={handleSearchSubmit} className={styles.searchBox}>
            <div className={styles.searchInputWrapper}>
              <Search size={16} color="var(--accent-primary)" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t.hero.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className={styles.searchInputWrapper}>
              <MapPin size={16} color="var(--accent-primary)" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder={t.hero.locationPlaceholder}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.6rem' }}>
              <span>Search Opportunities</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </section>

      {/* Core Employment Pathways Entry Points (Internships, Part-Time, Full-Time, Local) */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-medium)' }}>
        <div className="container-wide">
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Target Employment Pathways
              </h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Direct portals tailored to student shifts, local commerce, and full-time hiring.
              </p>
            </div>
          </div>

          <div className="grid-4">
            <Link
              to="/jobs?type=internship"
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textDecoration: 'none', transition: 'all var(--transition-fast)' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-info-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-info)' }}>
                <Briefcase size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>Internships</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Entry-level roles, stipends, and real project experience for college students.
              </p>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-info)', marginTop: 'auto' }}>
                Explore Internships →
              </span>
            </Link>

            <Link
              to="/jobs?type=part_time"
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textDecoration: 'none', transition: 'all var(--transition-fast)' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <Clock size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>Part-Time Jobs</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Flexible evening and weekend shifts structured around college hours.
              </p>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: 'auto' }}>
                Explore Part-Time →
              </span>
            </Link>

            <Link
              to="/jobs?type=full_time"
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textDecoration: 'none', transition: 'all var(--transition-fast)' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-success)' }}>
                <Building2 size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>Full-Time Roles</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Graduates, freshers, and experienced career positions with verified compensation.
              </p>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--status-success)', marginTop: 'auto' }}>
                Explore Full-Time →
              </span>
            </Link>

            <Link
              to="/local-jobs"
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', textDecoration: 'none', transition: 'all var(--transition-fast)', border: '1px solid var(--accent-primary-border)', backgroundColor: '#FDFAF6' }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-sm)', backgroundColor: '#F7EBDD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#966025' }}>
                <Store size={20} />
              </div>
              <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--text-primary)' }}>Local Jobs</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
                Shops, cafes, salons, supermarkets, and neighborhood academies near you.
              </p>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', marginTop: 'auto' }}>
                Browse Local Jobs →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Personalized Match Callout Feature */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#F8F5FD', borderBottom: '1px solid rgba(105, 65, 198, 0.2)' }}>
        <div className="container-wide">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.2rem 0.55rem', borderRadius: 'var(--radius-full)', backgroundColor: '#FFFFFF', border: '1px solid var(--accent-recommendation-border)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-recommendation)', marginBottom: '0.65rem' }}>
                <Sparkles size={12} color="var(--accent-recommendation)" />
                <span>Personalized Match Engine</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--text-primary)' }}>
                Find Work That Fits You
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                Complete our 6-step guided qualification questionnaire. Our deterministic matching engine scores and ranks live vacancies against your verified qualifications, skills, and shift availability.
              </p>
            </div>

            <Link
              to="/recommendations"
              className="btn btn-primary btn-lg"
              style={{ backgroundColor: 'var(--accent-recommendation)', borderColor: 'var(--accent-recommendation)' }}
            >
              <Sparkles size={16} />
              <span>Find Work That Fits You</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Employment Categories */}
      <section className={styles.section}>
        <div className="container-wide">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                {language === 'te' ? 'ఉద్యోగ విభాగాలు' : 'Curated Sectors'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {language === 'te'
                  ? 'మీ ఆసక్తి మరియు స్థానిక నైపుణ్యాలకు తగిన ఉద్యోగ రంగాన్ని ఎంచుకోండి.'
                  : 'Tailored pathways across both neighborhood enterprises and modern companies.'}
              </p>
            </div>
          </div>

          <div className={styles.categoryGrid}>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const linkUrl = cat.typeParam
                ? `/jobs?type=${cat.typeParam}`
                : `/jobs?category=${cat.id}`;
              return (
                <Link key={cat.num} to={linkUrl} className={styles.categoryItem}>
                  <div className={styles.categoryTop}>
                    <span className={styles.categoryIndex}>{cat.num}</span>
                    <Icon size={18} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <div className={styles.categoryName}>
                      {language === 'te' ? cat.telugu : cat.title}
                    </div>
                    <div className={styles.categoryMeta}>{cat.desc}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className={styles.section}>
        <div className="container-wide">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                {language === 'te' ? 'తాజా అవకాశాలు' : 'Featured Opportunities'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {language === 'te'
                  ? 'ధృవీకరించబడిన ఖాళీలు మరియు త్వరిత దరఖాస్తు అవకాశాలు.'
                  : 'Active vacancies from verified employers across Hyderabad, Vijayawada, and beyond.'}
              </p>
            </div>

            <Link
              to="/jobs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
              }}
            >
              <span>View All Listings</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="grid-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* How Vacansee Works */}
      <section className={styles.section}>
        <div className="container-wide">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>
                {language === 'te' ? 'వేకన్సీ ఎలా పనిచేస్తుంది?' : 'How Vacansee Works'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {language === 'te'
                  ? 'సంక్లిష్టమైన ఫారాలు లేదా మధ్యవర్తులు లేకుండా నేరుగా నియామకం.'
                  : 'A transparent, respectful hiring experience built for real community needs.'}
              </p>
            </div>
          </div>

          <div className={styles.howGrid}>
            <div className={styles.howStep}>
              <span className={styles.stepNum}>01</span>
              <h3 className={styles.stepTitle}>
                {language === 'te' ? 'అవకాశాలను అన్వేషించండి' : 'Discover Opportunities'}
              </h3>
              <p className={styles.stepDesc}>
                {language === 'te'
                  ? 'మీ సమీపంలోని స్థానిక దుకాణాలు, రెస్టారెంట్లు, ట్యూషన్లు లేదా ఐటీ స్టార్టప్ ఉద్యోగాలను తెలుగు మరియు ఇంగ్లీషులో చూడండి.'
                  : 'Filter transparent vacancies by proximity, shift schedule, or compensation in Telugu and English.'}
              </p>
            </div>

            <div className={styles.howStep}>
              <span className={styles.stepNum}>02</span>
              <h3 className={styles.stepTitle}>
                {language === 'te' ? 'ఒక్క క్లిక్‌తో దరఖాస్తు' : 'One-Click Apply'}
              </h3>
              <p className={styles.stepDesc}>
                {language === 'te'
                  ? 'మీ వివరాలు మరియు వాట్సాప్ నంబర్‌తో వెంటనే దరఖాస్తు చేసుకోండి. 20 పేజీల ఫారమ్‌లు లేవు.'
                  : 'Submit your profile and contact info without gatekeeping, paywalls, or multi-step quizzes.'}
              </p>
            </div>

            <div className={styles.howStep}>
              <span className={styles.stepNum}>03</span>
              <h3 className={styles.stepTitle}>
                {language === 'te' ? 'పూర్తి పారదర్శకత' : 'Direct Status Tracking'}
              </h3>
              <p className={styles.stepDesc}>
                {language === 'te'
                  ? 'మీ దరఖాస్తు పరిశీలన, షార్ట్‌లిస్ట్ మరియు ఎంపిక వివరాలను ఎప్పటికప్పుడు తెలుసుకోండి.'
                  : 'Watch your application progress through Reviewing, Shortlisted, and Hired in real-time.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Employer Call-to-Action */}
      <section className={styles.section} style={{ borderBottom: 'none', paddingBottom: '6rem' }}>
        <div className="container-wide">
          <div className={styles.employerCta}>
            <div className={styles.ctaText}>
              <h2>
                {language === 'te'
                  ? 'మీ వ్యాపారానికి త్వరగా సిబ్బంది కావాలా?'
                  : 'Simpler hiring for local businesses and growing teams.'}
              </h2>
              <p>
                {language === 'te'
                  ? 'దుకాణాలు, రెస్టారెంట్లు, సలూన్లు, ట్యూషన్ అకాడమీలు మరియు స్టార్టప్‌లు నేరుగా ఖాళీలను ప్రకటించవచ్చు. అర్హులైన అభ్యర్థులను వేగంగా పొందండి.'
                  : 'List your open shifts or professional roles in minutes. Connect with motivated college students, freshers, and local candidates without agency markups or complex recruiters.'}
              </p>
            </div>

            <div className={styles.ctaActionBox}>
              <Link to="/employer/jobs/new" className="btn btn-primary btn-lg">
                <Store size={16} />
                <span>Post a Job Vacancy</span>
              </Link>
              <Link to="/jobs" className="btn btn-ghost btn-sm">
                <span>Browse current listings →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
