import React, { useState } from 'react';
import { Doctor, QuizQuestion, CMEProfile } from '../../types';
import { MOCK_QUIZZES, MOCK_GRAND_ROUNDS } from '../../data/mockCME';
import { storageService } from '../../services/storageService';
import { 
  GraduationCap, Award, CheckCircle2, XCircle, Video, 
  Clock, ArrowRight, Eye, ShieldCheck, Sparkles 
} from 'lucide-react';
import { CertificateModal } from './CertificateModal';
import confetti from 'canvas-confetti';

interface CMEPlatformProps {
  currentDoctor: Doctor;
}

export const CMEPlatform: React.FC<CMEPlatformProps> = ({ currentDoctor }) => {
  const [profile, setProfile] = useState<CMEProfile>(() => storageService.getCMEProfile());
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [activeCert, setActiveCert] = useState<CMEProfile['certificates'][0] | null>(null);

  const currentQuiz = MOCK_QUIZZES[activeQuizIndex];
  const progressPercent = Math.min(100, Math.round((profile.earnedCredits / profile.requiredCredits) * 100));

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQuiz.correctOptionIndex) {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }

      // Award CME credit
      const updatedProfile: CMEProfile = {
        ...profile,
        earnedCredits: profile.earnedCredits + currentQuiz.cmeCreditsAwarded,
        completedQuizzesCount: profile.completedQuizzesCount + 1,
        certificates: [
          ...profile.certificates,
          {
            id: `cert-${Date.now()}`,
            title: currentQuiz.title,
            issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            credits: currentQuiz.cmeCreditsAwarded,
            specialty: currentQuiz.specialty,
            credentialId: `CC-CME-${Math.floor(1000 + Math.random() * 9000)}-${currentQuiz.specialty.slice(0, 4).toUpperCase()}`
          }
        ]
      };
      setProfile(updatedProfile);
      storageService.saveCMEProfile(updatedProfile);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setActiveQuizIndex(prev => (prev + 1) % MOCK_QUIZZES.length);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & CME Credit Tracker */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <GraduationCap className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Medical Education & CME Accreditation Platform
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                  AMA PRA Cat 1
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Continuous clinical learning for licensed specialists: Case challenges, grand rounds, and verifiable CME certificates.
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="text-slate-500">License Requirement: </span>
            <strong className="text-slate-800 dark:text-slate-200">{profile.earnedCredits.toFixed(1)} / {profile.requiredCredits.toFixed(1)} Credits</strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>Annual CME Re-certification Progress</span>
            <span className="text-medical-600 font-bold">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-medical-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Col Grid: Interactive Clinical Quiz Challenge + Grand Rounds & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Clinical Quiz */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Quiz Challenge #{activeQuizIndex + 1} of {MOCK_QUIZZES.length}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentQuiz.specialty}
                </span>
              </div>
              <span className="font-mono text-xs text-medical-600 font-bold">
                +{currentQuiz.cmeCreditsAwarded.toFixed(1)} CME Credit
              </span>
            </div>

            <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
              {currentQuiz.title}
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {currentQuiz.clinicalScenario}
            </div>

            {currentQuiz.imagingUrl && (
              <div className="rounded-xl overflow-hidden max-h-48 bg-black">
                <img
                  src={currentQuiz.imagingUrl}
                  alt="Clinical Spotter"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-2.5 pt-2">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400';

                if (isAnswerSubmitted) {
                  if (idx === currentQuiz.correctOptionIndex) {
                    optStyle = 'bg-emerald-50 dark:bg-emerald-950 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isSelected && idx !== currentQuiz.correctOptionIndex) {
                    optStyle = 'bg-red-50 dark:bg-red-950 border-red-500 text-red-800 dark:text-red-200';
                  }
                } else if (isSelected) {
                  optStyle = 'bg-amber-50 dark:bg-amber-950 border-amber-500 text-amber-800 dark:text-amber-200 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && idx === currentQuiz.correctOptionIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && idx !== currentQuiz.correctOptionIndex && (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box on submit */}
            {isAnswerSubmitted && (
              <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-1">
                <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Clinical Case Pearl & Explanation:
                </div>
                <p className="text-purple-800 dark:text-purple-300 leading-relaxed">
                  {currentQuiz.explanation}
                </p>
              </div>
            )}

            {/* Quiz Action Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                {isAnswerSubmitted ? (
                  selectedOption === currentQuiz.correctOptionIndex ? (
                    <span className="text-emerald-600 font-bold">✓ Correct! CME Credit Awarded.</span>
                  ) : (
                    <span className="text-red-500 font-bold">Incorrect. Review rationale above.</span>
                  )
                ) : 'Select the best evidence-based intervention.'}
              </span>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedOption === null}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition disabled:opacity-50"
                >
                  Submit Clinical Choice
                </button>
              ) : (
                <button
                  onClick={handleNextQuiz}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs shadow transition"
                >
                  <span>Next Case Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Grand Rounds & Earned Certificates */}
        <div className="space-y-6">
          {/* Earned Certificates */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Earned Certificates ({profile.certificates.length})</span>
              </span>
            </h4>

            <div className="space-y-2.5 max-h-56 overflow-y-auto">
              {profile.certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setActiveCert(cert)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs hover:border-amber-500 transition cursor-pointer"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
                    {cert.title}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{cert.credits.toFixed(1)} Credits • {cert.issueDate}</span>
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      View Credential <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Rounds Schedule */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-600" />
              <span>International Grand Rounds</span>
            </h4>

            <div className="space-y-3">
              {MOCK_GRAND_ROUNDS.map((gr) => (
                <div key={gr.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      gr.isUpcoming ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {gr.isUpcoming ? 'UPCOMING WEBINAR' : 'ARCHIVED'}
                    </span>
                    <span className="font-mono text-purple-600 font-bold text-[10px]">+{gr.credits} CME</span>
                  </div>

                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {gr.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Speaker: {gr.speaker}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {gr.date} ({gr.duration}) • {gr.attendeesCount} Registered
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Viewer Modal */}
      {activeCert && (
        <CertificateModal
          doctor={currentDoctor}
          cert={activeCert}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  );
};
