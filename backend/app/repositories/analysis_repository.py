from sqlalchemy.orm import Session
from app.db.models.prompt_analysis import PromptAnalysis
from app.schemas.analysis import PromptAnalysisRequest

class AnalysisRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_log(self, request: PromptAnalysisRequest, risk_score: float, decision: str, primary_threat: Optional[str]) -> PromptAnalysis:
        db_record = PromptAnalysis(
            source_system=request.source_system,
            user_id=request.user_id,
            prompt_text=request.prompt_text,
            risk_score=risk_score,
            decision=decision,
            primary_threat=primary_threat,
            flagged_entities=[]
        )
        self.db.add(db_record)
        self.db.commit()
        self.db.refresh(db_record)
        return db_record

    def get_recent_logs(self, limit: int = 50):
        return self.db.query(PromptAnalysis).order_by(PromptAnalysis.timestamp.desc()).limit(limit).all()