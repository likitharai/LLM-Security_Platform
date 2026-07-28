from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class PromptAnalysisRequest(BaseModel):
    prompt_text: str
    source_system: str = "Web Portal"
    user_id: str = "anonymous"

class PromptAnalysisResponse(BaseModel):
    id: Optional[int] = None
    timestamp: datetime
    prompt_text: str
    source_system: str
    risk_score: float
    decision: str
    primary_threat: Optional[str] = None
    flagged_entities: List[str] = []

    class Config:
        from_attributes = True