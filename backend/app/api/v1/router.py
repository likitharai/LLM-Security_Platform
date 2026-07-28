from fastapi import APIRouter
from app.api.v1 import analysis, health

api_router = APIRouter()
from fastapi import APIRouter
from app.api.v1 import policies, analysis, logs

api_router = APIRouter()
api_router.include_router(policies.router, prefix="/policies", tags=["Policies"])
# Include sub-routers here as we build them
api_router.include_router(analysis.router, prefix="/analysis", tags=["Security Analysis"])
# api_router.include_router(health.router, prefix="/health", tags=["System Health"])