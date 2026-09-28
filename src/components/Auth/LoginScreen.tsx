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
  Send
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginScreen: React.FC = () => {
  const { login, signup, checkUsernameAvailability, resetPassword } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      const result = await login(identifier, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to sign in.');
      }
    } else {
      if (usernameAvailable === false) {
        setErrorMessage('Please select an available username.');
        setIsLoading(false);
        return;
      }
      const result = await signup(fullName, username, phoneNumber, password);
      if (!result.success) {
        setErrorMessage(result.error || 'Failed to create account.');
      }
    }
    setIsLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    await login('chithanya', 'Password@123');
    setIsLoading(false);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) return;
    const res = await resetPassword(forgotIdentifier);
    setForgotStatus(res.message);
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto p-4 sm:p-6 space-y-6">
      {/* Brand Hero Card */}
      <div className="text-center space-y-2">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 items-center justify-center font-extrabold text-white text-xl shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-500/10">
          SW
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.appName}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
          {t.tagline}
        </p>
      </div>

      {/* Main Auth Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-5 transition-colors">
        {/* Sign In / Sign Up Segmented Control */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs font-semibold">
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

        {/* Section Title */}
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {mode === 'signin' ? t.auth.welcomeBack : t.auth.createAccount}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signin' ? t.auth.signInSubtitle : t.auth.signUpSubtitle}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-400 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.auth.fullNameLabel}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={t.auth.fullNamePlaceholder}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Username with Real-Time Availability Check */}
              <div className="space-y-1">
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
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={t.auth.usernamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.auth.phoneLabel}
                </label>
                <div className="relative flex items-center">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder={t.auth.phonePlaceholder}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </>
          )}

          {/* Identifier field for Sign In (Mobile number OR @username) */}
          {mode === 'signin' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.auth.identifierLabel}
              </label>
              <div className="relative flex items-center">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder={t.auth.identifierPlaceholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password with Strength Indicator */}
          <div className="space-y-1">
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
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? t.auth.signInButton : t.auth.signUpButton}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Access Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase font-mono tracking-wider">
            Or Instant Demo
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* 1-Click Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{t.auth.quickDemoLogin}</span>
        </button>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-sm rounded-2xl p-5 space-y-4 shadow-2xl">
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
