import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabels = false }) => {
  const { themeMode, setThemeMode, isDark } = useTheme();

  const themes: { mode: ThemeMode; icon: React.ElementType; label: string }[] = [
    { mode: 'light', icon: Sun, label: 'Light' },
    { mode: 'dark', icon: Moon, label: 'Dark' },
  ];

  return (
    <div
      className={`inline-flex items-center bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-300/80 dark:border-slate-700/80 shadow-inner transition-colors ${className}`}
      title={isDark ? 'Currently Dark Theme (click Light to switch)' : 'Currently Light Theme (click Dark to switch)'}
    >
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = themeMode === t.mode;
        return (
          <button
            key={t.mode}
            type="button"
            onClick={() => setThemeMode(t.mode)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isActive
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title={`Switch to ${t.label} Theme`}
          >
            <Icon className="w-3.5 h-3.5" />
            {showLabels && <span>{t.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
