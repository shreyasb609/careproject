import React, { useState } from 'react';
import { 
  Users, 
  Download, 
  Printer, 
  CheckSquare, 
  Square, 
  Phone, 
  Hospital, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportCaregiverHandoffPdf } from '../services/pdfGeneratorService';

export const CaregiverHandoffPage: React.FC = () => {
  const { tasks, appointments, medications, profile, updateProfile } = useApp();

  const [patientDisplayName, setPatientDisplayName] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState(profile.emergencyContact || '');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(profile.emergencyPhone || '');
  const [hospitalName, setHospitalName] = useState(profile.hospitalName || '');
  const [dischargeDate, setDischargeDate] = useState(profile.dischargeDate || '');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Please call 911 if patient exhibits shortness of breath, sudden fever >101°F, or uncontrolled surgical bleeding. Keep surgical incision dry.'
  );

  // Selected item IDs for custom granular sharing
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(tasks.map(t => t.id));
  const [selectedApptIds, setSelectedApptIds] = useState<string[]>(appointments.map(a => a.id));
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>(medications.filter(m => m.status !== 'discontinued').map(m => m.id));

  const toggleTask = (id: string) => {
    setSelectedTaskIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAppt = (id: string) => {
    setSelectedApptIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleMed = (id: string) => {
    setSelectedMedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleGeneratePdf = () => {
    exportCaregiverHandoffPdf(
      {
        patientDisplayName: patientDisplayName || 'Family Member',
        emergencyContactName,
        emergencyContactPhone,
        hospitalName,
        dischargeDate,
        specialInstructions,
        includedTaskIds: selectedTaskIds,
        includedAppointmentIds: selectedApptIds,
        includedMedicationIds: selectedMedIds
      },
      tasks,
      appointments,
      medications
    );
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="sm:flex sm:items-center sm:justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold text-calm-900 tracking-tight">Caregiver Handoff Generator</h1>
          <p className="text-sm text-calm-500 mt-1">
            Create an easy-to-read, printable recovery guide for family members, friends, or home health aides.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3.5 py-2.5 bg-white border border-calm-300 text-calm-700 font-medium rounded-xl text-sm shadow-xs hover:bg-calm-50 transition"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Print Handoff
          </button>
          <button
            onClick={handleGeneratePdf}
            className="inline-flex items-center px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm shadow hover:bg-brand-700 transition"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Caregiver PDF
          </button>
        </div>
      </div>

      {/* Patient Privacy Control Alert */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-brand-900 no-print">
        <Users className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Granular Sharing Control:</strong> You select exactly which recovery items and medications to share with your caregiver. Uncheck any sensitive items below before printing or downloading.
        </div>
      </div>

      {/* Caregiver Header Configuration */}
      <div className="bg-white rounded-xl border border-calm-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-calm-900">1. Emergency & Patient Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
              Patient Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mom, or John Smith"
              value={patientDisplayName}
              onChange={(e) => setPatientDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
              Discharge Hospital / Facility
            </label>
            <input
              type="text"
              placeholder="e.g. St. Jude Regional Hospital"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
              Discharge Date
            </label>
            <input
              type="date"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
              Emergency Contact Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mary Smith (Daughter)"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              placeholder="e.g. (555) 987-6543"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
            Special Caregiver Instructions & Red Flags
          </label>
          <textarea
            rows={2}
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Selectable Modules to Include */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medications */}
        <div className="bg-white rounded-xl border border-calm-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-calm-900 uppercase tracking-wider">
              Include Medications ({selectedMedIds.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                if (selectedMedIds.length === medications.length) setSelectedMedIds([]);
                else setSelectedMedIds(medications.map(m => m.id));
              }}
              className="text-xs text-brand-600 font-semibold"
            >
              Toggle All
            </button>
          </div>

          <div className="divide-y divide-calm-100 max-h-80 overflow-y-auto">
            {medications.map(m => (
              <label key={m.id} className="py-2.5 flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMedIds.includes(m.id)}
                  onChange={() => toggleMed(m.id)}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <div className="text-xs">
                  <div className="font-semibold text-calm-900">{m.name} ({m.dosage})</div>
                  <div className="text-calm-500">{m.frequency}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-xl border border-calm-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-calm-900 uppercase tracking-wider">
              Include Appointments ({selectedApptIds.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                if (selectedApptIds.length === appointments.length) setSelectedApptIds([]);
                else setSelectedApptIds(appointments.map(a => a.id));
              }}
              className="text-xs text-brand-600 font-semibold"
            >
              Toggle All
            </button>
          </div>

          <div className="divide-y divide-calm-100 max-h-80 overflow-y-auto">
            {appointments.map(a => (
              <label key={a.id} className="py-2.5 flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedApptIds.includes(a.id)}
                  onChange={() => toggleAppt(a.id)}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <div className="text-xs">
                  <div className="font-semibold text-calm-900">{a.providerName}</div>
                  <div className="text-calm-500">{a.date || 'Pending appointment'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl border border-calm-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-calm-900 uppercase tracking-wider">
              Include Recovery Tasks ({selectedTaskIds.length})
            </h3>
            <button
              type="button"
              onClick={() => {
                if (selectedTaskIds.length === tasks.length) setSelectedTaskIds([]);
                else setSelectedTaskIds(tasks.map(t => t.id));
              }}
              className="text-xs text-brand-600 font-semibold"
            >
              Toggle All
            </button>
          </div>

          <div className="divide-y divide-calm-100 max-h-80 overflow-y-auto">
            {tasks.map(t => (
              <label key={t.id} className="py-2.5 flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTaskIds.includes(t.id)}
                  onChange={() => toggleTask(t.id)}
                  className="mt-0.5 rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <div className="text-xs">
                  <div className="font-semibold text-calm-900">{t.title}</div>
                  <div className="text-calm-500 uppercase">{t.category}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

