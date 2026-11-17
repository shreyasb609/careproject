import { ExtractedItem, RecoveryTask, Appointment, Medication, TaskCategory, MedicationStatus } from '../types';
import { findMatchingTermsInText } from '../data/medicalDictionary';

export interface InterpretationResult {
  rawText: string;
  recognizedTerms: ReturnType<typeof findMatchingTermsInText>;
  suggestedTasks: ExtractedItem[];
  suggestedAppointments: ExtractedItem[];
  suggestedMedications: ExtractedItem[];
  clarificationFlags: string[];
}

/**
 * Rule-based, deterministic parser for discharge documents.
 * Never invents dosages or clinical treatments.
 * Flags any ambiguous or uncertain lines for explicit doctor clarification.
 */
export function interpretDischargeText(rawText: string): InterpretationResult {
  const lines = rawText.split(/\r?\n/);
  const recognizedTerms = findMatchingTermsInText(rawText);

  const suggestedTasks: ExtractedItem[] = [];
  const suggestedAppointments: ExtractedItem[] = [];
  const suggestedMedications: ExtractedItem[] = [];
  const clarificationFlags: string[] = [];

  let currentSection: 'unknown' | 'medications' | 'appointments' | 'instructions' | 'precautions' = 'unknown';

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const lower = rawLine.toLowerCase();

    // Section header identification (e.g. "FOLLOW-UP:", "MEDICATIONS:", "INSTRUCTIONS:")
    if (/^(medications?|prescriptions?|discharge medications?|rx list)[\s:]*$/i.test(lower)) {
      currentSection = 'medications';
      continue;
    }
    if (/^(follow[ -]?up|appointments?|upcoming visits?|clinic visits?)[\s:]*$/i.test(lower)) {
      currentSection = 'appointments';
      continue;
    }
    if (/^(discharge instructions?|instructions?|activity|recovery plan|wound care|diet|precautions)[\s:]*$/i.test(lower)) {
      currentSection = 'instructions';
      continue;
    }

    // 1. Follow-up / Appointment heuristic detection
    if (
      currentSection === 'appointments' ||
      /\b(follow[ -]?up|f\/u|see dr\.|appointment with|clinic in|return in|return to clinic)\b/i.test(lower)
    ) {
      const isCandidate = lower.length > 5 && !lower.startsWith('instructions');
      if (isCandidate) {
        // Detect timeframe or dates
        const dateMatch = rawLine.match(/\b(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})\b/);
        const relativeMatch = rawLine.match(/\b(in\s+\d+\s+(?:days?|weeks?|months?)|within\s+\d+\s+(?:days?|weeks?))\b/i);
        const providerMatch = rawLine.match(/(?:Dr\.|Doctor|PCP|Clinic|Surgeon|Cardiologist|Orthopedist|Provider)(?:\s+[A-Z][a-zA-Z\-]+(?:\s+[A-Z][a-zA-Z\-]+)?)?/i);

        const providerName = providerMatch ? providerMatch[0] : 'Healthcare Provider / Clinic';
        const timeframe = dateMatch ? dateMatch[0] : (relativeMatch ? relativeMatch[0] : 'Needs scheduling');
        const needsClarification = !dateMatch && !relativeMatch;

        suggestedAppointments.push({
          id: `extracted-appt-${i}-${Date.now()}`,
          type: 'appointment',
          rawSnippet: rawLine,
          confidence: dateMatch || providerMatch ? 'high' : 'medium',
          title: `Follow-up: ${providerName}`,
          details: {
            providerName: providerName,
            timeframe: timeframe,
            rawText: rawLine,
            isScheduled: !!dateMatch
          },
          confirmed: false,
          needsClarification: needsClarification,
          clarificationReason: needsClarification ? 'Specific date and provider are not explicitly confirmed. Please verify with clinic.' : undefined
        });

        if (needsClarification) {
          clarificationFlags.push(`Appointment note "${rawLine}" requires confirmation of specific clinic date and time.`);
        }
        continue;
      }
    }

    // 2. Medication heuristic detection
    // e.g. "Metoprolol 25 mg PO BID", "Lisinopril 10mg once daily", "STOP Aspirin"
    const dosageMatch = rawLine.match(/\b(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|units?|tablets?|capsules?|puffs?))\b/i);
    const stopMatch = /\b(stop|discontinue|d\/c|hold)\b/i.test(lower);
    const newMatch = /\b(new|start|prescribed|initiated)\b/i.test(lower);

    if (currentSection === 'medications' || (currentSection !== 'appointments' && currentSection !== 'instructions' && (dosageMatch || stopMatch))) {
      if (rawLine.length > 3 && rawLine.length < 150) {
        let status: MedicationStatus = 'continued';
        if (stopMatch) status = 'discontinued';
        else if (newMatch) status = 'new';

        // Frequency clues
        let freq = 'As directed';
        if (/\b(bid|b\.i\.d\.|twice daily|twice a day|every 12 hours)\b/i.test(lower)) freq = 'Twice daily (BID)';
        else if (/\b(tid|t\.i\.d\.|three times daily|every 8 hours)\b/i.test(lower)) freq = 'Three times daily (TID)';
        else if (/\b(qid|q\.i\.d\.|four times daily)\b/i.test(lower)) freq = 'Four times daily (QID)';
        else if (/\b(daily|qd|q\.d\.|every day|once daily|qam|qpm)\b/i.test(lower)) freq = 'Once daily';
        else if (/\b(prn|p\.r\.n\.|as needed)\b/i.test(lower)) freq = 'As needed (PRN)';

        // Route clues
        let route = 'Oral';
        if (/\b(subq|sq|sc|subcutaneous)\b/i.test(lower)) route = 'Subcutaneous injection';
        else if (/\b(iv|intravenous)\b/i.test(lower)) route = 'Intravenous';
        else if (/\b(topical|cream|ointment)\b/i.test(lower)) route = 'Topical';
        else if (/\b(inhale|inhaler|puff)\b/i.test(lower)) route = 'Inhalation';

        const hasDose = !!dosageMatch;
        const ambiguityInDose = !hasDose && !stopMatch;

        suggestedMedications.push({
          id: `extracted-med-${i}-${Date.now()}`,
          type: 'medication',
          rawSnippet: rawLine,
          confidence: hasDose ? 'high' : 'medium',
          title: rawLine.split(/\s+[-–:]\s+|\s{2,}/)[0],
          details: {
            rawText: rawLine,
            dosage: dosageMatch ? dosageMatch[0] : 'See raw text',
            frequency: freq,
            route: route,
            status: status
          },
          confirmed: false,
          needsClarification: ambiguityInDose,
          clarificationReason: ambiguityInDose ? 'Exact dosage amount was not explicitly identified in this line.' : undefined
        });

        if (ambiguityInDose) {
          clarificationFlags.push(`Medication "${rawLine}": Missing explicit dosage amount. Always confirm exact prescription strength with your pharmacist.`);
        }
        continue;
      }
    }

    // 3. Instructions & Tasks (Wound care, Activity, Diet, Vitals, Precautions)
    if (
      currentSection === 'instructions' ||
      /\b(keep dry|dressing change|clean wound|take temperature|log weight|crutches|ice|elevate|do not drive|do not lift|call doctor if|seek emergency|monitor)\b/i.test(lower)
    ) {
      if (rawLine.length > 8 && rawLine.length < 200) {
        let cat: TaskCategory = 'general';
        if (/\b(wound|dressing|incision|bandage|sutures?|staples?)\b/i.test(lower)) cat = 'wound-care';
        else if (/\b(weight|temperature|bp|blood pressure|pulse|sugar|glucose)\b/i.test(lower)) cat = 'vital-signs';
        else if (/\b(walk|pt|crutches|weight bearing|therapy|exercise|stretch|elevate)\b/i.test(lower)) cat = 'physical-therapy';
        else if (/\b(diet|fluid|drink|water|salt|sodium|eat|low-fat|nutrition)\b/i.test(lower)) cat = 'diet-hydration';
        else if (/\b(walker|cane|wheelchair|brace|splint|cpap|oxygen)\b/i.test(lower)) cat = 'equipment';

        // Check if precaution vs routine task
        const isEmergencyWarning = /\b(seek emergency|call 911|fever over|severe pain|shortness of breath|bleeding heavily)\b/i.test(lower);

        suggestedTasks.push({
          id: `extracted-task-${i}-${Date.now()}`,
          type: 'task',
          rawSnippet: rawLine,
          confidence: 'high',
          title: rawLine,
          details: {
            category: cat,
            isWarning: isEmergencyWarning
          },
          confirmed: false,
          needsClarification: isEmergencyWarning,
          clarificationReason: isEmergencyWarning ? 'Red-flag symptom instruction: If you experience these symptoms, contact emergency medical care immediately.' : undefined
        });
      }
    }
  }

  return {
    rawText,
    recognizedTerms,
    suggestedTasks,
    suggestedAppointments,
    suggestedMedications,
    clarificationFlags
  };
}
