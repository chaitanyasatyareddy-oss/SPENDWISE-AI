import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { PieChart, CreditCard, Award } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Shopping: '#8b5cf6',
  Bills: '#06b6d4',
  Transport: '#3b82f6',
  Subscription: '#ec4899',
  Entertainment: '#eab308',
  Healthcare: '#10b981',
  Groceries: '#84cc16',
  Other: '#64748b'
};

export const CategoryDonutChart: React.FC = () => {
  const { expenses } = useApp();
  const { formatMoney } = useLanguage();

  // Aggregate by category
  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  }

  const totalSpent = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Aggregate by payment method
  const paymentTotals: Record<string, number> = {};
  for (const exp of expenses) {
    paymentTotals[exp.paymentMethod] = (paymentTotals[exp.paymentMethod] || 0) + exp.amount;
  }

  // Top Merchants
  const merchantTotals: Record<string, number> = {};
  for (const exp of expenses) {
    merchantTotals[exp.merchant] = (merchantTotals[exp.merchant] || 0) + exp.amount;
  }
  const topMerchants = Object.entries(merchantTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Build SVG Donut segments
  let cumulativeAngle = 0;
  const radius = 45;
  const cx = 60;
  const cy = 60;

  const segments = sortedCategories.map(([category, amount]) => {
    const angle = (amount / totalSpent) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = (((startAngle + angle) - 90) * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = angle >= 359.9
      ? `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${cy - radius}`
      : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;

    return {
      category,
      amount,
      percentage: Math.round((amount / totalSpent) * 100),
      color: CATEGORY_COLORS[category] || '#94a3b8',
      pathData
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Category Breakdown Donut */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 transition-colors shadow-sm dark:shadow-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Category Breakdown
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Proportional portfolio distribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          {/* Donut graphic */}
          <div className="w-32 h-32 flex-shrink-0 relative">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              {segments.map((seg, idx) => (
                <path
                  key={idx}
                  d={seg.pathData}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="18"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Total</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{formatMoney(totalSpent)}</span>
            </div>
          </div>

          {/* Category Legend list */}
          <div className="flex-1 space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
            {sortedCategories.slice(0, 5).map(([cat, amt]) => {
              const pct = Math.round((amt / totalSpent) * 100);
              return (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[cat] || '#94a3b8' }}
                    ></span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{cat}</span>
                  </div>
                  <span className="font-mono text-slate-500 dark:text-slate-400 font-semibold">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Methods & Top Merchants */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 transition-colors shadow-sm dark:shadow-none">
        {/* Top Merchants */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Top Merchant Rankings
            </h4>
          </div>
          <div className="space-y-1.5">
            {topMerchants.map(([merchant, amt], idx) => (
              <div
                key={merchant}
                className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-950/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800/80"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 w-4 font-mono">
                    #{idx + 1}
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{merchant}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatMoney(amt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <CreditCard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Payment Method Mix</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            {Object.entries(paymentTotals).map(([method, amt]) => (
              <span
                key={method}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 font-medium"
              >
                {method}: <strong className="font-mono text-indigo-600 dark:text-indigo-300">{formatMoney(amt)}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
