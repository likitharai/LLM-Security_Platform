import re
from typing import Dict, Any, List

class PHIDetector:
    def __init__(self):
        # Define regex patterns for common PHI/PII
        self.patterns = {
            "SSN": r"\b\d{3}-\d{2}-\d{4}\b",
            "Email": r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
            "Phone": r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b",
            "Patient_ID": r"\b(PID|PAT)-\d{5,8}\b",
        }

    def analyze(self, text: str) -> Dict[str, Any]:
        """Scans text for PHI and returns the risk level and flagged entities."""
        flagged_entities = []
        risk_score = 0.0

        for entity_type, pattern in self.patterns.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                # Add found entities to our flagged list
                for match in matches:
                    flagged_entities.append(f"{entity_type}: {match}")
                
                # High risk if any PHI is found
                risk_score = max(risk_score, 0.85)

        return {
            "has_phi": len(flagged_entities) > 0,
            "risk_score": risk_score,
            "entities": flagged_entities
        }