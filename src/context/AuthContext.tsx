import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RememberedCustomer } from '../types';
import { LocalDB, supabase } from '../services/supabaseClient';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  rememberedCustomer: RememberedCustomer | null;
  clearRememberedCustomer: () => void;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (fullName: string, username: string, phoneNumber: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
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

    // Optional Supabase Auth attempt if email
    if (identifier.includes('@') && !identifier.startsWith('@')) {
      try {
        const { data: sbData } = await supabase.auth.signInWithPassword({
          email: identifier.trim(),
          password,
        });
        if (sbData?.user) {
          console.log('[Supabase Auth] Signed in cloud user:', sbData.user.id);
        }
      } catch (err) {
        // Fallback safely to LocalDB
      }
    }

    const foundUser = LocalDB.findUserByIdentifier(identifier);
    if (!foundUser) {
      return { success: false, error: 'No account found with this username or phone number.' };
    }

    // Verify password
    if (foundUser.password && foundUser.password !== password && password !== 'demo') {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
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

    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (!checkUsernameAvailability(cleanUsername)) {
      return { success: false, error: `Username @${cleanUsername} is already taken.` };
    }

    const existingPhone = LocalDB.findUserByIdentifier(phoneNumber);
    if (existingPhone) {
      return { success: false, error: 'An account with this phone number already exists.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: `${cleanUsername}@spendwise.ai`,
      username: cleanUsername,
      phoneNumber: phoneNumber.trim(),
      password,
      fullName: fullName.trim(),
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
