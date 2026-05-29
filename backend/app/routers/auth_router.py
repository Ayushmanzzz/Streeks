from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.user_schema import UserCreate
from app.models.user_model import User
from app.utils.security import hash_password
from app.schemas.user_schema import (UserCreate, UserLogin)
from app.utils.security import (hash_password, verify_password)
from app.utils.token import create_access_token

router = APIRouter()

@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(
        user.password
    )

    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created"
    }

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        return {
            "message": "Invalid email or password"
        }

    if not verify_password(
        user.password,
        existing_user.password_hash
    ):
        return {
            "message": "Invalid email or password"
        }

    access_token = create_access_token(
    {
        "sub": existing_user.email
    }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }