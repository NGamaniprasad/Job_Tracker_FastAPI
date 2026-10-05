from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class ApplicationBase(BaseModel):
    company_name: str
    job_role: str
    applied_date: date
    location: Optional[str] = None
    source: Optional[str] = None
    status: str = "Applied"
    job_url: Optional[str] = None
    notes: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_applications: int
    applied: int
    interview: int
    selected: int
    rejected: int
    applications_today: int
