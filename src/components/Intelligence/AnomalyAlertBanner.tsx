import React from 'react';
import { AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { detectExpenseAnomalies } from '../../services/analyticsEngine';

export const AnomalyAlertBanner: React.FC = () => {
  const { expenses } = useApp();
  const { formatMoney } = useLanguage();

  const anomalies = detectExpenseAnomalies(expenses);

  if (anomalies.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Statistical Anomaly Alerts (Z &ge; 2.5&sigma;)
            </h4>
            <p className="text-[11px] text-slate-400">
              Neutral notifications identifying deviations from category baselines
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
          {anomalies.length} Flagged
        </span>
      </div>

      <div className="space-y-2">
        {anomalies.map((anom) => (
          <div
            key={anom.expenseId}
            className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300">
                  Unusual spending detected
                </span>
                <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700">
                  Z = {anom.zScore}&sigma;
                </span>
                <span className="text-slate-400">({anom.category})</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Transaction of <strong className="font-mono text-white">{formatMoney(anom.amount)}</strong> at{' '}
                <strong className="text-white">{anom.merchant}</strong> significantly exceeds historical baseline
                (Mean: {formatMoney(anom.categoryMean)}, &sigma;: {formatMoney(anom.categoryStdDev)}).
              </p>
            </div>

            <div className="flex-shrink-0">
              <span className="text-[10px] font-medium text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                Neutral notification
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
