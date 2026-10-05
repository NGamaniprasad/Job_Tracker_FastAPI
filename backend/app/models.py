from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255), index=True, nullable=False)
    job_role = Column(String(255), index=True, nullable=False)
    applied_date = Column(Date, nullable=False)
    location = Column(String(255), nullable=True)
    source = Column(String(100), nullable=True)
    status = Column(String(50), default="Applied", nullable=False)
    job_url = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
