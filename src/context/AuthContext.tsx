import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RememberedCustomer } from '../types';
import { LocalDB, supabase } from '../services/supabaseClient';

import { normalizeIndianPhone, generateNumericOtp } from '../utils/phoneUtils';
import { dispatchSmsToMobile } from '../services/smsService';

export interface GoogleAuthProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  rememberedCustomer: RememberedCustomer | null;
  clearRememberedCustomer: () => void;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, username: string, phoneNumber: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (googleProfile?: GoogleAuthProfile, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  sendPhoneOtp: (phoneNumber: string, mode?: 'signin' | 'signup') => Promise<{ success: boolean; otp?: string; error?: string; formattedPhone?: string; registeredUser?: UserProfile }>;
  verifyPhoneOtp: (phoneNumber: string, otp: string, fullName?: string, rememberMe?: boolean, mode?: 'signin' | 'signup') => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  logout: () => void;
  checkUsernameAvailability: (username: string) => boolean;
  claimUsername: (newUsername: string) => { success: boolean; error?: string };
  resetPassword: (identifier: string) => Promise<{ success: boolean; message: string }>;
  showUsernameOnboarding: boolean;
  setShowUsernameOnboarding: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => LocalDB.getActiveSession());
  const [rememberedCustomer, setRememberedCustomer] = useState<RememberedCustomer | null>(() => LocalDB.getRememberedCustomer());
  const [showUsernameOnboarding, setShowUsernameOnboarding] = useState<boolean>(() => {
    const session = LocalDB.getActiveSession();
    return Boolean(session && (session.needsUsername || !session.username));
  });

  const isAuthenticated = !!user;

  // Clear remembered customer details
  const clearRememberedCustomer = () => {
    LocalDB.clearRememberedCustomer();
    setRememberedCustomer(null);
  };

  // Check username availability
  const checkUsernameAvailability = (username: string): boolean => {
    return LocalDB.isUsernameAvailable(username, user?.id);
  };

  // Login handler
  const login = async (
    identifier: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial latency for realism
    await new Promise((res) => setTimeout(res, 450));

    const cleanId = identifier.trim();
    if (!cleanId) {
      return { success: false, error: 'Please enter your username, email, or mobile number.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Optional Supabase Auth attempt if email
    if (cleanId.includes('@') && !cleanId.startsWith('@')) {
      try {
        const { data: sbData } = await supabase.auth.signInWithPassword({
          email: cleanId,
          password,
        });
        if (sbData?.user) {
          console.log('[Supabase Auth] Signed in cloud user:', sbData.user.id);
        }
      } catch (err) {
        // Fallback safely to LocalDB
      }
    }

    const foundUser = LocalDB.findUserByIdentifier(cleanId);
    if (!foundUser) {
      return {
        success: false,
        error: 'Invalid login credentials. No account found with this username or mobile number.'
      };
    }

    // Strict Password Verification
    const isDemoUser = foundUser.id === 'usr_spendwise_demo_01';
    const isPasswordCorrect =
      foundUser.password === password ||
      (isDemoUser && (password === 'Password@123' || password === 'demo'));

    if (!isPasswordCorrect) {
      return {
        success: false,
        error: 'Incorrect password. Please verify your credentials and try again.'
      };
    }

    LocalDB.setActiveSession(foundUser);
    setUser(foundUser);

    // Save or clear remembered customer login details based on checkbox
    if (rememberMe) {
      const customerToSave: RememberedCustomer = {
        identifier: foundUser.username ? `@${foundUser.username}` : (foundUser.phoneNumber || foundUser.email),
        fullName: foundUser.fullName,
        username: foundUser.username,
        phoneNumber: foundUser.phoneNumber,
        email: foundUser.email,
        avatarUrl: foundUser.avatarUrl,
        rememberMe: true,
        lastLoginAt: new Date().toISOString(),
      };
      LocalDB.saveRememberedCustomer(customerToSave);
      setRememberedCustomer(customerToSave);
    } else {
      LocalDB.clearRememberedCustomer();
      setRememberedCustomer(null);
    }

    if (foundUser.needsUsername || !foundUser.username) {
      setShowUsernameOnboarding(true);
    }

    return { success: true };
  };

  // Signup handler
  const signup = async (
    fullName: string,
    username: string,
    phoneNumber: string,
    password: string,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 500));

    // 1. Full Name validation: must contain letters and not only digits
    const cleanName = fullName.trim();
    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Full Name must be at least 2 characters long.' };
    }
    if (!/[a-zA-Z]/.test(cleanName) || /^\d+$/.test(cleanName)) {
      return {
        success: false,
        error: 'Full Name must contain letters (e.g. "Chithanya Reddy"). Numbers-only are not allowed.'
      };
    }

    // 2. Username validation: must start with a letter and be 3-20 chars alphanumeric or underscore
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (!/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(cleanUsername)) {
      return {
        success: false,
        error: 'Username must start with a letter and contain 3 to 20 letters, numbers, or underscores (e.g. "chithanya_01").'
      };
    }
    if (!checkUsernameAvailability(cleanUsername)) {
      return { success: false, error: `Username @${cleanUsername} is already taken. Please choose another.` };
    }

    // 3. Mobile Number validation: must be numeric 10-15 digits
    const rawDigits = phoneNumber.replace(/[\s-]/g, '');
    if (!/^\+?[0-9]{10,15}$/.test(rawDigits)) {
      return {
        success: false,
        error: 'Please enter a valid 10 to 15 digit mobile number (e.g. "+91 9876543210" or "9876543210"). Letters are not allowed.'
      };
    }

    const existingPhone = LocalDB.findUserByIdentifier(phoneNumber);
    if (existingPhone) {
      return { success: false, error: 'An account with this mobile number already exists. Please sign in instead.' };
    }

    // 4. Password validation: minimum 6 chars
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { success: false, error: 'Password must contain both letters and numbers for account security.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: `${cleanUsername}@spendwise.ai`,
      username: cleanUsername,
      phoneNumber: phoneNumber.trim(),
      password,
      fullName: cleanName,
      needsUsername: false,
      primaryCurrency: 'INR',
      currencySymbol: '₹',
      locale: 'en',
      themePreference: 'light',
      targetMonthlyBudget: 35000,
      monthlyIncome: 65000,
    };


    LocalDB.setActiveSession(newUser);
    setUser(newUser);
    setShowUsernameOnboarding(false);

    if (rememberMe) {
      const customerToSave: RememberedCustomer = {
        identifier: `@${cleanUsername}`,
        fullName: newUser.fullName,
        username: newUser.username,
        phoneNumber: newUser.phoneNumber,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        rememberMe: true,
        lastLoginAt: new Date().toISOString(),
      };
      LocalDB.saveRememberedCustomer(customerToSave);
      setRememberedCustomer(customerToSave);
    } else {
      LocalDB.clearRememberedCustomer();
      setRememberedCustomer(null);
    }

    return { success: true };
  };

  // Claim username during graceful onboarding
  const claimUsername = (newUsername: string): { success: boolean; error?: string } => {
    const cleanUsername = newUsername.trim().toLowerCase().replace(/^@/, '');
    if (!checkUsernameAvailability(cleanUsername)) {
      return { success: false, error: `Username @${cleanUsername} is already taken.` };
    }

    if (!user) return { success: false, error: 'No active session' };

    const updated = LocalDB.updateUserProfile({
      username: cleanUsername,
      needsUsername: false,
    });

    setUser(updated);
    setShowUsernameOnboarding(false);
    return { success: true };
  };

  // Password reset simulation
  const resetPassword = async (identifier: string): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 600));
    const foundUser = LocalDB.findUserByIdentifier(identifier);
    if (!foundUser) {
      return { success: false, message: 'No registered user matches this identifier.' };
    }

    return {
      success: true,
      message: `A password reset code has been dispatched to ${foundUser.phoneNumber || foundUser.email}.`
    };
  };

  const [activeOtpSession, setActiveOtpSession] = useState<{
    phone: string;
    raw10: string;
    otp: string;
    expiresAt: number;
  } | null>(null);

  // Google OAuth / Account Authentication
  const loginWithGoogle = async (
    googleProfile?: GoogleAuthProfile,
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 450));
    try {
      const profile = googleProfile || {
        name: 'Chithanya Reddy',
        email: 'chithanya.reddy@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      let existingUser = LocalDB.findUserByIdentifier(profile.email);
      if (!existingUser) {
        const baseUsername = profile.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 15) || 'user';
        const finalUsername = checkUsernameAvailability(baseUsername)
          ? baseUsername
          : `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;

        existingUser = {
          id: `usr_g_${Date.now()}`,
          email: profile.email,
          username: finalUsername,
          fullName: profile.name,
          avatarUrl: profile.avatarUrl,
          authProvider: 'google',
          needsUsername: false,
          primaryCurrency: 'INR',
          currencySymbol: '₹',
          locale: 'en',
          themePreference: 'light',
          targetMonthlyBudget: 35000,
          monthlyIncome: 65000,
        };
        LocalDB.saveRegisteredUser(existingUser);
      }

      LocalDB.setActiveSession(existingUser);
      setUser(existingUser);

      if (rememberMe) {
        const customerToSave: RememberedCustomer = {
          identifier: existingUser.email,
          fullName: existingUser.fullName,
          username: existingUser.username,
          phoneNumber: existingUser.phoneNumber,
          email: existingUser.email,
          avatarUrl: existingUser.avatarUrl,
          rememberMe: true,
          lastLoginAt: new Date().toISOString(),
        };
        LocalDB.saveRememberedCustomer(customerToSave);
        setRememberedCustomer(customerToSave);
      } else {
        LocalDB.clearRememberedCustomer();
        setRememberedCustomer(null);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Google sign-in failed' };
    }
  };

  // Indian Phone OTP: Send verification code
  // Indian Phone OTP: Send verification code to registered mobile number
  const sendPhoneOtp = async (
    phoneNumber: string,
    mode: 'signin' | 'signup' = 'signin'
  ): Promise<{ success: boolean; otp?: string; error?: string; formattedPhone?: string; registeredUser?: UserProfile }> => {
    await new Promise((res) => setTimeout(res, 400));
    const validation = normalizeIndianPhone(phoneNumber);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const existingUser = LocalDB.findUserByIdentifier(validation.raw10);

    // Strict validation: In signin mode, OTP is only sent to a registered mobile number
    if (mode === 'signin') {
      if (!existingUser) {
        return {
          success: false,
          error: `Mobile number ${validation.formatted} is not registered. Please create an account or register your mobile number first.`
        };
      }
    } else {
      // In signup mode, the number must not already be taken
      if (existingUser) {
        return {
          success: false,
          error: `Mobile number ${validation.formatted} is already registered to ${existingUser.fullName || existingUser.username}. Please switch to Sign In.`
        };
      }
    }

    const generatedOtp = generateNumericOtp();
    const session = {
      phone: validation.formatted,
      raw10: validation.raw10,
      otp: generatedOtp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    setActiveOtpSession(session);

    // Dispatch SMS to mobile messages
    await dispatchSmsToMobile(validation.raw10, generatedOtp);

    return {
      success: true,
      otp: generatedOtp,
      formattedPhone: validation.formatted,
      registeredUser: existingUser,
    };
  };

  // Indian Phone OTP: Verify code & sign in or auto-register
  const verifyPhoneOtp = async (
    phoneNumber: string,
    enteredOtp: string,
    fullName?: string,
    rememberMe: boolean = true,
    mode: 'signin' | 'signup' = 'signin'
  ): Promise<{ success: boolean; error?: string; isNewUser?: boolean }> => {
    await new Promise((res) => setTimeout(res, 450));
    const validation = normalizeIndianPhone(phoneNumber);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const cleanOtp = enteredOtp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      return { success: false, error: 'Please enter the complete 6-digit OTP code.' };
    }

    // Verify OTP against active session or demo backup codes '123456' / '000000'
    const isMatch =
      (activeOtpSession && activeOtpSession.otp === cleanOtp) ||
      cleanOtp === '123456' ||
      cleanOtp === '000000';

    if (!isMatch) {
      return { success: false, error: 'Incorrect OTP. Please enter the valid 6-digit verification code.' };
    }

    let userToLogin = LocalDB.findUserByIdentifier(validation.raw10);
    let isNewUser = false;

    if (mode === 'signup' && !userToLogin) {
      isNewUser = true;
      const cleanName = fullName?.trim() || `User ${validation.raw10.slice(-4)}`;
      const baseUsername = `user_${validation.raw10.slice(-6)}`;
      const username = checkUsernameAvailability(baseUsername)
        ? baseUsername
        : `user_${Date.now().toString().slice(-6)}`;

      userToLogin = {
        id: `usr_phone_${Date.now()}`,
        email: `${username}@spendwise.ai`,
        username,
        phoneNumber: validation.formatted,
        fullName: cleanName,
        authProvider: 'phone_otp',
        needsUsername: false,
        primaryCurrency: 'INR',
        currencySymbol: '₹',
        locale: 'en',
        themePreference: 'light',
        targetMonthlyBudget: 35000,
        monthlyIncome: 65000,
      };
      LocalDB.saveRegisteredUser(userToLogin);
    }

    if (!userToLogin) {
      return {
        success: false,
        error: `Account with mobile number ${validation.formatted} could not be found. Please register.`
      };
    }

    LocalDB.setActiveSession(userToLogin);
    setUser(userToLogin);
    setActiveOtpSession(null);

    if (rememberMe) {
      const customerToSave: RememberedCustomer = {
        identifier: userToLogin.phoneNumber || (userToLogin.username ? `@${userToLogin.username}` : userToLogin.email),
        fullName: userToLogin.fullName,
        username: userToLogin.username,
        phoneNumber: userToLogin.phoneNumber,
        email: userToLogin.email,
        avatarUrl: userToLogin.avatarUrl,
        rememberMe: true,
        lastLoginAt: new Date().toISOString(),
      };
      LocalDB.saveRememberedCustomer(customerToSave);
      setRememberedCustomer(customerToSave);
    } else {
      LocalDB.clearRememberedCustomer();
      setRememberedCustomer(null);
    }

    return { success: true, isNewUser };
  };

  // Logout
  const logout = () => {
    LocalDB.setActiveSession(null);
    setUser(null);
    setShowUsernameOnboarding(false);
    // Keep remembered customer details in state & storage so the login form remembers them!
    const remembered = LocalDB.getRememberedCustomer();
    setRememberedCustomer(remembered);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        rememberedCustomer,
        clearRememberedCustomer,
        login,
        signup,
        loginWithGoogle,
        sendPhoneOtp,
        verifyPhoneOtp,
        logout,
        checkUsernameAvailability,
        claimUsername,
        resetPassword,
        showUsernameOnboarding,
        setShowUsernameOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
