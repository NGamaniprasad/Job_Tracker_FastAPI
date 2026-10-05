from sqlalchemy.orm import Session
from . import models, schemas
from datetime import date

def get_application(db: Session, application_id: int):
    return db.query(models.Application).filter(models.Application.id == application_id).first()

def get_applications(db: Session, skip: int = 0, limit: int = 100, search: str = None, status: str = None, sort: str = "newest"):
    from sqlalchemy import or_
    query = db.query(models.Application)
    if search:
        query = query.filter(
            or_(
                models.Application.company_name.ilike(f"%{search}%"),
                models.Application.job_role.ilike(f"%{search}%")
            )
        )
    if status:
        query = query.filter(models.Application.status == status)
        
    if sort == "oldest":
        query = query.order_by(models.Application.applied_date.asc())
    else:
        query = query.order_by(models.Application.applied_date.desc())
        
    return query.offset(skip).limit(limit).all()

def create_application(db: Session, application: schemas.ApplicationCreate):
    db_application = models.Application(**application.model_dump())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def update_application(db: Session, application_id: int, application: schemas.ApplicationUpdate):
    db_application = get_application(db, application_id)
    if db_application:
        update_data = application.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_application, key, value)
        db.commit()
        db.refresh(db_application)
    return db_application

def delete_application(db: Session, application_id: int):
    db_application = get_application(db, application_id)
    if db_application:
        db.delete(db_application)
        db.commit()
    return db_application

def get_dashboard_stats(db: Session):
    total = db.query(models.Application).count()
    applied = db.query(models.Application).filter(models.Application.status == "Applied").count()
    interview = db.query(models.Application).filter(models.Application.status == "Interview").count()
    selected = db.query(models.Application).filter(models.Application.status == "Selected").count()
    rejected = db.query(models.Application).filter(models.Application.status == "Rejected").count()
    today = db.query(models.Application).filter(models.Application.applied_date == date.today()).count()
    
    return {
        "total_applications": total,
        "applied": applied,
        "interview": interview,
        "selected": selected,
        "rejected": rejected,
        "applications_today": today
    }
