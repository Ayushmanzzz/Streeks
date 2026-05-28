from fastapi import FastAPI
from app.database import engine

app = FastAPI()

@app.get("/")
def root():
    with engine.connect() as connection:
        return {"message": "Database connected"}