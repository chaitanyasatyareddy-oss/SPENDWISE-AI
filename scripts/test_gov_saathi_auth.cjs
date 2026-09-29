const { z } = require('zod');
const { createClient } = require('@supabase/supabase-js');

// Validation schemas matching src/utils/validationSchemas.ts
function normalizeIndianMobile(input) {
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

  if (!/^[6-9]\d{9}$/.test(raw10)) {
    return null;
  }

  return `+91${raw10}`;
}

const nameSchema = z
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

const emailSchema = z
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
    return domain.includes('.') && domain.split('.').pop().length >= 2;
  }, {
    message: 'Please enter a valid email address.',
  });

const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your mobile number.')
  .refine((val) => normalizeIndianMobile(val) !== null, {
    message: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
  })
  .transform((val) => normalizeIndianMobile(val));

const passwordSchema = z
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

function evaluatePasswordRequirements(password) {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  const isAllMet = minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  return { minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar, isAllMet };
}

const signUpSchema = z
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

function getFirstZodError(error) {
  if (!error) return 'Validation error occurred.';
  if (Array.isArray(error.issues) && error.issues.length > 0) {
    return error.issues[0]?.message || 'Validation error occurred.';
  }
  if (Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors[0]?.message || 'Validation error occurred.';
  }
  return error.message || 'Validation error occurred.';
}

async function runTests() {
  console.log('========================================================');
  console.log('GOV SAATHI AUTHENTICATION VALIDATION TEST SUITE');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extraInfo = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${extraInfo}`);
      failed++;
    }
  }

  // 1. Full Name Tests
  console.log('--- 1. FULL NAME VALIDATION ---');
  assert(nameSchema.safeParse('Chithanya Reddy').success, 'Accepts standard human name');
  assert(nameSchema.safeParse("Mary-Jane O'Connor").success, 'Accepts hyphenated and apostrophe names');
  
  const numName = nameSchema.safeParse('John123');
  assert(!numName.success, 'Rejects names containing numbers');
  assert(getFirstZodError(numName.error) === 'Please enter a valid name using letters and spaces.', 'Number rejection message is user-friendly');

  const symName = nameSchema.safeParse('User@#$%');
  assert(!symName.success, 'Rejects names containing special symbols');
  assert(getFirstZodError(symName.error) === 'Please enter a valid name using letters and spaces.', 'Symbol rejection message is user-friendly');

  // 2. Email Tests
  console.log('\n--- 2. EMAIL ADDRESS VALIDATION ---');
  assert(emailSchema.safeParse('chithanya@example.com').success, 'Accepts valid email');
  assert(!emailSchema.safeParse('invalid-email').success, 'Rejects email without @ or domain');
  assert(!emailSchema.safeParse('user@.com').success, 'Rejects email with missing domain name');

  // 3. Indian Mobile Number Tests
  console.log('\n--- 3. INDIAN MOBILE NUMBER VALIDATION ---');
  assert(normalizeIndianMobile('90635 34530') === '+919063534530', 'Normalizes 10-digit spaced Indian mobile');
  assert(normalizeIndianMobile('+91 90635 34530') === '+919063534530', 'Normalizes +91 prefixed Indian mobile');
  assert(normalizeIndianMobile('09063534530') === '+919063534530', 'Normalizes 0-prefixed Indian mobile');
  assert(normalizeIndianMobile('5000000000') === null, 'Rejects mobile not starting with 6, 7, 8, or 9');
  assert(normalizeIndianMobile('12345') === null, 'Rejects short mobile number');

  // 4. Password Security Checklist Tests
  console.log('\n--- 4. PASSWORD REQUIREMENTS & LIVE CHECKLIST ---');
  const weakCheck = evaluatePasswordRequirements('short');
  assert(!weakCheck.isAllMet && !weakCheck.minLength, 'Detects password shorter than 8 chars');

  const noUpper = evaluatePasswordRequirements('password@123');
  assert(!noUpper.isAllMet && !noUpper.hasUppercase, 'Detects missing uppercase letter');

  const noLower = evaluatePasswordRequirements('PASSWORD@123');
  assert(!noLower.isAllMet && !noLower.hasLowercase, 'Detects missing lowercase letter');

  const noNum = evaluatePasswordRequirements('Password@abc');
  assert(!noNum.isAllMet && !noNum.hasNumber, 'Detects missing number');

  const noSpecial = evaluatePasswordRequirements('Password123');
  assert(!noSpecial.isAllMet && !noSpecial.hasSpecialChar, 'Detects missing special character');

  const strongCheck = evaluatePasswordRequirements('Password@123');
  assert(strongCheck.isAllMet, 'Passes when all 5 requirements are met');

  // 5. Sign Up Schema & Password Matching
  console.log('\n--- 5. SIGN UP FORM & PASSWORD MATCHING ---');
  const validSignUp = signUpSchema.safeParse({
    fullName: 'Chithanya Reddy',
    email: 'chithanya@example.com',
    mobileNumber: '90635 34530',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    rememberMe: true,
  });
  assert(validSignUp.success, 'Accepts complete valid Sign Up input');

  const mismatchSignUp = signUpSchema.safeParse({
    fullName: 'Chithanya Reddy',
    email: 'chithanya@example.com',
    mobileNumber: '90635 34530',
    password: 'Password@123',
    confirmPassword: 'DifferentPassword@123',
    rememberMe: true,
  });
  assert(!mismatchSignUp.success, 'Rejects when confirmPassword does not match');
  assert(getFirstZodError(mismatchSignUp.error) === 'Passwords do not match.', 'Displays exact password mismatch error');

  // 6. Supabase Live Connection & Phone Provider Status Test
  console.log('\n--- 6. SUPABASE CONNECTION & PHONE AUTH BEHAVIOR ---');
  const supabase = createClient(
    'https://ngqvqmhjooowoxlmwfun.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXZxbWhqb29vd294bG13ZnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODc2MjEsImV4cCI6MjEwNjE2MzYyMX0._bzwHFqScIGiUp2yULYzCsKcjeEqwaaerbvm_1Mu1es'
  );

  const phoneRes = await supabase.auth.signInWithOtp({ phone: '+919063534530' });
  const isPhoneDisabled =
    phoneRes.error &&
    (phoneRes.error.message.includes('Unsupported phone provider') ||
     phoneRes.error.code === 'phone_provider_disabled');

  assert(isPhoneDisabled, 'Properly detects unconfigured Supabase phone provider (no fake OTP)');

  console.log('\n========================================================');
  console.log(`TOTAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) process.exit(1);
}

runTests();
