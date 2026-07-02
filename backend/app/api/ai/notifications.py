from fastapi import APIRouter

from app.services.project_service import project_collection
from app.services.task_service import task_collection

from app.ai.gemini_service import ask_gemini

router = APIRouter(
    tags=["AI Notifications"]
)


@router.get("/notifications")
def smart_notifications():

    projects = list(
        project_collection.find({}, {"_id": 0})
    )

    tasks = list(
        task_collection.find({}, {"_id": 0})
    )

    context = f"""

Projects:
{projects}

Tasks:
{tasks}

"""

    prompt = """
You are SynapseAI.

Generate smart enterprise notifications.

Analyze the projects and tasks.

Generate notifications like:

• High priority tasks pending

• Tasks with no assignee

• Project nearing completion

• Too many pending tasks

• Team workload imbalance

• Suggested actions

Return 6-10 professional notifications.
"""

    notifications = ask_gemini(
        context,
        prompt
    )

    return {
        "notifications": notifications
    }