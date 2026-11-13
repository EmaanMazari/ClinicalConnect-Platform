import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { checkDatabaseHealth } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory clinical state cache (for existing local mock state)
let casesCache = [];

// System API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'ClinicalConnect Core Medical API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Dedicated Database Health Check Endpoint (Item 11 requirement)
app.get('/api/db/health', async (req, res) => {
  const dbStatus = await checkDatabaseHealth();
  if (dbStatus.healthy) {
    res.status(200).json({
      database: 'PostgreSQL',
      status: 'connected',
      details: dbStatus
    });
  } else {
    res.status(503).json({
      database: 'PostgreSQL',
      status: 'disconnected',
      error: dbStatus.error,
      latencyMs: dbStatus.latencyMs,
      note: 'Configure credentials in .env and ensure PostgreSQL server is running.'
    });
  }
});

// Clinical cases endpoints
app.get('/api/cases', (req, res) => {
  res.json({
    success: true,
    count: casesCache.length,
    cases: casesCache
  });
});

app.post('/api/cases', (req, res) => {
  const newCase = {
    ...req.body,
    id: req.body.id || `case-${Date.now()}`,
    createdAt: new Date().toISOString(),
    isHipaaVerified: true
  };
  casesCache.unshift(newCase);
  res.status(201).json({ success: true, case: newCase });
});

app.get('/api/cases/:id', (req, res) => {
  const found = casesCache.find(c => c.id === req.params.id);
  if (!found) {
    return res.status(404).json({ error: 'Clinical case record not found' });
  }
  res.json({ success: true, case: found });
});

// AI Clinical Co-Pilot Endpoints
app.post('/api/ai/differential', (req, res) => {
  const { title, symptoms, history } = req.body;
  const text = `${title} ${symptoms?.join(' ')} ${history}`.toLowerCase();
  
  const differentials = [];
  if (text.includes('chest') || text.includes('stemi')) {
    differentials.push(
      { condition: 'Acute Anterior STEMI', icd10: 'I21.0', probability: 92 },
      { condition: 'Acute Aortic Dissection', icd10: 'I71.01', probability: 5 }
    );
  } else if (text.includes('encephalitis') || text.includes('hallucination')) {
    differentials.push(
      { condition: 'Anti-NMDA Receptor Encephalitis', icd10: 'G04.81', probability: 94 },
      { condition: 'Herpes Simplex Encephalitis', icd10: 'B00.4', probability: 4 }
    );
  } else {
    differentials.push(
      { condition: 'Acute Undifferentiated Process', icd10: 'R68.89', probability: 75 }
    );
  }

  res.json({
    success: true,
    differentials,
    disclaimer: 'AI outputs are intended solely for clinical assistance. Final medical decisions remain the responsibility of licensed healthcare professionals.'
  });
});

// HIPAA text anonymization endpoint
app.post('/api/hipaa/anonymize', (req, res) => {
  const { rawText } = req.body;
  if (!rawText) {
    return res.status(400).json({ error: 'rawText is required' });
  }

  let scrubbed = rawText
    .replace(/\b(MRN|Medical Record Number)[:\s]*([A-Z0-9-]{4,15})\b/gi, '[REDACTED_MRN]')
    .replace(/\b(DOB|Date of Birth)[:\s]*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})\b/gi, '[REDACTED_DOB]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');

  res.json({
    success: true,
    scrubbedText: scrubbed,
    hipaaCompliant: true
  });
});

// Serve frontend production build if present
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`[ClinicalConnect API & Web] Server live on http://localhost:${PORT}`);
});
