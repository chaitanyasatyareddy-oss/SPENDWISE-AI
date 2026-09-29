import { createClient } from '@supabase/supabase-js';
import { Expense, Budget, SavingsGoal, Subscription, Bill, SharedGroup, Challenge, UserProfile, RememberedCustomer } from '../types';
import {
  initialUserProfile,
  initialExpenses,
  initialBudgets,
  initialSubscriptions,
  initialBills,
  initialSavingsGoals,
  initialSharedGroup,
  initialChallenges
} from '../data/seedData';

// Supabase environment variables (with fallback for standalone execution)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ngqvqmhjooowoxlmwfun.supabase.co';
const supabaseKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXZxbWhqb29vd294bG13ZnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODc2MjEsImV4cCI6MjEwNjE2MzYyMX0._bzwHFqScIGiUp2yULYzCsKcjeEqwaaerbvm_1Mu1es';

export const supabase = createClient(supabaseUrl, supabaseKey);

const STORAGE_KEYS = {
  USER: 'spendwise_user_profile',
  SESSION: 'spendwise_active_session',
  USERS_LIST: 'spendwise_registered_users',
  REMEMBERED_CUSTOMER: 'spendwise_remembered_customer',
  REMEMBER_ME: 'spendwise_remember_me',
  EXPENSES: 'spendwise_expenses',
  BUDGETS: 'spendwise_budgets',
  SUBSCRIPTIONS: 'spendwise_subscriptions',
  BILLS: 'spendwise_bills',
  SAVINGS_GOALS: 'spendwise_savings_goals',
  SHARED_GROUPS: 'spendwise_shared_groups',
  CHALLENGES: 'spendwise_challenges',
};

// Storage manager with initial seed data loading
export const LocalDB = {
  getRegisteredUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (!raw) {
      const initialUsers = [initialUserProfile];
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(initialUsers));
      return initialUsers;
    }
    try {
      const users: UserProfile[] = JSON.parse(raw);
      // Ensure initial demo profile includes the latest registered phone numbers
      const demoIdx = users.findIndex(u => u.id === initialUserProfile.id);
      if (demoIdx >= 0) {
        let changed = false;
        if (users[demoIdx].phoneNumber !== initialUserProfile.phoneNumber) {
          users[demoIdx].phoneNumber = initialUserProfile.phoneNumber;
          changed = true;
        }
        if (users[demoIdx].alternatePhone !== initialUserProfile.alternatePhone) {
          users[demoIdx].alternatePhone = initialUserProfile.alternatePhone;
          changed = true;
        }
        if (changed) {
          localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
        }
      } else {
        users.unshift(initialUserProfile);
        localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
      }
      return users;
    } catch {
      return [initialUserProfile];
    }
  },

  saveRegisteredUser(user: UserProfile): void {
    const safeUser = { ...user };
    delete safeUser.password;
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.id === safeUser.id);
    if (idx >= 0) {
      users[idx] = safeUser;
    } else {
      users.push(safeUser);
    }
    localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
  },

  findUserByIdentifier(identifier: string): UserProfile | undefined {
    if (!identifier || identifier.trim().length < 2) return undefined;
    const clean = identifier.trim().toLowerCase();
    const cleanHandle = clean.startsWith('@') ? clean.slice(1) : clean;
    // Normalize phone numbers by removing spaces and dashes
    const cleanPhone = clean.replace(/[\s-]/g, '');

    const users = this.getRegisteredUsers();
    return users.find(u => {
      const uUsername = u.username?.toLowerCase();
      const uPhone = u.phoneNumber?.replace(/[\s-]/g, '');
      const uAltPhone = u.alternatePhone?.replace(/[\s-]/g, '');
      const uEmail = u.email?.toLowerCase();

      // Check username match
      if (uUsername && uUsername === cleanHandle) return true;

      // Check email match
      if (uEmail && uEmail === clean) return true;

      // Check phone match against primary and alternate phone numbers
      const cleanDigits = clean.replace(/\D/g, '');
      const uPhoneDigits = uPhone ? uPhone.replace(/\D/g, '') : '';
      const uAltPhoneDigits = uAltPhone ? uAltPhone.replace(/\D/g, '') : '';

      if (cleanDigits.length >= 10) {
        if (uPhoneDigits.length >= 10 && cleanDigits.slice(-10) === uPhoneDigits.slice(-10)) return true;
        if (uAltPhoneDigits.length >= 10 && cleanDigits.slice(-10) === uAltPhoneDigits.slice(-10)) return true;
      }
      if (/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
        if (uPhone && (uPhone === cleanPhone || (cleanPhone.length >= 10 && uPhone.endsWith(cleanPhone)))) return true;
        if (uAltPhone && (uAltPhone === cleanPhone || (cleanPhone.length >= 10 && uAltPhone.endsWith(cleanPhone)))) return true;
      }

      return false;
    });
  },

  isUsernameAvailable(username: string, excludeUserId?: string): boolean {
    const handle = username.trim().toLowerCase().replace(/^@/, '');
    if (!handle || handle.length < 3 || handle.length > 20) return false;
    // Must start with a letter and contain only alphanumeric characters or underscores
    if (!/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(handle)) return false;

    const users = this.getRegisteredUsers();
    const match = users.find(u => u.username?.toLowerCase() === handle);
    if (!match) return true;
    return excludeUserId ? match.id === excludeUserId : false;
  },


  getActiveSession(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setActiveSession(user: UserProfile | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } else {
      const safeUser = { ...user };
      delete safeUser.password; // STRICT SECURITY: Never store password in localStorage
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(safeUser));
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(safeUser));
      this.saveRegisteredUser(safeUser);
    }
  },

  getRememberedCustomer(): RememberedCustomer | null {
    const raw = localStorage.getItem(STORAGE_KEYS.REMEMBERED_CUSTOMER);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.identifier?.toLowerCase().includes('chithanya') || parsed.fullName?.toLowerCase().includes('chithanya'))) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  saveRememberedCustomer(customer: RememberedCustomer): void {
    localStorage.setItem(STORAGE_KEYS.REMEMBERED_CUSTOMER, JSON.stringify(customer));
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
  },

  clearRememberedCustomer(): void {
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_CUSTOMER);
    localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'false');
  },

  isRememberMeEnabled(): boolean {
    const flag = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME);
    return flag === null ? true : flag === 'true';
  },


  getUserProfile(): UserProfile {
    const session = this.getActiveSession();
    if (session) return session;
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialUserProfile));
      return initialUserProfile;
    }
    return JSON.parse(raw);
  },

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    this.setActiveSession(updated);
    return updated;
  },

  getExpenses(): Expense[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initialExpenses));
      return initialExpenses;
    }
    return JSON.parse(raw);
  },

  addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
    const expenses = this.getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    expenses.unshift(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return newExpense;
  },

  deleteExpense(id: string): void {
    const expenses = this.getExpenses().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getBudgets(): Budget[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initialBudgets));
      return initialBudgets;
    }
    return JSON.parse(raw);
  },

  getSubscriptions(): Subscription[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(initialSubscriptions));
      return initialSubscriptions;
    }
    return JSON.parse(raw);
  },

  addSubscription(sub: Omit<Subscription, 'id'>): Subscription {
    const subs = this.getSubscriptions();
    const newSub: Subscription = {
      ...sub,
      id: `sub_${Date.now()}`
    };
    subs.push(newSub);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return newSub;
  },

  getBills(): Bill[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(initialBills));
      return initialBills;
    }
    return JSON.parse(raw);
  },

  toggleBillPaid(id: string): Bill[] {
    const bills = this.getBills().map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b);
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    return bills;
  },

  getSavingsGoals(): SavingsGoal[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(initialSavingsGoals));
      return initialSavingsGoals;
    }
    return JSON.parse(raw);
  },

  addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'createdAt'>): SavingsGoal {
    const goals = this.getSavingsGoals();
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    goals.push(newGoal);
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
    return newGoal;
  },

  updateSavingsGoalContribution(id: string, additionalAmount: number): SavingsGoal[] {
    const goals = this.getSavingsGoals().map(g => {
      if (g.id === id) {
        return { ...g, currentAmount: g.currentAmount + additionalAmount };
      }
      return g;
    });
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
    return goals;
  },

  getSharedGroups(): SharedGroup[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SHARED_GROUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SHARED_GROUPS, JSON.stringify([initialSharedGroup]));
      return [initialSharedGroup];
    }
    return JSON.parse(raw);
  },

  addGroupExpense(groupId: string, payerId: string, payerName: string, description: string, amount: number, splitType: 'equal' | 'exact' | 'percentage'): void {
    const groups = this.getSharedGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const perMember = Math.round(amount / group.members.length);
    const splits = group.members.map(m => ({
      memberId: m.id,
      memberName: m.name,
      amountOwed: perMember
    }));

    group.expenses.unshift({
      id: `grp_exp_${Date.now()}`,
      groupId,
      payerId,
      payerName,
      description,
      amount,
      splitType,
      splits,
      date: new Date().toISOString().split('T')[0]
    });

    localStorage.setItem(STORAGE_KEYS.SHARED_GROUPS, JSON.stringify(groups));
  },

  getChallenges(): Challenge[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(initialChallenges));
      return initialChallenges;
    }
    return JSON.parse(raw);
  },

  resetAllData(): void {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(initialUserProfile));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(initialExpenses));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initialBudgets));
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(initialSubscriptions));
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(initialBills));
    localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(initialSavingsGoals));
    localStorage.setItem(STORAGE_KEYS.SHARED_GROUPS, JSON.stringify([initialSharedGroup]));
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(initialChallenges));
  }
};
