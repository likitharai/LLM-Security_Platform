from sqlalchemy.orm import Session
from app.db.models.policy import Policy
# Import your actual detectors here
from app.engine.detectors import PHIDetector, PromptInjectionDetector, ToxicityDetector 

class RiskEngine:
    def __init__(self, db: Session):
        self.db = db
        self.active_policies = self._load_policies()

    def _load_policies(self) -> dict:
        """
        Fetches all policies from the DB and returns a dictionary of their toggle states.
        Example output: {'phiMasking': True, 'promptInjection': False, ...}
        """
        policies = self.db.query(Policy).all()
        # Default to True if the DB is empty during initial startup
        if not policies:
            return {}
        return {p.key: p.enabled for p in policies}

    def evaluate_request(self, prompt: str) -> dict:
        risk_score = 0.0
        decision = "ALLOWED"
        modified_prompt = prompt
        flags = []

        # ---------------------------------------------------------
        # 1. Privacy & Compliance: PHI Masking
        # ---------------------------------------------------------
        # Check if the policy exists and is enabled (defaults to True if missing)
        if self.active_policies.get('phiMasking', True):
            phi_result = PHIDetector.analyze(modified_prompt)
            
            if phi_result.has_phi:
                modified_prompt = phi_result.masked_text
                decision = "MASKED"
                flags.append("PHI_DETECTED")
                risk_score += 0.4

        # ---------------------------------------------------------
        # 2. Adversarial Threats: Prompt Injection
        # ---------------------------------------------------------
        if self.active_policies.get('promptInjection', True):
            injection_result = PromptInjectionDetector.analyze(modified_prompt)
            
            if injection_result.is_injection:
                # Immediate block - halt further processing
                return self._build_result(
                    "BLOCKED", 0.99, ["PROMPT_INJECTION"], modified_prompt
                )

        # ---------------------------------------------------------
        # 3. Content Safety: Toxicity
        # ---------------------------------------------------------
        if self.active_policies.get('toxicContent', True):
            toxicity_score = ToxicityDetector.analyze(modified_prompt)
            
            if toxicity_score > 0.8: # Threshold for toxicity
                return self._build_result(
                    "BLOCKED", 0.85, ["TOXIC_CONTENT"], modified_prompt
                )

        # Add remaining checks (clinicalData, roleplay, medicalAdvice) following the same pattern...

        return self._build_result(decision, risk_score, flags, modified_prompt)

    def _build_result(self, decision: str, risk_score: float, flags: list, text: str) -> dict:
        return {
            "decision": decision,
            "risk_score": round(risk_score, 2),
            "flags": flags,
            "processed_text": text
        }