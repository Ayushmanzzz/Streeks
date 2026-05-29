from fastapi import APIRouter

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.non_negotiable_model import NonNegotiable

router = APIRouter()

@router.get("/non-negotiables")
def get_non_negotiables(
    db: Session = Depends(get_db)
):
    non_negotiables = db.query(
        NonNegotiable
    ).all()

    return non_negotiables