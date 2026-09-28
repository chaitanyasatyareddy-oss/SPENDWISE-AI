import React, { useState } from 'react';
import { TrendingUp, Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateCategoryForecasts } from '../../services/analyticsEngine';

export const ForecastingCard: React.FC = () => {
  const { expenses, budgets } = useApp();
  const { formatMoney } = useLanguage();
  const [showFormula, setShowFormula] = useState(false);

  // Month-end forecast using exact EWMA formula from Page 4
  const forecasts = calculateCategoryForecasts(expenses, budgets, 27, 30);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">
                EWMA Category Spending Forecasts
              </h3>
              <button
                onClick={() => setShowFormula(!showFormula)}
                className="text-slate-400 hover:text-cyan-300 transition-colors"
                title="View EWMA formula details"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Blends current month-to-date run rate with historical moving average (&alpha; = 0.6)
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
          &alpha; = 0.60
        </span>
      </div>

      {showFormula && (
        <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-200/90 font-mono space-y-1">
          <p className="font-semibold text-white">EWMA Mathematical Specification (Page 4):</p>
          <p className="text-[11px]">
            Ê_(c, month_end) = E_(c, mtd) + ((d_total - d_elapsed) / d_total) &times; [0.6 &times; E_(c, run_rate) + 0.4 &times; H̄_c]
          </p>
          <p className="text-[10px] text-slate-400">
            Where E_(c, run_rate) = (E_(c, mtd) / d_elapsed) &times; d_total
          </p>
        </div>
      )}

      {/* Forecast list */}
      <div className="space-y-3">
        {forecasts.map((f) => {
          const percentOfBudget = Math.round((f.projectedMonthEnd / f.budgetAllocated) * 100);

          return (
            <div
              key={f.category}
              className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{f.category}</span>
                  <span className="text-[11px] text-slate-400">
                    MTD Spent: <strong className="font-mono text-slate-200">{formatMoney(f.mtdSpend)}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Month-End Projection:</span>
                  <div className="font-mono font-extrabold text-sm text-cyan-300">
                    {formatMoney(f.projectedMonthEnd)}
                  </div>
                </div>
              </div>

              {/* Progress bar compared to budget */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Budget Allocation: {formatMoney(f.budgetAllocated)}</span>
                  <span
                    className={
                      percentOfBudget > 100
                        ? 'text-rose-400 font-bold'
                        : percentOfBudget > 80
                        ? 'text-amber-400 font-semibold'
                        : 'text-emerald-400'
                    }
                  >
                    {percentOfBudget}% of limit
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      percentOfBudget > 100
                        ? 'bg-rose-500'
                        : percentOfBudget > 80
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, percentOfBudget)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
