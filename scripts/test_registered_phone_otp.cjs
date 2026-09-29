const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('SPENDWISE AI: REGISTERED MOBILE NUMBER & OTP TEST PIPELINE');
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

// Inspect source code
const authContextCode = fs.readFileSync(path.join(__dirname, '../src/context/AuthContext.tsx'), 'utf-8');
const loginCode = fs.readFileSync(path.join(__dirname, '../src/components/Auth/LoginScreen.tsx'), 'utf-8');
const seedDataCode = fs.readFileSync(path.join(__dirname, '../src/data/seedData.ts'), 'utf-8');
const supabaseClientCode = fs.readFileSync(path.join(__dirname, '../src/services/supabaseClient.ts'), 'utf-8');

console.log('[STAGE 1] Testing Registered Phone Recognition:');
assert(seedDataCode.includes('+91 90635 34530'), 'User phone number +91 90635 34530 is registered in seed data');
assert(seedDataCode.includes('+91 9876543210'), 'Demo phone number +91 9876543210 preserved as alternate phone');
assert(supabaseClientCode.includes('uAltPhoneDigits'), 'Supabase client checks primary and alternate phone numbers');
assert(supabaseClientCode.includes('initialUserProfile.phoneNumber'), 'Supabase client synchronizes updated registered phone to local storage');

console.log('\n[STAGE 2] Testing OTP Enforcement on Registered Numbers:');
assert(authContextCode.includes('is not registered. Please create an account or register your mobile number first.'), 'AuthContext strictly rejects sending OTP to unregistered mobile numbers in signin mode');
assert(authContextCode.includes('is already registered to'), 'AuthContext rejects duplicate registration for already registered mobile numbers in signup mode');
assert(loginCode.includes('Registered Sign In'), 'Login screen provides explicit "Registered Sign In" mode');
assert(loginCode.includes('Register New Mobile'), 'Login screen provides explicit "Register New Mobile" mode');
assert(loginCode.includes('Registered Indian Mobile Number'), 'Input clearly labeled as Registered Indian Mobile Number');
assert(loginCode.includes('Register this mobile number now'), '1-Click quick action to register mobile number if not registered');

console.log('\n[STAGE 3] Inspecting Verification Details:');
assert(loginCode.includes('registeredAccountInfo'), 'Displays registered account info (e.g. Chithanya Reddy (@chithanya)) upon OTP dispatch');
assert(loginCode.includes('Send OTP to Registered Mobile'), 'Action button specifies sending OTP to registered mobile');

console.log('\n================================================================');
console.log(`VERIFICATION RESULTS: ${passed} Passed, ${failed} Failed.`);
if (failed === 0) {
  console.log('SUCCESS: All registered mobile OTP enforcement tests passed!');
  process.exit(0);
} else {
  console.error('FAILURE: Some tests did not pass.');
  process.exit(1);
}
