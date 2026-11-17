import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Check, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Info,
  Calendar,
  Pill,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { extractTextFromPdf } from '../services/pdfExtractorService';
import { interpretDischargeText, InterpretationResult } from '../services/interpreterService';
import { useApp } from '../context/AppContext';
import { ExtractedItem, TaskCategory } from '../types';

export const DocumentInterpreterPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { addTask, addAppointment, addMedication } = useApp();

  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState<InterpretationResult | null>(null);

  // Status for each added item to prevent double-adding
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const sampleDischargeNotes = `DISCHARGE SUMMARY & INSTRUCTIONS
Patient: Jane Doe
Discharge Date: 11/16/2026

DISCHARGE MEDICATIONS:
- Metoprolol Tartrate 25 mg PO BID with meals (continued)
- Enoxaparin 40 mg SubQ once daily for 10 days (new prescription)
- STOP Aspirin 325 mg daily immediately while on Enoxaparin
- Acetaminophen 500 mg PO PRN every 6 hours as needed for mild pain

FOLLOW-UP APPOINTMENTS:
- Dr. Sarah Jenkins (PCP) in 7 days for post-op wound check
- Follow-up with Orthopedic Rehabilitation Clinic in 2 weeks for physical therapy evaluation
- Call Clinic at (555) 234-5678 if unable to reach surgeon

ACTIVITY & RECOVERY INSTRUCTIONS:
- Non-weight bearing (NWB) on right lower extremity with crutches for 2 weeks
- Keep incision clean and dry; do not submerge in water until staples removed
- Dressing change every 48 hours or when soiled
- Log morning weight daily; report weight gain over 3 lbs
- Warning: Seek emergency medical care or call 911 immediately if experiencing sudden shortness of breath (SOB), chest pain, or high fever over 101F.`;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF file.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage('');
      const text = await extractTextFromPdf(file);
      setRawText(text);
      const parsed = interpretDischargeText(text);
      setResults(parsed);
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Failed to extract text from PDF. You can also paste the text directly below.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessText = () => {
    if (!rawText.trim()) return;
    setIsProcessing(true);
    try {
      const parsed = interpretDischargeText(rawText);
      setResults(parsed);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmTask = async (item: ExtractedItem) => {
    await addTask({
      title: item.title,
      description: item.rawSnippet,
      category: (item.details.category as TaskCategory) || 'general',
      completed: false
    });
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
  };

  const handleConfirmAppointment = async (item: ExtractedItem) => {
    await addAppointment({
      providerName: item.details.providerName || item.title,
      isScheduled: item.details.isScheduled || false,
      reasonForVisit: item.rawSnippet,
      notes: `Extracted from discharge text: ${item.rawSnippet}`
    });
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
  };

  const handleConfirmMedication = async (item: ExtractedItem) => {
    const freq = item.details.frequency || 'As directed';
    const isBid = /bid/i.test(freq);
    const isTid = /tid/i.test(freq);
    const isPrn = /prn|as needed/i.test(freq);

    await addMedication({
      name: item.title,
      dosage: item.details.dosage || 'See instructions',
      route: item.details.route || 'Oral',
      frequency: freq,
      instructions: item.details.rawText || item.rawSnippet,
      status: item.details.status || 'continued',
      schedule: {
        morning: isBid || isTid || !isPrn,
        afternoon: isTid,
        evening: isBid || isTid,
        bedtime: false,
        asNeeded: isPrn
      }
    });
    setAddedItems(prev => ({ ...prev, [item.id]: true }));
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-calm-900 tracking-tight">Discharge Document Interpreter</h1>
        <p className="text-sm text-calm-500 mt-1">
          Rule-based local parser. Extracts medical terms, appointments, medications, and tasks without transmitting data outside your browser.
        </p>
      </div>

      {/* Security and Privacy Assurance */}
      <div className="bg-sage-50 border border-sage-500/20 rounded-xl p-4 flex items-start space-x-3 text-xs text-sage-900">
        <ShieldCheck className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>100% In-Browser Privacy:</strong> Your discharge paperwork is parsed locally using deterministic rules. 
          It never passes through external cloud servers, and no AI chatbots or third parties can see your medical records.
        </div>
      </div>

      {/* Input Section: Upload or Paste */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Upload Card */}
        <div className="bg-white p-6 rounded-xl border border-calm-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-calm-900">Upload Hospital PDF Document</h2>
            <p className="text-xs text-calm-500 mt-1">
              Select your discharge summary PDF. The text will be extracted safely on your computer.
            </p>
          </div>

          <div className="mt-6">
            <label className="cursor-pointer block text-center px-4 py-6 border-2 border-dashed border-calm-300 hover:border-brand-500 rounded-xl transition bg-calm-50/50">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-xs font-semibold text-brand-700">Choose PDF Document</span>
              <p className="text-[11px] text-calm-400 mt-1">Runs entirely client-side</p>
            </label>
          </div>
        </div>

        {/* Text Paste Option */}
        <div className="bg-white p-6 rounded-xl border border-calm-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-calm-900">Or Paste Discharge Instructions</h2>
              <button
                type="button"
                onClick={() => {
                  setRawText(sampleDischargeNotes);
                  const parsed = interpretDischargeText(sampleDischargeNotes);
                  setResults(parsed);
                }}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Load Sample Text
              </button>
            </div>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste discharge summary text here..."
              className="w-full p-3 text-xs border border-calm-300 rounded-lg font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleProcessText}
            disabled={!rawText.trim() || isProcessing}
            className="mt-4 w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition"
          >
            {isProcessing ? 'Processing in Browser...' : 'Analyze & Interpret Instructions'}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Interpretation Results View */}
      {results && (
        <div className="space-y-8 pt-4">
          <div className="border-t border-calm-200 pt-6">
            <h2 className="text-xl font-bold text-calm-900 tracking-tight">
              Extraction & Proposed Interpretations
            </h2>
            <p className="text-xs text-calm-500 mt-0.5">
              Review extracted information alongside original text. You must confirm items before adding them to your recovery planner.
            </p>
          </div>

          {/* Flags & Ambiguities */}
          {results.clarificationFlags.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 space-y-2">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Items Requiring Healthcare Team Clarification</span>
              </div>
              <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                {results.clarificationFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 1. Medical Terminology Detected */}
          <div className="bg-white rounded-xl border border-calm-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-calm-900">
                  Recognized Medical Abbreviations ({results.recognizedTerms.length})
                </h3>
                <p className="text-xs text-calm-500">Curated plain-language translations for terms found in your text</p>
              </div>
            </div>

            {results.recognizedTerms.length === 0 ? (
              <p className="text-xs text-calm-500 italic">No standard abbreviations detected in text.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.recognizedTerms.map(term => (
                  <div key={term.id} className="p-3 bg-calm-50 rounded-lg border border-calm-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-calm-900">{term.term}</span>
                      <span className="text-[10px] uppercase font-semibold text-calm-500 bg-white px-1.5 py-0.5 rounded border border-calm-200">
                        {term.category}
                      </span>
                    </div>
                    <div className="text-xs text-brand-700 font-semibold">{term.expanded}</div>
                    <p className="text-xs text-calm-600">{term.plainLanguage}</p>
                    {term.ambiguityWarning && (
                      <div className="text-[11px] text-amber-800 font-medium bg-amber-50 p-1.5 rounded border border-amber-200">
                        ⚠️ {term.ambiguityWarning}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Detected Medications */}
          <div className="bg-white rounded-xl border border-calm-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-calm-900">
              Identified Medications ({results.suggestedMedications.length})
            </h3>

            {results.suggestedMedications.length === 0 ? (
              <p className="text-xs text-calm-500 italic">No medications detected in text.</p>
            ) : (
              <div className="space-y-3">
                {results.suggestedMedications.map(item => {
                  const isAdded = !!addedItems[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border border-calm-200 bg-calm-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                            item.details.status === 'discontinued'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : item.details.status === 'new'
                              ? 'bg-brand-100 text-brand-800'
                              : 'bg-calm-200 text-calm-800'
                          }`}>
                            {item.details.status}
                          </span>
                          <span className="text-xs font-semibold text-calm-600">
                            {item.details.dosage} • {item.details.frequency}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-calm-900">{item.title}</div>
                        <div className="text-xs text-calm-500 font-mono bg-white p-1.5 rounded border border-calm-200">
                          Original line: "{item.rawSnippet}"
                        </div>
                        {item.needsClarification && (
                          <div className="text-xs text-amber-700 flex items-center">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                            {item.clarificationReason}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleConfirmMedication(item)}
                        disabled={isAdded}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center transition flex-shrink-0 ${
                          isAdded 
                            ? 'bg-sage-100 text-sage-800 border border-sage-300' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" /> Added to Organizer
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Confirm & Add Med
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Detected Appointments */}
          <div className="bg-white rounded-xl border border-calm-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-calm-900">
              Identified Follow-up Visits ({results.suggestedAppointments.length})
            </h3>

            {results.suggestedAppointments.length === 0 ? (
              <p className="text-xs text-calm-500 italic">No appointments detected in text.</p>
            ) : (
              <div className="space-y-3">
                {results.suggestedAppointments.map(item => {
                  const isAdded = !!addedItems[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className="p-4 rounded-xl border border-calm-200 bg-calm-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-calm-200 text-calm-800">
                            {item.details.timeframe || 'Follow-up'}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-calm-900">{item.title}</div>
                        <div className="text-xs text-calm-500 font-mono bg-white p-1.5 rounded border border-calm-200">
                          Original line: "{item.rawSnippet}"
                        </div>
                        {item.needsClarification && (
                          <div className="text-xs text-amber-700 flex items-center">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                            {item.clarificationReason}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleConfirmAppointment(item)}
                        disabled={isAdded}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center transition flex-shrink-0 ${
                          isAdded 
                            ? 'bg-sage-100 text-sage-800 border border-sage-300' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" /> Added to Appointments
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Confirm Appointment
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Detected Recovery Tasks & Instructions */}
          <div className="bg-white rounded-xl border border-calm-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-calm-900">
              Recovery Tasks & Precautions ({results.suggestedTasks.length})
            </h3>

            {results.suggestedTasks.length === 0 ? (
              <p className="text-xs text-calm-500 italic">No specific recovery instructions identified.</p>
            ) : (
              <div className="space-y-3">
                {results.suggestedTasks.map(item => {
                  const isAdded = !!addedItems[item.id];
                  return (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.details.isWarning 
                          ? 'bg-red-50/50 border-red-200' 
                          : 'bg-calm-50/40 border-calm-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-calm-200 text-calm-800">
                            {item.details.category}
                          </span>
                          {item.details.isWarning && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-800">
                              Red Flag Precaution
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-bold text-calm-900">{item.title}</div>
                        {item.needsClarification && (
                          <div className="text-xs text-red-700 flex items-center font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                            {item.clarificationReason}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleConfirmTask(item)}
                        disabled={isAdded}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center justify-center transition flex-shrink-0 ${
                          isAdded 
                            ? 'bg-sage-100 text-sage-800 border border-sage-300' 
                            : 'bg-brand-600 hover:bg-brand-700 text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1" /> Added to Planner
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Confirm Task
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

