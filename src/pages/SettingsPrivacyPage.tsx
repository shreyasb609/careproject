import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Trash2, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2, 
  Database,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPrivacyPage: React.FC = () => {
  const { clearAllData, tasks, appointments, medications } = useApp();
  const [clearedNotice, setClearedNotice] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClearAll = async () => {
    await clearAllData();
    setConfirmDelete(false);
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 5000);
  };

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-calm-900 tracking-tight">Privacy, Security & Local Data</h1>
        <p className="text-sm text-calm-500 mt-1">
          Detailed transparency regarding how your medical information is processed, stored, and deleted.
        </p>
      </div>

      {clearedNotice && (
        <div className="p-4 bg-sage-50 border border-sage-500/30 text-sage-800 rounded-xl text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-sage-600 flex-shrink-0" />
          <span>All local patient data and cached records have been permanently erased from this browser.</span>
        </div>
      )}

      {/* Primary Privacy Statement Card */}
      <div className="bg-white rounded-xl border border-calm-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 text-brand-700">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
            <Lock className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-calm-900">Zero-Telemetry & 100% Client-Side Architecture</h2>
            <div className="text-xs text-brand-600 font-medium">No account required • No cloud database • No AI tracking</div>
          </div>
        </div>

        <div className="text-sm text-calm-700 space-y-3 leading-relaxed border-t border-calm-100 pt-4">
          <p>
            <strong>Where is your data stored?</strong> CareTransition stores all information exclusively inside your device's browser using <strong>IndexedDB</strong>. At no point is patient information, medication names, diagnosis text, or uploaded PDF documents sent over the internet or saved to remote databases.
          </p>
          <p>
            <strong>Are there AI chatbots or external language models?</strong> No. CareTransition deliberately does NOT connect to third-party LLM APIs, OpenAI, Google Gemini, or cloud models. Text parsing is handled deterministically on your local CPU to prevent medical hallucinations and eliminate data leakage.
          </p>
          <p>
            <strong>Are there advertising or analytics trackers?</strong> Zero. We do not use Google Analytics, tracking pixels, cookies, or marketing SDKs.
          </p>
        </div>
      </div>

      {/* Device Sharing Advisory & Compliance Disclaimer */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <span>Important Device Security & Regulatory Notice</span>
        </div>
        <div className="text-xs text-amber-900 space-y-2 leading-relaxed">
          <p>
            <strong>Shared or Public Computers:</strong> Because data is stored in the browser's local memory, anyone who has access to this web browser on this machine may be able to view your recovery tasks and medications. If you are using a library, hospital terminal, or shared family computer, make sure to click <strong>"Erase All Local Data"</strong> when you are finished.
          </p>
          <p>
            <strong>Regulatory & Clinical Disclaimer:</strong> Local browser storage is a personal memory aid and is not a substitute for an official certified Electronic Health Record (EHR) system. Do not claim HIPAA certification without appropriate institutional assessments. Never use this application to independently calculate medication dosages or countermand a physician's prescription.
          </p>
        </div>
      </div>

      {/* Local Storage Metrics & Wipe Data Action */}
      <div className="bg-white rounded-xl border border-calm-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-calm-900">Current Local Storage Footprint</h3>
            <p className="text-xs text-calm-500">Items saved in your browser's IndexedDB</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-calm-100 text-calm-600 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center py-2">
          <div className="p-3 bg-calm-50 rounded-lg border border-calm-200">
            <div className="text-xl font-bold text-calm-900">{tasks.length}</div>
            <div className="text-[11px] text-calm-500 uppercase font-semibold">Tasks</div>
          </div>
          <div className="p-3 bg-calm-50 rounded-lg border border-calm-200">
            <div className="text-xl font-bold text-calm-900">{appointments.length}</div>
            <div className="text-[11px] text-calm-500 uppercase font-semibold">Appointments</div>
          </div>
          <div className="p-3 bg-calm-50 rounded-lg border border-calm-200">
            <div className="text-xl font-bold text-calm-900">{medications.length}</div>
            <div className="text-[11px] text-calm-500 uppercase font-semibold">Medications</div>
          </div>
        </div>

        <div className="pt-4 border-t border-calm-100">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex items-center px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Erase All Local Data
            </button>
          ) : (
            <div className="p-4 bg-red-50 border border-red-300 rounded-xl space-y-3">
              <div className="text-xs font-bold text-red-900">
                Are you sure you want to permanently erase all saved tasks, medications, and appointments?
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleClearAll}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3.5 py-1.5 bg-white text-calm-700 border border-calm-300 text-xs font-medium rounded-lg hover:bg-calm-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

