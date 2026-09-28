import React, { useState } from 'react';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateDailySpendingLimit } from '../../services/analyticsEngine';

export const MetricCards: React.FC = () => {
  const { userProfile, expenses, bills, subscriptions, savingsGoals } = useApp();
  const { formatMoney, t } = useLanguage();
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Exact algorithmic calculation of Daily Spending Limit
  const dailyCalc = calculateDailySpendingLimit(
    userProfile.targetMonthlyBudget,
    expenses,
    bills,
    subscriptions,
    savingsGoals,
    2 // 2 days remaining in late September cycle
  );

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const remainingBudget = Math.max(0, userProfile.targetMonthlyBudget - totalSpent);
  const budgetUtilization = Math.min(100, Math.round((totalSpent / userProfile.targetMonthlyBudget) * 100));
  const currentBalance = userProfile.monthlyIncome - totalSpent;

  return (
    <div className="space-y-4">
      {/* Dynamic Recommended Daily Limit Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-white">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300">
                <Clock className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                {t.metrics.dailyLimit}
              </h3>
              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                className="text-indigo-300 hover:text-white transition-colors"
                title="View dynamic mathematical formula"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
                {formatMoney(dailyCalc.dailyLimit)}
              </span>
              <span className="text-xs text-indigo-200 font-medium">
                / day ({dailyCalc.daysRemaining} {t.metrics.daysRemaining})
              </span>
            </div>
          </div>

          <div className="bg-slate-950/70 backdrop-blur-md border border-indigo-500/30 rounded-2xl px-4 py-2.5 text-xs text-slate-200 space-y-1 w-full sm:w-auto shadow-inner">
            <div className="flex justify-between gap-4 text-[11px]">
              <span className="text-slate-400">Remaining Budget:</span>
              <span className="font-semibold text-emerald-400 font-mono">{formatMoney(remainingBudget)}</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px]">
              <span className="text-slate-400">Upcoming Bills & Subs:</span>
              <span className="font-semibold text-rose-400 font-mono">-{formatMoney(dailyCalc.upcomingObligations)}</span>
            </div>
            <div className="flex justify-between gap-4 text-[11px]">
              <span className="text-slate-400">Active Savings Target:</span>
              <span className="font-semibold text-indigo-300 font-mono">-{formatMoney(dailyCalc.savingsAllocation)}</span>
            </div>
          </div>
        </div>

        {/* Formula breakdown drawer */}
        {showFormulaDetails && (
          <div className="mt-4 pt-3 border-t border-indigo-500/30 text-xs text-indigo-200 bg-indigo-950/60 p-3 rounded-2xl font-mono space-y-1">
            <p className="font-semibold text-white">Algorithmic Formulation (Page 4):</p>
            <p className="text-[11px] text-indigo-300">
              L_daily = (B_total - Σ E_current - Σ S_upcoming - G_target) / D_remaining
            </p>
            <p className="text-[11px] text-slate-300">
              Active Parameters: {dailyCalc.formulaString}
            </p>
          </div>
        )}
      </div>

      {/* Grid of Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Monthly Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 transition-colors shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold">{t.metrics.totalIncome}</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
            {formatMoney(userProfile.monthlyIncome)}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3" />
            <span>Net verified salary</span>
          </div>
        </div>

        {/* Card 2: Total Expenses */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 transition-colors shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold">{t.metrics.totalExpenses}</span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
            {formatMoney(totalSpent)}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Across {expenses.length} tracked items
          </div>
        </div>

        {/* Card 3: Current Net Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 transition-colors shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold">{t.metrics.currentBalance}</span>
            <PiggyBank className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
            {formatMoney(currentBalance)}
          </div>
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium">
            Free cash reserve
          </div>
        </div>

        {/* Card 4: Budget Utilization */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2 transition-colors shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[11px] font-semibold">{t.metrics.budgetUtilization}</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-mono">
            {budgetUtilization}%
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                budgetUtilization > 90
                  ? 'bg-rose-500'
                  : budgetUtilization > 75
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, budgetUtilization)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
