import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { RecoveryPlannerPage } from './pages/RecoveryPlannerPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { MedicationOrganizerPage } from './pages/MedicationOrganizerPage';
import { DocumentInterpreterPage } from './pages/DocumentInterpreterPage';
import { MedicalTerminologyExplorerPage } from './pages/MedicalTerminologyExplorerPage';
import { CaregiverHandoffPage } from './pages/CaregiverHandoffPage';
import { SettingsPrivacyPage } from './pages/SettingsPrivacyPage';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-calm-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-calm-500 font-medium">Loading your secure local health records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-calm-50 text-calm-900">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentPage === 'home' && <DashboardPage onNavigate={setCurrentPage} />}
        {currentPage === 'planner' && <RecoveryPlannerPage />}
        {currentPage === 'appointments' && <AppointmentsPage />}
        {currentPage === 'medications' && <MedicationOrganizerPage />}
        {currentPage === 'interpreter' && <DocumentInterpreterPage onNavigate={setCurrentPage} />}
        {currentPage === 'dictionary' && <MedicalTerminologyExplorerPage />}
        {currentPage === 'caregiver' && <CaregiverHandoffPage />}
        {currentPage === 'privacy' && <SettingsPrivacyPage />}
      </main>

      <footer className="border-t border-calm-200 bg-white py-6 mt-12 text-xs text-calm-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <strong>CareTransition</strong> — Free, client-side, post-discharge navigation.
          </div>
          <div className="flex space-x-4">
            <button onClick={() => setCurrentPage('privacy')} className="hover:text-brand-600 transition">
              Privacy & Security Policy
            </button>
            <button onClick={() => setCurrentPage('dictionary')} className="hover:text-brand-600 transition">
              Medical Abbreviations
            </button>
            <span className="text-calm-300">|</span>
            <span className="text-calm-400">Zero Patient Telemetry</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

