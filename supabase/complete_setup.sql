-- ====================================================================
-- VACANSEE MASTER DATABASE MIGRATION SCRIPT
-- Master File: supabase/complete_setup.sql
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 2. Profiles Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('seeker', 'employer')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    headline TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    location TEXT,
    company_name TEXT,
    company_website TEXT,
    company_description TEXT,
    resume_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- --------------------------------------------------------------------
-- 3. Jobs Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    category TEXT NOT NULL,
    employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'weekend', 'internship', 'contract')),
    location TEXT NOT NULL,
    is_remote BOOLEAN DEFAULT false NOT NULL,
    is_local_business BOOLEAN DEFAULT false NOT NULL,
    salary_min INTEGER,
    salary_max INTEGER,
    salary_period TEXT DEFAULT 'monthly' CHECK (salary_period IN ('hourly', 'daily', 'monthly', 'yearly')),
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}'::TEXT[],
    benefits TEXT[] DEFAULT '{}'::TEXT[],
    vacancies INTEGER DEFAULT 1 NOT NULL CHECK (vacancies > 0),
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- --------------------------------------------------------------------
-- 4. Applications Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_note TEXT,
    resume_link TEXT,
    contact_phone TEXT,
    status TEXT DEFAULT 'applied' NOT NULL CHECK (status IN ('applied', 'reviewing', 'shortlisted', 'rejected', 'hired')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_job_applicant UNIQUE (job_id, applicant_id)
);

-- --------------------------------------------------------------------
-- 5. Saved Jobs Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_saved_job UNIQUE (job_id, user_id)
);

-- --------------------------------------------------------------------
-- 6. Seeker Preferences Table (Questionnaire Discovery)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seeker_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    education_level TEXT NOT NULL,
    education_field TEXT,
    education_status TEXT NOT NULL CHECK (education_status IN ('studying', 'completed')),
    graduation_year INTEGER,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    interests TEXT[] DEFAULT '{}'::TEXT[],
    experience_level TEXT NOT NULL CHECK (experience_level IN ('no_experience', 'fresher', 'some_experience', 'experienced')),
    experience_details TEXT,
    work_types TEXT[] DEFAULT '{}'::TEXT[],
    preferred_sectors TEXT[] DEFAULT '{}'::TEXT[],
    preferred_city TEXT NOT NULL,
    work_mode TEXT DEFAULT 'no_preference' CHECK (work_mode IN ('onsite', 'hybrid', 'remote', 'no_preference')),
    max_commute_km INTEGER,
    available_days TEXT[] DEFAULT '{}'::TEXT[],
    available_shifts TEXT[] DEFAULT '{}'::TEXT[],
    expected_salary_min INTEGER,
    completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_seeker_preferences UNIQUE (user_id)
);

-- --------------------------------------------------------------------
-- 7. Performance Indexes
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant_id ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON public.saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_seeker_preferences_user_id ON public.seeker_preferences(user_id);

-- --------------------------------------------------------------------
-- 8. Automatic Profile Creation Trigger on Auth Signup
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        role,
        full_name,
        email,
        phone,
        company_name,
        location,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'seeker'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'company_name',
        NEW.raw_user_meta_data->>'location',
        now(),
        now()
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 9. Security Trigger: Prevent Self-Escalation of User Role
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.role IS NOT NULL AND NEW.role <> OLD.role AND auth.role() = 'authenticated') THEN
        RAISE EXCEPTION 'Role changes cannot be executed by client requests';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- --------------------------------------------------------------------
-- 10. Enable Row Level Security (RLS) on all tables
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seeker_preferences ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 11. Profiles RLS Policies
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- 12. Jobs RLS Policies
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Active jobs viewable by anyone, unlisted by owner" ON public.jobs;
CREATE POLICY "Active jobs viewable by anyone, unlisted by owner"
ON public.jobs FOR SELECT
USING (status = 'active' OR auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can insert jobs" ON public.jobs;
CREATE POLICY "Employers can insert jobs"
ON public.jobs FOR INSERT
WITH CHECK (
    auth.uid() = employer_id 
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'employer'
    )
);

DROP POLICY IF EXISTS "Employers can update their own jobs" ON public.jobs;
CREATE POLICY "Employers can update their own jobs"
ON public.jobs FOR UPDATE
USING (auth.uid() = employer_id);

DROP POLICY IF EXISTS "Employers can delete their own jobs" ON public.jobs;
CREATE POLICY "Employers can delete their own jobs"
ON public.jobs FOR DELETE
USING (auth.uid() = employer_id);

-- --------------------------------------------------------------------
-- 13. Applications RLS Policies
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Seekers can view own applications, Employers view job applications" ON public.applications;
CREATE POLICY "Seekers can view own applications, Employers view job applications"
ON public.applications FOR SELECT
USING (
    auth.uid() = applicant_id 
    OR EXISTS (
        SELECT 1 FROM public.jobs 
        WHERE jobs.id = applications.job_id AND jobs.employer_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Job seekers can submit applications" ON public.applications;
CREATE POLICY "Job seekers can submit applications"
ON public.applications FOR INSERT
WITH CHECK (
    auth.uid() = applicant_id 
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'seeker'
    )
);

DROP POLICY IF EXISTS "Employers can update application status for their jobs" ON public.applications;
CREATE POLICY "Employers can update application status for their jobs"
ON public.applications FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.jobs 
        WHERE jobs.id = applications.job_id AND jobs.employer_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Seekers can withdraw pending application" ON public.applications;
CREATE POLICY "Seekers can withdraw pending application"
ON public.applications FOR DELETE
USING (auth.uid() = applicant_id AND status = 'applied');

-- --------------------------------------------------------------------
-- 14. Saved Jobs RLS Policies
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own saved jobs" ON public.saved_jobs;
CREATE POLICY "Users can view their own saved jobs"
ON public.saved_jobs FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save jobs" ON public.saved_jobs;
CREATE POLICY "Users can save jobs"
ON public.saved_jobs FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove saved jobs" ON public.saved_jobs;
CREATE POLICY "Users can remove saved jobs"
ON public.saved_jobs FOR DELETE
USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 15. Seeker Preferences RLS Policies
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own seeker preferences" ON public.seeker_preferences;
CREATE POLICY "Users can view their own seeker preferences"
ON public.seeker_preferences FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own seeker preferences" ON public.seeker_preferences;
CREATE POLICY "Users can insert their own seeker preferences"
ON public.seeker_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own seeker preferences" ON public.seeker_preferences;
CREATE POLICY "Users can update their own seeker preferences"
ON public.seeker_preferences FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own seeker preferences" ON public.seeker_preferences;
CREATE POLICY "Users can delete their own seeker preferences"
ON public.seeker_preferences FOR DELETE
USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 16. Optional Storage Setup (for resume document uploads if used)
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can view their own uploaded resumes" ON storage.objects;
CREATE POLICY "Users can view their own uploaded resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- --------------------------------------------------------------------
-- 17. Seed Data (Initial sample employers and active vacancies)
-- --------------------------------------------------------------------
DO $$
DECLARE
    emp_tech_id UUID := 'a0000000-0000-0000-0000-000000000001';
    emp_cafe_id UUID := 'a0000000-0000-0000-0000-000000000002';
    emp_store_id UUID := 'a0000000-0000-0000-0000-000000000003';
    emp_tutor_id UUID := 'a0000000-0000-0000-0000-000000000004';
BEGIN
    INSERT INTO public.profiles (id, role, full_name, email, phone, company_name, company_website, location, headline, bio)
    VALUES 
    (emp_tech_id, 'employer', 'Kavitha Reddy', 'hr@deccaninnovations.com', '+91 98480 12345', 'Deccan Innovations', 'https://deccaninnovations.io', 'HITEC City, Hyderabad', 'Talent Lead at Deccan Tech', 'Fast-growing IT solutions company building cloud & AI tools.'),
    (emp_cafe_id, 'employer', 'Suresh Varma', 'manager@roasteryco.com', '+91 98490 23456', 'The Roastery Coffee House', 'https://roasterycafe.in', 'Banjara Hills, Hyderabad', 'General Manager', 'Specialty artisan cafe with warm hospitality and great brews.'),
    (emp_store_id, 'employer', 'M. Venkatesh', 'contact@srikararetail.com', '+91 97010 34567', 'Sri Krishna Commercial Traders', 'https://srikrishnatraders.in', 'Benz Circle, Vijayawada', 'Store Director', 'Trusted neighborhood supermarket offering quality grocery and organic essentials.'),
    (emp_tutor_id, 'employer', 'Dr. Ananya Rao', 'info@brightmindsacademy.org', '+91 99887 45678', 'Bright Minds Learning Academy', 'https://brightmindsacademy.org', 'Visakhapatnam, Andhra Pradesh', 'Director of Academics', 'Premier evening coaching centre for school & college foundational courses.')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.jobs (
        id, employer_id, title, company_name, category, employment_type, location, is_remote, is_local_business,
        salary_min, salary_max, salary_period, description, requirements, benefits, vacancies, contact_email, contact_phone, status
    ) VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        emp_tech_id,
        'Web Development & UI Intern',
        'Deccan Innovations',
        'software',
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
        'b0000000-0000-0000-0000-000000000002',
        emp_tech_id,
        'Junior React Developer (Fresher Friendly)',
        'Deccan Innovations',
        'software',
        'full_time',
        'HITEC City, Hyderabad',
        false,
        false,
        25000, 40000, 'monthly',
        'We are seeking energetic fresh graduates with a passion for React.js, modern JavaScript, and clean UI engineering. Mentorship is provided by senior architects.',
        ARRAY['Basic JavaScript (ES6+)', 'Familiarity with React and Git', 'Eagerness to learn full-stack tools', 'Good communication skills'],
        ARRAY['Health insurance', 'Flexible timings', 'Annual performance bonus', 'Learning budget'],
        3,
        'careers@deccaninnovations.com',
        '+91 98480 12345',
        'active'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        emp_cafe_id,
        'Evening Guest Host & Cafe Steward',
        'The Roastery Coffee House',
        'hospitality',
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
        'b0000000-0000-0000-0000-000000000004',
        emp_cafe_id,
        'Weekend Barista & Counter Staff',
        'The Roastery Coffee House',
        'hospitality',
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
        'b0000000-0000-0000-0000-000000000005',
        emp_store_id,
        'Junior Accounts & Store Billing Assistant',
        'Sri Krishna Commercial Traders',
        'retail',
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
        'b0000000-0000-0000-0000-000000000006',
        emp_tutor_id,
        'Mathematics & Science Evening Tutor',
        'Bright Minds Learning Academy',
        'education',
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
        'b0000000-0000-0000-0000-000000000007',
        emp_tech_id,
        'Principal Cloud Infrastructure Architect',
        'Deccan Innovations',
        'software',
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
        'b0000000-0000-0000-0000-000000000008',
        emp_tech_id,
        'Legacy Python Scripting Engineer (Filled)',
        'Deccan Innovations',
        'software',
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
    )
    ON CONFLICT (id) DO NOTHING;
END $$;

