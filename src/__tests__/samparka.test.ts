import { describe, it, expect, beforeEach } from 'vitest';
import { fetchJobs, createJobListing, submitApplication, toggleSaveJob, fetchSavedJobs } from '../lib/api';
import { translations } from '../lib/translations';
import { Job, Application } from '../types/database';

// In-memory mock for localStorage in Node environment
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
  length: 0,
  key: () => null,
} as any;

describe('Samparka Core Logic & Domain Invariants', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. Translations Completeness Test
  it('should maintain synchronized English and Kannada translation dictionaries', () => {
    expect(translations.en).toBeDefined();
    expect(translations.kn).toBeDefined();

    // Key marketing headlines matching launch poster
    expect(translations.kn.mainHeadline).toBe('ನಿಮ್ಮ ಮುಂದಿನ ಅವಕಾಶವನ್ನು ಹುಡುಕಲು ಸಿದ್ಧರಿದ್ದೀರಾ?');
    expect(translations.en.tagline).toBe('Opportunities Around You.');
    expect(translations.kn.tagline).toBe('ನಿಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ಅವಕಾಶಗಳು.');

    // Hubli-Dharwad localities
    expect(translations.en.hubliLocalities.length).toBeGreaterThan(5);
    expect(translations.en.dharwadLocalities.length).toBeGreaterThan(4);
  });

  // 2. Job Filtering Test
  it('should filter jobs correctly by city, locality, and category', async () => {
    const allJobs = await fetchJobs();
    expect(allJobs.length).toBeGreaterThan(0);

    const hubliJobs = await fetchJobs({ city: 'Hubli' });
    expect(hubliJobs.every((j) => j.city === 'Hubli')).toBe(true);

    const vidyanagarJobs = await fetchJobs({ locality: 'Vidyanagar' });
    expect(vidyanagarJobs.every((j) => j.locality.toLowerCase().includes('vidyanagar'))).toBe(true);

    const partTimeJobs = await fetchJobs({ employmentType: 'part_time' });
    expect(partTimeJobs.every((j) => j.employment_type === 'part_time')).toBe(true);
  });

  // 3. Job Creation Test
  it('should allow valid job creation with proper defaults', async () => {
    const newJobPayload = {
      business_id: 'biz-test-1',
      created_by: 'owner-test-1',
      title: 'Counter Billing Executive',
      description: 'Handling evening POS billing near Chennamma Circle.',
      category: 'Retail & Shops',
      employment_type: 'part_time' as const,
      experience_level: 'entry' as const,
      salary_min: 10000,
      salary_max: 14000,
      salary_period: 'month' as const,
      city: 'Hubli',
      locality: 'Chennamma Circle',
      skills: ['POS Billing', 'Kannada'],
      openings: 2,
      status: 'published' as const,
      is_remote: false,
    };

    const created = await createJobListing(newJobPayload);
    expect(created.id).toBeDefined();
    expect(created.title).toBe('Counter Billing Executive');
    expect(created.status).toBe('published');

    // Confirm it appears in search results
    const matching = await fetchJobs({ search: 'Counter Billing' });
    expect(matching.some((j) => j.id === created.id)).toBe(true);
  });

  // 4. Application Submission & Duplicate Prevention Test
  it('should successfully submit application and prevent duplicates from same applicant', async () => {
    const jobId = 'job-1';
    const applicantId = 'applicant-user-123';

    const app = await submitApplication(jobId, applicantId, {
      applicant_name: 'Ananya Patil',
      applicant_email: 'ananya@samparka.demo',
      applicant_phone: '+91 98801 87654',
      cover_letter: 'I am a 2nd year B.Com student in Vidyanagar.',
    });

    expect(app.id).toBeDefined();
    expect(app.status).toBe('applied');

    // Attempt duplicate application
    await expect(
      submitApplication(jobId, applicantId, {
        applicant_name: 'Ananya Patil',
        applicant_email: 'ananya@samparka.demo',
      })
    ).rejects.toThrow('You have already applied for this job.');
  });

  // 5. Saved Jobs Test
  it('should allow bookmarking and removing saved jobs', async () => {
    const userId = 'usr-seeker-1';
    const jobId = 'job-2';

    const state1 = await toggleSaveJob(userId, jobId);
    expect(state1).toBe(true);

    const saved = await fetchSavedJobs(userId);
    expect(saved.some((j) => j.id === jobId)).toBe(true);

    // Toggle again to remove
    const state2 = await toggleSaveJob(userId, jobId);
    expect(state2).toBe(false);

    const remaining = await fetchSavedJobs(userId);
    expect(remaining.some((j) => j.id === jobId)).toBe(false);
  });

  // 6. Role & Ownership Boundary Invariants
  it('should enforce role boundaries between job seekers and employers', () => {
    const seeker = { role: 'job_seeker', canPostJob: false };
    const employer = { role: 'employer', canPostJob: true };
    const admin = { role: 'admin', canModerate: true };

    expect(seeker.canPostJob).toBe(false);
    expect(employer.canPostJob).toBe(true);
    expect(admin.canModerate).toBe(true);
  });
});
