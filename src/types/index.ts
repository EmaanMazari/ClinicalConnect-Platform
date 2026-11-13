export type Specialty = 
  | 'Cardiology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Radiology'
  | 'Oncology'
  | 'Pediatrics'
  | 'Dermatology'
  | 'Psychiatry'
  | 'Emergency Medicine'
  | 'Gynecology & Obstetrics'
  | 'General Practice';

export type UserRole = 
  | 'Specialist'
  | 'Consultant'
  | 'Surgeon'
  | 'Physician'
  | 'Resident'
  | 'Radiologist'
  | 'Emergency Doctor'
  | 'Hospital Admin'
  | 'Medical Moderator';

export interface Doctor {
  id: string;
  name: string;
  title: string; // e.g. "MD, FACC, FSCAI"
  email: string;
  avatar: string;
  specialty: Specialty;
  subspecialty: string;
  licenseNumber: string;
  licensingBoard: string;
  verificationStatus: 'verified' | 'pending' | 'under_review';
  hospitalAffiliation: string;
  department: string;
  experienceYears: number;
  qualifications: string[];
  reputationScore: number;
  researchContributions: {
    publicationsCount: number;
    hIndex: number;
    topPaper?: string;
  };
  areasOfExpertise: string[];
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    tier: 'gold' | 'silver' | 'bronze' | 'verified';
  }>;
  acceptedDiagnosesCount: number;
  helpfulAnswersCount: number;
  peerEndorsementsCount: number;
}

export type UrgencyLevel = 'Routine' | 'Priority' | 'Emergency STAT';

export type CaseStatus = 'Open' | 'Differential Active' | 'Diagnosis Accepted' | 'Archived' | 'Grand Rounds';

export interface PatientInfo {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  anonymizedId: string;
  chiefComplaint: string;
  symptoms: string[];
  durationOfIllness: string;
  medicalHistory: string[];
  familyHistory?: string;
  allergies?: string[];
}

export interface LabValue {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface Prescription {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
}

export interface VitalSigns {
  bloodPressure: string; // "142/88 mmHg"
  heartRate: number;      // 98 bpm
  respiratoryRate: number;// 22 bpm
  temperature: number;    // 38.6 °C
  oxygenSaturation: number;// 93% on room air
  gcs?: number;          // Glasgow Coma Scale
}

export interface CaseAttachment {
  id: string;
  title: string;
  modality: 'X-Ray' | 'CT Scan' | 'MRI' | 'ECG' | 'Ultrasound' | 'Pathology' | 'Audio Note' | 'PDF Report';
  url: string;
  thumbnailUrl?: string;
  isDicom: boolean;
  dicomSeriesId?: string;
  anonymized: boolean;
  notes?: string;
}

export interface CaseComment {
  id: string;
  authorId: string;
  authorName: string;
  authorSpecialty: Specialty;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  isAcceptedDiagnosis?: boolean;
  differentialProposal?: {
    diagnosis: string;
    icd10: string;
    confidence: number;
    rationale: string;
  };
  citations?: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
}

export interface ClinicalCase {
  id: string;
  title: string;
  summary: string;
  specialty: Specialty;
  subspecialtyTags: string[];
  author: Doctor;
  createdAt: string;
  status: CaseStatus;
  urgency: UrgencyLevel;
  statDeadline?: string; // For Emergency consultations
  patient: PatientInfo;
  vitals: VitalSigns;
  labs: LabValue[];
  prescriptions: Prescription[];
  attachments: CaseAttachment[];
  discussionGoals: Array<
    'Diagnostic assistance' | 'Treatment recommendations' | 'Surgical opinions' | 'Referral guidance' | 'Rare disease discussions'
  >;
  aiInsights?: {
    summary: string;
    differentialDiagnoses: Array<{
      condition: string;
      icd10: string;
      probability: number;
      rationale: string;
      recommendedTests: string[];
    }>;
    drugInteractions: Array<{
      severity: 'High' | 'Moderate' | 'Minor';
      drugs: [string, string];
      warning: string;
    }>;
    relevantGuidelines: Array<{
      title: string;
      organization: string;
      year: number;
      summary: string;
    }>;
    similarArchivedCaseIds: string[];
  };
  comments: CaseComment[];
  viewsCount: number;
  subscribersCount: number;
  isHipaaVerified: boolean;
}

export interface MedicalQuestion {
  id: string;
  title: string;
  description: string;
  specialty: Specialty;
  tags: string[];
  author: Doctor;
  createdAt: string;
  views: number;
  upvotes: number;
  hasAcceptedAnswer: boolean;
  answers: MedicalAnswer[];
  clinicalGuidelinesLinked?: string[];
}

export interface MedicalAnswer {
  id: string;
  author: Doctor;
  content: string;
  createdAt: string;
  upvotes: number;
  peerEndorsements: number;
  isAccepted: boolean;
  references: Array<{
    title: string;
    journal: string;
    doi?: string;
  }>;
}

export interface QuizQuestion {
  id: string;
  specialty: Specialty;
  title: string;
  clinicalScenario: string;
  imagingUrl?: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  cmeCreditsAwarded: number;
}

export interface CMEProfile {
  earnedCredits: number;
  requiredCredits: number;
  completedQuizzesCount: number;
  certificates: Array<{
    id: string;
    title: string;
    issueDate: string;
    credits: number;
    specialty: Specialty;
    credentialId: string;
  }>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  doctorId: string;
  doctorName: string;
  action: 'VIEWED_CASE' | 'EXPORTED_RECORD' | 'POSTED_DIFFERENTIAL' | 'ACCEPTED_DIAGNOSIS' | 'ANONYMIZED_MEDIA';
  caseId: string;
  ipAddress: string;
  complianceFlag: 'HIPAA_COMPLIANT' | 'GDPR_VERIFIED';
}
