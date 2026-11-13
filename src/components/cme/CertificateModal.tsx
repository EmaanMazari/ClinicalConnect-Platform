import React, { useEffect } from 'react';
import { X, Award, ShieldCheck, Download, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Doctor } from '../../types';

interface CertificateModalProps {
  doctor: Doctor;
  cert: {
    id: string;
    title: string;
    issueDate: string;
    credits: number;
    specialty: string;
    credentialId: string;
  };
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  doctor,
  cert,
  onClose
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        {/* Certificate Actions Bar */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-mono text-slate-500">Official Continuing Medical Education (CME) Verifiable Credential</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Card Printable Area */}
        <div className="p-8 sm:p-12 text-center bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-4 border-double border-amber-600/30 m-4 rounded-2xl">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 border border-amber-300 dark:border-amber-800 shadow">
              <Award className="w-10 h-10" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-wide text-slate-900 dark:text-slate-100 uppercase mb-1">
            Certificate of Continuing Medical Education
          </h2>
          <div className="text-xs text-amber-700 dark:text-amber-400 font-mono tracking-widest uppercase mb-6">
            ClinicalConnect Global Medical Education Council
          </div>

          <p className="text-xs text-slate-500 italic mb-2">This is to officially certify that</p>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif border-b-2 border-slate-300 dark:border-slate-700 max-w-sm mx-auto pb-1 mb-4">
            {doctor.name}, {doctor.title}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
            has successfully completed the peer-reviewed clinical masterclass and diagnostic case challenge in
            <strong className="block text-slate-900 dark:text-slate-100 mt-1 font-semibold text-sm">
              &ldquo;{cert.title}&rdquo;
            </strong>
          </p>

          <div className="flex items-center justify-center gap-6 my-6 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-slate-400 block text-[10px]">AMA PRA Category 1</span>
              <span className="text-base font-bold text-medical-600 dark:text-medical-400">{cert.credits.toFixed(1)} CME Credits</span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-slate-400 block text-[10px]">Date Awarded</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{cert.issueDate}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
            <div>
              <span className="block text-[9px] text-slate-400">CREDENTIAL ID:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{cert.credentialId}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4" /> VERIFIED LICENSED PHYSICIAN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
