import test from 'node:test';
import assert from 'node:assert/strict';
import { initialJobs } from '../data/mockJobs.js';
import {
  calculateJobMatch,
  rankJobsForCandidate,
  DEFAULT_MATCHING_WEIGHTS,
} from './matchingEngine.js';

// Profile 1: B.Tech CSE student, currently studying, fresher, seeking internships in Hyderabad
const profileBTechStudent = {
  education_level: 'B.Tech / B.E.',
  education_field: 'Computer Science / IT',
  education_status: 'studying',
  graduation_year: 2026,
  skills: ['React', 'JavaScript', 'HTML5', 'Git'],
  interests: ['Web development', 'Programming'],
  experience_level: 'fresher',
  experience_details: 'College mini-projects in React and frontend development.',
  work_types: ['internship'],
  preferred_sectors: ['software'],
  preferred_city: 'Hyderabad',
  work_mode: 'no_preference',
  available_days: ['weekdays', 'flexible'],
  available_shifts: ['flexible'],
  expected_salary_min: 10000,
};

// Profile 2: Commerce graduate, seeking part-time retail or office work in Vijayawada
const profileCommerceGrad = {
  education_level: 'Undergraduate degree',
  education_field: 'Commerce / Business',
  education_status: 'completed',
  graduation_year: 2024,
  skills: ['Accounting', 'Tally', 'Retail / customer service'],
  interests: ['Accounting / administration', 'Retail / customer service'],
  experience_level: 'some_experience',
  experience_details: 'Assisted in local family shop accounts and bookkeeping.',
  work_types: ['part_time'],
  preferred_sectors: ['retail'],
  preferred_city: 'Vijayawada',
  work_mode: 'onsite',
  available_days: ['weekdays', 'weekends'],
  available_shifts: ['afternoon', 'evening'],
  expected_salary_min: 10000,
};

// Profile 3: Hospitality candidate seeking evening shifts in Hyderabad
const profileHospitality = {
  education_level: 'Intermediate / 12th pass',
  education_field: 'Arts / Humanities',
  education_status: 'completed',
  skills: ['Hospitality / food service', 'Communication', 'Telugu'],
  interests: ['Hospitality / food service'],
  experience_level: 'some_experience',
  work_types: ['part_time', 'weekend'],
  preferred_sectors: ['hospitality'],
  preferred_city: 'Hyderabad',
  work_mode: 'onsite',
  available_days: ['weekdays', 'weekends'],
  available_shifts: ['evening'],
  expected_salary_min: 8000,
};

test('Deterministic scoring: identical inputs ALWAYS produce identical scores and ordering', () => {
  const run1 = rankJobsForCandidate(initialJobs, profileBTechStudent);
  const run2 = rankJobsForCandidate(initialJobs, profileBTechStudent);

  assert.equal(run1.qualifiedMatches.length, run2.qualifiedMatches.length);
  for (let i = 0; i < run1.qualifiedMatches.length; i++) {
    assert.equal(run1.qualifiedMatches[i].job.id, run2.qualifiedMatches[i].job.id);
    assert.equal(run1.qualifiedMatches[i].matchScore, run2.qualifiedMatches[i].matchScore);
  }
});

test('Sensitivity test: Different candidate profiles produce distinct rankings and top matches', () => {
  const result1 = rankJobsForCandidate(initialJobs, profileBTechStudent);
  const result2 = rankJobsForCandidate(initialJobs, profileCommerceGrad);
  const result3 = rankJobsForCandidate(initialJobs, profileHospitality);

  // Profile 1 (B.Tech student seeking internship in Hyderabad) -> top match must be Web Development & UI Intern (job-7)
  assert.ok(result1.qualifiedMatches.length > 0);
  assert.equal(result1.qualifiedMatches[0].job.id, 'job-7', 'Top match for B.Tech intern should be Web Dev Intern');
  assert.ok(result1.qualifiedMatches[0].matchScore >= 90, 'Score should be high for matching internship');

  // Profile 2 (Commerce grad seeking part-time retail/accounts in Vijayawada) -> top match should be job-9 or job-3
  assert.ok(result2.qualifiedMatches.length > 0);
  const topJob2 = result2.qualifiedMatches[0].job.id;
  assert.ok(topJob2 === 'job-9' || topJob2 === 'job-3', 'Top match for commerce retail should be Vijayawada retail/accounts');

  // Profile 3 (Hospitality evening in Hyderabad) -> top match must be job-8 (Evening Cafe Steward) or job-2 (Barista)
  assert.ok(result3.qualifiedMatches.length > 0);
  const topJob3 = result3.qualifiedMatches[0].job.id;
  assert.ok(topJob3 === 'job-8' || topJob3 === 'job-2', 'Top match for hospitality evening should be cafe evening/barista');

  // Verify that top match IDs for the three profiles are different
  assert.notEqual(result1.qualifiedMatches[0].job.id, result2.qualifiedMatches[0].job.id);
  assert.notEqual(result2.qualifiedMatches[0].job.id, result3.qualifiedMatches[0].job.id);
  assert.notEqual(result1.qualifiedMatches[0].job.id, result3.qualifiedMatches[0].job.id);
});

test('Closed vacancies are strictly excluded from recommendations', () => {
  const result = rankJobsForCandidate(initialJobs, profileBTechStudent);
  const closedJobMatch = result.qualifiedMatches.find((m) => m.job.id === 'job-11');
  const closedJobUnmet = result.unmetRequirementMatches.find((m) => m.job.id === 'job-11');

  assert.equal(closedJobMatch, undefined, 'Closed vacancy (job-11) must not be in qualified matches');
  assert.equal(closedJobUnmet, undefined, 'Closed vacancy (job-11) must not be in unmet requirement matches');
});

test('Mandatory eligibility failure: Ineligible candidates are separated and not ranked as qualified', () => {
  // Candidate is currently studying and has no experience
  // job-10 is "Principal Cloud Infrastructure Architect" which requires completed degree & 8+ years
  const result = rankJobsForCandidate(initialJobs, profileBTechStudent);

  const seniorJobQualified = result.qualifiedMatches.find((m) => m.job.id === 'job-10');
  const seniorJobUnmet = result.unmetRequirementMatches.find((m) => m.job.id === 'job-10');

  assert.equal(seniorJobQualified, undefined, 'Ineligible role must not be among qualified recommendations');
  assert.ok(seniorJobUnmet, 'Ineligible role should be segregated into unmetRequirementMatches');
  assert.ok(seniorJobUnmet.unmetReason.includes('completed degree') || seniorJobUnmet.unmetReason.includes('studying'));
});

test('Missing fields handling: Missing data does not count as a match and generates honest limitation notes', () => {
  const jobMissingSalaryAndHours = {
    id: 'job-test-missing',
    title: 'General Support Associate',
    category: 'customerSupport',
    employment_type: 'full_time',
    location: 'Hyderabad',
    requirements: ['Good communication'],
    status: 'active',
    // Missing salary_min, salary_max, shift hours, education requirement
  };

  const match = calculateJobMatch(jobMissingSalaryAndHours, profileBTechStudent, DEFAULT_MATCHING_WEIGHTS);
  assert.ok(match);
  
  // Verify that missing fields produce explicit limitation notes
  const notes = match.missingInformation;
  assert.ok(notes.some(n => n.includes('Salary') || n.includes('compensation')), 'Should note missing salary');
  assert.ok(notes.some(n => n.includes('shift') || n.includes('hours')), 'Should note missing shift hours');
});

test('Tie-breaking determinism: identical scores broken by created_at DESC, then ID ASC', () => {
  const jobA = {
    id: 'job-aaa',
    title: 'Office Assistant A',
    category: 'retail',
    employment_type: 'part_time',
    location: 'Hyderabad',
    requirements: ['Communication'],
    status: 'active',
    created_at: '2026-03-01T10:00:00Z',
  };

  const jobB = {
    id: 'job-bbb',
    title: 'Office Assistant B',
    category: 'retail',
    employment_type: 'part_time',
    location: 'Hyderabad',
    requirements: ['Communication'],
    status: 'active',
    created_at: '2026-03-02T10:00:00Z', // newer date
  };

  const result = rankJobsForCandidate([jobA, jobB], {
    work_types: ['part_time'],
    preferred_city: 'Hyderabad',
  });

  assert.equal(result.qualifiedMatches[0].job.id, 'job-bbb', 'Newer job should break tie first');
  assert.equal(result.qualifiedMatches[1].job.id, 'job-aaa');
});

