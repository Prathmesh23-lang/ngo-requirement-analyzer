from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(50), nullable=True)
    location = Column(String(255), nullable=False, index=True)
    skills = Column(JSON, default=list)             # List of skills: ["Mathematics", "Teaching"]
    experience_years = Column(Float, default=0.0)    # e.g., 2.5 years
    availability = Column(String(100), default="Flexible")  # Weekends, Weekdays, Flexible
    interests = Column(JSON, default=list)          # List of domains: ["Education", "Community Service"]
    description = Column(Text, nullable=True)       # Short bio
    status = Column(String(50), default="Active")   # Active, Inactive, Assigned
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    recommendations = relationship("Recommendation", back_populates="volunteer", cascade="all, delete-orphan")
