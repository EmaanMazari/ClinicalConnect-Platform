import React, { useState } from 'react';
import { MedicalQuestion, Specialty, Doctor } from '../../types';
import { 
  HelpCircle, CheckCircle, ThumbsUp, MessageSquare, 
  Eye, Plus, BookOpen, Search, Filter, ShieldCheck 
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface QAFeedProps {
  currentDoctor: Doctor;
  onSelectQuestion: (q: MedicalQuestion) => void;
  onOpenAskModal: () => void;
}

export const QAFeed: React.FC<QAFeedProps> = ({
  currentDoctor,
  onSelectQuestion,
  onOpenAskModal
}) => {
  const [questions, setQuestions] = useState<MedicalQuestion[]>(() => storageService.getQuestions());
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = questions.filter(q => {
    const matchesSpec = selectedSpecialty === 'All' || q.specialty === selectedSpecialty;
    const matchesQuery = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSpec && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-medical-50 text-medical-600 dark:bg-medical-950 dark:text-medical-400 border border-medical-200 dark:border-medical-800">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Medical Q&A Knowledge Exchange
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            A peer-moderated clinical questions forum inspired by Stack Overflow. Doctors provide evidence-based answers with PubMed citations, clinical guideline links, and accepted diagnoses.
          </p>
        </div>

        <button
          onClick={onOpenAskModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Clinical Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search medical questions, guidelines, or drug interactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500"
          />
        </div>

        {/* Specialty Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['All', 'Cardiology', 'Radiology', 'Pediatrics', 'Neurology', 'Orthopedics'].map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                selectedSpecialty === spec
                  ? 'bg-medical-600 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No medical questions match your search criteria.
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              onClick={() => onSelectQuestion(q)}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-medical-500 rounded-2xl p-5 shadow-sm transition cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Stats Counter Column (Stack Overflow style) */}
                <div className="flex md:flex-col items-center gap-3 md:gap-2 text-center text-xs shrink-0 font-mono">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 min-w-[64px]">
                    <span className="block font-bold text-sm text-slate-800 dark:text-slate-200">{q.upvotes}</span>
                    <span className="text-[10px] text-slate-500 font-sans">votes</span>
                  </div>

                  <div className={`p-2 rounded-xl min-w-[64px] border ${
                    q.hasAcceptedAnswer
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-transparent text-slate-700 dark:text-slate-300'
                  }`}>
                    <div className="flex items-center justify-center gap-1">
                      {q.hasAcceptedAnswer && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      <span className="font-bold text-sm">{q.answers.length}</span>
                    </div>
                    <span className="text-[10px] font-sans">answers</span>
                  </div>

                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{q.views}</span>
                  </div>
                </div>

                {/* Question Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-medical-50 text-medical-800 dark:bg-medical-950 dark:text-medical-300 border border-medical-200 dark:border-medical-800">
                      {q.specialty}
                    </span>
                    {q.clinicalGuidelinesLinked && q.clinicalGuidelinesLinked.length > 0 && (
                      <span className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                        <BookOpen className="w-3 h-3" />
                        <span>Clinical Guideline Linked</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-medical-600 dark:group-hover:text-medical-400 transition">
                    {q.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {q.description}
                  </p>

                  {/* Tags and Author */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {q.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <img
                        src={q.author.avatar}
                        alt={q.author.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{q.author.name}</span>
                      <span>• {q.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
