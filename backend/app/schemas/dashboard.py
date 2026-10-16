from typing import List, Dict, Any
from pydantic import BaseModel
from app.schemas.ngo_request import NGORequestListItem

class CategoryDistribution(BaseModel):
    category: str
    count: int
    percentage: float

class UrgencyDistribution(BaseModel):
    urgency: str
    count: int
    percentage: float

class SkillDemand(BaseModel):
    skill: str
    count: int

class DashboardStats(BaseModel):
    total_requests: int
    analyzed_requests: int
    volunteers_recommended: int
    high_priority_requests: int
    total_volunteers: int
    active_volunteers: int
    requests_by_category: List[CategoryDistribution]
    requests_by_urgency: List[UrgencyDistribution]
    top_skills_demanded: List[SkillDemand]
    recent_requests: List[NGORequestListItem]
