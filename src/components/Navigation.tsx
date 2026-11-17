import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Pill, 
  FileText, 
  BookOpen, 
  Users, 
  Home, 
  ShieldCheck, 
  Menu, 
  X, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportRecoverySummaryPdf } from '../services/pdfGeneratorService';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { tasks, appointments, medications, profile } = useApp();

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'planner', label: 'Recovery Tasks', icon: HeartHandshake, count: tasks.filter(t => !t.completed).length },
    { id: 'appointments', label: 'Appointments', icon: Calendar, count: appointments.filter(a => !a.isScheduled).length },
    { id: 'medications', label: 'Medications', icon: Pill, count: medications.length },
    { id: 'interpreter', label: 'Discharge Interpreter', icon: FileText },
    { id: 'dictionary', label: 'Medical Terms', icon: BookOpen },
    { id: 'caregiver', label: 'Caregiver Handoff', icon: Users },
    { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
  ];

  const handleDownloadSummary = () => {
    exportRecoverySummaryPdf(
      tasks,
      appointments,
      medications,
      profile.emergencyContact ? `Patient (c/o ${profile.emergencyContact})` : 'Patient'
    );
  };

  return (
    <header className="bg-white border-b border-calm-200 sticky top-0 z-40 shadow-sm no-print">
      {/* Top Banner Notice for Medical Safety */}
      <div className="bg-brand-50 border-b border-brand-100 px-4 py-1.5 text-xs text-brand-900 flex items-center justify-between">
        <div className="flex items-center space-x-2 max-w-4xl mx-auto">
          <AlertTriangle className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
          <span>
            <strong>Patient Privacy Assured:</strong> All records stay exclusively in your web browser. No accounts, no cloud servers, and no AI chatbots.
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentPage('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-brand-700 transition">
              CT
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-calm-900 leading-none">
                Care<span className="text-brand-600">Transition</span>
              </div>
              <div className="text-xs text-calm-500 font-medium">Safe Post-Hospital Recovery Guide</div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-calm-600 hover:text-calm-900 hover:bg-calm-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-brand-600' : 'text-calm-400'}`} />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* PDF Quick Download & Mobile Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadSummary}
              className="hidden sm:inline-flex items-center px-3.5 py-2 border border-brand-300 text-xs font-medium rounded-lg text-brand-700 bg-white hover:bg-brand-50 transition shadow-xs"
              title="Download consolidated PDF of all recovery items"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
              Download PDF
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-calm-600 hover:text-calm-900 hover:bg-calm-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-calm-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-calm-600 hover:text-calm-900 hover:bg-calm-50'
                }`}
              >
                <div className="flex items-center">
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-600' : 'text-calm-400'}`} />
                  {item.label}
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-800">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                handleDownloadSummary();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF Summary
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

