import React, { useState } from 'react';
import { MedicalQuestion, MedicalAnswer, Doctor } from '../../types';
import { 
  ArrowLeft, ThumbsUp, CheckCircle, Award, BookOpen, 
  Send, ExternalLink, ShieldCheck, Share2 
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface QADetailProps {
  question: MedicalQuestion;
  currentDoctor: Doctor;
  onBack: () => void;
}

export const QADetail: React.FC<QADetailProps> = ({
  question: initialQuestion,
  currentDoctor,
  onBack
}) => {
  const [question, setQuestion] = useState<MedicalQuestion>(initialQuestion);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [refTitle, setRefTitle] = useState('');
  const [refJournal, setRefJournal] = useState('');

  // Handle upvoting question
  const handleUpvoteQuestion = () => {
    const updated = { ...question, upvotes: question.upvotes + 1 };
    setQuestion(updated);
    storageService.updateQuestion(updated);
  };

  // Handle upvoting an answer
  const handleUpvoteAnswer = (ansId: string) => {
    const updatedAnswers = question.answers.map(ans => {
      if (ans.id === ansId) {
        return { ...ans, upvotes: ans.upvotes + 1 };
      }
      return ans;
    });
    const updated = { ...question, answers: updatedAnswers };
    setQuestion(updated);
    storageService.updateQuestion(updated);
  };

  // Peer endorsement (+1 Clinical Consensus)
  const handleEndorseAnswer = (ansId: string) => {
    const updatedAnswers = question.answers.map(ans => {
      if (ans.id === ansId) {
        return { ...ans, peerEndorsements: ans.peerEndorsements + 1 };
      }
      return ans;
    });
    const updated = { ...question, answers: updatedAnswers };
    setQuestion(updated);
    storageService.updateQuestion(updated);
  };

  // Post an evidence-based answer
  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswerText.trim()) return;

    const references = refTitle ? [{ title: refTitle, journal: refJournal || 'Peer-reviewed Medical Journal' }] : [];

    const newAnswer: MedicalAnswer = {
      id: `ans-${Date.now()}`,
      author: currentDoctor,
      content: newAnswerText.trim(),
      createdAt: 'Just now',
      upvotes: 1,
      peerEndorsements: 0,
      isAccepted: false,
      references
    };

    const updated = {
      ...question,
      answers: [...question.answers, newAnswer]
    };
    setQuestion(updated);
    storageService.updateQuestion(updated);

    setNewAnswerText('');
    setRefTitle('');
    setRefJournal('');
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-medical-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Medical Q&A Feed</span>
      </button>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-medical-50 text-medical-800 dark:bg-medical-950 dark:text-medical-300 border border-medical-200 dark:border-medical-800">
            {question.specialty}
          </span>
          <span className="text-xs text-slate-500">Asked {question.createdAt}</span>
          <span className="text-xs text-slate-500">• {question.views} views</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-snug">
          {question.title}
        </h1>

        <div className="flex gap-4">
          {/* Upvote button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleUpvoteQuestion}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-medical-50 text-slate-700 dark:text-slate-300 hover:text-medical-600 transition"
              title="Upvote question"
            >
              <ThumbsUp className="w-5 h-5" />
            </button>
            <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200 mt-1">
              {question.upvotes}
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {question.description}
            </p>

            {/* Attached Guidelines */}
            {question.clinicalGuidelinesLinked && question.clinicalGuidelinesLinked.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs">
                <span className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5 mb-1">
                  <BookOpen className="w-4 h-4" /> Attached Clinical Society Guidelines:
                </span>
                <ul className="list-disc list-inside text-purple-800 dark:text-purple-300 space-y-0.5">
                  {question.clinicalGuidelinesLinked.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags and Author */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {question.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={question.author.avatar}
                  alt={question.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-semibold text-slate-900 dark:text-slate-100">{question.author.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-medical-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {question.answers.length} Evidence-Based Answers
          </h2>
          <span className="text-xs text-slate-500">Sorted by Peer Endorsements</span>
        </div>

        {question.answers.map((ans) => (
          <div
            key={ans.id}
            className={`p-6 rounded-2xl border transition shadow-sm ${
              ans.isAccepted
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* Accepted Answer Banner */}
            {ans.isAccepted && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-4 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 w-fit">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Accepted Best Clinical Answer by Specialty Lead</span>
              </div>
            )}

            <div className="flex gap-4">
              {/* Vote & Endorse Column */}
              <div className="flex flex-col items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => handleUpvoteAnswer(ans.id)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-medical-50 text-slate-700 dark:text-slate-300 hover:text-medical-600 transition"
                  title="Upvote answer"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <span className="font-bold">{ans.upvotes}</span>

                <button
                  onClick={() => handleEndorseAnswer(ans.id)}
                  className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition"
                  title="Endorse (+1 Clinical Consensus)"
                >
                  <Award className="w-4 h-4" />
                </button>
                <span className="text-[10px] text-purple-600 font-sans font-bold">
                  {ans.peerEndorsements} consensus
                </span>
              </div>

              {/* Answer Content */}
              <div className="flex-1 space-y-4">
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {ans.content}
                </div>

                {/* PubMed / Literature References */}
                {ans.references && ans.references.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Evidence-Based Citations (PubMed / DOI):
                    </span>
                    {ans.references.map((ref, idx) => (
                      <div key={idx} className="text-slate-600 dark:text-slate-400 flex items-center justify-between">
                        <span>• {ref.title} &mdash; <em className="text-slate-500">{ref.journal}</em></span>
                        {ref.doi && (
                          <span className="text-medical-600 font-mono text-[10px] flex items-center gap-0.5">
                            DOI: {ref.doi} <ExternalLink className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">Answered {ans.createdAt}</span>

                  <div className="flex items-center gap-2">
                    <img
                      src={ans.author.avatar}
                      alt={ans.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                        <span>{ans.author.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-medical-600" />
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {ans.author.specialty} • {ans.author.hospitalAffiliation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Your Answer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
          Your Clinical Answer
        </h3>
        <p className="text-xs text-slate-500">
          Provide detailed medical rationale, citing relevant trials (e.g. NEJM, Lancet, Circulation) or professional guidelines.
        </p>

        <form onSubmit={handlePostAnswer} className="space-y-3 text-xs">
          <textarea
            rows={5}
            value={newAnswerText}
            onChange={(e) => setNewAnswerText(e.target.value)}
            placeholder="Write your clinical answer here..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500 text-xs"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Primary Literature Citation Title (e.g. MASTER DAPT Trial)"
              value={refTitle}
              onChange={(e) => setRefTitle(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            />
            <input
              type="text"
              placeholder="Journal & Year (e.g. NEJM 2021; 385:1643-1655)"
              value={refJournal}
              onChange={(e) => setRefJournal(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Verified Clinical Answer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
