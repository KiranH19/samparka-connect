import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchSavedJobs, fetchUserApplications, toggleSaveJob } from '../lib/api';
import { Job, Application, ApplicationStatus } from '../types/database';
import {
  User,
  Bookmark,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const JobSeekerDashboard: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'profile'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [city, setCity] = useState(profile?.city || 'Hubli');
  const [locality, setLocality] = useState(profile?.locality || 'Vidyanagar');
  const [education, setEducation] = useState(profile?.education || '');
  const [experienceSummary, setExperienceSummary] = useState(profile?.experience_summary || '');
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    Promise.all([
      fetchUserApplications(user.id),
      fetchSavedJobs(user.id),
    ])
      .then(([apps, saved]) => {
        setApplications(apps);
        setSavedJobs(saved);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || 'Hubli');
      setLocality(profile.locality || 'Vidyanagar');
      setEducation(profile.education || '');
      setExperienceSummary(profile.experience_summary || '');
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (toRemove: string) => {
    setSkills(skills.filter((s) => s !== toRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    await updateProfile({
      full_name: fullName,
      phone,
      city,
      locality,
      education,
      experience_summary: experienceSummary,
      skills,
    });
    setProfileSaving(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const handleUnsave = async (jobId: string) => {
    if (!user) return;
    await toggleSaveJob(user.id, jobId);
    setSavedJobs(savedJobs.filter((j) => j.id !== jobId));
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const config: Record<ApplicationStatus, { label: string; bg: string; text: string }> = {
      applied: { label: 'Applied', bg: 'bg-blue-50', text: 'text-blue-700' },
      under_review: { label: 'Under Review', bg: 'bg-amber-50', text: 'text-amber-700' },
      shortlisted: { label: 'Shortlisted', bg: 'bg-emerald-50', text: 'text-emerald-700' },
      rejected: { label: 'Not Selected', bg: 'bg-slate-100', text: 'text-slate-600' },
      hired: { label: 'Hired 🎉', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    };
    const s = config[status] || config.applied;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5">
      {/* Dashboard Top Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-[#0BAA70] flex items-center justify-center font-bold text-lg sm:text-xl border border-emerald-100 shrink-0">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-[#102B4E]">
              {profile?.full_name || 'Job Seeker Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
              <span>{user?.email}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-[#0BAA70] shrink-0" />
                {profile?.locality || 'Hubli'}, {profile?.city || 'Karnataka'}
              </span>
            </p>
          </div>
        </div>

        <Link
          to="/jobs"
          className="w-full sm:w-auto text-center px-4 py-2.5 bg-[#0BAA70] hover:bg-[#098557] text-white text-xs font-bold rounded-xl transition-colors shadow-xs min-h-[44px] flex items-center justify-center"
        >
          Explore More Jobs
        </Link>
      </div>

      {/* Mobile-friendly Horizontal Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar pb-0.5">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
            activeTab === 'applications'
              ? 'border-[#0BAA70] text-[#0BAA70] font-bold'
              : 'border-transparent hover:text-[#102B4E]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
            activeTab === 'saved'
              ? 'border-[#0BAA70] text-[#0BAA70] font-bold'
              : 'border-transparent hover:text-[#102B4E]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved ({savedJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap min-h-[44px] ${
            activeTab === 'profile'
              ? 'border-[#0BAA70] text-[#0BAA70] font-bold'
              : 'border-transparent hover:text-[#102B4E]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Skills</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: APPLICATIONS TRACKER                              */}
      {/* ======================================================== */}
      {activeTab === 'applications' && (
        <div className="space-y-3">
          {applications.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="text-[11px] text-slate-500 font-medium">
                      {app.job?.business?.business_name || 'Local Employer'} · {app.job?.locality}, {app.job?.city}
                    </div>
                    <Link
                      to={`/jobs/${app.job_id}`}
                      className="text-sm sm:text-base font-bold text-[#102B4E] hover:text-[#0BAA70] transition-colors flex items-center gap-1.5"
                    >
                      <span>{app.job?.title || 'Applied Job Listing'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </Link>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                      <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                      {app.job?.salary_min && (
                        <>
                          <span>·</span>
                          <span className="font-semibold text-slate-700">₹{app.job.salary_min.toLocaleString()} / mo</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="self-end sm:self-auto">
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-[#102B4E]">You haven't applied to any jobs yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore local openings across Hubli-Dharwad and submit your first application.
              </p>
              <Link
                to="/jobs"
                className="inline-block px-5 py-2.5 bg-[#0BAA70] text-white text-xs font-bold rounded-xl min-h-[44px]"
              >
                Browse Active Jobs
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SAVED JOBS                                        */}
      {/* ======================================================== */}
      {activeTab === 'saved' && (
        <div className="space-y-3">
          {savedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {savedJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium truncate">
                        {job.business?.business_name} · {job.locality}
                      </span>
                      <button
                        onClick={() => handleUnsave(job.id)}
                        className="text-slate-400 hover:text-red-500 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <Link to={`/jobs/${job.id}`}>
                      <h3 className="text-sm sm:text-base font-bold text-[#102B4E] hover:text-[#0BAA70]">
                        {job.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                    <span className="font-bold text-[#102B4E]">
                      {job.salary_min ? `₹${job.salary_min.toLocaleString()} / mo` : 'Salary Negotiable'}
                    </span>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-3.5 py-2 bg-[#0BAA70] text-white rounded-lg font-semibold hover:bg-[#098557] min-h-[38px] flex items-center"
                    >
                      View & Apply
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-[#102B4E]">No saved jobs</h3>
              <p className="text-xs text-slate-500">
                Click the bookmark icon on any job card to save listings here for later.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PROFILE & RESUME                                  */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-xs max-w-2xl">
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {profileSuccess && (
              <div className="p-3 bg-emerald-50 text-[#0BAA70] rounded-lg border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold">Profile updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98800 00000"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Locality</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Vidyanagar, Chennamma Circle"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Education / College
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Mention degree, branch, or college (e.g. KLE Tech, KCD)"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Experience Summary / Shift Availability
              </label>
              <textarea
                rows={3}
                value={experienceSummary}
                onChange={(e) => setExperienceSummary(e.target.value)}
                placeholder="Describe your background or preferred shift hours..."
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70]"
              />
            </div>

            {/* Skills Tags */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skills & Strengths</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. Tally, POS Billing, Kannada, English..."
                  className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0BAA70] min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold rounded-lg text-xs min-h-[44px]"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#0BAA70] rounded-md font-medium text-xs min-h-[30px]"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500 font-bold p-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                disabled={profileSaving}
                className="w-full sm:w-auto px-6 py-3 bg-[#0BAA70] hover:bg-[#098557] active:bg-[#08734a] text-white font-bold rounded-xl transition-colors shadow-xs min-h-[44px]"
              >
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
