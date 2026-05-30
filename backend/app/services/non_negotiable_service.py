from app.models.non_negotiable_model import (NonNegotiable)
from sqlalchemy.orm import Session

def get_user_non_negotiable(non_negotiable_id: int, user_id: int, db: Session):
    return (
        db.query(NonNegotiable)
        .filter(
            NonNegotiable.id == non_negotiable_id,
            NonNegotiable.user_id == user_id
        )
        .first()
    )