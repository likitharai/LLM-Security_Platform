from sqlalchemy.orm import Session
from app.schemas.analysis import PromptAnalysisRequest, PromptAnalysisResponse
from app.repositories.analysis_repository import AnalysisRepository
from app.ai_engine.risk_engine import RiskEngine

class AnalysisService:
    def __init__(self, db: Session):
        self.repo = AnalysisRepository(db)
        self.risk_engine = RiskEngine()

    def evaluate_and_log_prompt(self, request: PromptAnalysisRequest) -> PromptAnalysisResponse:
        # 1. Run the AI risk engine
        engine_results = self.risk_engine.evaluate_prompt(request.prompt_text)

        # 2. Persist event to database
        saved_record = self.repo.create_log(
            request=request,
            risk_score=engine_results["risk_score"],
            decision=engine_results["decision"],
            primary_threat=engine_results["primary_threat"]
        )

        return PromptAnalysisResponse.model_validate(saved_record)