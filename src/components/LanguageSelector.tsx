import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../utils/i18n/translations';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  variant = 'compact'
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`relative inline-flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 px-2 py-1 shadow-sm ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-1.5 flex-shrink-0" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageCode)}
        aria-label="Select application language"
        className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            {lang.flag} {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};
