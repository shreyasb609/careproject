import { openDB, IDBPDatabase } from 'idb';
import { RecoveryTask, Appointment, Medication, PatientProfile } from '../types';

const DB_NAME = 'caretransition_db';
const DB_VERSION = 1;

interface CareTransitionDB {
  tasks: RecoveryTask;
  appointments: Appointment;
  medications: Medication;
  profile: PatientProfile & { id: string };
  meta: { key: string; value: any };
}

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

export async function getDatabase(): Promise<IDBPDatabase<any>> {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only accessible in browser environments');
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('by-category', 'category');
          taskStore.createIndex('by-completed', 'completed');
          taskStore.createIndex('by-dueDate', 'dueDate');
        }

        if (!db.objectStoreNames.contains('appointments')) {
          const apptStore = db.createObjectStore('appointments', { keyPath: 'id' });
          apptStore.createIndex('by-date', 'date');
          apptStore.createIndex('by-scheduled', 'isScheduled');
        }

        if (!db.objectStoreNames.contains('medications')) {
          const medStore = db.createObjectStore('medications', { keyPath: 'id' });
          medStore.createIndex('by-status', 'status');
          medStore.createIndex('by-name', 'name');
        }

        if (!db.objectStoreNames.contains('profile')) {
          db.createObjectStore('profile', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

// Tasks Persistence
export async function getAllTasks(): Promise<RecoveryTask[]> {
  const db = await getDatabase();
  return db.getAll('tasks');
}

export async function saveTask(task: RecoveryTask): Promise<void> {
  const db = await getDatabase();
  await db.put('tasks', task);
}

export async function deleteTask(id: string): Promise<void> {
  const db = await getDatabase();
  await db.delete('tasks', id);
}

// Appointments Persistence
export async function getAllAppointments(): Promise<Appointment[]> {
  const db = await getDatabase();
  return db.getAll('appointments');
}

export async function saveAppointment(appointment: Appointment): Promise<void> {
  const db = await getDatabase();
  await db.put('appointments', appointment);
}

export async function deleteAppointment(id: string): Promise<void> {
  const db = await getDatabase();
  await db.delete('appointments', id);
}

// Medications Persistence
export async function getAllMedications(): Promise<Medication[]> {
  const db = await getDatabase();
  return db.getAll('medications');
}

export async function saveMedication(medication: Medication): Promise<void> {
  const db = await getDatabase();
  await db.put('medications', medication);
}

export async function deleteMedication(id: string): Promise<void> {
  const db = await getDatabase();
  await db.delete('medications', id);
}

// Patient Profile
export async function getPatientProfile(): Promise<PatientProfile | null> {
  const db = await getDatabase();
  const res = await db.get('profile', 'main_profile');
  return res || null;
}

export async function savePatientProfile(profile: PatientProfile): Promise<void> {
  const db = await getDatabase();
  await db.put('profile', { id: 'main_profile', ...profile });
}

// Delete All Local Patient Data (Privacy requirement)
export async function clearAllLocalData(): Promise<void> {
  const db = await getDatabase();
  const tx = db.transaction(['tasks', 'appointments', 'medications', 'profile', 'meta'], 'readwrite');
  await Promise.all([
    tx.objectStore('tasks').clear(),
    tx.objectStore('appointments').clear(),
    tx.objectStore('medications').clear(),
    tx.objectStore('profile').clear(),
    tx.objectStore('meta').clear(),
    tx.done
  ]);
}

