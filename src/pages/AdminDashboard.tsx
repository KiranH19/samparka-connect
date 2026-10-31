import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchJobs,
  fetchAllBusinessesForAdmin,
  updateBusinessVerification,
  updateJobModerationStatus,
  fetchAllJobReports,
  fetchJobById
} from '../lib/api';
import { Job, Business, JobReport, VerificationStatus, JobStatus } from '../types/database';
import {
  ShieldCheck,
  Building2,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  History
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'businesses' | 'jobs' | 'reports'>('businesses');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reports, setReports] = useState<JobReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check administrative authorization
    if (!user) {
      navigate('/login?redirect=/admin');
      return;
    }

    setLoading(true);
    Promise.all([
      fetchAllBusinessesForAdmin(),
      fetchJobs({}),
      fetchAllJobReports(),
    ])
      .then(([bizs, jbs, reps]) => {
        setBusinesses(bizs);
        setJobs(jbs);
        setReports(reps);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleVerifyBusiness = async (bizId: string, status: VerificationStatus) => {
    await updateBusinessVerification(bizId, status);
    setBusinesses(
      businesses.map((b) => (b.id === bizId ? { ...b, verification_status: status } : b))
    );
    showNotice(`Business verification updated to "${status}".`);
  };

  const handleJobModeration = async (jobId: string, status: JobStatus) => {
    await updateJobModerationStatus(jobId, status);
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status } : j)));
    showNotice(`Job status updated to "${status}".`);
  };

  const showNotice = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Lock className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-[#102B4E]">Admin Authorization Required</h2>
        <p className="text-xs text-slate-500">
          This moderation console is restricted to authorized platform administrators.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-[#102B4E] hover:bg-[#0c223e] text-white text-xs font-bold rounded-lg transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#102B4E]">
              Platform Moderation Console
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Enforcing trust, local verification, and scam protection across Hubli–Dharwad listings.
          </p>
        </div>

        {actionMessage && (
          <div className="px-3 py-1.5 bg-emerald-50 text-[#0BAA70] text-xs font-semibold rounded-lg border border-emerald-200 animate-fade-in">
            {actionMessage}
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Businesses</span>
          <div className="text-2xl font-extrabold text-[#102B4E]">{businesses.length}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Platform Job Listings</span>
          <div className="text-2xl font-extrabold text-[#0BAA70]">{jobs.length}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flagged Reports</span>
          <div className="text-2xl font-extrabold text-amber-600">{reports.length}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-200 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('businesses')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'businesses' ? 'border-[#0BAA70] text-[#0BAA70] font-bold' : 'border-transparent hover:text-[#102B4E]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Business Verification ({businesses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'jobs' ? 'border-[#0BAA70] text-[#0BAA70] font-bold' : 'border-transparent hover:text-[#102B4E]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Jobs Moderation ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-[#0BAA70] text-[#0BAA70] font-bold' : 'border-transparent hover:text-[#102B4E]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>User Reports ({reports.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BUSINESS VERIFICATION                             */}
      {/* ======================================================== */}
      {activeTab === 'businesses' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {businesses.map((biz) => (
            <div key={biz.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#102B4E]">{biz.business_name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    biz.verification_status === 'verified' ? 'bg-emerald-50 text-[#0BAA70]' :
                    biz.verification_status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {biz.verification_status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {biz.locality}, {biz.city} · {biz.category}
                </div>
                {biz.contact_phone && (
                  <div className="text-xs text-slate-600">
                    Phone: {biz.contact_phone} {biz.contact_email ? `| Email: ${biz.contact_email}` : ''}
                  </div>
                )}
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center gap-2 text-xs">
                {biz.verification_status !== 'verified' && (
                  <button
                    onClick={() => handleVerifyBusiness(biz.id, 'verified')}
                    className="px-3 py-1.5 bg-[#0BAA70] hover:bg-[#098557] text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve Verification</span>
                  </button>
                )}

                {biz.verification_status !== 'rejected' && (
                  <button
                    onClick={() => handleVerifyBusiness(biz.id, 'rejected')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: JOBS MODERATION                                   */}
      {/* ======================================================== */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {jobs.map((job) => (
            <div key={job.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#102B4E]">{job.title}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    job.status === 'published' ? 'bg-emerald-50 text-[#0BAA70]' :
                    job.status === 'suspended' ? 'bg-red-50 text-red-700 font-bold' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {job.locality}, {job.city} · {job.category} · {job.business?.business_name || 'Employer'}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {job.status === 'suspended' ? (
                  <button
                    onClick={() => handleJobModeration(job.id, 'published')}
                    className="px-3 py-1.5 bg-[#0BAA70] text-white font-semibold rounded-lg hover:bg-[#098557]"
                  >
                    Restore Listing
                  </button>
                ) : (
                  <button
                    onClick={() => handleJobModeration(job.id, 'suspended')}
                    className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-semibold rounded-lg"
                  >
                    Suspend / Hide
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: USER REPORTS                                      */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {reports.length > 0 ? (
            reports.map((rep) => (
              <div key={rep.id} className="p-5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-600">{rep.reason}</span>
                  <span className="text-slate-400">{new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {rep.details || 'No additional details provided by reporter.'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Target Job ID: <code className="bg-slate-100 px-1 py-0.5 rounded">{rep.job_id}</code>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-xs text-slate-500">
              No reports received. The platform is running smoothly.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
