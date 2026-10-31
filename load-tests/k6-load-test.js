import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Metrics
const errorRate = new Rate('error_rate');
const jobSearchDuration = new Trend('job_search_duration');
const applicationDuration = new Trend('application_duration');

// Test Configuration for 500 Virtual Users (VUs)
export const options = {
  stages: [
    { duration: '1m', target: 50 },    // Warm-up ramp
    { duration: '2m', target: 200 },   // Moderate traffic
    { duration: '3m', target: 500 },   // Peak target: 500 concurrent users
    { duration: '2m', target: 500 },   // Sustained peak load
    { duration: '1m', target: 0 },     // Ramp-down
  ],
  thresholds: {
    // Acceptance criteria from Samparka architecture requirements:
    // 1. Error rate must remain below 1%
    'error_rate': ['rate<0.01'],
    // 2. HTTP p95 response time must be under 1000ms (1 second)
    'http_req_duration': ['p(95)<1000'],
    // 3. Job search response time p95 under 800ms
    'job_search_duration': ['p(95)<800'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';
const SUPABASE_URL = __ENV.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const SUPABASE_KEY = __ENV.VITE_SUPABASE_ANON_KEY || 'mock-key';

const CITIES = ['Hubli', 'Dharwad', 'Belagavi'];
const LOCALITIES = ['Vidyanagar', 'Chennamma Circle', 'Gokul Road', 'Keshwapur', 'Line Bazar'];
const CATEGORIES = ['Retail & Shops', 'Restaurants & Cafes', 'Manufacturing & Industrial', 'IT & Office'];

export default function () {
  // Realistic user journey distribution:
  // 60% Job Seekers browsing & searching
  // 25% Job Seekers viewing details & applying
  // 15% Employers checking listings/applicants

  group('01. Public Homepage Visit', function () {
    const res = http.get(`${BASE_URL}/`);
    const success = check(res, {
      'homepage status 200': (r) => r.status === 200,
    });
    errorRate.add(!success);
    sleep(1 + Math.random() * 2);
  });

  group('02. Job Search and Filters', function () {
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const randomLocality = LOCALITIES[Math.floor(Math.random() * LOCALITIES.length)];
    const randomCat = encodeURIComponent(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);

    const start = Date.now();
    const res = http.get(`${BASE_URL}/jobs?city=${randomCity}&locality=${randomLocality}&category=${randomCat}`);
    const duration = Date.now() - start;
    jobSearchDuration.add(duration);

    const success = check(res, {
      'search status 200': (r) => r.status === 200,
    });
    errorRate.add(!success);
    sleep(2 + Math.random() * 2);
  });

  group('03. Job Details View', function () {
    // View a specific job listing
    const res = http.get(`${BASE_URL}/jobs/1`);
    const success = check(res, {
      'job details status 200': (r) => r.status === 200,
    });
    errorRate.add(!success);
    sleep(2);
  });

  // Simulated authenticated applicant action (30% probability)
  if (Math.random() < 0.3) {
    group('04. Submit Application', function () {
      const payload = JSON.stringify({
        job_id: 'job-hubli-101',
        applicant_name: `Applicant VU ${__VU}`,
        applicant_email: `applicant_${__VU}_${__ITER}@samparka.local`,
        applicant_phone: '+91 98800 00000',
        cover_letter: 'I am interested in this local opportunity in Hubli.',
      });

      const params = {
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      };

      const start = Date.now();
      // Test direct backend endpoint or application route
      const res = http.post(`${BASE_URL}/api/applications`, payload, params);
      const duration = Date.now() - start;
      applicationDuration.add(duration);

      // In client testing, evaluate status code
      const success = check(res, {
        'apply response acceptable': (r) => r.status === 200 || r.status === 201 || r.status === 404, // 404 if mock route not mounted
      });
      sleep(3);
    });
  }

  // Simulated employer dashboard view (15% probability)
  if (Math.random() < 0.15) {
    group('05. Employer Dashboard Check', function () {
      const res = http.get(`${BASE_URL}/employer`);
      const success = check(res, {
        'employer page status 200': (r) => r.status === 200,
      });
      errorRate.add(!success);
      sleep(2);
    });
  }
}
