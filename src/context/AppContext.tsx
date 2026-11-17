import React, { createContext, useContext, useState, useEffect } from 'react';
import { RecoveryTask, Appointment, Medication, PatientProfile } from '../types';
import * as storage from '../services/storageService';

interface AppContextType {
  tasks: RecoveryTask[];
  appointments: Appointment[];
  medications: Medication[];
  profile: PatientProfile;
  isLoading: boolean;
  addTask: (task: Omit<RecoveryTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: RecoveryTask) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;
  addAppointment: (appt: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAppointment: (appt: Appointment) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  addMedication: (med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMedication: (med: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  updateProfile: (profile: PatientProfile) => Promise<void>;
  clearAllData: () => Promise<void>;
  loadSampleData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<RecoveryTask[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [profile, setProfile] = useState<PatientProfile>({
    hospitalName: '',
    dischargeDate: '',
    primaryCareProvider: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allTasks, allAppts, allMeds, userProfile] = await Promise.all([
        storage.getAllTasks(),
        storage.getAllAppointments(),
        storage.getAllMedications(),
        storage.getPatientProfile()
      ]);
      setTasks(allTasks);
      setAppointments(allAppts);
      setMedications(allMeds);
      if (userProfile) setProfile(userProfile);
    } catch (e) {
      console.error('Failed to load local IndexedDB data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addTask = async (data: Omit<RecoveryTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: RecoveryTask = {
      ...data,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: now,
      updatedAt: now
    };
    await storage.saveTask(newTask);
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = async (task: RecoveryTask) => {
    const updated: RecoveryTask = {
      ...task,
      updatedAt: new Date().toISOString()
    };
    await storage.saveTask(updated);
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTask = async (id: string) => {
    await storage.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskCompleted = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updated: RecoveryTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    await storage.saveTask(updated);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const addAppointment = async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAppt: Appointment = {
      ...data,
      id: `appt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: now,
      updatedAt: now
    };
    await storage.saveAppointment(newAppt);
    setAppointments(prev => [...prev, newAppt]);
  };

  const updateAppointment = async (appt: Appointment) => {
    const updated: Appointment = {
      ...appt,
      updatedAt: new Date().toISOString()
    };
    await storage.saveAppointment(updated);
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const deleteAppointment = async (id: string) => {
    await storage.deleteAppointment(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const addMedication = async (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newMed: Medication = {
      ...data,
      id: `med-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: now,
      updatedAt: now
    };
    await storage.saveMedication(newMed);
    setMedications(prev => [...prev, newMed]);
  };

  const updateMedication = async (med: Medication) => {
    const updated: Medication = {
      ...med,
      updatedAt: new Date().toISOString()
    };
    await storage.saveMedication(updated);
    setMedications(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const deleteMedication = async (id: string) => {
    await storage.deleteMedication(id);
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const updateProfile = async (newProfile: PatientProfile) => {
    await storage.savePatientProfile(newProfile);
    setProfile(newProfile);
  };

  const clearAllData = async () => {
    await storage.clearAllLocalData();
    setTasks([]);
    setAppointments([]);
    setMedications([]);
    setProfile({
      hospitalName: '',
      dischargeDate: '',
      primaryCareProvider: '',
      emergencyContact: '',
      emergencyPhone: '',
      notes: ''
    });
  };

  const loadSampleData = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const in3Days = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    const in7Days = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

    const sampleProfile: PatientProfile = {
      hospitalName: 'Memorial Regional Hospital',
      dischargeDate: today,
      primaryCareProvider: 'Dr. Sarah Jenkins',
      emergencyContact: 'Michael (Spouse)',
      emergencyPhone: '(555) 019-2834',
      notes: 'Discharged following laparoscopic knee arthroscopy.'
    };

    const sampleTasks: Omit<RecoveryTask, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: 'Keep knee incision dry and clean',
        category: 'wound-care',
        description: 'Do not submerge incision in bath or pool. Shower only with protective waterproof covering.',
        completed: false,
        dueDate: in3Days
      },
      {
        title: 'Perform prescribed ankle pumps (10 reps every 2 hours)',
        category: 'physical-therapy',
        description: 'Improves leg circulation to prevent blood clots.',
        completed: true,
        dueDate: today
      },
      {
        title: 'Log daily morning weight and check calf swelling',
        category: 'vital-signs',
        description: 'Report any sudden increase of >3 lbs or unilateral calf redness immediately.',
        completed: false,
        dueDate: in7Days
      }
    ];

    const sampleAppts: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        providerName: 'Dr. Sarah Jenkins (PCP)',
        specialty: 'Internal Medicine',
        organization: 'Main Street Health Clinic',
        date: in7Days,
        time: '10:30 AM',
        isScheduled: true,
        phone: '(555) 234-5678',
        location: 'Suite 400, Medical Arts Pavilion',
        reasonForVisit: 'Post-op medication check and wound evaluation'
      },
      {
        providerName: 'Orthopedic Rehabilitation Center',
        specialty: 'Physical Therapy',
        organization: 'Metro Ortho Physical Therapy',
        isScheduled: false,
        phone: '(555) 876-5432',
        reasonForVisit: 'Initial PT assessment and range of motion evaluation'
      }
    ];

    const sampleMeds: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Metoprolol Tartrate',
        dosage: '25 mg',
        route: 'Oral',
        frequency: 'Twice daily (BID)',
        instructions: 'Take with or immediately after food.',
        purpose: 'Blood pressure and heart rate control',
        status: 'continued',
        schedule: { morning: true, afternoon: false, evening: true, bedtime: false, asNeeded: false }
      },
      {
        name: 'Enoxaparin (Lovenox)',
        dosage: '40 mg / 0.4 mL',
        route: 'Subcutaneous injection',
        frequency: 'Once daily for 10 days',
        instructions: 'Inject into lower abdomen, alternating sides. Do not expel air bubble.',
        purpose: 'DVT Blood clot prevention post-surgery',
        status: 'new',
        schedule: { morning: true, afternoon: false, evening: false, bedtime: false, asNeeded: false }
      },
      {
        name: 'Aspirin (Pre-discharge regimen)',
        dosage: '325 mg',
        route: 'Oral',
        frequency: 'Discontinued',
        instructions: 'STOP taking while on therapeutic Enoxaparin to prevent excess bleeding.',
        purpose: 'Blood thinner',
        status: 'discontinued',
        schedule: { morning: false, afternoon: false, evening: false, bedtime: false, asNeeded: false }
      }
    ];

    await updateProfile(sampleProfile);
    for (const t of sampleTasks) await addTask(t);
    for (const a of sampleAppts) await addAppointment(a);
    for (const m of sampleMeds) await addMedication(m);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        appointments,
        medications,
        profile,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addMedication,
        updateMedication,
        deleteMedication,
        updateProfile,
        clearAllData,
        loadSampleData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

