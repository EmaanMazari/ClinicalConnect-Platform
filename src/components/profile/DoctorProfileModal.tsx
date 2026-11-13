import React from 'react';
import { Doctor } from '../../types';
import { 
  X, ShieldCheck, Award, BookOpen, Star, 
  Building2, CheckCircle2, ThumbsUp, Sparkles, FileText 
} from 'lucide-react';

interface DoctorProfileModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8 text-slate-800 dark:text-slate-200">
        {/* Banner with Doctor Header */}
        <div className="relative bg-gradient-to-r from-medical-700 to-clinical-blue p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{doctor.name}</h2>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-xs text-medical-100 font-medium">
                {doctor.title} • {doctor.specialty}
              </div>
              <div className="text-xs text-medical-200 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{doctor.hospitalAffiliation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reputation Score & Stats Bar */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-center text-xs divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-950 font-mono">
          <div className="p-3">
            <span className="text-slate-400 text-[10px] block font-sans">Reputation</span>
            <span className="font-bold text-base text-medical-600 dark:text-medical-400">
              {doctor.reputationScore}
            </span>
          </div>
          <div className="p-3">
            <span className="text-slate-400 text-[10px] block font-sans">Accepted Dx</span>
            <span className="font-bold text-base text-emerald-600">
              {doctor.acceptedDiagnosesCount}
            </span>
          </div>
          <div className="p-3">
            <span className="text-slate-400 text-[10px] block font-sans">Helpful Answers</span>
            <span className="font-bold text-base text-slate-800 dark:text-slate-200">
              {doctor.helpfulAnswersCount}
            </span>
          </div>
          <div className="p-3">
            <span className="text-slate-400 text-[10px] block font-sans">Endorsements</span>
            <span className="font-bold text-base text-purple-600">
              {doctor.peerEndorsementsCount}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Medical Licensing & Verification details */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Medical Credentials</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 font-mono">
                STATUS: APPROVED
              </span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              License: <strong className="font-mono text-slate-900 dark:text-slate-100">{doctor.licenseNumber}</strong> • Board: {doctor.licensingBoard} • Experience: {doctor.experienceYears} Years
            </div>
          </div>

          {/* Expert Badges */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
              Earned Expert Badges
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {doctor.badges.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">{b.name}</span>
                    <span className="text-[10px] text-slate-500">{b.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Areas of Expertise */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
              Clinical Specializations & Focus
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {doctor.areasOfExpertise.map((exp, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-medical-50 dark:bg-medical-950 text-medical-800 dark:text-medical-300 border border-medical-200 dark:border-medical-800 font-medium">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          {/* Research Contributions */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Research Contributions (h-index: {doctor.researchContributions.hIndex})</span>
            </h3>
            <div className="text-slate-600 dark:text-slate-400 text-xs">
              {doctor.researchContributions.publicationsCount} peer-reviewed publications. Top work:
              <p className="italic text-slate-800 dark:text-slate-200 mt-1">
                &ldquo;{doctor.researchContributions.topPaper}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
