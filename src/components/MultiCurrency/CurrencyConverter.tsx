import React, { useState } from 'react';
import { Globe, ArrowRightLeft, Coins, Calculator } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { CURRENCY_CONFIGS, formatCurrency } from '../../utils/formatters';
import { CurrencyCode } from '../../types';

export const CurrencyConverter: React.FC = () => {
  const { currency, setCurrency } = useLanguage();
  const [inrAmount, setInrAmount] = useState<string>('5000');

  const baseAmount = parseFloat(inrAmount) || 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            Multi-Currency Foreign Exchange Engine
          </h3>
          <p className="text-[11px] text-slate-400">
            Real-time live multi-currency rendering with base INR persistence
          </p>
        </div>
      </div>

      {/* Interactive Input */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Base Currency Amount (INR ₹)</span>
        </label>
        <input
          type="number"
          value={inrAmount}
          onChange={(e) => setInrAmount(e.target.value)}
          placeholder="5000"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Grid of All Currencies */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((cCode) => {
          const cfg = CURRENCY_CONFIGS[cCode];
          const isSelected = currency === cCode;
          const convertedValue = formatCurrency(baseAmount, cCode);

          return (
            <div
              key={cCode}
              onClick={() => setCurrency(cCode)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{cfg.code}</span>
                  <span className="text-[10px] text-slate-400">({cfg.name})</span>
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                )}
              </div>

              <div className="font-mono text-base font-extrabold text-white">
                {convertedValue}
              </div>

              <div className="text-[10px] text-slate-400">
                1 INR = {cfg.rateAgainstINR} {cfg.code}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
