import React from 'react';
import { LanguageSelector } from '../LanguageSelector';
import { ThemeToggle } from '../ThemeToggle';
import { Smartphone, Monitor } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AuthHeaderProps {
  isMobileView: boolean;
  onToggleView: (val: boolean) => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ isMobileView, onToggleView }) => {
  const { t } = useLanguage();

  return (
    <header className="w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 flex items-center justify-between sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-xs">
          SW
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            {t.appName}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              v2.1
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language Selector */}
        <LanguageSelector />

        {/* Theme Toggle in top-right */}
        <ThemeToggle />

        {/* View switcher */}
        <div className="hidden sm:flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700">
          <button
            onClick={() => onToggleView(true)}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              isMobileView
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleView(false)}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              !isMobileView
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
