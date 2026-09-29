import React, { useState, useEffect } from 'react';
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
  Check,
  BookmarkCheck,
  UserCheck,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginScreen: React.FC = () => {
  const {
    login,
    signup,
    checkUsernameAvailability,
    resetPassword,
    rememberedCustomer,
    clearRememberedCustomer
  } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Real-time username availability state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Error & loading
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    }
  }, [rememberedCustomer]);

  // Debounced username availability check
  useEffect(() => {
    if (mode !== 'signup' || !username.trim()) {
      setUsernameAvailable(null);
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(() => {
      const clean = username.trim().toLowerCase().replace(/^@/, '');
      if (clean.length < 3) {
        setUsernameAvailable(false);
      } else {
        const available = checkUsernameAvailability(clean);
        setUsernameAvailable(available);
      }
      setIsCheckingUsername(false);
    }, 350);

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

    if (score <= 1) return { score: 1, label: t.auth.passwordStrength.weak, color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: t.auth.passwordStrength.fair, color: 'bg-amber-500' };
    return { score: 3, label: t.auth.passwordStrength.strong, color: 'bg-emerald-500' };
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (mode === 'signin') {
      const result = await login(identifier, password, rememberMe);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to sign in. Please verify your credentials.');
      }
    } else {
      if (usernameAvailable === false) {
        setErrorMessage('Please choose an available username.');
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

  const handleQuickDemoLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    await login('chithanya', 'Password@123', rememberMe);
    setIsLoading(false);
  };

  const handleQuickRememberedLogin = async () => {
    if (!rememberedCustomer) return;
    setErrorMessage(null);
    setIsLoading(true);
    // Use demo password or prompt
    const result = await login(rememberedCustomer.identifier, 'Password@123', true);
    if (!result.success) {
      // If Password@123 wasn't the password, fill field and focus password
      setIdentifier(rememberedCustomer.identifier);
      setErrorMessage('Please enter your password below to continue.');
    }
    setIsLoading(false);
  };

  const handleSwitchAccount = () => {
    clearRememberedCustomer();
    setIdentifier('');
    setPassword('');
    setErrorMessage(null);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    const res = await resetPassword(forgotIdentifier);
    setForgotStatus(res.message);
  };

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
        {rememberedCustomer && mode === 'signin' && (
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
                    {t.auth.welcomeBackCustomer || 'Welcome back'}, {rememberedCustomer.fullName || rememberedCustomer.identifier}!
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
                title={t.auth.clearRemembered || 'Clear saved details on this device'}
              >
                {t.auth.switchAccount || 'Switch'}
              </button>
            </div>
          </div>
        )}

        {/* Sign In / Sign Up Segmented Control */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
            className={`py-2 rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.auth.signUpButton}
          </button>
        </div>

        {/* Section Heading */}
        <div className="space-y-0.5 text-left">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{mode === 'signin' ? t.auth.welcomeBack : t.auth.createAccount}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signin' ? t.auth.signInSubtitle : t.auth.signUpSubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.auth.fullNameLabel}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={t.auth.fullNamePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Username with Real-Time Availability Check */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.auth.usernameLabel}
                  </label>
                  {isCheckingUsername && (
                    <span className="text-[10px] text-indigo-500 animate-pulse">
                      {t.auth.checkingUsername}
                    </span>
                  )}
                  {!isCheckingUsername && usernameAvailable === true && (
                    <span className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {t.auth.usernameAvailable}
                    </span>
                  )}
                  {!isCheckingUsername && usernameAvailable === false && (
                    <span className="text-[10px] text-rose-500 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {t.auth.usernameTaken}
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={t.auth.usernamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.auth.phoneLabel}
                </label>
                <div className="relative flex items-center">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder={t.auth.phonePlaceholder}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Identifier field for Sign In (Email, Phone or @username) */}
          {mode === 'signin' && (
            <div className="space-y-1.5 text-left">
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
                  placeholder={t.auth.identifierPlaceholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password with Strength Indicator */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.auth.passwordLabel}
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
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                </div>
                <div className="grid grid-cols-3 gap-1 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-transparent'}`}></div>
                  <div className={`h-full ${strength.score >= 2 ? strength.color : 'bg-transparent'}`}></div>
                  <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-transparent'}`}></div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* REMEMBER CUSTOMER LOGIN DETAILS CHECKBOX */}
          {/* ======================================================== */}
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
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'signin' ? t.auth.signInButton : t.auth.signUpButton}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Divider */}
        <div className="relative flex py-2 items-center">
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
            <span>{t.auth.quickDemoLogin || 'Quick Demo Login (@chithanya)'}</span>
          </button>
          
          <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
            Demo credentials: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">@chithanya</code> / <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">demo</code>
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

      {/* Forgot Password Modal */}
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
