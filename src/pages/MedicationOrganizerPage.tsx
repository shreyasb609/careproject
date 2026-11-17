import React, { useState } from 'react';
import { 
  Plus, 
  Pill, 
  Printer, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Sun, 
  Sunset, 
  Moon, 
  Bed, 
  Clock, 
  Check, 
  Info,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Medication, MedicationStatus, MedicationSchedule } from '../types';

export const MedicationOrganizerPage: React.FC = () => {
  const { medications, addMedication, updateMedication, deleteMedication } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medication | null>(null);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [route, setRoute] = useState('Oral');
  const [frequency, setFrequency] = useState('');
  const [instructions, setInstructions] = useState('');
  const [purpose, setPurpose] = useState('');
  const [status, setStatus] = useState<MedicationStatus>('continued');
  const [schedule, setSchedule] = useState<MedicationSchedule>({
    morning: false,
    afternoon: false,
    evening: false,
    bedtime: false,
    asNeeded: false
  });
  const [discontinuedReason, setDiscontinuedReason] = useState('');

  const openAddModal = () => {
    setEditingMed(null);
    setName('');
    setDosage('');
    setRoute('Oral');
    setFrequency('');
    setInstructions('');
    setPurpose('');
    setStatus('continued');
    setSchedule({ morning: false, afternoon: false, evening: false, bedtime: false, asNeeded: false });
    setDiscontinuedReason('');
    setIsModalOpen(true);
  };

  const openEditModal = (med: Medication) => {
    setEditingMed(med);
    setName(med.name);
    setDosage(med.dosage);
    setRoute(med.route || 'Oral');
    setFrequency(med.frequency);
    setInstructions(med.instructions);
    setPurpose(med.purpose || '');
    setStatus(med.status);
    setSchedule({ ...med.schedule });
    setDiscontinuedReason(med.discontinuedReason || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    if (editingMed) {
      await updateMedication({
        ...editingMed,
        name: name.trim(),
        dosage: dosage.trim(),
        route: route.trim(),
        frequency: frequency.trim(),
        instructions: instructions.trim(),
        purpose: purpose.trim() || undefined,
        status,
        schedule,
        discontinuedReason: status === 'discontinued' ? discontinuedReason.trim() : undefined
      });
    } else {
      await addMedication({
        name: name.trim(),
        dosage: dosage.trim(),
        route: route.trim(),
        frequency: frequency.trim(),
        instructions: instructions.trim(),
        purpose: purpose.trim() || undefined,
        status,
        schedule,
        discontinuedReason: status === 'discontinued' ? discontinuedReason.trim() : undefined
      });
    }
    setIsModalOpen(false);
  };

  const activeMeds = medications.filter(m => m.status !== 'discontinued');
  const discontinuedMeds = medications.filter(m => m.status === 'discontinued');

  return (
    <div className="space-y-6">
      {/* Header and Print Control */}
      <div className="sm:flex sm:items-center sm:justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold text-calm-900 tracking-tight">Medication Organizer</h1>
          <p className="text-sm text-calm-500 mt-1">
            Organize clinician-prescribed medication instructions into a structured schedule.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          {medications.length > 0 && (
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3.5 py-2.5 bg-white border border-calm-300 text-calm-700 font-medium rounded-xl text-sm shadow-xs hover:bg-calm-50 transition"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print Medication Schedule
            </button>
          )}
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm shadow hover:bg-brand-700 transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Prescribed Medication
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-brand-900 no-print">
        <ShieldAlert className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Medication Safety Guardrail:</strong> Enter medications exactly as prescribed on your discharge instructions or prescription bottle label. 
          This tool organizes your routine into convenient time slots for daily tracking. It does not calculate doses, alter medication regimens, or check pharmaceutical interactions. Always verify changes directly with your prescribing physician or pharmacist.
        </div>
      </div>

      {/* Printable Medication Schedule Chart */}
      <div className="bg-white rounded-xl border border-calm-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-calm-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-calm-900">Daily Medication Administration Grid</h2>
            <p className="text-xs text-calm-500">Visual timetable organized by time of day</p>
          </div>
        </div>

        {activeMeds.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-10 h-10 text-calm-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium text-calm-700">No active medications added yet</p>
            <p className="text-xs text-calm-500 mt-1">Add medications to see a convenient daily timetable.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-calm-200 text-left text-xs">
              <thead className="bg-calm-50 font-semibold text-calm-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Medication & Dose</th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Morning</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-orange-500" />
                      <span>Noon</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Sunset className="w-3.5 h-3.5 text-purple-600" />
                      <span>Evening</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Bed className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Bedtime</span>
                    </div>
                  </th>
                  <th className="py-3 px-3 text-center">PRN / Need</th>
                  <th className="py-3 px-4">Instructions</th>
                  <th className="py-3 px-4 text-right no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-calm-200 bg-white">
                {activeMeds.map(med => (
                  <tr key={med.id} className="hover:bg-calm-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-sm text-calm-900">{med.name}</div>
                      <div className="text-xs text-calm-600 font-medium">
                        {med.dosage} • {med.route}
                      </div>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          med.status === 'new' 
                            ? 'bg-brand-100 text-brand-800' 
                            : 'bg-calm-100 text-calm-700'
                        }`}>
                          {med.status === 'new' ? 'Newly Prescribed' : 'Continued Prior Med'}
                        </span>
                        {med.purpose && (
                          <span className="text-[11px] text-calm-500 italic">({med.purpose})</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {med.schedule.morning ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-calm-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {med.schedule.afternoon ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-calm-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {med.schedule.evening ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-calm-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {med.schedule.bedtime ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="text-calm-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {med.schedule.asNeeded ? (
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-sage-50 text-sage-700 font-semibold border border-sage-500/20 text-[10px]">
                          As Needed
                        </span>
                      ) : (
                        <span className="text-calm-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-calm-700 max-w-xs">
                      <div><strong>Frequency:</strong> {med.frequency}</div>
                      {med.instructions && (
                        <div className="text-calm-600 mt-0.5">{med.instructions}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right no-print">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => openEditModal(med)}
                          className="p-1.5 text-calm-400 hover:text-calm-700 rounded-lg hover:bg-calm-100 transition"
                          title="Edit medication"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteMedication(med.id)}
                          className="p-1.5 text-calm-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Delete medication"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Discontinued Medications Section */}
      {discontinuedMeds.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <h3 className="text-base font-bold text-amber-900">
              Discontinued Medications (DO NOT TAKE)
            </h3>
          </div>
          <p className="text-xs text-amber-800">
            These medications were explicitly identified as discontinued by your discharge instructions. Stopping an old medicine is just as important as starting a new one.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {discontinuedMeds.map(med => (
              <div key={med.id} className="p-3 bg-white rounded-lg border border-amber-300 shadow-xs flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm text-calm-900 line-through text-red-700">
                    {med.name} {med.dosage}
                  </div>
                  <div className="text-xs text-calm-600 mt-1">
                    <strong>Reason/Notice:</strong> {med.discontinuedReason || med.instructions || 'Discontinued upon hospital discharge.'}
                  </div>
                </div>
                <div className="flex items-center space-x-1 no-print">
                  <button
                    onClick={() => openEditModal(med)}
                    className="p-1 text-calm-400 hover:text-calm-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMedication(med.id)}
                    className="p-1 text-calm-400 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Medication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-calm-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-calm-900 mb-4">
              {editingMed ? 'Edit Medication' : 'Add Prescribed Medication'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metoprolol Tartrate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25 mg or 10 mL"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Route
                  </label>
                  <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg bg-white text-calm-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Oral">Oral (by mouth)</option>
                    <option value="Subcutaneous injection">Subcutaneous injection</option>
                    <option value="Intramuscular">Intramuscular</option>
                    <option value="Topical cream/gel">Topical cream/gel</option>
                    <option value="Inhalation">Inhalation</option>
                    <option value="Eye drops">Eye drops</option>
                    <option value="Ear drops">Ear drops</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                  Medication Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('new')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                      status === 'new' 
                        ? 'bg-brand-50 border-brand-600 text-brand-700 shadow-xs' 
                        : 'border-calm-300 text-calm-600'
                    }`}
                  >
                    Newly Prescribed
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('continued')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                      status === 'continued' 
                        ? 'bg-brand-50 border-brand-600 text-brand-700 shadow-xs' 
                        : 'border-calm-300 text-calm-600'
                    }`}
                  >
                    Continued Med
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('discontinued')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition ${
                      status === 'discontinued' 
                        ? 'bg-amber-100 border-amber-600 text-amber-900 shadow-xs' 
                        : 'border-calm-300 text-calm-600'
                    }`}
                  >
                    Discontinued
                  </button>
                </div>
              </div>

              {status === 'discontinued' && (
                <div>
                  <label className="block text-xs font-semibold text-amber-800 uppercase mb-1">
                    Reason Discontinued
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Replaced by Lisinopril, do not resume"
                    value={discontinuedReason}
                    onChange={(e) => setDiscontinuedReason(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}

              {status !== 'discontinued' && (
                <div className="p-3 bg-calm-50 rounded-lg border border-calm-200 space-y-2">
                  <label className="block text-xs font-bold text-calm-700 uppercase">
                    Daily Schedule Time Slots
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <label className="flex items-center space-x-2 text-xs font-medium text-calm-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.morning}
                        onChange={(e) => setSchedule({ ...schedule, morning: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                      />
                      <span>Morning</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-medium text-calm-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.afternoon}
                        onChange={(e) => setSchedule({ ...schedule, afternoon: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                      />
                      <span>Noon</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-medium text-calm-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.evening}
                        onChange={(e) => setSchedule({ ...schedule, evening: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                      />
                      <span>Evening</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-medium text-calm-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.bedtime}
                        onChange={(e) => setSchedule({ ...schedule, bedtime: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                      />
                      <span>Bedtime</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs font-medium text-calm-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schedule.asNeeded}
                        onChange={(e) => setSchedule({ ...schedule, asNeeded: e.target.checked })}
                        className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                      />
                      <span>PRN (As Needed)</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Frequency *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Twice daily, or every 8 hours"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Purpose / Condition
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blood pressure or Pain"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                  Clinician Instructions *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Take with food. Do not skip doses."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-calm-700 bg-calm-100 rounded-lg hover:bg-calm-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition"
                >
                  {editingMed ? 'Save Changes' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

