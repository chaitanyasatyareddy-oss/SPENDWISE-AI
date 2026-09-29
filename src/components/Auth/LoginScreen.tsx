import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Smartphone,
  AtSign,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  ShieldCheck,
  BookmarkCheck,
  RefreshCw,
  Phone,
  MessageSquare,
  ArrowLeft,
  X,
  UserCheck,
} from 'lucide-react';
import { useAuth, GoogleAuthProfile } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { normalizeIndianPhone } from '../../utils/phoneUtils';

export const LoginScreen: React.FC = () => {
  const {
    login,
    signup,
    loginWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    checkUsernameAvailability,
    resetPassword,
    rememberedCustomer,
    clearRememberedCustomer,
  } = useAuth();
  const { t } = useLanguage();

  // Authentication mode & method
  const [authMethod, setAuthMethod] = useState<'password' | 'phone_otp'>('phone_otp'); // Default to phone OTP since user is using it!
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [otpAuthMode, setOtpAuthMode] = useState<'signin' | 'signup'>('signin');

  // Password-based credentials
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Indian Phone + OTP Verification state
  const [otpPhone, setOtpPhone] = useState('90635 34530'); // Pre-filled with user's registered phone
  const [otpFullName, setOtpFullName] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [activeFormattedPhone, setActiveFormattedPhone] = useState('');
  const [registeredAccountInfo, setRegisteredAccountInfo] = useState<string | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Google Sign-In state & modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Real-time username availability state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Error & loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  // Pre-fill remembered customer details on initial load
  useEffect(() => {
    if (rememberedCustomer && !identifier) {
      setIdentifier(rememberedCustomer.identifier);
      setRememberMe(rememberedCustomer.rememberMe !== false);
      if (rememberedCustomer.phoneNumber) {
        setOtpPhone(rememberedCustomer.phoneNumber.replace('+91', '').trim());
      }
    }
  }, [rememberedCustomer]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (otpStep === 'verify' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      setIsResendDisabled(true);
    } else if (otpTimer === 0) {
      setIsResendDisabled(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpStep, otpTimer]);

  // Real-time debounced username availability & format check
  useEffect(() => {
    if (mode !== 'signup' || !username.trim()) {
      setUsernameAvailable(null);
      setUsernameError(null);
      setIsCheckingUsername(false);
      return;
    }

    const clean = username.trim().toLowerCase().replace(/^@/, '');

    // Must start with an alphabet letter
    if (!/^[a-z]/.test(clean)) {
      setUsernameError('Must start with a letter (a-z)');
      setUsernameAvailable(false);
      setIsCheckingUsername(false);
      return;
    }

    if (clean.length < 3) {
      setUsernameError('Must be at least 3 characters');
      setUsernameAvailable(false);
      setIsCheckingUsername(false);
      return;
    }

    if (!/^[a-z][a-z0-9_]{2,19}$/.test(clean)) {
      setUsernameError('Only letters, numbers, and _ allowed (3-20 chars)');
      setUsernameAvailable(false);
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError(null);

    const timer = setTimeout(() => {
      const available = checkUsernameAvailability(clean);
      setUsernameAvailable(available);
      if (!available) {
        setUsernameError('Username is already taken');
      }
      setIsCheckingUsername(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [username, mode, checkUsernameAvailability]);

  // Password strength calculation
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-300 dark:bg-slate-700' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: t.auth?.passwordStrength?.weak || 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: t.auth?.passwordStrength?.fair || 'Fair', color: 'bg-amber-500' };
    return { score: 3, label: t.auth?.passwordStrength?.strong || 'Strong', color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(password);

  // Form submission with strict validation (Password-based)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    if (mode === 'signin') {
      if (!identifier.trim()) {
        setErrorMessage('Please enter your username, email, or mobile number.');
        setIsLoading(false);
        return;
      }
      if (!password) {
        setErrorMessage('Please enter your password.');
        setIsLoading(false);
        return;
      }

      const result = await login(identifier, password, rememberMe);
      if (!result.success) {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your details.');
      }
    } else {
      // 1. Full name validation
      const cleanName = fullName.trim();
      if (!cleanName || cleanName.length < 2) {
        setErrorMessage('Full Name must be at least 2 characters long.');
        setIsLoading(false);
        return;
      }
      if (!/[a-zA-Z]/.test(cleanName) || /^\d+$/.test(cleanName)) {
        setErrorMessage('Full Name must contain letters (e.g. "Chithanya Reddy"). Numbers-only are not allowed.');
        setIsLoading(false);
        return;
      }

      // 2. Username validation
      const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
      if (!/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(cleanUsername)) {
        setErrorMessage('Username must start with a letter and contain 3 to 20 letters, numbers, or underscores.');
        setIsLoading(false);
        return;
      }
      if (usernameAvailable === false) {
        setErrorMessage(usernameError || 'Please choose an available username.');
        setIsLoading(false);
        return;
      }

      // 3. Mobile Number validation
      const cleanDigits = phoneNumber.replace(/[\s-]/g, '');
      if (!/^\+?[0-9]{10,15}$/.test(cleanDigits)) {
        setErrorMessage('Please enter a valid 10 to 15 digit mobile number (e.g. "+91 9876543210").');
        setIsLoading(false);
        return;
      }

      // 4. Password validation
      if (!password || password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }
      if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        setErrorMessage('Password must contain both letters and numbers for account security.');
        setIsLoading(false);
        return;
      }

      const result = await signup(fullName, username, phoneNumber, password, rememberMe);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
      }
    }
    setIsLoading(false);
  };

  // Indian Phone + OTP: Send OTP Handler (STRICT REGISTERED NUMBER CHECK)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const validation = normalizeIndianPhone(otpPhone);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid 10-digit Indian mobile number.');
      setIsLoading(false);
      return;
    }

    if (otpAuthMode === 'signup' && (!otpFullName.trim() || otpFullName.trim().length < 2)) {
      setErrorMessage('Please enter your Full Name to register.');
      setIsLoading(false);
      return;
    }

    const result = await sendPhoneOtp(validation.formatted, otpAuthMode);
    if (!result.success) {
      setErrorMessage(result.error || 'Failed to send OTP.');
      setIsLoading(false);
      return;
    }

    if (result.registeredUser) {
      setRegisteredAccountInfo(
        `${result.registeredUser.fullName} (@${result.registeredUser.username || 'user'})`
      );
    } else {
      setRegisteredAccountInfo(null);
    }

    setActiveFormattedPhone(result.formattedPhone || validation.formatted);
    setSimulatedOtp(result.otp || null);
    setOtpStep('verify');
    setOtpTimer(30);
    setIsResendDisabled(true);
    setOtpDigits(['', '', '', '', '', '']);
    setIsLoading(false);

    // Focus first OTP input box on step change
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // Indian Phone + OTP: Verify OTP Handler
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    const code = otpDigits.join('');

    if (code.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP verification code.');
      return;
    }

    setIsLoading(true);
    const result = await verifyPhoneOtp(activeFormattedPhone, code, otpFullName, rememberMe, otpAuthMode);
    if (!result.success) {
      setErrorMessage(result.error || 'Verification failed. Please check the OTP code.');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  // OTP Input Box change handler (auto-forwarding)
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedDigits = value.replace(/\D/g, '').slice(0, 6).split('');
      const updated = [...otpDigits];
      pastedDigits.forEach((digit, i) => {
        if (i < 6) updated[i] = digit;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(pastedDigits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // OTP input backspace handler
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // 1-Click Auto-Fill of OTP
  const handleAutoFillOtp = (otp: string) => {
    const chars = otp.split('').slice(0, 6);
    setOtpDigits(chars);
    otpInputRefs.current[5]?.focus();
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResendDisabled) return;
    setErrorMessage(null);
    setIsLoading(true);

    const result = await sendPhoneOtp(activeFormattedPhone, otpAuthMode);
    setIsLoading(false);

    if (result.success) {
      setSimulatedOtp(result.otp || null);
      setOtpTimer(30);
      setIsResendDisabled(true);
      setSuccessMessage('A fresh 6-digit OTP code has been dispatched.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      setErrorMessage(result.error || 'Failed to resend OTP.');
    }
  };

  // Google Sign-In Executor
  const handleGoogleSignIn = async (profile?: GoogleAuthProfile) => {
    setShowGoogleModal(false);
    setErrorMessage(null);
    setIsLoading(true);
    setIsGoogleLoading(true);

    const result = await loginWithGoogle(profile, rememberMe);
    setIsLoading(false);
    setIsGoogleLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Failed to sign in with Google.');
    }
  };

  const handleQuickDemoLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    await login('chithanya', 'Password@123', rememberMe);
    setIsLoading(false);
  };

  const handleSwitchAccount = () => {
    clearRememberedCustomer();
    setIdentifier('');
    setPassword('');
    setOtpPhone('');
    setErrorMessage(null);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    const res = await resetPassword(forgotIdentifier);
    setForgotStatus(res.message);
  };

  // Live validation helpers
  const isNameInvalid =
    fullName.trim().length > 0 &&
    (!/[a-zA-Z]/.test(fullName) || /^\d+$/.test(fullName) || fullName.trim().length < 2);

  const cleanPhoneDigits = phoneNumber.replace(/[\s-]/g, '');
  const isPhoneInvalid =
    phoneNumber.trim().length > 0 &&
    (!/^\+?[0-9]{10,15}$/.test(cleanPhoneDigits));

  const isOtpPhoneInvalid =
    otpPhone.trim().length > 0 &&
    !normalizeIndianPhone(otpPhone).isValid;

  return (
    <div className="w-full max-w-lg mx-auto my-auto p-4 sm:p-6 space-y-6 animate-in fade-in duration-300">
      {/* Brand Hero Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex relative items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/10">
            SW
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.appName}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1 font-medium">
            {t.tagline}
          </p>
        </div>

        {/* Live Cloud Connection Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Supabase PostgreSQL & Gemini 1.5 Active</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/60 dark:shadow-none space-y-5 transition-all">
        {/* Remembered Customer Welcome Card */}
        {rememberedCustomer && (
          <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-50/50 dark:from-indigo-950/40 dark:via-violet-950/30 dark:to-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-500/20 flex-shrink-0">
                {rememberedCustomer.fullName
                  ? rememberedCustomer.fullName.charAt(0).toUpperCase()
                  : 'C'}
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {t.auth?.welcomeBackCustomer || 'Welcome back'}, {rememberedCustomer.fullName || rememberedCustomer.identifier}!
                  </span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <BookmarkCheck className="w-2.5 h-2.5" />
                    Remembered
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {rememberedCustomer.identifier}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleSwitchAccount}
                className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:underline transition-colors font-medium"
                title={t.auth?.clearRemembered || 'Clear saved details on this device'}
              >
                {t.auth?.switchAccount || 'Switch'}
              </button>
            </div>
          </div>
        )}

        {/* 1. Google One-Tap / OAuth Sign In Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {/* Crisp Official Google Multi-color G SVG */}
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider font-semibold">
            Or choose method
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Authentication Method Selector (Password vs India Phone & OTP) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('phone_otp');
              setErrorMessage(null);
              setOtpStep('input');
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authMethod === 'phone_otp'
                ? 'bg-white dark:bg-emerald-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="text-sm">🇮🇳</span>
            <span>Phone OTP (+91)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authMethod === 'password'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Password / Handle</span>
          </button>
        </div>

        {/* Error Alert with Smart Switch action */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2 text-xs text-rose-600 dark:text-rose-400 animate-in fade-in text-left">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            {/* If unregistered in OTP signin, offer 1-click register */}
            {authMethod === 'phone_otp' && otpAuthMode === 'signin' && errorMessage.includes('not registered') && (
              <button
                type="button"
                onClick={() => {
                  setOtpAuthMode('signup');
                  setErrorMessage(null);
                }}
                className="ml-6 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] shadow-xs flex items-center gap-1 transition-colors"
              >
                <span>Register this mobile number now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="font-medium text-left">{successMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: INDIAN PHONE NUMBER & OTP VERIFICATION            */}
        {/* ========================================================= */}
        {authMethod === 'phone_otp' && (
          <div className="space-y-4">
            {otpStep === 'input' ? (
              <div className="space-y-3.5">
                {/* Sign In vs Register Mobile Toggle */}
                <div className="grid grid-cols-2 p-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpAuthMode('signin');
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      otpAuthMode === 'signin'
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Registered Sign In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpAuthMode('signup');
                      setErrorMessage(null);
                    }}
                    className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      otpAuthMode === 'signup'
                        ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Register New Mobile</span>
                  </button>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-3.5 text-left">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-500" />
                      <span>
                        {otpAuthMode === 'signin'
                          ? 'Sign In to Registered Mobile Number'
                          : 'Register Your Mobile Number'}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {otpAuthMode === 'signin'
                        ? 'OTP is sent exclusively to your registered mobile number (+91).'
                        : 'Enter your name and mobile number to verify and create your account.'}
                    </p>
                  </div>

                  {/* Full Name (Only when Registering New Mobile) */}
                  {otpAuthMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chithanya Reddy"
                          value={otpFullName}
                          onChange={(e) => {
                            setOtpFullName(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>
                  )}

                  {/* Registered Indian Mobile Number Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>
                        {otpAuthMode === 'signin'
                          ? 'Registered Indian Mobile Number'
                          : 'Indian Mobile Number'}
                      </span>
                      {otpAuthMode === 'signin' && (
                        <span className="text-[10px] text-emerald-500 font-semibold">
                          Registered accounts only
                        </span>
                      )}
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 select-none">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        autoFocus
                        placeholder="90635 34530"
                        value={otpPhone}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(/[^0-9\s]/g, '');
                          setOtpPhone(filtered);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-20 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold tracking-wider text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                          isOtpPhoneInvalid
                            ? 'border-rose-500 focus:border-rose-500 ring-2 ring-rose-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                        }`}
                      />
                    </div>
                    {isOtpPhoneInvalid ? (
                      <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>Indian numbers must be 10 digits starting with 6, 7, 8, or 9.</span>
                      </p>
                    ) : (
                      <p className="text-[10px] text-slate-400">
                        Enter 10-digit number. Example: <strong className="text-emerald-500">90635 34530</strong>
                      </p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-colors">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-emerald-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>Remember my mobile details on this device</span>
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Send OTP button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Checking registered number...</span>
                      </span>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>
                          {otpAuthMode === 'signin'
                            ? 'Send OTP to Registered Mobile'
                            : 'Verify & Register Mobile Number'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* OTP Verification Step */
              <div className="space-y-4 text-left animate-in fade-in slide-in-from-right-2">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('input');
                      setErrorMessage(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Number</span>
                  </button>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    OTP Dispatched
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {otpAuthMode === 'signin'
                      ? 'Verify Registered Mobile Number'
                      : 'Complete Mobile Registration'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the 6-digit verification code sent to registered number{' '}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {activeFormattedPhone}
                    </strong>
                  </p>
                  {registeredAccountInfo && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <UserCheck className="w-3 h-3 text-emerald-500" />
                      <span>Account: {registeredAccountInfo}</span>
                    </div>
                  )}
                </div>

                {/* Simulated SMS Arrival Toast Banner */}
                {simulatedOtp && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-700/60 shadow-sm space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">📱</span>
                        <div>
                          <p className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200">
                            SpendWise Security SMS to Registered Mobile
                          </p>
                          <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                            Verification OTP for <strong>{activeFormattedPhone}</strong> is{' '}
                            <strong className="font-mono text-xs">{simulatedOtp}</strong>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAutoFillOtp(simulatedOtp)}
                        className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-all active:scale-95 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Auto-Fill</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 6 Individual Digit Input Boxes */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    6-Digit Verification Code <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-full h-12 text-center text-lg font-bold font-mono rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Timer & Button */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Didn't receive the SMS?
                  </span>
                  <button
                    type="button"
                    disabled={isResendDisabled || isLoading}
                    onClick={handleResendOtp}
                    className={`font-semibold text-[11px] transition-colors ${
                      isResendDisabled
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-indigo-600 dark:text-indigo-400 hover:underline'
                    }`}
                  >
                    {isResendDisabled ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                {/* Verify OTP Button */}
                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying code...</span>
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify & Proceed to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PASSWORD AUTHENTICATION (Sign In / Sign Up)       */}
        {/* ========================================================= */}
        {authMethod === 'password' && (
          <div className="space-y-4">
            {/* Sign In / Sign Up Segmented Control */}
            <div className="grid grid-cols-2 p-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage(null);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.auth.signInButton}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className={`py-1.5 rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.auth.signUpButton}
              </button>
            </div>

            {/* Section Heading */}
            <div className="space-y-0.5 text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{mode === 'signin' ? t.auth.welcomeBack : t.auth.createAccount}</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {mode === 'signin'
                  ? 'Sign in with your @username, Indian phone number, or email.'
                  : t.auth.signUpSubtitle}
              </p>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  {/* Full Name */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.auth.fullNameLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chithanya Reddy"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                          isNameInvalid
                            ? 'border-rose-500 focus:border-rose-500 ring-2 ring-rose-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                      />
                    </div>
                    {isNameInvalid && (
                      <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>Full Name must contain letters (numbers only not allowed).</span>
                      </p>
                    )}
                  </div>

                  {/* Username with Real-Time Availability Check */}
                  <div className="space-y-1 text-left">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t.auth.usernameLabel} <span className="text-rose-500">*</span>
                      </label>
                      {isCheckingUsername && (
                        <span className="text-[10px] text-indigo-500 animate-pulse">
                          Checking availability...
                        </span>
                      )}
                      {!isCheckingUsername && usernameAvailable === true && (
                        <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Username is available
                        </span>
                      )}
                      {!isCheckingUsername && usernameAvailable === false && (
                        <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {usernameError || 'Invalid username'}
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center">
                      <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. chithanya_01"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                          usernameAvailable === false
                            ? 'border-rose-500 focus:border-rose-500 ring-2 ring-rose-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Must start with a letter (a-z), 3–20 alphanumeric or underscore characters.
                    </p>
                  </div>

                  {/* Phone Number with India (+91) Badge */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t.auth.phoneLabel} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 select-none pointer-events-none">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="90635 34530"
                        value={phoneNumber}
                        onChange={(e) => {
                          const filtered = e.target.value.replace(/[^0-9+\s-]/g, '');
                          setPhoneNumber(filtered);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-16 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                          isPhoneInvalid
                            ? 'border-rose-500 focus:border-rose-500 ring-2 ring-rose-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                        }`}
                      />
                    </div>
                    {isPhoneInvalid && (
                      <p className="text-[10px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        <span>Enter a valid 10-digit mobile number (letters not allowed).</span>
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Identifier field for Sign In (Email, Phone or @username) */}
              {mode === 'signin' && (
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{t.auth.identifierLabel}</span>
                    {rememberedCustomer && identifier === rememberedCustomer.identifier && (
                      <span className="text-[10px] text-indigo-500 font-medium">
                        Pre-filled from device
                      </span>
                    )}
                  </label>
                  <div className="relative flex items-center">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="@chithanya or 90635 34530 or +91 90635 34530"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password with Strength Indicator */}
              <div className="space-y-1 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.auth.passwordLabel} <span className="text-rose-500">*</span>
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotStatus(null);
                      }}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      {t.auth.forgotPassword}
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={mode === 'signup' ? 'Min. 6 chars (letters & numbers)' : 'Enter your password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter for signup */}
                {mode === 'signup' && password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Strength: {strength.label}</span>
                      {password.length < 6 && (
                        <span className="text-rose-500 font-medium">Must be at least 6 characters</span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-1 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-transparent'}`}></div>
                      <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-transparent'}`}></div>
                      <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-transparent'}`}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Remember Customer Details Checkbox */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-left transition-colors">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{t.auth.rememberMe || 'Remember my login details on this device'}</span>
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.auth.rememberMeSubtitle || 'Keeps your identifier securely saved for effortless 1-click access.'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit Sign In / Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>{mode === 'signin' ? t.auth.signInButton : t.auth.signUpButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Quick Demo Access Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider font-semibold">
            Or Quick Access
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* 1-Click Instant Demo Login */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full bg-indigo-50/80 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{t.auth?.quickDemoLogin || 'Quick Demo Login (@chithanya)'}</span>
          </button>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
            Registered demo mobile: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">90635 34530</code> (or handle <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">@chithanya</code>)
          </p>
        </div>
      </div>

      {/* Security Assurance Footer */}
      <div className="text-center space-y-1">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted with Supabase Row-Level Security & PostgreSQL RLS</span>
        </p>
      </div>

      {/* ========================================================= */}
      {/* GOOGLE ACCOUNT CHOOSER MODAL                              */}
      {/* ========================================================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-3xl p-6 space-y-5 shadow-2xl text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sign In with Google
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose a Google account to continue to <strong>SpendWise AI</strong>.
            </p>

            {/* Quick Account List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleGoogleSignIn({
                    name: 'Chithanya Reddy',
                    email: 'chithanya.reddy@gmail.com',
                    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  CR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Chithanya Reddy
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    chithanya.reddy@gmail.com
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleGoogleSignIn({
                    name: 'Satya Reddy',
                    email: 'satya.reddy@gmail.com',
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  SR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Satya Reddy
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    satya.reddy@gmail.com
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Custom Google Account Entry */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Or use another Google Account:
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customGoogleEmail.includes('@')) {
                      setErrorMessage('Please enter a valid Gmail address.');
                      return;
                    }
                    handleGoogleSignIn({
                      name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
                      email: customGoogleEmail.trim().toLowerCase(),
                    });
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  Continue with this Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FORGOT PASSWORD MODAL                                     */}
      {/* ========================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl text-left">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                <span>{t.auth.resetPassword}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.auth.resetSubtitle}
              </p>
            </div>

            {forgotStatus ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{forgotStatus}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Enter @username or phone number"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold"
                  >
                    {t.auth.sendOtp}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
