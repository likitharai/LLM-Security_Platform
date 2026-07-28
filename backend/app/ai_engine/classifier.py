from typing import Dict, Any, List

class PromptInjectionClassifier:
    def __init__(self):
        # Common adversarial patterns and their associated risk weights
        self.injection_signatures = {
            "ignore previous instructions": 0.95,
            "you are now in developer mode": 0.98,
            "jailbreak": 0.90,
            "system prompt": 0.85,
            "reveal hidden context": 0.92,
            "bypass": 0.75,
            "as an ai language model": 0.50  # Lower risk, often part of standard prompt leakage
        }

    def predict(self, text: str) -> Dict[str, Any]:
        """Evaluates text for prompt injection intent."""
        text_lower = text.lower()
        max_risk = 0.0
        flagged_patterns = []

        for signature, weight in self.injection_signatures.items():
            if signature in text_lower:
                max_risk = max(max_risk, weight)
                flagged_patterns.append(f"Injection Pattern: '{signature}'")

        return {
            "is_injection": max_risk > 0.7,
            "risk_score": max_risk,
            "patterns": flagged_patterns
        }