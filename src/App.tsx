import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { MetricCards } from './components/Dashboard/MetricCards';
import { HealthGauge } from './components/Dashboard/HealthGauge';
import { SpendingTrendChart } from './components/Dashboard/SpendingTrendChart';
import { CategoryDonutChart } from './components/Dashboard/CategoryDonutChart';
import { RecentTransactionsList } from './components/Dashboard/RecentTransactionsList';
import { ExpenseFormModal } from './components/MultimodalCapture/ExpenseFormModal';
import { UpiReceiptDropzone } from './components/MultimodalCapture/UpiReceiptDropzone';
import { VoiceEntryDialog } from './components/MultimodalCapture/VoiceEntryDialog';
import { AnomalyAlertBanner } from './components/Intelligence/AnomalyAlertBanner';
import { ForecastingCard } from './components/Intelligence/ForecastingCard';
import { SubscriptionsManager } from './components/Intelligence/SubscriptionsManager';
import { MultilingualCoachChat } from './components/AICoach/MultilingualCoachChat';
import { GroupLedgerView } from './components/SharedGroup/GroupLedgerView';
import { CurrencyConverter } from './components/MultiCurrency/CurrencyConverter';
import { CsvStatementImporter } from './components/StatementImport/CsvStatementImporter';
import { SavingsGoalsManager } from './components/SavingsGoals/SavingsGoalsManager';
import { LoginScreen } from './components/Auth/LoginScreen';
import { UsernameOnboardingModal } from './components/Auth/UsernameOnboardingModal';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // 1. FIRST SCREEN: If user is not authenticated, render dedicated Login/Signup Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
        {/* Clean, Full-Width Top Bar for Login */}
        <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="SpendWise Logo"
              className="w-8 h-8 rounded-xl object-cover shadow-md shadow-indigo-500/20 ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.appName}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Cloud v2.1
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </header>

        {/* Centered Login Hero & Form */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <LoginScreen />
        </main>

        {/* Minimalist Footer */}
        <footer className="w-full py-4 text-center border-t border-slate-200 dark:border-slate-800/60 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Spend Wise AI. Track • Analyze • Save Your Money.</p>
        </footer>
      </div>
    );
  }

  // 2. SECOND SCREEN: Authenticated state — Full modern web interface
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Application Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Full-Width Responsive Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <MetricCards />
            <AnomalyAlertBanner />
            <HealthGauge />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingTrendChart />
              <CategoryDonutChart />
            </div>
            <RecentTransactionsList />
          </div>
        )}

        {/* TAB 2: ANALYTICS & FORECASTING */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AnomalyAlertBanner />
            <ForecastingCard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SpendingTrendChart />
              <CategoryDonutChart />
            </div>
          </div>
        )}

        {/* TAB 3: MULTIMODAL CAPTURE */}
        {activeTab === 'capture' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <UpiReceiptDropzone />
            <VoiceEntryDialog />
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-none transition-colors">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Manual Transaction Entry
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Standard form with dynamic Z-score thresholding & need/want categorization
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              >
                Open Manual Form
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: MULTILINGUAL AI COACH */}
        {activeTab === 'coach' && (
          <div className="animate-in fade-in duration-200">
            <MultilingualCoachChat />
          </div>
        )}

        {/* TAB 5: SUBSCRIPTIONS & BILLS */}
        {activeTab === 'subscriptions' && (
          <div className="animate-in fade-in duration-200">
            <SubscriptionsManager />
          </div>
        )}

        {/* TAB 6: SHARED GROUP LEDGER */}
        {activeTab === 'shared' && (
          <div className="animate-in fade-in duration-200">
            <GroupLedgerView />
          </div>
        )}

        {/* TAB 7: SAVINGS GOALS */}
        {activeTab === 'goals' && (
          <div className="animate-in fade-in duration-200">
            <SavingsGoalsManager />
          </div>
        )}

        {/* TAB 8: CSV IMPORT & MULTI-CURRENCY */}
        {activeTab === 'import' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CsvStatementImporter />
            <CurrencyConverter />
          </div>
        )}
      </main>

      {/* Manual Entry Modal */}
      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Graceful Username Onboarding Modal */}
      <UsernameOnboardingModal />

      {/* Modern Responsive Footer */}
      <footer className="w-full py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 bg-white/50 dark:bg-slate-900/50">
        <p>© {new Date().getFullYear()} SpendWise AI. Understand your spending. Plan your future.</p>
      </footer>
    </div>
  );
};
