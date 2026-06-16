from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from datetime import date
from fastapi import Query

from app.database import get_db

from app.models.task_model import Task
from app.models.user_model import User

from app.schemas.task_schema import TaskCreate

from app.services.auth_service import (get_current_user)
from app.schemas.task_schema import (TaskUpdate)

router = APIRouter()

@router.post("/tasks")
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_task = Task(
        user_id=current_user.id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        due_date=task.due_date
    )

    db.add(new_task)

    db.commit()

    db.refresh(new_task)

    return {
        "message": "Task created",
        "id": new_task.id
    }

@router.get("/tasks")
def get_tasks(status: str | None = Query(default=None), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = (
        db.query(Task)
        .filter(
            Task.user_id == current_user.id
        )
    )

    if status == "pending":
        query = query.filter(
            Task.completed == False
        )

    elif status == "completed":
        query = query.filter(
            Task.completed == True
        )

    elif status == "overdue":
        query = query.filter(
            Task.completed == False,
            Task.due_date < date.today()
        )

    return query.all()

@router.patch("/tasks/{task_id}")
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == current_user.id
        )
        .first()
    )
    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    update_data = task_update.model_dump(
        exclude_unset=True
    )

    if "completed" in update_data:

        if update_data["completed"]:
            task.completed_at = date.today()

        else:
            task.completed_at = None

    for field, value in update_data.items():
        setattr(
            task,
            field,
            value
        )

    db.commit()

    db.refresh(task)

    return {
        "message": "Task updated"
    }

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == current_user.id
        )
        .first()
    )

    if task is None:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)

    db.commit()

    return {
        "message": "Task deleted"
    }