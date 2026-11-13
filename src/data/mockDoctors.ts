import { Doctor } from '../types';

export const CURRENT_DOCTOR: Doctor = {
  id: 'doc-001',
  name: 'Dr. Alexander Wright',
  title: 'MD, FACC, FSCAI',
  email: 'a.wright@hopkinsmedicine.org',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  specialty: 'Cardiology',
  subspecialty: 'Interventional Cardiology & Hemodynamics',
  licenseNumber: 'MD-948201-US',
  licensingBoard: 'American Board of Internal Medicine / Cardiovascular Disease',
  verificationStatus: 'verified',
  hospitalAffiliation: 'Johns Hopkins Medical Center',
  department: 'Division of Cardiology, Catheterization Lab',
  experienceYears: 16,
  qualifications: ['MD (Harvard Medical School)', 'Cardiology Fellowship (Mass General)', 'FACC Fellow', 'Board Certified in Adult Cardiology'],
  reputationScore: 3420,
  researchContributions: {
    publicationsCount: 42,
    hIndex: 28,
    topPaper: 'Percutaneous Coronary Intervention in Cardiogenic Shock: 5-Year Registry Outcomes (Circulation, 2023)'
  },
  areasOfExpertise: ['Coronary Artery Disease', 'TAVR', 'Cardiogenic Shock', 'Intravascular Ultrasound', 'Myocardial Infarction'],
  badges: [
    { id: 'b1', name: 'Board Certified', icon: 'ShieldCheck', description: 'Verified credentials by accredited state medical board', tier: 'verified' },
    { id: 'b2', name: 'Master Clinician', icon: 'Award', description: 'Over 50 accepted clinical differentials on complex cases', tier: 'gold' },
    { id: 'b3', name: 'Emergency Responder', icon: 'Zap', description: 'Responded to STAT emergency consults within 15 minutes', tier: 'silver' },
    { id: 'b4', name: 'CME Educator', icon: 'BookOpen', description: 'Authored certified continuing medical education modules', tier: 'bronze' }
  ],
  acceptedDiagnosesCount: 68,
  helpfulAnswersCount: 215,
  peerEndorsementsCount: 490
};

export const MOCK_DOCTORS: Doctor[] = [
  CURRENT_DOCTOR,
  {
    id: 'doc-002',
    name: 'Dr. Elena Rostova',
    title: 'MD, PhD, FAAN',
    email: 'elena.rostova@charite.de',
    avatar: 'https://images.unsplash.com/photo-1594824813583-162776891eb6?w=150&auto=format&fit=crop&q=80',
    specialty: 'Neurology',
    subspecialty: 'Neuroimmunology & Autoimmune Encephalitis',
    licenseNumber: 'DE-BER-449102',
    licensingBoard: 'German Federal Medical Council (BÄK)',
    verificationStatus: 'verified',
    hospitalAffiliation: 'Charité – Universitätsmedizin Berlin',
    department: 'Department of Neurology',
    experienceYears: 14,
    qualifications: ['MD (Heidelberg)', 'PhD in Neuroimmunology', 'FAAN Fellow'],
    reputationScore: 3890,
    researchContributions: {
      publicationsCount: 56,
      hIndex: 32,
      topPaper: 'Autoimmune Encephalitis Biomarkers in Cerebrospinal Fluid (Lancet Neurology, 2024)'
    },
    areasOfExpertise: ['Anti-NMDA Receptor Encephalitis', 'Multiple Sclerosis', 'Neuro-critical Care', 'CSF Analysis'],
    badges: [
      { id: 'b1', name: 'Board Certified', icon: 'ShieldCheck', description: 'Verified credentials', tier: 'verified' },
      { id: 'b2', name: 'Rare Disease Hero', icon: 'Sparkles', description: 'Identified 10+ orphan diseases', tier: 'gold' }
    ],
    acceptedDiagnosesCount: 94,
    helpfulAnswersCount: 310,
    peerEndorsementsCount: 620
  },
  {
    id: 'doc-003',
    name: 'Dr. Marcus Vance',
    title: 'MD, FACR',
    email: 'mvance@mayoclinic.org',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    specialty: 'Radiology',
    subspecialty: 'Thoracic & Body CT/MRI Imaging',
    licenseNumber: 'MN-RAD-771249',
    licensingBoard: 'American Board of Radiology',
    verificationStatus: 'verified',
    hospitalAffiliation: 'Mayo Clinic, Rochester',
    department: 'Department of Diagnostic Radiology',
    experienceYears: 19,
    qualifications: ['MD (Johns Hopkins)', 'Fellowship in Thoracic Imaging (Mayo Clinic)'],
    reputationScore: 4120,
    researchContributions: {
      publicationsCount: 68,
      hIndex: 35,
      topPaper: 'High-Resolution Computed Tomography in Interstitial Lung Disease (Radiology, 2022)'
    },
    areasOfExpertise: ['High-Resolution CT', 'Pneumothorax Detection', 'Pulmonary Embolism', 'Dual-Energy CT'],
    badges: [
      { id: 'b1', name: 'Board Certified', icon: 'ShieldCheck', description: 'Verified credentials', tier: 'verified' },
      { id: 'b5', name: 'Top Imaging Reviewer', icon: 'Eye', description: 'Annotated over 500 clinical scans', tier: 'gold' }
    ],
    acceptedDiagnosesCount: 112,
    helpfulAnswersCount: 420,
    peerEndorsementsCount: 840
  },
  {
    id: 'doc-004',
    name: 'Dr. Sophia Chen',
    title: 'MD, MPH, FAAP',
    email: 'schen@seattlechildrens.org',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    specialty: 'Pediatrics',
    subspecialty: 'Pediatric Critical Care & Infectious Diseases',
    licenseNumber: 'WA-PED-882310',
    licensingBoard: 'American Board of Pediatrics',
    verificationStatus: 'verified',
    hospitalAffiliation: 'Seattle Children’s Hospital',
    department: 'Pediatric Intensive Care Unit (PICU)',
    experienceYears: 11,
    qualifications: ['MD (Stanford University)', 'MPH (Harvard)', 'FAAP Fellow'],
    reputationScore: 2650,
    researchContributions: {
      publicationsCount: 29,
      hIndex: 18,
      topPaper: 'Early Biomarkers of Sepsis in Pediatric Intensive Care (Pediatrics, 2023)'
    },
    areasOfExpertise: ['Pediatric Sepsis', 'MIS-C', 'Congenital Anomalies', 'Pediatric Resuscitation'],
    badges: [
      { id: 'b1', name: 'Board Certified', icon: 'ShieldCheck', description: 'Verified credentials', tier: 'verified' }
    ],
    acceptedDiagnosesCount: 45,
    helpfulAnswersCount: 178,
    peerEndorsementsCount: 380
  },
  {
    id: 'doc-005',
    name: 'Dr. Tariq Al-Mansoor',
    title: 'MBBS, FRCS (Tr & Orth)',
    email: 't.almansoor@imperial.ac.uk',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    specialty: 'Orthopedics',
    subspecialty: 'Pediatric Orthopedics & Complex Trauma',
    licenseNumber: 'GMC-7193021-UK',
    licensingBoard: 'General Medical Council (UK)',
    verificationStatus: 'verified',
    hospitalAffiliation: 'St Mary’s Hospital, London',
    department: 'Major Trauma Centre & Orthopedics',
    experienceYears: 15,
    qualifications: ['MBBS (Imperial College)', 'FRCS (Royal College of Surgeons of England)'],
    reputationScore: 2980,
    researchContributions: {
      publicationsCount: 34,
      hIndex: 21,
      topPaper: 'Minimally Invasive Fixation in Slipped Capital Femoral Epiphysis (JBJS, 2023)'
    },
    areasOfExpertise: ['SCFE', 'Pediatric Fractures', 'Pelvic Reconstruction', 'Arthroplasty'],
    badges: [
      { id: 'b1', name: 'Board Certified', icon: 'ShieldCheck', description: 'Verified credentials', tier: 'verified' },
      { id: 'b6', name: 'Surgical Pioneer', icon: 'Scissors', description: 'Published innovative surgical approaches', tier: 'silver' }
    ],
    acceptedDiagnosesCount: 52,
    helpfulAnswersCount: 195,
    peerEndorsementsCount: 410
  }
];
