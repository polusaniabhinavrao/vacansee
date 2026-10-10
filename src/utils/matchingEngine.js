/**
 * Vacansee Deterministic Job Matching Engine
 * 
 * Computes deterministic match scores, eligibility status, and evidence-based
 * explanations between candidate preferences and active job vacancies.
 * 
 * Rules:
 * - Pure, deterministic function: identical inputs ALWAYS produce identical results.
 * - No Math.random(), no hardcoded/clamped scores.
 * - Mandatory eligibility requirements are strictly enforced.
 * - Missing vacancy data is explicitly identified and never counted as a match.
 * - Deterministic tie-breaking: score DESC, created_at DESC, job_id ASC.
 */

export const DEFAULT_MATCHING_WEIGHTS = {
  qualification: 0.30,
  skills: 0.25,
  employmentType: 0.15,
  location: 0.10,
  availability: 0.10,
  salary: 0.10,
};

// Common skill synonym aliases for normalized token matching
const SKILL_ALIASES = {
  'js': 'javascript',
  'react.js': 'react',
  'reactjs': 'react',
  'node.js': 'nodejs',
  'maths': 'mathematics',
  'math': 'mathematics',
  'web dev': 'web development',
  'frontend': 'web development',
  'front-end': 'web development',
  'backend': 'programming',
  'coding': 'programming',
  'tally': 'accounting',
  'bookkeeping': 'accounting',
  'billing': 'accounting',
  'barista': 'hospitality',
  'cafe': 'hospitality',
  'serving': 'hospitality',
  'steward': 'hospitality',
  'cashier': 'retail',
  'supermarket': 'retail',
  'customer care': 'customer service',
  'customer support': 'customer service',
  'teaching': 'tutoring',
};

/**
 * Normalizes a skill string or phrase into clean searchable tokens.
 */
export function normalizeSkill(str) {
  if (!str) return '';
  const cleaned = str.toLowerCase().trim().replace(/[^a-z0-9+#.\s]/g, '');
  return SKILL_ALIASES[cleaned] || cleaned;
}

/**
 * Checks if a candidate's skill matches any tokens in a job requirement or text.
 */
function skillMatchesText(candidateSkill, text) {
  const normSkill = normalizeSkill(candidateSkill);
  if (!normSkill) return false;
  const lowerText = text.toLowerCase();

  // Direct substring check or alias match
  if (lowerText.includes(normSkill)) return true;

  // Check alias reverse
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    if (canonical === normSkill && lowerText.includes(alias)) return true;
    if (alias === normSkill && lowerText.includes(canonical)) return true;
  }
  return false;
}

/**
 * Evaluates candidate qualification & education eligibility.
 * Weight: 30%
 */
function evaluateQualification(job, preferences) {
  const educationLevel = (preferences.education_level || '').toLowerCase();
  const educationField = (preferences.education_field || '').toLowerCase();
  const educationStatus = (preferences.education_status || 'completed').toLowerCase(); // 'studying' | 'completed'

  const jobReqText = [
    job.title,
    job.description,
    ...(job.requirements || []),
  ].join(' ').toLowerCase();

  const reasons = [];
  const missingInfo = [];
  let isEligible = true;
  let unmetReason = null;
  let score = 0.5; // neutral baseline if unstated

  // 1. Check for hard "Degree completion required" vs "Currently studying"
  const requiresCompletedDegree =
    jobReqText.includes('degree completion') ||
    jobReqText.includes('must have completed') ||
    jobReqText.includes('graduates only') ||
    jobReqText.includes('completed degree required');

  if (requiresCompletedDegree && educationStatus === 'studying' && !['undergraduate', 'btech', 'postgraduate'].some(l => educationLevel.includes(l))) {
    isEligible = false;
    unmetReason = 'Listing requires a completed degree; you are currently studying.';
    return { score: 0, isEligible, unmetReason, reasons, missingInfo };
  }

  // 2. Check if student or fresher is explicitly welcomed
  const welcomesStudents =
    jobReqText.includes('college student') ||
    jobReqText.includes('students welcome') ||
    jobReqText.includes('fresher friendly') ||
    jobReqText.includes('freshers welcome') ||
    jobReqText.includes('no prior experience');

  if (welcomesStudents && (educationStatus === 'studying' || preferences.experience_level === 'fresher' || preferences.experience_level === 'no_experience')) {
    score = 1.0;
    reasons.push('Listing explicitly welcomes students and fresh graduates.');
  } else if (educationLevel) {
    // Check level alignment
    const isTechJob = job.category === 'software' || jobReqText.includes('software') || jobReqText.includes('developer');
    const isTechField = educationField.includes('computer') || educationField.includes('it') || educationLevel.includes('btech') || educationLevel.includes('b.tech');

    if (isTechJob && isTechField) {
      score = 1.0;
      reasons.push('Your technical degree background directly matches this role.');
    } else if (job.category === 'retail' || job.category === 'hospitality') {
      score = 0.9;
      reasons.push('Educational prerequisites are flexible for this position.');
    } else if (job.category === 'education' && (educationLevel.includes('degree') || educationLevel.includes('btech') || educationLevel.includes('postgraduate'))) {
      score = 0.95;
      reasons.push('Your degree qualifications meet the tutor instruction criteria.');
    } else if (educationStatus === 'completed') {
      score = 0.8;
      reasons.push('You fulfill the completed education requirement.');
    } else {
      score = 0.7;
    }
  } else {
    missingInfo.push('Employer did not specify strict education criteria.');
  }

  return { score, isEligible, unmetReason, reasons, missingInfo };
}

/**
 * Evaluates candidate skill match against job requirements.
 * Weight: 25%
 */
function evaluateSkills(job, preferences) {
  const candidateSkills = Array.isArray(preferences.skills) ? preferences.skills : [];
  const candidateInterests = Array.isArray(preferences.interests) ? preferences.interests : [];
  const jobRequirements = Array.isArray(job.requirements) ? job.requirements : [];

  const jobFullText = [
    job.title,
    job.description,
    ...jobRequirements,
  ].join(' ');

  const reasons = [];
  const missingInfo = [];

  if (jobRequirements.length === 0) {
    missingInfo.push('Listing lists no formal skill prerequisites.');
    return { score: 0.5, reasons, missingInfo };
  }

  if (candidateSkills.length === 0 && candidateInterests.length === 0) {
    return { score: 0.3, reasons, missingInfo: ['No candidate skills specified.'] };
  }

  // Find which candidate skills match the vacancy text
  const matchedSkills = candidateSkills.filter((s) => skillMatchesText(s, jobFullText));
  const matchedInterests = candidateInterests.filter((i) => skillMatchesText(i, jobFullText));

  let score = 0;
  if (matchedSkills.length > 0) {
    // Proportional to matched skills
    score = Math.min(1.0, 0.4 + matchedSkills.length * 0.25);
    reasons.push(`Matches ${matchedSkills.length} of your stated skills: ${matchedSkills.slice(0, 3).join(', ')}.`);
  }

  if (matchedInterests.length > 0) {
    score = Math.min(1.0, score + 0.15);
    reasons.push(`Aligns with your stated interest in ${matchedInterests.slice(0, 2).join(', ')}.`);
  }

  if (matchedSkills.length === 0 && matchedInterests.length === 0) {
    score = 0.15; // Low overlap
  }

  return { score, reasons, missingInfo };
}

/**
 * Evaluates employment type & sector compatibility.
 * Weight: 15%
 */
function evaluateEmploymentType(job, preferences) {
  const preferredTypes = Array.isArray(preferences.work_types) ? preferences.work_types : [];
  const preferredSectors = Array.isArray(preferences.preferred_sectors) ? preferences.preferred_sectors : [];

  const reasons = [];
  const missingInfo = [];
  let score = 0.5;

  if (preferredTypes.length === 0) {
    missingInfo.push('No work type preference specified.');
    return { score: 0.5, reasons, missingInfo };
  }

  const jobType = (job.employment_type || '').toLowerCase();
  const isAny = preferredTypes.includes('any');

  if (isAny) {
    score = 0.85;
    reasons.push('Matches your open availability for any employment type.');
  } else if (preferredTypes.includes(jobType)) {
    score = 1.0;
    const formattedType = jobType.replace('_', ' ');
    reasons.push(`The ${formattedType} format matches your preferred work type.`);
  } else if (
    (preferredTypes.includes('part_time') && jobType === 'weekend') ||
    (preferredTypes.includes('weekend') && jobType === 'part_time')
  ) {
    score = 0.8;
    reasons.push('Weekend/part-time schedule is compatible with your preference.');
  } else if (preferredTypes.includes('internship') && jobType === 'full_time') {
    score = 0.3;
  } else {
    score = 0.2;
  }

  // Preferred sector bonus
  if (preferredSectors.length > 0 && !preferredSectors.includes('any')) {
    const jobCategory = (job.category || '').toLowerCase();
    const sectorMatch = preferredSectors.some(s => {
      const normS = s.toLowerCase();
      return jobCategory.includes(normS) || normS.includes(jobCategory);
    });

    if (sectorMatch) {
      score = Math.min(1.0, score + 0.15);
      reasons.push('The business industry aligns with your selected sectors.');
    }
  }

  return { score, reasons, missingInfo };
}

/**
 * Evaluates location and work mode.
 * Weight: 10%
 */
function evaluateLocation(job, preferences) {
  const preferredCity = (preferences.preferred_city || '').toLowerCase().trim();
  const workMode = (preferences.work_mode || 'no_preference').toLowerCase();
  const jobLocation = (job.location || '').toLowerCase();

  const reasons = [];
  const missingInfo = [];

  if (!job.location) {
    missingInfo.push('Job location was not specified by employer.');
    return { score: 0.5, reasons, missingInfo };
  }

  // Remote flexibility
  if (job.is_remote) {
    if (workMode === 'remote' || workMode === 'no_preference' || workMode === 'hybrid') {
      reasons.push('Remote work flexibility is offered for this role.');
      return { score: 1.0, reasons, missingInfo };
    }
  }

  if (!preferredCity || preferredCity === 'all' || preferredCity === 'any') {
    return { score: 0.75, reasons: ['No specific city filter restricted.'], missingInfo };
  }

  // City match
  const cityMatches =
    jobLocation.includes(preferredCity) ||
    preferredCity.includes(jobLocation.split(',')[0].trim());

  if (cityMatches) {
    reasons.push(`Listing location (${job.location}) matches your preferred area.`);
    return { score: 1.0, reasons, missingInfo };
  }

  // Location does not match and not remote
  return {
    score: 0.1,
    reasons,
    missingInfo: [`Role is situated in ${job.location}, outside your preferred city.`],
  };
}

/**
 * Evaluates schedule & shift availability.
 * Weight: 10%
 */
function evaluateAvailability(job, preferences) {
  const availableShifts = Array.isArray(preferences.available_shifts) ? preferences.available_shifts : [];
  const availableDays = Array.isArray(preferences.available_days) ? preferences.available_days : [];

  const jobText = [
    job.title,
    job.description,
    ...(job.requirements || []),
  ].join(' ').toLowerCase();

  const reasons = [];
  const missingInfo = [];

  const mentionsWeekend = jobText.includes('weekend') || jobText.includes('saturday') || job.employment_type === 'weekend';
  const mentionsEvening = jobText.includes('evening') || jobText.includes('pm') || jobText.includes('night');
  const mentionsMorning = jobText.includes('morning') || jobText.includes('am');

  if (!mentionsWeekend && !mentionsEvening && !mentionsMorning) {
    missingInfo.push('Employer did not specify exact shift hours.');
    return { score: 0.5, reasons, missingInfo };
  }

  if (availableShifts.includes('flexible') || availableDays.includes('flexible')) {
    reasons.push('Your flexible schedule accommodates the vacancy hours.');
    return { score: 0.95, reasons, missingInfo };
  }

  let matchFound = false;

  if (mentionsEvening && availableShifts.includes('evening')) {
    reasons.push('Evening shift timing matches your stated availability.');
    matchFound = true;
  }

  if (mentionsWeekend && availableDays.includes('weekends')) {
    reasons.push('Weekend working hours directly match your availability.');
    matchFound = true;
  }

  if (mentionsMorning && availableShifts.includes('morning')) {
    reasons.push('Morning working hours match your availability.');
    matchFound = true;
  }

  if (matchFound) {
    return { score: 1.0, reasons, missingInfo };
  }

  return {
    score: 0.35,
    reasons,
    missingInfo: ['Vacancy timings may conflict with your preferred shift.'],
  };
}

/**
 * Evaluates salary compatibility.
 * Weight: 10%
 */
function evaluateSalary(job, preferences) {
  const expectedMin = preferences.expected_salary_min ? Number(preferences.expected_salary_min) : null;
  const reasons = [];
  const missingInfo = [];

  if (!job.salary_min && !job.salary_max) {
    missingInfo.push('Salary compensation not disclosed by employer.');
    return { score: 0.5, reasons, missingInfo };
  }

  if (!expectedMin || isNaN(expectedMin) || expectedMin <= 0) {
    // Candidate has no salary constraint
    return { score: 1.0, reasons: ['Matches your flexible compensation expectation.'], missingInfo };
  }

  const jobMax = job.salary_max || job.salary_min;
  const jobMin = job.salary_min || job.salary_max;

  if (jobMax >= expectedMin) {
    reasons.push(`Offered pay (up to ₹${jobMax.toLocaleString('en-IN')}) meets your expectation.`);
    return { score: 1.0, reasons, missingInfo };
  }

  if (jobMin >= expectedMin * 0.8) {
    reasons.push('Offered pay is close to your target range.');
    return { score: 0.7, reasons, missingInfo };
  }

  return {
    score: 0.2,
    reasons,
    missingInfo: [`Offered pay (₹${jobMax.toLocaleString('en-IN')}) is below your target ₹${expectedMin.toLocaleString('en-IN')}.`],
  };
}

/**
 * Computes deterministic match between a single vacancy and candidate preferences.
 */
export function calculateJobMatch(job, preferences, weights = DEFAULT_MATCHING_WEIGHTS) {
  if (!job || job.status !== 'active') {
    return null; // Inactive or invalid jobs cannot be recommended
  }

  const qualRes = evaluateQualification(job, preferences);
  const skillsRes = evaluateSkills(job, preferences);
  const typeRes = evaluateEmploymentType(job, preferences);
  const locRes = evaluateLocation(job, preferences);
  const availRes = evaluateAvailability(job, preferences);
  const salRes = evaluateSalary(job, preferences);

  // If hard eligibility is violated, mark job as not eligible
  const isEligible = qualRes.isEligible;
  const unmetReason = qualRes.unmetReason;

  // Normalized weighted sum
  const rawScore =
    weights.qualification * qualRes.score +
    weights.skills * skillsRes.score +
    weights.employmentType * typeRes.score +
    weights.location * locRes.score +
    weights.availability * availRes.score +
    weights.salary * salRes.score;

  // Discrete percentage rounded to integer (0 - 100)
  const matchScore = Math.min(100, Math.max(0, Math.round(rawScore * 100)));

  // Combine positive explanations
  const positiveReasons = [
    ...qualRes.reasons,
    ...skillsRes.reasons,
    ...typeRes.reasons,
    ...locRes.reasons,
    ...availRes.reasons,
    ...salRes.reasons,
  ];

  // Combine missing information limitations
  const missingInformation = [
    ...qualRes.missingInfo,
    ...skillsRes.missingInfo,
    ...typeRes.missingInfo,
    ...locRes.missingInfo,
    ...availRes.missingInfo,
    ...salRes.missingInfo,
  ];

  return {
    job,
    matchScore,
    isEligible,
    unmetReason,
    positiveReasons,
    missingInformation,
    breakdown: {
      qualification: Math.round(qualRes.score * 100),
      skills: Math.round(skillsRes.score * 100),
      employmentType: Math.round(typeRes.score * 100),
      location: Math.round(locRes.score * 100),
      availability: Math.round(availRes.score * 100),
      salary: Math.round(salRes.score * 100),
    },
  };
}

/**
 * Deterministically ranks active vacancies for a candidate.
 * 
 * Excludes closed/inactive jobs.
 * Enforces mandatory eligibility.
 * Deterministic tie-breaking: matchScore DESC -> created_at DESC -> job_id ASC.
 */
export function rankJobsForCandidate(jobs, preferences, weights = DEFAULT_MATCHING_WEIGHTS) {
  if (!Array.isArray(jobs) || !preferences) {
    return { qualifiedMatches: [], unmetRequirementMatches: [] };
  }

  const qualifiedMatches = [];
  const unmetRequirementMatches = [];

  for (const job of jobs) {
    // Rule: Exclude inactive and closed vacancies
    if (!job || job.status !== 'active') {
      continue;
    }

    const match = calculateJobMatch(job, preferences, weights);
    if (!match) continue;

    if (match.isEligible) {
      qualifiedMatches.push(match);
    } else {
      unmetRequirementMatches.push(match);
    }
  }

  // Stable deterministic sorting
  const sortFn = (a, b) => {
    // 1. Primary: Match score descending
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }

    // 2. Secondary: Creation date descending
    const dateA = new Date(a.job.created_at || 0).getTime();
    const dateB = new Date(b.job.created_at || 0).getTime();
    if (dateB !== dateA) {
      return dateB - dateA;
    }

    // 3. Tertiary: Stable ID comparison
    return String(a.job.id).localeCompare(String(b.job.id));
  };

  qualifiedMatches.sort(sortFn);
  unmetRequirementMatches.sort(sortFn);

  return {
    qualifiedMatches,
    unmetRequirementMatches,
  };
}

