import { LanguageCode } from '../../types';

export interface LanguageMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  isRtl: boolean;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', isRtl: false, flag: '🇺🇸' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isRtl: false, flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isRtl: false, flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isRtl: false, flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', isRtl: false, flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', isRtl: false, flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isRtl: false, flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isRtl: false, flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isRtl: false, flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRtl: true, flag: '🇵🇰' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', isRtl: false, flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', isRtl: false, flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isRtl: false, flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', isRtl: false, flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isRtl: false, flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRtl: true, flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isRtl: false, flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isRtl: false, flag: '🇯🇵' },
];

export interface TranslationSchema {
  appName: string;
  tagline: string;
  auth: {
    welcomeBack: string;
    signInSubtitle: string;
    createAccount: string;
    signUpSubtitle: string;
    identifierLabel: string;
    identifierPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    usernameLabel: string;
    usernamePlaceholder: string;
    forgotPassword: string;
    signInButton: string;
    signUpButton: string;
    noAccount: string;
    haveAccount: string;
    quickDemoLogin: string;
    usernameAvailable: string;
    usernameTaken: string;
    checkingUsername: string;
    passwordStrength: {
      weak: string;
      fair: string;
      strong: string;
    };
    resetPassword: string;
    resetSubtitle: string;
    sendOtp: string;
    onboardingTitle: string;
    onboardingSubtitle: string;
    claimHandle: string;
    logout: string;
  };
  nav: {
    dashboard: string;
    analytics: string;
    capture: string;
    coach: string;
    subscriptions: string;
    shared: string;
    goals: string;
    import: string;
    settings: string;
  };
  metrics: {
    totalIncome: string;
    totalExpenses: string;
    currentBalance: string;
    budgetUtilization: string;
    dailyLimit: string;
    daysRemaining: string;
    upcomingObligations: string;
    healthIndex: string;
    healthGrade: string;
    healthSummary: string;
    disclaimer: string;
  };
  actions: {
    addExpense: string;
    scanReceipt: string;
    voiceInput: string;
    save: string;
    cancel: string;
    filter: string;
    export: string;
    togglePhoneView: string;
    toggleDesktopView: string;
    settleUp: string;
  };
  theme: {
    light: string;
    dark: string;
    system: string;
  };
}

export const englishTranslations: TranslationSchema = {
  appName: "SpendWise AI",
  tagline: "Understand your spending. Plan your future.",
  auth: {
    welcomeBack: "Welcome Back",
    signInSubtitle: "Sign in to manage your finances & AI insights",
    createAccount: "Create Account",
    signUpSubtitle: "Join SpendWise AI for smart financial planning",
    identifierLabel: "Mobile Number or Username",
    identifierPlaceholder: "+91 9876543210 or @username",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "e.g. Chithanya Reddy",
    phoneLabel: "Mobile Number",
    phonePlaceholder: "+91 9876543210",
    usernameLabel: "Unique Username (@handle)",
    usernamePlaceholder: "e.g. chithanya",
    forgotPassword: "Forgot Password?",
    signInButton: "Sign In",
    signUpButton: "Create Account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    quickDemoLogin: "Quick Demo Login (@chithanya)",
    usernameAvailable: "Username is available",
    usernameTaken: "Username is already taken",
    checkingUsername: "Checking availability...",
    passwordStrength: {
      weak: "Weak",
      fair: "Fair",
      strong: "Strong"
    },
    resetPassword: "Reset Password",
    resetSubtitle: "Enter your registered username or phone to receive a recovery code",
    sendOtp: "Send Recovery Link",
    onboardingTitle: "Choose your unique handle",
    onboardingSubtitle: "Complete your profile with a personalized @username to collaborate on group ledgers",
    claimHandle: "Claim Handle & Continue",
    logout: "Sign Out"
  },
  nav: {
    dashboard: "Dashboard",
    analytics: "Analytics & Forecast",
    capture: "Multimodal Capture",
    coach: "AI Financial Coach",
    subscriptions: "Subscriptions & Bills",
    shared: "Group Ledger",
    goals: "Savings Goals",
    import: "CSV Import",
    settings: "Settings"
  },
  metrics: {
    totalIncome: "Monthly Income",
    totalExpenses: "Total Expenses",
    currentBalance: "Current Balance",
    budgetUtilization: "Budget Utilization",
    dailyLimit: "Daily Spending Limit",
    daysRemaining: "days remaining",
    upcomingObligations: "Upcoming bills & subs",
    healthIndex: "Financial Health Index",
    healthGrade: "Score: Good (78/100)",
    healthSummary: "Your spending is balanced with 34% Needs and 66% Wants. Based on current trends, your projected end-of-month savings remain positive.",
    disclaimer: "Informational analysis only; not professional financial advice."
  },
  actions: {
    addExpense: "Add Expense",
    scanReceipt: "Scan Receipt / UPI",
    voiceInput: "Voice Entry",
    save: "Save Transaction",
    cancel: "Cancel",
    filter: "Filter",
    export: "Export CSV",
    togglePhoneView: "Mobile View",
    toggleDesktopView: "Wide View",
    settleUp: "Settle Up"
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System"
  }
};
