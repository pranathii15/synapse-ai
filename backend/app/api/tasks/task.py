from fastapi import APIRouter, Depends
from datetime import datetime
from bson import ObjectId
from fastapi import Query

from app.schemas.task_schema import TaskStatus
from app.schemas.task_schema import AssignTask
from app.schemas.task_schema import TaskUpdate
from app.schemas.task_schema import TaskCreate
from app.services.task_service import task_collection
from app.api.auth.dependencies import get_current_user

router = APIRouter(tags=["Tasks"])


@router.post("/tasks")
def create_task(
    task: TaskCreate,
    current_user=Depends(get_current_user)
):

    task_data = {
        "title": task.title,
        "description": task.description,
        "project_id": task.project_id,
        "owner": current_user["sub"],
        "status": "Pending",
        "assigned_to": None,
        "created_at": datetime.utcnow()
    }

    result = task_collection.insert_one(task_data)

    return {
        "message": "Task Created Successfully",
        "task_id": str(result.inserted_id)
    }

@router.get("/tasks")
def get_tasks(current_user=Depends(get_current_user)):
    tasks = list(
        task_collection.find(
            {"owner": current_user["sub"]},
            {"_id": 0}
        )
    )

    return tasks

@router.get("/tasks/search")
def search_tasks(
    keyword: str = Query(...),
    current_user=Depends(get_current_user)
):
    tasks = list(
        task_collection.find(
            {
                "owner": current_user["sub"],
                "title": {
                    "$regex": keyword,
                    "$options": "i"
                }
            },
            {
                "_id": 0
            }
        )
    )

    return tasks

@router.get("/tasks/status/{status}")
def filter_tasks(
    status: str,
    current_user=Depends(get_current_user)
):
    tasks = list(
        task_collection.find(
            {
                "owner": current_user["sub"],
                "status": status
            },
            {
                "_id": 0
            }
        )
    )

    return tasks

@router.put("/tasks/{task_id}")
def update_task(
    task_id: str,
    task: TaskUpdate,
    current_user=Depends(get_current_user)
):

    task_collection.update_one(
        {
            "_id": ObjectId(task_id),
            "owner": current_user["sub"]
        },
        {
            "$set": task.model_dump(exclude_none=True)
        }
    )

    return {
        "message": "Task Updated Successfully"
    }

@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    current_user=Depends(get_current_user)
):

    task_collection.delete_one(
        {
            "_id": ObjectId(task_id),
            "owner": current_user["sub"]
        }
    )

    return {
        "message": "Task Deleted Successfully"
    }

@router.put("/tasks/{task_id}/assign")
def assign_task(
    task_id: str,
    assignment: AssignTask,
    current_user=Depends(get_current_user)
):

    task_collection.update_one(
        {
            "_id": ObjectId(task_id),
            "owner": current_user["sub"]
        },
        {
            "$set": {
                "assigned_to": assignment.assigned_to
            }
        }
    )

    return {
        "message": "Task Assigned Successfully"
    }

@router.put("/tasks/{task_id}/status")
def update_status(
    task_id: str,
    task: TaskStatus,
    current_user=Depends(get_current_user)
):

    task_collection.update_one(
        {
            "_id": ObjectId(task_id),
            "owner": current_user["sub"]
        },
        {
            "$set": {
                "status": task.status
            }
        }
    )

    return {
        "message": "Task Status Updated Successfully"
    }