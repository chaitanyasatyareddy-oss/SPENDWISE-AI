# SpendWise AI 💰🚀
> *"Understand your spending. Plan your future."*

SpendWise AI is an intelligent full-stack personal finance and wealth management platform powered by **Google AI Studio (Gemini 1.5)** and **Supabase (PostgreSQL with Row-Level Security)**.

---

## ✨ Key Features

- 🤖 **Multilingual AI Financial Coach**: Interactive conversational AI coach supporting **18 languages** (Telugu, Hindi, Tamil, Arabic with RTL, Urdu with RTL, Spanish, French, Japanese, and more) with intelligent code-switching and contextual financial advice.
- 📸 **Multimodal OCR & UPI Scanner**: Upload receipts, invoices, or UPI payment screenshots to automatically extract merchant, date, amount, category, and itemized breakdowns via Gemini Vision.
- 🛡️ **Multi-Tenant Security with Supabase RLS**: PostgreSQL database with strict Row-Level Security across 12 tables ensuring complete data isolation and privacy.
- 🎨 **Adaptive Modern Theme**: Dynamic Light, Dark, and System theme controller with fluid CSS transitions.
- 📊 **Smart Financial Analytics**: Real-time spending velocity gauges, anomaly detection (Z-score analysis), runway forecasting, and category breakdowns.
- 🎯 **Goals & Budgets**: Track savings targets with interactive contribution sliders and category budget limits.
- 👥 **Shared Expense Groups**: Split bills equally, by exact amount, or percentage with real-time balance calculations.
- 🔄 **Subscriptions & Bills Tracker**: Track recurring services and debt bills with smart payment toggles.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend & Database**: Supabase (PostgreSQL, Row-Level Security, Auth)
- **AI & Computer Vision**: Google AI Studio Gemini API (`@google/generative-ai`)
- **State Management & Offline**: React Context API + Resilient LocalDB fallback

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/chaitanyasatyareddy-oss/SPENDWISE-AI.git
cd SPENDWISE-AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys in `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
GEMINI_API_KEY=your_gemini_api_key

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Execute the consolidated schema in your Supabase SQL Editor:
- [`supabase/spendwise_complete_schema.sql`](supabase/spendwise_complete_schema.sql)

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

---

## 🧪 Verification & Tests

Run the automated test pipelines:
```bash
node scripts/verify_rls.cjs           # Database RLS & constraints audit (22 tests)
node scripts/verify_auth_i18n_theme.cjs # Auth, i18n & Theme controller tests (23 tests)
node scripts/verify_gemini_key.cjs    # Google AI Studio Gemini connection tests (11 tests)
node scripts/verify_live_supabase.cjs # Live Supabase cloud table verification (12 tables)
```

---

## 📄 License
MIT
