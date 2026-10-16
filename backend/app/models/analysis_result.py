from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("ngo_requests.id"), nullable=False, unique=True)
    category = Column(String(100), nullable=False)
    subcategory = Column(String(100), nullable=True)
    extracted_skills = Column(JSON, default=list)      # ["Mathematics", "Teaching", "Computer Skills"]
    urgency = Column(String(50), nullable=False)       # Low, Medium, High
    urgency_reason = Column(Text, nullable=True)       # Why this urgency level was chosen
    category_confidence = Column(Float, default=1.0)   # 0.0 to 1.0
    summary = Column(Text, nullable=True)              # AI generated executive summary
    analysis_method = Column(String(100), default="Hybrid NLP Engine")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    request = relationship("NGORequest", back_populates="analysis")
