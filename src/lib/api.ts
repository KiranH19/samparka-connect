import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import {
  Job,
  Business,
  Application,
  SavedJob,
  JobReport,
  ApplicationStatus,
  VerificationStatus,
  JobStatus,
} from '../types/database';

export const DEMO_BUSINESSES: Business[] = [
  {
    id: 'biz-1',
    owner_id: 'owner-1',
    business_name: 'Kamat Enterprises & Retail Store',
    description: 'Leading regional retail and consumer electronics distributor near Chennamma Circle, Hubli.',
    category: 'Retail & Shops',
    logo_url: null,
    city: 'Hubli',
    locality: 'Chennamma Circle',
    address: 'Near Chennamma Circle, PB Road, Hubli',
    contact_phone: '+91 98801 12345',
    contact_email: 'info@kamatretail.demo',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'biz-2',
    owner_id: 'owner-2',
    business_name: 'Chai & Charcha Cafe',
    description: 'Popular artisan cafe and student hangout spot in the heart of Vidyanagar college hub.',
    category: 'Restaurants & Cafes',
    logo_url: null,
    city: 'Hubli',
    locality: 'Vidyanagar',
    address: 'Shirur Park Road, Vidyanagar, Hubli',
    contact_phone: '+91 98802 23456',
    contact_email: 'contact@chaicharcha.demo',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'biz-3',
    owner_id: 'owner-3',
    business_name: 'Hubli Precision Engineering Works',
    description: 'ISO-certified precision metal fabrication and automotive parts supplier in Gokul Road Industrial Estate.',
    category: 'Manufacturing & Industrial',
    logo_url: null,
    city: 'Hubli',
    locality: 'Gokul Road',
    address: 'Plot 42, KIADB Industrial Area, Gokul Road, Hubli',
    contact_phone: '+91 98803 34567',
    contact_email: 'careers@hubliprecision.demo',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'biz-4',
    owner_id: 'owner-4',
    business_name: 'Malnad Cloud Solutions',
    description: 'SaaS and IT services company located at Aryabhata Tech Park, Navanagar Hubli.',
    category: 'IT & Office',
    logo_url: null,
    city: 'Hubli',
    locality: 'Navanagar',
    address: 'Aryabhata Tech Park, Navanagar, Hubli',
    contact_phone: '+91 98804 45678',
    contact_email: 'talent@malnadcloud.demo',
    verification_status: 'verified',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_JOBS: Job[] = [
  {
    id: 'job-1',
    business_id: 'biz-1',
    created_by: 'owner-1',
    title: 'Retail Sales Executive & Counter Assistant',
    slug: 'retail-sales-executive-kamat',
    description: 'Join our friendly retail showroom team at Chennamma Circle. Responsibilities include customer greeting, explaining electronics gadgets, inventory tallying, and cashiering. College students welcomed for morning or evening batches.',
    category: 'Retail & Shops',
    employment_type: 'part_time',
    experience_level: 'no_experience_required',
    salary_min: 9000,
    salary_max: 14000,
    salary_period: 'month',
    city: 'Hubli',
    locality: 'Chennamma Circle',
    work_schedule: '4:00 PM – 9:00 PM (Flexible Student Shift)',
    skills: ['Customer Service', 'Cashier Billing', 'Stock Inventory', 'Kannada & English'],
    openings: 3,
    application_deadline: null,
    status: 'published',
    is_remote: false,
    is_demo: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    business: DEMO_BUSINESSES[0],
    applications_count: 5,
  },
  {
    id: 'job-2',
    business_id: 'biz-2',
    created_by: 'owner-2',
    title: 'Cafe Barista & Front Desk Host',
    slug: 'cafe-barista-chai-charcha',
    description: 'We are seeking an energetic Barista & Host for our student cafe in Vidyanagar. Excellent opportunity for local students looking to earn while studying. On-the-job coffee brewing and POS training provided.',
    category: 'Restaurants & Cafes',
    employment_type: 'part_time',
    experience_level: 'entry',
    salary_min: 8000,
    salary_max: 12000,
    salary_period: 'month',
    city: 'Hubli',
    locality: 'Vidyanagar',
    work_schedule: 'Evening Shifts (5 PM - 10 PM) or Weekend Batches',
    skills: ['Beverage Preparation', 'Hospitality', 'Cash Handling', 'Friendly Demeanor'],
    openings: 2,
    application_deadline: null,
    status: 'published',
    is_remote: false,
    is_demo: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    business: DEMO_BUSINESSES[1],
    applications_count: 8,
  },
  {
    id: 'job-3',
    business_id: 'biz-3',
    created_by: 'owner-3',
    title: 'Junior Machine Operator & Assembly Technician',
    slug: 'machine-operator-hubli-precision',
    description: 'Precision component assembly, machine setup, and quality checking on Gokul Road. ITI or Diploma holders in Mechanical/Electrical given preference. Full-time benefits include PF, ESI, and attendance incentives.',
    category: 'Manufacturing & Industrial',
    employment_type: 'full_time',
    experience_level: 'entry',
    salary_min: 16000,
    salary_max: 22000,
    salary_period: 'month',
    city: 'Hubli',
    locality: 'Gokul Road',
    work_schedule: 'General Shift: 9:00 AM – 5:30 PM',
    skills: ['Machine Operation', 'Quality Inspection', 'Industrial Safety', 'Blueprint Reading'],
    openings: 4,
    application_deadline: null,
    status: 'published',
    is_remote: false,
    is_demo: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    business: DEMO_BUSINESSES[2],
    applications_count: 3,
  },
  {
    id: 'job-4',
    business_id: 'biz-4',
    created_by: 'owner-4',
    title: 'Digital Marketing & Social Media Coordinator',
    slug: 'digital-marketing-coordinator-malnad',
    description: 'Manage local brand outreach, Instagram reels, local SEO, and Kannada copywriting for retail and business clients. Modern office environment at Aryabhata Tech Park, Navanagar.',
    category: 'IT & Office',
    employment_type: 'full_time',
    experience_level: 'intermediate',
    salary_min: 18000,
    salary_max: 26000,
    salary_period: 'month',
    city: 'Hubli',
    locality: 'Navanagar',
    work_schedule: 'Monday to Friday: 10:00 AM – 6:30 PM',
    skills: ['Canva', 'Social Media', 'Kannada Copywriting', 'Local SEO', 'Content Strategy'],
    openings: 2,
    application_deadline: null,
    status: 'published',
    is_remote: false,
    is_demo: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    business: DEMO_BUSINESSES[3],
    applications_count: 11,
  },
  {
    id: 'job-5',
    business_id: 'biz-1',
    created_by: 'owner-1',
    title: 'Delivery & Route Executive (Dharwad Area)',
    slug: 'delivery-route-executive-dharwad',
    description: 'Deliver retail orders and packages across key Dharwad localities including Line Bazar, Sadhankeri, and Toll Naka. Two-wheeler driving license required. Fuel allowance + delivery incentives included.',
    category: 'Logistics & Delivery',
    employment_type: 'full_time',
    experience_level: 'no_experience_required',
    salary_min: 14000,
    salary_max: 19000,
    salary_period: 'month',
    city: 'Dharwad',
    locality: 'Line Bazar',
    work_schedule: 'Day Shift: 8:30 AM – 4:30 PM',
    skills: ['Two-Wheeler License', 'Dharwad Local Routes', 'Smartphone Navigation', 'Punctuality'],
    openings: 5,
    application_deadline: null,
    status: 'published',
    is_remote: false,
    is_demo: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    business: DEMO_BUSINESSES[0],
    applications_count: 6,
  },
  {
    id: 'job-6',
    business_id: 'biz-2',
    created_by: 'owner-2',
    title: 'Accountant & Billing Clerk',
    slug: 'accountant-billing-keshwapur',
    description: 'Maintain day-to-day accounts, vendor billing, Tally data entry, cash reconciliation, and assist with monthly GST filings for food & hospitality operations.',
    category: 'IT & Office',
    employment_type: 'full_time',
    experience_level: 'intermediate',
    salary_min: 18000,
    salary_max: 24000,
    salary_period: 'month',
    city: 'Hubli',
    locality: 'Keshwapur',
    work_schedule: '10:00 AM – 7:00 PM',
    skills: ['Tally Prime', 'MS Excel', 'GST Filing', 'Invoicing'],
    openings: 1,
    application_deadline: null,
    status: 'published',
    is_remote: false,
    is_demo: true,
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    business: DEMO_BUSINESSES[1],
    applications_count: 4,
  },
];

const STORAGE_JOBS_KEY = 'samparka_local_jobs';
const STORAGE_BIZ_KEY = 'samparka_local_biz';
const STORAGE_APPS_KEY = 'samparka_local_apps';
const STORAGE_SAVED_KEY = 'samparka_local_saved';
const STORAGE_REPORTS_KEY = 'samparka_local_reports';

const isTestEnv = typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST === 'true');

const getLocalJobs = (): Job[] => {
  try {
    const saved = localStorage.getItem(STORAGE_JOBS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEMO_JOBS;
};

let initialSeedPromise: Promise<void> | null = null;

// Auto-seed initial demo jobs and businesses into Firestore if empty
export const seedInitialDataIfEmpty = async (): Promise<void> => {
  if (isTestEnv) return;
  if (initialSeedPromise) return initialSeedPromise;

  initialSeedPromise = (async () => {
    try {
      const snap = await getDocs(query(collection(db, 'jobs'), orderBy('createdAt', 'desc')));
      if (snap.empty) {
        const batch = writeBatch(db);
        for (const b of DEMO_BUSINESSES) {
          batch.set(doc(db, 'businesses', b.id), {
            id: b.id,
            ownerId: b.owner_id,
            businessName: b.business_name,
            description: b.description,
            category: b.category,
            logoUrl: b.logo_url,
            city: b.city,
            locality: b.locality,
            address: b.address,
            contactPhone: b.contact_phone,
            contactEmail: b.contact_email,
            verificationStatus: b.verification_status,
            createdAt: b.created_at,
            updatedAt: b.updated_at,
          });
        }
        for (const j of DEMO_JOBS) {
          batch.set(doc(db, 'jobs', j.id), {
            id: j.id,
            businessId: j.business_id,
            createdBy: j.created_by,
            title: j.title,
            slug: j.slug,
            description: j.description,
            category: j.category,
            employmentType: j.employment_type,
            experienceLevel: j.experience_level,
            salaryMin: j.salary_min || 0,
            salaryMax: j.salary_max || 0,
            salaryPeriod: j.salary_period,
            city: j.city,
            locality: j.locality,
            workSchedule: j.work_schedule || '',
            skills: j.skills || [],
            openings: j.openings || 1,
            status: j.status,
            isRemote: j.is_remote,
            applicationsCount: j.applications_count || 0,
            createdAt: j.created_at,
            updatedAt: j.updated_at,
            publishedAt: j.published_at || j.created_at,
          });
        }
        await batch.commit();
        console.log('Successfully seeded initial Hubli-Dharwad businesses and jobs into Firestore.');
      }
    } catch (e) {
      console.warn('Initial Firestore seed notice:', e);
    }
  })();

  return initialSeedPromise;
};

if (!isTestEnv) {
  seedInitialDataIfEmpty().catch(() => {});
}

// Data mapping helpers
const mapFirestoreJobToJob = (id: string, data: any, bizMap?: Map<string, Business>): Job => {
  const bizId = data.businessId || data.business_id;
  const business = bizMap?.get(bizId) || (data.business ? {
    id: data.business.id || bizId,
    owner_id: data.business.ownerId || data.business.owner_id,
    business_name: data.business.businessName || data.business.business_name,
    category: data.business.category,
    city: data.business.city,
    locality: data.business.locality,
    verification_status: data.business.verificationStatus || data.business.verification_status || 'verified',
    created_at: data.business.createdAt || new Date().toISOString(),
    updated_at: data.business.updatedAt || new Date().toISOString(),
  } : DEMO_BUSINESSES.find(b => b.id === bizId));

  return {
    id: data.id || id,
    business_id: bizId,
    created_by: data.createdBy || data.created_by || 'owner-1',
    title: data.title,
    slug: data.slug || null,
    description: data.description,
    category: data.category,
    employment_type: data.employmentType || data.employment_type || 'full_time',
    experience_level: data.experienceLevel || data.experience_level || 'no_experience_required',
    salary_min: data.salaryMin ?? data.salary_min ?? null,
    salary_max: data.salaryMax ?? data.salary_max ?? null,
    salary_period: data.salaryPeriod || data.salary_period || 'month',
    city: data.city || 'Hubli',
    locality: data.locality || 'Vidyanagar',
    work_schedule: data.workSchedule || data.work_schedule || null,
    skills: data.skills || [],
    openings: data.openings || 1,
    status: data.status || 'published',
    is_remote: !!(data.isRemote ?? data.is_remote),
    is_demo: !!data.is_demo,
    created_at: data.createdAt || data.created_at || new Date().toISOString(),
    updated_at: data.updatedAt || data.updated_at || new Date().toISOString(),
    published_at: data.publishedAt || data.published_at || data.createdAt || null,
    business,
    applications_count: data.applicationsCount ?? data.applications_count ?? 0,
  };
};

const mapFirestoreBusiness = (id: string, data: any): Business => ({
  id: data.id || id,
  owner_id: data.ownerId || data.owner_id,
  business_name: data.businessName || data.business_name,
  description: data.description || null,
  category: data.category || 'Retail & Shops',
  logo_url: data.logoUrl || data.logo_url || null,
  city: data.city || 'Hubli',
  locality: data.locality || 'Vidyanagar',
  address: data.address || null,
  contact_phone: data.contactPhone || data.contact_phone || null,
  contact_email: data.contactEmail || data.contact_email || null,
  verification_status: data.verificationStatus || data.verification_status || 'pending',
  created_at: data.createdAt || data.created_at || new Date().toISOString(),
  updated_at: data.updatedAt || data.updated_at || new Date().toISOString(),
});

// =========================================================================
// JOB QUERIES & MUTATIONS
// =========================================================================

export interface JobFilterParams {
  search?: string;
  city?: string;
  locality?: string;
  category?: string;
  employmentType?: string;
  minSalary?: number;
  maxSalary?: number;
  isRemote?: boolean;
  sortBy?: 'newest' | 'salary_high';
}

export const fetchJobs = async (filters: JobFilterParams = {}): Promise<Job[]> => {
  let jobs: Job[] = [];

  if (isTestEnv) {
    jobs = getLocalJobs();
  } else {
    try {
      const jobsRef = collection(db, 'jobs');
      const snap = await getDocs(jobsRef);

      if (!snap.empty) {
        const bizSnap = await getDocs(collection(db, 'businesses'));
        const bizMap = new Map<string, Business>();
        bizSnap.docs.forEach(docSnap => {
          bizMap.set(docSnap.id, mapFirestoreBusiness(docSnap.id, docSnap.data()));
        });

        jobs = snap.docs
          .map(d => mapFirestoreJobToJob(d.id, d.data(), bizMap))
          .filter(j => j.status === 'published');
      }

      if (jobs.length === 0) {
        jobs = DEMO_JOBS.slice();
      }
    } catch (error) {
      console.warn('Firestore fetchJobs fallback to demo data:', error);
      jobs = DEMO_JOBS.slice();
    }
  }

  // Filter application
  if (filters.search && filters.search.trim()) {
    const s = filters.search.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(s) ||
      j.description.toLowerCase().includes(s) ||
      j.locality.toLowerCase().includes(s) ||
      j.skills.some(skill => skill.toLowerCase().includes(s))
    );
  }
  if (filters.city && filters.city !== 'all') {
    jobs = jobs.filter(j => j.city.toLowerCase() === filters.city!.toLowerCase());
  }
  if (filters.locality && filters.locality !== 'all') {
    jobs = jobs.filter(j => j.locality.toLowerCase().includes(filters.locality!.toLowerCase()));
  }
  if (filters.category && filters.category !== 'all') {
    jobs = jobs.filter(j => j.category === filters.category);
  }
  if (filters.employmentType && filters.employmentType !== 'all') {
    jobs = jobs.filter(j => j.employment_type === filters.employmentType);
  }
  if (filters.isRemote) {
    jobs = jobs.filter(j => j.is_remote);
  }
  if (filters.minSalary) {
    jobs = jobs.filter(j => (j.salary_max || j.salary_min || 0) >= filters.minSalary!);
  }
  if (filters.maxSalary) {
    jobs = jobs.filter(j => (j.salary_min || 0) <= filters.maxSalary!);
  }

  if (filters.sortBy === 'salary_high') {
    jobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
  } else {
    jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return jobs;
};

export const fetchJobById = async (id: string): Promise<Job | null> => {
  if (isTestEnv) {
    return getLocalJobs().find(j => j.id === id) || null;
  }

  try {
    const jobSnap = await getDoc(doc(db, 'jobs', id));
    if (jobSnap.exists()) {
      const data = jobSnap.data();
      const bizId = data.businessId || data.business_id;
      let biz: Business | undefined;
      if (bizId) {
        const bizSnap = await getDoc(doc(db, 'businesses', bizId));
        if (bizSnap.exists()) {
          biz = mapFirestoreBusiness(bizSnap.id, bizSnap.data());
        }
      }
      return mapFirestoreJobToJob(jobSnap.id, data, biz ? new Map([[bizId, biz]]) : undefined);
    }
  } catch (error) {
    console.warn('Firestore fetchJobById error:', error);
  }

  return DEMO_JOBS.find(j => j.id === id) || null;
};

export const createJobListing = async (
  jobData: Omit<Job, 'id' | 'created_at' | 'updated_at' | 'business'>
): Promise<Job> => {
  const jobId = `job-${Date.now()}`;
  const now = new Date().toISOString();

  const firestorePayload = {
    id: jobId,
    businessId: jobData.business_id,
    createdBy: jobData.created_by,
    title: jobData.title,
    slug: jobData.slug || jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: jobData.description,
    category: jobData.category,
    employmentType: jobData.employment_type,
    experienceLevel: jobData.experience_level,
    salaryMin: jobData.salary_min || 0,
    salaryMax: jobData.salary_max || 0,
    salaryPeriod: jobData.salary_period,
    city: jobData.city,
    locality: jobData.locality,
    workSchedule: jobData.work_schedule || '',
    skills: jobData.skills || [],
    openings: jobData.openings || 1,
    status: jobData.status,
    isRemote: !!jobData.is_remote,
    applicationsCount: 0,
    createdAt: now,
    updatedAt: now,
    publishedAt: jobData.status === 'published' ? now : null,
  };

  if (isTestEnv) {
    const current = getLocalJobs();
    const newJob = mapFirestoreJobToJob(jobId, firestorePayload);
    localStorage.setItem(STORAGE_JOBS_KEY, JSON.stringify([newJob, ...current]));
    return newJob;
  }

  try {
    await setDoc(doc(db, 'jobs', jobId), firestorePayload);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `jobs/${jobId}`);
  }

  return mapFirestoreJobToJob(jobId, firestorePayload);
};

export const updateJobListing = async (id: string, updates: Partial<Job>): Promise<Job> => {
  const now = new Date().toISOString();

  if (isTestEnv) {
    const jobs = getLocalJobs();
    const idx = jobs.findIndex(j => j.id === id);
    if (idx === -1) throw new Error('Job not found');
    jobs[idx] = { ...jobs[idx], ...updates, updated_at: now };
    localStorage.setItem(STORAGE_JOBS_KEY, JSON.stringify(jobs));
    return jobs[idx];
  }

  const firestoreUpdates: Record<string, any> = {
    updatedAt: now,
  };

  if (updates.title !== undefined) firestoreUpdates.title = updates.title;
  if (updates.description !== undefined) firestoreUpdates.description = updates.description;
  if (updates.category !== undefined) firestoreUpdates.category = updates.category;
  if (updates.employment_type !== undefined) firestoreUpdates.employmentType = updates.employment_type;
  if (updates.experience_level !== undefined) firestoreUpdates.experienceLevel = updates.experience_level;
  if (updates.salary_min !== undefined) firestoreUpdates.salaryMin = updates.salary_min;
  if (updates.salary_max !== undefined) firestoreUpdates.salaryMax = updates.salary_max;
  if (updates.salary_period !== undefined) firestoreUpdates.salaryPeriod = updates.salary_period;
  if (updates.city !== undefined) firestoreUpdates.city = updates.city;
  if (updates.locality !== undefined) firestoreUpdates.locality = updates.locality;
  if (updates.work_schedule !== undefined) firestoreUpdates.workSchedule = updates.work_schedule;
  if (updates.skills !== undefined) firestoreUpdates.skills = updates.skills;
  if (updates.openings !== undefined) firestoreUpdates.openings = updates.openings;
  if (updates.status !== undefined) firestoreUpdates.status = updates.status;
  if (updates.is_remote !== undefined) firestoreUpdates.isRemote = updates.is_remote;

  try {
    await updateDoc(doc(db, 'jobs', id), firestoreUpdates);
    const updated = await fetchJobById(id);
    if (!updated) throw new Error('Job not found after update');
    return updated;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `jobs/${id}`);
  }
};

export const deleteJobListing = async (id: string): Promise<void> => {
  if (isTestEnv) {
    const jobs = getLocalJobs().filter(j => j.id !== id);
    localStorage.setItem(STORAGE_JOBS_KEY, JSON.stringify(jobs));
    return;
  }

  try {
    await deleteDoc(doc(db, 'jobs', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `jobs/${id}`);
  }
};

export const fetchEmployerJobs = async (userId: string): Promise<Job[]> => {
  if (isTestEnv) {
    return getLocalJobs().filter(j => j.created_by === userId || j.created_by.startsWith('owner-'));
  }

  try {
    const q = query(collection(db, 'jobs'), where('createdBy', '==', userId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const bizSnap = await getDocs(collection(db, 'businesses'));
      const bizMap = new Map<string, Business>();
      bizSnap.docs.forEach(docSnap => {
        bizMap.set(docSnap.id, mapFirestoreBusiness(docSnap.id, docSnap.data()));
      });
      return snap.docs.map(d => mapFirestoreJobToJob(d.id, d.data(), bizMap));
    }
  } catch (error) {
    console.warn('Firestore fetchEmployerJobs error:', error);
  }

  return DEMO_JOBS.slice(0, 3);
};

// =========================================================================
// APPLICATIONS QUERIES & MUTATIONS
// =========================================================================

export const submitApplication = async (
  jobId: string,
  applicantId: string,
  payload: {
    applicant_name: string;
    applicant_email: string;
    applicant_phone?: string;
    cover_letter?: string;
    resume_path?: string;
  }
): Promise<Application> => {
  const appId = `app-${Date.now()}`;
  const now = new Date().toISOString();

  if (isTestEnv) {
    const raw = localStorage.getItem(STORAGE_APPS_KEY);
    const apps: Application[] = raw ? JSON.parse(raw) : [];
    if (apps.some(a => a.job_id === jobId && a.applicant_id === applicantId)) {
      throw new Error('You have already applied for this job.');
    }
    const newApp: Application = {
      id: appId,
      job_id: jobId,
      applicant_id: applicantId,
      applicant_name: payload.applicant_name,
      applicant_email: payload.applicant_email,
      applicant_phone: payload.applicant_phone || null,
      cover_letter: payload.cover_letter || null,
      resume_path: payload.resume_path || null,
      status: 'applied',
      created_at: now,
      updated_at: now,
    };
    apps.push(newApp);
    localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(apps));
    return newApp;
  }

  const firestoreData = {
    id: appId,
    jobId,
    applicantId,
    applicantName: payload.applicant_name,
    applicantEmail: payload.applicant_email,
    applicantPhone: payload.applicant_phone || '',
    coverLetter: payload.cover_letter || '',
    resumePath: payload.resume_path || '',
    status: 'applied',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'applications', appId), firestoreData);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `applications/${appId}`);
  }

  return {
    id: appId,
    job_id: jobId,
    applicant_id: applicantId,
    applicant_name: payload.applicant_name,
    applicant_email: payload.applicant_email,
    applicant_phone: payload.applicant_phone || null,
    cover_letter: payload.cover_letter || null,
    resume_path: payload.resume_path || null,
    status: 'applied',
    created_at: now,
    updated_at: now,
  };
};

export const fetchUserApplications = async (userId: string): Promise<Application[]> => {
  try {
    const q = query(collection(db, 'applications'), where('applicantId', '==', userId));
    const snap = await getDocs(q);
    const apps: Application[] = [];

    for (const d of snap.docs) {
      const data = d.data();
      const job = await fetchJobById(data.jobId);
      apps.push({
        id: d.id,
        job_id: data.jobId,
        applicant_id: data.applicantId,
        applicant_name: data.applicantName,
        applicant_email: data.applicantEmail,
        applicant_phone: data.applicantPhone || null,
        cover_letter: data.coverLetter || null,
        resume_path: data.resumePath || null,
        status: data.status,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        job: job || undefined,
      });
    }

    return apps;
  } catch (error) {
    console.warn('Firestore fetchUserApplications error:', error);
    return [];
  }
};

export const fetchJobApplicationsForEmployer = async (jobId: string): Promise<Application[]> => {
  try {
    const q = query(collection(db, 'applications'), where('jobId', '==', jobId));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        id: d.id,
        job_id: data.jobId,
        applicant_id: data.applicantId,
        applicant_name: data.applicantName,
        applicant_email: data.applicantEmail,
        applicant_phone: data.applicantPhone || null,
        cover_letter: data.coverLetter || null,
        resume_path: data.resumePath || null,
        status: data.status,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
      };
    });
  } catch (error) {
    console.warn('Firestore fetchJobApplicationsForEmployer error:', error);
    return [];
  }
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus
): Promise<Application> => {
  const now = new Date().toISOString();
  try {
    await updateDoc(doc(db, 'applications', applicationId), {
      status,
      updatedAt: now,
    });
    const snap = await getDoc(doc(db, 'applications', applicationId));
    const data = snap.data()!;
    return {
      id: applicationId,
      job_id: data.jobId,
      applicant_id: data.applicantId,
      applicant_name: data.applicantName,
      applicant_email: data.applicantEmail,
      applicant_phone: data.applicantPhone,
      cover_letter: data.coverLetter,
      resume_path: data.resumePath,
      status,
      created_at: data.createdAt,
      updated_at: now,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `applications/${applicationId}`);
  }
};

// =========================================================================
// SAVED JOBS
// =========================================================================

export const fetchSavedJobs = async (userId: string): Promise<Job[]> => {
  if (isTestEnv) {
    const raw = localStorage.getItem(STORAGE_SAVED_KEY);
    const saved: SavedJob[] = raw ? JSON.parse(raw) : [];
    const userJobIds = saved.filter(s => s.user_id === userId).map(s => s.job_id);
    const allJobs = getLocalJobs();
    return allJobs.filter(j => userJobIds.includes(j.id));
  }

  try {
    const q = query(collection(db, 'saved_jobs'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const jobs: Job[] = [];

    for (const d of snap.docs) {
      const job = await fetchJobById(d.data().jobId);
      if (job) jobs.push(job);
    }

    return jobs;
  } catch (error) {
    console.warn('Firestore fetchSavedJobs error:', error);
    return [];
  }
};

export const toggleSaveJob = async (userId: string, jobId: string): Promise<boolean> => {
  const savedJobId = `${userId}_${jobId}`;

  if (isTestEnv) {
    const raw = localStorage.getItem(STORAGE_SAVED_KEY);
    let saved: SavedJob[] = raw ? JSON.parse(raw) : [];
    const idx = saved.findIndex(s => s.user_id === userId && s.job_id === jobId);
    if (idx >= 0) {
      saved.splice(idx, 1);
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(saved));
      return false;
    } else {
      saved.push({ id: savedJobId, user_id: userId, job_id: jobId, created_at: new Date().toISOString() });
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(saved));
      return true;
    }
  }

  const ref = doc(db, 'saved_jobs', savedJobId);

  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await deleteDoc(ref);
      return false;
    } else {
      await setDoc(ref, {
        id: savedJobId,
        userId,
        jobId,
        createdAt: new Date().toISOString(),
      });
      return true;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `saved_jobs/${savedJobId}`);
  }
};

export const checkIsJobSaved = async (userId: string, jobId: string): Promise<boolean> => {
  if (isTestEnv) {
    const raw = localStorage.getItem(STORAGE_SAVED_KEY);
    const saved: SavedJob[] = raw ? JSON.parse(raw) : [];
    return saved.some(s => s.user_id === userId && s.job_id === jobId);
  }

  try {
    const savedJobId = `${userId}_${jobId}`;
    const snap = await getDoc(doc(db, 'saved_jobs', savedJobId));
    return snap.exists();
  } catch {
    return false;
  }
};

// =========================================================================
// BUSINESS PROFILE QUERIES & MUTATIONS
// =========================================================================

export const fetchBusinessByOwner = async (ownerId: string): Promise<Business | null> => {
  try {
    const q = query(collection(db, 'businesses'), where('ownerId', '==', ownerId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const first = snap.docs[0];
      return mapFirestoreBusiness(first.id, first.data());
    }
  } catch (error) {
    console.warn('Firestore fetchBusinessByOwner error:', error);
  }

  return DEMO_BUSINESSES.find(b => b.owner_id === ownerId || b.owner_id === 'owner-1') || null;
};

export const saveBusinessProfile = async (
  ownerId: string,
  businessData: Partial<Business>
): Promise<Business> => {
  const bizId = businessData.id || `biz-${Date.now()}`;
  const now = new Date().toISOString();

  const firestoreData = {
    id: bizId,
    ownerId,
    businessName: businessData.business_name || 'My Local Business',
    description: businessData.description || '',
    category: businessData.category || 'Retail & Shops',
    logoUrl: businessData.logo_url || null,
    city: businessData.city || 'Hubli',
    locality: businessData.locality || 'Vidyanagar',
    address: businessData.address || '',
    contactPhone: businessData.contact_phone || '',
    contactEmail: businessData.contact_email || '',
    verificationStatus: businessData.verification_status || 'pending',
    createdAt: businessData.created_at || now,
    updatedAt: now,
  };

  try {
    await setDoc(doc(db, 'businesses', bizId), firestoreData, { merge: true });
    return mapFirestoreBusiness(bizId, firestoreData);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `businesses/${bizId}`);
  }
};

// =========================================================================
// REPORTING & MODERATION (ADMIN)
// =========================================================================

export const submitJobReport = async (
  jobId: string,
  reason: string,
  details?: string,
  reporterId?: string
): Promise<JobReport> => {
  const reportId = `rep-${Date.now()}`;
  const now = new Date().toISOString();

  const firestoreData = {
    id: reportId,
    jobId,
    reporterId: reporterId || null,
    reason,
    details: details || '',
    status: 'pending',
    createdAt: now,
  };

  try {
    await setDoc(doc(db, 'job_reports', reportId), firestoreData);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `job_reports/${reportId}`);
  }

  return {
    id: reportId,
    job_id: jobId,
    reporter_id: reporterId || null,
    reason,
    details: details || null,
    status: 'pending',
    created_at: now,
  };
};

export const fetchAllJobReports = async (): Promise<JobReport[]> => {
  try {
    const snap = await getDocs(collection(db, 'job_reports'));
    const reports: JobReport[] = [];

    for (const d of snap.docs) {
      const data = d.data();
      const job = await fetchJobById(data.jobId);
      reports.push({
        id: d.id,
        job_id: data.jobId,
        reporter_id: data.reporterId || null,
        reason: data.reason,
        details: data.details || null,
        status: data.status,
        created_at: data.createdAt,
        job: job || undefined,
      });
    }

    return reports;
  } catch (error) {
    console.warn('Firestore fetchAllJobReports error:', error);
    return [];
  }
};

export const fetchAllBusinessesForAdmin = async (): Promise<Business[]> => {
  try {
    const snap = await getDocs(collection(db, 'businesses'));
    if (!snap.empty) {
      return snap.docs.map(d => mapFirestoreBusiness(d.id, d.data()));
    }
  } catch (error) {
    console.warn('Firestore fetchAllBusinessesForAdmin error:', error);
  }

  return DEMO_BUSINESSES;
};

export const updateBusinessVerification = async (
  id: string,
  verification_status: VerificationStatus
): Promise<Business> => {
  const now = new Date().toISOString();
  try {
    await updateDoc(doc(db, 'businesses', id), {
      verificationStatus: verification_status,
      updatedAt: now,
    });
    const snap = await getDoc(doc(db, 'businesses', id));
    return mapFirestoreBusiness(id, snap.data()!);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `businesses/${id}`);
  }
};

export const updateJobModerationStatus = async (
  jobId: string,
  status: JobStatus
): Promise<Job> => {
  return updateJobListing(jobId, { status });
};
