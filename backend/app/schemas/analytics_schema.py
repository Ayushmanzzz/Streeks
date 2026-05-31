from pydantic import BaseModel


class DailyWinResponse(BaseModel):
    daily_win: bool


class DailyWinStreakResponse(BaseModel):
    daily_win_streak: int