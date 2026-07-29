from typing import Dict, List, Any

class RiskEngine:
    """Aggregates multi-model telemetry into a unified risk score and policy decision."""

    def __init__(self):
        # Weighting factors for the final risk calculation
        self.weights = {
            "injection_threat": 0.50,
            "phi_exposure": 0.30,
            "vector_similarity": 0.20
        }

    def evaluate(
        self, 
        classification: Dict[str, Any], 
        phi_entities: List[Dict[str, Any]],
        similarity: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        # 1. Base scores from ML models (normalized 0-100)
        threat_score = classification.get("threat_score", 0.0) * 100
        sim_score = similarity.get("max_similarity", 0.0) * 100
        
        # Calculate PHI severity based on entity count and confidence
        phi_score = 0
        if phi_entities:
            base_phi_penalty = 40
            per_entity_penalty = sum([e.get("confidence", 1.0) * 15 for e in phi_entities])
            phi_score = min(base_phi_penalty + per_entity_penalty, 100)

        # 2. Weighted Aggregation
        overall_risk = (
            (threat_score * self.weights["injection_threat"]) +
            (phi_score * self.weights["phi_exposure"]) +
            (sim_score * self.weights["vector_similarity"])
        )
        overall_risk = min(int(overall_risk), 100)

        # 3. Policy Enforcement Engine
        action = "Allowed"
        flags = []

        if overall_risk >= 75 or classification.get("category") == "Prompt Injection / Jailbreak":
            action = "Blocked"
            flags.append("High-confidence malicious intent detected.")
        elif sim_score >= 85:
            action = "Blocked"
            flags.append("Matches known adversarial attack vector.")
        elif phi_entities:
            action = "Masked"
            flags.append(f"Detected {len(phi_entities)} sensitive data entities.")
        elif overall_risk >= 45:
            action = "Quarantined"
            flags.append("Suspicious anomalous behavior detected.")

        return {
            "risk_score": overall_risk,
            "action": action,
            "flags": flags,
            "breakdown": {
                "classifier_risk": int(threat_score),
                "phi_risk": int(phi_score),
                "similarity_risk": int(sim_score)
            }
        }