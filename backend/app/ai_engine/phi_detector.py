import re
from typing import Dict, List, Any
from app.ai_engine.model_loader import model_registry

class PHIDetector:
    """Transformer-powered PHI and PII entity detection and redaction."""

    REGEX_PATTERNS = {
        "SSN": r"\b\d{3}-\d{2}-\d{4}\b",
        "PHONE": r"\b(?:\+?1[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}\b",
        "MEDICAL_RECORD_ID": r"\b(?:MRN|RECORD|PATIENT)[\s#:]*([A-Z0-9]{6,10})\b"
    }

    def __init__(self):
        self.ner_pipeline = model_registry.phi_pipeline

    def detect(self, text: str) -> List[Dict[str, Any]]:
        entities = []

        # Step 1: Neural Transformer Named Entity Recognition
        ner_results = self.ner_pipeline(text)
        for entity in ner_results:
            entities.append({
                "entity": entity["entity_group"],
                "value": entity["word"],
                "start": int(entity["start"]),
                "end": int(entity["end"]),
                "confidence": round(float(entity["score"]), 4),
                "source": "Transformer-NER"
            })

        # Step 2: Heuristic Regex Fallbacks for standard IDs
        for entity_type, pattern in self.REGEX_PATTERNS.items():
            for match in re.finditer(pattern, text, re.IGNORECASE):
                # Avoid duplicates if overlapping with Transformer results
                if not any(e["start"] <= match.start() and e["end"] >= match.end() for e in entities):
                    entities.append({
                        "entity": entity_type,
                        "value": match.group(0),
                        "start": match.start(),
                        "end": match.end(),
                        "confidence": 0.99,
                        "source": "Regex-Pattern"
                    })

        return sorted(entities, key=lambda x: x["start"])

    def mask(self, text: str, entities: List[Dict[str, Any]]) -> str:
        """Redacts detected entities backwards to maintain string offset alignment."""
        masked_text = text
        for entity in sorted(entities, key=lambda x: x["start"], reverse=True):
            placeholder = f"[{entity['entity']}_REDACTED]"
            masked_text = (
                masked_text[:entity["start"]] + placeholder + masked_text[entity["end"]:]
            )
        return masked_text