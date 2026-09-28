export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstINR: number; // 1 INR in target currency
  name: string;
}

export type LanguageCode =
  | 'en' // English
  | 'te' // Telugu
  | 'hi' // Hindi
  | 'ta' // Tamil
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'gu' // Gujarati
  | 'ur' // Urdu (RTL)
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'ar' // Arabic (RTL)
  | 'zh' // Chinese
  | 'ja'; // Japanese

export type ThemeMode = 'light' | 'dark' | 'system';

export type NeedWantTag = 'Need' | 'Want' | 'Unclear';

export type ExpenseSource = 'manual' | 'receipt' | 'voice' | 'upi' | 'statement';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  phoneNumber?: string;
  password?: string;
  needsUsername?: boolean;
  fullName: string;
  avatarUrl?: string;
  primaryCurrency: CurrencyCode;
  currencySymbol: string;
  locale: LanguageCode;
  themePreference?: ThemeMode;
  targetMonthlyBudget: number;
  monthlyIncome: number;
}

export interface ExpenseItem {
  id: string;
  expenseId: string;
  itemName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  merchant: string;
  category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Subscription' | 'Entertainment' | 'Healthcare' | 'Education' | 'Travel' | 'Groceries' | 'Other';
  date: string; // YYYY-MM-DD
  paymentMethod: 'UPI' | 'Credit Card' | 'Debit Card' | 'Cash' | 'NetBanking';
  notes?: string;
  source: ExpenseSource;
  needWantTag: NeedWantTag;
  locationTag?: string;
  isAnomaly?: boolean;
  anomalyZScore?: number;
  referenceNumber?: string;
  items?: ExpenseItem[];
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  allocatedAmount: number;
  period: 'monthly';
}

export interface SavingsGoal {
  id: string;
  userId: string;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  isPaused: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  serviceName: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDueDate: string;
  isActive: boolean;
  category: string;
}

export interface Bill {
  id: string;
  userId: string;
  billName: string;
  estimatedAmount: number;
  dueDate: string;
  isPaid: boolean;
  category: string;
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface GroupExpense {
  id: string;
  groupId: string;
  payerId: string;
  payerName: string;
  description: string;
  amount: number;
  splitType: 'equal' | 'exact' | 'percentage';
  splits: {
    memberId: string;
    memberName: string;
    amountOwed: number;
  }[];
  date: string;
}

export interface SharedGroup {
  id: string;
  groupName: string;
  members: GroupMember[];
  expenses: GroupExpense[];
}

export interface Challenge {
  id: string;
  userId: string;
  title: string;
  targetSavings: number;
  currentSaved: number;
  deadline: string;
  status: 'in_progress' | 'completed' | 'failed';
  rewardPoints: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  isCodeSwitched?: boolean;
  detectedLanguage?: string;
}
