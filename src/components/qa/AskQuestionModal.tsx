import React, { useState } from 'react';
import { X, HelpCircle, Send } from 'lucide-react';
import { Specialty, Doctor, MedicalQuestion } from '../../types';
import { storageService } from '../../services/storageService';

interface AskQuestionModalProps {
  currentDoctor: Doctor;
  onClose: () => void;
  onQuestionCreated: (q: MedicalQuestion) => void;
}

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  currentDoctor,
  onClose,
  onQuestionCreated
}) => {
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>(currentDoctor.specialty);
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [guidelineInput, setGuidelineInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['ClinicalCase', specialty];
    const guidelines = guidelineInput ? [guidelineInput.trim()] : [];

    const newQuestion: MedicalQuestion = {
      id: `qa-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      specialty,
      tags,
      author: currentDoctor,
      createdAt: 'Just now',
      views: 1,
      upvotes: 1,
      hasAcceptedAnswer: false,
      answers: [],
      clinicalGuidelinesLinked: guidelines
    };

    storageService.saveQuestion(newQuestion);
    onQuestionCreated(newQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-medical-50 text-medical-600 dark:bg-medical-950 dark:text-medical-400 border border-medical-200 dark:border-medical-800">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Ask a Structured Medical Question
              </h2>
              <span className="text-xs text-slate-500">
                Peer consultation for clinical protocols, drug interactions, and diagnostics
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-800 dark:text-slate-200">
          <div>
            <label className="font-semibold block mb-1">Question Title *</label>
            <input
              type="text"
              placeholder="e.g. Optimal DAPT duration post-PCI in patients with high bleeding risk (ARC-HBR)?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold block mb-1">Specialty</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as Specialty)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              >
                {[
                  'Cardiology', 'Neurology', 'Orthopedics', 'Radiology',
                  'Oncology', 'Pediatrics', 'Dermatology', 'Psychiatry',
                  'Emergency Medicine', 'Gynecology & Obstetrics', 'General Practice'
                ].map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="DAPT, Anticoagulation, Guidelines"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1">Detailed Clinical Context & Question *</label>
            <textarea
              rows={5}
              placeholder="Provide background, clinical parameters, prior therapy attempts, and specific queries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-medical-500"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Attach Guideline Reference (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 2023 ESC Guidelines for Management of Acute Coronary Syndromes"
              value={guidelineInput}
              onChange={(e) => setGuidelineInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold shadow-md transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
