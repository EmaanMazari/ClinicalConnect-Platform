import { QuizQuestion, CMEProfile } from '../types';

export const INITIAL_CME_PROFILE: CMEProfile = {
  earnedCredits: 14.5,
  requiredCredits: 20.0,
  completedQuizzesCount: 7,
  certificates: [
    {
      id: 'cert-2024-01',
      title: 'Advanced Electrocardiography in Acute Coronary Syndromes',
      issueDate: 'October 14, 2024',
      credits: 2.0,
      specialty: 'Cardiology',
      credentialId: 'CC-CME-8841-CARD'
    },
    {
      id: 'cert-2024-02',
      title: 'Emergent Neuroimaging in Large Vessel Occlusion Stroke',
      issueDate: 'November 01, 2024',
      credits: 2.5,
      specialty: 'Neurology',
      credentialId: 'CC-CME-9912-NEUR'
    }
  ]
};

export const MOCK_QUIZZES: QuizQuestion[] = [
  {
    id: 'quiz-01',
    specialty: 'Cardiology',
    title: 'Recognizing Wellens Syndrome on Precordial ECG',
    clinicalScenario: 'A 62-year-old female presents with chest discomfort that has completely resolved upon ED arrival. She is currently pain-free. Cardiac troponin is mildly elevated at 28 ng/L. Her ECG shows biphasic T-waves in leads V2 and V3 without significant ST elevation or pathologic Q waves.',
    imagingUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    options: [
      'Discharge home with an outpatient treadmill exercise stress test within 72 hours',
      'Emergent cardiac catheterization for critical proximal LAD stenosis (Wellens Pattern A)',
      'Administer high-dose NSAIDs for suspected acute viral pericarditis',
      'Order urgent non-contrast chest CT to evaluate for spontaneous pneumothorax'
    ],
    correctOptionIndex: 1,
    explanation: 'Wellens Syndrome (specifically Pattern A: biphasic T-waves in V2-V3 during pain-free intervals) represents severe proximal LAD stenosis. Stress testing is strictly contraindicated because it can precipitate a catastrophic anterior STEMI. Emergent invasive angiography and revascularization are indicated.',
    cmeCreditsAwarded: 1.0
  },
  {
    id: 'quiz-02',
    specialty: 'Neurology',
    title: 'Differentiating Autoimmune Encephalitis from Viral Encephalitis',
    clinicalScenario: 'A 28-year-old woman is admitted with subacute behavioral changes, auditory hallucinations, insomnia, and stereotypic lip smacking. Continuous EEG reveals an extreme delta brush pattern. CSF shows mild lymphocytic pleocytosis and negative HSV-1/2 PCR.',
    imagingUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
    options: [
      'Stop all medications and transfer to involuntary inpatient psychiatric ward',
      'Initiate intravenous high-dose methylprednisolone, IVIG, and screen for ovarian teratoma (Anti-NMDA)',
      'Begin oral Haloperidol and observe for 4 weeks before repeating lumbar puncture',
      'Start intravenous Acyclovir for 21 days regardless of negative PCR results'
    ],
    correctOptionIndex: 1,
    explanation: 'The extreme delta brush EEG pattern is highly specific for Anti-NMDA receptor encephalitis. Orofacial dyskinesias, rapid psychiatric changes in young females, and negative HSV PCR strongly indicate paraneoplastic autoimmune encephalitis. Prompt first-line immunotherapy and pelvic ultrasound/CT for teratoma resection yield high recovery rates.',
    cmeCreditsAwarded: 1.5
  },
  {
    id: 'quiz-03',
    specialty: 'Orthopedics',
    title: 'Acute Pediatric Hip Pain & Referred Knee Pain (SCFE)',
    clinicalScenario: 'An overweight 12-year-old boy presents with progressive left antalgic limp and vague knee pain for 4 weeks. Examination shows external rotation of the left hip during flexion. AP knee X-rays are normal.',
    options: [
      'Order knee MRI to evaluate for medial meniscus tear',
      'Prescribe oral analgesics and allow full sports participation',
      'Obtain urgent pelvis AP and frog-leg lateral radiographs to assess for Slipped Capital Femoral Epiphysis',
      'Diagnose Osgood-Schlatter disease and apply patellar strap'
    ],
    correctOptionIndex: 2,
    explanation: 'Any adolescent with knee or distal thigh pain and an altered gait must have their hips examined and imaged. The presence of the Drehmann sign (obligatory external rotation on hip flexion) is a hallmark of SCFE. Frog-leg lateral radiographs are essential to assess the Klein line and prevent avascular necrosis via urgent screw fixation.',
    cmeCreditsAwarded: 1.0
  }
];

export const MOCK_GRAND_ROUNDS = [
  {
    id: 'gr-01',
    title: 'Global Grand Rounds: Mechanical Circulatory Support in Acute Myocardial Infarction Cardiogenic Shock',
    speaker: 'Dr. Alexander Wright, MD (Johns Hopkins) & Dr. Marcus Vance, MD (Mayo Clinic)',
    date: 'Thursday, November 12, 2026',
    duration: '60 minutes',
    credits: 1.5,
    attendeesCount: 420,
    isUpcoming: true,
    description: 'A case-based interactive review of real-time hemodynamic waveform interpretation, timing of Impella vs ECMO cannulation, and patient survival algorithms from international multi-center registries.'
  },
  {
    id: 'gr-02',
    title: 'Diagnostic Mystery: Paraneoplastic Autoimmune Encephalopathies Across Age Groups',
    speaker: 'Dr. Elena Rostova, MD, PhD (Charité Berlin)',
    date: 'Archived - Recorded October 2026',
    duration: '45 minutes',
    credits: 1.0,
    attendeesCount: 890,
    isUpcoming: false,
    description: 'Deep dive into novel neural antibody targets, CSF biomarker panels, and imaging subtleties on 3T FLAIR MRI.'
  }
];
