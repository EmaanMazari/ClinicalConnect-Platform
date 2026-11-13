import React, { useState, useEffect } from 'react';
import { ClinicalCase, Doctor } from '../../types';
import { 
  AlertCircle, Siren, Clock, ShieldCheck, ArrowRight, 
  Volume2, PhoneCall, Zap, CheckCircle2, UserCheck 
} from 'lucide-react';
import { clinicalAudio } from '../../services/audioService';

interface EmergencyDashboardProps {
  cases: ClinicalCase[];
  currentDoctor: Doctor;
  onSelectCase: (c: ClinicalCase) => void;
  onLaunchConsult: (caseTitle: string) => void;
}

export const EmergencyDashboard: React.FC<EmergencyDashboardProps> = ({
  cases,
  currentDoctor,
  onSelectCase,
  onLaunchConsult
}) => {
  // Filter Emergency STAT cases
  const statCases = cases.filter(c => c.urgency === 'Emergency STAT');

  // Countdown timer simulation for 15-minute STAT SLA
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(840); // 14 min

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTestChime = () => {
    clinicalAudio.playEmergencyAlert();
  };

  return (
    <div className="space-y-6">
      {/* Top STAT Emergency Banner */}
      <div className="p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/20 backdrop-blur animate-pulse">
              <Siren className="w-6 h-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              STAT EMERGENCY CONSULTATION SYSTEM
            </h1>
          </div>
          <p className="text-xs text-red-100 max-w-2xl">
            Priority fast-track triage channel for critical, time-sensitive cases. Emergency specialists are broadcast-notified with strict 15-minute response SLA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTestChime}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/30 hover:bg-black/40 text-xs font-semibold backdrop-blur transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>Test STAT Chime</span>
          </button>
          <div className="p-3 bg-black/40 backdrop-blur rounded-2xl border border-white/20 text-center font-mono">
            <span className="text-[10px] text-red-200 block uppercase font-bold">Fast-Track SLA Target</span>
            <span className="text-xl font-black text-amber-300">{formatTime(timeLeftSeconds)}</span>
          </div>
        </div>
      </div>

      {/* Emergency Active Cases Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
            <span>Active STAT Consultations ({statCases.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">All Available Specialists Notified</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {statCases.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 border-2 border-red-500/70 rounded-2xl p-5 shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600 animate-pulse" />

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white animate-pulse">
                    STAT PRIORITY
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {c.specialty}
                  </span>
                  <span className="font-mono text-xs text-red-600 font-bold">
                    Target SLA: {c.statDeadline || '15 min'}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  Origin: {c.author.hospitalAffiliation}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {c.title}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Patient</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{c.patient.age}yo {c.patient.gender}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                  <span className="font-bold text-red-600">{c.vitals.bloodPressure}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                  <span className="font-bold text-amber-600">{c.vitals.heartRate} bpm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px]">Biomarker Alert</span>
                  <span className="font-bold text-red-600">{c.labs[0]?.name}: {c.labs[0]?.value}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>Attending: <strong>{c.author.name}</strong> ({c.author.title})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectCase(c)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Review Case Details
                  </button>
                  <button
                    onClick={() => onLaunchConsult(c.title)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Join Emergency STAT Room</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
