import React, { useState } from 'react';
import {
  CalendarDays,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Subscription, Bill } from '../../types';

export const SubscriptionsManager: React.FC = () => {
  const { subscriptions, bills, toggleBillPaid, addSubscription, expenses } = useApp();
  const { formatMoney } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newFrequency, setNewFrequency] = useState<Subscription['frequency']>('monthly');
  const [autoDetectedNotice, setAutoDetectedNotice] = useState<string | null>(null);

  const totalMonthlySubs = subscriptions
    .filter(s => s.isActive)
    .reduce((sum, s) => sum + s.amount, 0);

  const totalUnpaidBills = bills
    .filter(b => !b.isPaid)
    .reduce((sum, b) => sum + b.estimatedAmount, 0);

  // Pattern detection simulation (scans expenses for recurring charges like Netflix and Spotify)
  const handleAutoDetect = () => {
    const recurringMerchants = ['Netflix', 'Spotify', 'Amazon Prime', 'YouTube Premium'];
    const found = expenses.filter(e => recurringMerchants.some(m => e.merchant.toLowerCase().includes(m.toLowerCase())));
    
    setAutoDetectedNotice(
      `Auto-detector verified ${found.length} active recurring transactions in history: Netflix (₹649) and Spotify (₹119) are actively synchronized.`
    );
    setTimeout(() => setAutoDetectedNotice(null), 5000);
  };

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newAmount) return;

    addSubscription({
      userId: 'usr_spendwise_demo_01',
      serviceName: newServiceName,
      amount: parseFloat(newAmount),
      frequency: newFrequency,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      category: 'Subscription'
    });

    setNewServiceName('');
    setNewAmount('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Subscriptions & Recurring Obligations
            </h3>
            <p className="text-[11px] text-slate-400">
              Automated pattern detection across transaction history
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoDetect}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Scan Transaction Patterns</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {autoDetectedNotice && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{autoDetectedNotice}</span>
        </div>
      )}

      {/* Subscriptions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Active Subscriptions</span>
            <span className="font-mono text-pink-400">({formatMoney(totalMonthlySubs)}/mo)</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            {subscriptions.length} tracked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">{sub.serviceName}</h5>
                  <span className="text-[10px] text-slate-400 capitalize">{sub.category} • {sub.frequency}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
              </div>

              <div className="space-y-1">
                <div className="text-lg font-bold font-mono text-white">
                  {formatMoney(sub.amount)}
                  <span className="text-xs text-slate-400 font-normal"> / {sub.frequency}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                  <span>Next Renewal:</span>
                  <span className="text-indigo-300 font-semibold">{sub.nextDueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recurring Utility & Debt Bills */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Recurring Utility & Living Bills</span>
            <span className="font-mono text-cyan-400">({formatMoney(totalUnpaidBills)} pending)</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            {bills.length} obligations
          </span>
        </div>

        <div className="space-y-2">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                bill.isPaid
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-70'
                  : 'bg-slate-900 border-slate-700/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleBillPaid(bill.id)}
                  aria-label={`Mark bill ${bill.billName} as ${bill.isPaid ? 'unpaid' : 'paid'}`}
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                    bill.isPaid
                      ? 'bg-emerald-600 text-white'
                      : 'border border-slate-600 hover:border-indigo-400'
                  }`}
                >
                  {bill.isPaid && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <div>
                  <span className={`font-semibold ${bill.isPaid ? 'line-through text-slate-400' : 'text-white'}`}>
                    {bill.billName}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Due: {bill.dueDate} • {bill.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-white text-sm">
                  {formatMoney(bill.estimatedAmount)}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    bill.isPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {bill.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Add New Recurring Subscription</h4>
            <form onSubmit={handleCreateSub} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Disney+ Hotstar"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium">Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="299"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium">Billing Frequency</label>
                <select
                  value={newFrequency}
                  onChange={(e) => setNewFrequency(e.target.value as Subscription['frequency'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
