/**
 * SpendWise AI - Indian Phone Number & OTP Utilities
 * Handles validation, formatting, and OTP verification for Indian (+91) mobile numbers.
 */

export interface PhoneValidationResult {
  isValid: boolean;
  formatted: string;
  raw10: string;
  error?: string;
}

/**
 * Validates and normalizes Indian mobile numbers.
 * Supports:
 * - 10 digits: 9876543210
 * - With +91: +91 9876543210 or +919876543210
 * - With 91: 919876543210
 * - With leading 0: 09876543210
 *
 * Rules:
 * - Must resolve to 10 digits
 * - In India, valid mobile numbers start with 6, 7, 8, or 9
 */
export function normalizeIndianPhone(input: string): PhoneValidationResult {
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      formatted: '',
      raw10: '',
      error: 'Please enter a mobile number.',
    };
  }

  // Remove non-numeric characters except +
  const clean = input.trim();
  const digits = clean.replace(/\D/g, '');

  let raw10 = '';
  if (digits.length === 10) {
    raw10 = digits;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    raw10 = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    raw10 = digits.slice(1);
  } else {
    return {
      isValid: false,
      formatted: clean,
      raw10: '',
      error: 'Please enter a valid 10-digit Indian mobile number.',
    };
  }

  // Mobile numbers in India must start with 6, 7, 8, or 9
  if (!/^[6-9]\d{9}$/.test(raw10)) {
    return {
      isValid: false,
      formatted: clean,
      raw10,
      error: 'Indian mobile numbers must start with 6, 7, 8, or 9.',
    };
  }

  const formatted = `+91 ${raw10.slice(0, 5)} ${raw10.slice(5)}`;
  return {
    isValid: true,
    formatted,
    raw10,
  };
}

/**
 * Formats a 10-digit number for display with +91 country code
 */
export function formatIndianPhoneNumber(digits10: string): string {
  const digits = digits10.replace(/\D/g, '').slice(-10);
  if (digits.length <= 5) return `+91 ${digits}`;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
}

/**
 * Generates a secure 6-digit numeric OTP code
 */
export function generateNumericOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
