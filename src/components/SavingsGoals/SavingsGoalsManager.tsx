import React, { useState } from 'react';
import { Target, Plus, Trophy, CheckCircle2, TrendingUp, Sparkles, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { SavingsGoal } from '../../types';

export const SavingsGoalsManager: React.FC = () => {
  const { savingsGoals, addSavingsGoal, contributeToGoal, challenges } = useApp();
  const { formatMoney } = useLanguage();

  const [showModal, setShowModal] = useState(false);
  const [goalName, setGoalName] = useState('Save ₹5,000 in 3 months');
  const [targetAmount, setTargetAmount] = useState('5000');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(targetAmount);
    if (!goalName || isNaN(num) || num <= 0) return;

    addSavingsGoal({
      userId: 'usr_spendwise_demo_01',
      goalName,
      targetAmount: num,
      currentAmount: 0,
      targetDate,
      isPaused: false
    });

    setGoalName('');
    setTargetAmount('');
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Target Savings Goals & AI Challenges
            </h3>
            <p className="text-[11px] text-slate-400">
              Track progress toward goals and earn gamified financial milestones
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Goals Cards */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Active Financial Targets
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savingsGoals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

            return (
              <div
                key={goal.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-white">{goal.goalName}</h5>
                    <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-semibold">
                      Target: {goal.targetDate}
                    </span>
                  </div>

                  {/* Amounts */}
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-lg font-mono font-extrabold text-white">
                      {formatMoney(goal.currentAmount)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      of {formatMoney(goal.targetAmount)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 mt-2">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-emerald-400"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>{percentage}% funded</span>
                    <span>Remaining: {formatMoney(Math.max(0, goal.targetAmount - goal.currentAmount))}</span>
                  </div>
                </div>

                {/* Quick Contribute Action */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Quick Contribute:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => contributeToGoal(goal.id, 500)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-[11px] font-mono font-semibold transition-all"
                    >
                      +₹500
                    </button>
                    <button
                      onClick={() => contributeToGoal(goal.id, 1000)}
                      className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 rounded-lg text-[11px] font-mono font-semibold transition-all"
                    >
                      +₹1,000
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamified AI Savings Challenges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            AI Gamified Savings Challenges
          </h4>
        </div>

        <div className="space-y-2">
          {challenges.map((ch) => (
            <div
              key={ch.id}
              className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">{ch.title}</div>
                  <div className="text-[11px] text-slate-400">
                    Saved: <strong className="font-mono text-emerald-400">{formatMoney(ch.currentSaved)}</strong> of {formatMoney(ch.targetSavings)} • Deadline: {ch.deadline}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  +{ch.rewardPoints} pts
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    ch.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-indigo-500/20 text-indigo-300'
                  }`}
                >
                  {ch.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Create New Savings Target Goal</h4>
            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Save ₹5,000 in 3 months"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Target Amount (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Target Completion Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
