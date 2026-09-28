import { Expense, Budget, Bill, Subscription, SavingsGoal } from '../types';

export interface DailyLimitCalculation {
  dailyLimit: number;
  totalBudget: number;
  totalExpenses: number;
  upcomingObligations: number;
  savingsAllocation: number;
  daysRemaining: number;
  formulaString: string;
}

export interface AnomalyReport {
  expenseId: string;
  merchant: string;
  category: string;
  amount: number;
  categoryMean: number;
  categoryStdDev: number;
  zScore: number;
  isAnomaly: boolean;
  message: string;
}

export interface CategoryForecast {
  category: string;
  mtdSpend: number;
  runRate: number;
  historicalMean: number;
  projectedMonthEnd: number;
  budgetAllocated: number;
  status: 'on_track' | 'warning' | 'exceeded';
}

/**
 * 1. Recommended Daily Spending Limit
 * L_daily = (B_total - sum(E_current) - sum(S_upcoming) - G_target) / D_remaining
 */
export function calculateDailySpendingLimit(
  totalBudget: number,
  expenses: Expense[],
  bills: Bill[],
  subscriptions: Subscription[],
  savingsGoals: SavingsGoal[],
  customDaysRemaining?: number
): DailyLimitCalculation {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Unpaid bills + active monthly subscriptions
  const unpaidBills = bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.estimatedAmount, 0);
  const activeSubs = subscriptions.filter(s => s.isActive).reduce((sum, s) => sum + s.amount, 0);
  const upcomingObligations = unpaidBills + activeSubs;

  // Active savings allocation
  const activeGoals = savingsGoals.filter(g => !g.isPaused);
  const savingsAllocation = activeGoals.reduce((sum, g) => sum + Math.max(0, g.targetAmount - g.currentAmount) / 3, 0);

  // Billing cycle calculations (assuming current date is 28th of a 30-day month = 2 days remaining, or parameter)
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysRemaining = customDaysRemaining ?? Math.max(1, daysInMonth - currentDay);

  const remainingAvailable = totalBudget - totalExpenses - upcomingObligations - savingsAllocation;
  const rawDaily = remainingAvailable / daysRemaining;
  const dailyLimit = Math.max(0, Math.round(rawDaily));

  return {
    dailyLimit,
    totalBudget,
    totalExpenses,
    upcomingObligations,
    savingsAllocation: Math.round(savingsAllocation),
    daysRemaining,
    formulaString: `(₹${totalBudget} - ₹${totalExpenses} - ₹${upcomingObligations} - ₹${Math.round(savingsAllocation)}) / ${daysRemaining} days = ₹${dailyLimit}/day`
  };
}

/**
 * 2. Expense Anomaly Detection Index
 * Z_expense = (X_i - mu_c) / sigma_c
 * Trigger neutral alert if Z_expense >= 2.5 ("unusual spending detected")
 */
export function detectExpenseAnomalies(expenses: Expense[]): AnomalyReport[] {
  // Group historical amounts by category
  const categoryGroups: Record<string, number[]> = {};
  for (const exp of expenses) {
    if (!categoryGroups[exp.category]) {
      categoryGroups[exp.category] = [];
    }
    categoryGroups[exp.category].push(exp.amount);
  }

  // Pre-seed realistic baseline standard deviations for categories with few points
  const categoryBaselines: Record<string, { mean: number; stdDev: number }> = {
    Food: { mean: 480, stdDev: 190 },
    Shopping: { mean: 950, stdDev: 420 },
    Transport: { mean: 200, stdDev: 60 },
    Bills: { mean: 800, stdDev: 450 },
    Subscription: { mean: 350, stdDev: 180 },
    Entertainment: { mean: 450, stdDev: 150 },
    Healthcare: { mean: 600, stdDev: 250 },
    Groceries: { mean: 800, stdDev: 300 },
    Other: { mean: 500, stdDev: 200 }
  };

  const reports: AnomalyReport[] = [];

  for (const exp of expenses) {
    const baseline = categoryBaselines[exp.category] || { mean: 600, stdDev: 300 };
    const amounts = categoryGroups[exp.category] || [];

    let mu_c = baseline.mean;
    let sigma_c = baseline.stdDev;

    if (amounts.length >= 3) {
      mu_c = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = amounts.reduce((acc, val) => acc + Math.pow(val - mu_c, 2), 0) / amounts.length;
      sigma_c = Math.sqrt(variance) || 1;
    }

    const zScore = Number(((exp.amount - mu_c) / (sigma_c || 1)).toFixed(2));
    const isAnomaly = zScore >= 2.5 || exp.isAnomaly === true;

    if (isAnomaly) {
      reports.push({
        expenseId: exp.id,
        merchant: exp.merchant,
        category: exp.category,
        amount: exp.amount,
        categoryMean: Math.round(mu_c),
        categoryStdDev: Math.round(sigma_c),
        zScore,
        isAnomaly: true,
        message: `Unusual spending detected: ₹${exp.amount} at ${exp.merchant} is ${zScore}σ above the historical category baseline (Mean: ₹${Math.round(mu_c)}, σ: ₹${Math.round(sigma_c)}).`
      });
    }
  }

  return reports;
}

/**
 * 3. Category Spending Forecast (EWMA)
 * E_hat = E_c_mtd + ((d_total - d_elapsed) / d_total) * (alpha * E_runrate + (1 - alpha) * H_bar_c)
 * where E_runrate = (E_c_mtd / d_elapsed) * d_total
 * alpha = 0.6
 */
export function calculateCategoryForecasts(
  expenses: Expense[],
  budgets: Budget[],
  customElapsedDays?: number,
  customTotalDays?: number
): CategoryForecast[] {
  const now = new Date();
  const d_elapsed = customElapsedDays ?? Math.max(1, now.getDate());
  const d_total = customTotalDays ?? new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const alpha = 0.6;

  // Aggregate MTD spend by category
  const mtdSpendByCategory: Record<string, number> = {};
  for (const exp of expenses) {
    mtdSpendByCategory[exp.category] = (mtdSpendByCategory[exp.category] || 0) + exp.amount;
  }

  // Historical benchmarks
  const historicalBenchmarks: Record<string, number> = {
    Food: 4200,
    Shopping: 5500,
    Bills: 3800,
    Transport: 2400,
    Subscription: 1200,
    Entertainment: 1800,
    Healthcare: 1500,
    Groceries: 3500,
    Other: 1000
  };

  const forecasts: CategoryForecast[] = [];

  const categories = Object.keys(mtdSpendByCategory);
  for (const cat of categories) {
    const E_mtd = mtdSpendByCategory[cat] || 0;
    const E_runrate = (E_mtd / d_elapsed) * d_total;
    const H_bar = historicalBenchmarks[cat] || E_mtd * 1.2;

    const remainingFactor = (d_total - d_elapsed) / d_total;
    const blendedFutureRate = (alpha * E_runrate) + ((1 - alpha) * H_bar);
    const E_hat = Math.round(E_mtd + (remainingFactor * blendedFutureRate));

    const budget = budgets.find(b => b.category === cat)?.allocatedAmount || 5000;
    let status: 'on_track' | 'warning' | 'exceeded' = 'on_track';
    if (E_hat > budget) {
      status = 'exceeded';
    } else if (E_hat > budget * 0.85) {
      status = 'warning';
    }

    forecasts.push({
      category: cat,
      mtdSpend: E_mtd,
      runRate: Math.round(E_runrate),
      historicalMean: H_bar,
      projectedMonthEnd: E_hat,
      budgetAllocated: budget,
      status
    });
  }

  return forecasts.sort((a, b) => b.projectedMonthEnd - a.projectedMonthEnd);
}

/**
 * Financial Health Score & Spending Mix Evaluation
 */
export function evaluateFinancialHealth(expenses: Expense[], monthlyIncome: number, monthlyBudget: number) {
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const needsSpent = expenses.filter(e => e.needWantTag === 'Need').reduce((s, e) => s + e.amount, 0);
  const wantsSpent = expenses.filter(e => e.needWantTag === 'Want').reduce((s, e) => s + e.amount, 0);

  const needsRatio = totalSpent > 0 ? (needsSpent / totalSpent) * 100 : 50;
  const wantsRatio = totalSpent > 0 ? (wantsSpent / totalSpent) * 100 : 50;
  const budgetUtilization = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100 : 0;

  let score = 100;
  if (budgetUtilization > 100) score -= 40;
  else if (budgetUtilization > 85) score -= 20;
  else if (budgetUtilization > 70) score -= 10;

  if (wantsRatio > 60) score -= 15;
  if (savingsRate < 20) score -= 15;

  score = Math.max(10, Math.min(98, Math.round(score)));

  let grade = 'Excellent';
  let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (score < 50) {
    grade = 'Critical';
    badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  } else if (score < 75) {
    grade = 'Moderate';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (score < 85) {
    grade = 'Good';
    badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
  }

  return {
    score,
    grade,
    badgeColor,
    totalSpent,
    needsSpent,
    wantsSpent,
    needsRatio: Math.round(needsRatio),
    wantsRatio: Math.round(wantsRatio),
    budgetUtilization: Math.round(budgetUtilization),
    savingsRate: Math.max(0, Math.round(savingsRate)),
    commentary: `Spending mix shows ${Math.round(needsRatio)}% Needs vs ${Math.round(wantsRatio)}% Wants. Budget utilization is at ${Math.round(budgetUtilization)}% with an estimated ${Math.max(0, Math.round(savingsRate))}% savings rate.`
  };
}
