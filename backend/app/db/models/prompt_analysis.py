from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from app.db.database import Base

class PromptAnalysis(Base):
    __tablename__ = "prompt_analyses"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    source_system = Column(String, index=True)
    user_id = Column(String, index=True)
    
    prompt_text = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    decision = Column(String, index=True, nullable=False)  # 'ALLOWED', 'BLOCKED', 'MASKED', 'QUARANTINED'
    primary_threat = Column(String, nullable=True)
    
    flagged_entities = Column(JSON, default=list)