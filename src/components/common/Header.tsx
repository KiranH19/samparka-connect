import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Globe, User, LogOut, PlusCircle, Shield, Briefcase } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, profile, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8 h-16">
          {/* ZONE 1: Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo size="md" />
          </Link>

          {/* ZONE 2: Clean single-line text links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
            <Link
              to="/jobs"
              className={`whitespace-nowrap shrink-0 transition-colors ${
                isActive('/jobs') ? 'text-[#0BAA70] font-semibold' : 'hover:text-[#102B4E]'
              }`}
            >
              {t.nav.jobs}
            </Link>
            <Link
              to="/jobs?employmentType=part_time"
              className={`whitespace-nowrap shrink-0 transition-colors ${
                location.search.includes('part_time') ? 'text-[#0BAA70] font-semibold' : 'hover:text-[#102B4E]'
              }`}
            >
              {t.nav.students}
            </Link>
            <Link
              to="/safety"
              className={`whitespace-nowrap shrink-0 transition-colors ${
                isActive('/safety') ? 'text-[#0BAA70] font-semibold' : 'hover:text-[#102B4E]'
              }`}
            >
              {language === 'kn' ? 'ಸುರಕ್ಷತೆ & ನಿಯಮಗಳು' : 'Safety & Rules'}
            </Link>
            <Link
              to="/employer"
              className={`whitespace-nowrap shrink-0 transition-colors ${
                isActive('/employer') ? 'text-[#0BAA70] font-semibold' : 'hover:text-[#102B4E]'
              }`}
            >
              {t.nav.employers}
            </Link>
            <Link
              to="/#how-it-works"
              className="whitespace-nowrap shrink-0 hover:text-[#102B4E] transition-colors"
            >
              {t.nav.howItWorks}
            </Link>
          </nav>

          {/* ZONE 3: Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Language toggle: English / ಕನ್ನಡ */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#102B4E] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
              title="Switch Language / ಭಾಷೆಯನ್ನು ಬದಲಿಸಿ"
              aria-label="Toggle language between English and Kannada"
            >
              <Globe className="w-3.5 h-3.5 text-[#0BAA70]" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'EN'}</span>
            </button>

            {/* User Account / Post Job Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={role === 'employer' ? '/employer' : role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#102B4E] hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap min-h-[38px]"
                >
                  <User className="w-4 h-4 text-[#0BAA70]" />
                  <span className="max-w-[120px] truncate">{profile?.full_name?.split(' ')[0] || 'My Account'}</span>
                </Link>

                <Link
                  to={role === 'employer' ? '/employer/jobs/new' : '/signup?role=employer'}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0BAA70] hover:bg-[#098557] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs min-h-[38px]"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{t.postAJob}</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Log Out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#102B4E] transition-colors whitespace-nowrap min-h-[38px] flex items-center"
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0BAA70] hover:bg-[#098557] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs min-h-[38px] flex items-center"
                >
                  {t.nav.signup}
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-[#102B4E] rounded-lg focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-4 shadow-xl">
          {user ? (
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#0BAA70] flex items-center justify-center font-bold text-sm">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#102B4E]">{profile?.full_name || 'My Account'}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{role?.replace('_', ' ')}</div>
                </div>
              </div>
              <button
                onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
              >
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-semibold text-[#102B4E] bg-slate-100 rounded-xl min-h-[44px] flex items-center justify-center"
              >
                {t.nav.login}
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center text-xs font-bold text-white bg-[#0BAA70] rounded-xl shadow-xs min-h-[44px] flex items-center justify-center"
              >
                {t.nav.signup}
              </Link>
            </div>
          )}

          <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-800">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-50 min-h-[44px] flex items-center"
            >
              {t.nav.home}
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-50 text-[#0BAA70] font-bold min-h-[44px] flex items-center"
            >
              {t.nav.jobs}
            </Link>
            <Link
              to="/jobs?employmentType=part_time"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-50 min-h-[44px] flex items-center"
            >
              {t.nav.students} (Part-Time)
            </Link>
            <Link
              to="/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-50 min-h-[44px] flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-[#0BAA70]" />
              <span>{language === 'kn' ? 'ಸುರಕ್ಷತೆ ಮತ್ತು ನಿಯಮಗಳು' : 'Safety & Rules'}</span>
            </Link>
            <Link
              to="/employer"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-slate-50 min-h-[44px] flex items-center"
            >
              {t.nav.employers}
            </Link>
            <Link
              to="/employer/jobs/new"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl bg-emerald-50 text-[#0BAA70] min-h-[44px] flex items-center gap-2 font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.postAJob}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
