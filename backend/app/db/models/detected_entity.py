import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base
from app.core.constants import EntityType

class DetectedEntity(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("prompt_analysis.id", ondelete="CASCADE"), nullable=False)
    
    entity_type = Column(String, nullable=False, index=True) # e.g., SSN, EMAIL
    value = Column(String, nullable=False) # The actual detected string
    start_char = Column(Integer, nullable=False)
    end_char = Column(Integer, nullable=False)
    confidence_score = Column(Float, nullable=False)
    
    # Relationships
    analysis = relationship("PromptAnalysis", back_populates="detected_entities")