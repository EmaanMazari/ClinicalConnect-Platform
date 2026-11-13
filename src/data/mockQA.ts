import { MedicalQuestion } from '../types';
import { MOCK_DOCTORS } from './mockDoctors';

export const MOCK_QUESTIONS: MedicalQuestion[] = [
  {
    id: 'qa-001',
    title: 'Dual Antiplatelet Therapy (DAPT) duration post-PCI in patients with high bleeding risk (ARC-HBR criteria)',
    description: 'In patients undergoing current-generation DES implantation who fulfill Academic Research Consortium for High Bleeding Risk (ARC-HBR) criteria (e.g. chronic oral anticoagulation for Afib or recent GI bleed), what is the optimal timing for P2Y12 inhibitor discontinuation? What is the current evidence regarding 1-month vs 3-month DAPT followed by P2Y12 monotherapy (Ticagrelor vs Clopidogrel)?',
    specialty: 'Cardiology',
    tags: ['DAPT', 'Interventional Cardiology', 'Anticoagulation', 'PCI', 'Guidelines'],
    author: MOCK_DOCTORS[0], // Dr. Alexander Wright
    createdAt: '2 days ago',
    views: 642,
    upvotes: 48,
    hasAcceptedAnswer: true,
    clinicalGuidelinesLinked: [
      '2023 ESC Guidelines for the management of acute coronary syndromes',
      'ACC/AHA Guideline on Duration of Dual Antiplatelet Therapy'
    ],
    answers: [
      {
        id: 'ans-001',
        author: MOCK_DOCTORS[0],
        content: `According to recent randomized evidence from MASTER DAPT and STOPDAPT-2 trials, in patients meeting ARC-HBR criteria:

1. **Duration**: 1 month of DAPT (Aspirin + Clopidogrel) followed by single antiplatelet therapy (SAPT) with Clopidogrel alone was non-inferior to standard therapy (≥6 months) for net adverse clinical events (NACE), and significantly reduced major or clinically relevant non-major bleeding (HR 0.68, 95% CI 0.55-0.84).
2. **P2Y12 Monotherapy**: If Ticagrelor monotherapy is considered (as in TWILIGHT trial), standard 3-month DAPT before dropping Aspirin showed a 44% reduction in BARC 2-5 bleeding without an increase in death, MI, or stroke.
3. **Triple Therapy**: If the patient also requires an OAC (e.g., DOAC for Afib), the 2023 ESC guidelines give a Class I, Level A recommendation to discontinue aspirin at hospital discharge and continue DOAC + Clopidogrel for up to 12 months.`,
        createdAt: '1 day ago',
        upvotes: 38,
        peerEndorsements: 16,
        isAccepted: true,
        references: [
          {
            title: 'Dual Antiplatelet Therapy after PCI in Patients at High Bleeding Risk (MASTER DAPT)',
            journal: 'New England Journal of Medicine, 2021; 385:1643-1655',
            doi: '10.1056/NEJMoa2108749'
          },
          {
            title: 'Ticagrelor with or without Aspirin in High-Risk Patients after PCI (TWILIGHT)',
            journal: 'New England Journal of Medicine, 2019; 381:2032-2042',
            doi: '10.1056/NEJMoa1908973'
          }
        ]
      },
      {
        id: 'ans-002',
        author: MOCK_DOCTORS[1],
        content: `From a neuro-vascular standpoint, when dealing with patients with prior intracranial microbleeds or cerebral amyloid angiopathy (CAA) requiring coronary stenting, we strongly advocate for early Aspirin cessation at 30 days and maintenance on Clopidogrel monotherapy with strict blood pressure control (<130/80 mmHg). Avoid Ticagrelor in patients with high microbleed burden on gradient-echo/SWI MRI due to higher spontaneous micro-hemorrhage rates.`,
        createdAt: '18 hours ago',
        upvotes: 14,
        peerEndorsements: 7,
        isAccepted: false,
        references: [
          {
            title: 'Antithrombotic treatment after stroke and intracranial hemorrhage in patients with atrial fibrillation',
            journal: 'Lancet Neurology, 2022',
            doi: '10.1016/S1474-4422(22)00112-X'
          }
        ]
      }
    ]
  },
  {
    id: 'qa-002',
    title: 'Differential approach to hyperdense MCA sign on non-contrast head CT in acute ischemic stroke vs calcification',
    description: 'On emergency non-contrast head CT within the 4.5-hour window, what quantitative attenuation thresholds (Hounsfield units) and geometric criteria best distinguish an acute intraluminal thrombus (true hyperdense MCA sign) from asymptomatic arterial wall calcification or high hematocrit?',
    specialty: 'Radiology',
    tags: ['Stroke', 'Neuroradiology', 'CT Imaging', 'Emergency', 'Hounsfield'],
    author: MOCK_DOCTORS[2], // Dr. Marcus Vance
    createdAt: '3 days ago',
    views: 890,
    upvotes: 52,
    hasAcceptedAnswer: true,
    clinicalGuidelinesLinked: [
      'AHA/ASA Guidelines for the Early Management of Patients With Acute Ischemic Stroke'
    ],
    answers: [
      {
        id: 'ans-003',
        author: MOCK_DOCTORS[2],
        content: `Key radiographic differentiators:

1. **Hounsfield Units (HU)**:
   - **Acute Thrombus**: Attenuation typically ranges between **50 to 75 HU** (relative to normal brain parenchyma ~35 HU).
   - **Atherosclerotic Calcification**: Attenuation exceeds **100 HU** (often > 200 HU), showing dense, gritty white saturation.
   - **Hemoconcentration**: Diffuse bilaterally; ratio of ipsilateral to contralateral MCA is ~1.0. A true positive sign requires an MCA density ratio > 1.2 to 1.3 compared to the opposite MCA.
2. **Distribution**:
   - Thrombus fills the vessel lumen contiguously (string or dot sign in Sylvian fissure).
   - Calcification is typically eccentrically seated in the arterial wall and often multi-focal.
3. **CTA Confirmation**:
   - Immediate multiphase CTA is mandatory to determine collateral score and pinpoint vessel occlusion site for mechanical thrombectomy (EVT).`,
        createdAt: '2 days ago',
        upvotes: 44,
        peerEndorsements: 21,
        isAccepted: true,
        references: [
          {
            title: 'Hyperdense Middle Cerebral Artery Sign: Diagnostic Accuracy and Value for Stroke Assessment',
            journal: 'Radiology 2018; 286(2):642-651',
            doi: '10.1148/radiol.2017170425'
          }
        ]
      }
    ]
  },
  {
    id: 'qa-003',
    title: 'Management of fever of unknown origin in infants under 28 days: When is lumbar puncture safely deferrable?',
    description: 'Following the 2021 AAP clinical practice guidelines for well-appearing febrile neonates (8-21 days vs 22-28 days), what inflammatory marker cutoffs (Procalcitonin, CRP, ANC) allow for safe outpatient management without universal LP?',
    specialty: 'Pediatrics',
    tags: ['Pediatric Infectious Disease', 'Neonatal Fever', 'Lumbar Puncture', 'AAP Guidelines'],
    author: MOCK_DOCTORS[3], // Dr. Sophia Chen
    createdAt: '4 days ago',
    views: 520,
    upvotes: 31,
    hasAcceptedAnswer: false,
    clinicalGuidelinesLinked: [
      '2021 AAP Clinical Practice Guideline: Evaluation and Management of Well-Appearing Febrile Infants 8 to 60 Days Old'
    ],
    answers: [
      {
        id: 'ans-004',
        author: MOCK_DOCTORS[3],
        content: `Under the 2021 AAP guidelines:
- **8 to 21 days**: Universal lumbar puncture and admission for parenteral antibiotics remain strongly recommended regardless of low inflammatory markers, due to the high baseline risk of bacteremia (2-3%) and neonatal HSV.
- **22 to 28 days**: LP can be safely deferred **ONLY IF**:
  1. The infant is well-appearing (normal clinical exam).
  2. Procalcitonin is < 0.5 ng/mL.
  3. C-reactive protein is < 20 mg/L.
  4. Absolute neutrophil count (ANC) is < 4,000 to 5,200 /mcL.
  5. Urinalysis is negative for leukocyte esterase and nitrites.
  6. Reliable 24-hour outpatient follow-up is guaranteed.`,
        createdAt: '3 days ago',
        upvotes: 27,
        peerEndorsements: 12,
        isAccepted: false,
        references: [
          {
            title: 'Clinical Practice Guideline: Evaluation and Management of Well-Appearing Febrile Infants 8 to 60 Days Old',
            journal: 'Pediatrics. 2021;148(2):e2021052228',
            doi: '10.1542/peds.2021-052228'
          }
        ]
      }
    ]
  }
];
