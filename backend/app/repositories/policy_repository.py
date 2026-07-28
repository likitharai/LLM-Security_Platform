from typing import List
from sqlalchemy.orm import Session
from app.db.models.policy import Policy
from app.schemas.policy import PolicyBase

class PolicyRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_policies(self) -> List[Policy]:
        return self.db.query(Policy).all()

    def update_policies(self, updated_policies: List[PolicyBase]) -> List[Policy]:
        for policy_data in updated_policies:
            db_policy = self.db.query(Policy).filter(Policy.key == policy_data.key).first()
            if db_policy:
                db_policy.enabled = policy_data.enabled
                db_policy.name = policy_data.name
                db_policy.description = policy_data.description
                db_policy.action = policy_data.action
                db_policy.category = policy_data.category
            else:
                # Seed policy if it doesn't exist yet
                new_policy = Policy(
                    key=policy_data.key,
                    name=policy_data.name,
                    description=policy_data.description,
                    action=policy_data.action,
                    category=policy_data.category,
                    enabled=policy_data.enabled
                )
                self.db.add(new_policy)
        
        self.db.commit()
        return self.get_all_policies()