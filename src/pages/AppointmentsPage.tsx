import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Phone, 
  MapPin, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Download,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const AppointmentsPage: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  const [providerName, setProviderName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingAppt(null);
    setProviderName('');
    setSpecialty('');
    setOrganization('');
    setPhone('');
    setLocation('');
    setDate('');
    setTime('');
    setIsScheduled(false);
    setReasonForVisit('');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (appt: Appointment) => {
    setEditingAppt(appt);
    setProviderName(appt.providerName);
    setSpecialty(appt.specialty || '');
    setOrganization(appt.organization || '');
    setPhone(appt.phone || '');
    setLocation(appt.location || '');
    setDate(appt.date || '');
    setTime(appt.time || '');
    setIsScheduled(appt.isScheduled);
    setReasonForVisit(appt.reasonForVisit || '');
    setNotes(appt.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerName.trim()) return;

    if (editingAppt) {
      await updateAppointment({
        ...editingAppt,
        providerName: providerName.trim(),
        specialty: specialty.trim() || undefined,
        organization: organization.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        date: date || undefined,
        time: time || undefined,
        isScheduled,
        reasonForVisit: reasonForVisit.trim() || undefined,
        notes: notes.trim() || undefined
      });
    } else {
      await addAppointment({
        providerName: providerName.trim(),
        specialty: specialty.trim() || undefined,
        organization: organization.trim() || undefined,
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        date: date || undefined,
        time: time || undefined,
        isScheduled,
        reasonForVisit: reasonForVisit.trim() || undefined,
        notes: notes.trim() || undefined
      });
    }
    setIsModalOpen(false);
  };

  const handleExportAppointmentsPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(2, 132, 199);
    doc.text('Post-Discharge Follow-Up Appointments', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    const rows = appointments.map(a => [
      a.providerName + (a.specialty ? ` (${a.specialty})` : ''),
      a.isScheduled ? 'Confirmed' : 'Needs Call to Schedule',
      a.date ? `${a.date} ${a.time || ''}` : 'Pending booking',
      a.phone || 'N/A',
      a.location || a.organization || 'N/A',
      a.reasonForVisit || '-'
    ]);

    autoTable(doc, {
      startY: 34,
      head: [['Provider & Specialty', 'Status', 'Date & Time', 'Phone', 'Location', 'Purpose']],
      body: rows.length > 0 ? rows : [['No appointments registered', '-', '-', '-', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199] },
      styles: { fontSize: 8.5 }
    });

    doc.save(`CareTransition_Appointments_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-calm-900 tracking-tight">Follow-up Appointment Organizer</h1>
          <p className="text-sm text-calm-500 mt-1">
            Keep track of doctor visits, rehabilitation check-ins, phone numbers, and scheduled dates.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          {appointments.length > 0 && (
            <button
              onClick={handleExportAppointmentsPdf}
              className="inline-flex items-center px-3.5 py-2.5 bg-white border border-calm-300 text-calm-700 font-medium rounded-xl text-sm shadow-xs hover:bg-calm-50 transition"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Export Appointments
            </button>
          )}
          <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm shadow hover:bg-brand-700 transition"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Appointment
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-calm-200">
          <Calendar className="w-10 h-10 text-calm-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-medium text-calm-700">No follow-up appointments added yet</p>
          <p className="text-xs text-calm-500 mt-1">
            Doctors typically require check-ups within 1 to 2 weeks post-discharge.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center px-4 py-2 text-xs font-semibold bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Record Follow-up Appointment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map(appt => (
            <div
              key={appt.id}
              className={`p-5 rounded-xl border transition space-y-3 bg-white shadow-xs ${
                appt.isScheduled ? 'border-calm-200' : 'border-amber-300 bg-amber-50/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                      appt.isScheduled 
                        ? 'bg-sage-50 text-sage-700 border border-sage-500/30' 
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {appt.isScheduled ? 'Confirmed Date' : 'Action: Needs Booking'}
                    </span>
                    {appt.specialty && (
                      <span className="text-xs font-medium text-calm-500">{appt.specialty}</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-calm-900 mt-1">{appt.providerName}</h3>
                  {appt.organization && (
                    <div className="text-xs text-calm-500 flex items-center mt-0.5">
                      <Building className="w-3.5 h-3.5 mr-1" /> {appt.organization}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(appt)}
                    className="p-1.5 text-calm-400 hover:text-calm-700 rounded-lg hover:bg-calm-100 transition"
                    title="Edit appointment"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAppointment(appt.id)}
                    className="p-1.5 text-calm-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    title="Delete appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="border-t border-calm-100 pt-3 space-y-1.5 text-xs text-calm-700">
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 text-brand-600 mr-2 flex-shrink-0" />
                  <span className="font-medium">
                    {appt.date ? `${appt.date} ${appt.time ? `at ${appt.time}` : ''}` : 'No date set yet'}
                  </span>
                </div>

                {appt.phone && (
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 text-brand-600 mr-2 flex-shrink-0" />
                    <a href={`tel:${appt.phone}`} className="font-semibold text-brand-700 hover:underline">
                      {appt.phone}
                    </a>
                  </div>
                )}

                {appt.location && (
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-brand-600 mr-2 flex-shrink-0" />
                    <span>{appt.location}</span>
                  </div>
                )}

                {appt.reasonForVisit && (
                  <div className="mt-2 p-2 bg-calm-50 rounded text-xs text-calm-600">
                    <strong>Visit Goal:</strong> {appt.reasonForVisit}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-calm-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-calm-900 mb-4">
              {editingAppt ? 'Edit Appointment Details' : 'Add Follow-Up Appointment'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                  Provider Name / Clinic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah Jenkins or Metro Physical Therapy"
                  value={providerName}
                  onChange={(e) => setProviderName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology, PCP, Orthopedics"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Organization / Clinic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Memorial Hospital Clinic"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. (555) 019-2834"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                    Location / Office Suite
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100 Main St, Suite 300"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-calm-50 rounded-lg border border-calm-200 space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500 h-4 w-4"
                  />
                  <span className="text-xs font-semibold text-calm-800">
                    This appointment has a confirmed scheduled date & time
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-calm-700 uppercase mb-1">
                  Purpose / Questions to Ask
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Suture removal and medication adjustment questions"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
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
                  {editingAppt ? 'Save Changes' : 'Save Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

