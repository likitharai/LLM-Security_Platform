from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.analysis import PromptAnalysisRequest, PromptAnalysisResponse
from app.services.analysis_service import AnalysisService

router = APIRouter()

@router.post("/analyze", response_model=PromptAnalysisResponse)
def analyze_prompt(request: PromptAnalysisRequest, db: Session = Depends(get_db)):
    try:
        service = AnalysisService(db)
        return service.evaluate_and_log_prompt(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))