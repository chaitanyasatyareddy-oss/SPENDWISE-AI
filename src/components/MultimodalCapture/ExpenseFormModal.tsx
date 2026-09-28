import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Expense } from '../../types';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Expense>;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  initialData
}) => {
  const { addExpense } = useApp();
  const { t } = useLanguage();

  const [merchant, setMerchant] = useState(initialData?.merchant || '');
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : '');
  const [category, setCategory] = useState<Expense['category']>(initialData?.category || 'Food');
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>(initialData?.paymentMethod || 'UPI');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [needWantTag, setNeedWantTag] = useState<Expense['needWantTag']>(initialData?.needWantTag || 'Want');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [isAnomaly, setIsAnomaly] = useState(false);

  if (!isOpen) return null;

  const handleAmountChange = (val: string) => {
    setAmount(val);
    const num = parseFloat(val);
    // Dynamic anomaly flag simulation: Food > 1200 or Shopping > 2200
    if ((category === 'Food' && num > 1200) || (category === 'Shopping' && num > 2200)) {
      setIsAnomaly(true);
    } else {
      setIsAnomaly(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!merchant || isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid merchant and amount.');
      return;
    }

    addExpense({
      userId: 'usr_spendwise_demo_01',
      merchant,
      amount: numAmount,
      category,
      paymentMethod,
      date,
      needWantTag,
      notes,
      source: initialData?.source || 'manual',
      isAnomaly: isAnomaly,
      anomalyZScore: isAnomaly ? 2.6 : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{t.actions.addExpense}</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Merchant */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Merchant / Payee</label>
            <input
              type="text"
              required
              placeholder="e.g., Swiggy, Uber, Supermarket"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Amount & Date Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Amount (₹)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="450"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Anomaly warning preview if triggered */}
          {isAnomaly && (
            <div className="bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>Unusual spending detected (Z &ge; 2.5). This transaction exceeds category baseline.</span>
            </div>
          )}

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Expense['category'])}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Food">Food & Dining</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping & Retail</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Subscription">Subscription</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Travel">Travel</option>
              <option value="Groceries">Groceries</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Need vs Want Classification */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Expense Classification</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNeedWantTag('Need')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  needWantTag === 'Need'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Need (Essential)
              </button>
              <button
                type="button"
                onClick={() => setNeedWantTag('Want')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  needWantTag === 'Want'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                Want (Discretionary)
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Payment Method</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['UPI', 'Credit Card', 'Debit Card', 'Cash', 'NetBanking'] as const).map(pm => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border transition-all ${
                    paymentMethod === pm
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950 border-slate-700/80 text-slate-400'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Lunch with team"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
            >
              {t.actions.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
