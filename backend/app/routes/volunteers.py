from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.volunteer import Volunteer
from app.schemas.volunteer import (
    VolunteerCreate,
    VolunteerUpdate,
    VolunteerResponse
)

router = APIRouter(prefix="/api/volunteers", tags=["Volunteers"])

@router.get("", response_model=List[VolunteerResponse])
def list_volunteers(
    skill: Optional[str] = Query(None, description="Filter by specific skill"),
    location: Optional[str] = Query(None, description="Filter by location/city"),
    availability: Optional[str] = Query(None, description="Filter by availability"),
    min_exp: Optional[float] = Query(None, description="Minimum years of experience"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    db: Session = Depends(get_db)
):
    """
    Lists volunteers from the database with flexible filtering by skill, city, availability, experience, or name search.
    """
    query = db.query(Volunteer)

    if location and location != "All":
        query = query.filter(Volunteer.location.ilike(f"%{location.strip()}%"))

    if availability and availability != "All":
        query = query.filter(Volunteer.availability.ilike(f"%{availability.strip()}%"))

    if min_exp is not None:
        query = query.filter(Volunteer.experience_years >= min_exp)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter((Volunteer.name.ilike(term)) | (Volunteer.email.ilike(term)))

    volunteers = query.order_by(Volunteer.name).all()

    # Skill filter (JSON array check)
    if skill and skill != "All":
        target = skill.strip().lower()
        filtered = []
        for v in volunteers:
            v_skills = [s.lower() for s in (v.skills or [])]
            if any(target in s for s in v_skills):
                filtered.append(v)
        return filtered

    return volunteers

@router.get("/{volunteer_id}", response_model=VolunteerResponse)
def get_volunteer(
    volunteer_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieves full profile of a volunteer by ID.
    """
    vol = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found.")
    return vol

@router.post("", response_model=VolunteerResponse, status_code=status.HTTP_201_CREATED)
def create_volunteer(
    payload: VolunteerCreate,
    db: Session = Depends(get_db)
):
    """
    Registers a new volunteer in the database.
    """
    existing = db.query(Volunteer).filter(Volunteer.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="A volunteer with this email address already exists.")

    vol = Volunteer(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        location=payload.location,
        skills=payload.skills,
        experience_years=payload.experience_years,
        availability=payload.availability,
        interests=payload.interests,
        description=payload.description,
        status=payload.status or "Active"
    )
    db.add(vol)
    db.commit()
    db.refresh(vol)
    return vol

@router.put("/{volunteer_id}", response_model=VolunteerResponse)
def update_volunteer(
    volunteer_id: int,
    payload: VolunteerUpdate,
    db: Session = Depends(get_db)
):
    """
    Updates an existing volunteer profile.
    """
    vol = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found.")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(vol, field, val)

    db.commit()
    db.refresh(vol)
    return vol

@router.delete("/{volunteer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_volunteer(
    volunteer_id: int,
    db: Session = Depends(get_db)
):
    """
    Deletes a volunteer from the system.
    """
    vol = db.query(Volunteer).filter(Volunteer.id == volunteer_id).first()
    if not vol:
        raise HTTPException(status_code=404, detail="Volunteer not found.")
    db.delete(vol)
    db.commit()
    return None
