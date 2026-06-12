from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.database import get_db
from app.models.non_negotiable_model import NonNegotiable
from app.models.user_model import User
from app.models.task_model import Task

from app.schemas.non_negotiable_schema import (NonNegotiableCreate)
from app.services.auth_service import (get_current_user)


from app.models.non_negotiable_log_model import (NonNegotiableLog)
from app.schemas.non_negotiable_log_schema import (NonNegotiableLogCreate)
from app.services.analytics_service import (calculate_current_streak, calculate_longest_streak, calculate_completion_rate, calculate_daily_win, calculate_daily_win_streak,calculate_weekly_win_rate, tasks_completed_this_week, non_negotiables_completed_this_week)
from app.services.non_negotiable_service import (get_user_non_negotiable)
from app.schemas.analytics_schema import (DailyWinResponse,DailyWinStreakResponse, WeeklySummaryResponse)

router = APIRouter()

@router.get("/non-negotiables")
def get_non_negotiables(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    non_negotiables = (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.user_id == current_user.id,
            NonNegotiable.is_active == True
        )
        .all()
    )

    result = []

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

        result.append(
            {
                "id": non_negotiable.id,
                "title": non_negotiable.title,
                "description": non_negotiable.description,
                "target_value": non_negotiable.target_value,
                "unit": non_negotiable.unit,
                "is_active": non_negotiable.is_active,

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
                    else 0
                )
            }
        )

    return result

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

@router.patch("/non-negotiables/{id}")
def update_non_negotiable(
    id: int,
    payload: NonNegotiableCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    non_negotiable = (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.id == id,
            NonNegotiable.user_id
            == current_user.id
        )
        .first()
    )

    if non_negotiable is None:
        raise HTTPException(
            status_code=404,
            detail="Non-negotiable not found"
        )

    non_negotiable.title = (
        payload.title
    )

    non_negotiable.description = (
        payload.description
    )

    non_negotiable.target_value = (
        payload.target_value
    )

    non_negotiable.unit = (
        payload.unit
    )

    db.commit()

    db.refresh(
        non_negotiable
    )

    return {
        "message":
        "Updated successfully"
    }

@router.post("/non-negotiables/{non_negotiable_id}/log")
def update_progress(
    non_negotiable_id: int,
    log: NonNegotiableLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    non_negotiable = get_user_non_negotiable(
        non_negotiable_id,
        current_user.id,
        db
    )

    if non_negotiable is None:
        raise HTTPException(
            status_code=404,
            detail="Non-negotiable not found"
        )

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

    if existing_log:

        existing_log.completed_value += (
            log.completed_value
        )

        existing_log.completed = (
            existing_log.completed_value
            >= non_negotiable.target_value
        )

        db.commit()

        db.refresh(existing_log)

        return {
            "message": "Progress updated",
            "completed_value":
            existing_log.completed_value,
            "completed":
            existing_log.completed
        }

    completed = (
        log.completed_value
        >= non_negotiable.target_value
    )

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
        "message": "Log created",
        "completed_value":
        new_log.completed_value,
        "completed":
        new_log.completed
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

@router.get("/non-negotiables/{non_negotiable_id}/summary")
def get_summary(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = get_user_non_negotiable(non_negotiable_id, current_user.id, db)

    if non_negotiable is None:
        raise HTTPException(
            status_code=404,
            detail="Non-negotiable not found"
        )

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

@router.get("/non-negotiables/{non_negotiable_id}/heatmap")
def get_heatmap(
    non_negotiable_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    non_negotiable = get_user_non_negotiable(
        non_negotiable_id,
        current_user.id,
        db
    )

    if non_negotiable is None:
        return {
            "message": "Non-negotiable not found"
        }

    logs = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id
        ).all()
    )

    log_map = {
        log.date: log.completed
        for log in logs
    }

    today = date.today()

    heatmap_data = []

    for i in range(27, -1, -1):

        current_day = (
            today - timedelta(days=i)
        )

        heatmap_data.append(
            {
                "date": current_day.isoformat(),
                "completed": log_map.get(
                    current_day,
                    False
                )
            }
        )
    print("NEW HEATMAP ENDPOINT RUNNING")
    return heatmap_data

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user )):
    non_negotiables = (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.user_id == current_user.id,
            NonNegotiable.is_active == True
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

        heatmap_logs = (
            db.query(NonNegotiableLog)
            .filter(
                NonNegotiableLog.non_negotiable_id
                == non_negotiable.id
            )
            .all()
        )

        log_map = {
            log.date: log.completed
            for log in heatmap_logs
        }

        heatmap = []

        for i in range(27, -1, -1):

            current_day = (
                date.today()
                - timedelta(days=i)
            )

            heatmap.append(
                log_map.get(
                    current_day,
                    False
                )
            )

        dashboard_data.append(
            {
                "id":
                non_negotiable.id,

                "title":
                non_negotiable.title,

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
                non_negotiable.unit,

                "heatmap":
                heatmap
            }
        )

    tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id
        )
        .all()
    )

    task_data = []

    for task in tasks:
        task_data.append(
            {
                "title": task.title,
                "priority": task.priority,
                "completed": task.completed,
                "due_date": task.due_date
            }
        )

    return {
        "non_negotiables": dashboard_data,
        "tasks": task_data
    }

@router.get("/daily-win", response_model=DailyWinResponse)
def get_daily_win(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {
        "daily_win": calculate_daily_win(
            current_user.id,
            date.today(),
            db
        )
    }

@router.get("/daily-win-streak", response_model=DailyWinStreakResponse)
def get_daily_win_streak(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {
        "daily_win_streak":
        calculate_daily_win_streak(
            current_user.id,
            db
        )
    }

@router.get("/weekly-summary", response_model=WeeklySummaryResponse)
def get_weekly_summary(db: Session = Depends(get_db),current_user: User = Depends(get_current_user)):

    active_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id,
            Task.completed == False
        )
        .count()
    )

    overdue_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id,
            Task.completed == False,
            Task.due_date < date.today()
        )
        .count()
    )

    return {
        "daily_win_streak":
        calculate_daily_win_streak(current_user.id, db),

        "weekly_win_rate":
        calculate_weekly_win_rate(
            current_user.id,
            db
        ),

        "tasks_completed_this_week":
        tasks_completed_this_week(
            current_user.id,
            db
        ),

        "non_negotiables_completed_this_week":
        non_negotiables_completed_this_week(
            current_user.id,
            db
        ),

        "active_tasks":
        active_tasks,

        "overdue_tasks":
        overdue_tasks
    }

@router.patch("/non-negotiables/{non_negotiable_id}/archive")
def archive_non_negotiable(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.id == non_negotiable_id,
            NonNegotiable.user_id == current_user.id
        )
        .first()
    )

    if non_negotiable is None:
        raise HTTPException(
            status_code=404,
            detail="Non-negotiable not found"
        )

    non_negotiable.is_active = False

    db.commit()

    db.refresh(non_negotiable)

    return {
        "message": "Non-negotiable archived"
    }

@router.get("/non-negotiables/archived")
def get_archived_non_negotiables(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.user_id == current_user.id,
            NonNegotiable.is_active == False
        )
        .all()
    )

@router.patch("/non-negotiables/{non_negotiable_id}/restore")
def restore_non_negotiable(non_negotiable_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    non_negotiable = (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.id == non_negotiable_id,
            NonNegotiable.user_id == current_user.id
        )
        .first()
    )

    if non_negotiable is None:
        raise HTTPException(
            status_code=404,
            detail="Non-negotiable not found"
        )

    non_negotiable.is_active = True

    db.commit()

    db.refresh(non_negotiable)

    return {
        "message": "Non-negotiable restored"
    }