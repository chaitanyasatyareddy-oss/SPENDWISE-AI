import React from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

interface MobileFrameWrapperProps {
  isMobileView: boolean;
  onToggleView: (val: boolean) => void;
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  isMobileView,
  onToggleView,
  children
}) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center transition-colors">
      {/* Top Floating View Switcher Bar */}
      <header className="w-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-xs">
            SW
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>SpendWise AI</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                v2.1
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Header Language & Theme Controls in Top-Right */}
          <LanguageSelector className="hidden sm:inline-flex" />
          <ThemeToggle />

          <div className="bg-slate-200 dark:bg-slate-800 p-0.5 rounded-xl flex items-center gap-0.5 border border-slate-300 dark:border-slate-700 shadow-inner">
            <button
              onClick={() => onToggleView(true)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                isMobileView
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Switch to Mobile View (FlutterFlow Vertical Frame)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile</span>
            </button>
            <button
              onClick={() => onToggleView(false)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                !isMobileView
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="Switch to Full Responsive Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Desktop</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="w-full flex-1 flex justify-center py-3 px-2 sm:px-4">
        {isMobileView ? (
          <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative my-2 min-h-[844px] ring-1 ring-slate-200 dark:ring-slate-800 transition-colors">
            {/* Phone Speaker Notch Header */}
            <div className="w-full bg-slate-100 dark:bg-slate-950 px-6 pt-3 pb-2 flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 select-none transition-colors">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">9:41</span>
              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-900 rounded-full mx-auto border border-slate-300 dark:border-slate-800"></div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Inner Mobile Scroll Area */}
            <div className="flex-1 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              {children}
            </div>

            {/* Home indicator bar */}
            <div className="w-full py-1.5 bg-slate-100 dark:bg-slate-950 flex justify-center border-t border-slate-200 dark:border-slate-800/60 select-none transition-colors">
              <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-7xl flex flex-col">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
