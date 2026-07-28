from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas.policy import PolicyResponse, PolicyUpdateRequest
from app.repositories.policy_repository import PolicyRepository

router = APIRouter()

@router.get("/", response_model=List[PolicyResponse])
def get_policies(db: Session = Depends(get_db)):
    """
    Retrieve all security policy configurations.
    """
    repo = PolicyRepository(db)
    return repo.get_all_policies()


@router.put("/", response_model=List[PolicyResponse])
def update_policies(payload: PolicyUpdateRequest, db: Session = Depends(get_db)):
    """
    Bulk update policy configuration toggles.
    """
    try:
        repo = PolicyRepository(db)
        return repo.update_policies(payload.policies)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update policies: {str(e)}")