import React from 'react';
import { ClinicalCase } from '../../types';
import { 
  AlertCircle, ShieldCheck, MessageSquare, Eye, Clock, 
  CheckCircle, Sparkles, Activity, FileText, ArrowRight
} from 'lucide-react';

interface CaseCardProps {
  caseItem: ClinicalCase;
  onSelect: (caseItem: ClinicalCase) => void;
  onOpenAI?: (caseItem: ClinicalCase) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onSelect, onOpenAI }) => {
  const isEmergency = caseItem.urgency === 'Emergency STAT';
  const hasAcceptedDiagnosis = caseItem.status === 'Diagnosis Accepted';

  return (
    <div
      onClick={() => onSelect(caseItem)}
      className={`group relative bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer ${
        isEmergency
          ? 'border-red-300 dark:border-red-900/60 hover:border-red-500 bg-gradient-to-br from-red-50/20 via-white to-transparent dark:from-red-950/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-medical-500'
      }`}
    >
      {/* Top Metadata Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {/* Urgency Pill */}
          {isEmergency ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              STAT EMERGENCY
            </span>
          ) : caseItem.urgency === 'Priority' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Priority Review
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Routine Case
            </span>
          )}

          {/* Specialty */}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-medical-50 text-medical-800 dark:bg-medical-950 dark:text-medical-300 border border-medical-200 dark:border-medical-800">
            {caseItem.specialty}
          </span>

          {/* Accepted Diagnosis badge */}
          {hasAcceptedDiagnosis && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Diagnosis Confirmed
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{caseItem.createdAt}</span>
          {caseItem.statDeadline && (
            <span className="font-mono text-red-600 dark:text-red-400 font-bold ml-1">
              • {caseItem.statDeadline}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors line-clamp-2 mb-2">
        {caseItem.title}
      </h3>

      {/* Patient Synopsis */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-600 dark:text-slate-300">
        <span className="font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          {caseItem.patient.age}yo {caseItem.patient.gender}
        </span>
        <span className="font-mono text-slate-400">ID: {caseItem.patient.anonymizedId}</span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-600 dark:text-slate-400">Duration: {caseItem.patient.durationOfIllness}</span>
      </div>

      {/* Clinical Summary */}
      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
        {caseItem.summary}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {caseItem.subspecialtyTags.map((tag, i) => (
          <span
            key={i}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer Info Row */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        {/* Author Doctor */}
        <div className="flex items-center gap-2">
          <img
            src={caseItem.author.avatar}
            alt={caseItem.author.name}
            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div>
            <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
              <span>{caseItem.author.name}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-medical-600 dark:text-medical-400" />
            </div>
            <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
              {caseItem.author.hospitalAffiliation}
            </div>
          </div>
        </div>

        {/* Counts & Actions */}
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          {caseItem.aiInsights && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenAI) onOpenAI(caseItem);
              }}
              title="AI Co-Pilot Differential Ready"
              className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 bg-purple-50 dark:bg-purple-950/60 px-2 py-1 rounded-lg transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Insights</span>
            </span>
          )}

          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{caseItem.comments.length}</span>
          </div>

          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{caseItem.viewsCount}</span>
          </div>

          <div className="p-1 rounded-lg group-hover:bg-medical-50 dark:group-hover:bg-medical-950 text-slate-400 group-hover:text-medical-600 transition">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
