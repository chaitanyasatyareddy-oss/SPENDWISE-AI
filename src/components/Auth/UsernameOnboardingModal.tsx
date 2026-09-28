import React, { useState, useEffect } from 'react';
import { AtSign, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const UsernameOnboardingModal: React.FC = () => {
  const { showUsernameOnboarding, claimUsername, checkUsernameAvailability, user } = useAuth();
  const { t } = useLanguage();

  const [desiredUsername, setDesiredUsername] = useState(user?.username || '');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!desiredUsername.trim()) {
      setIsAvailable(null);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    const timer = setTimeout(() => {
      const clean = desiredUsername.trim().toLowerCase().replace(/^@/, '');
      if (clean.length < 3) {
        setIsAvailable(false);
      } else {
        const available = checkUsernameAvailability(clean);
        setIsAvailable(available);
      }
      setIsChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [desiredUsername, checkUsernameAvailability]);

  if (!showUsernameOnboarding) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desiredUsername.trim() || isAvailable === false) {
      setErrorMsg('Please select a valid, available username.');
      return;
    }

    const res = claimUsername(desiredUsername);
    if (!res.success) {
      setErrorMsg(res.error || 'Failed to claim username.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t.auth.onboardingTitle}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {t.auth.onboardingSubtitle}
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Choose Handle
              </label>
              {isChecking && (
                <span className="text-[10px] text-indigo-500 animate-pulse">Checking...</span>
              )}
              {!isChecking && isAvailable === true && (
                <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Available
                </span>
              )}
              {!isChecking && isAvailable === false && (
                <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Unavailable
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. chithanya"
                value={desiredUsername}
                onChange={(e) => setDesiredUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAvailable === false}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{t.auth.claimHandle}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
