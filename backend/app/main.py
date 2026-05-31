from fastapi import FastAPI

from app.database import Base, engine
from app.models.user_model import User
from app.models.non_negotiable_model import NonNegotiable
from app.models.non_negotiable_log_model import NonNegotiableLog
from app.routers.non_negotiable_router import router as non_negotiable_router
from app.routers.auth_router import router as auth_router
from app.models.task_model import Task
from app.routers.task_router import router as task_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(non_negotiable_router)
app.include_router(task_router)

@app.get("/")
def root():
    with engine.connect() as connection:
        return {"message": "Backend connected"}