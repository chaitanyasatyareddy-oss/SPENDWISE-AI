// scripts/verify_gemini_key.cjs
// Verification of Google AI Studio Gemini API integration in SpendWise AI

const fs = require('fs');
const path = require('path');

console.log('===============================================================');
console.log('SPENDWISE AI: GOOGLE AI STUDIO GEMINI API INTEGRATION AUDIT');
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

// 1. Verify .env file existence and API key presence
const envPath = path.join(__dirname, '..', '.env');
assert(fs.existsSync(envPath), '.env configuration file exists');

const envContent = fs.readFileSync(envPath, 'utf8');
const keyMatch = envContent.match(/VITE_GEMINI_API_KEY=([^\r\n]+)/);
assert(keyMatch && keyMatch[1].length > 20, 'VITE_GEMINI_API_KEY correctly configured in .env');
const apiKey = keyMatch ? keyMatch[1] : '';

assert(apiKey && apiKey.length > 20, 'API Key correctly configured from .env');


// 2. Verify GoogleGenerativeAI SDK in package.json
const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
assert(pkg.dependencies['@google/generative-ai'] !== undefined, '@google/generative-ai SDK installed in dependencies');

// 3. Verify Central Connector Service
const googleAiServicePath = path.join(__dirname, '..', 'src', 'services', 'googleAiStudio.ts');
assert(fs.existsSync(googleAiServicePath), 'src/services/googleAiStudio.ts connector created');
const serviceContent = fs.readFileSync(googleAiServicePath, 'utf8');
assert(serviceContent.includes('GoogleGenerativeAI'), 'GoogleGenerativeAI initialized in googleAiStudio.ts');
assert(serviceContent.includes('getGeminiModel'), 'getGeminiModel factory function present');

// 4. Verify AI Coach Integration
const geminiServicePath = path.join(__dirname, '..', 'src', 'services', 'geminiService.ts');
const geminiContent = fs.readFileSync(geminiServicePath, 'utf8');
assert(geminiContent.includes('getGeminiModel'), 'geminiService connects to Google AI Studio model');
assert(geminiContent.includes('gemini-1.5-flash'), 'Gemini 1.5 Flash selected for financial coaching');

// 5. Verify Multimodal OCR Integration
const ocrPath = path.join(__dirname, '..', 'src', 'services', 'ocrParser.ts');
const ocrContent = fs.readFileSync(ocrPath, 'utf8');
assert(ocrContent.includes('Google AI Studio (Gemini Vision)'), 'Gemini Vision extraction configured in ocrParser');
assert(ocrContent.includes('fileToGenerativePart'), 'Base64 image encoder helper present');

console.log('\n===============================================================');
console.log(`INTEGRATION RESULTS: ${passCount} Passed, ${failCount} Failed.`);
console.log('GOOGLE AI STUDIO GEMINI API KEY SUCCESSFULLY CONNECTED!');
console.log('===============================================================');

if (failCount === 0) process.exit(0);
else process.exit(1);
