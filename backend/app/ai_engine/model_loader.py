import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from sentence_transformers import SentenceTransformer
import logging

logger = logging.getLogger(__name__)

class ModelLoader:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
            cls._instance._initialize_models()
        return cls._instance

    def _initialize_models(self):
        # Automatically detect GPU availability
        self.device = 0 if torch.cuda.is_available() else -1
        logger.info(f"Loading AI Models onto device: {'GPU (CUDA)' if self.device == 0 else 'CPU'}")

        # 1. Prompt Injection / Jailbreak Classifier (DeBERTa-v3 architecture)
        # Uses custom model path if present in repo, otherwise downloads pre-trained weights
        classifier_model_name = "protectai/deberta-v3-base-prompt-injection"
        self.injection_tokenizer = AutoTokenizer.from_pretrained(classifier_model_name)
        self.injection_model = AutoModelForSequenceClassification.from_pretrained(classifier_model_name)
        if self.device == 0:
            self.injection_model = self.injection_model.cuda()

        # 2. PHI / PII Token Classifier (Named Entity Recognition)
        ner_model_name = "dslim/bert-base-NER"
        self.phi_pipeline = pipeline(
            "token-classification",
            model=ner_model_name,
            tokenizer=ner_model_name,
            aggregation_strategy="simple",  # Groups split sub-words into single entities
            device=self.device
        )

        # 3. Embedding Model for Semantic Vector Similarity
        self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
        logger.info("All Hugging Face pipelines initialized successfully.")

# Global instance initialization
model_registry = ModelLoader()