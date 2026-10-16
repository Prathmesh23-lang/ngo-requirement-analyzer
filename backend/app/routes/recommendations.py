from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ngo_request import NGORequest
from app.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationResponse

router = APIRouter(prefix="/api/requests", tags=["Recommendations"])

@router.get("/{request_id}/recommendations", response_model=List[RecommendationResponse])
def get_recommendations_for_request(
    request_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieves ranked volunteer recommendations for a specific NGO request.
    """
    req = db.query(NGORequest).filter(NGORequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="NGO Request not found.")

    recs = db.query(Recommendation).filter(Recommendation.request_id == request_id).order_by(Recommendation.rank).all()
    return recs
