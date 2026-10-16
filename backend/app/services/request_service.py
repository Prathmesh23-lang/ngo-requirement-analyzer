from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.ngo_request import NGORequest
from app.models.volunteer import Volunteer
from app.models.analysis_result import AnalysisResult
from app.models.recommendation import Recommendation
from app.schemas.ngo_request import NGORequestCreate
from app.ai.analyzer import analyze_ngo_request
from app.services.matching_engine import rank_volunteers_for_request

async def process_and_save_request(
    db: Session,
    request_data: NGORequestCreate
) -> NGORequest:
    """
    Creates an NGO request, analyzes it via AI/NLP, finds and ranks matching volunteers,
    and stores all structured results and recommendations in the database.
    """
    # 1. Create base request
    ngo_req = NGORequest(
        ngo_name=request_data.ngo_name,
        ngo_email=request_data.ngo_email,
        location=request_data.location,
        title=request_data.title,
        description=request_data.description,
        volunteers_required=request_data.volunteers_required,
        duration=request_data.duration,
        expected_date=request_data.expected_date,
        availability=request_data.availability,
        urgency=request_data.urgency if request_data.urgency != "Auto" else "Medium",
        status="Pending"
    )
    db.add(ngo_req)
    db.commit()
    db.refresh(ngo_req)

    # 2. Run AI Analysis
    analysis_dict = await analyze_ngo_request(
        title=request_data.title,
        description=request_data.description,
        optional_skills=request_data.optional_skills,
        user_urgency=request_data.urgency
    )

    # 3. Update NGO request with categorized attributes
    ngo_req.category = analysis_dict["category"]
    ngo_req.subcategory = analysis_dict["subcategory"]
    ngo_req.urgency = analysis_dict["urgency"]
    ngo_req.status = "Analyzed"

    # 4. Save Analysis Result
    analysis_obj = AnalysisResult(
        request_id=ngo_req.id,
        category=analysis_dict["category"],
        subcategory=analysis_dict["subcategory"],
        extracted_skills=analysis_dict["extracted_skills"],
        urgency=analysis_dict["urgency"],
        urgency_reason=analysis_dict["urgency_reason"],
        category_confidence=analysis_dict["category_confidence"],
        summary=analysis_dict["summary"],
        analysis_method=analysis_dict["analysis_method"]
    )
    db.add(analysis_obj)
    db.commit()

    # 5. Fetch all active volunteers for matching
    volunteers = db.query(Volunteer).filter(Volunteer.status == "Active").all()

    # 6. Run Matching Engine
    ranked_matches = rank_volunteers_for_request(
        request=ngo_req,
        extracted_skills=analysis_dict["extracted_skills"],
        volunteers=volunteers
    )

    # 7. Store Recommendations (Top 10 recommended volunteers)
    for rank_idx, match in enumerate(ranked_matches[:10], start=1):
        rec = Recommendation(
            request_id=ngo_req.id,
            volunteer_id=match["volunteer_id"],
            match_score=match["match_score"],
            matched_skills=match["matched_skills"],
            match_reasons=match["match_reasons"],
            score_breakdown=match["score_breakdown"],
            rank=rank_idx
        )
        db.add(rec)

    db.commit()
    db.refresh(ngo_req)
    return ngo_req

async def reanalyze_request(db: Session, request_id: int) -> NGORequest:
    """
    Re-runs AI analysis and matching for an existing request.
    """
    ngo_req = db.query(NGORequest).filter(NGORequest.id == request_id).first()
    if not ngo_req:
        return None

    # Delete existing analysis and recommendations
    db.query(AnalysisResult).filter(AnalysisResult.request_id == request_id).delete()
    db.query(Recommendation).filter(Recommendation.request_id == request_id).delete()
    db.commit()

    # Re-run AI analysis
    analysis_dict = await analyze_ngo_request(
        title=ngo_req.title,
        description=ngo_req.description,
        user_urgency=ngo_req.urgency
    )

    ngo_req.category = analysis_dict["category"]
    ngo_req.subcategory = analysis_dict["subcategory"]
    ngo_req.urgency = analysis_dict["urgency"]
    ngo_req.status = "Analyzed"

    analysis_obj = AnalysisResult(
        request_id=ngo_req.id,
        category=analysis_dict["category"],
        subcategory=analysis_dict["subcategory"],
        extracted_skills=analysis_dict["extracted_skills"],
        urgency=analysis_dict["urgency"],
        urgency_reason=analysis_dict["urgency_reason"],
        category_confidence=analysis_dict["category_confidence"],
        summary=analysis_dict["summary"],
        analysis_method=analysis_dict["analysis_method"]
    )
    db.add(analysis_obj)
    db.commit()

    volunteers = db.query(Volunteer).filter(Volunteer.status == "Active").all()
    ranked_matches = rank_volunteers_for_request(
        request=ngo_req,
        extracted_skills=analysis_dict["extracted_skills"],
        volunteers=volunteers
    )

    for rank_idx, match in enumerate(ranked_matches[:10], start=1):
        rec = Recommendation(
            request_id=ngo_req.id,
            volunteer_id=match["volunteer_id"],
            match_score=match["match_score"],
            matched_skills=match["matched_skills"],
            match_reasons=match["match_reasons"],
            score_breakdown=match["score_breakdown"],
            rank=rank_idx
        )
        db.add(rec)

    db.commit()
    db.refresh(ngo_req)
    return ngo_req
