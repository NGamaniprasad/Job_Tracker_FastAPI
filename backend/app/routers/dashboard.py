from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas, database

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"]
)

@router.get("/stats", response_model=schemas.DashboardStats)
def read_dashboard_stats(db: Session = Depends(database.get_db)):
    return crud.get_dashboard_stats(db=db)
