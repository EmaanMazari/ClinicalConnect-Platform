import React, { useState, useEffect } from 'react';
import { 
  ClinicalCase, MedicalQuestion, Doctor, Specialty 
} from './types';
import { storageService } from './services/storageService';
import { CURRENT_DOCTOR } from './data/mockDoctors';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar, NavigationTab } from './components/common/Sidebar';
import { EmergencyBanner } from './components/common/EmergencyBanner';

// Modules
import { CaseCard } from './components/cases/CaseCard';
import { CaseDetail } from './components/cases/CaseDetail';
import { CaseCreateModal } from './components/cases/CaseCreateModal';
import { DicomViewer } from './components/imaging/DicomViewer';
import { QAFeed } from './components/qa/QAFeed';
import { QADetail } from './components/qa/QADetail';
import { AskQuestionModal } from './components/qa/AskQuestionModal';
import { CommunityView } from './components/communities/CommunityView';
import { RealTimeConsult } from './components/collaboration/RealTimeConsult';
import { EmergencyDashboard } from './components/emergency/EmergencyDashboard';
import { KnowledgeBase } from './components/knowledge/KnowledgeBase';
import { CMEPlatform } from './components/cme/CMEPlatform';
import { HospitalPortal } from './components/hospital/HospitalPortal';
import { LeaderboardView } from './components/profile/LeaderboardView';
import { DoctorProfileModal } from './components/profile/DoctorProfileModal';
import { VerificationAdmin } from './components/admin/VerificationAdmin';

// Icons for filter bar
import { Filter, Search, Plus, Sparkles, AlertCircle } from 'lucide-react';

export function App() {
  const [currentDoctor, setCurrentDoctor] = useState<Doctor>(() => storageService.getCurrentDoctor());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('cases');
  const [cases, setCases] = useState<ClinicalCase[]>(() => storageService.getCases());
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<MedicalQuestion | null>(null);

  // Modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [inspectDoctorProfile, setInspectDoctorProfile] = useState<Doctor | null>(null);
  const [isLiveConsultOpen, setIsLiveConsultOpen] = useState(false);
  const [liveConsultTitle, setLiveConsultTitle] = useState('STAT Multidisciplinary Consult');

  // Dark Mode
  const [darkMode, setDarkMode] = useState(true);

  // Filters for cases feed
  const [feedSpecialty, setFeedSpecialty] = useState<string>('All');
  const [feedSearch, setFeedSearch] = useState('');
  const [feedUrgency, setFeedUrgency] = useState<'All' | 'STAT' | 'Priority'>('All');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSwitchDoctor = (doc: Doctor) => {
    setCurrentDoctor(doc);
    storageService.saveCurrentDoctor(doc);
  };

  const handleCaseCreated = (newCase: ClinicalCase) => {
    const updated = storageService.saveCase(newCase);
    setCases(updated);
    setSelectedCase(newCase);
  };

  const handleSelectCase = (c: ClinicalCase) => {
    setSelectedCase(c);
  };

  const handleOpenLiveConsultForCase = (title: string) => {
    setLiveConsultTitle(title);
    setIsLiveConsultOpen(true);
  };

  // Filter cases
  const statCases = cases.filter(c => c.urgency === 'Emergency STAT');
  const filteredCases = cases.filter(c => {
    const matchesSpec = feedSpecialty === 'All' || c.specialty === feedSpecialty;
    const matchesUrgency = 
      feedUrgency === 'All' || 
      (feedUrgency === 'STAT' && c.urgency === 'Emergency STAT') ||
      (feedUrgency === 'Priority' && c.urgency === 'Priority');
    const matchesSearch = 
      c.title.toLowerCase().includes(feedSearch.toLowerCase()) ||
      c.summary.toLowerCase().includes(feedSearch.toLowerCase()) ||
      c.subspecialtyTags.some(t => t.toLowerCase().includes(feedSearch.toLowerCase())) ||
      c.patient.symptoms.some(s => s.toLowerCase().includes(feedSearch.toLowerCase()));
    return matchesSpec && matchesUrgency && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top STAT Emergency Broadcast Banner */}
      <EmergencyBanner
        statCases={statCases}
        onSelectCase={(c) => {
          setSelectedCase(c);
          setCurrentTab('cases');
        }}
      />

      {/* Global Navbar */}
      <Navbar
        currentDoctor={currentDoctor}
        onSwitchDoctor={handleSwitchDoctor}
        onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
        onOpenAskModal={() => setIsAskModalOpen(true)}
        onSelectEmergencyTab={() => {
          setSelectedCase(null);
          setCurrentTab('emergency');
        }}
        onOpenProfile={(doc) => setInspectDoctorProfile(doc)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        statCasesCount={statCases.length}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setSelectedCase(null);
            setSelectedQuestion(null);
            setCurrentTab(tab);
          }}
          statCount={statCases.length}
          openCasesCount={cases.filter(c => c.status !== 'Archived').length}
        />

        {/* Center Main Stage Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* TAB 1: CASES FEED or CASE DETAIL */}
          {currentTab === 'cases' && (
            selectedCase ? (
              <CaseDetail
                caseItem={selectedCase}
                currentDoctor={currentDoctor}
                onBack={() => setSelectedCase(null)}
                onOpenDicom={() => setCurrentTab('dicom')}
                onOpenLiveConsult={() => handleOpenLiveConsultForCase(selectedCase.title)}
              />
            ) : (
              <div className="space-y-6">
                {/* Cases Filter Bar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search patient presentations, abnormal labs, or symptoms..."
                      value={feedSearch}
                      onChange={(e) => setFeedSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={feedSpecialty}
                      onChange={(e) => setFeedSpecialty(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
                    >
                      <option value="All">All Specialties ({cases.length})</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                    </select>

                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => setFeedUrgency('All')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          feedUrgency === 'All' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFeedUrgency('STAT')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          feedUrgency === 'STAT' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        STAT ({statCases.length})
                      </button>
                      <button
                        onClick={() => setFeedUrgency('Priority')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          feedUrgency === 'Priority' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-500'
                        }`}
                      >
                        Priority
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cases Cards List */}
                <div className="space-y-4">
                  {filteredCases.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                      No clinical cases match your filter criteria.
                    </div>
                  ) : (
                    filteredCases.map((c) => (
                      <CaseCard
                        key={c.id}
                        caseItem={c}
                        onSelect={handleSelectCase}
                        onOpenAI={(item) => {
                          setSelectedCase(item);
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          )}

          {/* TAB 2: MEDICAL IMAGING & DICOM VIEWER */}
          {currentTab === 'dicom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Medical Imaging & DICOM Workstation
                  </h1>
                  <p className="text-xs text-slate-500">
                    Interactive multi-modality viewer: Window/Level controls, caliper measurements (mm), and radiologic annotations.
                  </p>
                </div>
              </div>
              <DicomViewer />
            </div>
          )}

          {/* TAB 3: MEDICAL Q&A */}
          {currentTab === 'qa' && (
            selectedQuestion ? (
              <QADetail
                question={selectedQuestion}
                currentDoctor={currentDoctor}
                onBack={() => setSelectedQuestion(null)}
              />
            ) : (
              <QAFeed
                currentDoctor={currentDoctor}
                onSelectQuestion={(q) => setSelectedQuestion(q)}
                onOpenAskModal={() => setIsAskModalOpen(true)}
              />
            )
          )}

          {/* TAB 4: SPECIALTY COMMUNITIES */}
          {currentTab === 'communities' && (
            <CommunityView
              cases={cases}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentTab('cases');
              }}
            />
          )}

          {/* TAB 5: EMERGENCY DASHBOARD */}
          {currentTab === 'emergency' && (
            <EmergencyDashboard
              cases={cases}
              currentDoctor={currentDoctor}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentTab('cases');
              }}
              onLaunchConsult={(title) => handleOpenLiveConsultForCase(title)}
            />
          )}

          {/* TAB 6: LIVE TELE-CONSULT ROOM */}
          {currentTab === 'consult' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Real-Time Tele-Consultation Center
                  </h2>
                  <p className="text-xs text-slate-500">
                    Multi-disciplinary live encrypted consultations with WebRTC audio/video and shared scan whiteboard.
                  </p>
                </div>
                <button
                  onClick={() => setIsLiveConsultOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition"
                >
                  Join Active Consult Session
                </button>
              </div>

              {/* Directly embedded consultation preview */}
              <div className="h-[640px] rounded-2xl overflow-hidden border border-slate-800">
                <RealTimeConsult
                  currentDoctor={currentDoctor}
                  caseTitle="STAT Cardiology & Thoracic Surgery Multidisciplinary Team"
                  onClose={() => setCurrentTab('cases')}
                />
              </div>
            </div>
          )}

          {/* TAB 7: KNOWLEDGE BASE & ADVANCED SEARCH */}
          {currentTab === 'knowledge' && (
            <KnowledgeBase
              cases={cases}
              onSelectCase={(c) => {
                setSelectedCase(c);
                setCurrentTab('cases');
              }}
            />
          )}

          {/* TAB 8: MEDICAL EDUCATION & CME */}
          {currentTab === 'cme' && (
            <CMEPlatform currentDoctor={currentDoctor} />
          )}

          {/* TAB 9: HOSPITAL & ENTERPRISE PORTAL */}
          {currentTab === 'hospital' && (
            <HospitalPortal />
          )}

          {/* TAB 10: LEADERBOARD & REPUTATION */}
          {currentTab === 'leaderboard' && (
            <LeaderboardView
              onSelectDoctor={(doc) => setInspectDoctorProfile(doc)}
            />
          )}

          {/* TAB 11: DOCTOR VERIFICATION & ADMIN */}
          {currentTab === 'admin' && (
            <VerificationAdmin />
          )}
        </main>
      </div>

      {/* Floating Modals */}
      {isNewCaseModalOpen && (
        <CaseCreateModal
          currentDoctor={currentDoctor}
          onClose={() => setIsNewCaseModalOpen(false)}
          onCaseCreated={handleCaseCreated}
        />
      )}

      {isAskModalOpen && (
        <AskQuestionModal
          currentDoctor={currentDoctor}
          onClose={() => setIsAskModalOpen(false)}
          onQuestionCreated={(q) => {
            setSelectedQuestion(q);
            setCurrentTab('qa');
          }}
        />
      )}

      {inspectDoctorProfile && (
        <DoctorProfileModal
          doctor={inspectDoctorProfile}
          onClose={() => setInspectDoctorProfile(null)}
        />
      )}

      {isLiveConsultOpen && (
        <RealTimeConsult
          currentDoctor={currentDoctor}
          caseTitle={liveConsultTitle}
          onClose={() => setIsLiveConsultOpen(false)}
        />
      )}
    </div>
  );
}
export default App;
