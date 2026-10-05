from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, database

router = APIRouter(
    prefix="/api/applications",
    tags=["applications"]
)

@router.post("", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(database.get_db)):
    return crud.create_application(db=db, application=application)

@router.get("", response_model=List[schemas.ApplicationResponse])
def read_applications(
    skip: int = 0, limit: int = 100,
    search: Optional[str] = None,
    status: Optional[str] = None,
    sort: Optional[str] = "newest",
    db: Session = Depends(database.get_db)
):
    applications = crud.get_applications(db, skip=skip, limit=limit, search=search, status=status, sort=sort)
    return applications

@router.get("/{application_id}", response_model=schemas.ApplicationResponse)
def read_application(application_id: int, db: Session = Depends(database.get_db)):
    db_application = crud.get_application(db, application_id=application_id)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application

@router.put("/{application_id}", response_model=schemas.ApplicationResponse)
def update_application(application_id: int, application: schemas.ApplicationUpdate, db: Session = Depends(database.get_db)):
    db_application = crud.update_application(db, application_id=application_id, application=application)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application

@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(database.get_db)):
    db_application = crud.delete_application(db, application_id=application_id)
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return None
