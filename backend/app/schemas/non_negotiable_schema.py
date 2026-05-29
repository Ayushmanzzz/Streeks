from pydantic import BaseModel


class NonNegotiableCreate(BaseModel):
    title: str
    description: str | None = None
    target_value: int | None = None
    unit: str | None = None