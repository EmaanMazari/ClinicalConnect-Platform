import { Specialty } from '../types';
import { MOCK_DOCTORS } from './mockDoctors';

export interface SpecialtyCommunity {
  id: string;
  name: Specialty;
  description: string;
  icon: string;
  memberCount: number;
  activeDiscussionsCount: number;
  moderators: Array<{
    id: string;
    name: string;
    title: string;
  }>;
  trendingTags: string[];
  clinicalProtocols: Array<{
    title: string;
    updateDate: string;
    downloads: number;
  }>;
}

export const SPECIALTY_COMMUNITIES: SpecialtyCommunity[] = [
  {
    id: 'comm-cardio',
    name: 'Cardiology',
    description: 'Evidence-based cardiology discussions spanning interventional procedures, electrophysiology, structural heart disease, and heart failure management.',
    icon: 'HeartPulse',
    memberCount: 3840,
    activeDiscussionsCount: 142,
    moderators: [
      { id: 'doc-001', name: 'Dr. Alexander Wright', title: 'MD, FACC' }
    ],
    trendingTags: ['#STEMIProtocols', '#TAVR', '#ImpellaHemodynamics', '#AfibAblation', '#HFpEF'],
    clinicalProtocols: [
      { title: 'STAT Cath Lab Activation Pathway for High-Risk Cardiogenic Shock (2024)', updateDate: 'Oct 2024', downloads: 890 },
      { title: 'Invasive Hemodynamic Monitoring & Waveform Interpretation Guide', updateDate: 'Aug 2024', downloads: 1240 }
    ]
  },
  {
    id: 'comm-neuro',
    name: 'Neurology',
    description: 'Clinical forum for neurologists, neuroimmunologists, epileptologists, and neuro-intensivists discussing complex central and peripheral nervous system cases.',
    icon: 'Brain',
    memberCount: 2910,
    activeDiscussionsCount: 98,
    moderators: [
      { id: 'doc-002', name: 'Dr. Elena Rostova', title: 'MD, PhD, FAAN' }
    ],
    trendingTags: ['#AutoimmuneEncephalitis', '#StrokeThrombectomy', '#RefractoryStatusEpilepticus', '#MyastheniaGravis'],
    clinicalProtocols: [
      { title: 'CSF Serology & Cell-Based Assay Ordering Algorithmic Pathway', updateDate: 'Sep 2024', downloads: 640 },
      { title: 'Tenecteplase vs Alteplase in Acute Ischemic Stroke Fast-Track', updateDate: 'Nov 2024', downloads: 1100 }
    ]
  },
  {
    id: 'comm-radio',
    name: 'Radiology',
    description: 'Subspecialized peer imaging analysis, multi-slice CT/MRI consultation, DICOM case sharing, and difficult diagnostic spotters.',
    icon: 'Scan',
    memberCount: 3120,
    activeDiscussionsCount: 164,
    moderators: [
      { id: 'doc-003', name: 'Dr. Marcus Vance', title: 'MD, FACR' }
    ],
    trendingTags: ['#DICOMReview', '#DualEnergyCT', '#PI-RADS', '#LI-RADS', '#StrokePerfusion'],
    clinicalProtocols: [
      { title: 'Standardized Contrast Injection Protocols for High-Pitch Thoracic CTA', updateDate: 'Jul 2024', downloads: 1450 }
    ]
  },
  {
    id: 'comm-ortho',
    name: 'Orthopedics',
    description: 'Surgical technique debates, complex polytrauma reconstruction, pediatric deformity correction, and biomechanical implant discussions.',
    icon: 'Bone',
    memberCount: 2450,
    activeDiscussionsCount: 84,
    moderators: [
      { id: 'doc-005', name: 'Dr. Tariq Al-Mansoor', title: 'MBBS, FRCS' }
    ],
    trendingTags: ['#PediatricSCFE', '#PelvicFractures', '#RoboticArthroplasty', '#ComplexNonUnion'],
    clinicalProtocols: [
      { title: 'Pediatric Hip Emergent Pinning Fluoroscopy Safety Checklist', updateDate: 'May 2024', downloads: 580 }
    ]
  },
  {
    id: 'comm-peds',
    name: 'Pediatrics',
    description: 'General pediatrics, neonatal care, pediatric critical care, congenital disease management, and child health advocacy.',
    icon: 'Baby',
    memberCount: 2780,
    activeDiscussionsCount: 112,
    moderators: [
      { id: 'doc-004', name: 'Dr. Sophia Chen', title: 'MD, MPH, FAAP' }
    ],
    trendingTags: ['#NeonatalSepsis', '#MIS-C', '#PediatricECMO', '#CongenitalMetabolicErrors'],
    clinicalProtocols: [
      { title: 'Febrile Infant Risk Stratification Guideline (Ages 8-60 Days)', updateDate: 'Aug 2024', downloads: 990 }
    ]
  },
  {
    id: 'comm-emer',
    name: 'Emergency Medicine',
    description: 'Resuscitation, point-of-care ultrasound (POCUS), toxidromes, acute airway management, and rapid triage coordination.',
    icon: 'Siren',
    memberCount: 4200,
    activeDiscussionsCount: 210,
    moderators: [
      { id: 'doc-001', name: 'Dr. Alexander Wright', title: 'MD, FACC' }
    ],
    trendingTags: ['#STATConsults', '#POCUS', '#DifficultAirway', '#ToxicologyAlerts', '#MassCasualty'],
    clinicalProtocols: [
      { title: 'Emergency Massive Transfusion Protocol (1:1:1 Ratio Balanced Resuscitation)', updateDate: 'Sep 2024', downloads: 2200 }
    ]
  },
  {
    id: 'comm-onco',
    name: 'Oncology',
    description: 'Multidisciplinary tumor boards, immunotherapy toxicity management, molecular targeted therapies, and clinical trial matching.',
    icon: 'Activity',
    memberCount: 2600,
    activeDiscussionsCount: 95,
    moderators: [
      { id: 'doc-002', name: 'Dr. Elena Rostova', title: 'MD, PhD' }
    ],
    trendingTags: ['#CAR-T', '#ImmuneCheckpointToxicity', '#NextGenSequencing', '#TargetedTherapy'],
    clinicalProtocols: [
      { title: 'Management of Immune-Related Adverse Events (irAEs) in Checkpoint Inhibitors', updateDate: 'Oct 2024', downloads: 1320 }
    ]
  },
  {
    id: 'comm-derm',
    name: 'Dermatology',
    description: 'Dermoscopy image reviews, inflammatory dermatoses, cutaneous oncology, and complex biologic therapies.',
    icon: 'Layers',
    memberCount: 1890,
    activeDiscussionsCount: 72,
    moderators: [
      { id: 'doc-003', name: 'Dr. Marcus Vance', title: 'MD' }
    ],
    trendingTags: ['#Dermoscopy', '#MelanomaDetection', '#SeverePsoriasis', '#DrugEruptions'],
    clinicalProtocols: [
      { title: 'Toxic Epidermal Necrolysis (TEN) / Stevens-Johnson Emergent Transfer Criteria', updateDate: 'Jun 2024', downloads: 810 }
    ]
  }
];
