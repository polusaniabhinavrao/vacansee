export const initialJobs = [
  {
    id: 'job-1',
    employer_id: 'emp-tech-1',
    title: 'Junior React Developer (Fresher Friendly)',
    company_name: 'Deccan Innovations',
    category: 'software',
    employment_type: 'full_time',
    location: 'HITEC City, Hyderabad',
    is_remote: false,
    is_local_business: false,
    salary_min: 25000,
    salary_max: 40000,
    salary_period: 'monthly',
    description: 'We are seeking energetic fresh graduates with a passion for React.js, modern JavaScript, and clean UI engineering. Mentorship is provided by senior architects.',
    requirements: [
      'Basic JavaScript (ES6+)',
      'Familiarity with React and Git',
      'Eagerness to learn full-stack tools',
      'Good communication skills'
    ],
    benefits: [
      'Health insurance',
      'Flexible timings',
      'Annual performance bonus',
      'Learning budget'
    ],
    vacancies: 3,
    contact_email: 'careers@deccaninnovations.com',
    contact_phone: '+91 98480 12345',
    status: 'active',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-2',
    employer_id: 'emp-cafe-1',
    title: 'Weekend Barista & Counter Staff',
    company_name: 'The Roastery Coffee House',
    category: 'hospitality',
    employment_type: 'weekend',
    location: 'Banjara Hills, Hyderabad',
    is_remote: false,
    is_local_business: true,
    salary_min: 8000,
    salary_max: 12000,
    salary_period: 'monthly',
    description: 'Ideal role for college students looking for weekend work (Saturday & Sunday, 8-hour shifts). Learn specialty espresso making and customer service in a high-energy environment.',
    requirements: [
      'College students welcome',
      'Punctuality and polite manners',
      'Telugu or English fluency',
      'No prior experience required (full training provided)'
    ],
    benefits: [
      'Free gourmet coffee & meals on shift',
      'Tips sharing pool',
      'Flexible exam schedule leave'
    ],
    vacancies: 4,
    contact_email: 'jobs@roasteryco.com',
    contact_phone: '+91 98490 23456',
    status: 'active',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-3',
    employer_id: 'emp-store-1',
    title: 'Evening Inventory & Billing Assistant',
    company_name: 'Srikara Supermart & Organics',
    category: 'retail',
    employment_type: 'part_time',
    location: 'Benz Circle, Vijayawada',
    is_remote: false,
    is_local_business: true,
    salary_min: 9000,
    salary_max: 14000,
    salary_period: 'monthly',
    description: 'Looking for honest, active staff for evening shifts (4:00 PM to 9:30 PM). Highly suitable for college students or freshers staying nearby in Vijayawada.',
    requirements: [
      'Basic math and computer billing knowledge',
      'Local Telugu speaking skills',
      'High school or Degree student'
    ],
    benefits: [
      'Store discount on groceries',
      'Overtime incentive',
      'Friendly neighborhood team'
    ],
    vacancies: 2,
    contact_email: 'store@srikararetail.com',
    contact_phone: '+91 97010 34567',
    status: 'active',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-4',
    employer_id: 'emp-tutor-1',
    title: 'Mathematics & Science Evening Tutor',
    company_name: 'Bright Minds Learning Academy',
    category: 'education',
    employment_type: 'part_time',
    location: 'MVP Colony, Visakhapatnam',
    is_remote: false,
    is_local_business: true,
    salary_min: 12000,
    salary_max: 18000,
    salary_period: 'monthly',
    description: 'Part-time teaching role for B.Sc / B.Tech college students or graduates to guide 8th - 10th standard students in Mathematics and Physics (5:00 PM to 8:00 PM on weekdays).',
    requirements: [
      'Strong fundamentals in Maths & Science',
      'Fluency in Telugu & English explanation',
      'Patient and encouraging teaching demeanor'
    ],
    benefits: [
      'Certificate of Teaching Experience',
      'Performance bonus per student examination results'
    ],
    vacancies: 2,
    contact_email: 'tutors@brightmindsacademy.org',
    contact_phone: '+91 99887 45678',
    status: 'active',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-5',
    employer_id: 'emp-tech-1',
    title: 'Telugu & English Bilingual Content Reviewer',
    company_name: 'Deccan Innovations',
    category: 'customerSupport',
    employment_type: 'full_time',
    location: 'Gachibowli, Hyderabad (Hybrid)',
    is_remote: true,
    is_local_business: false,
    salary_min: 22000,
    salary_max: 32000,
    salary_period: 'monthly',
    description: 'Evaluate and moderate user-generated digital media in Telugu and English. Great entry-level role for fresh graduates with a sharp eye for detail.',
    requirements: [
      'Native or fluent proficiency in written Telugu and English',
      'Basic computer typing skills',
      'Degree completion in any stream'
    ],
    benefits: [
      'Work from home 2 days/week',
      'Comprehensive medical cover',
      'Quarterly incentives'
    ],
    vacancies: 5,
    contact_email: 'moderation@deccaninnovations.com',
    contact_phone: '+91 98480 12345',
    status: 'active',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-6',
    employer_id: 'emp-salon-1',
    title: 'Part-Time Salon Receptionist & Appointment Coordinator',
    company_name: 'Luxe Unisex Salon & Spa',
    category: 'salon',
    employment_type: 'part_time',
    location: 'Madhapur, Hyderabad',
    is_remote: false,
    is_local_business: true,
    salary_min: 10000,
    salary_max: 15000,
    salary_period: 'monthly',
    description: 'Manage incoming customer walk-ins, phone bookings, and billing via salon POS. Clean, air-conditioned workspace.',
    requirements: [
      'Pleasant phone and in-person presence',
      'Comfortable with basic billing software',
      'Fluent in Telugu and English or Hindi'
    ],
    benefits: [
      'Complimentary salon grooming perks',
      'Performance incentives'
    ],
    vacancies: 1,
    contact_email: 'hr@luxesalon.in',
    contact_phone: '+91 90001 88990',
    status: 'active',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-7',
    employer_id: 'emp-tech-1',
    title: 'Web Development & UI Intern',
    company_name: 'Deccan Innovations',
    category: 'software',
    employment_type: 'internship',
    location: 'HITEC City, Hyderabad',
    is_remote: false,
    is_local_business: false,
    salary_min: 12000,
    salary_max: 18000,
    salary_period: 'monthly',
    description: '3-month hands-on frontend internship building responsive web apps using React.js and modern JavaScript. Work directly alongside senior frontend engineers with possibility of pre-placement offer.',
    requirements: [
      'Pursuing B.Tech / B.E. or MCA in Computer Science or IT',
      'Solid basics in JavaScript, HTML5, and CSS',
      'Familiarity with React or modern web development',
      'College students welcome'
    ],
    benefits: [
      'Monthly stipend',
      'Internship Certificate & Letter of Recommendation',
      'Flexible college exam leaves',
      'Mentorship'
    ],
    vacancies: 4,
    contact_email: 'interns@deccaninnovations.com',
    contact_phone: '+91 98480 12345',
    status: 'active',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-8',
    employer_id: 'emp-cafe-1',
    title: 'Evening Guest Host & Cafe Steward',
    company_name: 'The Roastery Coffee House',
    category: 'hospitality',
    employment_type: 'part_time',
    location: 'Banjara Hills, Hyderabad',
    is_remote: false,
    is_local_business: true,
    salary_min: 10000,
    salary_max: 15000,
    salary_period: 'monthly',
    description: 'Welcoming guests, coordinating table reservations, and serving gourmet brews during evening cafe rush hours (5:00 PM to 10:30 PM). Ideal for evening job seekers.',
    requirements: [
      'Available for evening shifts (5 PM - 10:30 PM)',
      'Polite and courteous customer service demeanor',
      'Basic spoken Telugu and English',
      'Hospitality and cafe interest'
    ],
    benefits: [
      'Evening dinner and beverage on shift',
      'Tips pool distribution',
      'Supportive local cafe crew'
    ],
    vacancies: 2,
    contact_email: 'evening@roasteryco.com',
    contact_phone: '+91 98490 23456',
    status: 'active',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-9',
    employer_id: 'emp-store-1',
    title: 'Junior Accounts & Store Billing Assistant',
    company_name: 'Sri Krishna Commercial Traders',
    category: 'retail',
    employment_type: 'part_time',
    location: 'Benz Circle, Vijayawada',
    is_remote: false,
    is_local_business: true,
    salary_min: 11000,
    salary_max: 16000,
    salary_period: 'monthly',
    description: 'Handle daily sales ledger entries, retail GST billing, and reconciliation. Perfect part-time role for Commerce (B.Com) graduates or final-year students looking for practical accounting experience.',
    requirements: [
      'Commerce background (B.Com or Intermediate Commerce completed or pursuing)',
      'Basic knowledge of Tally, computer billing, or Excel',
      'Honest and detail-oriented',
      'Degree completion or student welcome'
    ],
    benefits: [
      'Practical accounting experience certificate',
      'Flexible afternoon/evening shifts',
      'On-time monthly salary'
    ],
    vacancies: 2,
    contact_email: 'accounts@srikrishnatraders.in',
    contact_phone: '+91 97010 88991',
    status: 'active',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-10',
    employer_id: 'emp-tech-1',
    title: 'Principal Cloud Infrastructure Architect',
    company_name: 'Deccan Innovations',
    category: 'software',
    employment_type: 'full_time',
    location: 'HITEC City, Hyderabad',
    is_remote: false,
    is_local_business: false,
    salary_min: 90000,
    salary_max: 150000,
    salary_period: 'monthly',
    description: 'Lead high-scale multi-region Kubernetes deployments. This senior position requires completed postgraduate degree and extensive industry track record.',
    requirements: [
      'Mandatory: Minimum 8+ years hands-on production experience',
      'Graduates only (completed degree required)',
      'Advanced distributed systems architecture'
    ],
    benefits: [
      'Stock options',
      'Comprehensive family insurance'
    ],
    vacancies: 1,
    contact_email: 'leadership@deccaninnovations.com',
    contact_phone: '+91 98480 12345',
    status: 'active',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'job-11',
    employer_id: 'emp-tech-1',
    title: 'Legacy Python Scripting Engineer (Filled)',
    company_name: 'Deccan Innovations',
    category: 'software',
    employment_type: 'full_time',
    location: 'HITEC City, Hyderabad',
    is_remote: false,
    is_local_business: false,
    salary_min: 30000,
    salary_max: 45000,
    salary_period: 'monthly',
    description: 'Position is closed. Vacancy has been successfully filled.',
    requirements: ['Python', 'Linux'],
    benefits: [],
    vacancies: 0,
    contact_email: 'careers@deccaninnovations.com',
    contact_phone: '+91 98480 12345',
    status: 'closed',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const demoSeekerUser = {
  id: 'demo-seeker-001',
  email: 'candidate@vacansee.demo',
  role: 'seeker',
  full_name: 'Sai Krishna',
  phone: '+91 98765 43210',
  headline: 'Final Year B.Tech Student | Seeking Part-Time / Fresher Roles',
  bio: 'Motivated student at JNTU Hyderabad with foundational skills in web development, customer support, and tutoring. Fluent in Telugu and English.',
  skills: ['Telugu', 'English', 'React.js', 'Customer Support', 'Maths Tutoring'],
  location: 'Kukatpally, Hyderabad',
  resume_url: 'https://linkedin.com/in/demo-seeker'
};

export const demoEmployerUser = {
  id: 'emp-tech-1',
  email: 'employer@deccaninnovations.demo',
  role: 'employer',
  full_name: 'Kavitha Reddy',
  phone: '+91 98480 12345',
  headline: 'Head of Talent & Hiring at Deccan Innovations',
  bio: 'Building vibrant tech and operations teams in Hyderabad.',
  company_name: 'Deccan Innovations',
  company_website: 'https://deccaninnovations.io',
  company_description: 'Fast-growing IT solutions company building cloud & AI tools.',
  location: 'HITEC City, Hyderabad'
};

