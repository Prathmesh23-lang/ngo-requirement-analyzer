from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class AnalysisResultResponse(BaseModel):
    id: Optional[int] = None
    request_id: Optional[int] = None
    category: str
    subcategory: Optional[str] = None
    extracted_skills: List[str] = []
    urgency: str
    urgency_reason: Optional[str] = None
    category_confidence: float = 1.0
    summary: Optional[str] = None
    analysis_method: str = "Hybrid NLP Engine"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ScoreBreakdown(BaseModel):
    skill_score: float = 0.0
    location_score: float = 0.0
    availability_score: float = 0.0
    experience_score: float = 0.0
    interest_score: float = 0.0
    total_score: float = 0.0
