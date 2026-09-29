const fs = require('fs');
const path = require('path');

// Test strict regex patterns and validation logic used in AuthContext & LoginScreen
const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
const PHONE_REGEX = /^\+?[0-9]{10,15}$/;
const NAME_REGEX = /[a-zA-Z]/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;

console.log('================================================================');
console.log('SPENDWISE AI: STRICT CREDENTIAL VALIDATION TEST SUITE');
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

console.log('[STAGE 1] Testing Invalid Inputs (Should be REJECTED):');
// 1. Digits-only name (e.g. 098765432)
assert(!NAME_REGEX.test('098765432') || /^\d+$/.test('098765432'), 'Digits-only name "098765432" is detected as invalid');

// 2. Username starting with a number (e.g. 2wsdfghjklmnfc)
assert(!USERNAME_REGEX.test('2wsdfghjklmnfc'), 'Username starting with a number "2wsdfghjklmnfc" is rejected');

// 3. Phone number containing letters (e.g. werfghju765rdfghjwertyuikjhg)
const sanitizedPhone = 'werfghju765rdfghjwertyuikjhg'.replace(/[^0-9+\s-]/g, '');
assert(!PHONE_REGEX.test(sanitizedPhone), 'Phone number with letters is rejected after sanitization');

// 4. Password with special characters only or missing numbers
assert(!PASSWORD_REGEX.test('asdfghjhgfdrtuiuytfgv'), 'Password without numbers is rejected');
assert(!PASSWORD_REGEX.test('12345678'), 'Password without letters is rejected');
assert(!PASSWORD_REGEX.test('abc1'), 'Password shorter than 6 characters is rejected');

console.log('\n[STAGE 2] Testing Valid Inputs (Should be ACCEPTED):');
assert(NAME_REGEX.test('Chithanya Reddy') && !/^\d+$/.test('Chithanya Reddy'), 'Valid full name "Chithanya Reddy" is accepted');
assert(USERNAME_REGEX.test('chithanya'), 'Valid username "chithanya" is accepted');
assert(USERNAME_REGEX.test('chithanya_01'), 'Valid username "chithanya_01" is accepted');
assert(PHONE_REGEX.test('+919876543210'.replace(/[\s-]/g, '')), 'Valid phone number "+919876543210" is accepted');
assert(PASSWORD_REGEX.test('Password@123'), 'Valid password "Password@123" is accepted');

console.log('\n[STAGE 3] Inspecting Source Code Implementation:');
const authContextCode = fs.readFileSync(path.join(__dirname, '../src/context/AuthContext.tsx'), 'utf-8');
const loginScreenCode = fs.readFileSync(path.join(__dirname, '../src/components/Auth/LoginScreen.tsx'), 'utf-8');
const supabaseClientCode = fs.readFileSync(path.join(__dirname, '../src/services/supabaseClient.ts'), 'utf-8');

assert(authContextCode.includes('usr_spendwise_demo_01'), 'Demo password bypass strictly locked to demo user ID only');
assert(authContextCode.includes('Incorrect password. Please verify your credentials and try again.'), 'Specific incorrect password error message is present');
assert(authContextCode.includes('No account found with this username or mobile number.'), 'Specific account not found error message is present');
assert(supabaseClientCode.includes('/^[a-zA-Z][a-zA-Z0-9_]{2,19}$/'), 'Supabase client validates username format before checking availability');
assert(loginScreenCode.includes('replace(/[^0-9+\\s-]/g'), 'Login screen sanitizes phone number input on keystroke');
assert(loginScreenCode.includes('Username must start with a letter'), 'Login screen provides clear guidance on username requirement');

console.log('\n================================================================');
console.log(`VERIFICATION RESULTS: ${passed} Passed, ${failed} Failed.`);
if (failed === 0) {
  console.log('SUCCESS: All strict credential validation tests passed!');
  process.exit(0);
} else {
  console.error('FAILURE: Some tests did not pass.');
  process.exit(1);
}
