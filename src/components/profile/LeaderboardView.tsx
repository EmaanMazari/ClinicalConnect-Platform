import React, { useState } from 'react';
import { MOCK_DOCTORS } from '../../data/mockDoctors';
import { Doctor } from '../../types';
import { Trophy, Award, ShieldCheck, Star, Sparkles, TrendingUp } from 'lucide-react';

interface LeaderboardViewProps {
  onSelectDoctor: (doc: Doctor) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onSelectDoctor }) => {
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  // Sort doctors by reputation score
  const sortedDoctors = [...MOCK_DOCTORS].sort((a, b) => b.reputationScore - a.reputationScore);
  const filtered = filterSpecialty === 'All' 
    ? sortedDoctors 
    : sortedDoctors.filter(d => d.specialty === filterSpecialty);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Trophy className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Specialist Reputation & Credibility Leaderboard
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Recognizing clinical excellence, verified diagnostic contributions, and peer-reviewed consensus across specialties.
              </p>
            </div>
          </div>
        </div>

        {/* Reputation Scoring Criteria Legend */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Accepted Diagnosis</span>
            <span className="font-bold text-emerald-600">+50 Points</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">CME Masterclass</span>
            <span className="font-bold text-amber-600">+30 Points</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Research Share</span>
            <span className="font-bold text-purple-600">+25 Points</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Helpful Q&A Answer</span>
            <span className="font-bold text-medical-600">+15 Points</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] block font-sans">Peer Endorsement</span>
            <span className="font-bold text-blue-600">+10 Points</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Physician & Credentials</th>
                <th className="py-3 px-4">Specialty</th>
                <th className="py-3 px-4">Accepted Diagnoses</th>
                <th className="py-3 px-4">Peer Endorsements</th>
                <th className="py-3 px-4">Reputation Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((doc, idx) => (
                <tr
                  key={doc.id}
                  onClick={() => onSelectDoctor(doc)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-mono font-bold">
                    {idx === 0 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-xs shadow">1</span>
                    ) : idx === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-bold text-xs shadow">2</span>
                    ) : idx === 2 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-bold text-xs shadow">3</span>
                    ) : (
                      <span className="text-slate-400 pl-2">#{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                          <span>{doc.name}</span>
                          <span className="text-[11px] font-normal text-slate-500">({doc.title})</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-medical-600" />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {doc.hospitalAffiliation}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-full bg-medical-50 dark:bg-medical-950 text-medical-800 dark:text-medical-300 font-semibold text-[11px]">
                      {doc.specialty}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                    {doc.acceptedDiagnosesCount} Dx
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-purple-600">
                    {doc.peerEndorsementsCount}
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-sm text-slate-900 dark:text-slate-100">
                    {doc.reputationScore.toLocaleString()} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
