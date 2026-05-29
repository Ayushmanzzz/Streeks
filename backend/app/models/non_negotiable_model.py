from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
    DateTime
)
from sqlalchemy.sql import func

from app.database import Base

class NonNegotiable(Base):
    __tablename__ = "non_negotiables"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    target_value = Column(Integer, nullable=True)
    unit = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )