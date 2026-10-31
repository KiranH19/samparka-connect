import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchBusinessByOwner, createJobListing, saveBusinessProfile } from '../lib/api';
import { Business, EmploymentType, ExperienceLevel, JobStatus } from '../types/database';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const PostJobPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loadingBiz, setLoadingBiz] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Retail & Shops');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('full_time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('no_experience_required');
  const [city, setCity] = useState('Hubli');
  const [locality, setLocality] = useState('Vidyanagar');
  const [salaryMin, setSalaryMin] = useState<string>('12000');
  const [salaryMax, setSalaryMax] = useState<string>('18000');
  const [workSchedule, setWorkSchedule] = useState('');
  const [openings, setOpenings] = useState('1');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [status, setStatus] = useState<JobStatus>('published');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/employer/jobs/new');
      return;
    }

    fetchBusinessByOwner(user.id)
      .then((biz) => {
        setBusiness(biz);
        if (biz) {
          setCity(biz.city);
          setLocality(biz.locality);
          setCategory(biz.category);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingBiz(false));
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError(null);

    const minNum = salaryMin ? parseInt(salaryMin, 10) : null;
    const maxNum = salaryMax ? parseInt(salaryMax, 10) : null;

    if (minNum && maxNum && maxNum < minNum) {
      setError('Maximum salary must be greater than or equal to minimum salary.');
      return;
    }

    setSubmitting(true);

    try {
      // Ensure business exists or create default
      let activeBiz = business;
      if (!activeBiz) {
        activeBiz = await saveBusinessProfile(user.id, {
          business_name: `${profile?.full_name || 'My Local Business'} Store`,
          category,
          city,
          locality,
          verification_status: 'pending',
        });
        setBusiness(activeBiz);
      }

      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await createJobListing({
        business_id: activeBiz.id,
        created_by: user.id,
        title: title.trim(),
        description: description.trim(),
        category,
        employment_type: employmentType,
        experience_level: experienceLevel,
        salary_min: minNum,
        salary_max: maxNum,
        salary_period: 'month',
        city,
        locality,
        work_schedule: workSchedule.trim() || undefined,
        skills: skillsArray,
        openings: parseInt(openings, 10) || 1,
        status,
        is_remote: isRemote,
        is_demo: false,
      });

      navigate(`/jobs/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to post job. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      <button
        onClick={() => navigate('/employer')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#102B4E] min-h-[36px]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Employer Hub</span>
      </button>

      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#102B4E]">
            Post a Job Opening
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reach local candidates across Hubli–Dharwad within hours.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Job Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Retail Counter Sales Assistant, Cafe Barista, Assembly Tech"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0BAA70] min-h-[44px]"
            />
          </div>

          {/* Category & Employment Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              >
                <option value="Retail & Shops">{t.categories.retail}</option>
                <option value="Restaurants & Cafes">{t.categories.restaurant}</option>
                <option value="Manufacturing & Industrial">{t.categories.manufacturing}</option>
                <option value="IT & Office">{t.categories.office}</option>
                <option value="Logistics & Delivery">{t.categories.logistics}</option>
                <option value="Healthcare & Clinic">{t.categories.healthcare}</option>
                <option value="Teaching & Tutoring">{t.categories.education}</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Employment Type *</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              >
                <option value="full_time">{t.jobTypes.full_time}</option>
                <option value="part_time">{t.jobTypes.part_time}</option>
                <option value="internship">{t.jobTypes.internship}</option>
                <option value="contract">{t.jobTypes.contract}</option>
                <option value="daily_wage">{t.jobTypes.daily_wage}</option>
              </select>
            </div>
          </div>

          {/* Location: City & Locality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              >
                <option value="Hubli">Hubli (ಹುಬ್ಬಳ್ಳಿ)</option>
                <option value="Dharwad">Dharwad (ಧಾರವಾಡ)</option>
                <option value="Belagavi">Belagavi</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Locality in City *</label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Chennamma Circle, Vidyanagar, Gokul Road, Line Bazar"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              />
            </div>
          </div>

          {/* Salary Min / Max Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Minimum Monthly Salary (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder="10000"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Maximum Monthly Salary (₹)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder="18000"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              />
            </div>
          </div>

          {/* Schedule & Openings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Work Schedule / Timings
              </label>
              <input
                type="text"
                value={workSchedule}
                onChange={(e) => setWorkSchedule(e.target.value)}
                placeholder="e.g. 10:00 AM – 7:00 PM or 4 PM – 9 PM (Evening)"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Number of Openings</label>
              <input
                type="number"
                min="1"
                max="100"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              />
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Job Description & Responsibilities *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline daily duties, customer interaction expectations, and perks..."
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70]"
            />
          </div>

          {/* Skills (Comma separated) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Key Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Customer Hospitality, Cashier, Kannada Fluency, Tally"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
            />
          </div>

          {/* Publishing Status & Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 min-h-[36px]">
              <input
                type="checkbox"
                checked={status === 'published'}
                onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                className="w-4 h-4 text-[#0BAA70] rounded border-slate-300"
              />
              <span>Publish listing immediately</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-[#0BAA70] hover:bg-[#098557] active:bg-[#08734a] text-white font-bold rounded-xl transition-colors shadow-xs min-h-[44px] flex items-center justify-center"
            >
              {submitting ? 'Publishing...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
