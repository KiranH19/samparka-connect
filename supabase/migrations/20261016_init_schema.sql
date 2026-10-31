-- ========================================================
-- SAMPARKA - Database Schema & Row Level Security (RLS)
-- Location: Hubli-Dharwad, Karnataka
-- ========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  city TEXT DEFAULT 'Hubli',
  locality TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('job_seeker', 'employer', 'admin')),
  skills TEXT[] DEFAULT '{}',
  education TEXT,
  experience_summary TEXT,
  resume_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  logo_url TEXT,
  city TEXT NOT NULL DEFAULT 'Hubli',
  locality TEXT NOT NULL,
  address TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'internship', 'contract', 'daily_wage')),
  experience_level TEXT NOT NULL DEFAULT 'entry' CHECK (experience_level IN ('no_experience_required', 'entry', 'intermediate', 'experienced')),
  salary_min INTEGER CHECK (salary_min >= 0),
  salary_max INTEGER CHECK (salary_max >= 0 AND (salary_min IS NULL OR salary_max >= salary_min)),
  salary_period TEXT NOT NULL DEFAULT 'month' CHECK (salary_period IN ('month', 'day', 'hour', 'year')),
  city TEXT NOT NULL DEFAULT 'Hubli',
  locality TEXT NOT NULL,
  work_schedule TEXT,
  skills TEXT[] DEFAULT '{}',
  openings INTEGER NOT NULL DEFAULT 1 CHECK (openings >= 1),
  application_deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'paused', 'closed', 'suspended')),
  is_remote BOOLEAN DEFAULT FALSE,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_path TEXT,
  cover_letter TEXT,
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT,
  applicant_email TEXT,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'under_review', 'shortlisted', 'rejected', 'hired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_applicant_job UNIQUE (job_id, applicant_id)
);

-- 5. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_saved_job UNIQUE (user_id, job_id)
);

-- 6. JOB REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.job_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & 500+ CONCURRENT USERS
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_jobs_status_published ON public.jobs(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_city_locality ON public.jobs(city, locality);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_business_id ON public.jobs(business_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON public.jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_job_reports_status ON public.job_reports(status);

-- ========================================================
-- HELPER FUNCTIONS FOR SECURITY & ROLES
-- ========================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Function to handle auto profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, user_type, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Samparka User'),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'job_seeker'),
    COALESCE((NEW.raw_user_meta_data->>'is_admin')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
-- Anyone can view basic public profile info (for employer or applicant display)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile; cannot self-promote to admin
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (is_admin = (SELECT is_admin FROM public.profiles WHERE id = auth.uid()))
  );

-- Admins can update any profile (e.g., toggle admin privilege)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- 2. BUSINESSES POLICIES
-- Anyone can view businesses that have published jobs or are verified
CREATE POLICY "Businesses are publicly viewable"
  ON public.businesses FOR SELECT
  USING (true);

-- Business owners can insert their own business
CREATE POLICY "Users can insert their own business"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Business owners can update their own business (cannot self-verify)
CREATE POLICY "Owners can update their own business"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (
    auth.uid() = owner_id AND
    verification_status = (SELECT verification_status FROM public.businesses WHERE id = id)
  );

-- Admins can update any business (including verification)
CREATE POLICY "Admins can update any business"
  ON public.businesses FOR UPDATE
  USING (public.is_admin());

-- Business owners can delete their own business
CREATE POLICY "Owners can delete their own business"
  ON public.businesses FOR DELETE
  USING (auth.uid() = owner_id OR public.is_admin());

-- 3. JOBS POLICIES
-- Public can view active published jobs
CREATE POLICY "Anyone can view active published jobs"
  ON public.jobs FOR SELECT
  USING (
    status = 'published' OR 
    (auth.uid() IS NOT NULL AND created_by = auth.uid()) OR 
    public.is_admin()
  );

-- Employers can insert jobs for their own business
CREATE POLICY "Employers can insert jobs for their businesses"
  ON public.jobs FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id AND owner_id = auth.uid()
    )
  );

-- Employers can update their own jobs
CREATE POLICY "Employers can update their own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = created_by OR public.is_admin())
  WITH CHECK (auth.uid() = created_by OR public.is_admin());

-- Employers can delete their own jobs
CREATE POLICY "Employers can delete their own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = created_by OR public.is_admin());

-- 4. APPLICATIONS POLICIES
-- Applicants can view their own applications
-- Employers can view applications for jobs belonging to their business
-- Admins can view all applications
CREATE POLICY "Applicants and employers can view applications"
  ON public.applications FOR SELECT
  USING (
    auth.uid() = applicant_id OR
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_id AND (j.created_by = auth.uid() OR public.is_admin())
    )
  );

-- Authenticated users can apply for published jobs
CREATE POLICY "Authenticated users can submit applications"
  ON public.applications FOR INSERT
  WITH CHECK (
    auth.uid() = applicant_id AND
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE id = job_id AND status = 'published'
    )
  );

-- Employers can update application status (e.g. Under Review, Shortlisted, Rejected, Hired)
CREATE POLICY "Employers can update application status"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_id AND (j.created_by = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.jobs j
      WHERE j.id = job_id AND (j.created_by = auth.uid() OR public.is_admin())
    )
  );

-- 5. SAVED JOBS POLICIES
-- Users can only view, add, or remove their own saved jobs
CREATE POLICY "Users manage their own saved jobs"
  ON public.saved_jobs FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. JOB REPORTS POLICIES
-- Any authenticated user can submit a job report
CREATE POLICY "Users can submit job reports"
  ON public.job_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id OR reporter_id IS NULL);

-- Only admins can view, update, or resolve job reports
CREATE POLICY "Admins can view and moderate job reports"
  ON public.job_reports FOR SELECT
  USING (public.is_admin() OR auth.uid() = reporter_id);

CREATE POLICY "Admins can update job reports"
  ON public.job_reports FOR UPDATE
  USING (public.is_admin());

-- 7. ADMIN AUDIT LOGS POLICIES
-- Only admins can read audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs FOR SELECT
  USING (public.is_admin());

-- Only admins can insert audit logs
CREATE POLICY "Admins can insert audit logs"
  ON public.admin_audit_logs FOR INSERT
  WITH CHECK (public.is_admin() AND auth.uid() = admin_id);

-- ========================================================
-- STORAGE BUCKETS SETUP (Execute in Supabase Storage SQL)
-- ========================================================
-- 1. Resumes bucket: Private
-- 2. Avatars bucket: Public
-- 3. Business-logos bucket: Public
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('resumes', 'resumes', false),
  ('avatars', 'avatars', true),
  ('business-logos', 'business-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies:
-- Resumes: Authenticated users can upload to their own folder: user_id/
CREATE POLICY "Users can upload their own resume"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Resumes: Users can read their own resume or employers who received the application can read
CREATE POLICY "Applicant and authorized employer can read resume"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' AND
    (
      auth.uid()::text = (storage.foldername(name))[1] OR
      public.is_admin() OR
      EXISTS (
        SELECT 1 FROM public.applications a
        JOIN public.jobs j ON j.id = a.job_id
        WHERE a.resume_path = name AND j.created_by = auth.uid()
      )
    )
  );

-- Avatars: Public read, owner insert/update
CREATE POLICY "Avatars are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Business Logos: Public read, owner insert/update
CREATE POLICY "Logos are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'business-logos');

CREATE POLICY "Owners can upload business logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'business-logos' AND
    auth.uid() IS NOT NULL
  );
