from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.ngo_request import NGORequest
from app.models.analysis_result import AnalysisResult
from app.models.recommendation import Recommendation
from app.schemas.ngo_request import (
    NGORequestCreate,
    NGORequestDetail,
    NGORequestListItem,
    DirectAnalysisRequest
)
from app.schemas.analysis import AnalysisResultResponse
from app.services.request_service import process_and_save_request, reanalyze_request
from app.ai.analyzer import analyze_ngo_request

router = APIRouter(prefix="/api/requests", tags=["NGO Requests"])

@router.post("", response_model=NGORequestDetail, status_code=status.HTTP_201_CREATED)
async def create_request(
    request_data: NGORequestCreate,
    db: Session = Depends(get_db)
):
    """
    Submits a new NGO request, triggers automatic AI analysis (categorization, skill extraction, urgency),
    matches against the volunteer database, and returns the full analyzed result with ranked recommendations.
    """
    if not request_data.description.strip():
        raise HTTPException(status_code=400, detail="Requirement description cannot be empty.")
    
    try:
        created_request = await process_and_save_request(db, request_data)
        return created_request
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to process NGO request: {str(e)}")

@router.get("", response_model=List[NGORequestListItem])
def list_requests(
    category: Optional[str] = Query(None, description="Filter by category"),
    urgency: Optional[str] = Query(None, description="Filter by urgency"),
    search: Optional[str] = Query(None, description="Search in title or NGO name"),
    db: Session = Depends(get_db)
):
    """
    Retrieves all submitted NGO requests with optional category, urgency, and text search filters.
    """
    query = db.query(NGORequest).order_by(desc(NGORequest.created_at))

    if category and category != "All":
        query = query.filter(NGORequest.category == category)
    if urgency and urgency != "All":
        query = query.filter(NGORequest.urgency == urgency)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter((NGORequest.title.ilike(term)) | (NGORequest.ngo_name.ilike(term)))

    requests = query.all()
    
    # Calculate recommended count for each
    result_list = []
    for req in requests:
        rec_count = db.query(Recommendation).filter(Recommendation.request_id == req.id).count()
        item = NGORequestListItem(
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
        result_list.append(item)

    return result_list

@router.get("/{request_id}", response_model=NGORequestDetail)
def get_request_detail(
    request_id: int,
    db: Session = Depends(get_db)
):
    """
    Fetches a specific NGO request including its complete AI analysis breakdown and ranked volunteer recommendations.
    """
    req = db.query(NGORequest).filter(NGORequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="NGO Request not found.")
    return req

@router.post("/{request_id}/analyze", response_model=NGORequestDetail)
async def trigger_reanalysis(
    request_id: int,
    db: Session = Depends(get_db)
):
    """
    Triggers re-analysis and volunteer re-matching for an existing request.
    """
    updated_req = await reanalyze_request(db, request_id)
    if not updated_req:
        raise HTTPException(status_code=404, detail="NGO Request not found.")
    return updated_req

@router.post("/analyze-preview", response_model=AnalysisResultResponse)
async def preview_analysis(
    payload: DirectAnalysisRequest
):
    """
    Provides real-time AI analysis preview of a natural language description without storing in database.
    """
    if not payload.description.strip():
        raise HTTPException(status_code=400, detail="Requirement description is required for analysis.")

    result = await analyze_ngo_request(
        title=payload.title,
        description=payload.description,
        optional_skills=payload.optional_skills,
        user_urgency=payload.urgency
    )
    return result

@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    """
    Deletes an NGO request and associated analysis/recommendation records.
    """
    req = db.query(NGORequest).filter(NGORequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="NGO Request not found.")
    db.delete(req)
    db.commit()
    return None
