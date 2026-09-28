import React, { useState } from 'react';
import { Users2, Plus, ArrowRightLeft, CheckCircle2, UserPlus, Receipt } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export const GroupLedgerView: React.FC = () => {
  const { sharedGroups, addGroupExpense } = useApp();
  const { formatMoney } = useLanguage();

  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('usr_spendwise_demo_01');
  const [splitType, setSplitType] = useState<'equal' | 'exact' | 'percentage'>('equal');

  const group = sharedGroups[activeGroupIndex] || sharedGroups[0];
  if (!group) return null;

  // Calculate net balances for each member
  // balance = totalPaid - totalOwed
  const memberBalances: Record<string, { name: string; paid: number; owed: number; net: number }> = {};
  group.members.forEach(m => {
    memberBalances[m.id] = { name: m.name, paid: 0, owed: 0, net: 0 };
  });

  group.expenses.forEach(exp => {
    if (memberBalances[exp.payerId]) {
      memberBalances[exp.payerId].paid += exp.amount;
    }
    exp.splits.forEach(split => {
      if (memberBalances[split.memberId]) {
        memberBalances[split.memberId].owed += split.amountOwed;
      }
    });
  });

  Object.values(memberBalances).forEach(mb => {
    mb.net = mb.paid - mb.owed;
  });

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!description || isNaN(num) || num <= 0) return;

    const payer = group.members.find(m => m.id === payerId);
    addGroupExpense(
      group.id,
      payerId,
      payer?.name || 'Member',
      description,
      num,
      splitType
    );

    setDescription('');
    setAmount('');
    setShowAddExpenseModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Users2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{group.groupName}</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {group.members.length} Members
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Shared Expense Ledger with multi-tenant isolation & automated split balancing
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Group Expense</span>
        </button>
      </div>

      {/* Member Balance Settlement Cards */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Individual Settlement Balances
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(memberBalances).map(([id, mb]) => (
            <div
              key={id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 ${
                mb.net > 0
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : mb.net < 0
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{mb.name}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    mb.net > 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : mb.net < 0
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {mb.net > 0 ? 'Gets Back' : mb.net < 0 ? 'Owes Group' : 'Settled'}
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="text-base font-extrabold font-mono text-white">
                  {mb.net >= 0 ? `+${formatMoney(mb.net)}` : `-${formatMoney(Math.abs(mb.net))}`}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Paid: {formatMoney(mb.paid)}</span>
                  <span>Share: {formatMoney(mb.owed)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Expenses Activity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>Shared Ledger Transactions</span>
          <span className="text-slate-400 font-mono text-[11px] font-normal">
            {group.expenses.length} shared events
          </span>
        </h4>

        <div className="space-y-2">
          {group.expenses.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">{exp.description}</div>
                  <div className="text-[11px] text-slate-400">
                    Paid by <strong className="text-indigo-300">{exp.payerName}</strong> • {exp.date} • Split: {exp.splitType}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-bold font-mono text-white">
                  {formatMoney(exp.amount)}
                </div>
                <span className="text-[10px] text-slate-400">
                  {formatMoney(Math.round(exp.amount / group.members.length))} / person
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Group Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Add Shared Group Expense</h4>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Goa Airbnb Rental"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Total Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="4000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Who Paid?</label>
                <select
                  value={payerId}
                  onChange={(e) => setPayerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {group.members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  Split Equally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
