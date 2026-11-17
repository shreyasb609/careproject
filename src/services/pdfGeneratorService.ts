import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RecoveryTask, Appointment, Medication, CaregiverHandoffConfig } from '../types';

/**
 * Generates an accessible, structured PDF Recovery Summary.
 * Runs 100% locally in browser memory without sending data to servers.
 */
export function exportRecoverySummaryPdf(
  tasks: RecoveryTask[],
  appointments: Appointment[],
  medications: Medication[],
  patientName: string = 'Patient'
): void {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString();

  // Document Title Header
  doc.setFontSize(22);
  doc.setTextColor(2, 132, 199); // Brand blue
  doc.text('CareTransition: Post-Discharge Summary', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated locally for: ${patientName} | Date: ${dateStr}`, 14, 28);
  doc.text('Notice: Informational aid only. Always consult your healthcare team for medical decisions.', 14, 34);

  let currentY = 42;

  // 1. Follow-up Appointments Section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Scheduled & Upcoming Appointments', 14, currentY);

  const apptRows = appointments.map(a => [
    a.providerName + (a.specialty ? ` (${a.specialty})` : ''),
    a.date ? `${a.date} ${a.time || ''}` : 'Pending schedule',
    a.location || a.organization || 'See notes',
    a.phone || 'N/A',
    a.isScheduled ? 'Confirmed' : 'Needs Call'
  ]);

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Provider', 'Date & Time', 'Location', 'Phone', 'Status']],
    body: apptRows.length > 0 ? apptRows : [['No appointments recorded', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 14;

  // 2. Active Medications Schedule Section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Prescribed Medications Schedule', 14, currentY);

  const medRows = medications.map(m => {
    const times = [];
    if (m.schedule.morning) times.push('Morning');
    if (m.schedule.afternoon) times.push('Afternoon');
    if (m.schedule.evening) times.push('Evening');
    if (m.schedule.bedtime) times.push('Bedtime');
    if (m.schedule.asNeeded) times.push('As Needed (PRN)');

    return [
      m.name,
      m.dosage,
      m.frequency,
      times.join(', ') || 'As prescribed',
      m.instructions || '-',
      m.status.toUpperCase()
    ];
  });

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Medication', 'Dose', 'Frequency', 'Timing', 'Special Instructions', 'Type']],
    body: medRows.length > 0 ? medRows : [['No medications listed', '-', '-', '-', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [58, 125, 87], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 14;

  // Check if we need a new page for tasks
  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  // 3. Recovery Tasks Section
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Key Recovery Tasks & Precautions', 14, currentY);

  const taskRows = tasks.map(t => [
    t.completed ? '[X] Done' : '[ ] Pending',
    t.title,
    t.category.toUpperCase(),
    t.dueDate || 'Ongoing',
    t.description || '-'
  ]);

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Status', 'Task', 'Category', 'Due Date', 'Notes']],
    body: taskRows.length > 0 ? taskRows : [['-', 'No recovery tasks recorded', '-', '-', '-']],
    theme: 'striped',
    headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5 },
  });

  // Save the PDF locally
  doc.save(`CareTransition_Recovery_Summary_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generates Caregiver Handoff Summary PDF
 */
export function exportCaregiverHandoffPdf(
  config: CaregiverHandoffConfig,
  tasks: RecoveryTask[],
  appointments: Appointment[],
  medications: Medication[]
): void {
  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.setTextColor(2, 132, 199);
  doc.text('Caregiver Care & Handoff Guide', 14, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Patient: ${config.patientDisplayName || 'Family Member'} | Discharge Date: ${config.dischargeDate || 'N/A'}`, 14, 28);
  doc.text(`Emergency Contact: ${config.emergencyContactName || 'N/A'} (${config.emergencyContactPhone || 'N/A'})`, 14, 34);

  let currentY = 44;

  // Critical Caregiver Notes
  if (config.specialInstructions) {
    doc.setFontSize(12);
    doc.setTextColor(180, 83, 9); // Amber
    doc.text('Important Caregiver Instructions & Red Flags:', 14, currentY);
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const splitInstructions = doc.splitTextToSize(config.specialInstructions, 180);
    doc.text(splitInstructions, 14, currentY + 6);
    currentY += 8 + splitInstructions.length * 5;
  }

  // Selected Appointments
  const selectedAppts = appointments.filter(a => config.includedAppointmentIds.includes(a.id));
  if (selectedAppts.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('Caregiver Follow-up Schedule:', 14, currentY);

    const apptRows = selectedAppts.map(a => [
      a.providerName,
      a.date ? `${a.date} ${a.time || ''}` : 'Needs booking',
      a.phone || 'N/A',
      a.location || 'N/A'
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Provider', 'When', 'Phone', 'Location']],
      body: apptRows,
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199] },
      styles: { fontSize: 9 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Selected Medications
  const selectedMeds = medications.filter(m => config.includedMedicationIds.includes(m.id));
  if (selectedMeds.length > 0) {
    if (currentY > 210) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('Medication Administration Routine:', 14, currentY);

    const medRows = selectedMeds.map(m => {
      const times = [];
      if (m.schedule.morning) times.push('Morning');
      if (m.schedule.afternoon) times.push('Noon');
      if (m.schedule.evening) times.push('Dinner');
      if (m.schedule.bedtime) times.push('Bedtime');
      if (m.schedule.asNeeded) times.push('PRN (As Needed)');

      return [
        m.name,
        m.dosage,
        times.join(', ') || m.frequency,
        m.instructions || 'Standard precautions'
      ];
    });

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Medicine', 'Dose', 'Timing Schedule', 'Instructions']],
      body: medRows,
      theme: 'grid',
      headStyles: { fillColor: [58, 125, 87] },
      styles: { fontSize: 9 }
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Selected Tasks
  const selectedTasks = tasks.filter(t => config.includedTaskIds.includes(t.id));
  if (selectedTasks.length > 0) {
    if (currentY > 210) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('Caregiver Daily Assistance Checklist:', 14, currentY);

    const taskRows = selectedTasks.map(t => [
      t.completed ? '[Done]' : '[To Do]',
      t.title,
      t.category,
      t.dueDate || 'Daily'
    ]);

    autoTable(doc, {
      startY: currentY + 4,
      head: [['Status', 'Action Item', 'Category', 'Timeline']],
      body: taskRows,
      theme: 'striped',
      headStyles: { fillColor: [71, 85, 105] },
      styles: { fontSize: 9 }
    });
  }

  doc.save(`Caregiver_Handoff_${config.patientDisplayName || 'Guide'}.pdf`);
}

