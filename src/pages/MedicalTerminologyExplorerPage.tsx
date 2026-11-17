import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ExternalLink,
  Filter
} from 'lucide-react';
import { searchMedicalDictionary, MEDICAL_DICTIONARY } from '../data/medicalDictionary';
import { TermCategory, MedicalTerm } from '../types';

export const MedicalTerminologyExplorerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);

  const categories: { id: TermCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Terms' },
    { id: 'medication', label: 'Medications & Dosing' },
    { id: 'discharge', label: 'Discharge Terminology' },
    { id: 'rehabilitation', label: 'Rehab & Mobility' },
    { id: 'instructions', label: 'Follow-Up & Instructions' },
    { id: 'vitals', label: 'Vitals & Symptoms' },
    { id: 'lab-imaging', label: 'Labs & Diagnostics' },
  ];

  const results = searchMedicalDictionary(searchQuery, selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-calm-900 tracking-tight">Medical Terminology Explorer</h1>
        <p className="text-sm text-calm-500 mt-1">
          Demystifying hospital jargon, abbreviations, and latin medical terms in clear plain language.
        </p>
      </div>

      {/* Safety Notice regarding medical abbreviations */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start space-x-3 text-xs text-brand-900">
        <Info className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Context-Sensitive Warning:</strong> Many hospital abbreviations have multiple potential clinical meanings depending on whether they appear in pharmacy orders, lab reports, or surgical notes (e.g. <em>PT</em> can mean Physical Therapy or Prothrombin Time). We highlight ambiguity warnings so you know what questions to ask your doctor.
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-calm-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-calm-400" />
          <input
            type="text"
            placeholder="Search abbreviations, terms, or plain English descriptions (e.g. BID, NWB, F/U, blood clot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-calm-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                selectedCategory === c.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-calm-100 text-calm-600 hover:bg-calm-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Terminology Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedTerm(item)}
            className="bg-white p-5 rounded-xl border border-calm-200 hover:border-brand-400 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {item.category}
                </span>
                {item.ambiguityWarning && (
                  <span className="flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <AlertTriangle className="w-3 h-3 mr-0.5" /> Ambiguous
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-calm-900 tracking-tight">
                {item.term}
              </h3>
              <div className="text-xs font-semibold text-calm-500 mt-0.5">
                {item.expanded}
              </div>

              <p className="mt-3 text-xs text-calm-700 leading-relaxed">
                {item.plainLanguage}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-calm-100 flex items-center justify-between text-[11px] text-calm-400">
              <span>Source: {item.source}</span>
              <span className="text-brand-600 font-semibold hover:underline">Details &rarr;</span>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-calm-200">
          <BookOpen className="w-10 h-10 text-calm-400 mx-auto mb-2 opacity-80" />
          <p className="text-sm font-medium text-calm-700">No medical terms found</p>
          <p className="text-xs text-calm-500 mt-1">
            Try searching for common abbreviations like "BID", "PRN", "NPO", or "WBAT".
          </p>
        </div>
      )}

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-calm-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-brand-50 text-brand-700 border border-brand-200">
                  {selectedTerm.category}
                </span>
                <h2 className="text-2xl font-black text-calm-900 mt-1">
                  {selectedTerm.term}
                </h2>
                <div className="text-sm font-semibold text-calm-600">
                  {selectedTerm.expanded}
                </div>
              </div>
              <button
                onClick={() => setSelectedTerm(null)}
                className="text-calm-400 hover:text-calm-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-calm-50 rounded-xl border border-calm-200">
              <h4 className="text-xs font-bold text-calm-500 uppercase tracking-wider mb-1">
                Plain-Language Explanation
              </h4>
              <p className="text-sm text-calm-800 leading-relaxed font-medium">
                {selectedTerm.plainLanguage}
              </p>
            </div>

            {selectedTerm.ambiguityWarning && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Ambiguity Warning & Safety Notice</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {selectedTerm.ambiguityWarning}
                </p>
              </div>
            )}

            <div className="text-xs text-calm-500 space-y-1 pt-1">
              <div><strong>Reliable Authority Source:</strong> {selectedTerm.source}</div>
              {selectedTerm.contextClues && (
                <div><strong>Typical Context Clues:</strong> {selectedTerm.contextClues.join(', ')}</div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTerm(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

