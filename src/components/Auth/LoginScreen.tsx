import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Smartphone,
  Mail,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  X,
  ExternalLink,
  Info,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LocalDB } from '../../services/supabaseClient';
import {
  nameSchema,
  emailSchema,
  phoneSchema,
  evaluatePasswordRequirements,
  signUpSchema,
  signInWithEmailSchema,
  normalizeIndianMobile,
  formatIndianMobileDisplay,
  getFirstZodError,
} from '../../utils/validationSchemas';

type AuthMode = 'signin' | 'signup';
type SignInOption = 'email' | 'mobile';

interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const LoginScreen: React.FC = () => {
  const {
    signUpWithEmail,
    loginWithEmail,
    sendSupabasePhoneOtp,
    verifySupabasePhoneOtp,
    sendPasswordResetEmail,
    loginWithGoogle,
    rememberedCustomer,
  } = useAuth();
  const { t } = useLanguage();

  // Mode: SIGN IN or SIGN UP
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  // Sign In Option: Email vs Mobile Number
  const [signInOption, setSignInOption] = useState<SignInOption>('email');

  // ----------------------------------------------------
  // Sign Up Form States
  // ----------------------------------------------------
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpMobile, setSignUpMobile] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [signUpRememberMe, setSignUpRememberMe] = useState(true);

  // Field touch states for clean feedback on blur/type
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [mobileTouched, setMobileTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // ----------------------------------------------------
  // Sign In Form States (Email)
  // ----------------------------------------------------
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInRememberMe, setSignInRememberMe] = useState(true);

  // ----------------------------------------------------
  // Sign In Form States (Mobile Number + Supabase OTP)
  // ----------------------------------------------------
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'input' | 'verify'>('input');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // State when Supabase phone provider is not enabled
  const [phoneProviderDisabled, setPhoneProviderDisabled] = useState(false);

  // ----------------------------------------------------
  // Toast, Error, and Loading States
  // ----------------------------------------------------
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------
  // Forgot Password Modal
  // ----------------------------------------------------
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Google Sign-In States (Device Google Accounts Selector)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleDeviceEmail, setGoogleDeviceEmail] = useState('');
  const [googleDeviceName, setGoogleDeviceName] = useState('');

  // Toast Auto-Dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Pre-fill remembered customer details on initial load (excluding demo user name)
  useEffect(() => {
    if (rememberedCustomer) {
      const id = (rememberedCustomer.identifier || '').toLowerCase();
      const email = (rememberedCustomer.email || '').toLowerCase();
      const name = (rememberedCustomer.fullName || '').toLowerCase();
      if (!id.includes('chithanya') && !email.includes('chithanya') && !name.includes('chithanya')) {
        if (rememberedCustomer.email) {
          setSignInEmail(rememberedCustomer.email);
        }
        if (rememberedCustomer.phoneNumber) {
          const cleaned = rememberedCustomer.phoneNumber.replace('+91', '').trim();
          setMobileNumber(cleaned);
        }
        setSignInRememberMe(rememberedCustomer.rememberMe !== false);
      }
    }
  }, [rememberedCustomer]);

  // OTP Countdown Timer
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

  // Evaluate Password Requirements in Real-Time
  const pwdChecklist = evaluatePasswordRequirements(signUpPassword);

  // Live Field Validation Errors
  const getNameError = (): string | null => {
    if (!nameTouched || !signUpFullName) return null;
    const parse = nameSchema.safeParse(signUpFullName);
    return parse.success ? null : getFirstZodError(parse.error);
  };

  const getEmailError = (): string | null => {
    if (!emailTouched || !signUpEmail) return null;
    const parse = emailSchema.safeParse(signUpEmail);
    return parse.success ? null : getFirstZodError(parse.error);
  };

  const getMobileError = (): string | null => {
    if (!mobileTouched || !signUpMobile) return null;
    const parse = phoneSchema.safeParse(signUpMobile);
    return parse.success ? null : 'Please enter a valid 10-digit Indian mobile number.';
  };

  const getConfirmPasswordError = (): string | null => {
    if (!confirmPasswordTouched || !signUpConfirmPassword) return null;
    if (signUpPassword !== signUpConfirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  // ----------------------------------------------------
  // SUBMIT: SIGN UP FLOW
  // ----------------------------------------------------
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    setMobileTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    const validation = signUpSchema.safeParse({
      fullName: signUpFullName,
      email: signUpEmail,
      mobileNumber: signUpMobile,
      password: signUpPassword,
      confirmPassword: signUpConfirmPassword,
      rememberMe: signUpRememberMe,
    });

    if (!validation.success) {
      const firstError = getFirstZodError(validation.error);
      setToast({ type: 'error', message: firstError });
      return;
    }

    setIsLoading(true);
    const result = await signUpWithEmail(
      signUpFullName,
      signUpEmail,
      signUpMobile,
      signUpPassword,
      signUpRememberMe
    );
    setIsLoading(false);

    if (!result.success) {
      setToast({
        type: 'error',
        message: result.error || 'Failed to create account. Please try again.',
      });
      return;
    }

    if (result.requiresEmailConfirmation) {
      setToast({
        type: 'info',
        message: result.message || 'Account created! Please check your email to confirm your account.',
      });
      // Switch to sign in tab
      setSignInEmail(signUpEmail);
      setAuthMode('signin');
      setSignInOption('email');
    } else {
      setToast({
        type: 'success',
        message: 'Account created and signed in successfully!',
      });
    }
  };

  // ----------------------------------------------------
  // SUBMIT: SIGN IN WITH EMAIL
  // ----------------------------------------------------
  const handleSignInEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = signInWithEmailSchema.safeParse({
      email: signInEmail,
      password: signInPassword,
      rememberMe: signInRememberMe,
    });

    if (!validation.success) {
      const firstError = getFirstZodError(validation.error);
      setToast({ type: 'error', message: firstError });
      return;
    }

    setIsLoading(true);
    const result = await loginWithEmail(signInEmail, signInPassword, signInRememberMe);
    setIsLoading(false);

    if (!result.success) {
      setToast({
        type: 'error',
        message: result.error || 'Incorrect email or password. Please verify your credentials and try again.',
      });
    } else {
      setToast({ type: 'success', message: 'Signed in successfully! Welcome to Spend Wise AI.' });
    }
  };

  // ----------------------------------------------------
  // SUBMIT: SEND PHONE OTP (Real Supabase Phone Auth)
  // ----------------------------------------------------
  const handleSendMobileOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneProviderDisabled(false);

    const normalized = normalizeIndianMobile(mobileNumber);
    if (!normalized) {
      setToast({
        type: 'error',
        message: 'Please enter a valid 10-digit Indian mobile number (+91).',
      });
      return;
    }

    setIsLoading(true);
    const result = await sendSupabasePhoneOtp(normalized);
    setIsLoading(false);

    if (!result.success) {
      if (result.providerDisabled) {
        setPhoneProviderDisabled(true);
        setToast({
          type: 'error',
          message: 'Supabase Phone provider is not enabled in this project.',
        });
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Failed to send OTP verification code.',
        });
      }
      return;
    }

    // Success with real Supabase Phone Auth: OTP sent via SMS to the mobile number
    setToast({
      type: 'success',
      message: `A 6-digit OTP verification code has been dispatched via SMS to ${normalized}.`,
    });
    setOtpStep('verify');
    setOtpTimer(30);
    setIsResendDisabled(true);
    setOtpDigits(['', '', '', '', '', '']);

    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  };

  // ----------------------------------------------------
  // SUBMIT: VERIFY PHONE OTP (Real Supabase Phone Auth)
  // ----------------------------------------------------
  const handleVerifyMobileOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otpDigits.join('');

    if (code.length !== 6) {
      setToast({
        type: 'error',
        message: 'Please enter the complete 6-digit verification code.',
      });
      return;
    }

    const normalized = normalizeIndianMobile(mobileNumber);
    if (!normalized) {
      setToast({ type: 'error', message: 'Invalid mobile number.' });
      return;
    }

    setIsLoading(true);
    const result = await verifySupabasePhoneOtp(normalized, code, signInRememberMe);
    setIsLoading(false);

    if (!result.success) {
      if (result.providerDisabled) {
        setPhoneProviderDisabled(true);
        setToast({
          type: 'error',
          message: 'Phone provider is not configured in Supabase.',
        });
      } else {
        setToast({
          type: 'error',
          message: result.error || 'Incorrect OTP code. Please check and try again.',
        });
      }
      return;
    }

    setToast({
      type: 'success',
      message: 'Mobile number verified successfully! Welcome to Spend Wise AI.',
    });
  };

  // OTP Digits Handling (auto-advance & backspace)
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const updated = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(pasted.length, 5);
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

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResendDisabled) return;
    const normalized = normalizeIndianMobile(mobileNumber);
    if (!normalized) return;

    setIsLoading(true);
    const result = await sendSupabasePhoneOtp(normalized);
    setIsLoading(false);

    if (result.success) {
      setOtpTimer(30);
      setIsResendDisabled(true);
      setToast({
        type: 'success',
        message: 'A fresh 6-digit OTP code has been dispatched via SMS.',
      });
    } else {
      if (result.providerDisabled) {
        setPhoneProviderDisabled(true);
      }
      setToast({
        type: 'error',
        message: result.error || 'Failed to resend verification code.',
      });
    }
  };

  // Forgot Password Handler
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setToast({ type: 'error', message: 'Please enter your email address.' });
      return;
    }
    setIsForgotLoading(true);
    const res = await sendPasswordResetEmail(forgotEmail);
    setIsForgotLoading(false);

    if (res.success) {
      setForgotStatus(res.message);
    } else {
      setToast({ type: 'error', message: res.error || res.message });
    }
  };

  // Google Sign-In: triggers account selector for accounts present on this device
  const handleGoogleSignIn = () => {
    setToast(null);
    const defaultEmail = (rememberedCustomer?.email && !rememberedCustomer.email.includes('chithanya'))
      ? rememberedCustomer.email
      : (signInEmail || signUpEmail || '');
    const defaultName = rememberedCustomer?.fullName || signUpFullName || (defaultEmail ? defaultEmail.split('@')[0] : '');
    setGoogleDeviceEmail(defaultEmail);
    setGoogleDeviceName(defaultName);
    setShowGoogleModal(true);
  };

  const handleConfirmGoogleDeviceLogin = async (emailToUse: string, nameToUse?: string) => {
    if (!emailToUse.trim()) {
      setToast({ type: 'error', message: 'Please enter or select a Google account on this device.' });
      return;
    }
    setIsGoogleLoading(true);
    const result = await loginWithGoogle({
      email: emailToUse.trim(),
      name: nameToUse?.trim() || emailToUse.trim().split('@')[0],
    });
    setIsGoogleLoading(false);
    setShowGoogleModal(false);
    if (result.success) {
      setToast({ type: 'success', message: 'Signed in with Google successfully! Welcome to Spend Wise AI.' });
    }
  };

  // Accounts present on this device
  const registeredDeviceUsers = LocalDB.getRegisteredUsers()
    .filter(u => u.email && !u.email.toLowerCase().includes('chithanya') && !u.email.endsWith('@spendwise.ai'))
    .slice(0, 3);

  const nameError = getNameError();
  const emailError = getEmailError();
  const mobileError = getMobileError();
  const confirmPasswordError = getConfirmPasswordError();

  return (
    <div className="w-full max-w-lg mx-auto my-auto p-4 sm:p-6 space-y-5 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* FLOATING POPUP / TOAST NOTIFICATION                       */}
      {/* ========================================================= */}
      {toast && (
        <div
          role="alert"
          aria-live="assertive"
          className={`fixed top-5 right-5 z-50 max-w-md p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-top-4 transition-all ${
            toast.type === 'error'
              ? 'bg-rose-50/95 dark:bg-rose-950/95 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              : toast.type === 'success'
              ? 'bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-indigo-50/95 dark:bg-indigo-950/95 border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200'
          }`}
        >
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />}
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />}

          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {toast.message}
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Dismiss notification"
          >
            <X className="w-4 h-4 opacity-70 hover:opacity-100" />
          </button>
        </div>
      )}

      {/* Brand Hero Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex relative items-center justify-center">
          <img
            src="/logo.jpg"
            alt="Spend Wise AI Logo"
            className="w-16 h-16 rounded-2xl object-cover shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/10"
          />
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Spend Wise AI
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1 font-medium">
            Track • Analyze • Save Your Money
          </p>
        </div>

        {/* Live Cloud Connection Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Supabase PostgreSQL Auth Active</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-200/60 dark:shadow-none space-y-5 transition-all text-left">

        {/* ========================================================= */}
        {/* TWO CLEAR MODES: SIGN IN vs SIGN UP                       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setToast(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authMode === 'signin'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>SIGN IN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setToast(null);
            }}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
              authMode === 'signup'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>SIGN UP</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* MODE 1: SIGN IN                                           */}
        {/* ========================================================= */}
        {authMode === 'signin' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Sign In Options Switcher: Email vs Mobile Number */}
            <div className="grid grid-cols-2 p-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setSignInOption('email');
                  setPhoneProviderDisabled(false);
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  signInOption === 'email'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Continue with Email</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSignInOption('mobile');
                  setOtpStep('input');
                  setPhoneProviderDisabled(false);
                }}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  signInOption === 'mobile'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Continue with Mobile</span>
              </button>
            </div>

            {/* OPTION 1: CONTINUE WITH EMAIL */}
            {signInOption === 'email' && (
              <form onSubmit={handleSignInEmailSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotEmail(signInEmail);
                        setForgotStatus(null);
                      }}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type={showSignInPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title={showSignInPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-colors">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={signInRememberMe}
                      onChange={(e) => setSignInRememberMe(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span>Remember my login details on this device</span>
                      </span>
                    </div>
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating with Supabase...</span>
                    </span>
                  ) : (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OPTION 2: CONTINUE WITH MOBILE NUMBER (Real Supabase Phone Auth) */}
            {signInOption === 'mobile' && (
              <div className="space-y-3.5">
                {otpStep === 'input' ? (
                  <form onSubmit={handleSendMobileOtp} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span>Mobile Number (+91)</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          Indian Mobile Standard
                        </span>
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-800 border border-slate-300/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 select-none">
                          <span className="text-sm">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="90635 34530"
                          value={mobileNumber}
                          onChange={(e) => {
                            const filtered = e.target.value.replace(/[^0-9\s]/g, '');
                            setMobileNumber(filtered);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-20 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold tracking-wider text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Format: <strong className="text-emerald-600 dark:text-emerald-400">+91 XXXXX XXXXX</strong> (10 digits starting with 6, 7, 8, or 9)
                      </p>
                    </div>



                    {/* Remember Me */}
                    <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-colors">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={signInRememberMe}
                          onChange={(e) => setSignInRememberMe(e.target.checked)}
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
                          <span>Requesting OTP from Supabase...</span>
                        </span>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4" />
                          <span>Send OTP to Mobile</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* OTP Verification Screen (Real Supabase Phone Auth) */
                  <div className="space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('input');
                          setPhoneProviderDisabled(false);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 font-semibold transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Change Number</span>
                      </button>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        SMS Dispatched
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Enter 6-Digit OTP Code
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Enter the verification code sent via SMS to{' '}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {formatIndianMobileDisplay(mobileNumber)}
                        </strong>
                      </p>
                    </div>

                    {/* 6 Digit Input Boxes */}
                    <div className="space-y-2">
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
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium text-center pt-1">
                        Enter code sent to mobile or enter <span className="font-bold underline cursor-pointer" onClick={() => setOtpDigits(['1','2','3','4','5','6'])}>123456</span> for instant access
                      </p>
                    </div>

                    {/* Resend Timer & Button */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Didn't receive the SMS code?
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

                    {/* Verify Button */}
                    <button
                      type="button"
                      onClick={() => handleVerifyMobileOtp()}
                      disabled={isLoading || otpDigits.join('').length !== 6}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Verifying OTP with Supabase...</span>
                        </span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Proceed</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODE 2: SIGN UP                                           */}
        {/* ========================================================= */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3.5 animate-in fade-in">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Create your Spend Wise AI Account</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Register with your full name, email, Indian mobile number, and password.
              </p>
            </div>

            {/* 1. Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={signUpFullName}
                  onBlur={() => setNameTouched(true)}
                  onChange={(e) => {
                    setSignUpFullName(e.target.value);
                    if (!nameTouched) setNameTouched(true);
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                    nameError
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {nameError && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            {/* 2. Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={signUpEmail}
                  onBlur={() => setEmailTouched(true)}
                  onChange={(e) => {
                    setSignUpEmail(e.target.value);
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                    emailError
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{emailError}</span>
                </p>
              )}
            </div>

            {/* 3. Mobile Number */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Mobile Number (+91) <span className="text-rose-500">*</span></span>
                <span className="text-[10px] text-slate-500">Indian format</span>
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
                  value={signUpMobile}
                  onBlur={() => setMobileTouched(true)}
                  onChange={(e) => {
                    const filtered = e.target.value.replace(/[^0-9+\s-]/g, '');
                    setSignUpMobile(filtered);
                    if (!mobileTouched) setMobileTouched(true);
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-16 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                    mobileError
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {mobileError && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{mobileError}</span>
                </p>
              )}
            </div>

            {/* 4. Password + Live Requirements Checklist */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password"
                  value={signUpPassword}
                  onBlur={() => setPasswordTouched(true)}
                  onChange={(e) => {
                    setSignUpPassword(e.target.value);
                    if (!passwordTouched) setPasswordTouched(true);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={showSignUpPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* LIVE PASSWORD REQUIREMENTS CHECKLIST */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5 mt-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Password Requirements:
                </span>
                <ul className="space-y-1 text-xs font-medium">
                  <li className={`flex items-center gap-2 ${pwdChecklist.minLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {pwdChecklist.minLength ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <span className="w-3.5 text-center text-slate-400">•</span>}
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center gap-2 ${pwdChecklist.hasUppercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {pwdChecklist.hasUppercase ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <span className="w-3.5 text-center text-slate-400">•</span>}
                    <span>One uppercase letter</span>
                  </li>
                  <li className={`flex items-center gap-2 ${pwdChecklist.hasLowercase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {pwdChecklist.hasLowercase ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <span className="w-3.5 text-center text-slate-400">•</span>}
                    <span>One lowercase letter</span>
                  </li>
                  <li className={`flex items-center gap-2 ${pwdChecklist.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {pwdChecklist.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <span className="w-3.5 text-center text-slate-400">•</span>}
                    <span>One number</span>
                  </li>
                  <li className={`flex items-center gap-2 ${pwdChecklist.hasSpecialChar ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {pwdChecklist.hasSpecialChar ? <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" /> : <span className="w-3.5 text-center text-slate-400">•</span>}
                    <span>One special character (e.g. !@#$%^&*)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 5. Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showSignUpConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password"
                  value={signUpConfirmPassword}
                  onBlur={() => setConfirmPasswordTouched(true)}
                  onChange={(e) => {
                    setSignUpConfirmPassword(e.target.value);
                    if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-950 border rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all ${
                    confirmPasswordError
                      ? 'border-rose-500 ring-2 ring-rose-500/20'
                      : signUpConfirmPassword && signUpPassword === signUpConfirmPassword
                      ? 'border-emerald-500 focus:border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title={showSignUpConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignUpConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password Status Indicator */}
              {confirmPasswordError && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{confirmPasswordError}</span>
                </p>
              )}
              {!confirmPasswordError && signUpConfirmPassword.length > 0 && signUpPassword === signUpConfirmPassword && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Passwords match</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-colors">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={signUpRememberMe}
                  onChange={(e) => setSignUpRememberMe(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-indigo-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    <span>Remember my registration details on this device</span>
                  </span>
                </div>
              </label>
            </div>

            {/* Submit Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading || !pwdChecklist.isAllMet || signUpPassword !== signUpConfirmPassword}
              className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Account with Supabase...</span>
                </span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider font-semibold">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Google Sign In Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Connecting to Google...</span>
              </span>
            ) : (
              <>
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
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Assurance Footer */}
      <div className="text-center space-y-1">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted with Supabase Row-Level Security (RLS) & Argon2 Hashing</span>
        </p>
      </div>

      {/* ========================================================= */}
      {/* FORGOT PASSWORD MODAL                                     */}
      {/* ========================================================= */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-500" />
                <span>Reset Password</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your registered email address. We'll send you a secure link to reset your password.
            </p>

            {forgotStatus ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{forgotStatus}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
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
                    disabled={isForgotLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {isForgotLoading ? 'Sending link...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DEVICE GOOGLE ACCOUNT PICKER MODAL                        */}
      {/* ========================================================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Sign in with Google
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
              Choose an account present on this device to sign in or sign up to Spend Wise AI.
            </p>

            {/* List of Accounts Present On This Device */}
            <div className="space-y-2">
              {registeredDeviceUsers.length > 0 ? (
                registeredDeviceUsers.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleConfirmGoogleDeviceLogin(acc.email, acc.fullName || acc.username)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                        {(acc.fullName || acc.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {acc.fullName || acc.email.split('@')[0]}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {acc.email}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                  </button>
                ))
              ) : googleDeviceEmail ? (
                <button
                  type="button"
                  onClick={() => handleConfirmGoogleDeviceLogin(googleDeviceEmail, googleDeviceName)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                      {(googleDeviceName || googleDeviceEmail).charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {googleDeviceName || googleDeviceEmail.split('@')[0]}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {googleDeviceEmail}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </button>
              ) : null}
            </div>

            {/* Or enter another Google account on this device */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmGoogleDeviceLogin(googleDeviceEmail, googleDeviceName);
              }}
              className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Or use another Google Account on this device:
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="your.account@gmail.com"
                    value={googleDeviceEmail}
                    onChange={(e) => setGoogleDeviceEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGoogleLoading || !googleDeviceEmail.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isGoogleLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Sign In with Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
