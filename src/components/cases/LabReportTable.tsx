import React, { useState } from 'react';
import { LabValue } from '../../types';
import { AlertCircle, CheckCircle2, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

interface LabReportTableProps {
  labs: LabValue[];
}

export const LabReportTable: React.FC<LabReportTableProps> = ({ labs }) => {
  const [filterMode, setFilterMode] = useState<'all' | 'abnormal'>('all');

  const filteredLabs = filterMode === 'abnormal'
    ? labs.filter(l => l.status === 'critical' || l.status === 'high' || l.status === 'low')
    : labs;

  const criticalCount = labs.filter(l => l.status === 'critical').length;
  const abnormalCount = labs.filter(l => l.status === 'high' || l.status === 'low').length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Laboratory & Biomarker Panels
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {labs.length} Tests
          </span>
          {criticalCount > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {criticalCount} Critical
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterMode === 'all'
                ? 'bg-medical-600 text-white font-medium'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            All Values
          </button>
          <button
            onClick={() => setFilterMode('abnormal')}
            className={`px-2.5 py-1 rounded-md transition ${
              filterMode === 'abnormal'
                ? 'bg-amber-600 text-white font-medium'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            Abnormal Only ({criticalCount + abnormalCount})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-2.5 px-4">Test Name</th>
              <th className="py-2.5 px-4">Result Value</th>
              <th className="py-2.5 px-4">Reference Range</th>
              <th className="py-2.5 px-4">Clinical Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLabs.map((lab, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  lab.status === 'critical'
                    ? 'bg-red-50/60 dark:bg-red-950/30 font-medium'
                    : lab.status === 'high' || lab.status === 'low'
                    ? 'bg-amber-50/40 dark:bg-amber-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                  {lab.name}
                </td>
                <td className="py-2.5 px-4 font-mono font-semibold text-sm">
                  <span
                    className={
                      lab.status === 'critical'
                        ? 'text-red-600 dark:text-red-400 font-bold'
                        : lab.status === 'high'
                        ? 'text-amber-600 dark:text-amber-400'
                        : lab.status === 'low'
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-800 dark:text-slate-200'
                    }
                  >
                    {lab.value} <span className="text-xs font-normal text-slate-500">{lab.unit}</span>
                  </span>
                </td>
                <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-mono">
                  {lab.referenceRange}
                </td>
                <td className="py-2.5 px-4">
                  {lab.status === 'critical' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-700">
                      <AlertCircle className="w-3 h-3" /> STAT CRITICAL
                    </span>
                  ) : lab.status === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                      <ArrowUpRight className="w-3 h-3" /> High
                    </span>
                  ) : lab.status === 'low' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-700">
                      <ArrowDownRight className="w-3 h-3" /> Low
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-normal text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" /> Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
