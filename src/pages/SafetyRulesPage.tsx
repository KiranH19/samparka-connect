import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, AlertOctagon, CheckCircle2, Flag, Lock, PhoneCall, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const SafetyRulesPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isKn = language === 'kn';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#102B4E] min-h-[36px]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{isKn ? 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ' : 'Back'}</span>
      </button>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#102B4E] to-emerald-950 text-white rounded-3xl p-6 sm:p-10 space-y-4 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>{isKn ? 'ಸಂಪರ್ಕ ಸುರಕ್ಷತಾ ನೀತಿ' : 'Samparka Safety & Community Trust'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          {isKn ? 'ಸುರಕ್ಷತೆ ಮತ್ತು ನಿಯಮಗಳು' : 'Safety & Platform Rules'}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          {isKn
            ? 'ಹುಬ್ಬಳ್ಳಿ–ಧಾರವಾಡದ ಸ್ಥಳೀಯ ಅಭ್ಯರ್ಥಿಗಳು ಮತ್ತು ಉದ್ಯೋಗದಾತರ ನಡುವೆ ಪಾರದರ್ಶಕ ಮತ್ತು ಸುರಕ್ಷಿತ ಉದ್ಯೋಗಾವಕಾಶಗಳನ್ನು ನಿರ್ಮಿಸುವುದು ನಮ್ಮ ಮೊದಲ ಆದ್ಯತೆ.'
            : 'Ensuring safe, legitimate, and trusted local hiring for all job seekers, college students, and employers in Hubli–Dharwad.'}
        </p>
      </div>

      {/* Golden Rule Alert: 100% Free - Never Pay Money */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 flex items-start gap-4 text-amber-950">
        <AlertOctagon className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <h3 className="font-bold text-sm sm:text-base text-amber-900">
            {isKn ? 'ಮುಖ್ಯ ನಿಯಮ: ಯಾರೂ ಹಣ ಕೇಳುವಂತಿಲ್ಲ!' : 'Core Rule: Never Pay for Any Job or Registration'}
          </h3>
          <p className="leading-relaxed">
            {isKn
              ? 'Samparkaದಲ್ಲಿ ಯಾವುದೇ ಉದ್ಯೋಗಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲ. ಯಾವುದೇ ಉದ್ಯೋಗದಾತರು ನೋಂದಣಿ ಶುಲ್ಕ, ಯೂನಿಫಾರ್ಮ್ ಠೇವಣಿ, ಅಥವಾ ತರಬೇತಿ ಶುಲ್ಕ ಕೇಳಿದರೆ ತಕ್ಷಣ ವರದಿ ಮಾಡಿ.'
              : 'Samparka is 100% free for all candidates. Legitimate employers never ask candidates for registration fees, uniform deposits, or processing charges before joining.'}
          </p>
        </div>
      </div>

      {/* Rules for Job Seekers */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#102B4E] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#0BAA70]" />
          <span>{isKn ? 'ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮಾರ್ಗಸೂಚಿಗಳು' : 'Guidelines for Job Seekers & Students'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
            <h4 className="font-bold text-[#102B4E]">
              {isKn ? '1. ನೇರ ಸ್ಥಳ ಪರಿಶೀಲನೆ' : '1. Verify the Business Location'}
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {isKn
                ? 'ಹುಬ್ಬಳ್ಳಿ ಅಥವಾ ಧಾರವಾಡದ ಅಂಗಡಿ, ಕೆಫೆ ಅಥವಾ ಕಚೇರಿಯ ವಿಳಾಸವನ್ನು ಪರಿಶೀಲಿಸಿ. ಸಂದರ್ಶನವನ್ನು ಹಗಲು ವೇಳೆಯಲ್ಲಿ ಮಾತ್ರ ನಿಗದಿಪಡಿಸಿ.'
                : 'Meet employers at their physical store, cafe, or office during regular daytime business hours.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
            <h4 className="font-bold text-[#102B4E]">
              {isKn ? '2. ಸೂಕ್ಷ್ಮ ದಾಖಲೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ' : '2. Keep Sensitive Documents Safe'}
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {isKn
                ? 'ಮೂಲ ಅಂಕಪಟ್ಟಿಗಳು ಅಥವಾ ಬ್ಯಾಂಕ್ ಪಾಸ್‌ವರ್ಡ್‌ಗಳನ್ನು ಯಾರಿಗೂ ನೀಡಬೇಡಿ. ಸೇರ್ಪಡೆಗೊಂಡ ನಂತರ ಮಾತ್ರ ದಾಖಲೆಗಳ ಝೆರಾಕ್ಸ್ ನೀಡಿ.'
                : 'Never hand over original marksheets or sensitive banking details. Provide photocopies only upon formal joining.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
            <h4 className="font-bold text-[#102B4E]">
              {isKn ? '3. ಕಾಲೇಜು ಸಮಯಕ್ಕೆ ಆದ್ಯತೆ' : '3. Balance College Timings'}
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {isKn
                ? 'ವಿದ್ಯಾರ್ಥಿ ಅಭ್ಯರ್ಥಿಗಳು ತಮ್ಮ ತರಗತಿಗಳ ನಂತರದ ಸಂಜೆ ಪಾಳಿಗಳನ್ನು (ಉದಾ: 4 PM – 9 PM) ಆಯ್ಕೆ ಮಾಡಿಕೊಳ್ಳಿ.'
                : 'Ensure agreed part-time shift hours do not overlap with your college lectures and exams.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
            <h4 className="font-bold text-[#102B4E]">
              {isKn ? '4. ಅನುಮಾನಾಸ್ಪದ ಜಾಹೀರಾತು ವರದಿ' : '4. Report Suspicious Activities'}
            </h4>
            <p className="text-slate-600 leading-relaxed text-xs">
              {isKn
                ? 'ಯಾವುದೇ ಉದ್ಯೋಗದಾತರು ತಪ್ಪು ಮಾಹಿತಿ ನೀಡಿದರೆ ಆ ಜಾಹೀರಾತಿನಲ್ಲಿರುವ "ವರದಿ ಮಾಡಿ" (Report) ಬಟನ್ ಒತ್ತಿ.'
                : 'Click the "Report Listing" button on any suspicious job to flag it immediately to our moderation team.'}
            </p>
          </div>
        </div>
      </div>

      {/* Rules for Employers */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#102B4E] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0BAA70]" />
          <span>{isKn ? 'ಉದ್ಯೋಗದಾತರಿಗೆ ನಿಯಮಗಳು' : 'Rules for Employers & Local Businesses'}</span>
        </h2>

        <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0BAA70] shrink-0 mt-0.5" />
            <span>
              <strong>{isKn ? 'ಸರಿಯಾದ ವೇತನ ವಿವರ:' : 'Transparent Compensation:'}</strong>{' '}
              {isKn
                ? 'ನಿಖರವಾದ ಮಾಸಿಕ ಅಥವಾ ದೈನಂದಿನ ವೇತನ ಶ್ರೇಣಿಯನ್ನು ನಮೂದಿಸಬೇಕು.'
                : 'Clearly specify realistic salary ranges and working schedule in every listing.'}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0BAA70] shrink-0 mt-0.5" />
            <span>
              <strong>{isKn ? 'ಯಾವುದೇ ಠೇವಣಿ ಬೇಡಿಕೆ ನಿಷೇಧ:' : 'Zero Deposit Demands:'}</strong>{' '}
              {isKn
                ? 'ಅಭ್ಯರ್ಥಿಗಳಿಂದ ಯಾವುದೇ ಠೇವಣಿ ಅಥವಾ ಹಣ ಪಡೆಯುವ ಸಂಸ್ಥೆಗಳನ್ನು ವೇದಿಕೆಯಿಂದ ಕಾಯಂ ರದ್ದುಗೊಳಿಸಲಾಗುತ್ತದೆ.'
                : 'Demanding upfront money from job seekers results in immediate permanent ban.'}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0BAA70] shrink-0 mt-0.5" />
            <span>
              <strong>{isKn ? 'ಸ್ಥಳೀಯ ವಿಳಾಸ ದೃಢೀಕರಣ:' : 'Physical Local Address:'}</strong>{' '}
              {isKn
                ? 'ಹುಬ್ಬಳ್ಳಿ–ಧಾರವಾಡದಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿರುವ ನಿಜವಾದ ವಿಳಾಸವನ್ನು ಒದಗಿಸಬೇಕು.'
                : 'Employers must provide an authentic verifiable physical business address in Hubli–Dharwad.'}
            </span>
          </li>
        </ul>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-2 text-xs text-slate-600">
        <h4 className="font-bold text-[#102B4E] uppercase tracking-wider text-[11px]">
          {isKn ? 'ಸ್ಥಳೀಯ ಬೆಂಬಲ (Local Support)' : 'Local Support'}
        </h4>
        <p className="font-medium text-slate-800">
          Hubli-Dharwad, Karnataka 580001
        </p>
        <p>
          <a href="mailto:samparkaconnect@gmail.com" className="text-[#0BAA70] hover:underline font-semibold">
            samparkaconnect@gmail.com
          </a>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1 font-semibold text-slate-700">
          <a href="tel:+918073588621" className="hover:text-[#0BAA70] transition-colors">
            📞 +91 8073588621 (For Support)
          </a>
        </div>
      </div>
    </div>
  );
};
