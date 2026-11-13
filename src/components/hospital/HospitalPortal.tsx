import React, { useState } from 'react';
import { MOCK_HOSPITAL_DATA, HospitalDepartment, ReferralRecord } from '../../data/mockInstitutions';
import { 
  Building2, Users, Clock, TrendingUp, ShieldCheck, 
  ArrowUpRight, Share2, Plus, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const HospitalPortal: React.FC = () => {
  const [data, setData] = useState(MOCK_HOSPITAL_DATA);
  const [activeTab, setActiveTab] = useState<'departments' | 'referrals' | 'analytics'>('departments');
  const [referrals, setReferrals] = useState<ReferralRecord[]>(data.referrals);

  const handleUpdateReferralStatus = (id: string, status: ReferralRecord['status']) => {
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-6">
      {/* Enterprise Hospital Network Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-clinical-cyan/10 text-clinical-cyan border border-clinical-cyan/20">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {data.institutionName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
                  {data.licenseTier}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Hospital-wide clinical collaboration infrastructure, inter-departmental consultation routing, and secure electronic patient transfer pipelines.
              </p>
            </div>
          </div>
        </div>

        {/* High-Level Organization Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 block text-[11px] font-sans">Active Staff Doctors</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.totalActivePhysicians}</span>
            <span className="text-[10px] text-emerald-600 font-sans block mt-0.5">100% Board Verified</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 block text-[11px] font-sans">Cases Collaborated</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.totalCasesCollaborated}</span>
            <span className="text-[10px] text-slate-400 font-sans block mt-0.5">This Academic Year</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 block text-[11px] font-sans">Median Consult Speed</span>
            <span className="text-xl font-bold text-medical-600 dark:text-medical-400">{data.medianConsultTimeMin} min</span>
            <span className="text-[10px] text-emerald-600 font-sans block mt-0.5">↓ 68% vs traditional phone</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 block text-[11px] font-sans">Diagnostic Accuracy Boost</span>
            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">+{data.diagnosticAccuracyImprovementPercent}%</span>
            <span className="text-[10px] text-purple-600 font-sans block mt-0.5">Peer-reviewed audit</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'departments'
              ? 'bg-clinical-cyan text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Department Management ({data.departments.length})
        </button>
        <button
          onClick={() => setActiveTab('referrals')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'referrals'
              ? 'bg-clinical-cyan text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Referral & Transfer Workflows ({referrals.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl transition ${
            activeTab === 'analytics'
              ? 'bg-clinical-cyan text-white shadow'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          Institutional Analytics & SLA
        </button>
      </div>

      {/* Tab 1: Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.departments.map((dep) => (
            <div
              key={dep.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 dark:text-slate-100">{dep.name}</span>
                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-bold">
                  {dep.staffDoctorsCount} Staff
                </span>
              </div>

              <div className="text-xs text-slate-500">
                Department Chair: <strong className="text-slate-800 dark:text-slate-200">{dep.headOfDepartment}</strong>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 text-[10px] block">Open Consultations</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{dep.openCasesCount} Cases</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-slate-400 text-[10px] block">Avg Response Time</span>
                  <span className="font-bold text-emerald-600">{dep.avgResponseMinutes} Minutes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Referrals */}
      {activeTab === 'referrals' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Inter-Hospital Electronic Handoff & Transfer Tracking
          </h3>

          <div className="space-y-3">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{ref.patientAnonId}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ref.priority === 'Emergency STAT' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {ref.priority}
                    </span>
                    <span className="text-slate-500 font-mono">({ref.requestDate})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-500">Status:</span>
                    <select
                      value={ref.status}
                      onChange={(e) => handleUpdateReferralStatus(ref.id, e.target.value as ReferralRecord['status'])}
                      className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                    >
                      <option value="Pending Triage">Pending Triage</option>
                      <option value="Accepted">Accepted</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="text-slate-700 dark:text-slate-300 font-medium">
                  {ref.reason}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-500 font-mono">
                  <span>From: {ref.referringDoctor}</span>
                  <span>&rarr; Destination: <strong className="text-slate-800 dark:text-slate-200">{ref.receivingHospital}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            Institutional Velocity & Compliance Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">Audit Compliance</span>
              <p className="text-slate-500 leading-relaxed">
                100% of cases passed HIPAA automated PHI scrubbing with zero reportable disclosures across 1,240 consults.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">Time-to-Second-Opinion</span>
              <p className="text-slate-500 leading-relaxed">
                Average emergency second opinion turnaround reduced from 4.2 hours to 18.4 minutes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">Cross-Specialty Collaboration</span>
              <p className="text-slate-500 leading-relaxed">
                72% of complex cardiology cases incorporated simultaneous radiology and emergency review.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
