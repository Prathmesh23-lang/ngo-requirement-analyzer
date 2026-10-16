from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("ngo_requests.id"), nullable=False, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"), nullable=False, index=True)
    match_score = Column(Float, nullable=False)        # 0.0 - 100.0
    matched_skills = Column(JSON, default=list)        # ["Mathematics", "Teaching"]
    match_reasons = Column(JSON, default=list)         # List of explainable bullet reasons
    score_breakdown = Column(JSON, default=dict)       # Details of scoring component points
    rank = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    request = relationship("NGORequest", back_populates="recommendations")
    volunteer = relationship("Volunteer", back_populates="recommendations")
