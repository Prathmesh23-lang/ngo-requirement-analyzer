from typing import Dict, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.ngo_request import NGORequest
from app.models.volunteer import Volunteer
from app.models.analysis_result import AnalysisResult
from app.models.recommendation import Recommendation
from app.schemas.dashboard import (
    DashboardStats,
    CategoryDistribution,
    UrgencyDistribution,
    SkillDemand
)
from app.schemas.ngo_request import NGORequestListItem

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Computes key performance indicators and analytics for the NGO Dashboard.
    """
    total_reqs = db.query(NGORequest).count()
    analyzed_reqs = db.query(NGORequest).filter(NGORequest.status == "Analyzed").count()
    total_recs = db.query(Recommendation).count()
    high_priority_reqs = db.query(NGORequest).filter(NGORequest.urgency == "High").count()

    total_vols = db.query(Volunteer).count()
    active_vols = db.query(Volunteer).filter(Volunteer.status == "Active").count()

    # Category breakdown
    cat_counts: Dict[str, int] = {}
    urgency_counts: Dict[str, int] = {"High": 0, "Medium": 0, "Low": 0}
    skill_counts: Dict[str, int] = {}

    all_requests = db.query(NGORequest).all()
    for req in all_requests:
        cat = req.category or "Other"
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
        
        urg = req.urgency or "Medium"
        urgency_counts[urg] = urgency_counts.get(urg, 0) + 1

    # Analysis results for skill frequencies
    all_analysis = db.query(AnalysisResult).all()
    for an in all_analysis:
        for skill in (an.extracted_skills or []):
            skill_counts[skill] = skill_counts.get(skill, 0) + 1

    # Format category distribution
    cat_dist: List[CategoryDistribution] = []
    for cat, cnt in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True):
        pct = round((cnt / total_reqs * 100), 1) if total_reqs > 0 else 0.0
        cat_dist.append(CategoryDistribution(category=cat, count=cnt, percentage=pct))

    # Format urgency distribution
    urg_dist: List[UrgencyDistribution] = []
    for urg in ["High", "Medium", "Low"]:
        cnt = urgency_counts.get(urg, 0)
        pct = round((cnt / total_reqs * 100), 1) if total_reqs > 0 else 0.0
        urg_dist.append(UrgencyDistribution(urgency=urg, count=cnt, percentage=pct))

    # Format top skills demanded
    top_skills: List[SkillDemand] = []
    for sk, cnt in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:8]:
        top_skills.append(SkillDemand(skill=sk, count=cnt))

    # Recent 5 requests
    recent_objs = db.query(NGORequest).order_by(desc(NGORequest.created_at)).limit(5).all()
    recent_items: List[NGORequestListItem] = []
    for req in recent_objs:
        rec_count = db.query(Recommendation).filter(Recommendation.request_id == req.id).count()
        recent_items.append(
            NGORequestListItem(
                id=req.id,
                ngo_name=req.ngo_name,
                ngo_email=req.ngo_email,
                location=req.location,
                title=req.title,
                volunteers_required=req.volunteers_required,
                duration=req.duration,
                expected_date=req.expected_date,
                availability=req.availability,
                urgency=req.urgency,
                category=req.category,
                subcategory=req.subcategory,
                status=req.status,
                created_at=req.created_at,
                recommended_count=rec_count
            )
        )

    return DashboardStats(
        total_requests=total_reqs,
        analyzed_requests=analyzed_reqs,
        volunteers_recommended=total_recs,
        high_priority_requests=high_priority_reqs,
        total_volunteers=total_vols,
        active_volunteers=active_vols,
        requests_by_category=cat_dist,
        requests_by_urgency=urg_dist,
        top_skills_demanded=top_skills,
        recent_requests=recent_items
    )
