import React from 'react';
import { Siren, ArrowRight, X } from 'lucide-react';
import { ClinicalCase } from '../../types';

interface EmergencyBannerProps {
  statCases: ClinicalCase[];
  onSelectCase: (c: ClinicalCase) => void;
  onDismiss?: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  statCases,
  onSelectCase
}) => {
  if (statCases.length === 0) return null;
  const primaryStat = statCases[0];

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="p-1 rounded-lg bg-black/20 animate-pulse shrink-0">
          <Siren className="w-4 h-4 text-amber-300" />
        </span>
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono bg-black/30 px-2 py-0.5 rounded text-[10px] font-bold text-amber-300">
            STAT ALERT • 15-MIN SLA
          </span>
          <span className="truncate">
            {primaryStat.specialty}: {primaryStat.title}
          </span>
        </div>
      </div>

      <button
        onClick={() => onSelectCase(primaryStat)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/30 hover:bg-black/50 text-white text-[11px] font-bold shrink-0 transition"
      >
        <span>Respond Now</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
