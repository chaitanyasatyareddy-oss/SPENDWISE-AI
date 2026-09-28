import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode } from '../types';

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabels = false }) => {
  const { themeMode, setThemeMode } = useTheme();

  const themes: { mode: ThemeMode; icon: React.ElementType; label: string }[] = [
    { mode: 'light', icon: Sun, label: 'Light' },
    { mode: 'dark', icon: Moon, label: 'Dark' },
    { mode: 'system', icon: Laptop, label: 'System' },
  ];

  return (
    <div
      className={`inline-flex items-center bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-inner ${className}`}
      title="Theme Toggle (Light / Dark / System)"
    >
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = themeMode === t.mode;
        return (
          <button
            key={t.mode}
            onClick={() => setThemeMode(t.mode)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title={`Switch to ${t.label} Theme`}
          >
            <Icon className="w-3.5 h-3.5" />
            {showLabels && <span className="hidden sm:inline">{t.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
