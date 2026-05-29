from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.database import get_db
from app.models.non_negotiable_model import NonNegotiable
from app.models.user_model import User

from app.schemas.non_negotiable_schema import (NonNegotiableCreate)
from app.services.auth_service import (get_current_user)


from app.models.non_negotiable_log_model import (NonNegotiableLog)

from app.schemas.non_negotiable_log_schema import (NonNegotiableLogCreate)

router = APIRouter()

@router.get("/non-negotiables")
def get_non_negotiables(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.user_id == current_user.id
        )
        .all()
    )

@router.post("/non-negotiables")
def create_non_negotiable(non_negotiable: NonNegotiableCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_non_negotiable = NonNegotiable(
        user_id=current_user.id,
        title=non_negotiable.title,
        description=non_negotiable.description,
        target_value=non_negotiable.target_value,
        unit=non_negotiable.unit
    )

    db.add(new_non_negotiable)

    db.commit()

    db.refresh(new_non_negotiable)

    return {
        "message": "Non-negotiable created",
        "id": new_non_negotiable.id
    }

@router.post("/non-negotiables/{non_negotiable_id}/log")
def update_progress(
    non_negotiable_id: int,
    log: NonNegotiableLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    
    non_negotiable = (
    db.query(NonNegotiable)
    .filter(
        NonNegotiable.id == non_negotiable_id,
        NonNegotiable.user_id == current_user.id
    )
        .first()
    )

    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    today = date.today()

    existing_log = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id,
            NonNegotiableLog.date == today
        )
        .first()
    )

    completed = False

    if (
        non_negotiable.target_value is not None
        and log.completed_value is not None
    ):
        completed = (
            log.completed_value
            >= non_negotiable.target_value
        )

    if existing_log:
        existing_log.completed_value = (
            log.completed_value
        )

        existing_log.completed = completed

        db.commit()

        db.refresh(existing_log)

        return {
            "message": "Progress updated"
        }

    new_log = NonNegotiableLog(
        non_negotiable_id=non_negotiable_id,
        date=today,
        completed=completed,
        completed_value=log.completed_value
    )

    db.add(new_log)

    db.commit()

    db.refresh(new_log)

    return {
        "message": "Log created"
    }