from datetime import datetime

from fastapi import APIRouter

from app.schemas.meeting_schema import MeetingRequest
from app.ai.meeting_service import generate_meeting_minutes
from app.ai.task_extractor import extract_tasks
from app.services.task_service import task_collection

router = APIRouter(tags=["AI Meeting"])


@router.post("/meeting/minutes")
def meeting_minutes(data: MeetingRequest):

    summary = generate_meeting_minutes(
        data.transcript
    )

    return {
        "meeting_minutes": summary
    }


@router.post("/meeting/tasks")
def create_tasks_from_meeting(data: MeetingRequest):

    tasks = extract_tasks(data.transcript)

    created = []

    for task in tasks:

        document = {
            "title": task["title"],
            "description": task["description"],
            "assigned_to": task["assigned_to"],
            "priority": task["priority"],
            "status": "Pending",
            "owner": "AI Meeting",
            "created_at": datetime.utcnow()
        }

        result = task_collection.insert_one(document)

        created.append({
            "task_id": str(result.inserted_id),
            "title": task["title"],
            "assigned_to": task["assigned_to"],
            "priority": task["priority"]
        })

    return {
        "message": "Tasks created successfully",
        "tasks_created": len(created),
        "tasks": created
    }