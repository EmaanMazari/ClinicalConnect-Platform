import React from 'react';
import { 
  FileText, Activity, HelpCircle, Users, Siren, 
  Video, BookOpen, GraduationCap, Building2, Trophy, 
  ShieldCheck, Sparkles 
} from 'lucide-react';

export type NavigationTab = 
  | 'cases'
  | 'dicom'
  | 'qa'
  | 'communities'
  | 'emergency'
  | 'consult'
  | 'knowledge'
  | 'cme'
  | 'hospital'
  | 'leaderboard'
  | 'admin';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  statCount?: number;
  openCasesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  statCount = 2,
  openCasesCount = 4
}) => {
  const menuItems = [
    { id: 'cases', label: 'Clinical Cases', icon: FileText, badge: openCasesCount, desc: 'Anonymized Discussions' },
    { id: 'dicom', label: 'DICOM Viewer', icon: Activity, desc: 'PACS & Scan Calipers' },
    { id: 'qa', label: 'Medical Q&A', icon: HelpCircle, desc: 'Stack Overflow for MDs' },
    { id: 'communities', label: 'Specialty Hubs', icon: Users, desc: 'Cardio, Neuro, Ortho...' },
    { id: 'emergency', label: 'STAT Emergencies', icon: Siren, badge: statCount, isAlert: true, desc: '15-min Fast-Track SLA' },
    { id: 'consult', label: 'Live Tele-Consult', icon: Video, desc: 'Real-time WebRTC & Audio' },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen, desc: 'Orphan Diseases & Search' },
    { id: 'cme', label: 'CME & Quizzes', icon: GraduationCap, desc: 'Accreditation & Credits' },
    { id: 'hospital', label: 'Hospital Enterprise', icon: Building2, desc: 'Departments & Referrals' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, desc: 'Reputation & Rankings' },
    { id: 'admin', label: 'Doctor Verification', icon: ShieldCheck, desc: 'Licensing & Quality Review' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-1.5">
        <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
          Clinical Ecosystem
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavigationTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                isActive
                  ? item.isAlert
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-medical-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 text-left truncate">
                <Icon className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-white' : item.isAlert ? 'text-red-500 animate-pulse' : 'text-slate-400'
                }`} />
                <div className="truncate">
                  <div className="truncate">{item.label}</div>
                  <div className={`text-[10px] font-normal truncate ${
                    isActive ? 'text-medical-100 opacity-90' : 'text-slate-400'
                  }`}>
                    {item.desc}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : item.isAlert
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom HIPAA Security Seal */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>HIPAA & GDPR Ready</span>
          </div>
          <p className="text-[10px] leading-tight">
            Encrypted with 256-bit AES. Automatic client-side de-identification enabled.
          </p>
        </div>
      </div>
    </aside>
  );
};
