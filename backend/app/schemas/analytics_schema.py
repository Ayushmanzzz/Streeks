from pydantic import BaseModel


class DailyWinResponse(BaseModel):
    daily_win: bool | None


class DailyWinStreakResponse(BaseModel):
    daily_win_streak: int

class WeeklySummaryResponse(BaseModel):
    daily_win_streak: int
    weekly_win_rate: float
    tasks_completed_this_week: int
    non_negotiables_completed_this_week: int

    active_tasks: int
    overdue_tasks: int