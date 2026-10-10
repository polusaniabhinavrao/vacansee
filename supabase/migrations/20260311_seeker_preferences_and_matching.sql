-- ====================================================================
-- Vacansee Seeker Preferences & Matching Migration
-- Migration: 20260311_seeker_preferences_and_matching.sql
-- ====================================================================

-- 1. Create table for storing questionnaire responses deterministically
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.seeker_preferences ENABLE ROW LEVEL SECURITY;

-- 3. Row Level Security Policies (Seekers can only access and modify their own preferences)
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

-- 4. Index for fast querying by user
CREATE INDEX IF NOT EXISTS idx_seeker_preferences_user_id ON public.seeker_preferences(user_id);

