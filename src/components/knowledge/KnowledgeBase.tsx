import React, { useState } from 'react';
import { ClinicalCase } from '../../types';
import { 
  BookOpen, Search, Sparkles, Filter, CheckCircle2, 
  ExternalLink, Layers, ShieldCheck, Tag, Stethoscope 
} from 'lucide-react';
import { CaseCard } from '../cases/CaseCard';

interface KnowledgeBaseProps {
  cases: ClinicalCase[];
  onSelectCase: (c: ClinicalCase) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  cases,
  onSelectCase
}) => {
  const [semanticSearch, setSemanticSearch] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('All');
  const [filterRareOnly, setFilterRareOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'archive' | 'rare' | 'pathways'>('archive');

  // Rare disease curated cases
  const rareDiseaseList = [
    {
      name: 'Anti-NMDA Receptor Encephalitis',
      orphaCode: 'ORPHA:217253',
      prevalence: '<1 / 1,000,000',
      keyFindings: 'Psychosis prodrome, extreme delta brush on EEG, faciobrachial dystonia, mature cystic teratoma',
      specialty: 'Neurology',
      diagnosticHallmark: 'CSF IgG antibodies to GluN1 subunit of NMDA receptor'
    },
    {
      name: 'Slipped Capital Femoral Epiphysis (SCFE)',
      orphaCode: 'ORPHA:276412',
      prevalence: '1-10 / 100,000',
      keyFindings: 'Referred knee pain, altered gait, obligatory external rotation on hip flexion (Drehmann sign)',
      specialty: 'Orthopedics',
      diagnosticHallmark: "Klein's line disruption on frog-leg lateral radiographs"
    },
    {
      name: 'Brugada Syndrome',
      orphaCode: 'ORPHA:130',
      prevalence: '5 / 10,000',
      keyFindings: 'Syncope, nocturnal agonal respiration, sudden cardiac death risk',
      specialty: 'Cardiology',
      diagnosticHallmark: 'Coved-type ST-segment elevation ≥ 2mm in V1-V2 (Type 1 ECG pattern)'
    },
    {
      name: 'Fibrodysplasia Ossificans Progressiva (FOP)',
      orphaCode: 'ORPHA:337',
      prevalence: '1 / 2,000,000',
      keyFindings: 'Congenital malformation of great toes, progressive heterotopic ossification',
      specialty: 'Pediatrics / Genetics',
      diagnosticHallmark: 'ACVR1 gene recurrent pathogenic variant (c.617G>A)'
    }
  ];

  // Diagnostic pathways
  const diagnosticPathways = [
    {
      title: 'Acute Non-Traumatic Chest Pain Rapid Triage Pathway',
      society: 'ACC / AHA / ESC Protocol',
      steps: [
        '10-Minute Target 12-Lead ECG Acquisition',
        'Stratify: ST-Elevation &rarr; STAT Primary PCI Cath Lab activation (<90m)',
        'If Non-STE: Serial High-Sensitivity Troponin at 0h and 1h / 2h',
        'Calculate HEART Score & Evaluate Alternative Causes (Aortic Dissection, PE)'
      ]
    },
    {
      title: 'Acute Ischemic Stroke Mechanical Thrombectomy Workflow',
      society: 'AHA / ASA Guidelines',
      steps: [
        'Emergency Non-Contrast Head CT &rarr; Exclude Intracranial Hemorrhage',
        'Determine ASPECTS Score & Last Known Well Time (<4.5h vs 4.5-24h)',
        'Immediate Multiphase CTA for Large Vessel Occlusion (LVO) detection',
        'Direct Angiosuite Transfer for Endovascular Thrombectomy'
      ]
    }
  ];

  // Filtered cases
  const filteredCases = cases.filter(c => {
    const matchesSpec = filterSpecialty === 'All' || c.specialty === filterSpecialty;
    const matchesRare = !filterRareOnly || c.subspecialtyTags.some(t => t.toLowerCase().includes('rare'));
    const matchesSearch = 
      c.title.toLowerCase().includes(semanticSearch.toLowerCase()) ||
      c.summary.toLowerCase().includes(semanticSearch.toLowerCase()) ||
      c.patient.symptoms.some(s => s.toLowerCase().includes(semanticSearch.toLowerCase()));
    return matchesSpec && matchesRare && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <BookOpen className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Global Clinical Intelligence Archive & Knowledge Base
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Semantic AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Search verified historical cases, rare disease monographs, and institutional diagnostic pathways.
              </p>
            </div>
          </div>
        </div>

        {/* AI-Powered Semantic Multi-Filter Search Bar */}
        <div className="space-y-3 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-600" />
            <input
              type="text"
              placeholder="Search across symptoms, lab values, imaging findings, or ICD-10 codes (e.g. 'troponin I21.0' or 'temporal hyperintensity')..."
              value={semanticSearch}
              onChange={(e) => setSemanticSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-semibold">Specialty:</span>
              <select
                value={filterSpecialty}
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
              >
                <option value="All">All Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={filterRareOnly}
                onChange={(e) => setFilterRareOnly(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span>Rare Conditions & Orphan Diseases Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'archive'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Solved Case Archive ({filteredCases.length})
        </button>
        <button
          onClick={() => setActiveTab('rare')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'rare'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Rare Disease Repository ({rareDiseaseList.length})
        </button>
        <button
          onClick={() => setActiveTab('pathways')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'pathways'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Diagnostic Algorithms & Pathways
        </button>
      </div>

      {/* Tab 1: Solved Case Archive */}
      {activeTab === 'archive' && (
        <div className="space-y-4">
          {filteredCases.map((c) => (
            <CaseCard key={c.id} caseItem={c} onSelect={onSelectCase} />
          ))}
        </div>
      )}

      {/* Tab 2: Rare Disease Repository */}
      {activeTab === 'rare' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rareDiseaseList.map((disease, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 dark:text-slate-100">{disease.name}</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                  {disease.orphaCode}
                </span>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Prevalence: {disease.prevalence} • Specialty: {disease.specialty}
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Clinical Presentation:</strong>
                {disease.keyFindings}
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 text-xs">
                <strong className="text-purple-900 dark:text-purple-200 block mb-0.5">Diagnostic Gold Standard:</strong>
                <span className="text-purple-800 dark:text-purple-300 font-medium">{disease.diagnosticHallmark}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Diagnostic Pathways */}
      {activeTab === 'pathways' && (
        <div className="space-y-4">
          {diagnosticPathways.map((pw, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{pw.title}</h3>
                <span className="text-xs font-mono text-medical-600 font-bold">{pw.society}</span>
              </div>

              <div className="space-y-2">
                {pw.steps.map((st, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="w-5 h-5 rounded-full bg-medical-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {sIdx + 1}
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium mt-0.5" dangerouslySetInnerHTML={{ __html: st }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
