import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit2,
  Plus,
  X,
  AlertCircle,
  Calendar,
  IndianRupee,
  Compass,
} from 'lucide-react';
import styles from './GuidedQuestionnaire.module.css';

const EDUCATION_LEVELS = [
  'School student',
  'Intermediate / 12th pass',
  'Diploma',
  'Undergraduate degree',
  'B.Tech / B.E.',
  'Postgraduate',
  'Other',
];

const FIELDS_OF_STUDY = [
  'Computer Science / IT',
  'Electronics & Electrical',
  'Mechanical & Civil',
  'Commerce / Business',
  'Science & Mathematics',
  'Arts & Humanities',
  'Other',
];

const GRADUATION_YEARS = [2028, 2027, 2026, 2025, 2024, 2023, 2022, 'Earlier'];

const STANDARD_SKILLS = [
  'Programming',
  'Web development',
  'Data analysis',
  'Design',
  'Communication',
  'Teaching / tutoring',
  'Sales / marketing',
  'Retail / customer service',
  'Hospitality / food service',
  'Accounting / administration',
  'Operations / hands-on work',
  'Telugu fluency',
  'English fluency',
];

const STANDARD_INTERESTS = [
  'Software & Technology',
  'Retail & Store Management',
  'Cafe & Food Service',
  'Teaching & Academic Tutoring',
  'Customer Support & Helpdesk',
  'Accounting & Financial Records',
  'Content Creation & Writing',
  'Local Neighborhood Business',
];

const EXPERIENCE_OPTIONS = [
  {
    id: 'no_experience',
    title: 'No work experience',
    desc: 'Looking to begin my first formal work engagement or entry opportunity.',
  },
  {
    id: 'fresher',
    title: 'Fresher',
    desc: 'Recent graduate or final-year student seeking entry-level positions.',
  },
  {
    id: 'some_experience',
    title: 'Some experience',
    desc: '1–2 years of practical internships, part-time jobs, or informal work.',
  },
  {
    id: 'experienced',
    title: 'Experienced',
    desc: '2+ years of professional or industry experience.',
  },
];

const WORK_TYPES = [
  { id: 'internship', label: 'Internship' },
  { id: 'part_time', label: 'Part-time' },
  { id: 'weekend', label: 'Weekend work' },
  { id: 'full_time', label: 'Full-time' },
  { id: 'temporary', label: 'Temporary / short-term' },
  { id: 'contract', label: 'Freelance / Contract' },
  { id: 'local_jobs', label: 'Local jobs' },
  { id: 'any', label: 'Any suitable opportunity' },
];

const PREFERRED_SECTORS = [
  'Software & IT',
  'Retail & Supermarkets',
  'Hospitality & Cafes',
  'Education & Tutoring',
  'Customer Support & Operations',
  'Accounting & Finance',
  'Healthcare & Wellness',
  'Salon & Grooming',
  'Open to any sector',
];

const QUICK_CITIES = ['Hyderabad', 'Vijayawada', 'Visakhapatnam', 'Guntur', 'Tirupati', 'Warangal'];

const WORK_MODES = [
  { id: 'no_preference', label: 'No preference' },
  { id: 'onsite', label: 'On-site' },
  { id: 'hybrid', label: 'Hybrid' },
  { id: 'remote', label: 'Remote' },
];

const AVAILABLE_DAYS = [
  { id: 'weekdays', label: 'Weekdays (Mon–Fri)' },
  { id: 'weekends', label: 'Weekends (Sat–Sun)' },
  { id: 'all_days', label: 'All days' },
  { id: 'flexible', label: 'Flexible' },
];

const AVAILABLE_SHIFTS = [
  { id: 'morning', label: 'Morning (8 AM – 1 PM)' },
  { id: 'afternoon', label: 'Afternoon (1 PM – 6 PM)' },
  { id: 'evening', label: 'Evening (4 PM – 10 PM)' },
  { id: 'night', label: 'Night (9 PM – 6 AM)' },
  { id: 'flexible', label: 'Flexible' },
];

export default function GuidedQuestionnaire({ initialData, onSubmit, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingStepIndex, setMatchingStepIndex] = useState(0);

  // Form State initialized with previous answers or defaults
  const [formData, setFormData] = useState({
    // Step 1: Education
    education_level: initialData?.education_level || 'Undergraduate degree',
    education_field: initialData?.education_field || 'Computer Science / IT',
    education_status: initialData?.education_status || 'studying', // 'studying' | 'completed'
    graduation_year: initialData?.graduation_year || 2026,

    // Step 2: Skills and Interests
    skills: initialData?.skills || ['Communication'],
    interests: initialData?.interests || ['Software & Technology'],

    // Step 3: Experience
    experience_level: initialData?.experience_level || 'fresher',
    experience_details: initialData?.experience_details || '',

    // Step 4: Type of Work
    work_types: initialData?.work_types || ['internship', 'part_time'],
    preferred_sectors: initialData?.preferred_sectors || ['Software & IT'],

    // Step 5: Location & Availability
    preferred_city: initialData?.preferred_city || 'Hyderabad',
    work_mode: initialData?.work_mode || 'no_preference',
    max_commute_km: initialData?.max_commute_km || '',
    available_days: initialData?.available_days || ['weekdays', 'flexible'],
    available_shifts: initialData?.available_shifts || ['flexible'],
    expected_salary_min: initialData?.expected_salary_min || '',
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [validationError, setValidationError] = useState('');

  // Update single field
  const updateField = (field, value) => {
    setValidationError('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Toggle multi-select array field
  const toggleArrayItem = (field, item) => {
    setValidationError('');
    setFormData((prev) => {
      const current = prev[field] || [];
      if (item === 'any') {
        return current.includes('any') ? [] : ['any'];
      }
      const withoutAny = current.filter((x) => x !== 'any');
      if (withoutAny.includes(item)) {
        return { ...prev, [field]: withoutAny.filter((x) => x !== item) };
      }
      return { ...prev, [field]: [...withoutAny, item] };
    });
  };

  // Add custom skill chip
  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setCustomSkillInput('');
  };

  // Remove custom skill chip
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Validation rules per step
  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.education_level) return 'Please select your current education level.';
      return null;
    }
    if (step === 2) {
      if (!formData.skills || formData.skills.length === 0) {
        return 'Please select or add at least one skill you possess.';
      }
      return null;
    }
    if (step === 3) {
      if (!formData.experience_level) return 'Please select your experience level.';
      return null;
    }
    if (step === 4) {
      if (!formData.work_types || formData.work_types.length === 0) {
        return 'Please select at least one type of work you are looking for.';
      }
      return null;
    }
    if (step === 5) {
      if (!formData.preferred_city || !formData.preferred_city.trim()) {
        return 'Please enter or select your preferred city or area.';
      }
      return null;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError('');
    if (currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async () => {
    const error = validateStep(1) || validateStep(2) || validateStep(3) || validateStep(4) || validateStep(5);
    if (error) {
      setValidationError(error);
      return;
    }

    setIsSubmitting(true);

    // Show honest sequential matching animation
    const matchingPhases = [
      'Verifying educational prerequisites and eligibility...',
      'Cross-referencing stated skills and interest overlap...',
      'Matching shift hours, work types, and geographic location...',
      'Ranking live vacancies with deterministic scoring...',
    ];

    for (let i = 0; i < matchingPhases.length; i++) {
      setMatchingStepIndex(i);
      await new Promise((res) => setTimeout(res, 350));
    }

    // Call submit handler with clean validated data
    await onSubmit(formData);
    setIsSubmitting(false);
  };

  // Is field of study applicable?
  const isFieldApplicable = [
    'Diploma',
    'Undergraduate degree',
    'B.Tech / B.E.',
    'Postgraduate',
  ].includes(formData.education_level);

  const progressPercent = Math.round((currentStep / 6) * 100);

  if (isSubmitting) {
    const matchingPhases = [
      'Verifying educational prerequisites and eligibility...',
      'Cross-referencing stated skills and interest overlap...',
      'Matching shift hours, work types, and geographic location...',
      'Ranking live vacancies with deterministic scoring...',
    ];

    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.matchingLoaderBox}>
            <div className={styles.matchingSpinnerRing} />
            <h3 className={styles.matchingStatusText}>
              {matchingPhases[matchingStepIndex] || 'Analyzing Live Vacancies...'}
            </h3>
            <p className={styles.matchingSubText}>
              Evaluating active job listings against your qualifications and availability using verified criteria.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Progress Header */}
        <div className={styles.progressHeader}>
          <div className={styles.progressMeta}>
            <span className={styles.stepIndicator}>
              <Compass size={14} />
              Step {currentStep} of 6
            </span>
            <span className={styles.stepPercent}>{progressPercent}% completed</span>
          </div>
          <div className={styles.progressBarTrack}>
            <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Global Page Heading */}
        <h1 className={styles.mainTitle}>Find work that fits you</h1>
        <p className={styles.subTitle}>
          Tell us a little about yourself. We'll use your answers to find opportunities that suit you.
        </p>

        {/* ================= STEP 1: EDUCATION ================= */}
        {currentStep === 1 && (
          <div>
            <h2 className={styles.questionHeading}>
              What are you currently studying, or what have you completed?
            </h2>
            <p className={styles.questionHint}>
              Select your qualification level. We evaluate entry-level and student opportunities appropriately.
            </p>

            <span className={styles.sectionLabel}>Qualification Level</span>
            <div className={styles.optionsGrid}>
              {EDUCATION_LEVELS.map((level) => {
                const isSelected = formData.education_level === level;
                return (
                  <div
                    key={level}
                    className={`${styles.radioCard} ${isSelected ? styles.radioCardSelected : ''}`}
                    onClick={() => updateField('education_level', level)}
                  >
                    <div className={styles.radioIconBox}>
                      {isSelected && <div className={styles.radioDot} />}
                    </div>
                    <div className={styles.radioText}>
                      <span className={styles.radioTitle}>{level}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Field of study if applicable */}
            {isFieldApplicable && (
              <div style={{ marginTop: '1.25rem' }}>
                <span className={styles.sectionLabel}>Field / Specialization of Study</span>
                <div className={styles.chipsWrap}>
                  {FIELDS_OF_STUDY.map((field) => {
                    const isSelected = formData.education_field === field;
                    return (
                      <button
                        type="button"
                        key={field}
                        className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                        onClick={() => updateField('education_field', field)}
                      >
                        {field}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status: Currently Studying vs Completed */}
            <div style={{ marginTop: '1.25rem' }}>
              <span className={styles.sectionLabel}>Current Status</span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`${styles.chip} ${formData.education_status === 'studying' ? styles.chipSelected : ''}`}
                  onClick={() => updateField('education_status', 'studying')}
                >
                  Currently studying
                </button>
                <button
                  type="button"
                  className={`${styles.chip} ${formData.education_status === 'completed' ? styles.chipSelected : ''}`}
                  onClick={() => updateField('education_status', 'completed')}
                >
                  Completed qualification
                </button>
              </div>
            </div>

            {/* Graduation Year */}
            <div style={{ marginTop: '1.5rem', maxWidth: '280px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} color="var(--accent-primary)" />
                <span>Graduation Year (expected or completed)</span>
              </label>
              <select
                className="form-select"
                value={formData.graduation_year}
                onChange={(e) => updateField('graduation_year', e.target.value)}
              >
                {GRADUATION_YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SKILLS & INTERESTS ================= */}
        {currentStep === 2 && (
          <div>
            <h2 className={styles.questionHeading}>
              What are you good at, or what kind of work interests you?
            </h2>
            <p className={styles.questionHint}>
              Select the skills you actively have, and areas of work you are interested in exploring.
            </p>

            {/* 2a: Skills you actually have */}
            <span className={styles.sectionLabel}>
              Your Active Skills <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>(skills you have experience with)</span>
            </span>
            <div className={styles.chipsWrap}>
              {STANDARD_SKILLS.map((skill) => {
                const isSelected = formData.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                    onClick={() => toggleArrayItem('skills', skill)}
                  >
                    {isSelected && <CheckCircle2 size={13} />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom skill input */}
            <form onSubmit={handleAddCustomSkill} className={styles.customSkillRow}>
              <input
                type="text"
                placeholder="Add other custom skill (e.g. React, Python, Tally, Barista)..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className={styles.customSkillInput}
              />
              <button type="submit" className="btn btn-secondary btn-sm" disabled={!customSkillInput.trim()}>
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </form>

            {/* Display active custom skills with remove tags */}
            {formData.skills.filter((s) => !STANDARD_SKILLS.includes(s)).length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Custom skills added:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {formData.skills
                    .filter((s) => !STANDARD_SKILLS.includes(s))
                    .map((custom) => (
                      <span
                        key={custom}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          padding: '0.25rem 0.6rem',
                          backgroundColor: 'var(--accent-light)',
                          color: 'var(--accent-hover)',
                          borderRadius: '999px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                        }}
                      >
                        {custom}
                        <X
                          size={12}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveSkill(custom)}
                        />
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* 2b: Areas you are interested in exploring */}
            <span className={styles.sectionLabel}>
              Areas of Interest <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>(domains you wish to explore)</span>
            </span>
            <div className={styles.chipsWrap}>
              {STANDARD_INTERESTS.map((interest) => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    className={`${styles.chip} ${isSelected ? styles.chipViolet : ''}`}
                    onClick={() => toggleArrayItem('interests', interest)}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: EXPERIENCE ================= */}
        {currentStep === 3 && (
          <div>
            <h2 className={styles.questionHeading}>
              How much work experience do you have?
            </h2>
            <p className={styles.questionHint}>
              Select the option that best reflects your professional background. No resume is required at this stage.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {EXPERIENCE_OPTIONS.map((opt) => {
                const isSelected = formData.experience_level === opt.id;
                return (
                  <div
                    key={opt.id}
                    className={`${styles.radioCard} ${isSelected ? styles.radioCardSelected : ''}`}
                    onClick={() => updateField('experience_level', opt.id)}
                  >
                    <div className={styles.radioIconBox}>
                      {isSelected && <div className={styles.radioDot} />}
                    </div>
                    <div className={styles.radioText}>
                      <span className={styles.radioTitle}>{opt.title}</span>
                      <span className={styles.radioDesc}>{opt.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="form-group">
              <label className="form-label">
                Brief description of projects, internships, or informal work (Optional)
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g., Built an academic library management web app in college; worked part-time during summer at local grocery store..."
                value={formData.experience_details}
                onChange={(e) => updateField('experience_details', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ================= STEP 4: TYPE OF WORK ================= */}
        {currentStep === 4 && (
          <div>
            <h2 className={styles.questionHeading}>
              What kind of work are you looking for?
            </h2>
            <p className={styles.questionHint}>
              Select one or multiple employment arrangements that fit your schedule.
            </p>

            <span className={styles.sectionLabel}>Employment Types</span>
            <div className={styles.optionsGrid}>
              {WORK_TYPES.map((wt) => {
                const isSelected = formData.work_types.includes(wt.id);
                return (
                  <div
                    key={wt.id}
                    className={`${styles.radioCard} ${isSelected ? styles.radioCardSelected : ''}`}
                    onClick={() => toggleArrayItem('work_types', wt.id)}
                  >
                    <div className={styles.radioIconBox}>
                      {isSelected && <div className={styles.radioDot} />}
                    </div>
                    <div className={styles.radioText}>
                      <span className={styles.radioTitle}>{wt.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <span className={styles.sectionLabel}>Preferred Job Sectors</span>
            <div className={styles.chipsWrap}>
              {PREFERRED_SECTORS.map((sector) => {
                const isSelected = formData.preferred_sectors.includes(sector);
                return (
                  <button
                    type="button"
                    key={sector}
                    className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                    onClick={() => toggleArrayItem('preferred_sectors', sector)}
                  >
                    {sector}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 5: LOCATION & AVAILABILITY ================= */}
        {currentStep === 5 && (
          <div>
            <h2 className={styles.questionHeading}>
              Where and when would you prefer to work?
            </h2>
            <p className={styles.questionHint}>
              Specify your target city, work arrangement, and shift availability.
            </p>

            {/* City Selection */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={14} color="var(--accent-primary)" />
                <span>Preferred City / Area *</span>
              </label>
              <div className={styles.chipsWrap} style={{ marginBottom: '0.75rem' }}>
                {QUICK_CITIES.map((city) => (
                  <button
                    type="button"
                    key={city}
                    className={`${styles.chip} ${formData.preferred_city === city ? styles.chipSelected : ''}`}
                    onClick={() => updateField('preferred_city', city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Or type specific area (e.g. Banjara Hills, Hyderabad)..."
                className="form-input"
                value={formData.preferred_city}
                onChange={(e) => updateField('preferred_city', e.target.value)}
              />
            </div>

            {/* Work Mode */}
            <span className={styles.sectionLabel}>Work Mode</span>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {WORK_MODES.map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  className={`${styles.chip} ${formData.work_mode === mode.id ? styles.chipSelected : ''}`}
                  onClick={() => updateField('work_mode', mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Available Days */}
            <span className={styles.sectionLabel}>Available Days</span>
            <div className={styles.chipsWrap}>
              {AVAILABLE_DAYS.map((d) => {
                const isSelected = formData.available_days.includes(d.id);
                return (
                  <button
                    type="button"
                    key={d.id}
                    className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                    onClick={() => toggleArrayItem('available_days', d.id)}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>

            {/* Available Shifts */}
            <span className={styles.sectionLabel}>Shift Availability</span>
            <div className={styles.chipsWrap}>
              {AVAILABLE_SHIFTS.map((s) => {
                const isSelected = formData.available_shifts.includes(s.id);
                return (
                  <button
                    type="button"
                    key={s.id}
                    className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                    onClick={() => toggleArrayItem('available_shifts', s.id)}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Expected Salary Range (Optional) */}
            <div className="form-group" style={{ maxWidth: '320px', marginTop: '1.25rem' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IndianRupee size={14} color="var(--accent-primary)" />
                <span>Minimum Expected Monthly Pay (Optional)</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 12000"
                className="form-input"
                value={formData.expected_salary_min}
                onChange={(e) => updateField('expected_salary_min', e.target.value)}
              />
              <span className="form-hint">Leave blank if open to standard employer offerings.</span>
            </div>
          </div>
        )}

        {/* ================= STEP 6: REVIEW & FIND JOBS ================= */}
        {currentStep === 6 && (
          <div>
            <h2 className={styles.questionHeading}>
              Review your preferences
            </h2>
            <p className={styles.questionHint}>
              Verify your information before we rank active vacancies. You can edit any section.
            </p>

            {/* Review Section 1: Education */}
            <div className={styles.reviewBox}>
              <div className={styles.reviewBoxHeader}>
                <span className={styles.reviewBoxTitle}>1. Education</span>
                <button type="button" className={styles.reviewEditBtn} onClick={() => setCurrentStep(1)}>
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <div className={styles.reviewValue}>
                {formData.education_level}
                {formData.education_field ? ` (${formData.education_field})` : ''} •{' '}
                {formData.education_status === 'studying' ? 'Currently studying' : 'Completed'} • Year:{' '}
                {formData.graduation_year}
              </div>
            </div>

            {/* Review Section 2: Skills & Interests */}
            <div className={styles.reviewBox}>
              <div className={styles.reviewBoxHeader}>
                <span className={styles.reviewBoxTitle}>2. Skills & Interests</span>
                <button type="button" className={styles.reviewEditBtn} onClick={() => setCurrentStep(2)}>
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <div className={styles.reviewChips}>
                {formData.skills.map((s) => (
                  <span key={s} className={styles.reviewChip}>
                    ✓ {s}
                  </span>
                ))}
              </div>
              {formData.interests.length > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Interests: {formData.interests.join(', ')}
                </div>
              )}
            </div>

            {/* Review Section 3: Experience */}
            <div className={styles.reviewBox}>
              <div className={styles.reviewBoxHeader}>
                <span className={styles.reviewBoxTitle}>3. Experience</span>
                <button type="button" className={styles.reviewEditBtn} onClick={() => setCurrentStep(3)}>
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <div className={styles.reviewValue}>
                {EXPERIENCE_OPTIONS.find((o) => o.id === formData.experience_level)?.title || formData.experience_level}
              </div>
              {formData.experience_details && (
                <p style={{ marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  "{formData.experience_details}"
                </p>
              )}
            </div>

            {/* Review Section 4: Type of Work */}
            <div className={styles.reviewBox}>
              <div className={styles.reviewBoxHeader}>
                <span className={styles.reviewBoxTitle}>4. Type of Work & Sectors</span>
                <button type="button" className={styles.reviewEditBtn} onClick={() => setCurrentStep(4)}>
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <div className={styles.reviewChips}>
                {formData.work_types.map((wt) => (
                  <span key={wt} className={styles.reviewChip}>
                    {WORK_TYPES.find((w) => w.id === wt)?.label || wt}
                  </span>
                ))}
              </div>
              {formData.preferred_sectors.length > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Sectors: {formData.preferred_sectors.join(', ')}
                </div>
              )}
            </div>

            {/* Review Section 5: Location & Availability */}
            <div className={styles.reviewBox}>
              <div className={styles.reviewBoxHeader}>
                <span className={styles.reviewBoxTitle}>5. Location & Availability</span>
                <button type="button" className={styles.reviewEditBtn} onClick={() => setCurrentStep(5)}>
                  <Edit2 size={12} /> Edit
                </button>
              </div>
              <div className={styles.reviewValue}>
                City: <strong>{formData.preferred_city}</strong> • Mode: {formData.work_mode}
              </div>
              <div style={{ marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Days: {formData.available_days.join(', ')} • Shifts: {formData.available_shifts.join(', ')}
                {formData.expected_salary_min ? ` • Min Pay: ₹${Number(formData.expected_salary_min).toLocaleString('en-IN')}/mo` : ''}
              </div>
            </div>
          </div>
        )}

        {/* Validation Warning Notice (if any) */}
        {validationError && (
          <div className={styles.validationWarning}>
            <AlertCircle size={15} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Navigation Footer */}
        <div className={styles.navFooter}>
          {currentStep > 1 ? (
            <button type="button" onClick={handleBack} className="btn btn-secondary">
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>
          ) : (
            <div>
              {onCancel && (
                <button type="button" onClick={onCancel} className="btn btn-ghost">
                  Browse All Jobs Instead
                </button>
              )}
            </div>
          )}

          {currentStep < 6 ? (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              <span>Continue</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="btn btn-primary"
              style={{
                backgroundColor: 'var(--accent-primary)',
                padding: '0.75rem 1.75rem',
                fontSize: '0.95rem',
                fontWeight: 700,
              }}
            >
              <Sparkles size={16} />
              <span>Find My Matches</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
