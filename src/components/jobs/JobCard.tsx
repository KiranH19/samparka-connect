import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { toggleSaveJob, checkIsJobSaved } from '../../lib/api';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Briefcase, Bookmark, Check, ShieldCheck } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onSaveToggled?: (saved: boolean) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSaveToggled }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (user) {
      checkIsJobSaved(user.id, job.id).then(setIsSaved);
    }
  }, [user, job.id]);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save jobs to your dashboard.');
      return;
    }
    setIsSaving(true);
    try {
      const newState = await toggleSaveJob(user.id, job.id);
      setIsSaved(newState);
      onSaveToggled?.(newState);
    } catch (err) {
      console.error('Failed to toggle save job:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `₹${job.salary_min.toLocaleString()} – ₹${job.salary_max.toLocaleString()} / ${job.salary_period}`;
    }
    if (job.salary_min) {
      return `From ₹${job.salary_min.toLocaleString()} / ${job.salary_period}`;
    }
    return 'Salary Negotiable';
  };

  const formatEmploymentType = (type: string) => {
    return t.jobTypes[type as keyof typeof t.jobTypes] || type.replace('_', ' ');
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  return (
    <article className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Business Name & Save Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-800">{job.business?.business_name || 'Verified Local Employer'}</span>
            {job.business?.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-0.5 text-[#0BAA70]" title="Verified Local Business">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
            <span aria-hidden="true">·</span>
            <span>{job.category}</span>
          </div>

          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className={`p-1.5 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-emerald-50 border-emerald-200 text-[#0BAA70]'
                : 'border-slate-100 hover:border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
            title={isSaved ? 'Job Saved' : 'Save Job'}
            aria-label={isSaved ? 'Unsave Job' : 'Save Job'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#0BAA70]' : ''}`} />
          </button>
        </div>

        {/* Job Title */}
        <Link to={`/jobs/${job.id}`} className="block group-hover:text-[#0BAA70] transition-colors">
          <h3 className="text-base font-bold text-[#102B4E] leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Unboxed Metadata Discipline */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-[#0BAA70]" />
            <span>{job.locality}, {job.city}</span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1 text-slate-700">
            <Briefcase className="w-3.5 h-3.5 text-[#0BAA70]" />
            <span>{formatEmploymentType(job.employment_type)}</span>
          </div>
          {job.is_remote && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-emerald-700 font-semibold">Remote Available</span>
            </>
          )}
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{timeAgo(job.published_at || job.created_at)}</span>
        </div>
      </div>

      {/* Card Footer: Salary and Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-xs font-bold text-[#102B4E]">
          {formatSalary()}
        </div>

        <Link
          to={`/jobs/${job.id}`}
          className="px-3 py-1.5 text-xs font-semibold text-[#102B4E] bg-slate-100 hover:bg-[#0BAA70] hover:text-white rounded-lg transition-colors whitespace-nowrap"
        >
          {t.actions.viewDetails} →
        </Link>
      </div>
    </article>
  );
};
