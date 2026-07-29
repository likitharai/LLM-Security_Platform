// Risk Score Thresholds and visual mappings
export const RISK_LEVELS = {
  CRITICAL: { 
    label: 'Critical Risk', 
    minScore: 75, 
    textColor: 'text-red-700', 
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500'
  },
  ELEVATED: { 
    label: 'Elevated Risk', 
    minScore: 45, 
    textColor: 'text-amber-700', 
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500'
  },
  SAFE: { 
    label: 'Safe', 
    minScore: 0, 
    textColor: 'text-emerald-700', 
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-500'
  }
};

// Standardized Action Types from the Backend
export const SECURITY_ACTIONS = {
  BLOCKED: 'Blocked',
  ALLOWED: 'Allowed',
  QUARANTINED: 'Quarantined',
  MASKED: 'Masked'
};

// Model Names and their display labels
export const MODEL_CATALOG = {
  INJECTION: 'DeBERTa-v3-Injection',
  NER: 'BERT-Base-NER',
  SIMILARITY: 'MiniLM-L6-v2'
};

// Helper function to dynamically get risk config based on a 0-100 score
export const getRiskConfig = (score) => {
  if (score >= RISK_LEVELS.CRITICAL.minScore) return RISK_LEVELS.CRITICAL;
  if (score >= RISK_LEVELS.ELEVATED.minScore) return RISK_LEVELS.ELEVATED;
  return RISK_LEVELS.SAFE;
};