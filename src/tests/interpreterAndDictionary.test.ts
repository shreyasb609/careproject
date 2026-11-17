import { describe, it, expect } from 'vitest';
import { searchMedicalDictionary, findMatchingTermsInText, MEDICAL_DICTIONARY } from '../data/medicalDictionary';
import { interpretDischargeText } from '../services/interpreterService';

describe('Medical Terminology & Safety Rules', () => {
  it('contains comprehensive medical abbreviations and plain language translations', () => {
    expect(MEDICAL_DICTIONARY.length).toBeGreaterThan(15);
    const bid = MEDICAL_DICTIONARY.find(m => m.id === 'bid');
    expect(bid).toBeDefined();
    expect(bid?.plainLanguage).toContain('twice');
  });

  it('correctly flags dangerous and ambiguous abbreviations', () => {
    const qd = MEDICAL_DICTIONARY.find(m => m.id === 'qd');
    expect(qd?.ambiguityWarning).toBeDefined();
    expect(qd?.ambiguityWarning).toContain('HIGH RISK');

    const pe = MEDICAL_DICTIONARY.find(m => m.id === 'pe');
    expect(pe?.ambiguityWarning).toBeDefined();
    expect(pe?.ambiguityWarning).toContain('Pulmonary Embolism');
  });

  it('identifies recognized terms in discharge sentences', () => {
    const sample = 'Patient discharged with instructions to take Metoprolol PO BID with meals and remain NWB on left ankle.';
    const matches = findMatchingTermsInText(sample);
    const ids = matches.map(m => m.id);

    expect(ids).toContain('po');
    expect(ids).toContain('bid');
    expect(ids).toContain('nwb');
  });

  it('filters dictionary by query and category', () => {
    const medResults = searchMedicalDictionary('twice', 'medication');
    expect(medResults.some(r => r.id === 'bid')).toBe(true);

    const vitalsResults = searchMedicalDictionary('pressure', 'vitals');
    expect(vitalsResults.some(r => r.id === 'bp')).toBe(true);
  });
});

describe('Discharge Document Interpreter (Rule-Based)', () => {
  const sampleNote = `
DISCHARGE MEDICATIONS:
Metoprolol 25 mg PO BID with food
Enoxaparin 40 mg SubQ daily
STOP Aspirin 325 mg immediately
UnknownPill as needed

FOLLOW-UP:
Follow-up with Dr. Sarah Jenkins in 7 days
Return to clinic in 2 weeks for rehab

INSTRUCTIONS:
Keep incision dry and clean
Dressing change every 2 days
Call 911 if experiencing sudden shortness of breath
`;

  it('extracts medications and preserves explicit status without guessing', () => {
    const result = interpretDischargeText(sampleNote);
    expect(result.suggestedMedications.length).toBeGreaterThanOrEqual(3);

    const stopMed = result.suggestedMedications.find(m => m.title.toLowerCase().includes('aspirin'));
    expect(stopMed?.details.status).toBe('discontinued');

    const metoprolol = result.suggestedMedications.find(m => m.title.toLowerCase().includes('metoprolol'));
    expect(metoprolol?.details.dosage).toBe('25 mg');
    expect(metoprolol?.details.frequency).toContain('Twice daily');
  });

  it('flags uncertain medication dosages for clarification instead of guessing', () => {
    const result = interpretDischargeText(sampleNote);
    const uncertainMed = result.suggestedMedications.find(m => m.title.toLowerCase().includes('unknownpill'));
    expect(uncertainMed).toBeDefined();
    expect(uncertainMed?.needsClarification).toBe(true);
    expect(uncertainMed?.clarificationReason).toContain('dosage');
  });

  it('identifies follow-up appointments with tentative scheduling flag', () => {
    const result = interpretDischargeText(sampleNote);
    expect(result.suggestedAppointments.length).toBeGreaterThanOrEqual(2);
    
    const drAppt = result.suggestedAppointments.find(a => a.rawSnippet.includes('Jenkins'));
    expect(drAppt).toBeDefined();
    expect(drAppt?.details.providerName).toContain('Dr. Sarah Jenkins');
  });

  it('categorizes recovery tasks and flags emergency precautions', () => {
    const result = interpretDischargeText(sampleNote);
    expect(result.suggestedTasks.length).toBeGreaterThanOrEqual(2);

    const woundTask = result.suggestedTasks.find(t => t.title.toLowerCase().includes('incision'));
    expect(woundTask?.details.category).toBe('wound-care');

    const emergencyWarning = result.suggestedTasks.find(t => t.title.toLowerCase().includes('call 911'));
    expect(emergencyWarning?.details.isWarning).toBe(true);
    expect(emergencyWarning?.needsClarification).toBe(true);
  });
});
