import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Logo } from '../components/common/Logo';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      });
    } else {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Logo size="lg" />
      <div className="w-8 h-8 border-3 border-[#0BAA70] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-slate-500">Completing sign in, please wait...</p>
    </div>
  );
};
