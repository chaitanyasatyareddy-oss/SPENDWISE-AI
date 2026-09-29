import { Expense, UserProfile, Subscription, Bill, SavingsGoal, Budget, SharedGroup, Challenge } from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_spendwise_demo_01',
  email: 'chithanya@spendwise.ai',
  username: 'chithanya',
  phoneNumber: '+91 9876543210',
  password: 'Password@123',
  needsUsername: false,
  fullName: 'Chithanya',
  primaryCurrency: 'INR',
  currencySymbol: '₹',
  locale: 'en',
  themePreference: 'light',
  targetMonthlyBudget: 35000,

  monthlyIncome: 65000,
};

// MANDATORY SEED DATASET REQUIRED BY SPECIFICATION (Page 11)
export const initialExpenses: Expense[] = [
  {
    id: 'exp_01',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Swiggy',
    amount: 450,
    category: 'Food',
    needWantTag: 'Want',
    date: '2026-09-27',
    paymentMethod: 'UPI',
    source: 'upi',
    notes: 'Dinner delivery (Biryani & Coke)',
    referenceNumber: 'UPI/260927/10293847',
    items: [
      { id: 'itm_01', expenseId: 'exp_01', itemName: 'Chicken Dum Biryani', unitPrice: 380, quantity: 1, totalPrice: 380 },
      { id: 'itm_02', expenseId: 'exp_01', itemName: 'Coke Zero 300ml', unitPrice: 70, quantity: 1, totalPrice: 70 }
    ],
    createdAt: '2026-09-27T20:15:00Z',
  },
  {
    id: 'exp_02',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Uber',
    amount: 220,
    category: 'Transport',
    needWantTag: 'Need',
    date: '2026-09-26',
    paymentMethod: 'UPI',
    source: 'upi',
    notes: 'Ride to tech hub office',
    referenceNumber: 'UPI/260926/84729103',
    createdAt: '2026-09-26T09:30:00Z',
  },
  {
    id: 'exp_03',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Amazon',
    amount: 1499,
    category: 'Shopping',
    needWantTag: 'Want',
    date: '2026-09-25',
    paymentMethod: 'Credit Card',
    source: 'manual',
    notes: 'Ergonomic mouse & desk mat',
    referenceNumber: 'AMZ-993-28190',
    createdAt: '2026-09-25T14:22:00Z',
  },
  {
    id: 'exp_04',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Netflix',
    amount: 649,
    category: 'Subscription',
    needWantTag: 'Want',
    date: '2026-09-24',
    paymentMethod: 'Credit Card',
    source: 'statement',
    notes: 'Premium 4K Monthly auto-debit',
    referenceNumber: 'SUB/NETFLIX/0926',
    createdAt: '2026-09-24T00:05:00Z',
  },
  {
    id: 'exp_05',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Electricity Bill',
    amount: 1800,
    category: 'Bills',
    needWantTag: 'Need',
    date: '2026-09-22',
    paymentMethod: 'NetBanking',
    source: 'manual',
    notes: 'TSSPDCL Monthly Power Utility',
    referenceNumber: 'BILL/TSSPDCL/202609',
    createdAt: '2026-09-22T11:00:00Z',
  },
  {
    id: 'exp_06',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Movie Theater',
    amount: 500,
    category: 'Entertainment',
    needWantTag: 'Want',
    date: '2026-09-20',
    paymentMethod: 'Debit Card',
    source: 'manual',
    notes: 'IMAX weekend evening tickets',
    referenceNumber: 'PVR-TX-993821',
    createdAt: '2026-09-20T18:45:00Z',
  },
  {
    id: 'exp_07',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Spotify',
    amount: 119,
    category: 'Subscription',
    needWantTag: 'Want',
    date: '2026-09-19',
    paymentMethod: 'UPI',
    source: 'upi',
    notes: 'Individual Premium Plan auto-pay',
    referenceNumber: 'UPI/260919/48201948',
    createdAt: '2026-09-19T02:10:00Z',
  },
  {
    id: 'exp_08',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Local Restaurant',
    amount: 850,
    category: 'Food',
    needWantTag: 'Want',
    date: '2026-09-18',
    paymentMethod: 'Cash',
    source: 'manual',
    notes: 'Family weekend dinner buffet',
    referenceNumber: 'CASH-REC-1029',
    createdAt: '2026-09-18T21:00:00Z',
  },
  {
    id: 'exp_09',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Amazon Electronics',
    amount: 2500,
    category: 'Shopping',
    needWantTag: 'Want',
    date: '2026-09-15',
    paymentMethod: 'Credit Card',
    source: 'statement',
    notes: 'Noise-canceling earphones upgrade',
    isAnomaly: true,
    anomalyZScore: 2.85, // Triggers Z >= 2.5 alert!
    referenceNumber: 'AMZ-ELEC-44910',
    createdAt: '2026-09-15T16:30:00Z',
  },
  {
    id: 'exp_10',
    userId: 'usr_spendwise_demo_01',
    merchant: 'Mobile Recharge',
    amount: 399,
    category: 'Bills',
    needWantTag: 'Need',
    date: '2026-09-12',
    paymentMethod: 'UPI',
    source: 'upi',
    notes: 'Jio 84-day prepaid voice & 5G data plan',
    referenceNumber: 'UPI/260912/91823746',
    createdAt: '2026-09-12T13:10:00Z',
  },
];

export const initialBudgets: Budget[] = [
  { id: 'b_01', userId: 'usr_spendwise_demo_01', category: 'Food', allocatedAmount: 5000, period: 'monthly' },
  { id: 'b_02', userId: 'usr_spendwise_demo_01', category: 'Shopping', allocatedAmount: 6000, period: 'monthly' },
  { id: 'b_03', userId: 'usr_spendwise_demo_01', category: 'Bills', allocatedAmount: 4000, period: 'monthly' },
  { id: 'b_04', userId: 'usr_spendwise_demo_01', category: 'Transport', allocatedAmount: 3000, period: 'monthly' },
  { id: 'b_05', userId: 'usr_spendwise_demo_01', category: 'Subscription', allocatedAmount: 1500, period: 'monthly' },
  { id: 'b_06', userId: 'usr_spendwise_demo_01', category: 'Entertainment', allocatedAmount: 2000, period: 'monthly' },
];

export const initialSubscriptions: Subscription[] = [
  {
    id: 'sub_01',
    userId: 'usr_spendwise_demo_01',
    serviceName: 'Netflix Premium 4K',
    amount: 649,
    frequency: 'monthly',
    nextDueDate: '2026-10-24',
    isActive: true,
    category: 'Entertainment'
  },
  {
    id: 'sub_02',
    userId: 'usr_spendwise_demo_01',
    serviceName: 'Spotify Individual',
    amount: 119,
    frequency: 'monthly',
    nextDueDate: '2026-10-19',
    isActive: true,
    category: 'Music & Audio'
  },
  {
    id: 'sub_03',
    userId: 'usr_spendwise_demo_01',
    serviceName: 'Google One Cloud 2TB',
    amount: 650,
    frequency: 'monthly',
    nextDueDate: '2026-10-05',
    isActive: true,
    category: 'Cloud Storage'
  }
];

export const initialBills: Bill[] = [
  {
    id: 'bill_01',
    userId: 'usr_spendwise_demo_01',
    billName: 'Apartment Maintenance & Water',
    estimatedAmount: 2200,
    dueDate: '2026-10-05',
    isPaid: false,
    category: 'Housing'
  },
  {
    id: 'bill_02',
    userId: 'usr_spendwise_demo_01',
    billName: 'Airtel Broadband Fiber 300Mbps',
    estimatedAmount: 999,
    dueDate: '2026-10-10',
    isPaid: false,
    category: 'Utilities'
  },
  {
    id: 'bill_03',
    userId: 'usr_spendwise_demo_01',
    billName: 'Electricity Bill (TSSPDCL)',
    estimatedAmount: 1800,
    dueDate: '2026-09-22',
    isPaid: true,
    category: 'Utilities'
  }
];

export const initialSavingsGoals: SavingsGoal[] = [
  {
    id: 'goal_01',
    userId: 'usr_spendwise_demo_01',
    goalName: 'Emergency Reserve Fund',
    targetAmount: 50000,
    currentAmount: 32000,
    targetDate: '2026-12-31',
    isPaused: false,
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'goal_02',
    userId: 'usr_spendwise_demo_01',
    goalName: 'Save ₹5,000 in 3 months',
    targetAmount: 5000,
    currentAmount: 1850,
    targetDate: '2026-11-30',
    isPaused: false,
    createdAt: '2026-09-01T00:00:00Z'
  }
];

export const initialSharedGroup: SharedGroup = {
  id: 'grp_01',
  groupName: 'Hyderabad Flatmates & Trips',
  members: [
    { id: 'usr_spendwise_demo_01', name: 'Chithanya (You)', email: 'chithanya@spendwise.ai' },
    { id: 'mbr_02', name: 'Kiran Reddy', email: 'kiran@example.com' },
    { id: 'mbr_03', name: 'Ananya Sharma', email: 'ananya@example.com' },
    { id: 'mbr_04', name: 'Sai Teja', email: 'saiteja@example.com' }
  ],
  expenses: [
    {
      id: 'grp_exp_01',
      groupId: 'grp_01',
      payerId: 'usr_spendwise_demo_01',
      payerName: 'Chithanya (You)',
      description: 'Groceries & Provisions from Supermarket',
      amount: 2400,
      splitType: 'equal',
      splits: [
        { memberId: 'usr_spendwise_demo_01', memberName: 'Chithanya', amountOwed: 600 },
        { memberId: 'mbr_02', memberName: 'Kiran Reddy', amountOwed: 600 },
        { memberId: 'mbr_03', memberName: 'Ananya Sharma', amountOwed: 600 },
        { memberId: 'mbr_04', memberName: 'Sai Teja', amountOwed: 600 }
      ],
      date: '2026-09-25'
    },
    {
      id: 'grp_exp_02',
      groupId: 'grp_01',
      payerId: 'mbr_02',
      payerName: 'Kiran Reddy',
      description: 'Weekend Highway Dhaba Dinner',
      amount: 1600,
      splitType: 'equal',
      splits: [
        { memberId: 'usr_spendwise_demo_01', memberName: 'Chithanya', amountOwed: 400 },
        { memberId: 'mbr_02', memberName: 'Kiran Reddy', amountOwed: 400 },
        { memberId: 'mbr_03', memberName: 'Ananya Sharma', amountOwed: 400 },
        { memberId: 'mbr_04', memberName: 'Sai Teja', amountOwed: 400 }
      ],
      date: '2026-09-23'
    }
  ]
};

export const initialChallenges: Challenge[] = [
  {
    id: 'ch_01',
    userId: 'usr_spendwise_demo_01',
    title: 'Zero Swiggy / Dining Out Weekend Challenge',
    targetSavings: 1200,
    currentSaved: 900,
    deadline: '2026-10-04',
    status: 'in_progress',
    rewardPoints: 80
  },
  {
    id: 'ch_02',
    userId: 'usr_spendwise_demo_01',
    title: 'No Impulse Shopping Sprint (7 Days)',
    targetSavings: 2000,
    currentSaved: 2000,
    deadline: '2026-09-30',
    status: 'completed',
    rewardPoints: 120
  }
];
