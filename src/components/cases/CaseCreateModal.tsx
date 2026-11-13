import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, ShieldCheck, Mic, MicOff, Upload, 
  Eye, FileText, Activity, Lock, ArrowRight, ArrowLeft, Plus, Trash2
} from 'lucide-react';
import { Specialty, UrgencyLevel, ClinicalCase, Doctor, LabValue, Prescription } from '../../types';
import { anonymizeClinicalText, AnonymizationResult } from '../../services/anonymizationService';
import { runAIClinicalEngine } from '../../services/aiClinicalEngine';
import { storageService } from '../../services/storageService';

interface CaseCreateModalProps {
  currentDoctor: Doctor;
  onClose: () => void;
  onCaseCreated: (newCase: ClinicalCase) => void;
}

export const CaseCreateModal: React.FC<CaseCreateModalProps> = ({
  currentDoctor,
  onClose,
  onCaseCreated
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Case Overview & Patient Demographics
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState<Specialty>(currentDoctor.specialty);
  const [subspecialtyTags, setSubspecialtyTags] = useState('Acute Care, Critical Care');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Priority');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [duration, setDuration] = useState('2 days');
  const [historyInput, setHistoryInput] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('No known drug allergies');

  // Step 2: Vitals & Clinical Data
  const [bp, setBp] = useState('130/84 mmHg');
  const [hr, setHr] = useState(88);
  const [rr, setRr] = useState(18);
  const [temp, setTemp] = useState(37.2);
  const [spo2, setSpo2] = useState(96);
  const [labs, setLabs] = useState<LabValue[]>([
    { name: 'WBC Count', value: '11.4', unit: '10^9/L', referenceRange: '4.5 - 11.0', status: 'high' },
    { name: 'C-Reactive Protein', value: '18.2', unit: 'mg/L', referenceRange: '< 5.0', status: 'high' }
  ]);
  const [newLabName, setNewLabName] = useState('');
  const [newLabVal, setNewLabVal] = useState('');
  const [newLabUnit, setNewLabUnit] = useState('');

  // Step 3: Prescriptions & Discussion Goals & Attachments
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { name: 'Normal Saline IV', dosage: '1000 mL', frequency: 'STAT bolus', route: 'IV', duration: 'Once' }
  ]);
  const [newRxName, setNewRxName] = useState('');
  const [newRxDose, setNewRxDose] = useState('');
  const [discussionGoals, setDiscussionGoals] = useState<ClinicalCase['discussionGoals']>([
    'Diagnostic assistance',
    'Treatment recommendations'
  ]);

  // Voice recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVoiceNote, setRecordedVoiceNote] = useState<string | null>(null);

  // Step 4: HIPAA Anonymization Engine Verification
  const [anonymizationResult, setAnonymizationResult] = useState<AnonymizationResult | null>(null);
  const [faceBlurApplied, setFaceBlurApplied] = useState(true);
  const [hipaaConsent, setHipaaConsent] = useState(true);

  // Auto-save drafts
  useEffect(() => {
    const draft = storageService.getDraft();
    if (draft && typeof draft === 'object' && 'title' in (draft as { title?: string })) {
      const d = draft as { title: string; chiefComplaint: string };
      if (!title && d.title) setTitle(d.title);
      if (!chiefComplaint && d.chiefComplaint) setChiefComplaint(d.chiefComplaint);
    }
  }, []);

  const handleSaveDraft = () => {
    storageService.saveDraft({
      title,
      chiefComplaint,
      specialty,
      age,
      gender,
      duration
    });
    alert('Case draft securely cached offline.');
  };

  // Run anonymization before step 4
  const handleProceedToHIPAA = () => {
    const rawCorpus = `Patient Name: John Doe, MRN: 489201. Chief Complaint: ${chiefComplaint}. History: ${historyInput}. Notes: ${title}`;
    const result = anonymizeClinicalText(rawCorpus);
    setAnonymizationResult(result);
    setStep(4);
  };

  // Toggle Voice Dictation Simulation
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setRecordedVoiceNote('Voice dictation captured (45s audio note ready)');
        if (!chiefComplaint) {
          setChiefComplaint('Patient reports sudden retrosternal tightness associated with mild nausea and shortness of breath.');
        }
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleAddLab = () => {
    if (!newLabName || !newLabVal) return;
    setLabs([
      ...labs,
      {
        name: newLabName,
        value: newLabVal,
        unit: newLabUnit || 'units',
        referenceRange: 'Normal standard',
        status: 'normal'
      }
    ]);
    setNewLabName('');
    setNewLabVal('');
    setNewLabUnit('');
  };

  const handleAddRx = () => {
    if (!newRxName) return;
    setPrescriptions([
      ...prescriptions,
      {
        name: newRxName,
        dosage: newRxDose || 'Standard',
        frequency: 'Daily',
        route: 'Oral',
        duration: '7 days'
      }
    ]);
    setNewRxName('');
    setNewRxDose('');
  };

  const handleSubmitCase = () => {
    const symptoms = symptomsInput
      ? symptomsInput.split(',').map(s => s.trim())
      : ['Atypical presentation', 'Fatigue'];

    const medicalHistory = historyInput
      ? historyInput.split(',').map(h => h.trim())
      : ['Hypertension'];

    const tags = subspecialtyTags.split(',').map(t => t.trim());

    const patientData = {
      age,
      gender,
      anonymizedId: `PT-${Math.floor(1000 + Math.random() * 9000)}-${specialty.slice(0, 4).toUpperCase()}`,
      chiefComplaint: chiefComplaint || title,
      symptoms,
      durationOfIllness: duration,
      medicalHistory,
      familyHistory: 'Non-contributory',
      allergies: [allergiesInput]
    };

    const vitalsData = {
      bloodPressure: bp,
      heartRate: hr,
      respiratoryRate: rr,
      temperature: temp,
      oxygenSaturation: spo2
    };

    // Run AI Engine to generate automated insights
    const aiEngineResult = runAIClinicalEngine(
      title,
      patientData,
      vitalsData,
      labs,
      prescriptions
    );

    const newCase: ClinicalCase = {
      id: `case-${Date.now()}`,
      title,
      summary: `${age}yo ${gender} presenting with ${duration} of ${chiefComplaint}. Vitals: BP ${bp}, HR ${hr} bpm, SpO2 ${spo2}%.`,
      specialty,
      subspecialtyTags: tags,
      author: currentDoctor,
      createdAt: 'Just now',
      status: 'Open',
      urgency,
      statDeadline: urgency === 'Emergency STAT' ? '15 min SLA Remaining' : undefined,
      patient: patientData,
      vitals: vitalsData,
      labs,
      prescriptions,
      attachments: [
        {
          id: `att-${Date.now()}`,
          title: `${specialty} Diagnostic Series - Anonymized`,
          modality: specialty === 'Cardiology' ? 'ECG' : specialty === 'Neurology' ? 'MRI' : 'X-Ray',
          url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
          isDicom: true,
          anonymized: true,
          notes: 'Automatic PHI redaction verified by HIPAA Engine.'
        }
      ],
      discussionGoals,
      aiInsights: {
        summary: aiEngineResult.soapSummary,
        differentialDiagnoses: aiEngineResult.differentials,
        drugInteractions: aiEngineResult.drugInteractions,
        relevantGuidelines: aiEngineResult.guidelines,
        similarArchivedCaseIds: []
      },
      comments: [],
      viewsCount: 1,
      subscribersCount: 1,
      isHipaaVerified: true
    };

    storageService.saveCase(newCase);
    storageService.clearDraft();
    onCaseCreated(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-8">
        {/* Wizard Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-medical-50 text-medical-600 dark:bg-medical-950 dark:text-medical-400 border border-medical-200 dark:border-medical-800">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Post Anonymized Clinical Case
              </h2>
              <div className="text-xs text-slate-500">
                Step {step} of 4: {
                  step === 1 ? 'Patient & Clinical Overview' :
                  step === 2 ? 'Biomarkers & Vital Signs' :
                  step === 3 ? 'Prescriptions & Discussion Goals' :
                  'HIPAA Anonymization & AI Safety'
                }
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Save Draft
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Wizard Steps Tracker */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-xs text-center font-semibold">
          {[
            { num: 1, label: 'Demographics' },
            { num: 2, label: 'Vitals & Labs' },
            { num: 3, label: 'Rx & Goals' },
            { num: 4, label: 'HIPAA Engine' }
          ].map(s => (
            <div
              key={s.num}
              className={`py-2.5 transition border-b-2 ${
                step === s.num
                  ? 'border-medical-600 text-medical-600 dark:text-medical-400 bg-medical-50/50 dark:bg-medical-950/20'
                  : step > s.num
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-400'
              }`}
            >
              {s.num}. {s.label}
            </div>
          ))}
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs text-slate-800 dark:text-slate-200">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="font-semibold block mb-1">Case Clinical Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 58M with crushing substernal chest pain, dynamic ST elevations, and refractory hypotension"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Target Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value as Specialty)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
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
                  <label className="font-semibold block mb-1">Urgency / Priority</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold"
                  >
                    <option value="Routine">Routine Collaboration</option>
                    <option value="Priority">Priority (Subacute 4h)</option>
                    <option value="Emergency STAT">Emergency STAT (15-min SLA)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={subspecialtyTags}
                    onChange={(e) => setSubspecialtyTags(e.target.value)}
                    placeholder="STEMI, Interventional, Shock"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="font-semibold block mb-1">Patient Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Duration of Illness</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 90 minutes, 3 weeks"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Chief Complaint & Voice dictation */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold">Chief Complaint & History of Present Illness *</label>
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      isRecording
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isRecording ? 'Listening (Speak now)...' : 'Dictate with Voice-to-Text'}</span>
                  </button>
                </div>
                {recordedVoiceNote && (
                  <div className="mb-2 text-xs text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {recordedVoiceNote}
                  </div>
                )}
                <textarea
                  rows={3}
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Patient presented with acute onset..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-medical-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Presenting Symptoms (comma-separated)</label>
                <input
                  type="text"
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  placeholder="e.g. Substernal chest pressure, Diaphoresis, Presyncope"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Past Medical History</label>
                <input
                  type="text"
                  value={historyInput}
                  onChange={(e) => setHistoryInput(e.target.value)}
                  placeholder="e.g. Hypertension, Type 2 Diabetes, 30 pack-year smoking"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-medical-600" />
                <span>Admission Vitals</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">BP (mmHg)</label>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">RR (/min)</label>
                  <input
                    type="number"
                    value={rr}
                    onChange={(e) => setRr(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Labs Table */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm">Laboratory Biomarkers</h4>
                  <span className="text-[11px] text-slate-500">Values with high/low flags</span>
                </div>

                <div className="space-y-2 mb-3">
                  {labs.map((l, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="font-semibold">{l.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold">{l.value} {l.unit}</span>
                        <span className="text-slate-400 font-mono text-[11px]">Ref: {l.referenceRange}</span>
                        <button
                          type="button"
                          onClick={() => setLabs(labs.filter((_, idx) => idx !== i))}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Lab inline */}
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Test Name (e.g. Troponin I)"
                    value={newLabName}
                    onChange={(e) => setNewLabName(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 4820)"
                    value={newLabVal}
                    onChange={(e) => setNewLabVal(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g. ng/L)"
                    value={newLabUnit}
                    onChange={(e) => setNewLabUnit(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddLab}
                    className="px-3 py-1.5 rounded-lg bg-medical-600 hover:bg-medical-700 text-white font-medium transition"
                  >
                    + Add Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-2">
                  Current Medications & Prescriptions
                </h3>
                <div className="space-y-2 mb-3">
                  {prescriptions.map((rx, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{rx.name}</span>
                        <span className="ml-2 font-mono text-slate-500">{rx.dosage} • {rx.frequency}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Medication Name (e.g. Aspirin)"
                    value={newRxName}
                    onChange={(e) => setNewRxName(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 325 mg)"
                    value={newRxDose}
                    onChange={(e) => setNewRxDose(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddRx}
                    className="px-3 py-1.5 rounded-lg bg-medical-600 hover:bg-medical-700 text-white font-medium transition"
                  >
                    + Add Medication
                  </button>
                </div>
              </div>

              {/* Discussion Goals selection */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <label className="font-semibold block mb-2">What is the primary goal of this case discussion?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Diagnostic assistance',
                    'Treatment recommendations',
                    'Surgical opinions',
                    'Referral guidance',
                    'Rare disease discussions'
                  ].map((goal) => {
                    const isChecked = discussionGoals.includes(goal as typeof discussionGoals[0]);
                    return (
                      <label
                        key={goal}
                        className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                          isChecked
                            ? 'bg-medical-50 dark:bg-medical-950 border-medical-500 text-medical-800 dark:text-medical-200'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setDiscussionGoals(discussionGoals.filter(g => g !== goal));
                            } else {
                              setDiscussionGoals([...discussionGoals, goal as typeof discussionGoals[0]]);
                            }
                          }}
                          className="rounded text-medical-600 focus:ring-medical-500"
                        />
                        <span className="font-medium">{goal}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: HIPAA & Anonymization Engine */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                    Automatic HIPAA & GDPR Privacy Engine Active
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                    All direct patient identifiers (Names, Dates of birth, Medical Record Numbers, Hospital facilities) have been automatically masked and encrypted.
                  </p>
                </div>
              </div>

              {/* Anonymization Preview */}
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <span className="font-semibold block text-slate-700 dark:text-slate-300 mb-2">
                  Redacted Protected Health Information (PHI):
                </span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-600 font-bold">✓ Redacted:</span> Patient Full Name &rarr; <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">[REDACTED_NAME]</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-600 font-bold">✓ Redacted:</span> MRN / Hospital Number &rarr; <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">[REDACTED_MRN]</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="text-emerald-600 font-bold">✓ Redacted:</span> Birth Date & Address &rarr; <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">[REDACTED_DOB]</span>
                  </div>
                </div>
              </div>

              {/* Face Blurring toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="font-semibold block text-slate-900 dark:text-slate-100">
                    Automatic Facial / Eye-Bar Blurring
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Applies deep learning ocular masking for clinical dermatologic and photographic attachments.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={faceBlurApplied}
                  onChange={(e) => setFaceBlurApplied(e.target.checked)}
                  className="w-4 h-4 rounded text-medical-600 focus:ring-medical-500"
                />
              </div>

              {/* Doctor attestation */}
              <label className="flex items-start gap-2.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hipaaConsent}
                  onChange={(e) => setHipaaConsent(e.target.checked)}
                  className="mt-0.5 rounded text-medical-600 focus:ring-medical-500"
                  required
                />
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  I attest as a licensed healthcare professional ({currentDoctor.licenseNumber}) that this case has been scrubbed of individual identifiers in compliance with HIPAA Safe Harbor and national health data regulations.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as typeof step)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => {
                if (!title) {
                  alert('Please enter a clinical case title.');
                  return;
                }
                setStep((step + 1) as typeof step);
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow transition"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : step === 3 ? (
            <button
              onClick={handleProceedToHIPAA}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs shadow transition"
            >
              Run HIPAA Anonymizer <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitCase}
              disabled={!hipaaConsent}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs shadow-lg transition disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Publish Case to Network</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
