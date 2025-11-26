



import React, { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import Button from './components/ui/Button';
import Home from './components/Home';
import Reports from './components/Reports';
import Login from './components/Login';
import Snackbar from './components/Snackbar';
import UpdateRequiredModal from './components/UpdateRequiredModal';
import MaintenanceMode from './components/MaintenanceMode';
import { useAssessment } from './hooks/useAssessment';
import { useStockInventory } from './hooks/useStockInventory';
import { useAuth } from './hooks/useAuth';
import { useReports } from './hooks/useReports';
import { Page, CompletedReport, AssessmentData, StockInventoryData, AppNotification, AppConfig, AIResponse, User } from './types';
import { useSync } from './hooks/useSync';
import { useInactivityTimer } from './hooks/useInactivityTimer';
import { analyticsService } from './services/analyticsService';
import { appConfigService } from './services/appConfigService';
import Icon from './components/Icon';
import { useTheme } from './hooks/useTheme';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import NewPassword from './components/NewPassword';
import ProfileSetup from './components/ProfileSetup';
import { GameProvider } from './context/GameContext';

// Lazy-loaded components for code-splitting
const Assessments = lazy(() => import('./components/Assessments'));
const AssessmentStepper = lazy(() => import('./components/AssessmentStepper'));
const StockInventoryStepper = lazy(() => import('./components/StockInventoryStepper'));
const AiAssistant = lazy(() => import('./components/AiAssistant'));
const Profile = lazy(() => import('./components/Profile'));
const Glossary = lazy(() => import('./components/Glossary'));
const ConversionTool = lazy(() => import('./components/ConversionTool'));
const PDFViewer = lazy(() => import('./components/PDFViewer'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const OnboardingStepper = lazy(() => import('./components/OnboardingStepper'));
const Tutorials = lazy(() => import('./components/Tutorials'));
const IFCTLibrary = lazy(() => import('./components/IFCTLibrary'));
const Games = lazy(() => import('./components/Games'));
const NotFound = lazy(() => import('./components/NotFound'));

const App: React.FC = () => {
  useTheme(); // Initialize and apply theme on app load
  const { user, login, logout, updateUser, signUp, resetPassword, loading: authLoading } = useAuth();
  const [activePage, setActivePage] = React.useState<Page>('home');
  const [activeAssessment, setActiveAssessment] = React.useState<'24-hour' | 'stock' | null>(null);
  const [selectedReport, setSelectedReport] = React.useState<CompletedReport | null>(null);

  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [snackbar, setSnackbar] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [appConfig, setAppConfig] = React.useState<AppConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = React.useState(true);

  const [onboardingComplete, setOnboardingComplete] = React.useState(() => localStorage.getItem('onboardingComplete') === 'true');
  const [authFlow, setAuthFlow] = React.useState<'landing' | 'login' | 'signup' | 'new-password'>('landing');
  const [oobCode, setOobCode] = React.useState<string>('');

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ message, type });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'read'>) => {
    setNotifications(prev => [{ ...notification, id: crypto.randomUUID(), read: false }, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };


  const { data: assessmentData, updateData: updateAssessmentData, resetAssessment, saveToCloud: saveAssessment, syncStatus: assessmentSyncStatus, lastSynced: assessmentLastSynced } = useAssessment({ addNotification, showSnackbar, userId: user?.uid });
  const { data: stockData, updateData: updateStockData, reset: resetStockData, saveToCloud: saveInventory, syncStatus: stockSyncStatus, lastSynced: stockLastSynced } = useStockInventory({ addNotification, showSnackbar, userId: user?.uid });

  const handleCloudSync = async () => {
    if (user?.uid) {
      await Promise.all([
        saveAssessment(),
        saveInventory()
      ]);
    }
  };

  const { reports, addReport, clearReports, deleteReport, updateReport } = useReports(user?.uid);
  const syncHook = useSync({ addNotification, showSnackbar, onSync: handleCloudSync });
  const { isWarningVisible, stay } = useInactivityTimer({ onLogout: logout });

  React.useEffect(() => {
    analyticsService.init();
    analyticsService.logEvent('app_open', { version: appConfigService.getCurrentVersion() });

    appConfigService.fetchConfig().then(config => {
      setAppConfig(config);
      setIsLoadingConfig(false);
    });

  }, []);

  React.useEffect(() => {
    // Check for reset password link
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const code = params.get('oobCode');

    if (mode === 'resetPassword' && code) {
      setAuthFlow('new-password');
      setOobCode(code);
    }
  }, []);

  const startAssessmentFlow = (type: '24-hour' | 'stock') => {
    analyticsService.logEvent(type === '24-hour' ? 'start_24hr' : 'start_stock', { uid: user?.uid });
    if (type === '24-hour') {
      resetAssessment();
    } else {
      resetStockData();
    }
    setActiveAssessment(type);
    setActivePage('assessment-runner');
  };

  const handleStartAssessment = React.useCallback((type: '24-hour' | 'stock') => {
    // In a real app with onboarding, consent is handled there. This is a fallback.
    startAssessmentFlow(type);
  }, [user]);

  const handleExitAssessment = React.useCallback(() => {
    setActiveAssessment(null);
    setActivePage('assessments');
  }, []);

  const handleFinishAssessment = React.useCallback((
    type: '24-hour' | 'stock',
    data: AssessmentData | StockInventoryData,
    aiResponse?: AIResponse
  ) => {
    const newReport: CompletedReport = {
      id: new Date().toISOString(),
      type: type === '24-hour' ? '24-Hour Recall' : 'Stock Inventory',
      respondentName: data.sectionA.name || 'Unnamed',
      completionDate: new Date().toLocaleDateString(),
      data: data,
      aiResponse: aiResponse,
    };
    addReport(newReport);
    setActiveAssessment(null);
    setActivePage('reports');
    showSnackbar('Assessment submitted successfully!');
    analyticsService.logEvent('submit_assessment', { type, uid: user?.uid, hasAiSummary: !!aiResponse });

    // Simulate async PDF generation
    addNotification({ title: 'Report is being generated...', message: `Your PDF for "${newReport.respondentName}" is processing.` });
    setTimeout(() => {
      setNotifications(prev => prev.map(n => n.title.includes('is being generated') ? {
        ...n,
        title: 'Your report is ready!',
        message: `The PDF for "${newReport.respondentName}" is now available.`,
        action: () => handleViewReport(newReport),
      } : n));
    }, 4000);

  }, [addReport, user]);


  const handleViewReport = (report: CompletedReport) => {
    setSelectedReport(report);
    setActivePage('pdf-viewer');
    analyticsService.logEvent('open_pdf', { assessmentId: report.id });
  }

  const handleEditReport = (report: CompletedReport) => {
    // Load the report data into the appropriate assessment
    if (report.type === '24-Hour Recall') {
      updateAssessmentData('sectionA', (report.data as AssessmentData).sectionA);
      updateAssessmentData('sectionB', (report.data as AssessmentData).sectionB);
      updateAssessmentData('sectionC', (report.data as AssessmentData).sectionC);
      updateAssessmentData('sectionD', (report.data as AssessmentData).sectionD);
      updateAssessmentData('sectionE', (report.data as AssessmentData).sectionE);
      updateAssessmentData('sectionF', (report.data as AssessmentData).sectionF);
      updateAssessmentData('sectionG', (report.data as AssessmentData).sectionG);
      updateAssessmentData('sectionH', (report.data as AssessmentData).sectionH);
      updateAssessmentData('sectionI', (report.data as AssessmentData).sectionI);
      updateAssessmentData('sectionJ', (report.data as AssessmentData).sectionJ);
      setActiveAssessment('24-hour');
    } else {
      updateStockData('sectionA', (report.data as StockInventoryData).sectionA);
      updateStockData('sectionB', (report.data as StockInventoryData).sectionB);
      updateStockData('sectionC', (report.data as StockInventoryData).sectionC);
      updateStockData('sectionD', (report.data as StockInventoryData).sectionD);
      updateStockData('sectionE', (report.data as StockInventoryData).sectionE);
      updateStockData('sectionF', (report.data as StockInventoryData).sectionF);
      updateStockData('sectionG', (report.data as StockInventoryData).sectionG);
      setActiveAssessment('stock');
    }
    setActivePage('assessment-runner');
    showSnackbar('Report loaded for editing');
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      await deleteReport(reportId);
      showSnackbar('Report deleted successfully');
    }
  };

  const handleDeleteAllData = () => {
    resetAssessment();
    resetStockData();
    clearReports();
    // Clear all localStorage, including consent, onboarding, and analytics settings
    localStorage.clear();
    logout();
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setOnboardingComplete(true);
  };

  const handleSignUp = async (data: any): Promise<{ success: boolean; message: string }> => {
    return signUp(data.name, data.email, data.password);
  };

  const handleProfileComplete = (updatedData: Partial<User>) => {
    updateUser(updatedData);
  };

  if (isLoadingConfig || !appConfig) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icon name="loader" className="w-12 h-12 animate-spin text-[var(--text-accent)]" />
      </div>
    );
  }

  if (appConfig.maintenanceMode) {
    return <MaintenanceMode message={appConfig.bannerMessage} />;
  }

  if (appConfig.forceUpdate) {
    return <UpdateRequiredModal />;
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <Icon name="logo" className="w-16 h-16 text-[var(--text-accent)] mx-auto mb-4 animate-pulse" />
          <p className="text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    switch (authFlow) {
      case 'signup':
        return <SignUp onSignUp={handleSignUp} onNavigate={setAuthFlow} />;
      case 'login':
        return <Login onLogin={login} onResetPassword={resetPassword} onNavigate={setAuthFlow} />;
      case 'new-password':
        return <NewPassword oobCode={oobCode} onNavigate={setAuthFlow} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={setAuthFlow} />;
    }
  }

  if (!user.college || !user.course || !user.batch) {
    return <ProfileSetup user={user} onComplete={handleProfileComplete} />;
  }

  if (!onboardingComplete) {
    return (
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
        <OnboardingStepper onFinish={handleOnboardingComplete} user={user} />
      </Suspense>
    );
  }

  const handlePageNavigation = (page: Page) => {
    if (page === 'pdf-viewer' && selectedReport) {
      handleViewReport(selectedReport);
    } else {
      setActivePage(page);
    }
  };

  const renderContent = () => {
    if (activePage === 'assessment-runner') {
      if (activeAssessment === '24-hour') {
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <AssessmentStepper
              assessmentHook={{ data: assessmentData, updateData: updateAssessmentData, resetAssessment, saveToCloud: saveAssessment, syncStatus: assessmentSyncStatus, lastSynced: assessmentLastSynced }}
              onFinish={(aiResponse) => handleFinishAssessment('24-hour', assessmentData, aiResponse)}
              onExit={handleExitAssessment}
              showSnackbar={showSnackbar}
            />
          </Suspense>
        );
      }
      if (activeAssessment === 'stock') {
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <StockInventoryStepper
              inventoryHook={{ data: stockData, updateData: updateStockData, reset: resetStockData, saveToCloud: saveInventory, syncStatus: stockSyncStatus, lastSynced: stockLastSynced }}
              onFinish={(aiResponse) => handleFinishAssessment('stock', stockData, aiResponse)}
              onExit={handleExitAssessment}
              showSnackbar={showSnackbar}
            />
          </Suspense>
        );
      }
    }

    switch (activePage) {
      case 'assessments':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <Assessments onStartAssessment={handleStartAssessment} featureFlags={appConfig.featureFlags} />
          </Suspense>
        );
      case 'ai-assistant':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <div className="max-w-5xl mx-auto">
              <AiAssistant assessmentData={assessmentData} stockData={stockData} featureFlags={appConfig.featureFlags} />
            </div>
          </Suspense>
        );
      case 'reports':
        return <Reports reports={reports} onViewReport={handleViewReport} onEditReport={handleEditReport} onDeleteReport={handleDeleteReport} onNavigate={() => setActivePage('assessments')} />;
      case 'profile':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <Profile user={user} onUpdateUser={updateUser} onLogout={logout} onDeleteAllData={handleDeleteAllData} onNavigate={setActivePage} syncHook={syncHook} />
          </Suspense>
        );
      case 'glossary':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <Glossary />
          </Suspense>
        );
      case 'conversion-tool':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <ConversionTool />
          </Suspense>
        );
      case 'privacy-policy':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <PrivacyPolicy onBack={() => setActivePage('profile')} />
          </Suspense>
        );
      case 'tutorials':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <Tutorials setActivePage={setActivePage} />
          </Suspense>
        );
      case 'ifct-library':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <IFCTLibrary setActivePage={setActivePage} />
          </Suspense>
        );
      case 'games':
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <Games />
          </Suspense>
        );
      case 'pdf-viewer':
        return selectedReport ? (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <PDFViewer user={user} report={selectedReport} onBack={() => setActivePage('reports')} />
          </Suspense>
        ) : <Home setActivePage={setActivePage} user={user} reports={reports} onViewReport={handleViewReport} assessmentHook={{ data: assessmentData, updateData: updateAssessmentData, resetAssessment, saveToCloud: saveAssessment, syncStatus: assessmentSyncStatus, lastSynced: assessmentLastSynced }} />;
      case 'home':
        return <Home setActivePage={setActivePage} user={user} reports={reports} onViewReport={handleViewReport} assessmentHook={{ data: assessmentData, updateData: updateAssessmentData, resetAssessment, saveToCloud: saveAssessment, syncStatus: assessmentSyncStatus, lastSynced: assessmentLastSynced }} />;
      default:
        return (
          <Suspense fallback={<div className="flex justify-center items-center h-64"><Icon name="loader" className="w-8 h-8 animate-spin text-[var(--text-accent)]" /></div>}>
            <NotFound onNavigate={setActivePage} />
          </Suspense>
        );
    }
  };

  return (
    <GameProvider>
      <Layout
        activePage={activePage}
        setActivePage={handlePageNavigation}
        user={user}
        onLogout={logout}
        syncHook={syncHook}
        isWarningVisible={isWarningVisible}
        onStay={stay}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        remoteMessage={appConfig.bannerMessage}
        featureFlags={appConfig.featureFlags}
      >
        <main className="flex-grow bg-background text-foreground py-4 md:py-6 lg:py-8">
          {renderContent()}
        </main>
      </Layout>
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />}
    </GameProvider>
  );
};

export default App;
