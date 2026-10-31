import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Home, Search, PlusCircle, Shield, User, Briefcase } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user, role } = useAuth();
  const { t, language } = useLanguage();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (role === 'employer') return '/employer';
    if (role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-1 py-1.5 shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-5 items-center text-center">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            isActive('/') && location.pathname === '/' ? 'text-[#0BAA70] font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">{t.nav.home}</span>
        </Link>

        {/* 2. Browse Jobs */}
        <Link
          to="/jobs"
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            isActive('/jobs') && !location.pathname.includes('/new') ? 'text-[#0BAA70] font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Search Jobs"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">{t.nav.jobs}</span>
        </Link>

        {/* 3. Post a Job (CENTER / MIDDLE) */}
        <Link
          to={user && role === 'employer' ? '/employer/jobs/new' : '/signup?role=employer'}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            location.pathname.includes('/jobs/new') ? 'text-[#0BAA70] font-bold' : 'text-slate-700 hover:text-[#0BAA70]'
          }`}
          aria-label="Post a Job"
        >
          <div className="w-8 h-8 rounded-full bg-[#0BAA70] text-white flex items-center justify-center shadow-sm -mt-2">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none font-bold text-[#102B4E]">
            {language === 'kn' ? 'ಪ್ರಕಟಿಸಿ' : 'Post'}
          </span>
        </Link>

        {/* 4. Safety & Rules (RIGHT OF POST) */}
        <Link
          to="/safety"
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            isActive('/safety') ? 'text-[#0BAA70] font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="Safety & Rules"
        >
          <Shield className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none">
            {language === 'kn' ? 'ಸುರಕ್ಷತೆ' : 'Safety'}
          </span>
        </Link>

        {/* 5. Account / Profile */}
        <Link
          to={getDashboardLink()}
          className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
            isActive('/dashboard') || isActive('/employer') || isActive('/admin')
              ? 'text-[#0BAA70] font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          aria-label="My Account"
        >
          {role === 'employer' ? (
            <Briefcase className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <span className="text-[10px] mt-0.5 leading-none">
            {user ? (role === 'employer' ? (language === 'kn' ? 'ಸಂಸ್ಥೆ' : 'Business') : (language === 'kn' ? 'ಖಾತೆ' : 'Profile')) : t.nav.login}
          </span>
        </Link>
      </div>
    </nav>
  );
};
