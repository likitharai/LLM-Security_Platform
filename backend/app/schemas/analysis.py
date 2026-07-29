from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class EntitySchema(BaseModel):
    entity: str
    value: str
    start: int
    end: int
    confidence: float
    source: str

class ClassificationSchema(BaseModel):
    category: str
    confidence: float
    threat_score: float
    model_used: str

class SimilaritySchema(BaseModel):
    max_similarity: float
    matched_benchmark: Optional[str] = None
    embedding_dimension: int

class SecurityDecisionSchema(BaseModel):
    risk_score: int
    action: str
    flags: List[str]
    score_breakdown: Dict[str, int]

class AnalysisRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    source: str = Field(default="Web UI")

class AnalysisResponse(BaseModel):
    original_prompt: str
    processed_prompt: str
    source: str
    analysis: Dict[str, Any]
    security_decision: SecurityDecisionSchema
    metrics: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)