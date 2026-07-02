from fastapi import APIRouter

from app.services.task_service import task_collection
from app.ai.gemini_service import ask_gemini

router = APIRouter(
    tags=["AI Reminders"]
)


@router.get("/reminders/pending")
def pending_tasks():

    tasks = list(
        task_collection.find(
            {
                "status": "Pending"
            },
            {
                "_id": 0
            }
        )
    )

    if not tasks:
        return {
            "message": "No pending tasks."
        }

    prompt = f"""
You are SynapseAI.

Generate a professional reminder for the following pending tasks.

Tasks:

{tasks}

For each task include:

- Task
- Assigned To
- Priority
- Why it matters
- Suggested next action

Finish with a motivational message.
"""

    reminder = ask_gemini(
        str(tasks),
        prompt
    )

    return {
        "pending_task_reminder": reminder
    }