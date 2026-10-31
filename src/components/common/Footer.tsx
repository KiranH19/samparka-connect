import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Mail, Phone, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Col 1: Brand Wordmark & Mission */}
          <div className="md:col-span-1 space-y-3">
            <Logo size="md" />
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.heroSupport}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-[#0BAA70] text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.startingIn}</span>
            </div>
          </div>

          {/* Col 2: Job Seekers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102B4E] mb-3">
              Job Seekers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/jobs" className="hover:text-[#0BAA70] transition-colors">
                  {t.nav.jobs}
                </Link>
              </li>
              <li>
                <Link to="/jobs?employmentType=part_time" className="hover:text-[#0BAA70] transition-colors">
                  Part-Time Jobs for Students
                </Link>
              </li>
              <li>
                <Link to="/jobs?city=Hubli" className="hover:text-[#0BAA70] transition-colors">
                  Jobs in Hubli
                </Link>
              </li>
              <li>
                <Link to="/jobs?city=Dharwad" className="hover:text-[#0BAA70] transition-colors">
                  Jobs in Dharwad
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#0BAA70] transition-colors">
                  Seeker Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102B4E] mb-3">
              Employers
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/employer" className="hover:text-[#0BAA70] transition-colors">
                  Employer Hub
                </Link>
              </li>
              <li>
                <Link to="/employer/jobs/new" className="hover:text-[#0BAA70] transition-colors">
                  {t.postAJob}
                </Link>
              </li>
              <li>
                <Link to="/#benefits-employer" className="hover:text-[#0BAA70] transition-colors">
                  Hire Local Talent
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#0BAA70] transition-colors">
                  Moderation Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hubli-Dharwad Roots */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#102B4E] mb-3">
              Local Support
            </h4>
            <div className="space-y-2.5 text-xs text-slate-500">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#0BAA70] shrink-0 mt-0.5" />
                <span>Hubli-Dharwad, Karnataka 580001</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#0BAA70] shrink-0" />
                <a href="mailto:samparkaconnect@gmail.com" className="hover:text-[#0BAA70] transition-colors">
                  samparkaconnect@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#0BAA70] shrink-0" />
                <a href="tel:+918073588621" className="hover:text-[#0BAA70] transition-colors font-medium">
                  +91 8073588621 (For Support)
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Brand Signature */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#102B4E]">
            <span>Opportunities Around You.</span>
            <span role="img" aria-label="handshake">🤝</span>
            <span className="text-xs font-normal text-slate-400">| © 2026 Samparka</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Built with care in North Karnataka</span>
            <span className="hidden sm:inline">·</span>
            <span>Privacy Policy</span>
            <span className="hidden sm:inline">·</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
