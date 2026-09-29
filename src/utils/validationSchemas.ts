import { z } from 'zod';

/**
 * Normalizes Indian mobile number into standard +91XXXXXXXXXX format.
 * Returns null if the number is invalid.
 */
export function normalizeIndianMobile(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const digits = input.replace(/\D/g, '');

  let raw10 = '';
  if (digits.length === 10) {
    raw10 = digits;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    raw10 = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    raw10 = digits.slice(1);
  } else {
    return null;
  }

  // Indian mobile numbers must start with 6, 7, 8, or 9
  if (!/^[6-9]\d{9}$/.test(raw10)) {
    return null;
  }

  return `+91${raw10}`;
}

/**
 * Formats a 10-digit Indian phone number for clean UI display: +91 XXXXX XXXXX
 */
export function formatIndianMobileDisplay(input: string): string {
  const digits = input.replace(/\D/g, '').slice(-10);
  if (!digits) return '+91 ';
  if (digits.length <= 5) return `+91 ${digits}`;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
}

/**
 * Full Name Validation Rule:
 * - Must only accept human names.
 * - Allowed characters: English letters (A-Z, a-z), spaces, apostrophes, and hyphens where appropriate.
 * - Reject numbers, special symbols (like @#$%!), and invalid characters.
 * - Reject message: "Please enter a valid name using letters and spaces."
 */
export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your full name.')
  .min(2, 'Please enter a valid name using letters and spaces.')
  .max(70, 'Name must not exceed 70 characters.')
  .refine((val) => /^[a-zA-Z]+([a-zA-Z\s'-]*[a-zA-Z]+)?$/.test(val), {
    message: 'Please enter a valid name using letters and spaces.',
  })
  .refine((val) => !/[0-9]/.test(val), {
    message: 'Please enter a valid name using letters and spaces.',
  })
  .refine((val) => !/[@#$%^&*()_+=\[\]{};:"\\|<>\/?~`!§±]/.test(val), {
    message: 'Please enter a valid name using letters and spaces.',
  });

/**
 * Email Address Validation Rule:
 * Standard email format (example: name@example.com).
 * Reject invalid email formats.
 */
export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your email address.')
  .email('Please enter a valid email address.')
  .refine((val) => !val.includes('..'), {
    message: 'Please enter a valid email address.',
  })
  .refine((val) => {
    const parts = val.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1];
    return domain.includes('.') && domain.split('.').pop()!.length >= 2;
  }, {
    message: 'Please enter a valid email address.',
  });

/**
 * Mobile Number Validation Rule:
 * Follows standard Indian mobile number formatting: +91 XXXXX XXXXX or 10-digit Indian mobile number.
 * Must reject numbers that do not fit the Indian standard format.
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your mobile number.')
  .refine((val) => normalizeIndianMobile(val) !== null, {
    message: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
  })
  .transform((val) => normalizeIndianMobile(val)!);

/**
 * Strong Password Validation Rule:
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .refine((val) => /[A-Z]/.test(val), {
    message: 'Password must contain at least one uppercase letter.',
  })
  .refine((val) => /[a-z]/.test(val), {
    message: 'Password must contain at least one lowercase letter.',
  })
  .refine((val) => /[0-9]/.test(val), {
    message: 'Password must contain at least one number.',
  })
  .refine((val) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val), {
    message: 'Password must contain at least one special character.',
  });

/**
 * Live Password Checklist Evaluator:
 * Returns the status of each requirement for real-time visual feedback.
 */
export interface PasswordRequirementsChecklist {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isAllMet: boolean;
}

export function evaluatePasswordRequirements(password: string): PasswordRequirementsChecklist {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  const isAllMet = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isAllMet,
  };
}

/**
 * 6-Digit OTP Schema
 */
export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Please enter the complete 6-digit verification code.');

/**
 * Sign In with Email & Password Schema:
 */
export const signInWithEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Please enter your password.'),
  rememberMe: z.boolean().optional().default(true),
});

/**
 * Sign In with Mobile Number Schema:
 */
export const signInWithPhoneSchema = z.object({
  mobileNumber: phoneSchema,
  rememberMe: z.boolean().optional().default(true),
});

/**
 * Sign Up Schema:
 * Full Name, Email Address, Mobile Number, Password, Confirm Password
 */
export const signUpSchema = z
  .object({
    fullName: nameSchema,
    email: emailSchema,
    mobileNumber: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
    rememberMe: z.boolean().optional().default(true),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

/**
 * User Profile Schema:
 */
export const profileSchema = z.object({
  user_id: z.string(),
  full_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  preferred_language: z.string().default('en'),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type SignInWithEmailInput = z.infer<typeof signInWithEmailSchema>;
export type SignInWithPhoneInput = z.infer<typeof signInWithPhoneSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;

/**
 * Helper to safely extract the first error message across Zod versions (v3/v4).
 */
export function getFirstZodError(error: any): string {
  if (!error) return 'Validation error occurred.';
  if (Array.isArray(error.issues) && error.issues.length > 0) {
    return error.issues[0]?.message || 'Validation error occurred.';
  }
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0]?.message || 'Validation error occurred.';
  }
  return error.message || 'Validation error occurred.';
}

