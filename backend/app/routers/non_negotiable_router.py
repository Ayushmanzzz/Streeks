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
from app.services.analytics_service import (calculate_current_streak, calculate_longest_streak, calculate_completion_rate)
from app.services.non_negotiable_service import (get_user_non_negotiable)
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
    
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)

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

@router.get("/non-negotiables/{non_negotiable_id}/logs")
def get_logs(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)

    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    logs = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id
        )
        .order_by(
            NonNegotiableLog.date.desc()
        )
        .all()
    )

    return logs

@router.get("/non-negotiables/{non_negotiable_id}/streak")
def get_streak(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)

    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    streak = calculate_current_streak(non_negotiable_id, db)

    return {
        "current_streak": streak
    }

@router.get("/non-negotiables/{non_negotiable_id}/longest-streak")
def get_longest_streak(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)


    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    longest_streak = calculate_longest_streak(non_negotiable_id, db)

    return {
        "longest_streak": longest_streak
    }

@router.get("/non-negotiables/{non_negotiable_id}/completion-rate")
def get_completion_rate(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)


    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    completion_rate = calculate_completion_rate(non_negotiable_id, non_negotiable.created_at.date(), db)
    return {
        "completion_rate": completion_rate
    }

@router.get(
    "/non-negotiables/{non_negotiable_id}/summary"
)
def get_summary(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)


    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    today_log = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id,
            NonNegotiableLog.date == date.today()
        )
        .first()
    )

    return {
        "title": non_negotiable.title,
        "current_streak": calculate_current_streak(
            non_negotiable_id,
            db
        ),
        "longest_streak": calculate_longest_streak(
            non_negotiable_id,
            db
        ),
        "completion_rate": calculate_completion_rate(
            non_negotiable_id,
            non_negotiable.created_at.date(),
            db
        ),
        "target_value": non_negotiable.target_value,
        "unit": non_negotiable.unit,
        "today_completed": (
            today_log.completed
            if today_log
            else False
        ),
        "today_progress": (
            today_log.completed_value
            if today_log
            else None
        )
    }

@router.get(
    "/non-negotiables/{non_negotiable_id}/heatmap"
)
def get_heatmap(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)


    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    logs = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id
        )
        .order_by(
            NonNegotiableLog.date.asc()
        )
        .all()
    )

    heatmap_data = []

    for log in logs:
        heatmap_data.append(
            {
                "date": log.date,
                "completed": log.completed
            }
        )

    return heatmap_data

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user )):
    non_negotiables = (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.user_id == current_user.id
        )
        .all()
    )

    dashboard_data = []

    for non_negotiable in non_negotiables:

        today_log = (
            db.query(NonNegotiableLog)
            .filter(
                NonNegotiableLog.non_negotiable_id
                == non_negotiable.id,
                NonNegotiableLog.date == date.today()
            )
            .first()
        )

        dashboard_data.append(
            {
                "title": non_negotiable.title,

                "current_streak":
                calculate_current_streak(
                    non_negotiable.id,
                    db
                ),

                "longest_streak":
                calculate_longest_streak(
                    non_negotiable.id,
                    db
                ),

                "completion_rate":
                calculate_completion_rate(
                    non_negotiable.id,
                    non_negotiable.created_at.date(),
                    db
                ),

                "today_completed":
                (
                    today_log.completed
                    if today_log
                    else False
                ),

                "today_progress":
                (
                    today_log.completed_value
                    if today_log
                    else None
                ),

                "target_value":
                non_negotiable.target_value,

                "unit":
                non_negotiable.unit
            }
        )

    return dashboard_data