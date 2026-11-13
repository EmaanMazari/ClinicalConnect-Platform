import React, { useState } from 'react';
import { 
  ShieldCheck, Siren, Sun, Moon, Search, Plus, 
  HelpCircle, Eye, Users, ChevronDown, Bell, Stethoscope 
} from 'lucide-react';
import { Doctor, Specialty } from '../../types';
import { MOCK_DOCTORS } from '../../data/mockDoctors';

interface NavbarProps {
  currentDoctor: Doctor;
  onSwitchDoctor: (doc: Doctor) => void;
  onOpenNewCaseModal: () => void;
  onOpenAskModal: () => void;
  onSelectEmergencyTab: () => void;
  onOpenProfile: (doc: Doctor) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  statCasesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDoctor,
  onSwitchDoctor,
  onOpenNewCaseModal,
  onOpenAskModal,
  onSelectEmergencyTab,
  onOpenProfile,
  darkMode,
  onToggleDarkMode,
  statCasesCount
}) => {
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-medical-600 to-clinical-blue flex items-center justify-center text-white shadow-md shadow-medical-600/20">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-slate-900 dark:text-slate-100">
                Clinical<span className="text-medical-600">Connect</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-medical-50 dark:bg-medical-950 text-medical-700 dark:text-medical-300 border border-medical-200 dark:border-medical-800">
                MD ONLY
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wide hidden sm:block">
              Intelligent Collaborative Medical Platform
            </div>
          </div>
        </div>

        {/* STAT Alert Button */}
        {statCasesCount > 0 && (
          <button
            onClick={onSelectEmergencyTab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition animate-pulse"
          >
            <Siren className="w-4 h-4" />
            <span className="hidden md:inline">STAT CONSULT</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white text-red-700 font-mono text-[10px]">
              {statCasesCount}
            </span>
          </button>
        )}

        {/* Action Controls & Doctor Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Post Case Button */}
          <button
            onClick={onOpenNewCaseModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Clinical Case</span>
          </button>

          {/* Ask Question Button */}
          <button
            onClick={onOpenAskModal}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
          >
            <HelpCircle className="w-4 h-4 text-medical-600" />
            <span>Ask Q&A</span>
          </button>

          {/* Dark Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode (Radiology Reading)'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Doctor Profile Selector & Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition"
            >
              <img
                src={currentDoctor.avatar}
                alt={currentDoctor.name}
                className="w-8 h-8 rounded-full object-cover border border-medical-500"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <span>{currentDoctor.name}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-medical-600" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentDoctor.specialty} • {currentDoctor.reputationScore} pts
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Switch Doctor Dropdown */}
            {showDoctorDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 text-xs">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase block mb-1">
                    Current Verified Doctor
                  </span>
                  <div
                    onClick={() => {
                      onOpenProfile(currentDoctor);
                      setShowDoctorDropdown(false);
                    }}
                    className="font-bold text-slate-900 dark:text-slate-100 hover:text-medical-600 cursor-pointer"
                  >
                    View Full Medical Profile &rarr;
                  </div>
                </div>

                <div className="p-1">
                  <span className="font-semibold text-slate-400 text-[10px] uppercase block px-2 mb-1">
                    Switch Test Doctor Persona
                  </span>
                  {MOCK_DOCTORS.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        onSwitchDoctor(doc);
                        setShowDoctorDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-xl text-left transition ${
                        doc.id === currentDoctor.id
                          ? 'bg-medical-50 dark:bg-medical-950/60 text-medical-700 dark:text-medical-300 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <img src={doc.avatar} alt={doc.name} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <div className="truncate text-xs">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">{doc.specialty}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
