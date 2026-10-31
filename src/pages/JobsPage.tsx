import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JobCard } from '../components/jobs/JobCard';
import { JobFilters } from '../components/jobs/JobFilters';
import { fetchJobs, JobFilterParams } from '../lib/api';
import { Job } from '../types/database';
import { useLanguage } from '../context/LanguageContext';
import { Briefcase, AlertCircle, RefreshCw } from 'lucide-react';

export const JobsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state from URL query parameters
  const filters: JobFilterParams = {
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || 'all',
    locality: searchParams.get('locality') || 'all',
    category: searchParams.get('category') || 'all',
    employmentType: searchParams.get('employmentType') || 'all',
    minSalary: searchParams.get('minSalary') ? Number(searchParams.get('minSalary')) : undefined,
    maxSalary: searchParams.get('maxSalary') ? Number(searchParams.get('maxSalary')) : undefined,
    isRemote: searchParams.get('isRemote') === 'true',
    sortBy: (searchParams.get('sortBy') as 'newest' | 'salary_high') || 'newest',
  };

  const handleFilterChange = (newFilters: JobFilterParams) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.set('search', newFilters.search);
    if (newFilters.city && newFilters.city !== 'all') params.set('city', newFilters.city);
    if (newFilters.locality && newFilters.locality !== 'all') params.set('locality', newFilters.locality);
    if (newFilters.category && newFilters.category !== 'all') params.set('category', newFilters.category);
    if (newFilters.employmentType && newFilters.employmentType !== 'all') params.set('employmentType', newFilters.employmentType);
    if (newFilters.minSalary) params.set('minSalary', String(newFilters.minSalary));
    if (newFilters.maxSalary) params.set('maxSalary', String(newFilters.maxSalary));
    if (newFilters.isRemote) params.set('isRemote', 'true');
    if (newFilters.sortBy && newFilters.sortBy !== 'newest') params.set('sortBy', newFilters.sortBy);

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  useEffect(() => {
    setLoading(true);
    fetchJobs(filters)
      .then((data) => setJobs(data))
      .catch((err) => console.error('Error fetching jobs:', err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Context */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B4E]">
          {t.nav.jobs} in Hubli–Dharwad
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore local vacancies in retail, cafes, manufacturing, healthcare, and office settings.
        </p>
      </div>

      {/* Filter Toolbar */}
      <JobFilters
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        totalCount={jobs.length}
      />

      {/* Jobs Grid / Loading / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse h-48" />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#102B4E]">No jobs match your selected criteria</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your filters, searching for a different locality, or clearing your search term.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-[#0BAA70] hover:bg-[#098557] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
