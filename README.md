# Samparka (ಸಂಪರ್ಕ) – Opportunities Around You

> **"ನಿಮ್ಮ ಮುಂದಿನ ಅವಕಾಶವನ್ನು ಹುಡುಕಲು ಸಿದ್ಧರಿದ್ದೀರಾ?"**  
> We are building Samparka to help people discover nearby job opportunities easily.  
> Primary Market: **Hubli–Dharwad, Karnataka, India**.

---

## 1. Product Overview

**Samparka** connects job seekers (including college students looking for part-time shifts) with local businesses (shops, cafes, restaurants, clinics, manufacturing units, and offices) in Hubli–Dharwad.

### Key Features:
- **Mobile-First Responsive Web App**: Engineered for Android phones, iPhones, tablets, laptops, and desktop monitors.
- **Bilingual Interface**: Native 1-click toggle between **English** and **Kannada (ಕನ್ನಡ)** across all screens, filters, and forms.
- **Hyperlocal Search & Discovery**: Filter by City (Hubli, Dharwad, Belagavi), Locality (Chennamma Circle, Vidyanagar, Gokul Road, Line Bazar, Navanagar, Keshwapur), Category, Job Type (Part-Time, Full-Time, Internship, Daily Wage), and Salary.
- **Student Focus**: Dedicated part-time and flexible-shift discovery for students at KLE Tech, Karnatak University Dharwad, KCD, and nearby colleges.
- **Supabase PostgreSQL & Auth**: Full relational schema with foreign keys, CHECK constraints, indexes, Row Level Security (RLS), and file storage policies.
- **Job Seeker Dashboard**: Profile completion, skills tags, saved jobs bookmarks, and real-time application status tracker (`Applied`, `Under Review`, `Shortlisted`, `Not Selected`, `Hired`).
- **Employer Hub**: Business profile setup with verification badge, job posting creator (Drafts & Published), and applicant management with live candidate status updates.
- **Admin Moderation Console**: Trusted admin portal for approving business verification, moderating jobs, investigating spam reports, and audit tracking.

---

## 2. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Lucide Icons, canvas-confetti
- **Backend & Database**: Supabase (PostgreSQL 15+, Supabase Auth, Row Level Security, Supabase Storage)
- **Validation**: Strict TypeScript models & constraint checks
- **Testing**: Vitest unit & integration test suite
- **Load Testing**: k6 load test script configured for 500 concurrent virtual users

---

## 3. Directory Structure

```
├── .env.example                     # Environment template with Supabase placeholders
├── docs/
│   └── LOAD_TESTING.md             # 500 concurrent user load testing plan & benchmarks
├── load-tests/
│   └── k6-load-test.js             # k6 HTTP load testing script
├── public/
│   ├── robots.txt                  # Search engine crawler policies
│   └── sitemap.xml                 # Canonical XML sitemap
├── src/
│   ├── __tests__/                  # Vitest test suite
│   │   └── samparka.test.ts
│   ├── components/
│   │   ├── common/
│   │   │   ├── Footer.tsx          # Brand footer with location & Kannada support
│   │   │   ├── Header.tsx          # 3-zone top bar with language & role switcher
│   │   │   ├── HeroIllustration.tsx# Bespoke responsive SVG replicating flyer
│   │   │   ├── Logo.tsx            # Brand logo (location-pin + wordmark)
│   │   │   └── SupabaseStatusModal.tsx # Supabase backend connection assist
│   │   └── jobs/
│   │       ├── JobCard.tsx         # Job card with zero-pill metadata
│   │       └── JobFilters.tsx      # Multi-criteria search and filter toolbar
│   ├── context/
│   │   ├── AuthContext.tsx         # Supabase Auth, sessions, and demo personas
│   │   └── LanguageContext.tsx     # Centralized English/Kannada language state
│   ├── lib/
│   │   ├── api.ts                  # Supabase data access layer & queries
│   │   ├── supabase.ts             # Supabase client & demo fallback layer
│   │   └── translations.ts         # English and Kannada translation dictionaries
│   ├── pages/
│   │   ├── AdminDashboard.tsx      # Platform moderation & business verification
│   │   ├── AuthCallbackPage.tsx    # Supabase Auth callback handler
│   │   ├── EmployerDashboard.tsx   # Business profile, job manager & applicant review
│   │   ├── ForgotPasswordPage.tsx  # Password recovery request
│   │   ├── HomePage.tsx            # Launch landing page with flyer branding
│   │   ├── JobDetailsPage.tsx      # Job view, apply modal, report modal
│   │   ├── JobsPage.tsx            # Filterable job search with URL query syncing
│   │   ├── LoginPage.tsx           # Authentication sign-in screen
│   │   ├── PostJobPage.tsx         # Job posting creation form
│   │   ├── ResetPasswordPage.tsx   # Password update screen
│   │   ├── JobSeekerDashboard.tsx  # Candidate dashboard, applications & saved jobs
│   │   └── SignupPage.tsx          # Account registration with role selection
│   ├── types/
│   │   └── database.ts             # Strongly typed database interfaces
│   ├── App.tsx                     # Main application router
│   ├── index.css                   # Tailwind theme and custom styles
│   └── main.tsx                    # React DOM entry point
├── supabase/
│   ├── migrations/
│   │   └── 20261016_init_schema.sql# Complete PostgreSQL schema, indexes, RLS, storage
│   └── seed.sql                    # Demo listings for Hubli–Dharwad
├── index.html                      # SEO metadata, Open Graph & JSON-LD structured data
├── package.json
└── tsconfig.json
```

---

## 4. Supabase Setup & Database Migrations

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings → API**, copy your:
   - **Project URL** (`https://<project-ref>.supabase.co`)
   - **Project API Anon Key** (`anon` / `public`)

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
APP_URL=https://samparka.in
```

### Step 3: Run Database Migrations
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Copy the entire contents of `supabase/migrations/20261016_init_schema.sql` and click **Run**.
   - This creates all 7 tables: `profiles`, `businesses`, `jobs`, `applications`, `saved_jobs`, `job_reports`, `admin_audit_logs`.
   - Creates indexes on `(status, published_at)`, `(city, locality)`, `(category)`, and full-text search.
   - Enables Row Level Security (RLS) with policies.
   - Configures storage buckets for `resumes`, `avatars`, and `business-logos`.

### Step 4: Seed Initial Data (Optional)
Run `supabase/seed.sql` to populate sample demonstration businesses and jobs in Hubli–Dharwad.

---

## 5. Local Development Commands

```bash
# 1. Install dependencies
npm install

# 2. Run unit and integration tests
npm test

# 3. Start local development server on port 3000
npm run dev

# 4. Typecheck and lint codebase
npm run lint

# 5. Build for production
npm run build
```

---

## 6. Testing Results

All 6 automated test suites passed:
- **Translations Completeness**: Verified English and Kannada dictionaries & Hubli–Dharwad locality labels.
- **Job Filtering**: Tested exact matching for City (`Hubli`), Locality (`Vidyanagar`), and Employment Type (`part_time`).
- **Job Creation**: Validated required fields, category selection, and insertion into searchable listings.
- **Application Submission & Duplicate Prevention**: Confirmed candidate applications save properly and enforce unique constraints on `(job_id, applicant_id)`.
- **Saved Jobs**: Verified toggling bookmarks and fetching saved jobs per user.
- **Role & Ownership Boundaries**: Verified permission invariants for Job Seekers, Employers, and Admins.

---

## 7. Load Testing for 500 Concurrent Users

A production load-testing script is included at `load-tests/k6-load-test.js`:
- Ramps from 0 to 500 virtual users (VUs) over 8 minutes.
- Tests homepage traffic, search filter queries, job details views, and application submissions.
- Acceptance targets:
  - Error rate `< 1%`
  - HTTP p95 latency `< 1000ms`
  - Job search p95 latency `< 800ms`
  - Zero duplicate application records under race conditions.
- Detailed execution guide: `docs/LOAD_TESTING.md`.
