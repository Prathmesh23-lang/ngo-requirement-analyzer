from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.schemas.volunteer import VolunteerResponse

class RecommendationResponse(BaseModel):
    id: Optional[int] = None
    request_id: Optional[int] = None
    volunteer_id: int
    match_score: float
    matched_skills: List[str] = []
    match_reasons: List[str] = []
    score_breakdown: Dict[str, Any] = {}
    rank: int = 1
    created_at: Optional[datetime] = None
    volunteer: Optional[VolunteerResponse] = None

    class Config:
        from_attributes = True
