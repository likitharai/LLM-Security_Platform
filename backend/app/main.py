from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import router as api_v1_router
from app.core.config import settings

app = FastAPI(
    title="LLM Security Platform API",
    version="1.0.0",
    description="Backend API for prompt threat detection, PHI masking, and policy enforcement."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router.router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "llm-security-backend"}