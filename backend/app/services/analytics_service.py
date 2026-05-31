from datetime import date, timedelta
from sqlalchemy.orm import Session

from app.models.non_negotiable_model import NonNegotiable
from app.models.task_model import Task

from app.models.non_negotiable_log_model import (
    NonNegotiableLog
)

def calculate_current_streak(non_negotiable_id, db:Session)-> int:
    logs = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id,
            NonNegotiableLog.completed == True
        )
        .order_by(
            NonNegotiableLog.date.desc()
        )
        .all()
    )

    if not logs:
        return 0

    today = date.today()

    latest_log_date = logs[0].date

    if latest_log_date == today:
        expected_date = today

    elif latest_log_date == today - timedelta(days=1):
        expected_date = latest_log_date

    else:
        return 0

    streak = 0

    for log in logs:

        if log.date == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)

        else:
            break

    return streak

def calculate_longest_streak(non_negotiable_id, db:Session)-> int:
    logs = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id,
            NonNegotiableLog.completed == True
        )
        .order_by(
            NonNegotiableLog.date.asc()
        )
        .all()
    )

    if not logs:
        return 0

    current_streak = 1
    longest_streak = 1

    for i in range(1, len(logs)):

        previous_date = logs[i - 1].date
        current_date = logs[i].date

        if current_date == previous_date + timedelta(days=1):

            current_streak += 1

        else:

            current_streak = 1

        longest_streak = max(
            longest_streak,
            current_streak
        )
    return longest_streak

def calculate_completion_rate(non_negotiable_id: int, created_date, db:Session) -> float:

    completed_days = (
        db.query(NonNegotiableLog)
        .filter(
            NonNegotiableLog.non_negotiable_id
            == non_negotiable_id,
            NonNegotiableLog.completed == True
        )
        .count()
    )

    today = date.today()

    total_days = (
        (today - created_date).days
    ) + 1

    completion_rate = (
        completed_days / total_days
    ) * 100

    return round(completion_rate, 2)

def calculate_daily_win(user_id: int, target_date: date, db: Session) -> bool:

    today = target_date

    non_negotiables = (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.user_id == user_id,
            NonNegotiable.is_active == True
        )
        .all()
    )

    for non_negotiable in non_negotiables:

        today_log = (
            db.query(NonNegotiableLog)
            .filter(
                NonNegotiableLog.non_negotiable_id
                == non_negotiable.id,
                NonNegotiableLog.date == today,
                NonNegotiableLog.completed == True
            )
            .first()
        )

        if today_log is None:
            return False

    due_tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.due_date == today
        )
        .all()
    )

    for task in due_tasks:

        if not task.completed:
            return False

    return True

def calculate_daily_win_streak(user_id: int, db: Session) -> int:

    streak = 0

    current_date = date.today()

    while True:

        if calculate_daily_win(
            user_id,
            current_date,
            db
        ):
            streak += 1
            current_date -= timedelta(days=1)

        else:
            break

    return streak