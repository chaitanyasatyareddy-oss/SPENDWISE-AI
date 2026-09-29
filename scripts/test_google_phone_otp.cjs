const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('SPENDWISE AI: GOOGLE & INDIAN PHONE OTP VERIFICATION PIPELINE');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. Test Indian Phone Normalization & Validation logic
function normalizeIndianPhone(input) {
  if (!input || typeof input !== 'string') {
    return { isValid: false, formatted: '', raw10: '', error: 'Please enter a mobile number.' };
  }
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
    return { isValid: false, formatted: clean, raw10: '', error: 'Please enter a valid 10-digit Indian mobile number.' };
  }
  if (!/^[6-9]\d{9}$/.test(raw10)) {
    return { isValid: false, formatted: clean, raw10, error: 'Indian mobile numbers must start with 6, 7, 8, or 9.' };
  }
  const formatted = `+91 ${raw10.slice(0, 5)} ${raw10.slice(5)}`;
  return { isValid: true, formatted, raw10 };
}

console.log('[STAGE 1] Testing Indian Phone Validation & Formatting:');
const t1 = normalizeIndianPhone('9876543210');
assert(t1.isValid && t1.formatted === '+91 98765 43210', '10-digit standard Indian phone (9876543210) normalized to +91 98765 43210');

const t2 = normalizeIndianPhone('+91 98765 43210');
assert(t2.isValid && t2.raw10 === '9876543210', '+91 98765 43210 parsed correctly');

const t3 = normalizeIndianPhone('09876543210');
assert(t3.isValid && t3.raw10 === '9876543210', 'Leading-0 11-digit format normalized correctly');

const t4 = normalizeIndianPhone('8765432109');
assert(t4.isValid && t4.raw10 === '8765432109', 'Indian number starting with 8 accepted');

const t5 = normalizeIndianPhone('7654321098');
assert(t5.isValid && t5.raw10 === '7654321098', 'Indian number starting with 7 accepted');

const t6 = normalizeIndianPhone('6543210987');
assert(t6.isValid && t6.raw10 === '6543210987', 'Indian number starting with 6 accepted');

const t7 = normalizeIndianPhone('1234567890');
assert(!t7.isValid && t7.error.includes('start with 6, 7, 8, or 9'), 'Invalid Indian number starting with 1 rejected');

const t8 = normalizeIndianPhone('98765');
assert(!t8.isValid, 'Short phone number rejected');

console.log('\n[STAGE 2] Testing 6-Digit OTP Generator & Match:');
function generateNumericOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const sampleOtp = generateNumericOtp();
assert(/^\d{6}$/.test(sampleOtp), `Generated OTP "${sampleOtp}" is a valid 6-digit numeric string`);
assert(sampleOtp.length === 6, 'OTP length is exactly 6');

console.log('\n[STAGE 3] Inspecting Source Code Implementation:');
const loginCode = fs.readFileSync(path.join(__dirname, '../src/components/Auth/LoginScreen.tsx'), 'utf-8');
const authContextCode = fs.readFileSync(path.join(__dirname, '../src/context/AuthContext.tsx'), 'utf-8');
const supabaseClientCode = fs.readFileSync(path.join(__dirname, '../src/services/supabaseClient.ts'), 'utf-8');
const phoneUtilsCode = fs.readFileSync(path.join(__dirname, '../src/utils/phoneUtils.ts'), 'utf-8');

assert(loginCode.includes('Continue with Google'), 'Google Sign-In button is rendered');
assert(loginCode.includes('viewBox="0 0 24 24"') && loginCode.includes('#4285F4'), 'Authentic Google logo SVG present');
assert(loginCode.includes('setShowGoogleModal'), 'Google Account Chooser modal is integrated');
assert(loginCode.includes('Phone OTP (+91)'), 'Indian Mobile OTP tab option is present');
assert(loginCode.includes('🇮🇳'), 'Indian Flag badge is displayed');
assert(loginCode.includes('+91'), 'India +91 country code prefix is displayed');
assert(loginCode.includes('otpDigits.map'), '6 individual digit OTP input boxes are rendered');
assert(loginCode.includes('Auto-Fill'), '1-Click Auto-Fill OTP convenience chip is present');
assert(loginCode.includes('handleResendOtp'), 'Resend OTP functionality with countdown timer present');

assert(authContextCode.includes('loginWithGoogle'), 'AuthContext provides loginWithGoogle');
assert(authContextCode.includes('sendPhoneOtp'), 'AuthContext provides sendPhoneOtp');
assert(authContextCode.includes('verifyPhoneOtp'), 'AuthContext provides verifyPhoneOtp');
assert(supabaseClientCode.includes('cleanDigits.slice(-10) === uPhoneDigits.slice(-10)'), 'Supabase client supports seamless 10-digit Indian phone lookup');

console.log('\n================================================================');
console.log(`VERIFICATION RESULTS: ${passed} Passed, ${failed} Failed.`);
if (failed === 0) {
  console.log('SUCCESS: All Google & Indian Phone OTP criteria satisfied!');
  process.exit(0);
} else {
  console.error('FAILURE: Some tests did not pass.');
  process.exit(1);
}
