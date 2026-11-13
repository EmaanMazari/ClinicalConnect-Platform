export interface HospitalDepartment {
  id: string;
  name: string;
  headOfDepartment: string;
  staffDoctorsCount: number;
  openCasesCount: number;
  avgResponseMinutes: number;
}

export interface ReferralRecord {
  id: string;
  patientAnonId: string;
  referringDoctor: string;
  receivingHospital: string;
  specialtyRequired: string;
  priority: 'Emergency STAT' | 'Urgent' | 'Routine';
  status: 'Pending Triage' | 'Accepted' | 'In Transit' | 'Completed';
  requestDate: string;
  reason: string;
}

export interface HospitalEnterpriseData {
  institutionName: string;
  licenseTier: 'Enterprise Hospital Network' | 'Academic Medical Center';
  totalActivePhysicians: number;
  totalCasesCollaborated: number;
  medianConsultTimeMin: number;
  diagnosticAccuracyImprovementPercent: number;
  departments: HospitalDepartment[];
  referrals: ReferralRecord[];
}

export const MOCK_HOSPITAL_DATA: HospitalEnterpriseData = {
  institutionName: 'Johns Hopkins Medicine - Collaborative Network',
  licenseTier: 'Enterprise Hospital Network',
  totalActivePhysicians: 184,
  totalCasesCollaborated: 1240,
  medianConsultTimeMin: 18.4,
  diagnosticAccuracyImprovementPercent: 34.2,
  departments: [
    {
      id: 'dep-cardio',
      name: 'Division of Cardiology & Cardiac Surgery',
      headOfDepartment: 'Dr. Alexander Wright, MD, FACC',
      staffDoctorsCount: 38,
      openCasesCount: 14,
      avgResponseMinutes: 12
    },
    {
      id: 'dep-neuro',
      name: 'Department of Neurology & Neurosurgery',
      headOfDepartment: 'Dr. Elena Rostova, MD, PhD',
      staffDoctorsCount: 29,
      openCasesCount: 9,
      avgResponseMinutes: 19
    },
    {
      id: 'dep-rad',
      name: 'Department of Diagnostic Radiology',
      headOfDepartment: 'Dr. Marcus Vance, MD, FACR',
      staffDoctorsCount: 44,
      openCasesCount: 22,
      avgResponseMinutes: 8
    },
    {
      id: 'dep-trauma',
      name: 'Emergency & Major Trauma Centre',
      headOfDepartment: 'Dr. Tariq Al-Mansoor, FRCS',
      staffDoctorsCount: 52,
      openCasesCount: 31,
      avgResponseMinutes: 6
    }
  ],
  referrals: [
    {
      id: 'ref-901',
      patientAnonId: 'PT-8891-CARD',
      referringDoctor: 'Dr. Robert King (Mercy Community Hospital)',
      receivingHospital: 'Johns Hopkins Cath Lab 2',
      specialtyRequired: 'Interventional Cardiology (Emergency PCI)',
      priority: 'Emergency STAT',
      status: 'In Transit',
      requestDate: '25 min ago',
      reason: 'Extensive anterior STEMI with cardiogenic shock requiring primary PCI and mechanical circulatory support.'
    },
    {
      id: 'ref-902',
      patientAnonId: 'PT-3301-NEUR',
      referringDoctor: 'Dr. Lisa Miller (County General)',
      receivingHospital: 'Johns Hopkins Neuro-ICU',
      specialtyRequired: 'Neuroimmunology & Gynecologic Surgery',
      priority: 'Urgent',
      status: 'Accepted',
      requestDate: '3 hours ago',
      reason: 'Anti-NMDA encephalitis with ovarian teratoma requiring laparoscopic oophorectomy and plasma exchange.'
    },
    {
      id: 'ref-903',
      patientAnonId: 'PT-4421-ORTH',
      referringDoctor: 'Dr. David Evans (Fairview Clinic)',
      receivingHospital: 'Johns Hopkins Pediatric Orthopedics',
      specialtyRequired: 'Pediatric Orthopedic Surgery',
      priority: 'Urgent',
      status: 'Completed',
      requestDate: 'Yesterday',
      reason: 'Unstable SCFE requiring emergency fluoroscopic single percutaneous screw fixation.'
    }
  ]
};
