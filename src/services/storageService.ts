import { ClinicalCase, MedicalQuestion, CMEProfile, AuditLogEntry, Doctor } from '../types';
import { MOCK_CASES } from '../data/mockCases';
import { MOCK_QUESTIONS } from '../data/mockQA';
import { INITIAL_CME_PROFILE } from '../data/mockCME';
import { CURRENT_DOCTOR } from '../data/mockDoctors';

const CASES_KEY = 'clinical_connect_cases_v1';
const QA_KEY = 'clinical_connect_qa_v1';
const CME_KEY = 'clinical_connect_cme_v1';
const AUDIT_KEY = 'clinical_connect_audit_v1';
const DOCTOR_KEY = 'clinical_connect_current_doctor_v1';
const DRAFT_KEY = 'clinical_connect_case_draft_v1';

export const storageService = {
  getCases(): ClinicalCase[] {
    try {
      const data = localStorage.getItem(CASES_KEY);
      if (!data) {
        localStorage.setItem(CASES_KEY, JSON.stringify(MOCK_CASES));
        return MOCK_CASES;
      }
      return JSON.parse(data);
    } catch {
      return MOCK_CASES;
    }
  },

  saveCase(newCase: ClinicalCase) {
    const cases = this.getCases();
    const updated = [newCase, ...cases];
    localStorage.setItem(CASES_KEY, JSON.stringify(updated));
    return updated;
  },

  updateCase(updatedCase: ClinicalCase) {
    const cases = this.getCases();
    const idx = cases.findIndex(c => c.id === updatedCase.id);
    if (idx !== -1) {
      cases[idx] = updatedCase;
      localStorage.setItem(CASES_KEY, JSON.stringify(cases));
    }
    return cases;
  },

  getQuestions(): MedicalQuestion[] {
    try {
      const data = localStorage.getItem(QA_KEY);
      if (!data) {
        localStorage.setItem(QA_KEY, JSON.stringify(MOCK_QUESTIONS));
        return MOCK_QUESTIONS;
      }
      return JSON.parse(data);
    } catch {
      return MOCK_QUESTIONS;
    }
  },

  saveQuestion(question: MedicalQuestion) {
    const questions = this.getQuestions();
    const updated = [question, ...questions];
    localStorage.setItem(QA_KEY, JSON.stringify(updated));
    return updated;
  },

  updateQuestion(updated: MedicalQuestion) {
    const questions = this.getQuestions();
    const idx = questions.findIndex(q => q.id === updated.id);
    if (idx !== -1) {
      questions[idx] = updated;
      localStorage.setItem(QA_KEY, JSON.stringify(questions));
    }
    return questions;
  },

  getCMEProfile(): CMEProfile {
    try {
      const data = localStorage.getItem(CME_KEY);
      if (!data) {
        localStorage.setItem(CME_KEY, JSON.stringify(INITIAL_CME_PROFILE));
        return INITIAL_CME_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CME_PROFILE;
    }
  },

  saveCMEProfile(profile: CMEProfile) {
    localStorage.setItem(CME_KEY, JSON.stringify(profile));
  },

  getAuditLogs(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(AUDIT_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addAuditLog(entry: AuditLogEntry) {
    const logs = this.getAuditLogs();
    const updated = [entry, ...logs].slice(0, 100);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
    return updated;
  },

  getCurrentDoctor(): Doctor {
    try {
      const data = localStorage.getItem(DOCTOR_KEY);
      return data ? JSON.parse(data) : CURRENT_DOCTOR;
    } catch {
      return CURRENT_DOCTOR;
    }
  },

  saveCurrentDoctor(doctor: Doctor) {
    localStorage.setItem(DOCTOR_KEY, JSON.stringify(doctor));
  },

  saveDraft(draft: unknown) {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  },

  getDraft(): unknown {
    try {
      const data = localStorage.getItem(DRAFT_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
  }
};
