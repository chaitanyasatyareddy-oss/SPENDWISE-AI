import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Camera,
  Bot,
  CalendarDays,
  Users2,
  Target,
  FileSpreadsheet,
  Globe,
  RotateCcw,
  PlusCircle,
  LogOut,
  User,
  AtSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { CurrencyCode } from '../types';
import { CURRENCY_CONFIGS } from '../utils/formatters';

export type ActiveTab =
  | 'dashboard'
  | 'analytics'
  | 'capture'
  | 'coach'
  | 'subscriptions'
  | 'shared'
  | 'goals'
  | 'import';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
}) => {
  const { currency, setCurrency, t } = useLanguage();
  const { resetToInitialSeed } = useApp();
  const { user, logout } = useAuth();

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'analytics', label: t.nav.analytics, icon: TrendingUp },
    { id: 'capture', label: t.nav.capture, icon: Camera },
    { id: 'coach', label: t.nav.coach, icon: Bot },
    { id: 'subscriptions', label: t.nav.subscriptions, icon: CalendarDays },
    { id: 'shared', label: t.nav.shared, icon: Users2 },
    { id: 'goals', label: t.nav.goals, icon: Target },
    { id: 'import', label: t.nav.import, icon: FileSpreadsheet },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Controls Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 text-xs flex-shrink-0">
            SW
          </div>
          <div className="text-left">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {t.appName}
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-xs">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Currency, Language, Theme & User Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 18-Language Selector */}
          <LanguageSelector />

          {/* Currency Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 px-2 py-1">
            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mr-1.5" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              aria-label="Select currency"
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              {Object.values(CURRENCY_CONFIGS).map((c) => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {c.code} ({c.symbol.trim()})
                </option>
              ))}
            </select>
          </div>

          {/* Theme Toggle in Top-Right Corner */}
          <ThemeToggle />

          {/* Seed Data Reset */}
          <button
            onClick={() => {
              if (confirm('Reset to mandatory 10 seed transactions?')) {
                resetToInitialSeed();
              }
            }}
            title="Reset seed transactions"
            className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Profile Pill & Logout */}
          {user && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <AtSign className="w-3 h-3 text-indigo-500" />
                <span>{user.username || user.fullName.split(' ')[0]}</span>
              </span>
              <button
                onClick={logout}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors ml-1"
                title={t.auth.logout}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick Add Expense Action */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t.actions.addExpense}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Navigation Tabs */}
      <div className="px-2 overflow-x-auto scrollbar-none flex gap-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600/10 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 dark:border-indigo-500/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
