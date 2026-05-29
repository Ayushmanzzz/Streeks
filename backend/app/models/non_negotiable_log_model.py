from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    UniqueConstraint
)
from sqlalchemy.sql import func

from app.database import Base


class NonNegotiableLog(Base):
    __tablename__ = "non_negotiable_logs"

    id = Column(Integer, primary_key=True, index=True)

    non_negotiable_id = Column(
        Integer,
        ForeignKey("non_negotiables.id"),
        nullable=False
    )

    date = Column(
        Date,
        nullable=False
    )

    completed = Column(
        Boolean,
        default=False
    )

    completed_value = Column(
        Integer,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    __table_args__ = (
        UniqueConstraint(
            "non_negotiable_id",
            "date",
            name="unique_non_negotiable_per_day"
        ),
    )