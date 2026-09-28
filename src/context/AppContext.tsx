import React, { createContext, useContext, useState } from 'react';
import { Expense, Budget, SavingsGoal, Subscription, Bill, SharedGroup, Challenge, UserProfile } from '../types';
import { LocalDB } from '../services/supabaseClient';

interface AppContextType {
  userProfile: UserProfile;
  expenses: Expense[];
  budgets: Budget[];
  subscriptions: Subscription[];
  bills: Bill[];
  savingsGoals: SavingsGoal[];
  sharedGroups: SharedGroup[];
  challenges: Challenge[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  deleteExpense: (id: string) => void;
  addSubscription: (sub: Omit<Subscription, 'id'>) => Subscription;
  toggleBillPaid: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => SavingsGoal;
  contributeToGoal: (id: string, amount: number) => void;
  addGroupExpense: (groupId: string, payerId: string, payerName: string, description: string, amount: number, splitType: 'equal' | 'exact' | 'percentage') => void;
  updateMonthlyBudget: (newBudget: number) => void;
  resetToInitialSeed: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => LocalDB.getUserProfile());
  const [expenses, setExpenses] = useState<Expense[]>(() => LocalDB.getExpenses());
  const [budgets, setBudgets] = useState<Budget[]>(() => LocalDB.getBudgets());
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => LocalDB.getSubscriptions());
  const [bills, setBills] = useState<Bill[]>(() => LocalDB.getBills());
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => LocalDB.getSavingsGoals());
  const [sharedGroups, setSharedGroups] = useState<SharedGroup[]>(() => LocalDB.getSharedGroups());
  const [challenges, setChallenges] = useState<Challenge[]>(() => LocalDB.getChallenges());

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const created = LocalDB.addExpense(expense);
    setExpenses(LocalDB.getExpenses());
    return created;
  };

  const deleteExpense = (id: string) => {
    LocalDB.deleteExpense(id);
    setExpenses(LocalDB.getExpenses());
  };

  const addSubscription = (sub: Omit<Subscription, 'id'>) => {
    const created = LocalDB.addSubscription(sub);
    setSubscriptions(LocalDB.getSubscriptions());
    return created;
  };

  const toggleBillPaid = (id: string) => {
    const updated = LocalDB.toggleBillPaid(id);
    setBills(updated);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const created = LocalDB.addSavingsGoal(goal);
    setSavingsGoals(LocalDB.getSavingsGoals());
    return created;
  };

  const contributeToGoal = (id: string, amount: number) => {
    const updated = LocalDB.updateSavingsGoalContribution(id, amount);
    setSavingsGoals(updated);
  };

  const addGroupExpense = (
    groupId: string,
    payerId: string,
    payerName: string,
    description: string,
    amount: number,
    splitType: 'equal' | 'exact' | 'percentage'
  ) => {
    LocalDB.addGroupExpense(groupId, payerId, payerName, description, amount, splitType);
    setSharedGroups(LocalDB.getSharedGroups());
  };

  const updateMonthlyBudget = (newBudget: number) => {
    const updated = LocalDB.updateUserProfile({ targetMonthlyBudget: newBudget });
    setUserProfile(updated);
  };

  const resetToInitialSeed = () => {
    LocalDB.resetAllData();
    setUserProfile(LocalDB.getUserProfile());
    setExpenses(LocalDB.getExpenses());
    setBudgets(LocalDB.getBudgets());
    setSubscriptions(LocalDB.getSubscriptions());
    setBills(LocalDB.getBills());
    setSavingsGoals(LocalDB.getSavingsGoals());
    setSharedGroups(LocalDB.getSharedGroups());
    setChallenges(LocalDB.getChallenges());
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        expenses,
        budgets,
        subscriptions,
        bills,
        savingsGoals,
        sharedGroups,
        challenges,
        addExpense,
        deleteExpense,
        addSubscription,
        toggleBillPaid,
        addSavingsGoal,
        contributeToGoal,
        addGroupExpense,
        updateMonthlyBudget,
        resetToInitialSeed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
