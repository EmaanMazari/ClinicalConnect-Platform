import { ClinicalCase } from '../types';
import { MOCK_DOCTORS } from './mockDoctors';

export const MOCK_CASES: ClinicalCase[] = [
  {
    id: 'case-001',
    title: '58M with crushing substernal chest pain, dynamic ST elevations in V1-V3, and refractory hypotension',
    summary: 'A 58-year-old male presents to the Emergency Department 90 minutes after sudden onset of diaphoresis and substernal squeezing pain radiating to left jaw. EKG displays 3.5mm convex ST elevations in V1-V4 with reciprocal depressions in II, III, aVF. Urgent consult requested for primary PCI vs thrombolytic strategy during transfer.',
    specialty: 'Cardiology',
    subspecialtyTags: ['Acute Coronary Syndrome', 'STEMI', 'Cardiogenic Shock', 'Interventional'],
    author: MOCK_DOCTORS[0], // Dr. Alexander Wright
    createdAt: '25 minutes ago',
    status: 'Differential Active',
    urgency: 'Emergency STAT',
    statDeadline: '15 min SLA Remaining',
    patient: {
      age: 58,
      gender: 'Male',
      anonymizedId: 'PT-8891-CARD',
      chiefComplaint: 'Crushing central chest tightness with profuse cold diaphoresis',
      symptoms: ['Substernal chest pressure', 'Radiation to left mandible', 'Dyspnea at rest', 'Nausea and vomiting', 'Presyncope'],
      durationOfIllness: '90 minutes',
      medicalHistory: ['Hypertension (10 yrs)', 'Type 2 Diabetes Mellitus (HbA1c 8.2%)', 'Current smoker (30 pack-years)', 'Hyperlipidemia'],
      familyHistory: 'Father died of sudden cardiac death at age 52',
      allergies: ['Penicillin (urticaria)']
    },
    vitals: {
      bloodPressure: '84/52 mmHg',
      heartRate: 114,
      respiratoryRate: 26,
      temperature: 36.8,
      oxygenSaturation: 91,
      gcs: 15
    },
    labs: [
      { name: 'High-Sensitivity Troponin I', value: '4,820', unit: 'ng/L', referenceRange: '< 14 ng/L', status: 'critical' },
      { name: 'Serum Lactate', value: '3.8', unit: 'mmol/L', referenceRange: '0.5 - 2.0 mmol/L', status: 'critical' },
      { name: 'Potassium (K+)', value: '3.6', unit: 'mEq/L', referenceRange: '3.5 - 5.1 mEq/L', status: 'normal' },
      { name: 'Serum Creatinine', value: '1.4', unit: 'mg/dL', referenceRange: '0.7 - 1.3 mg/dL', status: 'high' },
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', referenceRange: '13.5 - 17.5 g/dL', status: 'normal' }
    ],
    prescriptions: [
      { name: 'Aspirin (chewable)', dosage: '325 mg', frequency: 'STAT', route: 'Oral', duration: 'Once' },
      { name: 'Ticagrelor', dosage: '180 mg', frequency: 'STAT loading', route: 'Oral', duration: 'Once' },
      { name: 'Unfractionated Heparin', dosage: '5000 IU bolus', frequency: 'STAT', route: 'IV', duration: 'Continuous' },
      { name: 'Norepinephrine', dosage: '0.08 mcg/kg/min', frequency: 'Titrated', route: 'IV Central Line', duration: 'Ongoing' }
    ],
    attachments: [
      {
        id: 'att-1',
        title: '12-Lead ECG (Emergency Admission)',
        modality: 'ECG',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
        isDicom: false,
        anonymized: true,
        notes: 'Antero-septal STEMI with Tombstone morphology in V2-V3. Borderline Q waves.'
      },
      {
        id: 'att-2',
        title: 'Bedside Transthoracic Echo (Apical 4-Chamber)',
        modality: 'Ultrasound',
        url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
        isDicom: true,
        dicomSeriesId: 'study-001',
        anonymized: true,
        notes: 'Severe apical and anterior wall akinesis. Estimated LVEF 25-30% with RV preservation.'
      },
      {
        id: 'att-3',
        title: 'Attending Physician Audio SBAR Handover',
        modality: 'Audio Note',
        url: 'audio-note-001.mp3',
        isDicom: false,
        anonymized: true,
        notes: 'Clinical narrative from Dr. Wright regarding hemodynamic instability and transit time to cath lab.'
      }
    ],
    discussionGoals: ['Diagnostic assistance', 'Treatment recommendations', 'Referral guidance'],
    aiInsights: {
      summary: '58yo male with acute extensive anterior STEMI complicated by Killip Class IV cardiogenic shock (BP 84/52, Lactate 3.8, LVEF ~28%). Requires emergent mechanical revascularization and mechanical circulatory support (Impella CP / IABP).',
      differentialDiagnoses: [
        {
          condition: 'Acute Anterior STEMI (Proximal LAD Occlusion)',
          icd10: 'I21.0',
          probability: 94,
          rationale: 'Convex ST elevations in V1-V4 with reciprocal ST depressions, elevated Troponin-I, and anterior akinesis on echo.',
          recommendedTests: ['Emergent Coronary Angiography', 'Serial hs-cTnI', 'Invasive Hemodynamic Line']
        },
        {
          condition: 'Acute Myopericarditis with Coronary Vasospasm',
          icd10: 'I30.9',
          probability: 4,
          rationale: 'Can present with diffuse ST elevation, but regional wall motion abnormality and cardiogenic shock make this less likely.',
          recommendedTests: ['Cardiac MRI (delayed)', 'Viral Serologies']
        },
        {
          condition: 'Type A Aortic Dissection involving Coronary Ostium',
          icd10: 'I71.01',
          probability: 2,
          rationale: 'Always consider in cardiogenic shock with ST elevation; rule out aortic regurgitation murmur and pulse deficit before heparin.',
          recommendedTests: ['Focused Suprasternal Bedside Echo', 'CTA Chest (if stable)']
        }
      ],
      drugInteractions: [
        {
          severity: 'Moderate',
          drugs: ['Norepinephrine', 'Ticagrelor'],
          warning: 'Profound cardiogenic shock and peripheral vasoconstriction may delay oral absorption of P2Y12 inhibitors. Consider IV Cangrelor if available.'
        }
      ],
      relevantGuidelines: [
        {
          title: '2023 ESC Guidelines for the Management of Acute Coronary Syndromes',
          organization: 'European Society of Cardiology',
          year: 2023,
          summary: 'Primary PCI within 120 minutes of STEMI diagnosis. In cardiogenic shock, routine immediate mechanical circulatory support is selectively recommended.'
        },
        {
          title: '2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure',
          organization: 'AHA/ACC',
          year: 2022,
          summary: 'Initiate vasopressor/inotropic support early for end-organ hypoperfusion; target MAP > 65 mmHg.'
        }
      ],
      similarArchivedCaseIds: ['case-008', 'case-014']
    },
    comments: [
      {
        id: 'c-101',
        authorId: 'doc-003',
        authorName: 'Dr. Marcus Vance',
        authorSpecialty: 'Radiology',
        authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Master Clinician',
        content: 'I have reviewed the chest portable radiograph. The mediastinum is normal in contour with no widening. Pulmonary venous congestion with Kerley B lines is visible bilaterally, consistent with acute cardiogenic pulmonary edema. Proceed directly to cath lab without delay for CT.',
        timestamp: '18 minutes ago',
        upvotes: 8,
        isAcceptedDiagnosis: false
      },
      {
        id: 'c-102',
        authorId: 'doc-001',
        authorName: 'Dr. Alexander Wright',
        authorSpecialty: 'Cardiology',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
        authorBadge: 'Board Certified',
        content: 'Agreed. Catheterization lab activated. Patient being prepped for right femoral access and emergent Impella CP placement prior to wiring proximal LAD. Will update with angiogram findings.',
        timestamp: '10 minutes ago',
        upvotes: 12,
        isAcceptedDiagnosis: true,
        differentialProposal: {
          diagnosis: 'Acute Anterior STEMI with Cardiogenic Shock',
          icd10: 'I21.0',
          confidence: 96,
          rationale: 'Confirmed high-grade LAD thrombotic occlusion with severe hemodynamic compromise.'
        }
      }
    ],
    viewsCount: 142,
    subscribersCount: 28,
    isHipaaVerified: true
  },
  {
    id: 'case-002',
    title: '24F with acute behavioral changes, faciobrachial dystonic seizures, and ovarian teratoma on pelvic US',
    summary: 'A 24-year-old university student with no prior psychiatric history presented with sudden psychosis, insomnia, paranoid delusions, followed by autonomic instability, hypoventilation, and stereotypic orofacial dyskinesias. CSF shows lymphocytic pleocytosis. Requesting neuroimmunology consult for immunotherapy initiation.',
    specialty: 'Neurology',
    subspecialtyTags: ['Neuroimmunology', 'Autoimmune Encephalitis', 'Anti-NMDA', 'Rare Disease'],
    author: MOCK_DOCTORS[1], // Dr. Elena Rostova
    createdAt: '3 hours ago',
    status: 'Diagnosis Accepted',
    urgency: 'Priority',
    patient: {
      age: 24,
      gender: 'Female',
      anonymizedId: 'PT-3301-NEUR',
      chiefComplaint: 'Rapid onset of visual hallucinations, memory deficits, and choreoathetoid movements',
      symptoms: ['Visual and auditory hallucinations', 'Faciobrachial dystonic jerks', 'Fluctuating blood pressure and tachycardia', 'Catatonic episodes', 'Central hypoventilation'],
      durationOfIllness: '14 days',
      medicalHistory: ['Mild asthma', 'No prior psychiatric illness', 'No illicit drug use (toxicology negative)'],
      allergies: ['No known drug allergies']
    },
    vitals: {
      bloodPressure: '158/98 mmHg (labile)',
      heartRate: 128,
      respiratoryRate: 14,
      temperature: 38.2,
      oxygenSaturation: 95,
      gcs: 11
    },
    labs: [
      { name: 'CSF White Blood Cell Count', value: '38', unit: '/mcL', referenceRange: '0 - 5 /mcL', status: 'high' },
      { name: 'CSF Protein', value: '68', unit: 'mg/dL', referenceRange: '15 - 45 mg/dL', status: 'high' },
      { name: 'CSF Oligoclonal Bands', value: 'Positive (Type 2)', unit: 'status', referenceRange: 'Negative', status: 'critical' },
      { name: 'Serum Anti-NMDA Receptor Abs', value: 'Titer 1:320', unit: 'titer', referenceRange: 'Negative (<1:10)', status: 'critical' },
      { name: 'CSF Glucose', value: '62', unit: 'mg/dL', referenceRange: '40 - 70 mg/dL', status: 'normal' }
    ],
    prescriptions: [
      { name: 'Methylprednisolone', dosage: '1000 mg IV', frequency: 'Daily', route: 'IV Infusion', duration: '5 days' },
      { name: 'Intravenous Immunoglobulin (IVIG)', dosage: '0.4 g/kg/day', frequency: 'Daily', route: 'IV Infusion', duration: '5 days' },
      { name: 'Levetiracetam', dosage: '1000 mg', frequency: 'BID', route: 'IV', duration: 'Ongoing' }
    ],
    attachments: [
      {
        id: 'att-201',
        title: 'Brain MRI FLAIR T2 Axial Sequence',
        modality: 'MRI',
        url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
        isDicom: true,
        dicomSeriesId: 'study-002',
        anonymized: true,
        notes: 'Subtle bilateral hyperintensities in mesial temporal lobes.'
      },
      {
        id: 'att-202',
        title: 'Pelvic Transvaginal Ultrasound',
        modality: 'Ultrasound',
        url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        isDicom: false,
        anonymized: true,
        notes: 'Right ovary demonstrates a 3.4 cm dermoid cyst / mature cystic teratoma.'
      }
    ],
    discussionGoals: ['Diagnostic assistance', 'Treatment recommendations', 'Surgical opinions', 'Rare disease discussions'],
    aiInsights: {
      summary: '24yo female presenting with subacute encephalitis triad: psychiatric prodrome, movement disorder, and autonomic instability. Confirmed anti-NMDAR encephalitis with right ovarian teratoma.',
      differentialDiagnoses: [
        {
          condition: 'Anti-NMDA Receptor Encephalitis',
          icd10: 'G04.81',
          probability: 98,
          rationale: 'CSF pleocytosis, positive anti-NMDA antibodies, characteristic faciobrachial dystonia, and pelvic teratoma.',
          recommendedTests: ['Confirmatory CSF cell-based assay', 'Continuous EEG monitoring']
        },
        {
          condition: 'Herpes Simplex Virus Encephalitis (HSV-1)',
          icd10: 'B00.4',
          probability: 2,
          rationale: 'Temporal lobe involvement can mimic HSV, but CSF HSV PCR was negative on day 1.',
          recommendedTests: ['Repeat CSF HSV PCR']
        }
      ],
      drugInteractions: [],
      relevantGuidelines: [
        {
          title: 'International Consensus Criteria for Autoimmune Encephalitis',
          organization: 'Lancet Neurology Guidelines',
          year: 2021,
          summary: 'Early surgical resection of teratoma combined with first-line immunotherapy (corticosteroids + IVIG or plasma exchange) significantly improves cognitive outcomes.'
        }
      ],
      similarArchivedCaseIds: ['case-019']
    },
    comments: [
      {
        id: 'c-201',
        authorId: 'doc-002',
        authorName: 'Dr. Elena Rostova',
        authorSpecialty: 'Neurology',
        authorAvatar: 'https://images.unsplash.com/photo-1594824813583-162776891eb6?w=150&auto=format&fit=crop&q=80',
        content: 'Definitive diagnosis is Anti-NMDA receptor encephalitis paraneoplastic to ovarian teratoma. Gynecologic surgery must be performed as soon as patient is stabilized on high-dose methylprednisolone and IVIG. If no improvement within 10 days, escalate to Rituximab.',
        timestamp: '2 hours ago',
        upvotes: 24,
        isAcceptedDiagnosis: true,
        citations: [
          { title: 'Treatment and prognostic factors for long-term outcome in patients with anti-NMDA receptor encephalitis', source: 'Lancet Neurol 2013;12(2):157-65' }
        ]
      }
    ],
    viewsCount: 388,
    subscribersCount: 45,
    isHipaaVerified: true
  },
  {
    id: 'case-003',
    title: '11-year-old obese male with sudden limp and left knee pain: Normal knee X-rays but restricted hip internal rotation',
    summary: 'An 11-year-old boy presents with a 3-week history of worsening left limp and diffuse medial knee pain. No antecedent trauma. Physical exam reveals obligatory external rotation during passive flexion of the left hip (Drehmann sign). Requesting pediatric orthopedic opinion on urgent surgical pinning.',
    specialty: 'Orthopedics',
    subspecialtyTags: ['Pediatric Orthopedics', 'SCFE', 'Hip Preservation', 'Surgical Case'],
    author: MOCK_DOCTORS[4], // Dr. Tariq Al-Mansoor
    createdAt: '1 day ago',
    status: 'Diagnosis Accepted',
    urgency: 'Priority',
    patient: {
      age: 11,
      gender: 'Male',
      anonymizedId: 'PT-4421-ORTH',
      chiefComplaint: 'Left antalgic gait and medial thigh/knee pain exacerbated by weight bearing',
      symptoms: ['Referred knee pain', 'Inability to fully bear weight', 'Loss of internal rotation of hip', 'Shortening of left lower extremity by 1cm'],
      durationOfIllness: '3 weeks',
      medicalHistory: ['Obesity (BMI 97th percentile)', 'No chronic illnesses'],
      familyHistory: 'Non-contributory',
      allergies: ['None']
    },
    vitals: {
      bloodPressure: '112/68 mmHg',
      heartRate: 82,
      respiratoryRate: 18,
      temperature: 37.0,
      oxygenSaturation: 99
    },
    labs: [
      { name: 'C-Reactive Protein (CRP)', value: '3.1', unit: 'mg/L', referenceRange: '< 5.0 mg/L', status: 'normal' },
      { name: 'Erythrocyte Sedimentation Rate (ESR)', value: '12', unit: 'mm/hr', referenceRange: '0 - 15 mm/hr', status: 'normal' },
      { name: 'White Blood Cell Count', value: '7.8', unit: '10^9/L', referenceRange: '4.5 - 11.0 10^9/L', status: 'normal' }
    ],
    prescriptions: [
      { name: 'Ibuprofen', dosage: '400 mg', frequency: 'TID PRN', route: 'Oral', duration: 'As needed' },
      { name: 'Strict Non-Weight Bearing', dosage: 'Crutches / Wheelchair', frequency: 'Continuous', route: 'Physical constraint', duration: 'Immediate' }
    ],
    attachments: [
      {
        id: 'att-301',
        title: 'Pelvis AP and Frog-Leg Lateral Radiograph',
        modality: 'X-Ray',
        url: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80',
        isDicom: true,
        dicomSeriesId: 'study-004',
        anonymized: true,
        notes: 'Left femoral epiphysis is displaced posteriorly and inferiorly relative to the femoral neck. Klein line does not intersect epiphysis.'
      }
    ],
    discussionGoals: ['Diagnostic assistance', 'Surgical opinions', 'Treatment recommendations'],
    aiInsights: {
      summary: '11yo male with classic presentation of Slipped Capital Femoral Epiphysis (SCFE) presenting as referred knee pain. Urgent in-situ single cannulated screw fixation indicated to prevent avascular necrosis and further slippage.',
      differentialDiagnoses: [
        {
          condition: 'Slipped Capital Femoral Epiphysis (SCFE) - Stable',
          icd10: 'M93.0',
          probability: 97,
          rationale: 'Adolescent growth spurt, high BMI, classic Drehmann sign, abnormal Klein line on frog-leg lateral radiograph.',
          recommendedTests: ['Contralateral hip surveillance radiograph', 'Immediate surgical consultation']
        },
        {
          condition: 'Legg-Calvé-Perthes Disease',
          icd10: 'M91.1',
          probability: 2,
          rationale: 'Usually affects younger children (4-8 years), femoral head shows flattening and fragmentation rather than epiphyseal slip.',
          recommendedTests: ['Pelvic MRI']
        }
      ],
      drugInteractions: [],
      relevantGuidelines: [
        {
          title: 'AAOS Clinical Practice Guideline on Detection and Management of Pediatric SCFE',
          organization: 'American Academy of Orthopaedic Surgeons',
          year: 2022,
          summary: 'Immediate cessation of weight-bearing and urgent in-situ fixation with single central cannulated screw.'
        }
      ],
      similarArchivedCaseIds: ['case-031']
    },
    comments: [
      {
        id: 'c-301',
        authorId: 'doc-004',
        authorName: 'Dr. Sophia Chen',
        authorSpecialty: 'Pediatrics',
        authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
        content: 'Classic pearl: always image the hip in an adolescent with isolated knee pain. Glad the radiographs caught this before osteonecrosis or chondrolysis developed.',
        timestamp: '18 hours ago',
        upvotes: 19,
        isAcceptedDiagnosis: false
      },
      {
        id: 'c-302',
        authorId: 'doc-005',
        authorName: 'Dr. Tariq Al-Mansoor',
        authorSpecialty: 'Orthopedics',
        authorAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
        content: 'Patient underwent emergency single percutaneous 6.5mm cannulated screw fixation under fluoroscopic guidance last evening. Screw threads securely seated 5mm short of subchondral bone. Non-weight bearing for 4 weeks with physical therapy follow-up.',
        timestamp: '6 hours ago',
        upvotes: 31,
        isAcceptedDiagnosis: true
      }
    ],
    viewsCount: 295,
    subscribersCount: 38,
    isHipaaVerified: true
  },
  {
    id: 'case-004',
    title: '47M with sudden pleuritic chest pain, hemoptysis, and tachycardia post-long haul flight (Well score 6.0)',
    summary: 'A 47-year-old executive presents 12 hours after a 14-hour trans-Pacific flight with sharp right-sided chest pain exacerbated by deep inspiration and coughing, accompanied by mild hemoptysis and sinus tachycardia at 118 bpm. CT Pulmonary Angiography shows extensive bilateral pulmonary emboli.',
    specialty: 'Emergency Medicine',
    subspecialtyTags: ['Critical Care', 'Thromboembolism', 'Pulmonology', 'Anticoagulation'],
    author: MOCK_DOCTORS[2], // Dr. Marcus Vance
    createdAt: '4 hours ago',
    status: 'Open',
    urgency: 'Emergency STAT',
    statDeadline: '30 min SLA Remaining',
    patient: {
      age: 47,
      gender: 'Male',
      anonymizedId: 'PT-7719-EMER',
      chiefComplaint: 'Right-sided pleuritic chest pain, shortness of breath, blood-tinged sputum',
      symptoms: ['Pleuritic chest pain', 'Dyspnea', 'Hemoptysis (small volume ~15mL)', 'Restlessness'],
      durationOfIllness: '8 hours',
      medicalHistory: ['Prior DVT in right leg 4 years ago following arthroscopy', 'No active malignancies'],
      familyHistory: 'Sister had pulmonary embolism during pregnancy (Factor V Leiden positive)',
      allergies: ['Sulfa drugs']
    },
    vitals: {
      bloodPressure: '106/72 mmHg',
      heartRate: 118,
      respiratoryRate: 24,
      temperature: 37.4,
      oxygenSaturation: 92
    },
    labs: [
      { name: 'D-Dimer (FEU)', value: '3,840', unit: 'ng/mL', referenceRange: '< 500 ng/mL', status: 'critical' },
      { name: 'High-Sensitivity Troponin T', value: '48', unit: 'ng/L', referenceRange: '< 14 ng/L', status: 'high' },
      { name: 'NT-proBNP', value: '1,280', unit: 'pg/mL', referenceRange: '< 125 pg/mL', status: 'high' },
      { name: 'Arterial Blood Gas (Room Air) pO2', value: '64', unit: 'mmHg', referenceRange: '75 - 100 mmHg', status: 'low' }
    ],
    prescriptions: [
      { name: 'Enoxaparin (LMWH)', dosage: '1 mg/kg (90 mg)', frequency: 'Q12H', route: 'Subcutaneous', duration: 'Initiated' },
      { name: 'Nasal Cannula Oxygen', dosage: '3 L/min', frequency: 'Continuous', route: 'Inhalation', duration: 'Titrate to SpO2 > 94%' }
    ],
    attachments: [
      {
        id: 'att-401',
        title: 'Contrast-Enhanced CT Pulmonary Angiogram',
        modality: 'CT Scan',
        url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        isDicom: true,
        dicomSeriesId: 'study-003',
        anonymized: true,
        notes: 'Saddle embolism at pulmonary arterial bifurcation with right ventricular strain (RV/LV ratio 1.3).'
      }
    ],
    discussionGoals: ['Diagnostic assistance', 'Treatment recommendations', 'Referral guidance'],
    aiInsights: {
      summary: '47yo male with intermediate-high risk (submassive) pulmonary embolism evidenced by elevated Troponin/BNP and RV strain on CTA. Requires PERT (Pulmonary Embolism Response Team) evaluation for catheter-directed thrombolysis vs systemic anticoagulation.',
      differentialDiagnoses: [
        {
          condition: 'Acute Pulmonary Embolism (Intermediate-High Risk)',
          icd10: 'I26.0',
          probability: 96,
          rationale: 'Direct visualization of saddle embolus, elevated D-dimer, RV dilatation, biomarker elevation.',
          recommendedTests: ['Bedside Echocardiogram (McConnell Sign)', 'Lower extremity compression ultrasonography']
        },
        {
          condition: 'Spontaneous Pneumothorax',
          icd10: 'J93.0',
          probability: 2,
          rationale: 'Pleuritic chest pain in tall males, but ruled out by clear lung parenchyma on CTA.',
          recommendedTests: ['CTA Review']
        }
      ],
      drugInteractions: [],
      relevantGuidelines: [
        {
          title: '2019 ESC Guidelines on Acute Pulmonary Embolism with AHA update',
          organization: 'ESC / AHA',
          year: 2021,
          summary: 'In intermediate-high risk PE, close monitoring in ICU/step-down is required. Rescue reperfusion should be initiated if hemodynamic deterioration occurs.'
        }
      ],
      similarArchivedCaseIds: ['case-004']
    },
    comments: [],
    viewsCount: 167,
    subscribersCount: 19,
    isHipaaVerified: true
  }
];
