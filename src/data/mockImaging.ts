export interface DicomImageStudy {
  id: string;
  patientId: string;
  studyDescription: string;
  modality: 'XR' | 'CT' | 'MR';
  bodyPart: string;
  seriesNumber: string;
  sliceThickness: string;
  kvp: string;
  tubeCurrent: string;
  matrix: string;
  windowCenter: number;
  windowWidth: number;
  preset: 'Lung' | 'Bone' | 'SoftTissue' | 'Brain' | 'Standard';
  findings: string;
  imageUrl: string;
  secondaryImageUrl?: string; // For comparison
  annotationsSample?: Array<{
    type: 'arrow' | 'rect' | 'ruler' | 'text';
    x: number;
    y: number;
    x2?: number;
    y2?: number;
    label: string;
    measurementMm?: number;
  }>;
}

export const MOCK_DICOM_STUDIES: DicomImageStudy[] = [
  {
    id: 'study-001',
    patientId: 'ANON-8491-C',
    studyDescription: 'Chest PA & Lateral - STAT Evaluation',
    modality: 'XR',
    bodyPart: 'CHEST',
    seriesNumber: '1',
    sliceThickness: 'N/A',
    kvp: '120 kV',
    tubeCurrent: '3.2 mAs',
    matrix: '2048 x 2048',
    windowCenter: 128,
    windowWidth: 256,
    preset: 'Lung',
    findings: 'Apparent apical visceral pleural line on left apex with 18mm pneumothorax margin and basal atelectasis. No mediastinal shift.',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1000&auto=format&fit=crop&q=80',
    annotationsSample: [
      { type: 'arrow', x: 260, y: 140, x2: 310, y2: 190, label: 'Visceral Pleural Line (18mm)' },
      { type: 'ruler', x: 280, y: 120, x2: 340, y2: 120, label: 'Pneumothorax Rim', measurementMm: 18.2 }
    ]
  },
  {
    id: 'study-002',
    patientId: 'ANON-9204-N',
    studyDescription: 'Brain MRI with/without IV Gadolinium - FLAIR / T2 Axial',
    modality: 'MR',
    bodyPart: 'BRAIN',
    seriesNumber: '4',
    sliceThickness: '3.0 mm',
    kvp: '1.5 Tesla',
    tubeCurrent: 'TE 90 / TR 8000',
    matrix: '512 x 512',
    windowCenter: 140,
    windowWidth: 220,
    preset: 'Brain',
    findings: 'Bilateral hyperintensity on T2/FLAIR involving the mesial temporal lobes and amygdala, suspicious for autoimmune limbic encephalitis.',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1000&auto=format&fit=crop&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80',
    annotationsSample: [
      { type: 'rect', x: 210, y: 220, x2: 310, y2: 300, label: 'Medial Temporal Hyperintensity' },
      { type: 'text', x: 210, y: 200, label: 'Anti-NMDA Pattern' }
    ]
  },
  {
    id: 'study-003',
    patientId: 'ANON-3312-E',
    studyDescription: 'CT Angiography of Chest (PE Protocol)',
    modality: 'CT',
    bodyPart: 'CHEST CT-PA',
    seriesNumber: '3',
    sliceThickness: '1.0 mm',
    kvp: '100 kV',
    tubeCurrent: '250 mA',
    matrix: '512 x 512',
    windowCenter: 40,
    windowWidth: 350,
    preset: 'SoftTissue',
    findings: 'Bilateral filling defect at the bifurcation of main pulmonary arteries extending into right lower lobe branch. Consistent with Saddle PE.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&auto=format&fit=crop&q=80',
    secondaryImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1000&auto=format&fit=crop&q=80',
    annotationsSample: [
      { type: 'arrow', x: 250, y: 240, x2: 290, y2: 280, label: 'Filling Defect - Saddle PE' }
    ]
  },
  {
    id: 'study-004',
    patientId: 'ANON-1102-P',
    studyDescription: 'Pelvis AP and Frog-leg Lateral (Pediatric)',
    modality: 'XR',
    bodyPart: 'PELVIS',
    seriesNumber: '2',
    sliceThickness: 'N/A',
    kvp: '65 kV',
    tubeCurrent: '2.5 mAs',
    matrix: '2048 x 2048',
    windowCenter: 135,
    windowWidth: 280,
    preset: 'Bone',
    findings: 'Klein line fails to intersect the lateral aspect of the femoral epiphysis on left side. Grade II Slipped Capital Femoral Epiphysis.',
    imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1000&auto=format&fit=crop&q=80',
    annotationsSample: [
      { type: 'ruler', x: 190, y: 180, x2: 330, y2: 220, label: "Klein's Line Disruption", measurementMm: 24.5 }
    ]
  }
];
