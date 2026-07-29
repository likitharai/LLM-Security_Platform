import torch
import torch.nn.functional as F
from typing import Dict, Any
from app.ai_engine.model_loader import model_registry

class PromptClassifier:
    """Hugging Face Transformer classifier for Prompt Injections and Jailbreaks."""

    def __init__(self):
        self.tokenizer = model_registry.injection_tokenizer
        self.model = model_registry.injection_model
        self.device = "cuda" if model_registry.device == 0 else "cpu"

    def classify(self, prompt: str) -> Dict[str, Any]:
        inputs = self.tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=512
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probabilities = F.softmax(logits, dim=-1)[0]

        # Label 1: Injection/Jailbreak, Label 0: Safe
        injection_score = float(probabilities[1].item()) if probabilities.shape[0] > 1 else float(probabilities[0].item())
        injection_score = round(injection_score, 4)

        if injection_score >= 0.75:
            category = "Prompt Injection / Jailbreak"
        elif injection_score >= 0.40:
            category = "Suspicious Intent"
        else:
            category = "Safe Query"

        return {
            "category": category,
            "confidence": round(max(float(probabilities[0]), float(probabilities[1])) if probabilities.shape[0] > 1 else injection_score, 4),
            "threat_score": injection_score,
            "model_used": "DeBERTa-v3-Prompt-Injection"
        }