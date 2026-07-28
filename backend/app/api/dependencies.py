from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db_session
from app.ai_engine.risk_engine import RiskEngine

# Instantiate the engine globally to keep ML models/weights loaded in memory
_risk_engine = RiskEngine()

def get_risk_engine() -> RiskEngine:
    """Dependency to inject the Risk Engine into API routes."""
    return _risk_engine