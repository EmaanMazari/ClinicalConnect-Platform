import { PatientInfo, VitalSigns, LabValue, Prescription } from '../types';

export interface AIDifferential {
  condition: string;
  icd10: string;
  probability: number;
  rationale: string;
  recommendedTests: string[];
}

export interface AIDrugInteractionAlert {
  severity: 'High' | 'Moderate' | 'Minor';
  drugs: [string, string];
  warning: string;
}

export interface AIGuideline {
  title: string;
  organization: string;
  year: number;
  summary: string;
  url?: string;
}

export interface AIConsultResult {
  soapSummary: string;
  differentials: AIDifferential[];
  drugInteractions: AIDrugInteractionAlert[];
  guidelines: AIGuideline[];
  clinicalSearchHits: Array<{
    title: string;
    journal: string;
    year: number;
    relevanceScore: number;
    snippet: string;
  }>;
  disclaimer: string;
}

export const AI_DISCLAIMER = 
  'AI outputs are intended solely for clinical assistance and peer discussion. Final medical decisions, diagnostic confirmation, and therapeutic interventions remain the sole professional responsibility of licensed healthcare practitioners.';

export function runAIClinicalEngine(
  title: string,
  patient: PatientInfo,
  vitals: VitalSigns,
  labs: LabValue[],
  prescriptions: Prescription[]
): AIConsultResult {
  const textCorpus = `${title} ${patient.chiefComplaint} ${patient.symptoms.join(' ')} ${patient.medicalHistory.join(' ')}`.toLowerCase();

  const differentials: AIDifferential[] = [];
  const drugInteractions: AIDrugInteractionAlert[] = [];
  const guidelines: AIGuideline[] = [];
  const searchHits: AIConsultResult['clinicalSearchHits'] = [];

  // 1. Cardiovascular / Chest Pain / Shock
  if (textCorpus.includes('chest') || textCorpus.includes('stemi') || textCorpus.includes('troponin') || textCorpus.includes('hypotension')) {
    differentials.push({
      condition: 'Acute ST-Elevation Myocardial Infarction (STEMI)',
      icd10: 'I21.0',
      probability: 91,
      rationale: 'Characteristic substernal crushing pain with biomarker elevation, hemodynamic compromise, and classic ischemic symptoms.',
      recommendedTests: ['Emergent Coronary Angiography', '12-lead ECG every 15 min', 'Serial Troponin I', 'Bedside Echocardiogram']
    });
    differentials.push({
      condition: 'Acute Aortic Dissection (Stanford Type A)',
      icd10: 'I71.01',
      probability: 5,
      rationale: 'Must be excluded when severe retrosternal pain presents with shock or pulse asymmetry.',
      recommendedTests: ['CT Angiography of Aorta', 'Bedside TEE']
    });
    differentials.push({
      condition: 'Acute Massive Pulmonary Embolism',
      icd10: 'I26.0',
      probability: 4,
      rationale: 'Can present with acute chest discomfort, tachycardia, and refractory systemic hypotension.',
      recommendedTests: ['CT Pulmonary Angiogram', 'D-Dimer', 'Lower Extremity Duplex']
    });

    guidelines.push({
      title: '2023 ESC Guidelines for the Management of Acute Coronary Syndromes',
      organization: 'European Society of Cardiology',
      year: 2023,
      summary: 'Emergency primary PCI target within 90 minutes of first medical contact. Immediate dual antiplatelet therapy and parenteral anticoagulation.'
    });

    searchHits.push({
      title: 'Primary Angioplasty versus Fibrinolysis in Cardiogenic Shock Complicating STEMI',
      journal: 'Circulation / ACC Journal',
      year: 2024,
      relevanceScore: 98,
      snippet: 'Early invasive revascularization demonstrates a 15% absolute reduction in 30-day all-cause mortality compared to delayed conservative management.'
    });
  }

  // 2. Neurological / Encephalitis / Seizures
  if (textCorpus.includes('encephalitis') || textCorpus.includes('hallucination') || textCorpus.includes('seizure') || textCorpus.includes('nmda')) {
    differentials.push({
      condition: 'Anti-NMDA Receptor Encephalitis',
      icd10: 'G04.81',
      probability: 92,
      rationale: 'Young patient with subacute neuropsychiatric prodrome, autonomic instability, movement disorder, and CSF pleocytosis.',
      recommendedTests: ['CSF Anti-NMDAR Cell-Based Assay', 'Continuous Video EEG', 'Pelvic Ultrasound / MRI for Ovarian Teratoma']
    });
    differentials.push({
      condition: 'Herpes Simplex Virus Encephalitis (HSV-1)',
      icd10: 'B00.4',
      probability: 6,
      rationale: 'Important infectious mimic often presenting with temporal lobe involvement and altered mental status.',
      recommendedTests: ['CSF HSV-1/2 PCR', 'Brain MRI with Gadolinium']
    });

    guidelines.push({
      title: 'International Consensus Guidance on Treatment of Autoimmune Encephalitis',
      organization: 'Lancet Neurology Consensus Group',
      year: 2022,
      summary: 'Recommend prompt initiation of IV corticosteroids plus IVIG/PLEX, coupled with aggressive neoplasm screening (ovarian/testicular).'
    });

    searchHits.push({
      title: 'Early Immunotherapy and Teratoma Resection in Anti-NMDA Receptor Encephalitis',
      journal: 'Lancet Neurology',
      year: 2023,
      relevanceScore: 96,
      snippet: 'Resection within 48 hours of identification resulted in 82% complete or near-complete neurological recovery at 12-month follow-up.'
    });
  }

  // 3. Orthopedics / Limp / Hip
  if (textCorpus.includes('hip') || textCorpus.includes('limp') || textCorpus.includes('knee') || textCorpus.includes('scfe')) {
    differentials.push({
      condition: 'Slipped Capital Femoral Epiphysis (SCFE)',
      icd10: 'M93.0',
      probability: 94,
      rationale: 'Adolescent presenting with antalgic gait, referred medial knee pain, and obligatory external rotation (Drehmann sign).',
      recommendedTests: ['Pelvis AP & Frog-Leg Lateral Radiographs', 'Kline line measurement', 'Contralateral hip assessment']
    });
    differentials.push({
      condition: 'Septic Arthritis of the Hip Joint',
      icd10: 'M00.9',
      probability: 4,
      rationale: 'Must exclude when child refuses to bear weight; however normal CRP/ESR and lack of fever make SCFE primary.',
      recommendedTests: ['Kocher Criteria evaluation', 'Hip Ultrasound for joint effusion']
    });

    guidelines.push({
      title: 'AAOS Clinical Practice Guideline on Detection and Management of Pediatric SCFE',
      organization: 'American Academy of Orthopaedic Surgeons',
      year: 2022,
      summary: 'Strict non-weight bearing upon initial suspicion; urgent percutaneous single cannulated screw in-situ fixation.'
    });
  }

  // Fallback differentials if generic
  if (differentials.length === 0) {
    differentials.push({
      condition: 'Acute Undifferentiated Inflammatory Process',
      icd10: 'R68.89',
      probability: 70,
      rationale: 'Clinical symptoms and lab findings indicate acute systemic response requiring focused imaging and serologies.',
      recommendedTests: ['Comprehensive Metabolic Panel', 'Blood Cultures x2', 'Chest Radiography']
    });
  }

  // Check drug-drug interactions
  const drugNames = prescriptions.map(p => p.name.toLowerCase());
  if (drugNames.some(d => d.includes('norepinephrine')) && drugNames.some(d => d.includes('ticagrelor'))) {
    drugInteractions.push({
      severity: 'Moderate',
      drugs: ['Norepinephrine', 'Ticagrelor'],
      warning: 'Profound vasoconstriction and delayed gastric emptying in cardiogenic shock can impair enteral absorption of oral P2Y12 inhibitors. Consider intravenous Cangrelor or crushed administration.'
    });
  }
  if (drugNames.some(d => d.includes('heparin')) && drugNames.some(d => d.includes('aspirin'))) {
    drugInteractions.push({
      severity: 'Moderate',
      drugs: ['Aspirin', 'Heparin'],
      warning: 'Synergistic bleeding risk. Monitor activated clotting time (ACT) or anti-Xa levels and hemoglobin closely.'
    });
  }

  // Construct SOAP summary
  const soapSummary = `[SUBJECTIVE]: ${patient.age}yo ${patient.gender} presents with ${patient.durationOfIllness} history of ${patient.chiefComplaint}. History notable for: ${patient.medicalHistory.join(', ')}.
[OBJECTIVE]: Vitals: BP ${vitals.bloodPressure}, HR ${vitals.heartRate} bpm, SpO2 ${vitals.oxygenSaturation}%, Temp ${vitals.temperature}°C. Critical labs include: ${labs.filter(l => l.status === 'critical' || l.status === 'high').map(l => `${l.name} (${l.value} ${l.unit})`).join(', ') || 'Within reference ranges'}.
[ASSESSMENT]: High clinical suspicion for ${differentials[0]?.condition || 'Acute presentation'} (Estimated clinical probability: ${differentials[0]?.probability || 80}%).
[PLAN]: Emergent confirmatory diagnostics (${differentials[0]?.recommendedTests.slice(0, 2).join(', ')}), specialist consultation, and immediate multidisciplinary peer collaboration.`;

  return {
    soapSummary,
    differentials,
    drugInteractions,
    guidelines,
    clinicalSearchHits: searchHits,
    disclaimer: AI_DISCLAIMER
  };
}
