from fastapi import APIRouter

from app.services.project_service import project_collection
from app.services.task_service import task_collection

from app.ai.gemini_service import ask_gemini

router = APIRouter(
    tags=["AI Daily Summary"]
)


@router.get("/daily-summary")
def daily_summary():

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

Generate a Daily Work Summary.

Include:

1. Overall Progress

2. Completed Tasks

3. Pending Tasks

4. High Priority Items

5. Risks

6. Recommendations

7. What should the team focus on today?

Keep it professional.
"""

    summary = ask_gemini(
        context,
        prompt
    )

    return {
        "daily_summary": summary
    }