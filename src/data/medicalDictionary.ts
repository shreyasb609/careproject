import { MedicalTerm } from '../types';

export const MEDICAL_DICTIONARY: MedicalTerm[] = [
  // Medication Frequency & Latin Abbreviations
  {
    id: 'bid',
    term: 'BID / b.i.d.',
    expanded: 'Bis in die (twice a day)',
    plainLanguage: 'Take or do this twice every day, usually spaced evenly (for example morning and evening).',
    category: 'medication',
    source: 'NIH MedlinePlus Medical Abbreviations',
    contextClues: ['medication', 'tablet', 'dose']
  },
  {
    id: 'tid',
    term: 'TID / t.i.d.',
    expanded: 'Ter in die (three times a day)',
    plainLanguage: 'Take or do this three times each day, typically about every 8 hours with meals or as instructed.',
    category: 'medication',
    source: 'NIH MedlinePlus Medical Abbreviations',
    contextClues: ['medication', 'tablet', 'dose']
  },
  {
    id: 'qid',
    term: 'QID / q.i.d.',
    expanded: 'Quater in die (four times a day)',
    plainLanguage: 'Take or do this four times each day, evenly spaced while awake.',
    category: 'medication',
    source: 'NIH MedlinePlus Medical Abbreviations',
    contextClues: ['medication', 'dose']
  },
  {
    id: 'qd',
    term: 'QD / q.d.',
    expanded: 'Quaque die (every day)',
    plainLanguage: 'Take once every day. Note: The Institute for Safe Medication Practices recommends writing "daily" to avoid dangerous confusion with QID.',
    category: 'medication',
    source: 'ISMP Do Not Use List',
    ambiguityWarning: 'HIGH RISK: QD can be misread as QID (4 times a day) or QOD (every other day). Always verify your exact prescribed daily frequency with your pharmacist.',
    contextClues: ['daily', 'medication']
  },
  {
    id: 'qod',
    term: 'QOD / q.o.d.',
    expanded: 'Quaque altera die (every other day)',
    plainLanguage: 'Take every other day (skip one day in between).',
    category: 'medication',
    source: 'ISMP Error-Prone Abbreviations List',
    ambiguityWarning: 'HIGH RISK: Frequently mistaken for QD (daily). Double check with your pharmacist before taking medication every other day.',
    contextClues: ['every other day']
  },
  {
    id: 'prn',
    term: 'PRN / p.r.n.',
    expanded: 'Pro re nata (as needed)',
    plainLanguage: 'Take only when necessary for specific symptoms (such as pain, fever, or nausea), rather than on a strict scheduled routine.',
    category: 'medication',
    source: 'NIH MedlinePlus Medical Abbreviations',
    contextClues: ['pain', 'as needed', 'nausea']
  },
  {
    id: 'po',
    term: 'PO / p.o.',
    expanded: 'Per os (by mouth / orally)',
    plainLanguage: 'Swallow this medicine by mouth (e.g. tablet, capsule, or liquid). Do not crush unless explicitly instructed.',
    category: 'medication',
    source: 'NIH MedlinePlus',
    contextClues: ['swallow', 'tablet', 'mouth']
  },
  {
    id: 'npo',
    term: 'NPO / n.p.o.',
    expanded: 'Nil per os (nothing by mouth)',
    plainLanguage: 'Do not eat or drink anything (including water, coffee, or snacks). Often required before surgery or specific fasting blood tests.',
    category: 'discharge',
    source: 'American Society of Anesthesiologists',
    contextClues: ['fasting', 'surgery', 'procedure']
  },
  {
    id: 'hs',
    term: 'HS / h.s.',
    expanded: 'Hora somni (at bedtime)',
    plainLanguage: 'Take this medication right before going to sleep at night.',
    category: 'medication',
    source: 'ISMP List of Error-Prone Abbreviations',
    ambiguityWarning: 'Can be confused with "half strength". If taking a split dose or unfamiliar strength, confirm with your pharmacist.',
    contextClues: ['bedtime', 'night', 'sleep']
  },
  {
    id: 'ac',
    term: 'AC / a.c.',
    expanded: 'Ante cibum (before meals)',
    plainLanguage: 'Take before eating food, usually 30 to 60 minutes prior to a meal.',
    category: 'medication',
    source: 'NIH MedlinePlus',
    contextClues: ['meal', 'food', 'before']
  },
  {
    id: 'pc',
    term: 'PC / p.c.',
    expanded: 'Post cibum (after meals)',
    plainLanguage: 'Take right after finishing a meal, or with food in your stomach to prevent stomach upset.',
    category: 'medication',
    source: 'NIH MedlinePlus',
    contextClues: ['meal', 'food', 'after']
  },

  // Discharge & General Medical Terminology
  {
    id: 'd-c',
    term: 'DC / D/C',
    expanded: 'Discontinue OR Discharge',
    plainLanguage: 'Depending on context, this means either STOPPING a medication/treatment or being DISCHARGED from the hospital.',
    category: 'discharge',
    source: 'ISMP Do Not Use List',
    ambiguityWarning: 'AMBIGUOUS: When seen next to a medication ("D/C Metoprolol"), it means STOP taking it. When seen in discharge notes ("D/C to home"), it means released to home.',
    contextClues: ['stop', 'home', 'hospital']
  },
  {
    id: 'ama',
    term: 'AMA',
    expanded: 'Against Medical Advice OR American Medical Association',
    plainLanguage: 'In a discharge record, AMA usually indicates a patient chose to leave the hospital before the treatment team formally recommended discharge.',
    category: 'discharge',
    source: 'American College of Emergency Physicians',
    ambiguityWarning: 'Can mean American Medical Association or Against Medical Advice depending on context.',
    contextClues: ['discharge', 'departure', 'hospital']
  },
  {
    id: 'snf',
    term: 'SNF',
    expanded: 'Skilled Nursing Facility',
    plainLanguage: 'A temporary rehabilitation center providing 24-hour medical, nursing, and physical therapy care before returning completely home.',
    category: 'rehabilitation',
    source: 'Centers for Medicare & Medicaid Services (CMS)',
    contextClues: ['rehab', 'facility', 'nursing']
  },
  {
    id: 'ot',
    term: 'OT',
    expanded: 'Occupational Therapy',
    plainLanguage: 'Therapy focused on helping you safely perform daily living activities like dressing, bathing, cooking, and writing.',
    category: 'rehabilitation',
    source: 'American Occupational Therapy Association (AOTA)',
    contextClues: ['therapy', 'daily activities', 'rehab']
  },
  {
    id: 'pt',
    term: 'PT',
    expanded: 'Physical Therapy OR Patient OR Prothrombin Time',
    plainLanguage: 'Most often refers to physical therapy exercises for walking, balance, and leg strength. In lab reports, it can mean a blood clotting test (Prothrombin Time).',
    category: 'rehabilitation',
    source: 'American Physical Therapy Association (APTA)',
    ambiguityWarning: 'AMBIGUOUS: Can mean Physical Therapy, Patient, or Prothrombin Time (blood clotting test). Check surrounding words.',
    contextClues: ['exercise', 'mobility', 'walking', 'lab', 'clot']
  },
  {
    id: 'wb',
    term: 'WBAT',
    expanded: 'Weight Bearing As Tolerated',
    plainLanguage: 'You are allowed to put as much weight on your injured or operated leg as you comfortably can without severe pain.',
    category: 'rehabilitation',
    source: 'American Academy of Orthopaedic Surgeons',
    contextClues: ['ortho', 'leg', 'walking', 'crutches']
  },
  {
    id: 'nwb',
    term: 'NWB',
    expanded: 'Non-Weight Bearing',
    plainLanguage: 'CRITICAL INSTRUCTION: Do NOT let your affected leg or foot touch the ground at all. Use crutches, a walker, or a wheelchair.',
    category: 'rehabilitation',
    source: 'American Academy of Orthopaedic Surgeons',
    contextClues: ['ortho', 'leg', 'foot', 'walker', 'crutches']
  },
  {
    id: 'pwb',
    term: 'PWB',
    expanded: 'Partial Weight Bearing',
    plainLanguage: 'Only put a small portion of your body weight (often a specific percentage or light toe-touch) on your healing leg as prescribed.',
    category: 'rehabilitation',
    source: 'American Academy of Orthopaedic Surgeons',
    contextClues: ['ortho', 'crutches', 'leg']
  },
  {
    id: 'ttwb',
    term: 'TTWB',
    expanded: 'Toe-Touch Weight Bearing',
    plainLanguage: 'Only the tips of your toes on the injured leg may lightly touch the floor for balance; no actual body weight should be placed on that foot.',
    category: 'rehabilitation',
    source: 'American Academy of Orthopaedic Surgeons',
    contextClues: ['ortho', 'balance', 'crutches']
  },
  {
    id: 'adls',
    term: 'ADLs',
    expanded: 'Activities of Daily Living',
    plainLanguage: 'Basic personal self-care tasks you do every day, such as eating, bathing, dressing, grooming, and getting out of bed.',
    category: 'rehabilitation',
    source: 'National Institutes of Health (NIH)',
    contextClues: ['dressing', 'bathing', 'home care']
  },
  {
    id: 'rom',
    term: 'ROM',
    expanded: 'Range of Motion',
    plainLanguage: 'How far you can move or bend a specific joint (e.g. knee, shoulder, or elbow) in various directions.',
    category: 'rehabilitation',
    source: 'American Physical Therapy Association',
    contextClues: ['joint', 'exercise', 'knee', 'shoulder']
  },

  // Common Clinical & Follow-Up Terminology
  {
    id: 'pcp',
    term: 'PCP',
    expanded: 'Primary Care Physician / Primary Care Provider',
    plainLanguage: 'Your regular main family doctor, internist, or nurse practitioner who coordinates your long-term ongoing medical care.',
    category: 'instructions',
    source: 'American Academy of Family Physicians',
    contextClues: ['doctor', 'appointment', 'clinic']
  },
  {
    id: 'fu',
    term: 'F/U or f/u',
    expanded: 'Follow-Up',
    plainLanguage: 'A return visit or check-up scheduled with your healthcare provider to monitor your healing and adjust treatments.',
    category: 'instructions',
    source: 'CDC / Joint Commission',
    contextClues: ['appointment', 'clinic', 'visit', 'weeks', 'days']
  },
  {
    id: 'ed-er',
    term: 'ED / ER',
    expanded: 'Emergency Department / Emergency Room',
    plainLanguage: 'Hospital department equipped for immediate medical attention for life-threatening emergencies and acute symptoms.',
    category: 'discharge',
    source: 'American College of Emergency Physicians',
    contextClues: ['emergency', 'hospital', 'symptoms']
  },
  {
    id: 'sob',
    term: 'SOB',
    expanded: 'Shortness of Breath',
    plainLanguage: 'Difficulty breathing, breathlessness, or feeling like you cannot get enough air into your lungs. If sudden or severe, call 911 or emergency services.',
    category: 'vitals',
    source: 'American Thoracic Society',
    ambiguityWarning: 'In medical records, SOB strictly stands for Shortness of Breath. Sudden onset requires urgent medical attention.',
    contextClues: ['breathing', 'respiratory', 'chest']
  },
  {
    id: 'bp',
    term: 'BP',
    expanded: 'Blood Pressure',
    plainLanguage: 'The pressure of circulating blood against the walls of blood vessels, recorded as systolic over diastolic (e.g. 120/80 mmHg).',
    category: 'vitals',
    source: 'American Heart Association',
    contextClues: ['vitals', 'hypertension', 'systolic']
  },
  {
    id: 'hr',
    term: 'HR',
    expanded: 'Heart Rate',
    plainLanguage: 'The number of times your heart beats in one minute (usually between 60 to 100 beats per minute at rest).',
    category: 'vitals',
    source: 'American Heart Association',
    contextClues: ['pulse', 'beats', 'vitals']
  },
  {
    id: 'spo2',
    term: 'SpO2 / O2 Sat',
    expanded: 'Oxygen Saturation',
    plainLanguage: 'The percentage of oxygen being carried in your red blood cells, commonly measured using a fingertip pulse oximeter (normal is usually 95%–100%).',
    category: 'vitals',
    source: 'NIH National Heart, Lung, and Blood Institute',
    contextClues: ['pulse oximeter', 'breathing', 'oxygen']
  },
  {
    id: 'dvt',
    term: 'DVT',
    expanded: 'Deep Vein Thrombosis',
    plainLanguage: 'A blood clot that forms in a deep vein, most commonly in the legs. Warning signs include leg swelling, warmth, redness, or calf tenderness.',
    category: 'discharge',
    source: 'CDC Deep Vein Thrombosis Information',
    contextClues: ['clot', 'blood thinners', 'swelling', 'leg']
  },
  {
    id: 'pe',
    term: 'PE',
    expanded: 'Pulmonary Embolism OR Physical Exam',
    plainLanguage: 'In post-surgery risk warnings, PE means a blood clot that has traveled to the lungs (a medical emergency). In clinical notes, it can also mean "Physical Examination".',
    category: 'discharge',
    source: 'NIH / ISMP',
    ambiguityWarning: 'AMBIGUOUS: In warning sections, means Pulmonary Embolism (blood clot in lung - emergency). In clinical doctor notes, means Physical Exam.',
    contextClues: ['chest pain', 'clot', 'shortness of breath', 'doctor exam']
  },
  {
    id: 'uti',
    term: 'UTI',
    expanded: 'Urinary Tract Infection',
    plainLanguage: 'An infection in the urinary system (bladder, kidneys). Symptoms include burning during urination, frequent urination, or cloudy urine.',
    category: 'discharge',
    source: 'CDC / NIH',
    contextClues: ['urine', 'antibiotic', 'bladder']
  },
  {
    id: 'inr',
    term: 'INR / PT-INR',
    expanded: 'International Normalized Ratio',
    plainLanguage: 'A standardized blood test measuring how fast your blood clots, commonly tested for patients taking warfarin / Coumadin blood thinners.',
    category: 'lab-imaging',
    source: 'American Heart Association',
    contextClues: ['warfarin', 'coumadin', 'blood test', 'clotting']
  },
  {
    id: 'cbc',
    term: 'CBC',
    expanded: 'Complete Blood Count',
    plainLanguage: 'A common blood test evaluating overall health by measuring red cells (oxygen carriers), white cells (infection fighters), and platelets (clotting).',
    category: 'lab-imaging',
    source: 'NIH MedlinePlus',
    contextClues: ['blood test', 'lab', 'white blood cells', 'hemoglobin']
  },
  {
    id: 'bmp-cmp',
    term: 'BMP / CMP',
    expanded: 'Basic / Comprehensive Metabolic Panel',
    plainLanguage: 'A blood test measuring electrolytes (sodium, potassium), blood sugar (glucose), and kidney/liver function.',
    category: 'lab-imaging',
    source: 'NIH MedlinePlus',
    contextClues: ['blood test', 'electrolytes', 'kidneys', 'potassium']
  },
  {
    id: 'nsaid',
    term: 'NSAID',
    expanded: 'Nonsteroidal Anti-Inflammatory Drug',
    plainLanguage: 'Medications that reduce pain, fever, and inflammation (like ibuprofen, naproxen, Advil, Aleve, or Celebrex). May irritate the stomach or interact with blood thinners.',
    category: 'medication',
    source: 'US FDA',
    contextClues: ['pain', 'ibuprofen', 'aleve', 'inflammation']
  },
  {
    id: 'subq',
    term: 'SubQ / SQ / SC',
    expanded: 'Subcutaneous',
    plainLanguage: 'Administered as a gentle injection under the skin into the fatty layer (such as with insulin or enoxaparin/Lovenox injections).',
    category: 'medication',
    source: 'ISMP Error-Prone Abbreviations',
    contextClues: ['injection', 'needle', 'insulin', 'lovenox']
  },
  {
    id: 'im',
    term: 'IM',
    expanded: 'Intramuscular',
    plainLanguage: 'Administered as an injection directly into a muscle (such as vaccines or certain pain medications).',
    category: 'medication',
    source: 'NIH MedlinePlus',
    contextClues: ['injection', 'muscle']
  },
  {
    id: 'iv',
    term: 'IV',
    expanded: 'Intravenous',
    plainLanguage: 'Administered directly into a vein through a small tube or catheter.',
    category: 'medication',
    source: 'NIH MedlinePlus',
    contextClues: ['infusion', 'vein', 'drip']
  },
  {
    id: 'rx',
    term: 'Rx',
    expanded: 'Prescription / Recipe',
    plainLanguage: 'A doctor’s written order for a specific medication or therapeutic treatment to be dispensed by a pharmacy.',
    category: 'medication',
    source: 'US Pharmacopeia',
    contextClues: ['pharmacy', 'medicine', 'prescription']
  },
  {
    id: 'otc',
    term: 'OTC',
    expanded: 'Over-the-Counter',
    plainLanguage: 'Medications, supplements, or treatments that can be purchased at a drugstore or grocery without a doctor’s prescription.',
    category: 'medication',
    source: 'US FDA',
    contextClues: ['pharmacy', 'store', 'supplement']
  },
  {
    id: 'w-c',
    term: 'W/C',
    expanded: 'Wheelchair',
    plainLanguage: 'Wheelchair assistance or equipment.',
    category: 'rehabilitation',
    source: 'CMS Medical Equipment Guidelines',
    contextClues: ['mobility', 'equipment', 'wheelchair']
  },
  {
    id: 'dme',
    term: 'DME',
    expanded: 'Durable Medical Equipment',
    plainLanguage: 'Medical equipment ordered for home use that can withstand repeated use, such as hospital beds, walkers, oxygen tanks, or shower chairs.',
    category: 'rehabilitation',
    source: 'Medicare.gov',
    contextClues: ['walker', 'cane', 'oxygen', 'equipment']
  },
  {
    id: 'hh-hha',
    term: 'HH / HHA',
    expanded: 'Home Health / Home Health Aide',
    plainLanguage: 'Skilled nursing, therapy, or personal care services delivered directly in your home following hospital discharge.',
    category: 'discharge',
    source: 'Centers for Medicare & Medicaid Services',
    contextClues: ['nurse', 'visit', 'home health']
  }
];

export function searchMedicalDictionary(query: string, categoryFilter?: string): MedicalTerm[] {
  if (!query && !categoryFilter) return MEDICAL_DICTIONARY;
  const q = query.trim().toLowerCase();

  return MEDICAL_DICTIONARY.filter(item => {
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || item.category === categoryFilter;
    if (!matchesCategory) return false;
    if (!q) return true;

    return (
      item.term.toLowerCase().includes(q) ||
      item.expanded.toLowerCase().includes(q) ||
      item.plainLanguage.toLowerCase().includes(q) ||
      (item.ambiguityWarning && item.ambiguityWarning.toLowerCase().includes(q))
    );
  });
}

export function findMatchingTermsInText(text: string): MedicalTerm[] {
  if (!text) return [];
  const found: MedicalTerm[] = [];
  const normalizedText = ` ${text} `.replace(/[\r\n\t,;:.]/g, ' ');

  for (const item of MEDICAL_DICTIONARY) {
    // Generate clean regex search tokens from term
    const cleanTermVariants = item.term
      .split('/')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    for (const variant of cleanTermVariants) {
      // Escape special characters for regex
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Case-insensitive word boundary match
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(normalizedText)) {
        if (!found.some(existing => existing.id === item.id)) {
          found.push(item);
        }
        break;
      }
    }
  }

  return found;
}

