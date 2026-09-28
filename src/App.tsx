import React, { useState } from 'react';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
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
import { AuthHeader } from './components/Auth/AuthHeader';
import { UsernameOnboardingModal } from './components/Auth/UsernameOnboardingModal';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';

export const AppContent: React.FC = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  // If user is not authenticated, render Login/Signup Screen
  if (!isAuthenticated) {
    return (
      <MobileFrameWrapper
        isMobileView={isMobileView}
        onToggleView={(val) => setIsMobileView(val)}
      >
        <AuthHeader
          isMobileView={isMobileView}
          onToggleView={(val) => setIsMobileView(val)}
        />
        <div className="flex-1 flex items-center justify-center p-2">
          <LoginScreen />
        </div>
      </MobileFrameWrapper>
    );
  }

  // Authenticated state: full dashboard and features
  return (
    <MobileFrameWrapper
      isMobileView={isMobileView}
      onToggleView={(val) => setIsMobileView(val)}
    >
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className="p-3 sm:p-5 space-y-5">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <MetricCards />
            <AnomalyAlertBanner />
            <HealthGauge />
            <div className="grid grid-cols-1 gap-5">
              <SpendingTrendChart />
              <CategoryDonutChart />
            </div>
            <RecentTransactionsList />
          </div>
        )}

        {/* TAB 2: ANALYTICS & FORECASTING */}
        {activeTab === 'analytics' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <AnomalyAlertBanner />
            <ForecastingCard />
            <SpendingTrendChart />
            <CategoryDonutChart />
          </div>
        )}

        {/* TAB 3: MULTIMODAL CAPTURE */}
        {activeTab === 'capture' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <UpiReceiptDropzone />
            <VoiceEntryDialog />
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center justify-between shadow-sm dark:shadow-none transition-colors">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Manual Transaction Entry
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Standard form with dynamic Z-score thresholding
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
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
          <div className="space-y-5 animate-in fade-in duration-200">
            <CsvStatementImporter />
            <CurrencyConverter />
          </div>
        )}
      </div>

      {/* Manual Entry Modal */}
      <ExpenseFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Graceful Username Onboarding Modal */}
      <UsernameOnboardingModal />
    </MobileFrameWrapper>
  );
};
