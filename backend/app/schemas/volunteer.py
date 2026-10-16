from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class VolunteerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = None
    location: str = Field(..., min_length=2)
    skills: List[str] = Field(default_factory=list)
    experience_years: float = Field(default=0.0, ge=0)
    availability: str = Field(default="Flexible")
    interests: List[str] = Field(default_factory=list)
    description: Optional[str] = None
    status: str = Field(default="Active")

class VolunteerCreate(VolunteerBase):
    pass

class VolunteerUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[float] = None
    availability: Optional[str] = None
    interests: Optional[List[str]] = None
    description: Optional[str] = None
    status: Optional[str] = None

class VolunteerResponse(VolunteerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
