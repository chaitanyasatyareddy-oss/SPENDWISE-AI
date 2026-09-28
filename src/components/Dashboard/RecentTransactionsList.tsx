import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatters';
import {
  AlertTriangle,
  Receipt,
  Mic,
  Smartphone,
  CreditCard,
  Trash2,
} from 'lucide-react';

export const RecentTransactionsList: React.FC = () => {
  const { expenses, deleteExpense } = useApp();
  const { formatMoney } = useLanguage();
  const [filterTag, setFilterTag] = useState<'All' | 'Need' | 'Want' | 'Anomaly'>('All');

  const filteredExpenses = expenses.filter(e => {
    if (filterTag === 'All') return true;
    if (filterTag === 'Need') return e.needWantTag === 'Need';
    if (filterTag === 'Want') return e.needWantTag === 'Want';
    if (filterTag === 'Anomaly') return e.isAnomaly || (e.anomalyZScore && e.anomalyZScore >= 2.5);
    return true;
  });

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'upi':
        return <span title="UPI Transaction"><Smartphone className="w-3 h-3 text-emerald-500" /></span>;
      case 'receipt':
        return <span title="Receipt OCR"><Receipt className="w-3 h-3 text-indigo-500" /></span>;
      case 'voice':
        return <span title="Voice Entry"><Mic className="w-3 h-3 text-purple-500" /></span>;
      default:
        return <span title="Manual Entry"><CreditCard className="w-3 h-3 text-slate-400" /></span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 transition-colors shadow-sm dark:shadow-none">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Recent Transactions</span>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {filteredExpenses.length}
            </span>
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Multi-source ledger with automated Need/Want classification
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-xs">
          {(['All', 'Need', 'Want', 'Anomaly'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTag(tab)}
              className={`px-3 py-1 rounded-xl font-medium transition-all ${
                filterTag === tab
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No transactions match this filter.
          </div>
        ) : (
          filteredExpenses.map(expense => {
            const isAnomaly = expense.isAnomaly || (expense.anomalyZScore && expense.anomalyZScore >= 2.5);

            return (
              <div
                key={expense.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isAnomaly
                    ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-500/40 hover:border-rose-400'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Left metadata */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                      expense.needWantTag === 'Need'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {expense.merchant.slice(0, 1).toUpperCase()}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {expense.merchant}
                      </span>
                      {isAnomaly && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Unusual (Z={expense.anomalyZScore || 2.85}σ)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        {getSourceIcon(expense.source)}
                        <span>{expense.category}</span>
                      </span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                      <span>•</span>
                      <span className="text-slate-400 dark:text-slate-500">{expense.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Right Amount & Actions */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                      -{formatMoney(expense.amount)}
                    </div>
                    {/* Need/Want tag pill */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                        expense.needWantTag === 'Need'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {expense.needWantTag}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
