import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Check, X, FileText, 
  Lock, UserCheck, Eye, Search, Filter 
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export const VerificationAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'moderation' | 'audit'>('verification');

  // Pending verification applications
  const [pendingDoctors, setPendingDoctors] = useState([
    {
      id: 'app-01',
      name: 'Dr. Kimberly Adams',
      specialty: 'Obstetrics & Gynecology',
      hospital: 'Brigham and Women’s Hospital, Boston',
      licenseNumber: 'MA-MED-994812',
      board: 'American Board of Obstetrics and Gynecology (ABOG)',
      status: 'Pending Review',
      submissionDate: 'Today, 08:30 AM',
      licenseDocument: 'License_Certificate_MA.pdf'
    },
    {
      id: 'app-02',
      name: 'Dr. Hiroshi Tanaka',
      specialty: 'Neurosurgery',
      hospital: 'Tokyo University Hospital',
      licenseNumber: 'JP-MHLW-410928',
      board: 'Japan Neurosurgical Society',
      status: 'Pending Review',
      submissionDate: 'Yesterday, 14:15 PM',
      licenseDocument: 'Tanaka_License_JP.pdf'
    }
  ]);

  // Moderation reported cases
  const [reportedContent, setReportedContent] = useState([
    {
      id: 'rep-01',
      reportedItem: 'Comment on Case #PT-8891-CARD',
      reason: 'Potential off-label dosing without literature citation',
      reporter: 'Dr. Elena Rostova',
      flagLevel: 'Medium',
      status: 'Under Review'
    }
  ]);

  const auditLogs = storageService.getAuditLogs();

  const handleApproveDoctor = (id: string) => {
    setPendingDoctors(prev => prev.filter(d => d.id !== id));
    alert('Doctor medical credentials approved. Professional Badge and Full Case Access granted.');
  };

  const handleRejectDoctor = (id: string) => {
    setPendingDoctors(prev => prev.filter(d => d.id !== id));
    alert('Doctor verification rejected. Notification dispatched with re-application criteria.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Doctor Verification & Medical Review Board Portal
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  Strict MD/MBBS Verification
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ensure strict professional credibility: State medical board verification, credential approval, and misinformation moderation.
              </p>
            </div>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'verification'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            Pending Doctor Verifications ({pendingDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'moderation'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            Medical Review Moderation ({reportedContent.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'audit'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
            }`}
          >
            HIPAA Audit Log Stream ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Pending Doctor Verifications */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          {pendingDoctors.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
              All physician verification queues cleared.
            </div>
          ) : (
            pendingDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{doc.name}</h3>
                    <div className="text-xs text-slate-500">{doc.specialty} • {doc.hospital}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {doc.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs font-mono grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Medical License #</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{doc.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Accrediting Board</span>
                    <span className="text-slate-800 dark:text-slate-200 font-sans">{doc.board}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Submitted Document</span>
                    <span className="text-medical-600 font-bold underline cursor-pointer">{doc.licenseDocument}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 text-xs">
                  <button
                    onClick={() => handleRejectDoctor(doc.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition font-semibold"
                  >
                    <X className="w-4 h-4" /> Reject Application
                  </button>
                  <button
                    onClick={() => handleApproveDoctor(doc.id)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow transition"
                  >
                    <Check className="w-4 h-4" /> Verify & Authorize Access
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Medical Review Moderation */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          {reportedContent.map((rep) => (
            <div key={rep.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{rep.reportedItem}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  FLAG: {rep.flagLevel}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Reason: {rep.reason} (Reported by: {rep.reporter})
              </p>
              <div className="flex justify-end gap-2 text-xs pt-2">
                <button
                  onClick={() => {
                    setReportedContent(prev => prev.filter(r => r.id !== rep.id));
                    alert('Content dismissed as clinically valid.');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold"
                >
                  Dismiss Report
                </button>
                <button
                  onClick={() => {
                    setReportedContent(prev => prev.filter(r => r.id !== rep.id));
                    alert('Post removed for medical quality review.');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold"
                >
                  Remove Post
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: HIPAA Audit Log Stream */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Physician</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">IP Signature</th>
                  <th className="py-2.5 px-3">Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">No audit events logged yet.</td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id} className="text-[11px]">
                      <td className="py-2 px-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-slate-100">{log.doctorName}</td>
                      <td className="py-2 px-3 text-medical-600 font-bold">{log.action}</td>
                      <td className="py-2 px-3 text-slate-400">{log.ipAddress}</td>
                      <td className="py-2 px-3 text-emerald-600 font-bold">{log.complianceFlag}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
