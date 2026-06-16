from fastapi import FastAPI

from app.database import Base, engine
from app.routers.non_negotiable_router import router as non_negotiable_router
from app.routers.auth_router import router as auth_router
from app.routers.task_router import router as task_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(non_negotiable_router)
app.include_router(task_router)

@app.get("/")
def root():
    with engine.connect() as connection:
        return {"message": "Backend connected"}