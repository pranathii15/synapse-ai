from fastapi import APIRouter

from app.services.task_service import task_collection
from app.ai.gemini_service import ask_gemini

router = APIRouter(
    tags=["AI Tomorrow Planner"]
)


@router.get("/reminders/tomorrow")
def tomorrow_plan():

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
            "message": "No tasks scheduled for tomorrow."
        }

    prompt = f"""
You are SynapseAI.

Generate tomorrow's work plan.

Tasks:

{tasks}

Generate:

1. Tomorrow's Schedule

2. Highest Priority Tasks

3. Suggested Order of Execution

4. Estimated Workload
(Low / Medium / High)

5. Tips for Better Productivity

6. Motivational Closing Message

Keep it professional.
"""

    plan = ask_gemini(
        str(tasks),
        prompt
    )

    return {
        "tomorrow_plan": plan
    }