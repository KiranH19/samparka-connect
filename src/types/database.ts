export type UserRole = 'job_seeker' | 'employer' | 'admin';

export type EmploymentType = 'full_time' | 'part_time' | 'internship' | 'contract' | 'daily_wage';

export type ExperienceLevel = 'no_experience_required' | 'entry' | 'intermediate' | 'experienced';

export type SalaryPeriod = 'month' | 'day' | 'hour' | 'year';

export type JobStatus = 'draft' | 'published' | 'paused' | 'closed' | 'suspended';

export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'rejected' | 'hired';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string | null;
  phone?: string | null;
  city: string;
  locality?: string | null;
  user_type: UserRole;
  skills: string[];
  education?: string | null;
  experience_summary?: string | null;
  resume_url?: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  business_name: string;
  description?: string | null;
  category: string;
  logo_url?: string | null;
  city: string;
  locality: string;
  address?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  business_id: string;
  created_by: string;
  title: string;
  slug?: string | null;
  description: string;
  category: string;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_period: SalaryPeriod;
  city: string;
  locality: string;
  work_schedule?: string | null;
  skills: string[];
  openings: number;
  application_deadline?: string | null;
  status: JobStatus;
  is_remote: boolean;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  // Joined relation:
  business?: Business;
  applications_count?: number;
}

export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  resume_path?: string | null;
  cover_letter?: string | null;
  applicant_name: string;
  applicant_phone?: string | null;
  applicant_email?: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  // Joined relations:
  job?: Job;
  applicant_profile?: Profile;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  job?: Job;
}

export interface JobReport {
  id: string;
  job_id: string;
  reporter_id?: string | null;
  reason: string;
  details?: string | null;
  status: ReportStatus;
  created_at: string;
  job?: Job;
}

export interface AdminAuditLog {
  id: string;
  admin_id?: string | null;
  action: string;
  target_type: string;
  target_id?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}
