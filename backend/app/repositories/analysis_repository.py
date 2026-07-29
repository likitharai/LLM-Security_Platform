from sqlalchemy.orm import Session
import json
from datetime import datetime
# Assuming you have a generic log table in your models.base or models.database
from app.db.models.base import PromptLog 
from app.schemas.analysis import AnalysisResponse

class AnalysisRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_analysis_log(self, result: AnalysisResponse) -> PromptLog:
        """Saves the comprehensive ML analysis result to the database."""
        
        db_log = PromptLog(
            timestamp=result.timestamp,
            source=result.source,
            original_prompt=result.original_prompt,
            processed_prompt=result.processed_prompt,
            risk_score=result.security_decision.risk_score,
            action_taken=result.security_decision.action,
            
            # Convert nested Pydantic models/dicts to JSON strings for storage
            flags=json.dumps(result.security_decision.flags),
            score_breakdown=json.dumps(result.security_decision.score_breakdown),
            classification_data=json.dumps(result.analysis.get("classification", {})),
            phi_entities_detected=json.dumps(result.analysis.get("entities", [])),
            
            latency_ms=result.metrics.get("latency_ms", 0.0)
        )
        
        self.db.add(db_log)
        self.db.commit()
        self.db.refresh(db_log)
        
        return db_log
        
    def get_recent_logs(self, limit: int = 50):
        """Fetches recent threat logs for the ThreatLogs.jsx dashboard."""
        return self.db.query(PromptLog).order_by(PromptLog.timestamp.desc()).limit(limit).all()