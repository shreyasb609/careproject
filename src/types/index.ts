export type TaskCategory = 
  | 'medication'
  | 'appointment'
  | 'wound-care'
  | 'physical-therapy'
  | 'diet-hydration'
  | 'vital-signs'
  | 'equipment'
  | 'general';

export interface RecoveryTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  completed: boolean;
  completedAt?: string;
  sourceDocument?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  providerName: string;
  specialty?: string;
  organization?: string; // Hospital / Clinic
  phone?: string;
  location?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  isScheduled: boolean;
  reasonForVisit?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MedicationStatus = 'new' | 'continued' | 'discontinued';

export interface MedicationSchedule {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  bedtime: boolean;
  asNeeded: boolean;
  specificTimes?: string[]; // e.g. ["08:00", "20:00"]
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  route?: string; // Oral, Topical, Subcutaneous, etc.
  frequency: string; // e.g., "Twice daily", "Every 8 hours"
  instructions: string; // e.g., "Take with food, do not crush"
  purpose?: string; // e.g., "Blood pressure"
  prescribingDoctor?: string;
  status: MedicationStatus;
  schedule: MedicationSchedule;
  discontinuedReason?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type TermCategory = 
  | 'abbreviation'
  | 'discharge'
  | 'medication'
  | 'rehabilitation'
  | 'instructions'
  | 'vitals'
  | 'lab-imaging';

export interface MedicalTerm {
  id: string;
  term: string; // The acronym or term
  expanded: string; // Full unabbreviated medical phrase
  plainLanguage: string; // Patient-friendly description in simple English
  category: TermCategory;
  source: string; // e.g. "NIH MedlinePlus", "USPSTF", "CDC", "American College of Physicians"
  ambiguityWarning?: string; // If this abbreviation can mean multiple things
  contextClues?: string[]; // e.g. ["medication", "dose", "eye"]
}

export interface ExtractedItem {
  id: string;
  type: 'task' | 'appointment' | 'medication' | 'term';
  rawSnippet: string;
  confidence: 'high' | 'medium' | 'low';
  title: string;
  details: Record<string, any>;
  confirmed: boolean;
  needsClarification: boolean;
  clarificationReason?: string;
}

export interface CaregiverHandoffConfig {
  patientDisplayName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  hospitalName: string;
  dischargeDate: string;
  specialInstructions: string;
  includedTaskIds: string[];
  includedAppointmentIds: string[];
  includedMedicationIds: string[];
}

export interface PatientProfile {
  dischargeDate?: string;
  hospitalName?: string;
  primaryCareProvider?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
}

