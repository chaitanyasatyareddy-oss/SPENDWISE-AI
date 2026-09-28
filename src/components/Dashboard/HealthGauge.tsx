import React from 'react';
import { HeartPulse, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { evaluateFinancialHealth } from '../../services/analyticsEngine';

export const HealthGauge: React.FC = () => {
  const { expenses, userProfile } = useApp();
  const { formatMoney, t } = useLanguage();

  const health = evaluateFinancialHealth(
    expenses,
    userProfile.monthlyIncome,
    userProfile.targetMonthlyBudget
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 transition-colors shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t.metrics.healthIndex}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Deterministic scoring based on Needs vs Wants mix & savings rate
            </p>
          </div>
        </div>

        {/* Health Grade Badge */}
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full border ${health.badgeColor}`}
        >
          {health.grade} ({health.score}/100)
        </span>
      </div>

      {/* Visual Health Score Gauge Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Financial Stability</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{health.score} / 100</span>
        </div>
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400"
            style={{ width: `${health.score}%` }}
          ></div>
        </div>
      </div>

      {/* Needs vs Wants Spending Breakdown */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Needs (Essential)</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-300 font-bold">{health.needsRatio}%</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {formatMoney(health.needsSpent)}
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${health.needsRatio}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Wants (Discretionary)</span>
            <span className="font-mono text-amber-600 dark:text-amber-300 font-bold">{health.wantsRatio}%</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {formatMoney(health.wantsSpent)}
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${health.wantsRatio}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Commentary & Non-Advisory Disclaimer */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-3.5 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5">
        <p className="leading-relaxed">
          {health.commentary}
        </p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
          * {t.metrics.disclaimer}
        </p>
      </div>
    </div>
  );
};
