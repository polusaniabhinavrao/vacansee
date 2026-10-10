-- ====================================================================
-- Vacansee Database Schema and Row Level Security (RLS) Policies
-- Migration: 20260311_init_schema_and_rls.sql
-- ====================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. Profiles Table
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
-- 2. Jobs Table
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
-- 3. Applications Table
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
-- 4. Saved Jobs Table
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_saved_job UNIQUE (job_id, user_id)
);

-- --------------------------------------------------------------------
-- 5. Indexes for Performance
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

-- --------------------------------------------------------------------
-- 6. Trigger for updated_at timestamps
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_jobs_updated_at ON public.jobs;
CREATE TRIGGER set_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_applications_updated_at ON public.applications;
CREATE TRIGGER set_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- --------------------------------------------------------------------
-- 7. Trigger to automatically create profile on Auth Signup
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
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'role', 'seeker'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'company_name',
        NEW.raw_user_meta_data->>'location',
        now(),
        now()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 8. Row Level Security (RLS) Policies
-- --------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
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

-- Jobs Policies
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

-- Applications Policies
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

-- Saved Jobs Policies
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

