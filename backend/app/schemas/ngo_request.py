from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from app.schemas.analysis import AnalysisResultResponse
from app.schemas.recommendation import RecommendationResponse

class NGORequestCreate(BaseModel):
    ngo_name: str = Field(..., min_length=2, max_length=255)
    ngo_email: EmailStr
    location: str = Field(..., min_length=2, max_length=255)
    title: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=10)
    volunteers_required: int = Field(default=1, ge=1)
    duration: Optional[str] = "2 weeks"
    expected_date: Optional[str] = None
    availability: Optional[str] = "Weekends"  # Weekends, Weekdays, Flexible
    optional_skills: Optional[List[str]] = []
    urgency: Optional[str] = "Auto"           # Auto, Low, Medium, High

class NGORequestListItem(BaseModel):
    id: int
    ngo_name: str
    ngo_email: str
    location: str
    title: str
    volunteers_required: int
    duration: Optional[str] = None
    expected_date: Optional[str] = None
    availability: Optional[str] = None
    urgency: str
    category: Optional[str] = None
    subcategory: Optional[str] = None
    status: str
    created_at: datetime
    recommended_count: int = 0

    class Config:
        from_attributes = True

class NGORequestDetail(BaseModel):
    id: int
    ngo_name: str
    ngo_email: str
    location: str
    title: str
    description: str
    volunteers_required: int
    duration: Optional[str] = None
    expected_date: Optional[str] = None
    availability: Optional[str] = None
    urgency: str
    category: Optional[str] = None
    subcategory: Optional[str] = None
    status: str
    created_at: datetime
    analysis: Optional[AnalysisResultResponse] = None
    recommendations: List[RecommendationResponse] = []

    class Config:
        from_attributes = True

class DirectAnalysisRequest(BaseModel):
    title: str = "Requirement"
    description: str
    location: Optional[str] = "Pune"
    availability: Optional[str] = "Weekends"
    optional_skills: Optional[List[str]] = []
    urgency: Optional[str] = "Auto"
