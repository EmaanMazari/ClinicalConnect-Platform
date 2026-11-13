import React, { useState } from 'react';
import { SPECIALTY_COMMUNITIES, SpecialtyCommunity } from '../../data/mockCommunities';
import { ClinicalCase, Specialty } from '../../types';
import { 
  Users, MessageSquare, Download, Hash, ShieldCheck, 
  Search, ArrowRight, HeartPulse, Brain, Scan, Bone, 
  Baby, Siren, Activity, Layers 
} from 'lucide-react';
import { CaseCard } from '../cases/CaseCard';

interface CommunityViewProps {
  cases: ClinicalCase[];
  onSelectCase: (c: ClinicalCase) => void;
  onSelectSpecialtyCommunity?: (specialty: Specialty) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  HeartPulse,
  Brain,
  Scan,
  Bone,
  Baby,
  Siren,
  Activity,
  Layers
};

export const CommunityView: React.FC<CommunityViewProps> = ({
  cases,
  onSelectCase
}) => {
  const [selectedCommunity, setSelectedCommunity] = useState<SpecialtyCommunity>(SPECIALTY_COMMUNITIES[0]);
  const [searchFilter, setSearchFilter] = useState('');

  const IconComp = ICON_MAP[selectedCommunity.icon] || HeartPulse;

  // Filter cases for active community
  const communityCases = cases.filter(c => c.specialty === selectedCommunity.name);

  return (
    <div className="space-y-6">
      {/* Specialty Hub Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {SPECIALTY_COMMUNITIES.map((comm) => {
          const isSelected = selectedCommunity.id === comm.id;
          const CommIcon = ICON_MAP[comm.icon] || HeartPulse;
          return (
            <button
              key={comm.id}
              onClick={() => setSelectedCommunity(comm)}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-medical-600 text-white border-medical-500 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-medical-400'
              }`}
            >
              <CommIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-medical-600 dark:text-medical-400'}`} />
              <span className="font-bold text-xs truncate w-full">{comm.name}</span>
              <span className={`text-[10px] ${isSelected ? 'text-medical-100' : 'text-slate-400'}`}>
                {comm.memberCount} docs
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Community Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 border border-medical-200 dark:border-medical-800">
              <IconComp className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {selectedCommunity.name} Collaborative Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-medical-100 dark:bg-medical-950 text-medical-800 dark:text-medical-300 font-bold">
                  Verified Doctors Only
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedCommunity.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{selectedCommunity.memberCount}</div>
              <div className="text-[10px] text-slate-400">Board Members</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-sm text-medical-600 dark:text-medical-400">{communityCases.length}</div>
              <div className="text-[10px] text-slate-400">Active Cases</div>
            </div>
          </div>
        </div>

        {/* Moderators & Trending Tags Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Specialty Moderator:</span>
            {selectedCommunity.moderators.map((m) => (
              <span key={m.id} className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3.5 h-3.5 text-medical-600" />
                {m.name} ({m.title})
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-slate-400 font-semibold mr-1">Trending:</span>
            {selectedCommunity.trendingTags.map((t, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column: Feed + Clinical Protocols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cases in this specialty */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Clinical Discussions & Cases in {selectedCommunity.name} ({communityCases.length})</span>
          </h3>

          {communityCases.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
              No active open cases in this specialty right now.
            </div>
          ) : (
            communityCases.map((c) => (
              <CaseCard key={c.id} caseItem={c} onSelect={onSelectCase} />
            ))
          )}
        </div>

        {/* Right Col: Standardized Clinical Protocols & Checklists */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Download className="w-4 h-4 text-medical-600" />
              <span>Evidence Protocols & Pathways</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Peer-reviewed standard operating procedures ratified by society moderators.
            </p>

            <div className="space-y-2.5">
              {selectedCommunity.clinicalProtocols.map((p, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {p.title}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Updated: {p.updateDate}</span>
                    <span className="text-medical-600 font-bold">{p.downloads} downloads</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
