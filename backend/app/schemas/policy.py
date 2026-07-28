from pydantic import BaseModel
from typing import List, Optional

class PolicyBase(BaseModel):
    key: str
    name: str
    description: Optional[str] = None
    action: str
    category: str
    enabled: bool

class PolicyResponse(PolicyBase):
    id: int

    class Config:
        from_attributes = True

class PolicyUpdateRequest(BaseModel):
    policies: List[PolicyBase]