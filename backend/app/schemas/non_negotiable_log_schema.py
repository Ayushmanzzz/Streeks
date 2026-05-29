from pydantic import BaseModel


class NonNegotiableLogCreate(BaseModel):
    completed_value: int | None = None