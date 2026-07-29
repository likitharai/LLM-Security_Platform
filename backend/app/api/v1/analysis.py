from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.services.analysis_service import AnalysisService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analysis", tags=["Prompt Analysis"])

# Dependency Injection for the service
def get_analysis_service():
    return AnalysisService()

class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000, description="The LLM prompt to analyze")
    source: str = Field(default="Web UI", description="Origin of the prompt (e.g., API, Chatbot)")

@router.post("/analyze")
async def analyze_prompt(
    request: PromptRequest, 
    service: AnalysisService = Depends(get_analysis_service)
):
    """
    Passes the incoming prompt through the Hugging Face security pipeline.
    """
    try:
        logger.info(f"Analyzing prompt from source: {request.source}")
        result = await service.analyze_prompt(request.prompt, request.source)
        return result
    except Exception as e:
        logger.error(f"Error during prompt analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the prompt through the AI engine."
        )