from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class NGORequest(Base):
    __tablename__ = "ngo_requests"

    id = Column(Integer, primary_key=True, index=True)
    ngo_name = Column(String(255), nullable=False, index=True)
    ngo_email = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    volunteers_required = Column(Integer, default=1)
    duration = Column(String(100), nullable=True)
    expected_date = Column(String(100), nullable=True)
    availability = Column(String(100), nullable=True)  # Weekends, Weekdays, Flexible
    urgency = Column(String(50), default="Medium")     # Low, Medium, High
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    status = Column(String(50), default="Analyzed")    # Pending, Analyzed, Completed
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    analysis = relationship("AnalysisResult", back_populates="request", uselist=False, cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="request", cascade="all, delete-orphan", order_by="Recommendation.rank")
