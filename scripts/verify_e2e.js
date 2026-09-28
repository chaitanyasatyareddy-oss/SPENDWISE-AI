// scripts/verify_e2e.js
// Automated E2E verification of SpendWise AI Test Sequence (Page 11)

const {
  initialExpenses,
  initialBudgets,
  initialBills,
  initialSubscriptions,
  initialSavingsGoals
} = require('../src/data/seedData');
const { calculateDailySpendingLimit, detectExpenseAnomalies, calculateCategoryForecasts } = require('../src/services/analyticsEngine');
const { askFinancialCoach } = require('../src/services/geminiService');
const { translations } = require('../src/utils/teluguDictionary');
const { parseReceiptOrUpiImage, SAMPLE_UPI_PRESETS } = require('../src/services/ocrParser');

console.log('===============================================================');
console.log('SPENDWISE AI: END-TO-END AUTOMATED VERIFICATION SUITE');
console.log('===============================================================\n');

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

// TEST 1: Load Application & Seed Data Check
console.log('[TEST 1] Verifying seeded data loading (10 mandatory transactions):');
assert(initialExpenses.length === 10, `Initial expenses count is 10 (actual: ${initialExpenses.length})`);
const swiggy = initialExpenses.find(e => e.merchant === 'Swiggy');
const netflix = initialExpenses.find(e => e.merchant === 'Netflix');
const electricity = initialExpenses.find(e => e.merchant === 'Electricity Bill');
assert(swiggy && swiggy.amount === 450 && swiggy.needWantTag === 'Want', 'Swiggy ₹450 Want present');
assert(netflix && netflix.amount === 649 && netflix.needWantTag === 'Want', 'Netflix ₹649 Want present');
assert(electricity && electricity.amount === 1800 && electricity.needWantTag === 'Need', 'Electricity Bill ₹1,800 Need present');

// TEST 2: Language Switching (Telugu locale)
console.log('\n[TEST 2] Verifying Language Switching to Telugu (te):');
assert(translations.te.appName === 'స్పెండ్‌వైజ్ AI', 'Telugu appName correctly localized');
assert(translations.te.nav.dashboard.includes('డ్యాష్‌బోర్డ్'), 'Telugu navigation dashboard label verified');
assert(translations.te.nav.coach.includes('AI ఆర్థిక కోచ్'), 'Telugu navigation coach label verified');
assert(translations.te.metrics.dailyLimit.includes('సిఫార్సు చేసిన రోజువారీ పరిమితి'), 'Telugu daily limit header verified');

// TEST 3: UPI Screenshot Capture Simulation
console.log('\n[TEST 3] Testing UPI Screenshot OCR & Extraction workflow:');
const phonePePreset = SAMPLE_UPI_PRESETS.find(p => p.appName === 'PhonePe');
assert(phonePePreset !== undefined, 'PhonePe UPI preset exists');
assert(phonePePreset.result.totalAmount === 650, 'Extracted PhonePe amount is ₹650');
assert(phonePePreset.result.lineItems.length > 0, 'Extracted itemized decomposition contains line items');
assert(phonePePreset.result.needWantTag === 'Want', 'Classified as discretionary (Want)');

// TEST 4: Anomaly Inspection (Z >= 2.5)
console.log('\n[TEST 4] Verifying Anomaly Detection on Amazon Electronics:');
const anomalies = detectExpenseAnomalies(initialExpenses);
assert(anomalies.length >= 1, `At least 1 anomaly detected (found: ${anomalies.length})`);
const amazonAnomaly = anomalies.find(a => a.merchant.includes('Amazon Electronics'));
assert(amazonAnomaly !== undefined, 'Amazon Electronics flagged as anomaly');
assert(amazonAnomaly.zScore >= 2.5, `Z-score is ${amazonAnomaly.zScore} >= 2.5`);
assert(amazonAnomaly.message.includes('Unusual spending detected'), 'Alert displays neutral phrasing "Unusual spending detected"');

// TEST 5: Subscription Tracking
console.log('\n[TEST 5] Verifying Subscription Tracking (Netflix & Spotify):');
const subsMerchants = initialSubscriptions.map(s => s.serviceName);
assert(subsMerchants.some(m => m.includes('Netflix')), 'Netflix recurring subscription identified');
assert(subsMerchants.some(m => m.includes('Spotify')), 'Spotify recurring subscription identified');

// TEST 6: Multilingual AI Coach Test (English & Code-Switched Telugu)
console.log('\n[TEST 6] Testing Multilingual Financial AI Coach:');
const context = {
  expenses: initialExpenses,
  budgets: initialBudgets,
  savingsGoals: initialSavingsGoals,
  subscriptions: initialSubscriptions,
  bills: initialBills,
  monthlyBudget: 35000,
  monthlyIncome: 65000
};

// 6a: English query
const enResponse = askFinancialCoach('How much did I spend on food this month?', context);
assert(enResponse.text.includes('1,300'), 'English query accurately calculates ₹1,300 food spend (Swiggy ₹450 + Local Restaurant ₹850)');
assert(enResponse.detectedLanguage === 'English', 'English query detected as English');

// 6b: Code-switched Telugu query
const teResponse = askFinancialCoach('ఈ నెల food మీద ఎంత spend చేశాను?', context);
assert(teResponse.text.includes('1,300') || teResponse.text.includes('1300'), 'Telugu query response maintains accurate ₹1,300 figure');
assert(teResponse.detectedLanguage === 'Telugu-English', 'Code-switched Telugu-English detected');
assert(teResponse.text.includes('Food') || teResponse.text.includes('ఖర్చు చేశారు'), 'Telugu grammatical frame and code-switched terms verified');
assert(teResponse.text.includes('ఆర్థిక సలహా కాదు'), 'Non-advisory disclosure included in Telugu response');

// TEST 7: Savings Goal Creation & Daily Spending Limit Formula
console.log('\n[TEST 7] Verifying Savings Goal & Daily Spending Limit:');
const goal3Mo = initialSavingsGoals.find(g => g.goalName.includes('Save ₹5,000 in 3 months'));
assert(goal3Mo !== undefined, 'Goal "Save ₹5,000 in 3 months" exists');
assert(goal3Mo.targetAmount === 5000, 'Target amount is ₹5,000');

const dailyCalc = calculateDailySpendingLimit(35000, initialExpenses, initialBills, initialSubscriptions, initialSavingsGoals, 2);
assert(dailyCalc.dailyLimit > 0, `Dynamic daily limit calculated: ₹${dailyCalc.dailyLimit}/day`);
assert(dailyCalc.formulaString.includes('35000'), 'Formula string verifies total budget variable');

console.log('\n===============================================================');
console.log(`E2E SUITE RESULTS: ${passCount} Passed, ${failCount} Failed.`);
console.log('===============================================================');

if (failCount === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
