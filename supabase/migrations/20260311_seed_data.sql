-- ====================================================================
-- Vacansee Seed Data (for testing and hackathon demo)
-- Migration: 20260311_seed_data.sql
-- ====================================================================

-- Note: In production Supabase, users are created via auth.signUp.
-- This script provides realistic sample jobs that can be tied to employer profiles.

DO $$
DECLARE
    emp_tech_id UUID := 'a0000000-0000-0000-0000-000000000001';
    emp_cafe_id UUID := 'a0000000-0000-0000-0000-000000000002';
    emp_store_id UUID := 'a0000000-0000-0000-0000-000000000003';
    emp_tutor_id UUID := 'a0000000-0000-0000-0000-000000000004';
BEGIN
    -- Seed Mock Employer Profiles (in case auth is bypassed in mock/seed setup)
    INSERT INTO public.profiles (id, role, full_name, email, phone, company_name, company_website, location, headline, bio)
    VALUES 
    (emp_tech_id, 'employer', 'Kavitha Reddy', 'hr@deccaninnovations.com', '+91 98480 12345', 'Deccan Innovations', 'https://deccaninnovations.io', 'Hyderabad, Telangana', 'Talent Lead at Deccan Tech', 'Fast-growing IT solutions company building cloud & AI tools.'),
    (emp_cafe_id, 'employer', 'Suresh Varma', 'manager@roasteryco.com', '+91 98490 23456', 'The Roastery Coffee House', 'https://roasterycafe.in', 'Banjara Hills, Hyderabad', 'General Manager', 'Specialty artisan cafe with warm hospitality and great brews.'),
    (emp_store_id, 'employer', 'M. Venkatesh', 'contact@srikararetail.com', '+91 97010 34567', 'Srikara Supermart & Organics', 'https://srikararetail.com', 'Vijayawada, Andhra Pradesh', 'Store Director', 'Trusted neighborhood supermarket offering quality grocery and organic essentials.'),
    (emp_tutor_id, 'employer', 'Dr. Ananya Rao', 'info@brightmindsacademy.org', '+91 99887 45678', 'Bright Minds Learning Academy', 'https://brightmindsacademy.org', 'Visakhapatnam, Andhra Pradesh', 'Director of Academics', 'Premier evening coaching centre for school & college foundational courses.')
    ON CONFLICT (id) DO NOTHING;

    -- Seed Jobs
    INSERT INTO public.jobs (
        employer_id, title, company_name, category, employment_type, location, is_remote, is_local_business,
        salary_min, salary_max, salary_period, description, requirements, benefits, vacancies, contact_email, contact_phone, status
    ) VALUES
    (
        emp_tech_id,
        'Junior React Developer (Fresher Friendly)',
        'Deccan Innovations',
        'Software & IT',
        'full_time',
        'HITEC City, Hyderabad',
        false,
        false,
        25000, 40000, 'monthly',
        'We are seeking energetic fresh graduates with passion for React.js, modern JavaScript, and clean UI engineering. Mentorship provided by senior architects.',
        ARRAY['Basic JavaScript (ES6+)', 'Familiarity with React and Git', 'Eagerness to learn full-stack tools', 'Good communication skills'],
        ARRAY['Health insurance', 'Flexible timings', 'Annual performance bonus', 'Learning budget'],
        3,
        'careers@deccaninnovations.com',
        '+91 98480 12345',
        'active'
    ),
    (
        emp_cafe_id,
        'Weekend Barista & Counter Staff',
        'The Roastery Coffee House',
        'Hospitality & Cafe',
        'weekend',
        'Banjara Hills, Hyderabad',
        false,
        true,
        8000, 12000, 'monthly',
        'Ideal role for college students looking for weekend work (Saturday & Sunday, 8-hour shifts). Learn specialty espresso making and customer service in a high-energy environment.',
        ARRAY['College students welcome', 'Punctuality and polite manners', 'Telugu or English fluency', 'No prior experience required (training provided)'],
        ARRAY['Free gourmet coffee & meals on shift', 'Tips sharing', 'Flexible exam schedule leave'],
        4,
        'jobs@roasteryco.com',
        '+91 98490 23456',
        'active'
    ),
    (
        emp_store_id,
        'Evening Inventory & Billing Assistant',
        'Srikara Supermart & Organics',
        'Retail & Supermarket',
        'part_time',
        'Benz Circle, Vijayawada',
        false,
        true,
        9000, 14000, 'monthly',
        'Looking for honest, active staff for evening shifts (4:00 PM to 9:30 PM). Suitable for college students or freshers staying nearby.',
        ARRAY['Basic math and computer billing knowledge', 'Local Telugu speaking skills', 'High school or Degree student'],
        ARRAY['Store discount on groceries', 'Overtime incentive', 'Friendly team environment'],
        2,
        'store@srikararetail.com',
        '+91 97010 34567',
        'active'
    ),
    (
        emp_tutor_id,
        'Mathematics & Science Evening Tutor',
        'Bright Minds Learning Academy',
        'Education & Tutoring',
        'part_time',
        'MVP Colony, Visakhapatnam',
        false,
        true,
        12000, 18000, 'monthly',
        'Part-time teaching role for B.Sc / B.Tech college students or graduates to guide 8th - 10th standard students in Mathematics and Physics (5:00 PM to 8:00 PM on weekdays).',
        ARRAY['Strong fundamentals in Maths & Science', 'Fluency in Telugu & English explanation', 'Patient and encouraging teaching demeanor'],
        ARRAY['Certificate of Teaching Experience', 'Performance bonus per student results'],
        2,
        'tutors@brightmindsacademy.org',
        '+91 99887 45678',
        'active'
    ),
    (
        emp_tech_id,
        'Telugu & English Bilingual Content Reviewer',
        'Deccan Innovations',
        'Customer Support & BPO',
        'full_time',
        'Gachibowli, Hyderabad (Hybrid)',
        true,
        false,
        22000, 32000, 'monthly',
        'Evaluate and moderate user-generated digital media in Telugu and English. Great entry-level role for fresh graduates with sharp eye for detail.',
        ARRAY['Native or fluent proficiency in written Telugu and English', 'Basic typing skills', 'Degree completion in any stream'],
        ARRAY['Work from home 2 days/week', 'Comprehensive medical cover', 'Quarterly incentives'],
        5,
        'moderation@deccaninnovations.com',
        '+91 98480 12345',
        'active'
    ),
    (
        emp_cafe_id,
        'Part-Time Salon Receptionist & Appointment Coordinator',
        'Luxe Unisex Salon & Spa',
        'Beauty & Wellness',
        'part_time',
        'Madhapur, Hyderabad',
        false,
        true,
        10000, 15000, 'monthly',
        'Manage incoming customer walk-ins, phone bookings, and billing via salon POS. Clean, air-conditioned workspace.',
        ARRAY['Pleasant phone presence', 'Comfortable with basic billing software', 'Fluent in Telugu and Hindi or English'],
        ARRAY['Complimentary salon grooming perks', 'Performance incentives'],
        1,
        'hr@luxesalon.in',
        '+91 90001 88990',
        'active'
    ),
    (
        emp_tech_id,
        'Web Development & UI Intern',
        'Deccan Innovations',
        'Software & IT',
        'internship',
        'HITEC City, Hyderabad',
        false,
        false,
        12000, 18000, 'monthly',
        '3-month hands-on frontend internship building responsive web apps using React.js and modern JavaScript. Work directly alongside senior frontend engineers with possibility of pre-placement offer.',
        ARRAY['Pursuing B.Tech / B.E. or MCA in Computer Science or IT', 'Solid basics in JavaScript, HTML5, and CSS', 'Familiarity with React or modern web development', 'College students welcome'],
        ARRAY['Monthly stipend', 'Internship Certificate & Letter of Recommendation', 'Flexible college exam leaves', 'Mentorship'],
        4,
        'interns@deccaninnovations.com',
        '+91 98480 12345',
        'active'
    ),
    (
        emp_cafe_id,
        'Evening Guest Host & Cafe Steward',
        'The Roastery Coffee House',
        'Hospitality & Cafe',
        'part_time',
        'Banjara Hills, Hyderabad',
        false,
        true,
        10000, 15000, 'monthly',
        'Welcoming guests, coordinating table reservations, and serving gourmet brews during evening cafe rush hours (5:00 PM to 10:30 PM). Ideal for evening job seekers.',
        ARRAY['Available for evening shifts (5 PM - 10:30 PM)', 'Polite and courteous customer service demeanor', 'Basic spoken Telugu and English', 'Hospitality and cafe interest'],
        ARRAY['Evening dinner and beverage on shift', 'Tips pool distribution', 'Supportive local cafe crew'],
        2,
        'evening@roasteryco.com',
        '+91 98490 23456',
        'active'
    ),
    (
        emp_store_id,
        'Junior Accounts & Store Billing Assistant',
        'Sri Krishna Commercial Traders',
        'Retail & Supermarket',
        'part_time',
        'Benz Circle, Vijayawada',
        false,
        true,
        11000, 16000, 'monthly',
        'Handle daily sales ledger entries, retail GST billing, and reconciliation. Perfect part-time role for Commerce (B.Com) graduates or final-year students looking for practical accounting experience.',
        ARRAY['Commerce background (B.Com or Intermediate Commerce completed or pursuing)', 'Basic knowledge of Tally, computer billing, or Excel', 'Honest and detail-oriented', 'Degree completion or student welcome'],
        ARRAY['Practical accounting experience certificate', 'Flexible afternoon/evening shifts', 'On-time monthly salary'],
        2,
        'accounts@srikrishnatraders.in',
        '+91 97010 88991',
        'active'
    ),
    (
        emp_tech_id,
        'Principal Cloud Infrastructure Architect',
        'Deccan Innovations',
        'Software & IT',
        'full_time',
        'HITEC City, Hyderabad',
        false,
        false,
        90000, 150000, 'monthly',
        'Lead high-scale multi-region Kubernetes deployments. This senior position requires completed postgraduate degree and extensive industry track record.',
        ARRAY['Mandatory: Minimum 8+ years hands-on production experience', 'Graduates only (completed degree required)', 'Advanced distributed systems architecture'],
        ARRAY['Stock options', 'Comprehensive family insurance'],
        1,
        'leadership@deccaninnovations.com',
        '+91 98480 12345',
        'active'
    ),
    (
        emp_tech_id,
        'Legacy Python Scripting Engineer (Filled)',
        'Deccan Innovations',
        'Software & IT',
        'full_time',
        'HITEC City, Hyderabad',
        false,
        false,
        30000, 45000, 'monthly',
        'Position is closed. Vacancy has been successfully filled.',
        ARRAY['Python', 'Linux'],
        ARRAY[]::TEXT[],
        0,
        'careers@deccaninnovations.com',
        '+91 98480 12345',
        'closed'
    );
END $$;

