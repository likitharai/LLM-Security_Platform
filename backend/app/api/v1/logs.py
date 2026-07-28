from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.analysis import PromptAnalysisResponse
from app.repositories.analysis_repository import AnalysisRepository

router = APIRouter()

@router.get("/logs", response_model=List[PromptAnalysisResponse])
def get_threat_logs(limit: int = 50, db: Session = Depends(get_db)):
    repo = AnalysisRepository(db)
    return repo.get_recent_logs(limit=limit)