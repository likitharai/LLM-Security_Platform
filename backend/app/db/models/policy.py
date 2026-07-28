from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base # Adjust this import based on your DB setup

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    # The unique key matching the frontend state (e.g., 'phiMasking', 'promptInjection')
    key = Column(String, unique=True, index=True, nullable=False) 
    
    # Display and metadata
    name = Column(String, nullable=False)
    description = Column(String)
    action = Column(String, nullable=False)   # 'BLOCK', 'MASK', 'LOG'
    category = Column(String, nullable=False) # 'privacy', 'security', 'content'
    
    # The actual toggle state
    enabled = Column(Boolean, default=True, nullable=False)