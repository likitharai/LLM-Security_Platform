import time
import asyncio
from typing import Dict, Any

from app.ai_engine.classifier import PromptClassifier
from app.ai_engine.phi_detector import PHIDetector
from app.ai_engine.similarity import SimilarityAnalyzer
from app.ai_engine.risk_engine import RiskEngine

class AnalysisService:
    """Orchestrates the asynchronous ML pipeline for real-time prompt analysis."""

    def __init__(self):
        self.classifier = PromptClassifier()
        self.phi_detector = PHIDetector()
        self.similarity = SimilarityAnalyzer()
        self.risk_engine = RiskEngine()

    async def analyze_prompt(self, prompt_text: str, source: str = "API Gateway") -> Dict[str, Any]:
        start_time = time.time()
        
        # Run heavy ML inference concurrently in thread pools to avoid blocking the event loop
        phi_task = asyncio.to_thread(self.phi_detector.detect, prompt_text)
        class_task = asyncio.to_thread(self.classifier.classify, prompt_text)
        sim_task = asyncio.to_thread(self.similarity.compute_similarity, prompt_text)

        # Await all ML models simultaneously (Massive latency reduction)
        entities, classification, similarity_results = await asyncio.gather(phi_task, class_task, sim_task)
        
        # Mask text based on detected entities
        masked_text = self.phi_detector.mask(prompt_text, entities)
        
        # Compute final risk and policy action
        risk_result = self.risk_engine.evaluate(classification, entities, similarity_results)
        
        latency = round((time.time() - start_time) * 1000, 2)

        return {
            "original_prompt": prompt_text,
            "processed_prompt": masked_text,
            "source": source,
            "analysis": {
                "classification": classification,
                "similarity": similarity_results,
                "entities": entities,
            },
            "security_decision": {
                "risk_score": risk_result["risk_score"],
                "action": risk_result["action"],
                "flags": risk_result["flags"],
                "score_breakdown": risk_result["breakdown"]
            },
            "metrics": {
                "latency_ms": latency,
                "models_used": ["DeBERTa-v3", "BERT-NER", "MiniLM-L6-v2"]
            }
        }