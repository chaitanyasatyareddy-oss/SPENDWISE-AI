import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp } from 'lucide-react';

export const SpendingTrendChart: React.FC = () => {
  const { expenses } = useApp();
  const { formatMoney } = useLanguage();
  const { isDark } = useTheme();

  // Aggregate spending by day
  const dailyTotals: Record<string, number> = {};
  for (const exp of expenses) {
    dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;
  }

  // Sort dates
  const sortedDates = Object.keys(dailyTotals).sort();
  const dataPoints = sortedDates.map(date => ({
    date,
    amount: dailyTotals[date]
  }));

  const maxAmount = Math.max(...dataPoints.map(d => d.amount), 2500);
  const chartHeight = 160;
  const chartWidth = 480;

  // Build SVG path
  const points = dataPoints.map((dp, i) => {
    const x = dataPoints.length > 1 ? (i / (dataPoints.length - 1)) * (chartWidth - 40) + 20 : chartWidth / 2;
    const y = chartHeight - (dp.amount / maxAmount) * (chartHeight - 40) - 20;
    return { x, y, ...dp };
  });

  const linePath = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`
    : '';

  const gridLineColor = isDark ? '#334155' : '#e2e8f0';
  const labelColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 transition-colors shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Spending Trends Over Time
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Aggregated daily disbursement pattern
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
          Peak: {formatMoney(maxAmount)}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40 overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="10" y1={chartHeight - 20} x2={chartWidth - 10} y2={chartHeight - 20} stroke={gridLineColor} strokeDasharray="3 3" />
          <line x1="10" y1={chartHeight / 2} x2={chartWidth - 10} y2={chartHeight / 2} stroke={gridLineColor} strokeDasharray="3 3" />

          {/* Gradient area */}
          {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

          {/* Trend Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900 stroke-2 hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${pt.date}: ₹${pt.amount}`}</title>
              </circle>
              {/* Show date label on every 2nd point */}
              {i % 2 === 0 && (
                <text
                  x={pt.x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fill={labelColor}
                  className="text-[9px] font-mono"
                >
                  {pt.date.slice(5)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
