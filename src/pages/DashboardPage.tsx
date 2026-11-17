import React from 'react';
import { 
  HeartHandshake, 
  Calendar, 
  Pill, 
  FileText, 
  BookOpen, 
  Users, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  AlertTriangle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportRecoverySummaryPdf } from '../services/pdfGeneratorService';

export const DashboardPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { tasks, appointments, medications, profile, loadSampleData } = useApp();

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const unscheduledAppts = appointments.filter(a => !a.isScheduled);
  const scheduledAppts = appointments.filter(a => a.isScheduled);
  const newMeds = medications.filter(m => m.status === 'new');
  const discontinuedMeds = medications.filter(m => m.status === 'discontinued');

  const handleExportPdf = () => {
    exportRecoverySummaryPdf(
      tasks,
      appointments,
      medications,
      profile.emergencyContact ? `Patient (${profile.emergencyContact})` : 'Discharged Patient'
    );
  };

  const hasAnyData = tasks.length > 0 || appointments.length > 0 || medications.length > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-800 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-full text-xs font-medium text-brand-100 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Tracking • 100% Private Local Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to your Post-Discharge Care Center
          </h1>
          <p className="mt-2 text-brand-100 text-sm sm:text-base leading-relaxed">
            Transitioning home from the hospital can be overwhelming. CareTransition helps you organize doctor instructions, track medications, schedule appointments, and prepare instructions for your family or caregivers.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('interpreter')}
              className="inline-flex items-center px-4 py-2.5 bg-white text-brand-800 font-semibold rounded-xl text-sm shadow hover:bg-brand-50 transition"
            >
              <FileText className="w-4 h-4 mr-2 text-brand-600" />
              Interpret Discharge Papers
            </button>
            <button
              onClick={handleExportPdf}
              className="inline-flex items-center px-4 py-2.5 bg-brand-800/80 hover:bg-brand-800 text-white font-medium rounded-xl text-sm transition border border-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Recovery PDF
            </button>
            {!hasAnyData && (
              <button
                onClick={loadSampleData}
                className="inline-flex items-center px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-sm transition"
              >
                Load Sample Recovery Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vital Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Tasks */}
        <div 
          onClick={() => onNavigate('planner')}
          className="bg-white p-5 rounded-xl border border-calm-200 shadow-xs hover:border-brand-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-calm-500">Recovery Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-calm-900">{pendingTasks.length}</span>
            <span className="text-xs text-calm-500">active tasks remaining</span>
          </div>
          <div className="mt-2 text-xs text-calm-600 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-600 mr-1" />
            <span>{completedTasks.length} completed</span>
          </div>
        </div>

        {/* Appointments */}
        <div 
          onClick={() => onNavigate('appointments')}
          className="bg-white p-5 rounded-xl border border-calm-200 shadow-xs hover:border-brand-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-calm-500">Appointments</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-calm-900">{appointments.length}</span>
            <span className="text-xs text-calm-500">total follow-ups</span>
          </div>
          <div className="mt-2 text-xs text-amber-700 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            <span>{unscheduledAppts.length} need scheduling</span>
          </div>
        </div>

        {/* Active Medications */}
        <div 
          onClick={() => onNavigate('medications')}
          className="bg-white p-5 rounded-xl border border-calm-200 shadow-xs hover:border-brand-400 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-calm-500">Medications</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-calm-900">{medications.length}</span>
            <span className="text-xs text-calm-500">in schedule</span>
          </div>
          <div className="mt-2 text-xs text-brand-700 flex items-center">
            <span className="w-2 h-2 rounded-full bg-brand-500 mr-1.5"></span>
            <span>{newMeds.length} new prescriptions</span>
          </div>
        </div>

        {/* Discontinued Warning */}
        <div 
          onClick={() => onNavigate('medications')}
          className="bg-white p-5 rounded-xl border border-calm-200 shadow-xs hover:border-amberalert-500 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-calm-500">Discontinued Rx</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-amber-800">{discontinuedMeds.length}</span>
            <span className="text-xs text-calm-500">stopped meds</span>
          </div>
          <div className="mt-2 text-xs text-calm-500">
            Explicitly marked as discontinued
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Action Items & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Pending Recovery Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-calm-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-calm-900">Upcoming Recovery Tasks</h2>
                <p className="text-xs text-calm-500">Outstanding clinician instructions and home care tasks</p>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
              >
                View All ({tasks.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 bg-calm-50 rounded-lg border border-dashed border-calm-300">
                <CheckCircle2 className="w-10 h-10 text-sage-600 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium text-calm-700">No pending recovery tasks right now</p>
                <p className="text-xs text-calm-500 mt-1 max-w-sm mx-auto">
                  Add tasks manually or extract them directly from your discharge instructions.
                </p>
                <button
                  onClick={() => onNavigate('planner')}
                  className="mt-3 inline-flex items-center px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Recovery Task
                </button>
              </div>
            ) : (
              <div className="divide-y divide-calm-100">
                {pendingTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="py-3.5 flex items-start justify-between">
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-xs font-semibold uppercase rounded bg-calm-100 text-calm-700">
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span className="text-xs text-calm-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> Due: {task.dueDate}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-calm-900">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-calm-600">{task.description}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointments Preview */}
          <div className="bg-white rounded-xl border border-calm-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-calm-900">Follow-up Appointments</h2>
                <p className="text-xs text-calm-500">Track doctor visits, labs, and rehab clinics</p>
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center"
              >
                Manage ({appointments.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-6 bg-calm-50 rounded-lg border border-dashed border-calm-300">
                <Calendar className="w-8 h-8 text-calm-400 mx-auto mb-1.5" />
                <p className="text-xs text-calm-600">No appointments recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appointments.slice(0, 4).map(appt => (
                  <div key={appt.id} className="p-3.5 rounded-lg border border-calm-200 bg-calm-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        appt.isScheduled ? 'bg-sage-50 text-sage-700 border border-sage-500/20' : 'bg-amber-50 text-amber-800 border border-amber-300'
                      }`}>
                        {appt.isScheduled ? 'Scheduled' : 'Action Required'}
                      </span>
                      {appt.date && <span className="text-xs text-calm-500">{appt.date}</span>}
                    </div>
                    <div className="text-sm font-bold text-calm-900">{appt.providerName}</div>
                    {appt.phone && <div className="text-xs text-brand-600 font-medium">{appt.phone}</div>}
                    {appt.reasonForVisit && <div className="text-xs text-calm-600">{appt.reasonForVisit}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Key Feature Launchers & Safety Guidance */}
        <div className="space-y-6">
          {/* Quick Tools */}
          <div className="bg-white rounded-xl border border-calm-200 shadow-xs p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-calm-500">Core Care Modules</h3>
            
            <button
              onClick={() => onNavigate('interpreter')}
              className="w-full flex items-center p-3 rounded-lg border border-calm-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center mr-3 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-calm-900">Document Interpreter</div>
                <div className="text-xs text-calm-500">Upload PDF or paste hospital discharge text</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('dictionary')}
              className="w-full flex items-center p-3 rounded-lg border border-calm-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center mr-3 flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-calm-900">Medical Terminology Explorer</div>
                <div className="text-xs text-calm-500">Translate clinical abbreviations into plain terms</div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('caregiver')}
              className="w-full flex items-center p-3 rounded-lg border border-calm-200 hover:border-brand-500 hover:bg-brand-50/40 text-left transition"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center mr-3 flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-calm-900">Caregiver Handoff Generator</div>
                <div className="text-xs text-calm-500">Create printable handoff sheets for family & aides</div>
              </div>
            </button>
          </div>

          {/* Safety Warning Card */}
          <div className="bg-amberalert-50 border border-amberalert-500/30 rounded-xl p-5 space-y-2">
            <div className="flex items-center space-x-2 text-amberalert-700 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amberalert-700 flex-shrink-0" />
              <span>When to Seek Emergency Care</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              If you experience severe chest pain, shortness of breath, sudden weakness, fever above 101°F (38.3°C), or uncontrolled surgical site bleeding, do not wait. Call 911 or visit the nearest Emergency Room immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
