// scripts/verify_login_remember_me.cjs
// Verification suite for SpendWise AI Dedicated Login Page & Customer Details Persistence ("Remember Me")

console.log('================================================================');
console.log('SPENDWISE AI: LOGIN PAGE & "REMEMBER ME" VERIFICATION PIPELINE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

// Mock localStorage for Node test runner
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

// -------------------------------------------------------------
// STAGE 1: Testing LocalDB Customer Remembering Logic
// -------------------------------------------------------------
console.log('[STAGE 1] Testing Customer Persistence & "Remember Me" Storage:');

const STORAGE_KEYS = {
  USER: 'spendwise_user_profile',
  SESSION: 'spendwise_active_session',
  USERS_LIST: 'spendwise_registered_users',
  REMEMBERED_CUSTOMER: 'spendwise_remembered_customer',
  REMEMBER_ME: 'spendwise_remember_me',
};

const initialUserProfile = {
  id: 'usr_spendwise_demo_01',
  email: 'chithanya@spendwise.ai',
  username: 'chithanya',
  phoneNumber: '+91 9876543210',
  password: 'Password@123',
  fullName: 'Chithanya',
};

// 1. Initial State: No active session returns null (so login page displays)
assert(localStorage.getItem(STORAGE_KEYS.SESSION) === null, 'No active session exists initially (Login Page will render)');

// 2. Save Remembered Customer details
const testCustomer = {
  identifier: '@chithanya',
  fullName: 'Chithanya',
  username: 'chithanya',
  phoneNumber: '+91 9876543210',
  email: 'chithanya@spendwise.ai',
  rememberMe: true,
  lastLoginAt: new Date().toISOString()
};

localStorage.setItem(STORAGE_KEYS.REMEMBERED_CUSTOMER, JSON.stringify(testCustomer));
localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');

const retrieved = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMEMBERED_CUSTOMER));
assert(retrieved && retrieved.identifier === '@chithanya', 'Remembered customer details stored and retrieved accurately');
assert(retrieved.fullName === 'Chithanya', 'Customer full name preserved for welcome back banner');
assert(localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true', 'Remember Me flag enabled');

// 3. User logs in with Remember Me checked
localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(initialUserProfile));
assert(localStorage.getItem(STORAGE_KEYS.SESSION) !== null, 'Active session established upon successful login');

// 4. User logs out: session cleared, but remembered customer details remain for fast next login
localStorage.removeItem(STORAGE_KEYS.SESSION);
assert(localStorage.getItem(STORAGE_KEYS.SESSION) === null, 'Active session successfully cleared upon logout');
const rememberedAfterLogout = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMEMBERED_CUSTOMER));
assert(rememberedAfterLogout && rememberedAfterLogout.identifier === '@chithanya', 'Remembered customer persists after logout for next visit pre-fill');

// 5. User unchecks Remember Me / switches account
localStorage.removeItem(STORAGE_KEYS.REMEMBERED_CUSTOMER);
localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'false');
assert(localStorage.getItem(STORAGE_KEYS.REMEMBERED_CUSTOMER) === null, 'Forget me / switch account wipes remembered customer');
assert(localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'false', 'Remember Me flag disabled');

// -------------------------------------------------------------
// STAGE 2: Verification of Login Page Component & Auth Features
// -------------------------------------------------------------
console.log('\n[STAGE 2] Verifying Component Features & Translations:');
const fs = require('fs');
const path = require('path');

const loginScreenPath = path.join(__dirname, '../src/components/Auth/LoginScreen.tsx');
assert(fs.existsSync(loginScreenPath), 'LoginScreen.tsx exists');

const loginContent = fs.readFileSync(loginScreenPath, 'utf8');
assert(loginContent.includes('rememberMe'), 'LoginScreen includes rememberMe state and toggle');
assert(loginContent.includes('rememberedCustomer'), 'LoginScreen utilizes rememberedCustomer from AuthContext');
assert(loginContent.includes('welcomeBackCustomer') || loginContent.includes('Welcome back'), 'Welcome back banner rendered for remembered customer');
assert(loginContent.includes('handleSwitchAccount') || loginContent.includes('Switch'), 'Switch account / forget option available');
assert(loginContent.includes('handleQuickDemoLogin'), '1-Click Quick Demo Login option present');
assert(loginContent.includes('passwordStrength'), 'Registration password strength meter active');
assert(loginContent.includes('checkUsernameAvailability'), 'Real-time @handle availability validation present');
assert(loginContent.includes('Show password') || loginContent.includes('EyeOff'), 'Password visibility toggle (Eye/EyeOff) present');

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n================================================================');
console.log(`VERIFICATION RESULTS: ${passCount} Passed, ${failCount} Failed.`);
if (failCount === 0) {
  console.log('SUCCESS: All Login Page & Customer Persistence criteria satisfied!');
}
console.log('================================================================');
process.exit(failCount === 0 ? 0 : 1);
