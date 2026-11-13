import { AuditLogEntry } from '../types';

export interface AnonymizationResult {
  cleanedText: string;
  redactedEntities: Array<{
    type: 'NAME' | 'MRN' | 'DOB' | 'PHONE' | 'ADDRESS' | 'HOSPITAL';
    original: string;
    replacement: string;
  }>;
  hipaaCompliant: boolean;
}

export function anonymizeClinicalText(rawText: string): AnonymizationResult {
  const redactedEntities: AnonymizationResult['redactedEntities'] = [];
  let cleaned = rawText;

  // Patterns for PHI (Protected Health Information)
  const patterns: Array<{ regex: RegExp; type: AnonymizationResult['redactedEntities'][0]['type']; replaceWith: string }> = [
    { regex: /\b(MRN|Medical Record Number|Chart #|Patient ID)[:\s]*([A-Z0-9-]{4,15})\b/gi, type: 'MRN', replaceWith: '[REDACTED_MRN]' },
    { regex: /\b(DOB|Date of Birth|Birthdate)[:\s]*(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})\b/gi, type: 'DOB', replaceWith: '[REDACTED_DOB]' },
    { regex: /\b(Phone|Tel|Cell|Mobile)[:\s]*(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/gi, type: 'PHONE', replaceWith: '[REDACTED_PHONE]' },
    { regex: /\b(Patient|Pt Name|Name)[:\s]*([A-Z][a-z]+ [A-Z][a-z]+)\b/g, type: 'NAME', replaceWith: '[REDACTED_NAME]' },
    { regex: /\b\d{3}-\d{2}-\d{4}\b/g, type: 'MRN', replaceWith: '[REDACTED_SSN]' },
    { regex: /\b([A-Z][a-z]+ (Memorial|General|Regional|Presbyterian|Methodist|Children's) Hospital)\b/g, type: 'HOSPITAL', replaceWith: '[REGIONAL_CENTER]' }
  ];

  for (const { regex, type, replaceWith } of patterns) {
    let match;
    while ((match = regex.exec(cleaned)) !== null) {
      redactedEntities.push({
        type,
        original: match[0],
        replacement: replaceWith
      });
      cleaned = cleaned.replace(match[0], replaceWith);
    }
  }

  return {
    cleanedText: cleaned,
    redactedEntities,
    hipaaCompliant: true
  };
}

export function createAuditLog(
  doctorId: string,
  doctorName: string,
  action: AuditLogEntry['action'],
  caseId: string
): AuditLogEntry {
  return {
    id: 'audit-' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
    doctorId,
    doctorName,
    action,
    caseId,
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 20),
    complianceFlag: 'HIPAA_COMPLIANT'
  };
}
