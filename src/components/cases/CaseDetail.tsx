import React, { useState } from 'react';
import { ClinicalCase, CaseComment, Doctor } from '../../types';
import { 
  ArrowLeft, AlertCircle, ShieldCheck, CheckCircle2, Clock, 
  MessageSquare, Sparkles, Activity, FileText, Send, ThumbsUp, 
  Share2, Eye, Lock, Download, Stethoscope, ChevronRight, Volume2
} from 'lucide-react';
import { LabReportTable } from './LabReportTable';
import { ECGViewer } from './ECGViewer';
import { AI_DISCLAIMER } from '../../services/aiClinicalEngine';
import { storageService } from '../../services/storageService';
import { createAuditLog } from '../../services/anonymizationService';

interface CaseDetailProps {
  caseItem: ClinicalCase;
  currentDoctor: Doctor;
  onBack: () => void;
  onOpenDicom: () => void;
  onOpenLiveConsult?: () => void;
}

export const CaseDetail: React.FC<CaseDetailProps> = ({
  caseItem: initialCase,
  currentDoctor,
  onBack,
  onOpenDicom,
  onOpenLiveConsult
}) => {
  const [caseItem, setCaseItem] = useState<ClinicalCase>(initialCase);
  const [activeTab, setActiveTab] = useState<'clinical' | 'diagnostics' | 'imaging' | 'discussion' | 'ai' | 'hipaa'>('clinical');
  const [newComment, setNewComment] = useState('');
  const [newDifferential, setNewDifferential] = useState('');
  const [newIcd10, setNewIcd10] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle posting a peer clinical comment / differential opinion
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const comment: CaseComment = {
      id: `c-${Date.now()}`,
      authorId: currentDoctor.id,
      authorName: currentDoctor.name,
      authorSpecialty: currentDoctor.specialty,
      authorAvatar: currentDoctor.avatar,
      authorBadge: currentDoctor.badges[0]?.name,
      content: newComment.trim(),
      timestamp: 'Just now',
      upvotes: 1,
      differentialProposal: newDifferential ? {
        diagnosis: newDifferential,
        icd10: newIcd10 || 'R69',
        confidence: 85,
        rationale: newComment.slice(0, 100)
      } : undefined
    };

    const updated = {
      ...caseItem,
      comments: [...caseItem.comments, comment]
    };
    setCaseItem(updated);
    storageService.updateCase(updated);

    // HIPAA Audit Log
    storageService.addAuditLog(
      createAuditLog(currentDoctor.id, currentDoctor.name, 'POSTED_DIFFERENTIAL', caseItem.id)
    );

    setNewComment('');
    setNewDifferential('');
    setNewIcd10('');
    setIsSubmitting(false);
  };

  // Upvote comment
  const handleUpvoteComment = (commentId: string) => {
    const updatedComments = caseItem.comments.map(c => {
      if (c.id === commentId) {
        return { ...c, upvotes: c.upvotes + 1 };
      }
      return c;
    });
    const updated = { ...caseItem, comments: updatedComments };
    setCaseItem(updated);
    storageService.updateCase(updated);
  };

  // Accept Diagnosis (Only case author or specialty lead)
  const handleAcceptDiagnosis = (commentId: string) => {
    const updatedComments = caseItem.comments.map(c => {
      return { ...c, isAcceptedDiagnosis: c.id === commentId };
    });
    const updated: ClinicalCase = {
      ...caseItem,
      status: 'Diagnosis Accepted',
      comments: updatedComments
    };
    setCaseItem(updated);
    storageService.updateCase(updated);

    storageService.addAuditLog(
      createAuditLog(currentDoctor.id, currentDoctor.name, 'ACCEPTED_DIAGNOSIS', caseItem.id)
    );
  };

  const isEmergency = caseItem.urgency === 'Emergency STAT';

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-medical-600 dark:hover:text-medical-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Clinical Feed</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenLiveConsult && (
            <button
              onClick={onOpenLiveConsult}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow transition"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Launch Live Tele-Consult</span>
            </button>
          )}
          <button
            onClick={onOpenDicom}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs shadow transition"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Open in DICOM Workstation</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className={`p-6 rounded-2xl border shadow-sm ${
        isEmergency
          ? 'bg-gradient-to-r from-red-50/50 via-white to-white dark:from-red-950/20 dark:via-slate-900 dark:to-slate-900 border-red-300 dark:border-red-900/60'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {isEmergency ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                STAT EMERGENCY CASE
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {caseItem.urgency}
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-medical-50 text-medical-800 dark:bg-medical-950 dark:text-medical-300 border border-medical-200 dark:border-medical-800">
              {caseItem.specialty}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Status: <strong className="ml-1 text-medical-600 dark:text-medical-400">{caseItem.status}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {caseItem.createdAt}
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA Verified & Masked
            </span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-snug">
          {caseItem.title}
        </h1>

        {/* Doctor Info & Patient Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={caseItem.author.avatar}
              alt={caseItem.author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-medical-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-slate-100">
                <span>{caseItem.author.name}</span>
                <span className="text-xs font-normal text-slate-500 font-mono">({caseItem.author.title})</span>
                <ShieldCheck className="w-4 h-4 text-medical-600 dark:text-medical-400" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {caseItem.author.hospitalAffiliation} • License: {caseItem.author.licenseNumber}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
              Patient: {caseItem.patient.age}yo {caseItem.patient.gender}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
              ID: {caseItem.patient.anonymizedId}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
              Onset: {caseItem.patient.durationOfIllness}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'clinical', label: 'Clinical Narrative & Vitals', icon: FileText },
          { id: 'diagnostics', label: 'Telemetry & Lab Panels', icon: Activity },
          { id: 'imaging', label: 'Imaging & Attachments', icon: Eye, count: caseItem.attachments.length },
          { id: 'discussion', label: 'Multidisciplinary Discussion', icon: MessageSquare, count: caseItem.comments.length },
          { id: 'ai', label: 'AI Clinical Co-Pilot', icon: Sparkles, highlight: true },
          { id: 'hipaa', label: 'HIPAA & Audit Trail', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? tab.highlight
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-medical-600 text-white shadow'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Clinical History & Vitals */}
      {activeTab === 'clinical' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Clinical Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-medical-600" />
                <span>Chief Complaint & Symptoms</span>
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 mb-4">
                &ldquo;{caseItem.patient.chiefComplaint}&rdquo;
              </div>

              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Presenting Symptoms
                </span>
                <div className="flex flex-wrap gap-2">
                  {caseItem.patient.symptoms.map((symptom, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Past Medical & Surgical History
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {caseItem.patient.medicalHistory.map((hist, i) => (
                      <li key={i}>{hist}</li>
                    ))}
                  </ul>
                </div>

                {caseItem.patient.familyHistory && (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Family History
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {caseItem.patient.familyHistory}
                    </p>
                  </div>
                )}

                {caseItem.patient.allergies && (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Allergies & Adverse Drug Reactions
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {caseItem.patient.allergies.map((all, i) => (
                        <span key={i} className="px-2.5 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                          {all}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prescriptions & Medications Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">
                Active Medications & Acute Prescriptions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Medication</th>
                      <th className="py-2.5 px-3">Dose</th>
                      <th className="py-2.5 px-3">Route</th>
                      <th className="py-2.5 px-3">Frequency</th>
                      <th className="py-2.5 px-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {caseItem.prescriptions.map((rx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{rx.name}</td>
                        <td className="py-2.5 px-3 font-mono">{rx.dosage}</td>
                        <td className="py-2.5 px-3">{rx.route}</td>
                        <td className="py-2.5 px-3">{rx.frequency}</td>
                        <td className="py-2.5 px-3 text-slate-500">{rx.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Vitals & Discussion Goals Sidebar */}
          <div className="space-y-6">
            {/* Vitals Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
                <span>Vital Signs on Admission</span>
                <Activity className="w-4 h-4 text-medical-600 animate-pulse" />
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Blood Pressure</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                    {caseItem.vitals.bloodPressure}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Heart Rate</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                    {caseItem.vitals.heartRate} <span className="text-xs font-normal">bpm</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Oxygen Saturation</span>
                  <span className={`text-base font-bold font-mono ${caseItem.vitals.oxygenSaturation < 94 ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {caseItem.vitals.oxygenSaturation}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 block text-[11px]">Temperature</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-slate-100">
                    {caseItem.vitals.temperature}°C
                  </span>
                </div>
              </div>
            </div>

            {/* Discussion Goals */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">
                Discussion Objectives
              </h3>
              <div className="space-y-2">
                {caseItem.discussionGoals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-medical-600 flex-shrink-0" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Diagnostics & Telemetry */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <ECGViewer
            heartRate={caseItem.vitals.heartRate}
            condition={caseItem.title.includes('STEMI') ? 'Acute Antero-Septal STEMI' : 'Sinus Rhythm'}
            isStemi={caseItem.title.includes('STEMI')}
          />
          <LabReportTable labs={caseItem.labs} />
        </div>
      )}

      {/* Tab 3: Medical Imaging & Attachments */}
      {activeTab === 'imaging' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Attached Diagnostic Series ({caseItem.attachments.length})
            </h3>
            <button
              onClick={onOpenDicom}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs shadow transition"
            >
              <Eye className="w-4 h-4" />
              <span>Launch Full Interactive DICOM Workstation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseItem.attachments.map((att) => (
              <div
                key={att.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm group hover:border-cyan-500 transition cursor-pointer"
                onClick={onOpenDicom}
              >
                {att.modality === 'Audio Note' ? (
                  <div className="h-44 bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center p-4 text-center">
                    <Volume2 className="w-10 h-10 text-purple-600 mb-2 animate-bounce" />
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{att.title}</span>
                    <span className="text-[11px] text-slate-500">Audio Dictation Recorded</span>
                  </div>
                ) : (
                  <div className="relative h-44 bg-black overflow-hidden">
                    <img
                      src={att.url}
                      alt={att.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-cyan-400 font-mono text-[10px] border border-cyan-800">
                      {att.modality} {att.isDicom ? '• DICOM' : ''}
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">
                    {att.title}
                  </h4>
                  {att.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {att.notes}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span>HIPAA ANONYMIZED</span>
                    <span className="text-cyan-600 font-semibold flex items-center gap-1">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Discussion & Peer Opinions */}
      {activeTab === 'discussion' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
              <span>Peer Differential Opinions & Consensus ({caseItem.comments.length})</span>
              <span className="text-xs font-normal text-slate-500">Licensed Doctors Only</span>
            </h3>

            {/* Comments List */}
            <div className="space-y-4 mb-6">
              {caseItem.comments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No peer comments yet. Be the first specialist to submit a diagnostic proposal.
                </div>
              ) : (
                caseItem.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className={`p-5 rounded-2xl border transition ${
                      comm.isAcceptedDiagnosis
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={comm.authorAvatar}
                          alt={comm.authorName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-slate-100">
                            <span>{comm.authorName}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-medical-100 dark:bg-medical-950 text-medical-800 dark:text-medical-300">
                              {comm.authorSpecialty}
                            </span>
                            {comm.authorBadge && (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                • {comm.authorBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {comm.isAcceptedDiagnosis ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accepted Diagnosis
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcceptDiagnosis(comm.id)}
                            className="text-xs px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                          >
                            Mark as Accepted
                          </button>
                        )}
                      </div>
                    </div>

                    {comm.differentialProposal && (
                      <div className="mb-3 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs">
                        <span className="font-semibold text-cyan-900 dark:text-cyan-200">Proposed Differential:</span>{' '}
                        <strong className="text-cyan-800 dark:text-cyan-300">{comm.differentialProposal.diagnosis}</strong>{' '}
                        <span className="font-mono text-[10px] bg-cyan-200/60 dark:bg-cyan-900 px-1.5 py-0.5 rounded ml-1">
                          ICD-10: {comm.differentialProposal.icd10}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed mb-3">
                      {comm.content}
                    </p>

                    {comm.citations && (
                      <div className="mb-3 pl-3 border-l-2 border-slate-300 dark:border-slate-700 text-[11px] text-slate-500 space-y-0.5">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Evidence Citations:</span>
                        {comm.citations.map((cit, idx) => (
                          <div key={idx} className="italic">{cit.title} ({cit.source})</div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
                      <button
                        onClick={() => handleUpvoteComment(comm.id)}
                        className="flex items-center gap-1.5 hover:text-medical-600 transition"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Peer Consensus ({comm.upvotes})</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Post Differential Form */}
            <form onSubmit={handlePostComment} className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Submit Your Clinical Evaluation
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Primary Differential Diagnosis (e.g. Acute Coronary Syndrome)"
                  value={newDifferential}
                  onChange={(e) => setNewDifferential(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
                <input
                  type="text"
                  placeholder="ICD-10 Code (optional, e.g. I21.0)"
                  value={newIcd10}
                  onChange={(e) => setNewIcd10(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500 font-mono"
                />
              </div>

              <textarea
                rows={3}
                placeholder="Detail your clinical reasoning, recommended secondary tests, or surgical opinion..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Clinical Differential</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 5: AI Clinical Co-Pilot */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          {/* Medical Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <strong className="block font-bold mb-1">Official Medical Disclaimer (Section 7)</strong>
              {AI_DISCLAIMER}
            </div>
          </div>

          {caseItem.aiInsights ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Differential Diagnoses & Summarization */}
              <div className="lg:col-span-2 space-y-6">
                {/* SOAP Case Summary */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-sm text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Clinical Case Summarization (SBAR / SOAP)</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
                    {caseItem.aiInsights.summary}
                  </div>
                </div>

                {/* Ranked Differential Diagnoses */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4">
                    Probability-Ranked Differential Diagnoses
                  </h3>
                  <div className="space-y-4">
                    {caseItem.aiInsights.differentialDiagnoses.map((diff, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{diff.condition}</span>
                            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              ICD-10: {diff.icd10}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
                            {diff.probability}% Clinical Probability
                          </span>
                        </div>

                        {/* Probability Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mb-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${diff.probability}%` }}
                          />
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                          {diff.rationale}
                        </p>

                        <div className="text-[11px] text-slate-500">
                          <strong className="text-slate-700 dark:text-slate-300">Recommended Next Steps:</strong>{' '}
                          {diff.recommendedTests.join(' • ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Drug Interactions & Guidelines */}
              <div className="space-y-6">
                {/* Drug-Drug Interactions */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center justify-between">
                    <span>Pharmacopeia & Interaction Alerts</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-mono font-bold">
                      {caseItem.aiInsights.drugInteractions.length} Alerts
                    </span>
                  </h3>
                  {caseItem.aiInsights.drugInteractions.length === 0 ? (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>No high-risk contraindications detected</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {caseItem.aiInsights.drugInteractions.map((alert, i) => (
                        <div key={i} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs">
                          <div className="flex items-center justify-between font-bold text-red-700 dark:text-red-300 mb-1">
                            <span>{alert.drugs.join(' ↔ ')}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-200 dark:bg-red-900">
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                            {alert.warning}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Evidence Guidelines */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4">
                    Relevant Medical Society Guidelines
                  </h3>
                  <div className="space-y-3">
                    {caseItem.aiInsights.relevantGuidelines.map((guide, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {guide.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mb-2">
                          {guide.organization} ({guide.year})
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {guide.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              AI analysis not generated for this case.
            </div>
          )}
        </div>
      )}

      {/* Tab 6: HIPAA & Audit Trail */}
      {activeTab === 'hipaa' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>HIPAA-Ready Cryptographic Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All patient identifiers (Safe Harbor 18 PHI elements) were redacted prior to broadcast.
              </p>
            </div>
            <button
              onClick={() => alert('Exporting signed HIPAA Compliance Log...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
            >
              <Download className="w-3.5 h-3.5" /> Export Audit Log
            </button>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Timestamp (UTC)</th>
                  <th className="py-2.5 px-4">Physician</th>
                  <th className="py-2.5 px-4">Action</th>
                  <th className="py-2.5 px-4">IP Signature</th>
                  <th className="py-2.5 px-4">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="py-2.5 px-4 text-slate-500">2026-11-03 17:42:10</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-slate-100">Dr. Alexander Wright</td>
                  <td className="py-2.5 px-4 text-medical-600 font-semibold">ANONYMIZED_MEDIA</td>
                  <td className="py-2.5 px-4 text-slate-500">192.168.1.42</td>
                  <td className="py-2.5 px-4 text-emerald-600 font-bold">HIPAA_COMPLIANT</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 text-slate-500">2026-11-03 17:45:00</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-900 dark:text-slate-100">Dr. Marcus Vance</td>
                  <td className="py-2.5 px-4 text-medical-600 font-semibold">VIEWED_CASE</td>
                  <td className="py-2.5 px-4 text-slate-500">192.168.1.18</td>
                  <td className="py-2.5 px-4 text-emerald-600 font-bold">HIPAA_COMPLIANT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
